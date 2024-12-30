const {Router} = require("express");

const headRouter = Router();

headRouter.post("signup",(req,res)=>{
    res.json({
        message : "/head/signup"
    });
});

headRouter.post("/signin",(req,res)=>{
    res.json({
        message : "/head/signin"
    });
});
headRouter.get("/student",(req,res)=>{
    res.json({
        message : "/head/student"
    });
});

headRouter.get("/teacher",(req,res)=>{
    res.json({
        message : "/head/teacher"
    });
});

headRouter.post("/exams",(req,res)=>{
    res.json({
        message : "/head/exams"
    });
});

module.exports = {
    headRouter
}