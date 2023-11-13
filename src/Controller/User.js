import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'

export const SignUp=async(req,res)=>{
    const {username, email,fullName,avatar,coverImage,password}=req.body;
    try{
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }
    const salt=await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password,salt)
    const newUser= new User({username,email,fullName,avatar,coverImage,password:hashPassword})
    
        await newUser.save()
        res.status(200).json(newUser)

    }catch(error){
        res.status(500).json(error.message)
    }

}

export const SignIn = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email: email });
  
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
  
        if (isValidPassword) {
          // Generate JWT
          const accessToken = user.generateAccessToken();
        // 
          const refreshToken = user.generateRefreshToken();
  
          res.cookie('access_token', accessToken, { httpOnly: true });
          res.cookie('refresh_token', refreshToken, { httpOnly: true });
  
          res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
            coverImage: user.coverImage,
            watchHistory: user.watchHistory,
          });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const profile = async(req,res)=>{
    const {id}= req.params
    const user=await User.findById(id).lean() //added new object like address
    user.adress="swabi";
 return res.status(200).json({user})
}

export const addAddressToAllUsers = async (req, res) => {
    try {
    //   const updateResult = await User.find({}, { $set: { address: 'swabi' } });
      const data =await User.find().lean() ;
      return res.status(200).json({data });
    } catch (error) {
      console.error('Error adding address to users:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };