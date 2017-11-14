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
        this.con.query('DROP DATABASE IF EXISTS AppCommerce;', (err, result) => {
            this.con.query('CREATE DATABASE AppCommerce', (err, result) => {
                this.con.query('use AppCommerce', (err, result) => {
                    this.con.query('create table TBL_CATEGORY (GATEGORY_ID INT AUTO_INCREMENT PRIMARY KEY, PARENT_ID INT , TITLE TEXT, DESCRIPTION TEXT, ICON TEXT)', (err, result) => {
                        var file = './data/Categories.json';
                        jsonfile.readFile(file, (err, obj) => {
                            if (obj != null) {
                                obj.forEach(element => {
                                    console.log(element);
                                    this.con.query(`INSERT INTO appcommerce.tbl_category
                                        (
                                            PARENT_ID,TITLE,DESCRIPTION,ICON
                                        )
                                        VALUES
                                        (
                                            ?,?,?,?
                                        )
                                        `, [element.PARENT_ID, element.TITLE, element.DESCRIPTION, element.ICON], (err, result) => {
                                        console.log(err);
                                    });
                                });
                            }
                        });
                    });
                });
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
            this.con.query('SELECT * FROM TBL_CATEGORY', (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    }
}
exports.DALC = DALC;
// ---------------------
