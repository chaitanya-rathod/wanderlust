// const mongoose=require("mongoose");
// const initData=require("./data.js");
// const Listing=require("../models/listing.js");
// const { init } = require("../models/listing");
// const {data}=require("./data.js");
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

// main().then(()=>{
//     console.log("Connected to DB");
// }).catch((err)=>{
//     console.log(err);
// });


// async function main(){
//     await mongoose.connect(MONGO_URL);
// }


// const initDB=async ()=>
// {
//     await Listing.deleteMany({});
//     initData.data= initData.data.map((obj)=>({...obj,owner:"678bf3c23b3f554c41fbefc8",image: obj.image.url}));
//     await Listing.insertMany(initData.data);
//     console.log("Data was initialized");
// }
// initDB();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js"); // Your Listing model
const { data } = require("./data.js"); // Import data from data.js
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; // Database URL

// Function to connect to MongoDB
main().then(() => {
  console.log("Connected to DB");
  initDB(); // Call the initDB function once connected
}).catch((err) => {
  console.log(err);
});

// Async function to connect to the database
async function main() {
  await mongoose.connect(MONGO_URL);
}

// Function to initialize the database with the data
const initDB = async () => {
  await Listing.deleteMany({}); // Delete all existing listings

  // Map through the data and ensure that the full image object is included
  const modifiedData = data.map((obj) => ({
    ...obj,
    owner: "678bf3c23b3f554c41fbefc8", // Set the owner field
    image: obj.image // Keep the full image object (both filename and URL)
  }));

  // Insert the modified data into the Listing collection
  await Listing.insertMany(modifiedData);
  console.log("Data was initialized with images");
};
