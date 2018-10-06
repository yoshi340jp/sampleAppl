var router = require('./lookup4');
//async モジュールのインポート
var async = require('async');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');
//Utilモジュールのロード
var util = require(process.cwd() + '/common/util');
//DB用モジュールのロード
var dba = require(process.cwd() + '/common/dba');


/**
 * Rankに基づく振る舞い結果の作成
 * @param {Array} bahave1 1件目
 * @param {Array} behave2 2件目
 * @return {Array} behave １件目と２件目をマージしてRankに応じて詰め替えたもの
 */
function packing2result(behave1, behave2){
	var behave;
	behave = behave1;

	//Neutral can do Position1
	if(behave1.NEUTRAL_CAN_DO_R1 > behave2.NEUTRAL_CAN_DO_R1){
		behave.NEUTRAL_CAN_DO_P1 = behave1.NEUTRAL_CAN_DO_P1;
		behave.NEUTRAL_CAN_DO_R1 = behave1.NEUTRAL_CAN_DO_R1;
	}else{
		behave.NEUTRAL_CAN_DO_P1 = behave2.NEUTRAL_CAN_DO_P1;		
		behave.NEUTRAL_CAN_DO_R1 = behave2.NEUTRAL_CAN_DO_R1;
	}
	//Neutral can do Position2
	if(behave1.NEUTRAL_CAN_DO_R2 > behave2.NEUTRAL_CAN_DO_R2){
		behave.NEUTRAL_CAN_DO_P2 = behave1.NEUTRAL_CAN_DO_P2;
		behave.NEUTRAL_CAN_DO_R2 = behave1.NEUTRAL_CAN_DO_R2;
	}else{
		behave.NEUTRAL_CAN_DO_P2 = behave2.NEUTRAL_CAN_DO_P2;		
		behave.NEUTRAL_CAN_DO_R2 = behave2.NEUTRAL_CAN_DO_R2;
	}
	//Neutral can do Position3
	if(behave1.NEUTRAL_CAN_DO_R3 > behave2.NEUTRAL_CAN_DO_R3){
		behave.NEUTRAL_CAN_DO_P3 = behave1.NEUTRAL_CAN_DO_P3;
		behave.NEUTRAL_CAN_DO_R3 = behave1.NEUTRAL_CAN_DO_R3;
	}else{
		behave.NEUTRAL_CAN_DO_P3 = behave2.NEUTRAL_CAN_DO_P3;		
		behave.NEUTRAL_CAN_DO_R3 = behave2.NEUTRAL_CAN_DO_R3;
	}
	//Neutral cannot do Position1
	if(behave1.NEUTRAL_CANNOT_DO_R1 > behave2.NEUTRAL_CANNOT_DO_R1){
		behave.NEUTRAL_CANNOT_DO_P1 = behave1.NEUTRAL_CANNOT_DO_P1;
		behave.NEUTRAL_CANNOT_DO_R1 = behave1.NEUTRAL_CANNOT_DO_R1;
	}else{
		behave.NEUTRAL_CANNOT_DO_P1 = behave2.NEUTRAL_CANNOT_DO_P1;		
		behave.NEUTRAL_CANNOT_DO_R1 = behave2.NEUTRAL_CANNOT_DO_R1;
	}
	//Neutral cannot do Position2
	if(behave1.NEUTRAL_CANNOT_DO_R2 > behave2.NEUTRAL_CANNOT_DO_R2){
		behave.NEUTRAL_CANNOT_DO_P2 = behave1.NEUTRAL_CANNOT_DO_P2;
		behave.NEUTRAL_CANNOT_DO_R2 = behave1.NEUTRAL_CANNOT_DO_R2;
	}else{
		behave.NEUTRAL_CANNOT_DO_P2 = behave2.NEUTRAL_CANNOT_DO_P2;		
		behave.NEUTRAL_CANNOT_DO_R2 = behave2.NEUTRAL_CANNOT_DO_R2;
	}
	//Neutral cannot do Position3
	if(behave1.NEUTRAL_CANNOT_DO_R3 > behave2.NEUTRAL_CANNOT_DO_R3){
		behave.NEUTRAL_CANNOT_DO_P3 = behave1.NEUTRAL_CANNOT_DO_P3;
		behave.NEUTRAL_CANNOT_DO_R3 = behave1.NEUTRAL_CANNOT_DO_R3;
	}else{
		behave.NEUTRAL_CANNOT_DO_P3 = behave2.NEUTRAL_CANNOT_DO_P3;		
		behave.NEUTRAL_CANNOT_DO_R3 = behave2.NEUTRAL_CANNOT_DO_R3;
	}
	//Urgent can do Position1
	if(behave1.URGENT_CAN_DO_R1 > behave2.URGENT_CAN_DO_R1){
		behave.URGENT_CAN_DO_P1 = behave1.URGENT_CAN_DO_P1;
		behave.URGENT_CAN_DO_R1 = behave1.URGENT_CAN_DO_R1;
	}else{
		behave.URGENT_CAN_DO_P1 = behave2.URGENT_CAN_DO_P1;		
		behave.URGENT_CAN_DO_R1 = behave2.URGENT_CAN_DO_R1;
	}
	//Urgent can do Position2
	if(behave1.URGENT_CAN_DO_R2 > behave2.URGENT_CAN_DO_R2){
		behave.URGENT_CAN_DO_P2 = behave1.URGENT_CAN_DO_P2;
		behave.URGENT_CAN_DO_R2 = behave1.URGENT_CAN_DO_R2;
	}else{
		behave.URGENT_CAN_DO_P2 = behave2.URGENT_CAN_DO_P2;		
		behave.URGENT_CAN_DO_R2 = behave2.URGENT_CAN_DO_R2;
	}
	//Urgent can do Position3
	if(behave1.URGENT_CAN_DO_R3 > behave2.URGENT_CAN_DO_R3){
		behave.URGENT_CAN_DO_P3 = behave1.URGENT_CAN_DO_P3;
		behave.URGENT_CAN_DO_R3 = behave1.URGENT_CAN_DO_R3;
	}else{
		behave.URGENT_CAN_DO_P3 = behave2.URGENT_CAN_DO_P3;		
		behave.URGENT_CAN_DO_R3 = behave2.URGENT_CAN_DO_R3;
	}
	//Urgent cannot do Position1
	if(behave1.URGENT_CANNOT_DO_R1 > behave2.URGENT_CANNOT_DO_R1){
		behave.URGENT_CANNOT_DO_P1 = behave1.URGENT_CANNOT_DO_P1;
		behave.URGENT_CANNOT_DO_R1 = behave1.URGENT_CANNOT_DO_R1;
	}else{
		behave.URGENT_CANNOT_DO_P1 = behave2.URGENT_CANNOT_DO_P1;		
		behave.URGENT_CANNOT_DO_R1 = behave2.URGENT_CANNOT_DO_R1;
	}
	//Urgent cannot do Position2
	if(behave1.URGENT_CANNOT_DO_R2 > behave2.URGENT_CANNOT_DO_R2){
		behave.URGENT_CANNOT_DO_P2 = behave1.URGENT_CANNOT_DO_P2;
		behave.URGENT_CANNOT_DO_R2 = behave1.URGENT_CANNOT_DO_R2;
	}else{
		behave.URGENT_CANNOT_DO_P2 = behave2.URGENT_CANNOT_DO_P2;		
		behave.URGENT_CANNOT_DO_R2 = behave2.URGENT_CANNOT_DO_R2;
	}
	//Urgent cannot do Position3
	if(behave1.URGENT_CANNOT_DO_R3 > behave2.URGENT_CANNOT_DO_R3){
		behave.URGENT_CANNOT_DO_P3 = behave1.URGENT_CANNOT_DO_P3;
		behave.URGENT_CANNOT_DO_R3 = behave1.URGENT_CANNOT_DO_R3;
	}else{
		behave.URGENT_CANNOT_DO_P3 = behave2.URGENT_CANNOT_DO_P3;		
		behave.URGENT_CANNOT_DO_R3 = behave2.URGENT_CANNOT_DO_R3;
	}
	//Wait Position1
	if(behave1.WAIT_R1 > behave2.WAIT_R1){
		behave.WAIT_P1 = behave1.WAIT_P1;
		behave.WAIT_R1 = behave1.WAIT_R1;
	}else{
		behave.WAIT_P1 = behave2.WAIT_P1;		
		behave.WAIT_R1 = behave2.WAIT_R1;
	}
	//Wait Position2
	if(behave1.WAIT_R2 > behave2.WAIT_R2){
		behave.WAIT_P2 = behave1.WAIT_P2;
		behave.WAIT_R2 = behave1.WAIT_R2;
	}else{
		behave.WAIT_P2 = behave2.WAIT_P2;		
		behave.WAIT_R2 = behave2.WAIT_R2;
	}
	//Wait Position3
	if(behave1.WAIT_R3 > behave2.WAIT_R3){
		behave.WAIT_P3 = behave1.WAIT_P3;
		behave.WAIT_R3 = behave1.WAIT_R3;
	}else{
		behave.WAIT_P3 = behave2.WAIT_P3;		
		behave.WAIT_R3 = behave2.WAIT_R3;
	}
	
	console.log("behave" + behave);
	return behave;	
}

function execute(req, res, flag) {
	//該当データが存在する場合は、そのデータを取得する。
	dba.connect();
	//Transaction Start
	dba.beginTransaction();
	//Localeの設定
	util.setLocale(req.session.locale);

    async.parallel([
    	function(callback){
    		//Query the selected id behavior list (max 3 lists)
    		var queryString = 'SELECT A.*,B.BEHAVIOR_1,B.BEHAVIOR_2,B.BEHAVIOR_3 FROM SPECIFIC_BEHAVIOR A,(SELECT BEHAVIOR_1,BEHAVIOR_2,BEHAVIOR_3 FROM INDIVISUAL_INFO WHERE SITE_CODE = ? AND CHECK_IN_DATE = ? AND ROOM_NUM=? AND INDIVISUAL_ID = ?) B WHERE A.ID IN(B.BEHAVIOR_1,B.BEHAVIOR_2,B.BEHAVIOR_3)';
    		var param = [req.session.staff.siteCode,req.session.indivisual.checkinDate,req.session.indivisual.roomNo,req.session.staff.indivisualId];

    		dba.selectLists(queryString, param, function(err,result){
	    		if(err){
		    		console.error(err);
		    		req.flash('error',util.getErrorMessage('DBQueryError'));
	    			callback(err,null);
	    		}else{
            		console.log("res" + result);
	        		if((JSON.parse(result)).length === 0){
	            		req.flash(util.getErrorMessage('RecodeNotFoundError')); 
	                    callback(true,result);
	        		}else{
	        			//Change 2018.10.5 new request
	        			if((JSON.parse(result)).length === 1){
	        				var res0 = JSON.parse(result)[0];
		        			callback(null,JSON.stringify(res0));	        				
	        			}else if((JSON.parse(result)).length === 2){
	        				var res = packing2result((JSON.parse(result))[0],(JSON.parse(result))[1]);
	        				callback(null,JSON.stringify(res));
	        			}else if((JSON.parse(result)).length === 3){
	        				var res1 = packing2result((JSON.parse(result))[0],(JSON.parse(result))[1]);
	        				var res2 = packing2result((JSON.parse(result))[2],res1);
	        				console.log("res2" + res2.ID);
	        				callback(null,JSON.stringify(res2));
	        			}else{
	        				//Something Error 
	        				req.flash("Unexpected Error occurs");
	        				callback(true,result);
	        			}
	        		}
	    		}
	    	});
    	},
	],
	function(err, ret){
    	if(err){
    		console.error(err);
    		dba.rollback();
            res.redirect('back');
    	}else{
    		dba.commit();
			res.render(req.params.hotelId + '/guest-lookup/lookup_3', {
		        static_path: '',
		        theme: process.env.THEME || 'flatly',
		        flask_debug: process.env.FLASK_DEBUG || 'false',
		        hotel_id: req.params.hotelId,
		        behavior: JSON.parse(ret),
		        error_msg: req.flash('error')
		    });
		}
		dba.disconnect();
    });    	
}


//POST Request
router.post('/lookup3', auth.authorize(), function(req,res){
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
router.get('/lookup3', auth.authorize(), function(req,res){execute(req,res,false);});

// Prepare for using module as router
module.exports = router;