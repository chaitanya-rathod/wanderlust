//const review = require("./review.js");
//const { listingSchema } = require("../schema");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//const Review=require("./review");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url:String,
        filename:String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    //This is for building filter feature
    // category:{
    //     type:String,
    //     enum:["mountains","arctic","farms",]

    // }
});




const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;


