const mysql = require('mysql2');

const db = mysql.createPool({
    host: "localhost",
    user: "test",
    password: "password",
    database: "store"
});

module.exports = db;
