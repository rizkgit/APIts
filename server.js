// Express App.
// ------------
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var blc = require('./BLC');
// ------------


// Body Parser
// ------------
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
// ------------

// Cors
// use it before all route definitions
// ------------
var cors = require('cors');
app.use(cors({ origin: 'http://localhost:8100' }));
// ------------

// Json File 
// ------------
var jsonfile = require('jsonfile')
// ------------

// Actions
// ------------
app.get('/', function (req, res) {
	res.send('Oops: Nothing to show till now');
})


app.get('/FeaturedProducts', function (req, res) {

	var file = './data/Products.json'
	jsonfile.readFile(file, function (err, obj) {
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
		res.send(toRet);
	})
})

app.get('/RootCategories', function (req, res) {
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
})

app.get('/Categories', function (req, res) {
	var file = './data/Categories.json'
	jsonfile.readFile(file, function (err, obj) {
		res.send(obj);
	})
})

app.post('/Products', function (req, res) {

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
})

app.post('/CategoryProducts', function (req, res) {
	var CATEGORY_ID = req.body.CATEGORY_ID;
	var page_number = req.body.page;

	blc.getCategoryProducts(API_URL, CATEGORY_ID, page_number)
		.then((data) => res.send(data));

})

app.post('/ProductImages', function (req, res) {
	var PRODUCT_ID = req.body.PRODUCT_ID;
	var page_number = req.body.page;

	blc.getProductImages(API_URL, PRODUCT_ID, page_number)
		.then((data) => res.send(data)).catch((e)=>{			
			blc.getProduct(API_URL,PRODUCT_ID).then((product)=>{
				var array = [];
				array.push(product);
				res.send(array);
			})
		});
})
// ------------

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

app.get('*', function (req, res) {
	var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
	if (file.indexOf(dir + path.sep) !== 0) {
		return res.status(403).end('Forbidden');
	}
	var type = mime[path.extname(file).slice(1)] || 'text/plain';
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


// Get Public IP
// ------------
const port = 4250
const publicIp = require('public-ip');
var API_URL = '';

publicIp.v4().then(ip => {
	API_URL = 'http://' + ip + ':' + port;
	app.listen(port);
	console.log("API is listening on " + "[" + API_URL + "]");
});
// ------------
