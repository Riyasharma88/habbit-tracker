const con = require("../../config/database");
const { status } = require("express/lib/response");
module.exports = {
    scores_create: async (req, res, next) => {
        try {
            const total_score = 30;
           const score={
                daily_score:'',
                weekly_score:'',
                monthly_score:''
            }
            
            // Daily_Select_activities
            var sql = `SELECT * FROM daily_activities WHERE user_id='${req.userid}' AND status=1`;
            con.query(sql, (error, result) => {
                if (error) throw error;
                // Daily_Scores
                let daily_score_count = result.length * 1;
                 score.daily_score = daily_score_count + '/' + total_score;
             
            })
        
            // Weekly_select_activities
            var sql = `SELECT * FROM weekly_activities WHERE user_id='${req.userid}' AND status=1`;
            con.query(sql, (error, result) => {
                if (error) throw error;
                // Weekly_Scores
                let week_score_count = result.length * 8;
                score.weekly_score = week_score_count + '/' + total_score;
              
            })

            // Monthly_select_activities
            var sql = `SELECT * FROM monthly_activities WHERE user_id='${req.userid}' AND status=1`;
            con.query(sql, (error, result) => {
                if (error) throw error;
                // Monthly_Scores
                let month_score_count = result.length * 30;
                score.monthly_score = month_score_count + '/' + total_score;
                return res.json({
                    message: 'Record Successfully!',
                    score:score
                })
            })  
          
        } catch (error) {
            return error;
        }
    },
}

