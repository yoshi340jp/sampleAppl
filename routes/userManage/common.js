var express = require('express');
// Routing
var router = express.Router({mergeParams:true});

router.get('/',function(req, res){
    res.redirect('/option/signup');
});	
  
//Prepare for using module as router
module.exports = router;