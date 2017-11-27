"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DALC_1 = require("./DALC");
const util_1 = require("util");
var events = require('events');
class BLC {
    constructor() {
        this.page_size = 5;
        this.eventEmitter = new events.EventEmitter();
        // -------------
        this.dalc = new DALC_1.DALC();
        // -------------
        // -------------
        // this.PreEvent_Edit_Person = (p:Person) =>{
        //     if (p.FIRST_NAME.startsWith("E")){
        //         throw error('first name cannot starts with E');
        //     }
        // }
        this.eventEmitter.on('PreEvent_Edit_Person', (p) => {
            if (p.FIRST_NAME.startsWith("E")) {
                console.log('XXXXXXXXXXX ' + p.FIRST_NAME + ' XXXXXXXXXXXXXX');
                throw util_1.error('First name should not start with E');
            }
        });
        // -------------
    }
    initializDB() {
        this.dalc.InitializeDB();
    }
    getAllCategories() {
        return this.dalc.getAllCategories();
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
    //PreEvent_Edit_Person:(p: Person) => any;
    Edit_Person(p) {
        return new Promise((resolve, reject) => {
            this.dalc.con.beginTransaction((err) => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        // -------------------
                        this.eventEmitter.emit('PreEvent_Edit_Person', p);
                        // -------------------
                        // -------------------
                        yield this.dalc.Edit_Person(p)
                            .then((data) => { })
                            .catch((err) => { throw err; });
                        // -------------------
                        // -------------------
                        this.dalc.con.commit(function (err) {
                            if (err) {
                                this.dalc.con.rollback(function () {
                                    throw err;
                                });
                            }
                        });
                        // -------------------
                        // -------------------
                        resolve(true);
                        // -------------------
                    }
                    catch (e) {
                        this.dalc.con.rollback(function () {
                            reject(e);
                        });
                    }
                }))();
            });
        });
    }
}
exports.BLC = BLC;
