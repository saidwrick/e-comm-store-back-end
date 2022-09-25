const db = require('../config/config.js');
const mysql = require('mysql2');

exports.inventoryGet = function (req, res, next){
    db.getConnection(function (err, con){
        if (err) {
            return res.status(500).json({
                message: "failed to connect to database"
            })
        }

        let q = `SELECT inventory.*, categories.name AS category 
        FROM inventory 
        LEFT JOIN categories ON inventory.category_id = categories.category_id `;
        
        let filters = [];

        if (req.headers.offset){
            filters.push(`inventory.item_id > ${req.headers.offset}`)
        }

        if (req.headers.category){
            filters.push(`inventory.category_id = ${req.headers.category}`)
        }

        // if (req.get(price)){
        //     filters.push(`inventory.price >= ${req.body.price[0]} AND inventory.price <= ${req.body.price[1]} `)
        // }

        if (req.headers.search){
            filters.push(`inventory.name LIKE '%${req.headers.search}%'`)
        }

        if (filters.length > 0){
            let where = filters.join(" AND ");
            q += `WHERE ${where} `;
        }

        console.log(req.headers.order)

        switch (req.headers.order){
            case "priceAsc":
                q += `ORDER BY inventory.price ASC `
                break;
            case "priceDesc":
                q += `ORDER BY inventory.price DESC `
                break;
            case "alphaAsc":
                q += `ORDER BY inventory.name ASC `
                break;
            case "alphaDesc":
                q += `ORDER BY inventory.name DESC `
                break;
            case "dateAsc":
                q += `ORDER BY inventory.item_id ASC `
                break;
            case "dateDesc":
                q += `ORDER BY inventory.item_id DESC `
                break;
            default:
                break;
        }
        
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

exports.inventoryItemGet = function (req, res, next){
    db.getConnection(function (err, con){
        if (err) {
            return res.status(500).json({
                message: "failed to connect to database"
            })
        }

        const id = req.params.id

        const q = `SELECT inventory.*, categories.name AS category 
        FROM inventory
        LEFT JOIN categories ON inventory.category_id = categories.category_id
        WHERE inventory.item_id = (?);`

        con.query(q, [id], function (err, data){
            if (err){
                console.log(err);
                return res.status(500).json({
                    message: "failed to retrieve item"
                })
            }
            console.log(data)
            res.status(200).json(data)
            con.release();
        })
    })
}

// schema = item_id, name, price, image, description, quantity, category_id
exports.inventoryPost = function (req, res, next){
    db.getConnection(function (err, con){
        if (err) {
            return res.status(500).json({
                message: "failed to connect to database"
            })
        }

        const values = [null, req.body.name, req.body.price, req.body.imgUrl, req.body.desc, req.body.quant, req.body.catId]

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
            image: req.body.image,
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