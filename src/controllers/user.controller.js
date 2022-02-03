const con = require("../../config/database");
const generateAccessToken = require("../middleware/auth.middelware").generateAccessToken;
module.exports = {
    login: async (req, res, next) => {
        try {
            // console.log(req.body);
            // Data Show Dynamically 
            let data = {
                phone_number: req.body.phone_number,
                otp: Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
            }
            // Dynamically Validation
            let value = req.body.phone_number;
            //phone-number validation (number in between 9-16)
            if (req.body.phone_number == "null" || req.body.phone_number == "" || 9 >= req.body.phone_number.length || req.body.phone_number.length >= 16) {
                return res.json({
                    ErrorMessage: 'Invalid Phone-Number'
                });
            }
            // select operation(check if Phone-number exit or not)

            con.query("SELECT * FROM user WHERE phone_number=" + req.body.phone_number, (error, result) => {
                if (error) throw error;
                if (Object.keys(result).length !== 0) {
                    // update otp when Phone-number valid
                    var sql = `UPDATE user SET otp=${data.otp} WHERE phone_number=` + req.body.phone_number;

                    con.query(sql, function (error, result) {
                        if (error) throw error;
                        return res.json({
                            Message: 'Your OTP is ' + (data.otp)
                        })
                    })

                } else {
                    // Dynamically Data store in Database (INSERT operation)
                    var sql = `INSERT INTO user (phone_number, otp) VALUES ('${data.phone_number}','${data.otp}')`;
                    con.query(sql, function (error, result) {
                        if (error) throw error;
                        return res.json({
                            Message: 'Your OTP is ' + (data.otp)
                        })
                    })

                }
            })
        } catch (error) {
            return error;
        }
    },

    otp_verification: async (req, res, next) => {
        try {
            con.query("select * from user WHERE phone_number=" + req.body.phone_number, (error, result) => {
                if (error) throw error;
                // console.log(result);
                if (Object.keys(result).length !== 0) {
                    // console.log(result, req.body.otp);
                    if (result[0].otp == req.body.otp) {
                        id = result[0].id;
                        // if user login successfully then remove otp from database
                        con.query(`UPDATE user SET otp=null WHERE id= ${result[0].id}`, (error, result) => {
                            if (error) throw error;
                            return res.json({
                                //Generate Token and access it 
                                Message: 'OTP verified Successfully',
                                token: generateAccessToken(id)
                            })
                        });

                    } else {
                        return res.json({
                            ErrorMessage: 'Invalid OTP token',
                            token: ""
                        })
                    }
                } else {
                    return res.json({
                        ErrorMessage: 'Invalid Phone-Number, Please fill out correct Phone-Number ' + req.body.phone_number
                    })
                }
            })
        } catch (error) {
            return error;
        }
    },

    user_profile: async (req, res, next) => {
        try {
            // console.log(req.userid);
            let profile = {
                name: req.body.name,
                dob: req.body.dob,
                image: req.body.image
            }
            // Update User-Profile   
            var sql = `UPDATE user SET name = "${profile.name}" , dob="${profile.dob}" , image="${profile.image}" WHERE id=${req.userid} `;

            con.query(sql, function (error, result) {
                if (error) throw error;
                return res.json({
                    Message: 'Profile Created Successfully',
                    Data: profile
                })
            })
        } catch (error) {
            return error;
        }
    },
}