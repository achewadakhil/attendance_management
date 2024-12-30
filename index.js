require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { studentRouter } = require("./routes/studentRoutes");
const {adminRouter} = require("./routes/adminRoutes");
const {headRouter} = require("./routes/headRoutes")

const app = express();
app.use(express.json());
app.use("/student",studentRouter);
app.use("/admin",adminRouter);
app.use("/head",headRouter);

(async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connection established");
        app.listen(8080,()=>console.log("Server is running at port 8080"));
    }catch(err){
        console.log(err)
    }
})();