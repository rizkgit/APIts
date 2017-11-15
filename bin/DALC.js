"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const jsonfile = require("jsonfile");
// ---------------------
// ---------------------
// ---------------------
class DALC {
    constructor() {
        this.con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "rony@mysql2017",
            database: 'AppCommerce'
        });
        this.con.connect();
    }
    InitializeDB() {
        this
            .DropAndCreateDB()
            .then((passed) => this.useDB())
            .then((passed) => this.InitilizeCategories())
            .then((passed) => this.InitilizeProducts());
    }
    DropAndCreateDB() {
        return new Promise((resolve, reject) => {
            this.con.query('DROP DATABASE IF EXISTS AppCommerce;', (err, result) => {
                this.con.query('CREATE DATABASE AppCommerce', (err, result) => {
                    resolve(true);
                });
            });
        });
    }
    useDB() {
        return new Promise((resolve, reject) => {
            this.con.query('use AppCommerce;', (err, result) => {
                resolve(true);
            });
        });
    }
    InitilizeCategories() {
        return new Promise((resolve, reject) => {
            this.con.query('create table TBL_CATEGORY (CATEGORY_ID INT AUTO_INCREMENT PRIMARY KEY, PARENT_ID INT , TITLE TEXT, DESCRIPTION TEXT, ICON TEXT)', (err, result) => {
                var file = './data/Categories.json';
                jsonfile.readFile(file, (err, obj) => {
                    if (obj != null) {
                        obj.forEach(element => {
                            //console.log(element);
                            this.con.query(`INSERT INTO appcommerce.tbl_category
                                (
                                    PARENT_ID,TITLE,DESCRIPTION,ICON
                                )
                                VALUES
                                (
                                    ?,?,?,?
                                )
                                `, [element.PARENT_ID, element.TITLE, element.DESCRIPTION, element.ICON], (err, result) => {
                                if (err != null) {
                                    console.log(err);
                                }
                            });
                        });
                    }
                    resolve(true);
                });
            });
        });
    }
    InitilizeProducts() {
        return new Promise((resolve, reject) => {
            this.con.query('create table TBL_PRODUCT (PRODUCT_ID INT AUTO_INCREMENT PRIMARY KEY, IMG_URL TEXT , TITLE TEXT, DESCRIPTION TEXT, CATEGORY_ID INT,IS_FEATURED BIT,PRICE decimal(10,3))', (err, result) => {
                var file = './data/Products.json';
                jsonfile.readFile(file, (err, obj) => {
                    if (obj != null) {
                        obj.forEach(element => {
                            //console.log(element);
                            this.con.query(`INSERT INTO appcommerce.TBL_PRODUCT
                                (
                                    IMG_URL,TITLE,DESCRIPTION,CATEGORY_ID,IS_FEATURED,PRICE
                                )
                                VALUES
                                (
                                    ?,?,?,?,?,?
                                )
                                `, [element.IMG_URL, element.TITLE, element.DESCRIPTION, element.CATEGORY_ID, element.IS_FEATURED, element.PRICE], (err, result) => {
                                if (err != null) {
                                    console.log(err);
                                }
                            });
                        });
                    }
                    resolve(true);
                });
            });
        });
    }
    getFeaturedProducts() {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT * FROM TBL_PRODUCT WHERE IS_FEATURED= 1', (err, result) => {
                if (err != null) {
                    console.log(err);
                }
                resolve(result);
            });
        });
    }
    Edit_Category(cat) {
        console.log(JSON.stringify(cat));
    }
    getAllCategories() {
        return new Promise((resolve, reject) => {
            this.con.query("SELECT * FROM TBL_CATEGORY", function (err, result) {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    }
    getRootCategories() {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT * FROM TBL_CATEGORY WHERE PARENT_ID = 0', (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    }
    getProduct(PRODUCT_ID) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT * FROM TBL_PRODUCT WHERE PRODUCT_ID = ?', [PRODUCT_ID], (err, result) => {
                resolve(result);
            });
        });
    }
    getProducts(page_number, page_size) {
        return new Promise((resolve, reject) => {
            var start_row = (page_number - 1) * page_size;
            this.con.query('SELECT * FROM TBL_PRODUCT LIMIT ?,?', [start_row, page_size], (err, result) => {
                console.log(result.length);
                resolve(result);
            });
        });
    }
}
exports.DALC = DALC;
// ---------------------
