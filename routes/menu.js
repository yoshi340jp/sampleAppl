var router = require('./common');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');

function execute(req, res){
	//セッションReset
	req.session.locale = null;
	req.session.indivisual = {operator:req.user.username};
	req.session.indivisual.siteCode = 'AAA';
	req.session.indivisual.indivisualId = 'AA';

	res.render(req.params.hotelId + '/menu', {
        static_path: '',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false',
        hotel_id: req.params.hotelId
    });
}

//POST Request
router.post('/menu', auth.authorize(), function(req,res){execute(req,res);});

//GET Request
router.get('/menu', auth.authorize(), function(req,res){execute(req,res);});

// Prepare for using module as router
module.exports = router;