var router = require('./checkout4');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');

//async モジュールのインポート
var async = require('async');

//DB用モジュールのロード
var dba = require(process.cwd() + '/common/dba');

function execute(req, res, updateFlag) {
	dba.connect();

    async.parallel([
    	function(callback){
    		if(updateFlag){
	    		console.log(req.session.indivisual);
	    		var queryString = "UPDATE INDIVISUAL_INFO SET RANK=?,UPD_DATE = NOW(), UPD_USER = ?  WHERE SITE_CODE = ? AND CHECK_IN_DATE = ? AND ROOM_NUM=? AND INDIVISUAL_ID = ?"; 
	    		var param = [req.session.indivisual.rank,req.session.staff.name,
	    			req.session.staff.siteCode,req.session.indivisual.checkinDate,req.session.indivisual.roomNo,req.session.staff.indivisualId];
	    
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
    	if(err){
    		console.log(err);
    		req.flash('error',err.sqlMessage);
            res.redirect('back');
    	}else{
	        console.log("render"+ results);
	        res.render(req.params.hotelId + '/checkout/checkout_3', {
	            static_path: '',
	            theme: process.env.THEME || 'flatly',
	            flask_debug: process.env.FLASK_DEBUG || 'false',
	            hotel_id: req.params.hotelId,
	            comment: req.session.indivisual.comment,
	            error_msg: req.flash('error')
	        });
    	}
		dba.disconnect();
    });    
}

//POST Request
router.post('/checkout3', auth.authorize(), function(req,res){
	var errflag = false;
	if(req.body.rank) {
		req.session.indivisual.rank = req.body.rank;		  
		if(isNaN(req.body.rank)){
			req.flash('error','Rankは数字で入力してください。¥n');
			errflag = true;		  
		}
	}else{
		req.flash('error','Rankを入力してください。¥n');
		errflag = true;		  	  
	}

	if(errflag){
	  res.redirect('back');
	}else{
	  execute(req,res,true); 	  
	}
});

//GET Request
router.get('/checkout3', auth.authorize(), function(req,res){execute(req,res,false);});

// Prepare for using module as router
module.exports = router;