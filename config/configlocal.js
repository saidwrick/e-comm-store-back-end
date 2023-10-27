const mysql = require('mysql2');

const db = mysql.createPool({
    host: "localhost",
    user: "test",
    password: "password",
    database: "store2"
});

module.exports = db;
