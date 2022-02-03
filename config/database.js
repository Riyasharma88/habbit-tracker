const { createPool } = require("mysql");


// Init environment 
// dotenv.config();
// const configs = process.env.ENV == "PROD" ? config.production : (process.env.ENV == 'DEV' ? config.development : config.local);

const pool = createPool({
    // host: "103.99.202.91",
    host:"10.10.0.20",
    user: "user211102",
    password: "Emp$211102usr",
    database: "user211102_habittracker",
    connectionLimit: 10,
    multipleStatements: true,
    charset: 'utf8mb4'
});


module.exports = pool;
