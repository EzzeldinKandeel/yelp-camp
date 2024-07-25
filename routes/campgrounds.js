const express = require("express");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema } = require("../schemas");
const { authenticatedAction } = require("../middleware");

const router = express.Router();

function validateCampground(req, res, next) {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get(
    "/",
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds", { campgrounds });
    })
);
router.get("/new",authenticatedAction, (req, res) => {
    res.render("campgrounds/new");
});
router.get("/:id/edit",authenticatedAction, async (req, res) => {
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
        const campground = await Campground.findById(req.params.id).populate(
            "reviews"
        );
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
        await campground.save();
        req.flash("success", "Campground created.");
        res.redirect(`/campgrounds/${campground.id}`);
    })
);
router.put(
    "/:id",
    authenticatedAction, validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndUpdate(id, req.body.campground);
        req.flash("success", "Edit submitted.");
        res.redirect(`/campgrounds/${id}`);
    })
);
router.delete("/:id",authenticatedAction, catchAsync(async (req, res) => {
        await Campground.findByIdAndDelete(req.params.id);
        req.flash("success", "Campground deleted.");
        res.redirect("/campgrounds");
    })
);

module.exports = router;
