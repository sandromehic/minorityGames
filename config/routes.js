module.exports = function(app) {
    app.get('/', function (req, res) {
    	res.render('index');
    });
    app.get('/classicalminority', function (req, res) {
    	res.render('classicalminority');
    });
    app.get('/partials/:name', function(req, res) {
		var name = req.params.name;
		res.render('partials/' + name);
	});
};