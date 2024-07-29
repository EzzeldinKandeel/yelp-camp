const Campground = require("./models/campground");
const Review = require("./models/review");
const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");

module.exports.authenticatedAction = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "The action you are attempting requires signing in.");
        return res.redirect("/signin");
    }
    next();
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo)
        res.locals.returnTo = req.session.returnTo;

    next();
}
module.exports.isCampgroundAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (campground.author.toString() !== req.user.id) {
        req.flash("error", "You are not allowed to modify this campground.");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { campgroundId, reviewId } = req.params;
    const review = await Review.findById(ReviewId);
    if (!review.author.toString() !== req.user.id) {
        req.flash("error", "You are not allowed to modify this review");
        return res.redirect(`/campgrounds/${campgroundId}`);
    }
    next();
}
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
