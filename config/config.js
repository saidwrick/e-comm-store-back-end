const mysql = require('mysql2');

const db = mysql.createPool({
    host: "localhost",
    user: "test",
    password: "password",
    database: "store"
});

module.exports = db;

// db.connect(function(err){
//     if (err){ 
//         throw err;
//     }
//     console.log("Connected!");
// });

// db.query("select * from categories", function (err, res){
//     if (err){
//         throw err;
//     }
//     console.log(res);
// })