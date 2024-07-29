const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports = {
    create: async (req, res) => {
        const { campgroundId } = req.params;
        const campground = await Campground.findById(campgroundId);
        const review = new Review(req.body.review);
        review.author = req.user.id;
        campground.reviews.push(review);
        await campground.save();
        await review.save();
        res.redirect(`/campgrounds/${campgroundId}`);
    },
    delete: async (req, res) => {
        const { campgroundId, reviewId } = req.params;
        await Campground.findByIdAndUpdate(campgroundId, {
            $pull: { reviews: reviewId },
        });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted.");
        res.redirect(`/campgrounds/${campgroundId}`);
    }
}