var router = require('./lookup3');
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
    		var queryString = "SELECT ID, BEHAVIOR_VAL, SHORT_DESCRIPTION FROM SPECIFIC_BEHAVIOR A,(SELECT BEHAVIOR_1,BEHAVIOR_2,BEHAVIOR_3 FROM INDIVISUAL_INFO WHERE SITE_CODE = ? AND CHECK_IN_DATE = ? AND ROOM_NUM=? AND INDIVISUAL_ID = ?) B WHERE A.ID IN(B.BEHAVIOR_1,B.BEHAVIOR_2,B.BEHAVIOR_3)";
    		var param = [req.session.indivisual.siteCode,req.session.indivisual.checkinDate,req.session.indivisual.roomNo,req.session.indivisual.indivisualId];

    		dba.selectLists(queryString, param, function(err,result){
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
    		if((JSON.parse(result)).length === 0){
        		req.flash('error',"レコードが存在しません");    			
                res.redirect('back');
    		}else{
			    res.render(req.params.hotelId + '/guest-lookup/lookup_2', {
			        static_path: '',
			        theme: process.env.THEME || 'flatly',
			        flask_debug: process.env.FLASK_DEBUG || 'false',
			        hotel_id: req.params.hotelId,
			        behaviorList: JSON.parse(result),
			        error_msg: req.flash('error')
			    });
    		}
    	}
		dba.disconnect();
    });    	
}

//POST Request
router.post('/lookup2', auth.authorize(), function(req,res){
	var errflag = false;
	if(req.body.roomNo) {
		req.session.indivisual.roomNo = req.body.roomNo;		  
		if(isNaN(req.body.roomNo)){
			req.flash('error','ルームNoは数字で入力してください。<BR/>');
			errflag = true;		  
		}
	}else{
		req.flash('error','ルームNoを入力してください。<BR/>');
		errflag = true;		  	  
	}

	if(req.body.checkinDate) {
		req.session.indivisual.checkinDate = req.body.checkinDate;		  
		if(isNaN(req.body.checkinDate)){
			req.flash('error','チェックイン日はyyyymmddの形式で入力してください。<BR/>');
			errflag = true;		  
		}
	}else{
		req.flash('error','チェックイン日を入力してください<BR/>');
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