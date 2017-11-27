"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const jsonfile = require("jsonfile");
const timers_1 = require("timers");
// ---------------------
// ---------------------
// ---------------------
class DALC {
    constructor() {
        this.handleConnection();
    }
    handleConnection() {
        this.con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "rony1234",
            database: 'AppCommerce'
        });
        this.con.connect((err) => {
            if (err) {
                console.log('error when connecting to db:', err);
                timers_1.setTimeout(this.handleConnection, 2000);
            }
        });
        this.con.on('error', function (err) {
            console.log('db error', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                this.handleConnection();
            }
            else {
                throw err;
            }
        });
    }
    InitializeDB() {
        this
            .DropAndCreateDB()
            .then((passed) => this.useDB())
            .then((passed) => this.InitilizeCategories())
            .then((passed) => this.InitilizeProducts())
            .then((passed) => this.InitilizeProductImages())
            .then((passed) => this.InitilizeReviews());
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
                                    console.error(err);
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
                                    console.error(err);
                                }
                            });
                        });
                    }
                    resolve(true);
                });
            });
        });
    }
    InitilizeProductImages() {
        return new Promise((resolve, reject) => {
            this.con.query('create table TBL_PRODUCT_IMAGE (PRODUCT_IMAGE_ID INT AUTO_INCREMENT PRIMARY KEY,PRODUCT_ID INT, IMG_URL TEXT)', (err, result) => {
                var file = './data/ProductImages.json';
                jsonfile.readFile(file, (err, obj) => {
                    if (obj != null) {
                        obj.forEach(element => {
                            //console.log(element);
                            this.con.query(`INSERT INTO appcommerce.TBL_PRODUCT_IMAGE
                                (
                                    PRODUCT_ID,IMG_URL
                                )
                                VALUES
                                (
                                    ?,?
                                )
                                `, [element.ID, element.IMG_URL], (err, result) => {
                                if (err != null) {
                                    console.error(err);
                                }
                            });
                        });
                    }
                    resolve(true);
                });
            });
        });
    }
    InitilizeReviews() {
        return new Promise((resolve, reject) => {
            this.con.query('create table TBL_REVIEW (REVIEW_ID INT AUTO_INCREMENT PRIMARY KEY,PRODUCT_ID INT, REVIEWER TEXT,MSG TEXT, RATING INT)', (err, result) => {
                var file = './data/Reviews.json';
                jsonfile.readFile(file, (err, obj) => {
                    if (obj != null) {
                        obj.forEach(element => {
                            //console.log(element);
                            this.con.query(`INSERT INTO appcommerce.TBL_REVIEW
                                (
                                    PRODUCT_ID,REVIEWER,MSG,RATING
                                )
                                VALUES
                                (
                                    ?,?,?,?
                                )
                                `, [element.ID, element.REVIEWER, element.MSG, element.RATING], (err, result) => {
                                if (err != null) {
                                    console.error(err);
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
                if (err) {
                    console.error(err);
                    reject(err);
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
                    console.error(err);
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
                    console.error(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    }
    getProduct(PRODUCT_ID) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT * FROM TBL_PRODUCT WHERE PRODUCT_ID = ?', [PRODUCT_ID], (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    }
    getProducts(page_number, page_size) {
        return new Promise((resolve, reject) => {
            var start_row = (page_number - 1) * page_size;
            this.con.query('SELECT * FROM TBL_PRODUCT LIMIT ?,?', [start_row, page_size], (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    }
    getProductImages(PRODUCT_ID) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT * FROM TBL_PRODUCT_IMAGE WHERE PRODUCT_ID= ?', [PRODUCT_ID], (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    }
    getCategoryProducts(CATEGORY_ID, page_number, page_size) {
        return new Promise((resolve, reject) => {
            var start_row = (page_number - 1) * page_size;
            this.con.query('SELECT * FROM TBL_PRODUCT WHERE CATEGORY_ID = ? LIMIT ?,5', [CATEGORY_ID, start_row], (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    }
    getProductReviews(PRODUCT_ID) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT * FROM TBL_REVIEW WHERE PRODUCT_ID = ?', [PRODUCT_ID], (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    }
    Edit_Person(p) {
        return new Promise((resolve, reject) => {
            this.con.query('INSERT INTO TBL_PERSON (FIRST_NAME,LAST_NAME) VALUES (?,?)', [p.FIRST_NAME, p.LAST_NAME], (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    }
}
exports.DALC = DALC;
// ---------------------
