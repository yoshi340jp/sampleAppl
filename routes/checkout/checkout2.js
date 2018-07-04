var router = require('./checkout3');
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');

//async モジュールのインポート
var async = require('async');

//DB用モジュールのロード
var dba = require(process.cwd() + '/common/dba');

function execute(req, res, flag) {
	//該当データが存在する場合は、そのデータを取得する。
	//存在しない場合は、新規作成する。
	dba.connect();

    async.waterfall([
    	function(callback){
    		if(flag){
	    		var queryString = "SELECT * FROM INDIVISUAL_INFO WHERE SITE_CODE = ? AND CHECK_IN_DATE = ? AND ROOM_NUM=? AND INDIVISUAL_ID = ?";
	    		var param = [req.session.indivisual.siteCode,req.session.indivisual.checkinDate,req.session.indivisual.roomNo,req.session.indivisual.indivisualId];
	
	    		dba.selectPK(queryString, param, function(err,result){
	    			if(err){
	    				console.log("err" + err + result);
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
    			callback(err,result,false,null);
    		}
    		console.log("res" + result);
			if(!result && typeof result === 'undefined'){
	    		var queryString2 = "INSERT INTO INDIVISUAL_INFO (SITE_CODE,CHECK_IN_DATE,ROOM_NUM,INDIVISUAL_ID,GENDER,CRE_DATE,CRE_USER)VALUES(";
	    		queryString2 +=	"?,?,?,?,?,now(),?)";
	    		var param2 = [req.session.indivisual.siteCode,req.session.indivisual.checkinDate ,req.session.indivisual.roomNo,req.session.indivisual.indivisualId,req.session.indivisual.gender,req.session.indivisual.operator];
	    
	    		dba.insert(queryString2, param2, function(err,result){
	    			if(err){
	    				console.log(err);
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
    		console.log(err);
    		req.flash('error',err.sqlMessage);
            res.redirect('back');
    	}else{
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
	var errflag = false;
	if(req.body.roomNo) {
		req.session.indivisual.roomNo = req.body.roomNo;		  
		if(isNaN(req.body.roomNo)){
			req.flash('error','ルームNoは数字で入力してください。¥n');
			errflag = true;		  
		}
	}else{
		req.flash('error','ルームNoを入力してください。¥n');
		errflag = true;		  	  
	}

	if(req.body.checkinDate) {
		req.session.indivisual.checkinDate = req.body.checkinDate;		  
		if(isNaN(req.body.checkinDate)){
			req.flash('error','チェックイン日はyyyymmddの形式で入力してください。¥n');
			errflag = true;		  
		}
	}else{
		req.flash('error','チェックイン日を入力してください¥n');
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