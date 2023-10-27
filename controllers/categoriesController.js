const db = require('../config/config.js');
const { body, validationResult } = require("express-validator");

exports.categoriesGet = function (req, res, next){
    db.connect(function (err, con, done) {
        if (err) {
            return res.status(500).json("failed to connect to database")
        }
    
        const q = `SELECT * FROM categories ORDER BY name`

        con.query(q, function (err, data){
            if (err){
                return res.status(500).json("failed to retrieve inventory")
            }
            console.log(data)
            res.status(200).json(data.rows)
            con.release();
        })
    })
}

exports.categoriesPost = [
    body('name', 'name required').trim().isLength({ min: 1, max: 255 }).withMessage("name must be between 1 and 255 chars"),
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
            db.connect(function (err, con){
                if (err) {
                    return res.status(500).json("failed to connect to database")
                }

                con.query("INSERT INTO categories (name) VALUES ($1)", [req.body.name], function (err, data){
                    if (err){
                        console.log(err)
                        if (err.code == 23505){
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
    body('name', 'name required').trim().isLength({ min: 1, max: 255 }).withMessage("name must be between 1 and 255 chars"),
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
            db.connect(function (err, con){
                if (err) {
                    return res.status(500).json("failed to connect to database")
                }

                const id = req.params.id
        
                con.query("UPDATE categories SET name = $1 WHERE category_id = $2", [req.body.name, id], function (err, data){
                    if (err){
                        console.log(err)
                        if (err.code == 23505){
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
    db.connect(function (err, con){
        if (err) {
            return res.status(500).json("failed to connect to database")
        }

        const id = req.params.id

        con.query("DELETE FROM categories WHERE category_id= $1", [id], function (err, data){
            if (err){
                console.log(err)
                if (err.code == 23503){
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