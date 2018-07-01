var router = require('./common');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');

//async モジュールのインポート
var async = require('async');

//DB用モジュールのロード
var dba = require(process.cwd() + '/common/dba');

function execute(req,res,updateFlag) {
	dba.connect();

    async.parallel([
    	function(callback){
    		if(updateFlag){
	    		console.log(req.session.indivisual);
	    		var queryString = "UPDATE INDIVISUAL_INFO SET BEHAVIOR_1 = ?,BEHAVIOR_2=?, BEHAVIOR_3=?,UPD_DATE = NOW(), UPD_USER = ?  WHERE SITE_CODE = ? AND CHECK_IN_DATE = ? AND ROOM_NUM=? AND INDIVISUAL_ID = ?"; 
	    		var param = [req.session.indivisual.behavior[0],req.session.indivisual.behavior[1],req.session.indivisual.behavior[2],req.session.indivisual.operator,
	    			req.session.indivisual.siteCode,req.session.indivisual.checkinDate,req.session.indivisual.roomNo,req.session.indivisual.indivisualId,req.session.indivisual.gender];
	    
	    		dba.update(queryString, param, function(err,result){
	    			if(err){
	    				console.log(err);
	    				callback(err,null);
	    			}else{
	    				callback(null,result);
	    			}
	    		});
    		}else{
				callback(null,0);    			
    		}
    	}
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
router.post('/checkin4', auth.authorize(), function(req,res){
	var errflag = false;
	if(req.body.behavior) {
		var arrayBehavior  = String(req.body.behavior).split(",");
		if(arrayBehavior.length > 3){
			req.flash('error',"選択は3つ以内にしてください");
			errflag = true;
		}else{
			req.session.indivisual.behavior = arrayBehavior;
		}
	}else{
		req.flash('error',"振る舞いを選択してください");
		errflag = true;
	}
	if(errflag){
	  res.redirect('back');
	}else{
	  execute(req,res,true); 	  
	}
});

//GET Request
router.get('/checkin4', auth.authorize(), function(req,res){execute(req,res,false);});

// Prepare for using module as router
module.exports = router;