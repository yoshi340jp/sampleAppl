//var router = require('./lookup3');
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

    async.parallel([
    	function(callback){
    		var queryString = 'SELECT ID, BEHAVIOR_VAL, SHORT_DESCRIPTION FROM SPECIFIC_BEHAVIOR A,(SELECT BEHAVIOR_1,BEHAVIOR_2,BEHAVIOR_3 FROM INDIVISUAL_INFO WHERE SITE_CODE = ? AND CHECK_IN_DATE = ? AND ROOM_NUM=? AND INDIVISUAL_ID = ?) B WHERE A.ID IN(B.BEHAVIOR_1,B.BEHAVIOR_2,B.BEHAVIOR_3)';
    		var param = [req.session.staff.siteCode,req.session.indivisual.checkinDate,req.session.indivisual.roomNo,req.session.staff.indivisualId];

    		dba.selectLists(queryString, param, function(err,result){
	    		if(err){
		    		console.error(err);
		    		req.flash('error',util.getErrorMessage('DBQueryError'));
	    			callback(err,null);
	    		}else{
	        		if((JSON.parse(result)).length === 0){
	            		req.flash(util.getErrorMessage('RecodeNotFoundError'));    			
	                    callback(true,result);
	        		}else{
	        			callback(null,result);
	        		}
	    		}
	    	});
    	},
	],
	function(err, result){
    	if(err){
    		console.error(err);
    		dba.rollback();
            res.redirect('back');
    	}else{
			dba.commit();
			res.render(req.params.hotelId + '/guest-lookup/lookup_2', {
		        static_path: '',
		        theme: process.env.THEME || 'flatly',
		        flask_debug: process.env.FLASK_DEBUG || 'false',
		        hotel_id: req.params.hotelId,
		        behaviorList: JSON.parse(result),
		        error_msg: req.flash('error')
		    });
		}
		dba.disconnect();
    });    	
}

//POST Request
router.post('/lookup2', auth.authorize(), function(req,res){
	//Localeの設定
	util.setLocale(req.session.locale);

	var errflag = false;
	if(req.body.roomNo) {
		req.session.indivisual.roomNo = req.body.roomNo;		  
		if(isNaN(req.body.roomNo)){
			req.flash('error',util.getErrorMessage('NumberFormatError',[util.getViewName('lookup1','roomNo')]));
			errflag = true;		  
		}
	}else{
		req.flash('error',util.getErrorMessage('MandatoryError',[util.getViewName('lookup1','roomNo')]));
		errflag = true;		  	  
	}

	if(req.body.checkinDate) {
		req.session.indivisual.checkinDate = req.body.checkinDate;		  
		if(!util.isYYYYMMDD(req.body.checkinDate)){
			req.flash('error',util.getErrorMessage('DateFormatError',[util.getViewName('lookup1','checkinDate')]));
			errflag = true;		  
		}
	}else{
		req.flash('error',util.getErrorMessage('MandatoryError',[util.getViewName('lookup1','checkinDate')]));
		errflag = true;		  	  
	}

	if(errflag){
	  res.redirect('back');
	}else{
	  execute(req,res,true); 	  
	}
});

//GET Request
router.get('/lookup2', auth.authorize(), function(req,res){execute(req,res,false);});

// Prepare for using module as router
module.exports = router;