"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DALC_1 = require("./DALC");
const jsonfile = require("jsonfile");
class BLC {
    constructor() {
        this.page_size = 5;
        this.dalc = new DALC_1.DALC();
    }
    initializDB() {
        this.dalc.InitializeDB();
    }
    getAllCategories() {
        return this.dalc.getAllCategories();
    }
    Edit_Category(cat) {
        return this.dalc.Edit_Category(cat);
    }
    getProducts(API_URL, page_number) {
        return new Promise((resolve, reject) => {
            var file = './data/Products.json';
            jsonfile.readFile(file, (err, obj) => {
                var toRet = obj.slice((page_number - 1) * this.page_size, page_number * this.page_size);
                if (toRet != null) {
                    toRet.forEach((e) => {
                        e.IMG_URL = API_URL + '/Images/Products/' + e.IMG_URL;
                    });
                }
                resolve(toRet);
            });
        });
    }
    getRootCategories(API_URL) {
        return this.dalc.getRootCategories();
    }
    getFeaturedProducts(API_URL) {
        return new Promise((resolve, reject) => {
            this.dalc.getFeaturedProducts().then((data) => {
                if (data != null) {
                    data.forEach((e) => {
                        e.IMG_URL = API_URL + '/Images/Products/' + e.IMG_URL;
                    });
                }
                resolve(data);
            });
        });
    }
    getProduct(API_URL, PRODUCT_ID) {
        return new Promise((resolve, reject) => {
            this.dalc.getProduct(PRODUCT_ID).then((data) => {
                console.log(data);
                if (data != null) {
                    data[0].IMG_URL = API_URL + '/Images/Products/' + data[0].IMG_URL;
                }
                resolve(data);
            });
        });
    }
    getProductReviews(PRODUCT_ID) {
        return new Promise((resolve, reject) => {
            var file = './data/Reviews.json';
            jsonfile.readFile(file, (err, obj) => {
                if (obj != null) {
                    obj = obj.filter(function (x) { return x.ID == PRODUCT_ID; });
                }
                resolve(obj);
            });
        });
    }
    getCategoryProducts(API_URL, CATEGORY_ID, PAGE) {
        return new Promise((resolve, reject) => {
            var file = './data/Products.json';
            jsonfile.readFile(file, (err, obj) => {
                if (obj != null) {
                    obj = obj.filter(function (x) { return x.CATEGORY_ID == CATEGORY_ID; });
                }
                var toRet = obj.slice((PAGE - 1) * this.page_size, PAGE * this.page_size);
                if (toRet != null) {
                    toRet.forEach((e) => {
                        e.IMG_URL = API_URL + '/Images/Products/' + e.IMG_URL;
                    });
                }
                resolve(toRet);
            });
        });
    }
    getProductImages(API_URL, PRODUCT_ID) {
        return new Promise((resolve, reject) => {
            var file = './data/ProductImages.json';
            var data = [];
            jsonfile.readFile(file, function (err, obj) {
                if (obj != null) {
                    obj = obj.filter(function (x) { return x.ID == PRODUCT_ID; });
                }
                if (obj != null) {
                    obj.forEach((e) => {
                        e.IMG_URL = API_URL + '/Images/ProductImages/' + e.IMG_URL;
                        data.push(e);
                    });
                }
                if ((data == null) || (data.length == 0)) {
                    reject('No Image found');
                }
                else {
                    resolve(data);
                }
            });
        });
    }
}
exports.BLC = BLC;
