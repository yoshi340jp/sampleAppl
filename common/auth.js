// 認可処理。指定されたロールを持っているかどうか判定します。
exports.authorize = function () {
    return function (req, res, next) {
        if (req.user !== null) {
        	if(typeof req.user === 'undefined'){
        		console.log("invalid access");
        		req.flash('error','invalid access');
                res.redirect('/' + req.params.hotelId + '/login'); 
        	}else{
	            return next();
        	}
        }else{
    		req.flash('error','invalid access');
	        console.log("invalid access" + req.user);
	        res.redirect('/' + req.params.hotelId + '/login');
        }
    };
};