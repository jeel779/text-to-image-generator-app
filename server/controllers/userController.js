import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const registerUser=async(req,res)=>{
  try {
    const {name,email,password}=req.body
    if(!name || !email || !password){
      return res.json({success:false,message:"Please enter all the values"})
    }
    let existringUser=await User.findOne({email})
    if(existringUser) return res.status(400).json({msg:"user already exist"})
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)

    const userData={
      name,
      email,
      password:hashedPassword
    }
    const newUser=new User(userData)
    const user=await newUser.save()
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})
    res.json({success:true,token,user:{name:user.name}})
  } catch (error) {
    console.log(error) 
    res.status(500).json({success:false,message:error.message})
  }
}
const loginUser=async(req,res)=>{
  try{
   const {email,password}=req.body
    if( !email || !password){
      return res.status(400).json({success:false,message:"Please enter all the values"})
    }
    const user=await User.findOne({email})
    if(!user){
      return res.json({success:false,message:"User does not exist"})
    }
    const isMatch=bcrypt.compare(password,user.password)
    if(isMatch){
      const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})
      res.json({success:true,token,user:{name:user.name}})
    }else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  }catch(error){
     console.log(error) 
    res.status(500).json({success:false,message:error.message})
  }

}

const userCredits = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    res.json({
      success: true,
      credits: user.creditBalance,
      user: {
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export {registerUser,loginUser,userCredits}