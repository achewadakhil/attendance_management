const {Router} = require("express");
const {isValidInp} = require("../middlewares/isValid");
const {isValidAdmin} = require("../middlewares/validAdmin");
const bcrypt = require("bcrypt");
const { adminModel, userModel } = require("../db");
const jwt = require("jsonwebtoken");
const adminRouter = Router();

adminRouter.post("/signup",isValidInp,async (req,res)=>{
    const {email,password,fullname} = req.body;
    await adminModel.create({
        email,
        password : await bcrypt.hash(password,5),
        fullname
    });
    res.json({
        message : "Admin added successfully"
    });
});

adminRouter.post("/signin",isValidInp,async (req,res)=>{
    const {email,password} = req.body;
    const foundUser = await adminModel.findOne({email});
    if(!foundUser){
        res.json({
            message : "Signup before Signin"
        });
    }else{
        const checkPass = await bcrypt.compare(password,foundUser.password);
        if(checkPass){
            res.setHeader("token",jwt.sign({
                id : foundUser._id
            },process.env.JWT_ADMIN_SECRET));
            res.json({
                message : "Admin Signed in successfully"
            });
        }else{
            res.json({
                message : "Password not matched"
            })
        }
    }
});

adminRouter.post("/marks",isValidAdmin,async (req,res)=>{
    const {rollno,examDetails,result} = req.body;
    try{
        const foundUser = await userModel.findOne({rollno : rollno});
        if(!foundUser){
            return res.json({
                message : "Student not found!!"
            });
        }
        //add a feature like if a teacher added a score to a subject then again they could add it
        const formattedResult = result.map(item => { 
            return Object.entries(item).map(([sub, percentage]) => ({ sub, percentage })); 
        }).flat();            
        foundUser.marks.push({
            examDetails,
            result : formattedResult
        });
        await foundUser.save();
        res.status(200).json({
            message : "Student marks updated successfully!!",
            marks : foundUser.marks
        });
    }catch(err){
        res.status(500).json({
            message : "Unable to change"
        })
    }
});
adminRouter.post("/attendance",isValidAdmin,async (req,res)=>{
    const {rollno,present} = req.body;
    try{
        const foundUser = await userModel.findOne({rollno : rollno});
        if(!foundUser){
            return res.json({
                message : "Cant find student with the roll number!!"
            });
        }
        if(present){
            foundUser.attendance++;
        }
        foundUser.total++;
        foundUser.save();
        res.status(200).json({
            message : "Attendance added successfully",
            present : foundUser.attendance,
            total : foundUser.total,
            percentage : parseFloat((foundUser.attendance/foundUser.total*100).toFixed(2))
        });
    }catch(err){
        res.status(403).json({
            message : "Something is wrong!!"
        })
    }
});

adminRouter.get("/student",isValidAdmin,async (req,res)=>{
    const {rollno} = req.body
    try{
        const foundUser = await userModel.findOne({rollno : rollno});
        res.json({
            foundUser
        });
    }catch(err){
        res.json({
            message : "Cannot find the student"
        });
    }
});

module.exports = {
    adminRouter
}