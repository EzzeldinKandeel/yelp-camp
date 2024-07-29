const express = require("express");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { authenticatedAction, isCampgroundAuthor, validateCampground } = require("../middleware");

const router = express.Router();

router.get(
    "/",
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds", { campgrounds });
    })
);
router.get("/new", authenticatedAction, (req, res) => {
    res.render("campgrounds/new");
});
router.get("/:id/edit", authenticatedAction, isCampgroundAuthor, async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Campground does not exist");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
});
router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id).populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        }).populate("author");
        if (!campground) {
            req.flash("error", "Campground does not exist");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { campground });
    })
);

router.post(
    "/",
    authenticatedAction, validateCampground,
    catchAsync(async (req, res) => {
        const campground = new Campground(req.body.campground);
        campground.author = req.user.id;
        await campground.save();
        req.flash("success", "Campground created.");
        res.redirect(`/campgrounds/${campground.id}`);
    })
);
router.put(
    "/:id",
    authenticatedAction, isCampgroundAuthor, validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndUpdate(id, req.body.campground);
        req.flash("success", "Edit submitted.");
        res.redirect(`/campgrounds/${id}`);
    })
);
router.delete("/:id", authenticatedAction, isCampgroundAuthor, catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Campground deleted.");
    res.redirect("/campgrounds");
})
);

module.exports = router;
