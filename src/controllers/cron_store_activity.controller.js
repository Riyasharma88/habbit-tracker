const con = require("../../config/database");
const { status } = require("express/lib/response");

// activities table from mysql database
const activityTable = 'activities';
// Import cron libraries
const cron = require("node-cron");

// function select query dynamically
function activitiesSelect(activityType, status) {
    return `SELECT * FROM ${activityTable} WHERE activity_type=${activityType} AND status=${status} `;
}

// function update query dynamically
function activitiesUpdate(activityType, status) {
    return `UPDATE ${activityTable} SET status=0 WHERE activity_type=${activityType} AND status=${status}`;
}
// dailyActivityStore Dynamically
function dailyActivityStore() {
    //select activity table
    con.query(activitiesSelect(1, 0), (error, result) => {
        if (error) throw error;
        result.forEach(activity => {
            // get Date
            let day = new Date(activity.created_at);
            // fetch date to use in daily-activity
            let date = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
            // Daily_activity
            sql = `INSERT INTO daily_activities(user_id, activity_id, name, status, date) VALUES ('${activity.user_id}','${activity.id}','${activity.name}','${activity.status}','${date}')`;
            con.query(sql, (error) => {
                if (error) throw error;
            })
        })
    });
    //update activity table
    con.query(activitiesUpdate(1, 0), (error, result) => {
        if (error) throw error;
    })
}
//Creating a cron job which runs on status update (complete ---> uncomplete) Daily-activities
cron.schedule("0 0 0 * * 0-6", dailyActivityStore)

// WeeklyActivityStore Dynamically
function weeklyActivityStore() {
    //select activity table
    con.query(activitiesSelect(2, 0), (error, result) => {
        if (error) throw error;
        // Loop for Weekly-activities
        result.forEach(activity => {
            // get Date
            let day = new Date();
            // get Week          
            var weekday = (Math.ceil(new Date().getDate() / 7));
            // get Week_end_date
            var lastEndDate = new Date(day.getTime() - 1 * 24 * 60 * 60 * 1000);
            let lastWeekDate = lastEndDate.getFullYear() + '-' + (lastEndDate.getMonth() + 1) + '-' + lastEndDate.getDate();
            // get week_start_date
            var lastStartDate = new Date(day.getTime() - 7 * 24 * 60 * 60 * 1000);
            let lastWeekStartDate = lastStartDate.getFullYear() + '-' + (lastStartDate.getMonth() + 1) + '-' + lastStartDate.getDate();

            // Weekly_Activity
            sql = `INSERT INTO weekly_activities(user_id, activity_id, name, status, week, week_start_date, week_end_date) VALUES ('${activity.user_id}','${activity.id}','${activity.name}','${activity.status}','${weekday}','${lastWeekStartDate}','${lastWeekDate}')`;
            con.query(sql, (error, result) => {
                if (error) throw error;
            })
        });
        // update activity table
        con.query(activitiesUpdate(2, 0), (error, result) => {
            if (error) throw error;
        })
    })
}
//Creating a cron job which runs on status update (complete ---> uncomplete) Weekly-activities
cron.schedule("0 0 0 * * 1", weeklyActivityStore);

// MonthlyActivityStore Dynamically
function monthlyActivityStore() {
    //select activity table 
    con.query(activitiesSelect(3, 0), (error, result) => {
        if (error) throw error;
        // Loop for Monthly-activities       
        result.forEach(activity => {
            // get Date
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
            sql = `INSERT INTO monthly_activities(user_id, activity_id, name, status, month, month_start_date, month_end_date) VALUES ('${activity.user_id}','${activity.id}','${activity.name}','${activity.status}','${monthday}','${date}','${nextMonthDate}')`;
            con.query(sql, (error) => {
                if (error) throw error;
            })
        });
        // update activity table
        con.query(activitiesUpdate(3, 0), (error, result) => {
            if (error) throw error;
        })
    })
}
//Creating a cron job which runs on status update (complete ---> uncomplete) Monthly-activities
cron.schedule("0 0 0 1 1-12 *", monthlyActivityStore);


