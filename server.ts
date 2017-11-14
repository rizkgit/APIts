
// Json File 
// ------------
var jsonfile = require('jsonfile')
// ------------

// ------------
import * as express from 'express';
import {
	json,
	raw,
	text,
	urlencoded,
} from 'body-parser';
import * as cors from 'cors';
import * as path from 'path';
import * as fs from 'fs';
import {BLC} from './BLC';
import {Category} from './BLC_Entities';


class App {
	// ref to Express instance
	public express: express.Application;
	public blc : BLC;
	//Run configuration methods on the Express instance.
	constructor() {
		//console.log("API Constructor");
		this.blc = new BLC();
		this.express = express();
		this.middleware();
		this.routes();
	}
	// Configure Express middleware.
	private middleware(): void {
		this.express.use(json());
		this.express.use(urlencoded({ extended: false }));
		this.express.use(cors({ origin: 'http://localhost:8100' }));
	}

	// Configure API endpoints.
	private routes(): void {

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
						console.log(e.IMG_URL);
					})
				}
				res.send(toRet);
			})
		});

		router.get('/RootCategories', (req, res, next) => {
			var file = './data/Categories.json'
			jsonfile.readFile(file, function (err, obj) {
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
				res.send(toRet);
			})
		});

		router.get('/Categories', (req, res, next) => {
			var file = './data/Categories.json'
			jsonfile.readFile(file, function (err, obj) {
				res.send(obj);
			})
		});

		router.post('/Products', (req, res, next) => {
			var page_size = 5;
			var page_number = req.body.page;
			var file = './data/Products.json'
			jsonfile.readFile(file, function (err, obj) {
				var toRet = obj.slice((page_number - 1) * page_size, page_number * page_size);
				if (toRet != null) {
					toRet.forEach((e) => {
						e.IMG_URL = API_URL + '/Images/Products/' + e.IMG_URL;
					})
				}
				res.send(toRet);
			})
		});

		router.post('/CategoryProducts', (req, res, next) => {
			var CATEGORY_ID = req.body.CATEGORY_ID;
			var page_number = req.body.page;			
			this.blc.getCategoryProducts(API_URL, CATEGORY_ID, page_number)
				.then((data) => res.send(data));

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
					})
				});
		});

		router.post('/ProductReviews',  (req, res,next) =>{
			var PRODUCT_ID = req.body.PRODUCT_ID;
			var page_number = req.body.page;			
			this.blc.getProductReviews(PRODUCT_ID).then((data) => res.send(data));
		})
		
		router.post('/Edit_Category', (req, res,next) => {
			let cat = new Category();
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

		router.get('*', (req, res,next) => {
			var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));			
			if (file.indexOf(dir + path.sep) !== 0) {
				return res.status(403).end('Forbidden');
			}
			var type = mime[path.extname(file).slice(1)] || 'text/plain';
			file = file.replace('\\bin\\','\\');
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
const port = 4250
const publicIp = require('public-ip');
var API_URL = '';

publicIp.v4().then(ip => {
	API_URL = 'http://' + ip + ':' + port;
	MyApp.use(json());
	MyApp.listen(port);
	console.log("API is listening on " + "[" + API_URL + "]");
});
export default MyApp;
// ------------




