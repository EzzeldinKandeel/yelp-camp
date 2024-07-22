const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("users/signup");
});
router.get("/signin", (req, res) => {
    res.render("users/signin");
});
router.post(
    "/signup",
    catchAsync(async (req, res) => {
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username });
            const regUser = await User.register(user, password);
            req.login(regUser, (err) => {
                if (err) return next(err);
                req.flash("success", "Successfully signed up.");
                res.redirect("/campgrounds");
            });
        } catch (err) {
            req.flash("error", err.message);
            res.redirect("/signup");
        }
    })
);
router.post(
    "/signin",
    passport.authenticate("local", {
        failureRedirect: "/signin",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Successfully signed in.");
        res.redirect("/campgrounds");
    }
);

module.exports = router;
