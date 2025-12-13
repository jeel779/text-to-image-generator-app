import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  creditbalance: { type: Number, default: 3 },
},{timestamps:true});

const User=mongoose.model.User || mongoose.model('User',userSchema)
export default User