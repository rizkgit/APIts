// ---------------------
import { Category } from './BLC_Entities';
import * as mysql from 'mysql';
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
            database: "AppCommerce"
        });        
        this.con.connect();
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
}
// ---------------------
