const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");


const userSchema=new Schema({
    //define only email because username and password is automatically dafined by passportLocalSchema.
    email:{
        type:String,
        required:true
    }
});

//This implement automatically (Hashing,salting,etc...) by below pluign
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema);