const { status } = require("express/lib/response");
const con = require("../../config/database");
module.exports = {
    activity_insert: async (req, res, next) => {
        try {
            let activity_create = {
                name: req.body.name,
                user_id: req.userid,
                status: 0,
                activity_type: req.body.activity_type
            }
            // Dynamically Data store in Database (INSERT operation) && activity
            var sql = `INSERT INTO activities (name, user_id, status, activity_type) VALUES ('${activity_create.name}','${activity_create.user_id}','${activity_create.status}','${activity_create.activity_type}')`;
            con.query(sql, function (error, result) {
                if (error) throw error;
                return res.json({
                    Message: 'Activity Record Successfully!',
                    Data: 'Activity = ' + activity_create.activity_type
                })
            })
        } catch (error) {
            return error;
        }
    },

    activity_statusupdate: async (req, res, next) => {
        try {
            //update activities table
            var sql = "UPDATE activities SET status='" + req.body.status + "' WHERE id=" + req.params.id;
            con.query(sql, function (error, result) {
                if (error) throw error;

                // select activity table
                var sql = (`SELECT * FROM activities WHERE  id= ${req.params.id}`);   //get id from activity table
                con.query(sql, (error, result) => {
                    if (error) throw error;
                    let show = result[0];
                    // console.log(new Date(show.created_at).getDate());
                    if (show.activity_type == 1) {        // activity_type = Daily
                        // get Date
                        let day = new Date(show.created_at);
                        // fetch date to use in daily-activity
                        let date = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
                        //Daily_activity 
                        sql = `INSERT INTO daily_activities(user_id, activity_id, name, status, date) VALUES ('${show.user_id}','${show.id}','${show.name}','${show.status}','${date}')`;
                    }
                    if (show.activity_type == 2) {        // activity_type = Weekly  
                        let day = new Date();

                           // get Week          
                           var weekday = day.getDay() + 1;

                           if(day.getDay()==0){
                            today=7;
                         }
                            else{
                                today=day.getDay();
                            }
                            // get week_start_date
                        var lastStartDate = new Date(day.getTime() - (today-1) * 24 * 60 * 60 * 1000);
                        let lastWeekStartDate = lastStartDate.getFullYear() + '-' + (lastStartDate.getMonth() + 1) + '-' + lastStartDate.getDate();
                        // get Week_end_date
                        var lastEndDate = new Date(day.getTime() + (7-today) * 24 * 60 * 60 * 1000);
                        let lastWeekDate = lastEndDate.getFullYear() + '-' + (lastEndDate.getMonth() + 1) + '-' + lastEndDate.getDate();
                                 // Insert weekly-activity
                        sql = `INSERT INTO weekly_activities(user_id, activity_id, name, status, week, week_start_date, week_end_date) VALUES ('${show.user_id}','${show.id}','${show.name}','${show.status}','${weekday}','${lastWeekStartDate}','${lastWeekDate}')`;
                    }
                    if (show.activity_type == 3) {       // activity_type = Monthly
                        let day = new Date();
                        // get month
                        let monthday = day.getMonth() + 1;
                        // get month_start_date
                        let date = new Date(day.getFullYear(), day.getMonth(), 1);
                        date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                        // get month_end_date
                        let nextmonthDate = new Date(day.getFullYear(), day.getMonth() + 1, 0);
                        nextMonthDate = nextmonthDate.getFullYear() + '-' + (nextmonthDate.getMonth() + 1) + '-' + nextmonthDate.getDate();

                        // Monthly_Activity
                        sql = `INSERT INTO monthly_activities(user_id, activity_id, name, status, month, month_start_date, month_end_date) VALUES ('${show.user_id}','${show.id}','${show.name}','${show.status}','${monthday}','${date}','${nextMonthDate}')`;

                    }
                    con.query(sql, function (error, result) {
                        if (error) throw error;
                        return res.json({
                            Message: 'Status Updated ',
                            Data: 'Status ' + req.body.status
                        })
                    })

                })
            })

        } catch (error) {
            return error;
        }
    },
    activity_update: async (req, res, next) => {
        try {
            var sql = `"UPDATE activities SET activity_type=" + req.body.activity + " WHERE id=" + req.params.id`;

            Activity = con.query(sql, function (error, result) {
                if (error) throw error;
                return res.json({
                    Message: 'Activity Update ',
                    Data: 'Activity ' + req.body.activity
                })
            })
        } catch (error) {
            return error;
        }
    },
    activity_delete: async (req, res, next) => {
        try {
            var sql = `"UPDATE activities SET soft_delete='1' WHERE id=" + req.params.id`;
            Soft_delete = con.query(sql, function (error, result) {
                if (error) throw error;
                return res.json({
                    Message: 'Deleted Data'
                })
            })
        } catch (error) {
            return error;
        }
    },
    activity_list: async (req, res, next) => {
        try {
            if (req.query.type) {
                sql = `SELECT id, name, status, activity_type FROM activities WHERE user_id='${req.userid}' AND activity_type='${req.query.type}' `;
            } else {
                sql = `SELECT id, name, status, activity_type FROM activities WHERE user_id='${req.userid}' `
            }
            con.query(sql, (error, result) => {

                if (error) throw error;
                return res.json({
                    Message: 'Represent Activity List',
                    Data: result
                })
            })
        } catch (error) {
            return error;
        }
    },

    activity_dailystatuschange: async (req, res, next) => {
        try {
            var sql = (`SELECT * FROM activities WHERE user_id='${req.userid}' AND activity_type=1`);
            con.query(sql, (error, result) => {
                if (error) throw error;
                var date = result[0].updated_at;

                var currentDay = new Date().getDay();
                var updateDay = new Date(date).getDay();

                if (updateDay != currentDay) {
                    con.query(`UPDATE ${activityTable} SET status=0 WHERE user_id='${req.userid}' AND activity_type = 1`, (error, result) => {
                        if (error) throw error;
                        return res.json({
                            Message: 'Status-Type Daily Update'
                        })
                    })
                }
            })

        } catch (error) {
            return error;
        }
    },
}