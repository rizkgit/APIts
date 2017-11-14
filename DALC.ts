// ---------------------
import { Category } from './BLC_Entities';
import * as mysql from 'mysql';
import * as jsonfile from 'jsonfile';
// ---------------------

// ---------------------

// ---------------------
export class DALC
{
    con;
    constructor(){    
        this.con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "rony@mysql2017",
            database:'AppCommerce'
        });        
        this.con.connect();
    }

    InitializeDB(){
        
        this.con.query('DROP DATABASE IF EXISTS AppCommerce;',(err,result)=>{
            this.con.query('CREATE DATABASE AppCommerce',(err,result)=>{
                this.con.query('use AppCommerce',(err,result)=>{
                    this.con.query('create table TBL_CATEGORY (GATEGORY_ID INT AUTO_INCREMENT PRIMARY KEY, PARENT_ID INT , TITLE TEXT, DESCRIPTION TEXT, ICON TEXT)',(err,result)=>{
                        var file = './data/Categories.json'
                        jsonfile.readFile(file, (err, obj) => {
                            if (obj != null){
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
                                        `,
                                        [element.PARENT_ID,element.TITLE,element.DESCRIPTION,element.ICON],
                                        (err,result)=>{
                                        console.log(err);
                                    });
                                });
                            }
                        })
                    })  
                });
            })
        });
    }

    Edit_Category(cat: Category){
        console.log(JSON.stringify(cat));
    }

    getAllCategories(): Promise<any> {        
          return new Promise((resolve, reject) => {                      
              this.con.query("SELECT * FROM TBL_CATEGORY", function (err, result) {                  
                if (err) {reject(err);}
                  resolve(result);              
              });              
          });
      }

      getRootCategories(): Promise<any>{
          return new Promise((resolve,reject)=>{
              this.con.query('SELECT * FROM TBL_CATEGORY',(err,result)=>{
                if (err)  {
                    console.log(err);
                    reject(err);
                }
                resolve(result);
              })
          });
      }
}
// ---------------------
