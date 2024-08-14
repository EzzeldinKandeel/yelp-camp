const express = require("express");
const catchAsync = require("../utils/catchAsync");
const { authenticatedAction, isCampgroundAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const router = express.Router();

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(authenticatedAction, validateCampground, catchAsync(campgrounds.create));
router.get("/new", authenticatedAction, campgrounds.renderCreate);
router.route("/:id")
    .get(catchAsync(campgrounds.read))
    .put(authenticatedAction, isCampgroundAuthor, validateCampground, catchAsync(campgrounds.update))
    .delete(authenticatedAction, isCampgroundAuthor, catchAsync(campgrounds.delete));
router.get("/:id/edit", authenticatedAction, isCampgroundAuthor, campgrounds.renderUpdate);
router.route("/:id/images")
    .get(catchAsync(campgrounds.renderImages))
    .put(authenticatedAction, isCampgroundAuthor, upload.array("images"), catchAsync(campgrounds.updateImages));

module.exports = router;
