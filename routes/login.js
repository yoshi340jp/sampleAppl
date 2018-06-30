var router = require('./menu');

router.get('/login', function(req, res){
    res.render(req.params.hotelId + '/login', {
        static_path: '',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false',
        hotel_id: req.params.hotelId,
        error_msg: req.flash('error')
    });
});

// Prepare for using module as router
module.exports = router;