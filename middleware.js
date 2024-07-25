module.exports.authenticatedAction = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "The action you are attempting requires signing in.");
        return res.redirect("/signin");
    }
    next();
}
module.exports.storeReturnTo = (req, res, next) => {
    if(req.session.returnTo) 
        res.locals.returnTo = req.session.returnTo;

    next();
}