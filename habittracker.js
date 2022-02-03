//MySql connection
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "10.10.0.20",
    user: "user211102",
    password: "Emp$211102usr",
    database: "user211102_habittracker"
});
con.connect(function (error) {
    if (error) throw error;
    console.log("connected");
});

// Request and Response to Server
const express = require('express');
const { Server } = require('http');
const app = express();
const bodyParser = require("body-parser");
const { response } = require('express');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


// Phone Number Track (POST function call)
app.post('/create', function (req, res) {
    console.log(req.body);
    // Data Show Dynamically 
    let data = {
        phone_number: req.body.phone_number,
        otp: Math.floor(Math.random() * 10000)
    }
    // Dynamically Validation
    let value = req.body.phone_number;
    //phone-number validation
    if (req.body.phone_number == "null" || req.body.phone_number == "" || 9 >= req.body.phone_number.length ||req.body.phone_number.length >= 16) {
        return res.json({
            ErrorMessage: 'Invalid Phone-Number'
        });
    }
    // Dynamically Data store in Database (INSERT operation)
    var sql = `INSERT INTO phonetrack( phone_number, otp) VALUES ('${data.phone_number}','${data.otp}')`;
    console.log(con, data);
    con.query(sql, function (error, result) {
        if (error) throw error;
        return res.json({
            Message: 'Your OTP is ' + (data.otp)
        })
    })
})

// OTP (POST function call)
app.get('/otp-verification', function (req, res){
    con.query("select * from phonetrack WHERE otp="+ req.body.otp  ,(error, result) => {
        if (error) throw error;  
        return res.json({
              Message: 'Invalid Request, Please fill out correct Phone-Number ' + req.body.phone_number
        })
    })  
});



// Start the server on port 8000
var server = app.listen(8000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://10.10.0.20", host, port)
})