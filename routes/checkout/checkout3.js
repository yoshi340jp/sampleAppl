var router = require('./checkout4');
//async モジュールのインポート
var async = require('async');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');
//Utilモジュールのロード
var util = require(process.cwd() + '/common/util');
//DB用モジュールのロード
var dba = require(process.cwd() + '/common/dba');

function execute(req, res, updateFlag) {
	//DBに接続。
	dba.connect();
	//Transaction Start
	dba.beginTransaction();
	//Localeの設定
	util.setLocale(req.session.locale);
	
    async.parallel([
    	function(callback){
    		if(updateFlag){
	    		var queryString = 'UPDATE INDIVISUAL_INFO SET RANK=?,UPD_DATE = NOW(), UPD_USER = ?  WHERE SITE_CODE = ? AND CHECK_IN_DATE = ? AND ROOM_NUM=? AND INDIVISUAL_ID = ?'; 
	    		var param = [req.session.indivisual.rank,req.session.staff.name,
	    			req.session.staff.siteCode,req.session.indivisual.checkinDate,req.session.indivisual.roomNo,req.session.staff.indivisualId];
	    
	    		dba.update(queryString, param, function(err,result){
	    			if(err){
	    				console.error(err);
	    	    		req.flash('error',util.getErrorMessage('DBQueryError'));
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
    		console.error(err);
    		dba.rollback();
            res.redirect('back');
    	}else{
    		dba.commit();
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
	//Localeの設定
	util.setLocale(req.session.locale);

	var errflag = false;
	if(req.body.rank) {
		req.session.indivisual.rank = req.body.rank;		  
		if(isNaN(req.body.rank)){
			req.flash('error',util.getErrorMessage('NumberFormatError',[util.getViewName('checkout2','rank')]));
			errflag = true;		  
		}
	}else{
		req.flash('error',util.getErrorMessage('MandatoryError',[util.getViewName('checkout2','rank')]));
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