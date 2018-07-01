var router = require('./checkin2');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');

function execute(req, res) {
    res.render(req.params.hotelId + '/checkin/checkin_1', {
        static_path: '',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false',
        hotel_id: req.params.hotelId,
        error_msg: req.flash('error')
    });
}

//POST Request
router.post('/checkin1', auth.authorize(), function(req,res){execute(req,res);});

//GET Request
router.get('/checkin1', auth.authorize(), function(req,res){execute(req,res);});

// Prepare for using module as router
module.exports = router;