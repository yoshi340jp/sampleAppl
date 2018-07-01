var router = require('./common');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');

function getNowYMD(){
	  var dt = new Date();
	  var y = dt.getFullYear();
	  var m = ("00" + (dt.getMonth()+1)).slice(-2);
	  var d = ("00" + dt.getDate()).slice(-2);
	  var result = y +  m + d;
	  return result;
	}


router.get('/menu', auth.authorize(), function(req, res){
	//セッションセット
	req.session.indivisual = {operator:req.user.username};
	req.session.indivisual.checkinDate = getNowYMD();
	req.session.indivisual.siteCode = 'AAA';
	req.session.indivisual.indivisualId = 'AA';

	res.render(req.params.hotelId + '/menu', {
        static_path: '',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false',
        hotel_id: req.params.hotelId
    });
});

// Prepare for using module as router
module.exports = router;