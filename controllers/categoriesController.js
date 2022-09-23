const db = require('../config/config.js');
const mysql = require('mysql2');

exports.categoriesGet = function (req, res, next){
    db.getConnection(function (err, con){
        if (err) {
            return res.status(500).json({
                message: "failed to connect to database"
            })
        }
        const q = `SELECT * FROM categories ORDER BY name`

        con.query(q, function (err, data){
            if (err){
                return res.status(500).json({
                    message: "failed to retrieve inventory"
                })
            }
            console.log(data)
            res.status(200).json(data)
            con.release();
        })
    })
}

exports.categoriesPost = function (req, res, next){
    db.getConnection(function (err, con){
        if (err) {
            return res.status(500).json({
                message: "failed to connect to database"
            })
        }

        const values = [null, req.body.name]

        con.query("INSERT INTO categories VALUES (?)", [values], function (err, data){
            if (err){
                console.log(err)
                return res.status(400).json({
                    message: "failed to add category"
                })
            }
            console.log(data)
            res.status(200).json(data)
            con.release();
        })
    })
}


exports.categoriesPut = function (req, res, next){
    db.getConnection(function (err, con){
        if (err) {
            return res.status(500).json({
                message: "failed to connect to database"
            })
        }

        const values = {
            name : req.body.name
        }
        const id = req.params.id

        con.query("UPDATE categories SET ? WHERE category_id = ?", [values, id], function (err, data){
            if (err){
                console.log(err)
                return res.status(400).json({
                    message: "failed to update category"
                })
            }
            console.log(data)
            res.status(200).json(data)
            con.release();
        })
    })
}

exports.categoriesDelete = function (req, res, next){
    db.getConnection(function (err, con){
        if (err) {
            return res.status(500).json({
                message: "failed to connect to database"
            })
        }

        const id = req.params.id

        con.query("DELETE FROM categories WHERE category_id=(?)", [id], function (err, data){
            if (err){
                console.log(err)
                if (err.errno == 1451){
                    return res.status(409).json({
                        message: "items still using this category"
                    })
                }
                else{
                    return res.status(400).json({
                        message: "failed to add category"
                    })
                }
            }
            console.log(data)
            res.status(200).json(data)
            con.release();
        })
    })
}