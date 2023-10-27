const db = require('../config/config.js');
const { body, validationResult } = require("express-validator");
const sql = require('yesql').pg

exports.inventoryGet = function (req, res, next){
    db.connect(function (err, con, done) {
        if (err) {
            return res.status(500).json("failed to connect to database")
        }

        let q = `SELECT inventory.*, count(*) OVER() AS full_count, categories.name AS category
        FROM inventory 
        LEFT JOIN categories ON inventory.category_id = categories.category_id `;
        
        let filters = [];

        if (req.query.category){
            filters.push(`inventory.category_id = ${req.query.category}`)
        }

        // price filter logic:
            // if (req.get(price)){
            //     filters.push(`inventory.price >= ${req.body.price[0]} AND inventory.price <= ${req.body.price[1]} `)
            // }

        if (req.query.search){
            filters.push(`inventory.name ILIKE '%${req.query.search}%'`)
        }

        if (filters.length > 0){
            let where = filters.join(" AND ");
            q += `WHERE ${where} `;
        }

        console.log(req.query.order)

        switch (req.query.order){
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
                q += `ORDER BY inventory.item_id DESC `
                break;
        }

        q += `LIMIT 10 `;

        if (req.query.offset > 0){
            q += `OFFSET ${req.query.offset}`;
        }

        con.query(q, function (err, data){
            if (err){
                console.log('hereasdf')
                return res.status(404).json("failed to retrieve inventory")
            }
            console.log(data)
            
            let fullCount = 0
            if (data.rows.length > 0){
                fullCount = data.rows[0].full_count
            }

            let result = {
                "inventory" : data.rows,
                "count" : fullCount
            }
            res.status(200).json(result)
            con.release();
        })
    })
}


exports.inventoryItemGet = function (req, res, next){
    db.connect(function (err, con){
        if (err) {
            return res.status(500).json("failed to connect to database")
        }

        const id = req.params.id

        const q = `SELECT inventory.*, categories.name AS category 
        FROM inventory
        LEFT JOIN categories ON inventory.category_id = categories.category_id
        WHERE inventory.item_id = $1;`

        con.query(q, [id], function (err, data){
            if (err || data.length <= 0){
                console.log(err);
                return res.status(404).json("failed to retrieve item")
            }
            console.log(data)
            res.status(200).json(data.rows)
            con.release();
        })
    })
}

// schema = item_id, name, price, image, description, quantity, category_id
exports.inventoryPost = [
    body('name', 'name required').trim().isLength({ min: 1, max: 250 }).withMessage("name must be between 1 and 250 chars"),
    body('price', 'price required').trim().isFloat({min: 0.01}).withMessage("price must be greater than 0.01"),
    body('imgUrl', 'image required').trim().isLength({ min: 1 }),
    body('desc', 'description required').trim().isLength({ min: 1, max:1000 }).withMessage("description must be between 1 and 1000 chars"),
    body('quant', 'quantity required').trim().isInt().withMessage("quantity must be a whole number"),
    body('catId', 'category required').trim().isLength({ min: 1 }),
    (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()){
            const errorArray = errors.array();
            let errorString = ""

            if (errorArray.length == 1){
                errorString = errorArray[0].msg
            }
            else {
                errorString = errors.array().reduce((prev, cur) => {
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

                const values = [req.body.name, req.body.price, req.body.imgUrl, req.body.desc, req.body.quant, req.body.catId]

                con.query(`INSERT INTO inventory (name, price, image, description, quantity, category_id) 
                    VALUES ($1,$2,$3,$4,$5,$6) `, values, function (err, data){
                    if (err){
                        console.log(err)
                        return res.status(400).json("failed to add inventory item")
                    }
                    console.log(data)
                    res.status(200).json(data.rows)
                    con.release();
                })
            })
        }
    }
]

exports.inventoryPut = [
    body('name', 'name required').trim().isLength({ min: 1, max: 250 }).withMessage("name must be between 1 and 250 chars").exists(),
    body('price', 'price required').trim().isFloat({min: 0.01}).withMessage("price must be greater than 0.01"),
    body('imgUrl', 'image required').trim().isLength({ min: 1 }),
    body('desc', 'description required').trim().isLength({ min: 1, max:1000 }).withMessage("description must be between 1 and 1000 chars"),
    body('quant', 'quantity required').trim().isInt().withMessage("quantity must be a whole number"),
    body('catId', 'category required').trim().isLength({ min: 1 }),
    (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()){
            const errorArray = errors.array();
            let errorString = ""

            if (errorArray.length == 1){
                errorString = errorArray[0].msg
            }
            else {
                errorString = errors.array().reduce((prev, cur) => {
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

                const valueas = {
                    name: req.body.name, 
                    price: req.body.price, 
                    image: req.body.imgUrl,
                    description: req.body.desc, 
                    quantity: req.body.quant, 
                    category_id: req.body.catId
                }

                const values = [
                    req.body.name, 
                    req.body.price, 
                    req.body.imgUrl,
                    req.body.desc, 
                    req.body.quant, 
                    req.body.catId,
                    req.params.id
                ]

                const id = req.params.id

                con.query(`UPDATE inventory SET 
                            name = $1, 
                            price = $2, 
                            image = $3, 
                            description = $4,
                            quantity = $5,
                            category_id = $6 
                        WHERE item_id = $7`, 
                    values, function (err, data){
                    if (err){
                        console.log(err)
                        return res.status(400).json("failed to update inventory item")
                    }
                    console.log(data)
                    res.status(200).json(data.rows)
                    con.release();
                })
            })
        }
    }
]

exports.inventoryDelete = function (req, res, next){
    db.connect(function (err, con){
        if (err) {
            return res.status(500).json("failed to connect to database")
        }

        const id = req.params.id

        con.query("DELETE FROM inventory WHERE item_id = $1", [id], function (err, data){
            if (err){
                console.log(err)
                return res.status(400).json("failed to delete inventory item")
            }
            console.log(data)
            res.status(200).json(data.rows)
            con.release();
        })
    })
}