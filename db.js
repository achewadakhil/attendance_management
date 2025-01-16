const mongoose = require("mongoose");
const { number } = require("zod");
const { Schema , ObjectId } = mongoose;

const resultSchema = new Schema({
    sub : String,
    percentage : Number
},{_id : false});
const marksSchema = new Schema({
    examDetails : String,
    result : [resultSchema]
},{_id:false});
const userSchema = new Schema({
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {type : String,required: true},
    rollno : {type:String,required:true,unique:true},
    marks:[marksSchema],
    attendance : Number,
    total : Number
});

const adminSchema = new Schema({
    email : {
        type : String,
        unique : true
    },
    password : String,
    fullname : {type :String,required : true}
});

const complaintSchema = new Schema({
    //Work on this not yet completed
    adminId : ObjectId,
    studdentId : ObjectId,
    desc : String
});

const userModel = mongoose.model("Students",userSchema);
const adminModel = mongoose.model("Teachers",adminSchema);
const complaintModel = mongoose.model("Complants",complaintSchema);

module.exports = {
    userModel,
    adminModel,
    complaintModel
}