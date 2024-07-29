const Campground = require("../models/campground");

module.exports = {
    index: async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds", { campgrounds });
    },
    renderCreate: (req, res) => {
        res.render("campgrounds/new");
    },
    renderUpdate: async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            req.flash("error", "Campground does not exist");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", { campground });
    },
    read: async (req, res) => {
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
    },
    create: async (req, res) => {
        const campground = new Campground(req.body.campground);
        campground.author = req.user.id;
        await campground.save();
        req.flash("success", "Campground created.");
        res.redirect(`/campgrounds/${campground.id}`);
    },
    update: async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndUpdate(id, req.body.campground);
        req.flash("success", "Edit submitted.");
        res.redirect(`/campgrounds/${id}`);
    },
    delete: async (req, res) => {
        await Campground.findByIdAndDelete(req.params.id);
        req.flash("success", "Campground deleted.");
        res.redirect("/campgrounds");
    }
};