const db = require('../config/config.js');
const mysql = require('mysql2');

exports.inventoryGet = function (req, res, next){
    db.getConnection(function (err, con){
        if (err) {
            return res.status(500).json({
                message: "failed to connect to database"
            })
        }
        const q = `SELECT inventory.*, categories.name AS category 
        FROM inventory 
        LEFT JOIN categories ON inventory.category_id = categories.category_id;`

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

// schema = item_id, name, price, photo, description, quantity, category_id
exports.inventoryPost = function (req, res, next){
    db.getConnection(function (err, con){
        if (err) {
            return res.status(500).json({
                message: "failed to connect to database"
            })
        }

        const values = [null, req.body.name, req.body.price, req.body.photo, req.body.desc, req.body.quant, req.body.catId]

        con.query("INSERT INTO inventory VALUES (?)", [values], function (err, data){
            if (err){
                console.log(err)
                return res.status(400).json({
                    message: "failed to add inventory item"
                })
            }
            console.log(data)
            res.status(200).json(data)
            con.release();
        })
    })
}

exports.inventoryPut = function (req, res, next){
    db.getConnection(function (err, con){
        if (err) {
            return res.status(500).json({
                message: "failed to connect to database"
            })
        }

        const values = {
            name: req.body.name, 
            price: req.body.price, 
            description: req.body.desc, 
            quantity: req.body.quant, 
            category_id: req.body.cat
        }

        const id = req.params.id

        con.query("UPDATE inventory SET ? WHERE item_id = ?", [values, id], function (err, data){
            if (err){
                console.log(err)
                return res.status(400).json({
                    message: "failed to update inventory item"
                })
            }
            console.log(data)
            res.status(200).json(data)
            con.release();
        })
    })
}

exports.inventoryDelete = function (req, res, next){
    db.getConnection(function (err, con){
        if (err) {
            return res.status(500).json({
                message: "failed to connect to database"
            })
        }

        const id = req.params.id

        con.query("DELETE FROM inventory WHERE item_id = ?", [id], function (err, data){
            if (err){
                console.log(err)
                return res.status(400).json({
                    message: "failed to delete inventory item"
                })
            }
            console.log(data)
            res.status(200).json(data)
            con.release();
        })
    })
}