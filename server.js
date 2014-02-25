var express = require('express'),
	stylus = require('stylus'),
	mongoose = require('mongoose');
	//routes = require('./server/routes');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

function compile(str, path) {
	return stylus(str).set('filename', path);
}

app.configure(function() {
	app.set('views', __dirname + '/server/views');
	app.set('view engine', 'jade');
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(stylus.middleware(
		{
			src: __dirname + '/public',
			compile: compile
		}
	));
	app.use(express.static(__dirname + '/public'));
});

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error...'));
db.once('open', function callback(){
	console.log('forms db opened');
});

var formSchema = mongoose.Schema({_id: String, fields: Array, action: String, email_results: Boolean, email: String});
var TechlabForm = mongoose.model('forms', formSchema);
var mongoForm;

TechlabForm.findOne().exec(function(err, formDoc) {
	mongoForm = formDoc;
});

app.get('/partials/:partialPath', function(req, res) {
	res.render('partials/' + req.params.partialPath);
});

app.get('*', function(req, res) {
	res.render('index', {pageTitle: "TechLab Forms", form: mongoForm});
});

var port = process.env.PORT || 3030;
app.listen(port);
console.log('Listnening on port ' + port + '...');
