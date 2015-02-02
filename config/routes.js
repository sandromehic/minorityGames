module.exports = function(app) {
    app.get('/', function (req, res) {
        if(!req.cookies.name) {
            res.redirect('/login');
        }
        else {
            res.render('index', { username: req.cookies.name });
        }
    });

    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.get('/admin', function (req, res) {
        res.render('admin');
    });
    // API
    app.post('/api/login', function (req, res) {
        if(req.body.name!='admin') {
            res.cookie('name', req.body.name);
            res.sendStatus(200);
        }
        else {
            console.log('Admin cannot login here!');
            res.sendStatus(400);
        }
    });
    
    app.post('/api/loginAdmin', function (req, res) {
        if(req.body.name == 'admin') {
            console.log('Welcome admin!');
            res.cookie('name', req.body.name);
            res.sendStatus(200);
        }
        else {
            console.log('Admin login failed!');
            res.sendStatus(400);
        }
    });
};