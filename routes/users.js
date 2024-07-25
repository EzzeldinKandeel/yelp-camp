const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const { storeReturnTo } = require("../middleware");

const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("users/signup");
});
router.get("/signin", (req, res) => {
    res.render("users/signin");
});
router.get("/signout", (req, res) => {
    req.logout(err => {
        if (err) return next(err);
    });
    req.flash("success", "Successfully signed out.");
    res.redirect("/campgrounds");
})
router.post(
    "/signup", storeReturnTo,
    catchAsync(async (req, res) => {
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username });
            const regUser = await User.register(user, password);
            req.login(regUser, (err) => {
                if (err) return next(err);
                req.flash("success", "Successfully signed up.");
                const redirectUrl = res.locals.returnTo || "/campgrounds";
                res.redirect(redirectUrl);            });
        } catch (err) {
            req.flash("error", err.message);
            res.redirect("/signup");
        }
    })
);
router.post(
    "/signin", storeReturnTo, 
    passport.authenticate("local", {
        failureRedirect: "/signin",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Successfully signed in.");
        const redirectUrl = res.locals.returnTo || "/campgrounds";
        res.redirect(redirectUrl);
    }
);

module.exports = router;
