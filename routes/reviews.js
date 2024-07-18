const express = require("express");
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas");

const router = express.Router({ mergeParams: true });

function validateReview(req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post(
    "/",
    validateReview,
    catchAsync(async (req, res) => {
        const { campgroundId } = req.params;
        const campground = await Campground.findById(campgroundId);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        await campground.save();
        await review.save();
        res.redirect(`/campgrounds/${campgroundId}`);
    })
);
router.delete(
    "/:reviewId",
    catchAsync(async (req, res) => {
        const { campgroundId, reviewId } = req.params;
        await Campground.findByIdAndUpdate(campgroundId, {
            $pull: { reviews: reviewId },
        });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted.");
        res.redirect(`/campgrounds/${campgroundId}`);
    })
);

module.exports = router;
