const Listing=require("./models/listing");
const Review=require("./models/review");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}


// module.exports.isOwner=async(req,res,next)=>{
//     let { id } = req.params;
//     let listing=await Listing.findById(id).populate('owner');//means if any non authorized id trying to update the listing then it restricts.
//     if(!listing.owner._id.equals(res.locals.currUser._id)){
//         req.flash("error","You are not a owner of this listing ");
//         return res.redirect(`/listings/${id}`);
//     }
// }
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    try {
        let listing = await Listing.findById(id).populate('owner'); // Populate the owner field
        
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        // Ensure that owner exists and then check ownership
        if (!listing.owner || !listing.owner._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        req.flash("error", "An error occurred while checking ownership");
        return res.redirect(`/listings/${id}`);
    }
};


//will sort out later 

module.exports.saveRedirectUrl=(req,res,next)=>{
    if (req.session && req.session.redirectUrl) {  // Ensure req.session is defined
        res.locals.redirectUrl = req.session.redirectUrl;
        //delete req.session.redirectUrl; // Clean up the session after redirect
    }
    next();
}

module.exports.isreviewAuthor = async (req, res, next) => {
    let {id, reviewId } = req.params;
    try {
        let review = await Review.findById(reviewId); // Populate the owner field
        // Ensure that owner exists and then check ownership
        if (!review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "You didnt create this review");
            return res.redirect(`/listings/${id}`);
        }

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        req.flash("error", "An error occurred while checking ownership");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
