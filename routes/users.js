const express = require("express");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");

const router = express.Router();

router.route("/signin")
    .get(users.renderSignin)
    .post(
        storeReturnTo,
        passport.authenticate("local", { failureRedirect: "/signin", failureFlash: true }),
        users.signin
    );
router.route("/signup")
    .get(users.renderSignup)
    .post(storeReturnTo, catchAsync(users.signup));
router.get("/signout", users.signout);

module.exports = router;
