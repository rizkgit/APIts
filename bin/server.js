"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Json File 
// ------------
var jsonfile = require('jsonfile');
// ------------
// ------------
const express = require("express");
const body_parser_1 = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const BLC_1 = require("./BLC");
const BLC_Entities_1 = require("./BLC_Entities");
const publicIp = require('public-ip');
class App {
    //Run configuration methods on the Express instance.
    constructor() {
        //console.log("API Constructor");
        this.blc = new BLC_1.BLC();
        this.express = express();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(body_parser_1.json());
        this.express.use(body_parser_1.urlencoded({ extended: false }));
        this.express.use(cors({ origin: 'http://localhost:8100' }));
    }
    // Configure API endpoints.
    routes() {
        let router = express.Router();
        // placeholder route handler
        router.get('/', (req, res, next) => {
            res.json({
                message: 'Oops: Nothing to show till now'
            });
        });
        router.get('/AllCategories', (req, res, next) => {
            res.send(this.blc.getAllCategories().then((data) => console.log(data)));
        });
        router.get('/FeaturedProducts', (req, res, next) => {
            this.blc.getFeaturedProducts(API_URL).then((data) => res.send(data));
        });
        router.get('/RootCategories', (req, res, next) => {
            this.blc.getRootCategories(API_URL).then((data) => res.send(data));
        });
        router.get('/Categories', (req, res, next) => {
            this.blc.getCategories().then((data) => res.send(data));
        });
        router.post('/Products', (req, res, next) => {
            var page_number = req.body.page;
            this.blc.getProducts(API_URL, page_number).then((data) => res.send(data));
        });
        router.post('/CategoryProducts', (req, res, next) => {
            var CATEGORY_ID = req.body.CATEGORY_ID;
            var page_number = req.body.page;
            this.blc.getCategoryProducts(API_URL, CATEGORY_ID, page_number)
                .then((data) => res.send(data));
        });
        router.post('/ProductReviews', (req, res, next) => {
            var PRODUCT_ID = req.body.PRODUCT_ID;
            var page_number = req.body.page;
            this.blc.getProductReviews(PRODUCT_ID).then((data) => res.send(data));
        });
        router.post('/ProductImages', (req, res, next) => {
            var PRODUCT_ID = req.body.PRODUCT_ID;
            var page_number = req.body.page;
            this.blc.getProductImages(API_URL, PRODUCT_ID)
                .then((data) => res.send(data)).catch((e) => {
                this.blc.getProduct(API_URL, PRODUCT_ID).then((product) => {
                    var array = [];
                    array.push(product);
                    res.send(array);
                });
            });
        });
        router.post('/Edit_Category', (req, res, next) => {
            let cat = new BLC_Entities_1.Category();
            cat.CATEGORY_ID = 986;
            this.blc.Edit_Category(cat);
        });
        // Serving Static Files
        // ------------
        var dir = path.join(__dirname, '');
        var mime = {
            html: 'text/html',
            txt: 'text/plain',
            css: 'text/css',
            gif: 'image/gif',
            jpg: 'image/jpeg',
            png: 'image/png',
            svg: 'image/svg+xml',
            js: 'application/javascript'
        };
        router.get('*', (req, res, next) => {
            var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
            if (file.indexOf(dir + path.sep) !== 0) {
                return res.status(403).end('Forbidden');
            }
            var type = mime[path.extname(file).slice(1)] || 'text/plain';
            file = file.replace('\\bin\\', '\\');
            var s = fs.createReadStream(file);
            s.on('open', function () {
                res.set('Content-Type', type);
                s.pipe(res);
            });
            s.on('error', function () {
                res.set('Content-Type', 'text/plain');
                res.status(404).end('Not found');
            });
        });
        // ------------
        this.express.use('/', router);
    }
}
let MyApp = new App().express;
const port = 4250;
var API_URL = '';
publicIp.v4().then(ip => {
    API_URL = 'http://' + ip + ':' + port;
    MyApp.use(body_parser_1.json());
    MyApp.listen(port);
    console.log("API is listening on " + "[" + API_URL + "]");
});
exports.default = MyApp;
// ------------
