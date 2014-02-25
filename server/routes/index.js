module.exports = function(app, params) {
	app.get('/partials/:partialPath', function(req, res) {
		res.render('partials/' + req.params.partialPath);
	});

	app.get('*', function(req, res) {
		res.render('index', {pageTitle: "TechLab Forms", formDoc: params._id});
	});
}