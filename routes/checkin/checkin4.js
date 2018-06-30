var router = require('./common');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');

//async モジュールのインポート
var async = require('async');

//DB用モジュールのロード
var dba = require(process.cwd() + '/common/dba');

function execute(req, res) {
	dba.connect();

    async.parallel([
    	function(callback){
//    		var queryString = 'SELECT ID,BEHAVIOR_VAL FROM SPECIFIC_BEHABIOR ORDER BY RAND() LIMIT 3';
//	    	dba.selectLists(queryString, function(err,result){
//	    		if(err){
//	    			console.log(err);
//	    			callback(err,null);
//	    		}else{
//		    		console.log("res" + result);
//					callback(null,result);
//	    		}
//			});
    		callback(null,null);
    	},
	],
	function(err,results){
    	console.log("render"+ results);
		res.render(req.params.hotelId + '/checkin/checkin_4', {
	        static_path: '',
	        theme: process.env.THEME || 'flatly',
	        flask_debug: process.env.FLASK_DEBUG || 'false',
	        hotel_id: req.params.hotelId
	    });
		dba.disconnect();
    });    
}

//POST Request
router.post('/checkin4', auth.authorize(), function(req,res){execute(req,res);});

//GET Request
router.get('/checkin4', auth.authorize(), function(req,res){execute(req,res);});

// Prepare for using module as router
module.exports = router;