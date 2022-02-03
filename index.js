//MySql connection
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
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
var routes = require('./src/routes/index.router');
const { download } = require('express/lib/response');
const { arrayBuffer } = require('stream/consumers');
require('./src/controllers/cron_store_activity.controller');


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use('/', routes)

// Start the server on port 8000
var server = app.listen(3002, function () {
    var host = "http://qualhon.net";
    var port = server.address().port
    console.log(`Example app listening at `, host, port)
})