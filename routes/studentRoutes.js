const {Router}  = require("express");
const {userModel, complaintModel, adminModel} = require("../db");
const bcrypt = require("bcrypt");
const { isValidInp } = require("../middlewares/isValid");
const { isValidStudent } = require("../middlewares/validStudent");
const jwt = require("jsonwebtoken");
const studentRouter = Router();

studentRouter.post("/signup",isValidInp,async (req,res)=>{
    const {email,password,rollno} = req.body;
    await userModel.create({
        email,
        password : await bcrypt.hash(password,5),
        rollno,
        attendance : 0,
        total : 0
    });
    res.json({
        message : "User added successfully"
    });
});

studentRouter.post("/signin",isValidInp,async (req,res)=>{
    const {email,password} = req.body;
    const foundUser = await userModel.findOne({email});
    if(!foundUser){
        res.json({
            message : "Signup before Signin"
        });
    }else{
        const checkPass = await bcrypt.compare(password,foundUser.password);
        if(checkPass){
            res.setHeader("token",jwt.sign({
                id : foundUser._id
            },process.env.JWT_STUDENT_SECRET));
            res.json({
                message : "Student signed in successfully"
            });
        }else{
            res.json({
                message : "Password not matched"
            })
        }
    }
});

studentRouter.get("/marks",isValidStudent,async (req,res)=>{
    const {examDetails} = req.body;
    const foundUser = await userModel.findOne({ _id : req.userId});
    if(foundUser){
        const resDetails = foundUser.marks.filter(user=>user.examDetails==examDetails);
        res.status(200).json({
            resDetails
        })
    }else{
        res.status(403).json({
            message : "Cannot find user"
        })
    }
});

studentRouter.get("/attendance",isValidStudent,async (req,res)=>{
    try{
        const foundUser = await userModel.findOne({_id : req.userId});
        res.json({
            attendance : foundUser.attendance
        });
    }catch(err){
        res.json({
            message : "Error occurred while getting ur attendance"
        });
    }
});

studentRouter.post("/complaint",isValidStudent,async (req,res)=>{
    const { userId,admin,desc } = req.body;
    try{
        const foundAdmin = await adminModel.findOne({fullname : admin});
        const foundStudent = await userModel.findOne({rollno : userId})
        await complaintModel.create({
            adminId : foundAdmin._id,
            studdentId : foundStudent._id,
            desc
        });
        res.status(200).json({
            message : "Complain registered successfully!!"
        });
    }catch(err){
        res.status(500).json({
            message : "Cannot register your complaint!!"
        });
    }
});
module.exports  ={
    studentRouter 
}