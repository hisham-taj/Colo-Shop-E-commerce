function isAuthenticated(req,res,next) {
    if(req.session.isAuth){
        next();
    }else{
        res.redirect('/admin/admin-login');
    }
}
module.exports = isAuthenticated;
