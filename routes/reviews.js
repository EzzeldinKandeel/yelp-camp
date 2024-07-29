const express = require("express");
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const { authenticatedAction, isReviewAuthor, validateReview } = require("../middleware");

const router = express.Router({ mergeParams: true });

router.post(
    "/",
    authenticatedAction, validateReview,
    catchAsync(async (req, res) => {
        const { campgroundId } = req.params;
        const campground = await Campground.findById(campgroundId);
        const review = new Review(req.body.review);
        review.author = req.user.id;
        campground.reviews.push(review);
        await campground.save();
        await review.save();
        res.redirect(`/campgrounds/${campgroundId}`);
    })
);
router.delete("/:reviewId", authenticatedAction, isReviewAuthor, catchAsync(async (req, res) => {
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
