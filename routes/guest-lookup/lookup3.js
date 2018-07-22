var router = require('./lookup4');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');
//async モジュールのインポート
var async = require('async');

//DB用モジュールのロード
var dba = require(process.cwd() + '/common/dba');

function execute(req, res, flag) {
	//該当データが存在する場合は、そのデータを取得する。
	dba.connect();

    async.parallel([
    	function(callback){
    		var queryString = "SELECT * FROM SPECIFIC_BEHAVIOR WHERE ID = ?";
    		var param = [req.session.indivisual.selectKey];

    		dba.selectPK(queryString, param, function(err,result){
	    		if(err){
	    			callback(err,null);
	    		}else{
		    		console.log("res" + result);
	    			callback(null,result);
	    		}
	    	});
    	},
	],
	function(err, result){
    	if(err){
    		console.log(err);
    		req.flash('error',err.sqlMessage);
            res.redirect('back');
    	}else{
			res.render(req.params.hotelId + '/guest-lookup/lookup_3', {
		        static_path: '',
		        theme: process.env.THEME || 'flatly',
		        flask_debug: process.env.FLASK_DEBUG || 'false',
		        hotel_id: req.params.hotelId,
		        behavior: JSON.parse(result),
		        error_msg: req.flash('error')
		    });
		}
		dba.disconnect();
    });    	
}

//POST Request
router.post('/lookup3', auth.authorize(), function(req,res){
	req.session.indivisual.selectKey = req.body.key;
	execute(req,res,true);
	});

//GET Request
router.get('/lookup3', auth.authorize(), function(req,res){execute(req,res,false);});

// Prepare for using module as router
module.exports = router;