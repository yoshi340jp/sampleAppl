var router = require('./checkout3');
//async モジュールのインポート
var async = require('async');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');
//Utilモジュールのロード
var util = require(process.cwd() + '/common/util');
//DB用モジュールのロード
var dba = require(process.cwd() + '/common/dba');

function execute(req, res, flag) {
	//DBに接続。
	dba.connect();
	//Transaction Start
	dba.beginTransaction();
	//Localeの設定
	util.setLocale(req.session.locale);

    async.waterfall([
    	function(callback){
    		if(flag){
	    		var queryString = 'SELECT * FROM INDIVISUAL_INFO WHERE SITE_CODE = ? AND CHECK_IN_DATE = ? AND ROOM_NUM=? AND INDIVISUAL_ID = ?';
	    		var param = [req.session.staff.siteCode,req.session.indivisual.checkinDate,req.session.indivisual.roomNo,req.session.staff.indivisualId];
	
	    		dba.selectPK(queryString, param, function(err,result){
	    			if(err){
	    				console.error(err);
	    	    		req.flash('error',util.getErrorMessage('DBQueryError'));
	    				callback(null,err,null);
	    			}else{
	    				callback(null,null,result);
	    			}
	    		});
    		}else{
    			callback(null,null,null);
    		}
    	},
    	function(err, result, callback){
    		if(err){
				console.error(err);
	    		req.flash('error',util.getErrorMessage('DBQueryError'));
    			callback(err,result,false,null);
    		}
			if(!result && typeof result === 'undefined'){
	    		var queryString2 = 'INSERT INTO INDIVISUAL_INFO (SITE_CODE,CHECK_IN_DATE,ROOM_NUM,INDIVISUAL_ID,GENDER,CRE_DATE,CRE_USER)VALUES(';
	    		queryString2 +=	'?,?,?,?,?,now(),?)';
	    		var param2 = [req.session.staff.siteCode,req.session.indivisual.checkinDate ,req.session.indivisual.roomNo,req.session.staff.indivisualId,req.session.indivisual.gender,req.session.staff.name];
	    
	    		dba.insert(queryString2, param2, function(err,result){
	    			if(err){
	    				console.error(err);
	    	    		req.flash('error',util.getErrorMessage('DBQueryError'));
	    				callback(err,null,false,null);
	    			}else{
	    				callback(null,result,true,null);
	    			}
	    		});
    		}else{
				callback(null,result,false,null);
    		}
    	}
	],
	function(err, result, errflag, dummy){
    	if(err){
    		console.error(err);
    		dba.rollback();
            res.redirect('back');
    	}else{
    		dba.commit();
	        res.render(req.params.hotelId + '/checkout/checkout_2', {
	            static_path: '',
	            theme: process.env.THEME || 'flatly',
	            flask_debug: process.env.FLASK_DEBUG || 'false',
	            hotel_id: req.params.hotelId,
	            rank : req.session.indivisual.rank,
	            error_msg: req.flash('error')
	        });
    	}
		dba.disconnect();
    });    	
}

//POST Request
router.post('/checkout2', auth.authorize(), function(req,res){
	//Localeの設定
	util.setLocale(req.session.locale);

	var errflag = false;
	if(req.body.roomNo) {
		req.session.indivisual.roomNo = req.body.roomNo;		  
		if(isNaN(req.body.roomNo)){
			req.flash('error',util.getErrorMessage('NumberFormatError',[util.getViewName('checkout1','roomNo')]));
			errflag = true;		  
		}
	}else{
		req.flash('error',util.getErrorMessage('MandatoryError',[util.getViewName('checkout1','roomNo')]));
		errflag = true;		  	  
	}

	if(req.body.checkinDate) {
		req.session.indivisual.checkinDate = req.body.checkinDate;		  
		if(!util.isYYYYMMDD(req.body.checkinDate)){
			req.flash('error',util.getErrorMessage('DateFormatError',[util.getViewName('checkout1','checkinDate')]));
			errflag = true;		  
		}
	}else{
		req.flash('error',util.getErrorMessage('MandatoryError',[util.getViewName('checkout1','checkinDate')]));
		errflag = true;		  	  
	}

	req.session.indivisual.language = req.body.language; 
	req.session.locale = req.body.language;
	
	if(errflag){
	  res.redirect('back');
	}else{
	  execute(req,res,true); 	  
	}
});

//GET Request
router.get('/checkout2', auth.authorize(), function(req,res){execute(req,res,false);});

// Prepare for using module as router
module.exports = router;