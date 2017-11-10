var jsonfile = require('jsonfile')
var page_size = 5;
module.exports = {

    // --------------------------------------------
    getProduct: function (API_URL, PRODUCT_ID) {
        return new Promise(function (resolve, reject) {
            var file = './data/Products.json'
            jsonfile.readFile(file, function (err, obj) {
                
                if (obj != null) {
                    obj = obj.filter(function (x) { return x.ID == PRODUCT_ID });
                }
                
                if (obj != null) {
                    obj[0].IMG_URL = API_URL + '/Images/Products/' + obj[0].IMG_URL;
                }
                resolve(obj[0]);
            })
        });
    },
    // --------------------------------------------

    // --------------------------------------------
    getCategoryProducts: function (API_URL, CATEGORY_ID, PAGE) {
        return new Promise(function (resolve, reject) {
            var file = './data/Products.json'
            jsonfile.readFile(file, function (err, obj) {

                if (obj != null) {
                    obj = obj.filter(function (x) { return x.CATEGORY_ID == CATEGORY_ID });
                }
                var toRet = obj.slice((PAGE - 1) * page_size, PAGE * page_size);
                if (toRet != null) {
                    toRet.forEach((e) => {
                        e.IMG_URL = API_URL + '/Images/Products/' + e.IMG_URL;
                    })
                }
                resolve(toRet);
            })
        });
    },
    // --------------------------------------------

    // --------------------------------------------
    getProductImages: function (API_URL, PRODUCT_ID) {

        return new Promise(function (resolve, reject) {
            var file = './data/ProductImages.json';
            var data = [];
            jsonfile.readFile(file, function (err, obj) {

                if (obj != null) {
                    obj = obj.filter(function (x) { return x.ID == PRODUCT_ID });
                }

                if (obj != null) {
                    obj.forEach((e) => {
                        e.IMG_URL = API_URL + '/Images/ProductImages/' + e.IMG_URL;
                        data.push(e);
                    })
                }
                if ((data == null) || (data.length == 0)) {
                    reject('No Image found');
                }
                else {
                    resolve(data);
                }
            });
        })
    },
    // --------------------------------------------

    // --------------------------------------------
    test: function () {
        return new Promise(function (resolve, reject) {
            resolve(true);
        });
    }
    // --------------------------------------------

}