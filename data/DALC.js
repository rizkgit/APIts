var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rony@mysql2017"
  });
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
module.exports = {
    getAllCategories: function(){

    }
}