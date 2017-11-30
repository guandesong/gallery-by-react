module.exports = function(app) {
    app.get('/', function (req, res,next) {
        if(!req.session.user){
            return res.render('login',{});
        }
        res.render('index',{});
    });
};