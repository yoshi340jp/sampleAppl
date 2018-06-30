var router = require('./checkin4');
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
    		var queryString = 'SELECT ID,BEHAVIOR_VAL FROM SPECIFIC_BEHABIOR ORDER BY RAND() LIMIT 3';
	    	dba.selectLists(queryString, function(err,result){
	    		if(err){
	    			console.log(err);
	    			callback(err,null);
	    		}else{
		    		console.log("res" + result);
					callback(null,result);
	    		}
			});
    	},
	],
	function(err,results){
    	console.log("render"+ results);
		res.render(req.params.hotelId + '/checkin/checkin_3', {
	        static_path: '',
	        theme: process.env.THEME || 'flatly',
	        flask_debug: process.env.FLASK_DEBUG || 'false',
	        hotel_id: req.params.hotelId,
	        behaviorList: JSON.parse(results)
	    });
		dba.disconnect();
    });    
}

//POST Request
router.post('/checkin3', auth.authorize(), function(req,res){execute(req,res);});

//GET Request
router.get('/checkin3', auth.authorize(), function(req,res){execute(req,res);});

// Prepare for using module as router
module.exports = router;