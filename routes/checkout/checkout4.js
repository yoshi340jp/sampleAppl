var router = require('./common');
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
	    		var queryString = "UPDATE INDIVISUAL_INFO SET COMMENT=?,UPD_DATE = NOW(), UPD_USER = ?  WHERE SITE_CODE = ? AND CHECK_IN_DATE = ? AND ROOM_NUM=? AND INDIVISUAL_ID = ?"; 
	    		var param = [req.session.indivisual.comment,req.session.staff.name,
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
	        res.render(req.params.hotelId + '/checkout/checkout_4', {
	            static_path: '',
	            theme: process.env.THEME || 'flatly',
	            flask_debug: process.env.FLASK_DEBUG || 'false',
	            hotel_id: req.params.hotelId,
	            error_msg: req.flash('error')
	        });
    	}
		dba.disconnect();
    });    
}

//POST Request
router.post('/checkout4', auth.authorize(), function(req,res){
	req.session.indivisual.comment = req.body.comment;		
	execute(req,res,true);
});

//GET Request
router.get('/checkout4', auth.authorize(), function(req,res){execute(req,res,false);});

// Prepare for using module as router
module.exports = router;