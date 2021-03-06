var router = require('./updateAttribute');

function execute(req, res) {
    res.render('signup', {
        static_path: '',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
}

//POST Request
router.post('/signup', function(req,res){execute(req,res);});

//GET Request
router.get('/signup', function(req,res){execute(req,res);});

// Prepare for using module as router
module.exports = router;