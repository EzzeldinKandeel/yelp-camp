const express = require("express");
const catchAsync = require("../utils/catchAsync");
const { authenticatedAction, isReviewAuthor, validateReview } = require("../middleware");
const reviews = require("../controllers/reviews");

const router = express.Router({ mergeParams: true });

router.post("/", authenticatedAction, validateReview, catchAsync(reviews.create));
router.delete("/:reviewId", authenticatedAction, isReviewAuthor, catchAsync(reviews.delete));

module.exports = router;
