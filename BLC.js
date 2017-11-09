var jsonfile = require('jsonfile')
var page_size = 5;
module.exports = {
    

    // --------------------------------------------
    getCategoryProducts: function(API_URL,CATEGORY_ID,PAGE){      
        return new Promise(function(resolve,reject){
            var file = './data/Products.json'
            jsonfile.readFile(file, function(err, obj) {
              
              if (obj != null){
                obj = obj.filter(function(x){return x.CATEGORY_ID == CATEGORY_ID});
              }          
              var toRet = obj.slice((PAGE - 1) * page_size, PAGE * page_size);
              if (toRet != null){
                  toRet.forEach((e)=>{
                      e.IMG_URL = API_URL + '/Images/Products/' + e.IMG_URL;
                  })
              }
             resolve(toRet);
            })
        });
    },
    // --------------------------------------------

    // --------------------------------------------
    test: function(){
        return new Promise(function(resolve,reject){
            resolve(true);
        });
    }
    // --------------------------------------------

}