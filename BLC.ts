
import { Category } from './BLC_Entities';
import { DALC } from './DALC';
import * as jsonfile from 'jsonfile';
export class BLC {
    page_size = 5;
    dalc: DALC;
    constructor() {
        this.dalc = new DALC();
    }

    initializDB() {
        this.dalc.InitializeDB();
    }


    getAllCategories() {
        return this.dalc.getAllCategories();
    }

    Edit_Category(cat: Category) {
        return this.dalc.Edit_Category(cat);
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
        return new Promise((resolve,reject)=>{
            this.dalc.getCategoryProducts(CATEGORY_ID).then((data) => {
                if (data != null){
                    data.forEach(e => {
                        e.IMG_URL = API_URL + '/Images/Products/' + e.IMG_URL;
                    });
                    resolve(data);
                }
            });
        });
    }

    getProductImages(API_URL, PRODUCT_ID): Promise<any> {
        return new Promise((resolve,reject)=>{
            this.dalc.getProductImages(PRODUCT_ID).then((data)=>{
                if ((data == null) || (data.length == 0))
                {
                    this.dalc.getProduct(PRODUCT_ID).then((prod)=>{
                        var toRet = [];
                        toRet.push({'PRODUCT_ID':PRODUCT_ID,'IMG_URL':API_URL + '/Images/Products/' + prod[0].IMG_URL});                       
                        resolve(toRet);
                    });
                }
                else
                {                    
                    data.forEach(e => {
                        e.IMG_URL = API_URL + '/Images/ProductImages/' + e.IMG_URL;
                    });
                    resolve(data);
                }
            });
        });
    }
}
