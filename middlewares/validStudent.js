const jwt = require("jsonwebtoken");

function isValidStudent(req,res,next){
    const token = req.headers.token;
    try{
        const decodedUser = jwt.verify(token,process.env.JWT_STUDENT_SECRET);
        if(decodedUser){
            req.userId = decodedUser.id;
            next();
        }else{
            res.json({
                message : "Invalid token"
            })
        }
    }catch(err){
        res.json({
            message : "Token is incorrect"
        })
    }
}   
module.exports = {
    isValidStudent
}