var router = require('./common');

function execute(req, res) {
    res.render('updateAttribute', {
        static_path: '',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
}

//POST Request
router.post('/updateAttribute', function(req,res){execute(req,res);});

//GET Request
router.get('/updateAttribute', function(req,res){execute(req,res);});

// Prepare for using module as router
module.exports = router;