if(process.env.NODE_ENV !="productio"){
    require('dotenv').config();

}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const listingRoutes = require("./routes/listing.js"); // Import routes for listings
// const reviewsRoutes = require("./routes/reviews.js"); // Import routes for reviews
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js")
// const Listing = require("./models/listing.js");
const session =require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const { error } = require('console');

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600, //24 hrs
}); 

store.on("error",()=>{
    console.log("ERROR in mongo session store",err);
});

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

//Use to create mongo store

// Root Route
// app.get("/", (req, res) => {
//     res.send("Hi I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


//User related data storing is searialize 
passport.serializeUser(User.serializeUser());
////User related data removing  is desearialize 
passport.deserializeUser(User.deserializeUser());



// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.use("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"chaitanya-rathod"
//     });
//    let registeredUser= await User.register(fakeUser,"helloworld");
//    res.send(registeredUser);

// });

// Listings Route Handling
app.use("/listings", listingRouter);

// Reviews Route Handling (add reviews to specific listing)
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

// Handle non-existent routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
