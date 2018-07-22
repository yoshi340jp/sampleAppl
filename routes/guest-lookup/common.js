var express = require('express');
// Routing
var router = express.Router({mergeParams:true});
//認証用モジュールのロード
var auth = require(process.cwd() + '/common/auth');

router.get('/',auth.authorize(), function(req, res){
    res.redirect('/' + req.params.hotelId + '/guest-lookup/lookup1');
});	
  
//Prepare for using module as router
module.exports = router;