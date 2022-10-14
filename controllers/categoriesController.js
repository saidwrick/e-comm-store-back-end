const db = require('../config/config.js');
const mysql = require('mysql2');
const { body, validationResult } = require("express-validator");

exports.categoriesGet = function (req, res, next){
    db.getConnection(function (err, con){
        if (err) {
            return res.status(500).json("failed to connect to database")
        }
        const q = `SELECT * FROM categories ORDER BY name`

        con.query(q, function (err, data){
            if (err){
                return res.status(500).json("failed to retrieve inventory")
            }
            console.log(data)
            res.status(200).json(data)
            con.release();
        })
    })
}

exports.categoriesPost = [
    body('name', 'name required').trim().isLength({ min: 1, max: 255 }).withMessage("name must be between 1 and 255 chars").escape(),
    (req, res, next) => {
    
        const errors = validationResult(req);
        
        if (!errors.isEmpty()){
            const errorArray = errors.array();
            let errorString = ""

            if (errorArray.length == 1){
                errorString = errorArray[0].msg
            }
            else {
                const errorString = errors.array().reduce((prev, cur) => {
                    return (prev.msg || prev) + '\r\n' + cur.msg
                })
            }
            return res.status(400).json(errorString)
        }

        else {
            db.getConnection(function (err, con){
                if (err) {
                    return res.status(500).json("failed to connect to database")
                }

                const values = [null, req.body.name]

                con.query("INSERT INTO categories VALUES (?)", [values], function (err, data){
                    if (err){
                        console.log(err)
                        if (err.errno == 1062){
                            return res.status(409).json("category name already exists")
                        }
                        else {
                            return res.status(500).json("failed to connect to create category")
                        }
                    }
                    console.log(data)
                    res.status(200).json(data)
                    con.release();
                })
            })
        }
    }
]

exports.categoriesPut = [
    body('name', 'name required').trim().isLength({ min: 1, max: 255 }).withMessage("name must be between 1 and 255 chars").escape(),
    (req, res, next) => {
    
        const errors = validationResult(req);
        
        if (!errors.isEmpty()){
            const errorArray = errors.array();
            let errorString = ""

            if (errorArray.length == 1){
                errorString = errorArray[0].msg
            }
            else {
                const errorString = errors.array().reduce((prev, cur) => {
                    return (prev.msg || prev) + '\r\n' + cur.msg
                })
            }
            return res.status(400).json(errorString)
        }
        else {
            db.getConnection(function (err, con){
                if (err) {
                    return res.status(500).json("failed to connect to database")
                }
        
                const values = {
                    name : req.body.name
                }
                const id = req.params.id
        
                con.query("UPDATE categories SET ? WHERE category_id = ?", [values, id], function (err, data){
                    if (err){
                        console.log(err)
                        if (err.errno == 1062){
                            return res.status(409).json("category name already exists")
                        }
                        return res.status(500).json("failed to update category")
                    }
                    console.log(data)
                    res.status(200).json(data)
                    con.release();
                })
            })
        }
    }
]

exports.categoriesDelete = function (req, res, next){
    db.getConnection(function (err, con){
        if (err) {
            return res.status(500).json("failed to connect to database")
        }

        const id = req.params.id

        con.query("DELETE FROM categories WHERE category_id=(?)", [id], function (err, data){
            if (err){
                console.log(err)
                if (err.errno == 1451){
                    return res.status(409).json("items still using this category")
                }
                else{
                    return res.status(500).json("failed to delete category")
                }
            }
            console.log(data)
            res.status(200).json(data)
            con.release();
        })
    })
}