const User = require("../models/user");

module.exports = {
    renderSignup: (req, res) => {
        res.render("users/signup");
    },
    renderSignin: (req, res) => {
        res.render("users/signin");
    },
    signout: (req, res) => {
        req.logout(err => {
            if (err) return next(err);
        });
        req.flash("success", "Successfully signed out.");
        res.redirect("/campgrounds");
    },
    signup: async (req, res) => {
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username });
            const regUser = await User.register(user, password);
            req.login(regUser, (err) => {
                if (err) return next(err);
                req.flash("success", "Successfully signed up.");
                const redirectUrl = res.locals.returnTo || "/campgrounds";
                res.redirect(redirectUrl);
            });
        } catch (err) {
            req.flash("error", err.message);
            res.redirect("/signup");
        }
    },
    signin: (req, res) => {
        req.flash("success", "Successfully signed in.");
        const redirectUrl = res.locals.returnTo || "/campgrounds";
        res.redirect(redirectUrl);
    }
}