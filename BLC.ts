
import { Category, Person } from './BLC_Entities';
import { DALC } from './DALC';
import * as jsonfile from 'jsonfile';
import { error } from 'util';
var events = require('events');
export class BLC {
    page_size = 5;
    dalc: DALC;

    eventEmitter =  new events.EventEmitter();

    constructor() {
        
        // -------------
        this.dalc = new DALC();
        // -------------

        // -------------
        // this.PreEvent_Edit_Person = (p:Person) =>{
        //     if (p.FIRST_NAME.startsWith("E")){
        //         throw error('first name cannot starts with E');
        //     }
        // }
        this.eventEmitter.on('PreEvent_Edit_Person',(p:Person)=>{
            if (p.FIRST_NAME.startsWith("E")){
                console.log('XXXXXXXXXXX ' + p.FIRST_NAME + ' XXXXXXXXXXXXXX');
                throw error('First name should not start with E');
            }
        })
        // -------------
    }

    initializDB() {
        this.dalc.InitializeDB();
    }


    getAllCategories() {
        return this.dalc.getAllCategories();
    }



    getProducts(API_URL, page_number): Promise<any> {
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

    getRootCategories(API_URL): Promise<any> {
        return this.dalc.getRootCategories();
    }

    getFeaturedProducts(API_URL: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dalc.getFeaturedProducts().then((data) => {
                if (data != null) {
                    data.forEach((e) => {
                        e.IMG_URL = API_URL + '/Images/Products/' + e.IMG_URL;
                    })
                }
                resolve(data);
            });
        });

    }

    getProduct(API_URL, PRODUCT_ID): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dalc.getProduct(PRODUCT_ID).then((data) => {
                if (data != null) {
                    data[0].IMG_URL = API_URL + '/Images/Products/' + data[0].IMG_URL;
                }
                resolve(data);
            });
        });
    }

    getProductReviews(PRODUCT_ID): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dalc.getProductReviews(PRODUCT_ID).then((data) => {
                resolve(data);
            });
        });
    }

    getCategoryProducts(API_URL, CATEGORY_ID, PAGE): Promise<any> {
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

    getProductImages(API_URL, PRODUCT_ID): Promise<any> {
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
    
    Edit_Person(p: Person): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dalc.con.beginTransaction((err) => {
                (async () => {
                    try {

                        // -------------------
                        this.eventEmitter.emit('PreEvent_Edit_Person',p);
                        // -------------------

                        // -------------------
                        await this.dalc.Edit_Person(p)
                            .then((data) => {  })
                            .catch((err) => { throw err });
                        // -------------------


                        // -------------------
                        this.dalc.con.commit(function (err) {
                            if (err) {
                                this.dalc.con.rollback(function () {
                                    throw err;
                                });
                            }
                        })
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
                })();

            })
        });
    }

}
