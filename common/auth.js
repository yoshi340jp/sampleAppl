//Utilモジュールのロード
var util = require(process.cwd() + '/common/util');
// 認可処理。指定されたロールを持っているかどうか判定します。
exports.authorize = function () {
    return function (req, res, next) {
    	util.setLocale(req.session.locale);
        if (req.user !== null) {
        	if(typeof req.user === 'undefined'){
        		req.flash('error',util.getErrorMessage('AuthError',['']));
                res.redirect('/' + req.params.hotelId + '/login'); 
        	}else{
	            return next();
        	}
        }else{
    		req.flash('error',util.getErrorMessage('AuthError',[req.user]));
	        res.redirect('/' + req.params.hotelId + '/login');
        }
    };
};