"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
// ---------------------
// ---------------------
// ---------------------
class DALC {
    constructor() {
        this.con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "rony@mysql2017",
            database: "AppCommerce"
        });
        this.con.connect();
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
}
exports.DALC = DALC;
// ---------------------
