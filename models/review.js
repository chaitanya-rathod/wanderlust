const mongoose =require("mongoose");
const Schema=mongoose.Schema;

//One to many (1 x n) because listing connected to many reviews
const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

module.exports=mongoose.model("Review",reviewSchema);