const {z} = require("zod");

function isValidInp(req,res,next){
    const inpValid = z.object({
        email : z.string().email(),
        password : z.string().min(3).max(100)
    });
    const isCorrect = inpValid.safeParse(req.body);
    if(isCorrect.success){
        next();
    }else{
        res.json({
            message : "Invalid"
        });
    }
}
module.exports = {
    isValidInp
}