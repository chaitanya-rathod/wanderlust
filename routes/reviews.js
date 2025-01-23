const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isreviewAuthor}=require("../middleware.js");
const review = require("../models/review.js");
// const { listingSchema, reviewSchema } = require("../schema.js");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body.review);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

const reviewController=require("../controllers/reviews");

// Reviews
// Post Review route
router.post("/:id/reviews",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review Route
router.delete("/:id/reviews/:reviewId",isreviewAuthor, wrapAsync(reviewController.destroyReview));
module.exports = router;
