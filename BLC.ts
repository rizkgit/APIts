
import {Category} from './BLC_Entities';
import {DALC} from './DALC';
import * as jsonfile from 'jsonfile';
export class BLC
{
    page_size = 5;   
    dalc: DALC;
    constructor(){
        this.dalc = new DALC();
    }
    getAllCategories(){       
        return  this.dalc.getAllCategories();     
    }

    Edit_Category(cat: Category){        
        return this.dalc.Edit_Category(cat);
    }


    getProducts(API_URL,page_number): Promise<any>{
        return new Promise((resolve,reject) => {          
			var file = './data/Products.json'
			jsonfile.readFile(file, (err, obj)=> {
				var toRet = obj.slice((page_number - 1) * this.page_size, page_number * this.page_size);
				if (toRet != null) {
					toRet.forEach((e) => {
						e.IMG_URL = API_URL + '/Images/Products/' + e.IMG_URL;
					})
				}
				resolve(toRet);
			})
        });
    }

    getCategories(): Promise<any> {
       return new Promise((reject,resolve) =>{
        var file = './data/Categories.json'
        jsonfile.readFile(file, (err, obj) => {
            reject(obj);
        })
       });
    }

    getRootCategories(API_URL): Promise<any>{
        return new Promise((resolve,reject) => {
            var file = './data/Categories.json'
			jsonfile.readFile(file, (err, obj) => {
				var toRet = [];
				obj.forEach((e) => {
					if (e.PARENT_ID == "0") {
						toRet.push(e);
					}
				});
				if (toRet != null) {
					toRet.forEach((e) => {
						e.IMG_URL = API_URL + '/Images/Categories/' + e.IMG_URL;
					})
				}
				resolve(toRet);
			})
        });
    }

    getFeaturedProducts(API_URL: string): Promise<any>{
       return new Promise((resolve,reject)=>{
        var file = './data/Products.json'
        jsonfile.readFile(file, (err, obj)=> {
            var toRet = [];
            obj.forEach((e) => {
                if (e.IS_FEATURED == true) {
                    toRet.push(e)
                };
            })
            if (toRet != null) {
                toRet.forEach((e) => {
                    e.IMG_URL = API_URL + '/Images/Products/' + e.IMG_URL;
                })
            }
            resolve(toRet);
        })
       });
    }

    getProduct(API_URL, PRODUCT_ID): Promise<any> {
        return new Promise( (resolve, reject) => {
            var file = './data/Products.json'
            jsonfile.readFile(file, (err, obj) => {
                
                if (obj != null) {
                    obj = obj.filter(function (x) { return x.ID == PRODUCT_ID });
                }
                
                if (obj != null) {
                    obj[0].IMG_URL = API_URL + '/Images/Products/' + obj[0].IMG_URL;
                }
                resolve(obj[0]);
            })
        });
    }

    getProductReviews(PRODUCT_ID): Promise<any> {
        return new Promise((resolve, reject) => {
            var file = './data/Reviews.json'
            jsonfile.readFile(file, (err, obj) => {
                
                if (obj != null) {
                    obj = obj.filter(function (x) { return x.ID == PRODUCT_ID });
                }
                
                resolve(obj);
            })
        });
    }

    getCategoryProducts(API_URL, CATEGORY_ID, PAGE): Promise<any> {
        return new Promise((resolve, reject) => {
            var file = './data/Products.json'
            jsonfile.readFile(file, (err, obj) => {

                if (obj != null) {
                    obj = obj.filter(function (x) { return x.CATEGORY_ID == CATEGORY_ID });
                }
                var toRet = obj.slice((PAGE - 1) * this.page_size, PAGE * this.page_size);
                if (toRet != null) {
                    toRet.forEach((e) => {
                        e.IMG_URL = API_URL + '/Images/Products/' + e.IMG_URL;
                    })
                }
                resolve(toRet);
            })
        });
    }

    getProductImages(API_URL, PRODUCT_ID): Promise<any> {
        
                return new Promise( (resolve, reject) => {
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
            }
}
