"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DALC_1 = require("./DALC");
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
            this.dalc.getProducts(page_number, 5).then((data) => {
                if (data != null) {
                    data.forEach(e => {
                        e.IMG_URL = API_URL + '/Images/Products/' + e.IMG_URL;
                    });
                }
                resolve(data);
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
                if (data != null) {
                    data[0].IMG_URL = API_URL + '/Images/Products/' + data[0].IMG_URL;
                }
                resolve(data);
            });
        });
    }
    getProductReviews(PRODUCT_ID) {
        return new Promise((resolve, reject) => {
            this.dalc.getProductReviews(PRODUCT_ID).then((data) => {
                resolve(data);
            });
        });
    }
    getCategoryProducts(API_URL, CATEGORY_ID, PAGE) {
        return new Promise((resolve, reject) => {
            this.dalc.getCategoryProducts(CATEGORY_ID, PAGE, 5).then((data) => {
                if (data != null) {
                    data.forEach(e => {
                        e.IMG_URL = API_URL + '/Images/Products/' + e.IMG_URL;
                    });
                    resolve(data);
                }
            });
        });
    }
    getProductImages(API_URL, PRODUCT_ID) {
        return new Promise((resolve, reject) => {
            this.dalc.getProductImages(PRODUCT_ID).then((data) => {
                if ((data == null) || (data.length == 0)) {
                    this.dalc.getProduct(PRODUCT_ID).then((prod) => {
                        var toRet = [];
                        toRet.push({ 'PRODUCT_ID': PRODUCT_ID, 'IMG_URL': API_URL + '/Images/Products/' + prod[0].IMG_URL });
                        resolve(toRet);
                    });
                }
                else {
                    data.forEach(e => {
                        e.IMG_URL = API_URL + '/Images/ProductImages/' + e.IMG_URL;
                    });
                    resolve(data);
                }
            });
        });
    }
}
exports.BLC = BLC;
