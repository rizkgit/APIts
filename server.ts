
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
const publicIp = require('public-ip');


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

		router.get('/InitializeDB', (req, res, next) => {			
			this.blc.initializDB();
			res.send('DB Initialized');
		});

		router.get('/AllCategories', (req, res, next) => {			
			res.send(this.blc.getAllCategories().then((data) => console.log(data)));
		});

		router.get('/FeaturedProducts', (req, res, next) => {
			this.blc.getFeaturedProducts(API_URL).then((data)=>res.send(data));			
		});

		router.get('/RootCategories', (req, res, next) => {
			this.blc.getRootCategories(API_URL).then((data) => res.send(data));
		});

		router.get('/Categories', (req, res, next) => {
			this.blc.getAllCategories().then((data)=> res.send(data));
		});

		router.post('/Products', (req, res, next) => {			
			var page_number = req.body.page;
			this.blc.getProducts(API_URL,page_number).then((data) => res.send(data));
		});

		router.post('/Product', (req, res, next) => {			
			this.blc.getProduct(API_URL,req.body.PRODUCT_ID).then((data) => res.send(data));
		});

		router.post('/CategoryProducts', (req, res, next) => {
			var CATEGORY_ID = req.body.CATEGORY_ID;
			var page_number = req.body.page;			
			this.blc.getCategoryProducts(API_URL, CATEGORY_ID, page_number)
				.then((data) => res.send(data));

		});

		router.post('/ProductReviews',  (req, res,next) =>{
			var PRODUCT_ID = req.body.PRODUCT_ID;	
			this.blc.getProductReviews(PRODUCT_ID).then((data) => res.send(data));
		})

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
var API_URL = ''

publicIp.v4().then(ip => {
	API_URL = 'http://' + ip + ':' + port;
	MyApp.use(json());
	MyApp.listen(port);
	console.log("API is listening on " + "[" + API_URL + "]");
});
export default MyApp;
// ------------




