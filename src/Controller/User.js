import { User } from "../models/user.model.js"
// import bcrypt from 'bcryptjs'
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js"
export const SignUp = async (req, res) => {
  const { username, email, fullName, password } = req.body;
  if ([username, email, fullName, password].some((item) => item.trim() === "")) {
    throw new ApiError(400, "required all field")
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "user already exist")

  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req?.files?.coverImage[0]?.path;
  // console.log(avatarLocalPath,"<==");
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar must be required")

  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // console.log(avatar,coverImage,"<<<===");
  const newUser = await User.create({
    username,
    email,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    password
  })

  const createdUser = User.findById(newUser._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    // throw new ApiError(409, "something went wrong")
    throw new ApiError(400, "avatar must be required")

  }

    return res.status(200).json(
      new ApiResponse(200, createdUser, "user created successfully")
  )

}

export const SignIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    console.log(email, "email");
    if (user) {
      // const isValidPassword = await bcrypt.compare(password, user.password);
      const isValidPassword = user.isPasswordCorrect(user.password);
      console.log(isValidPassword, "isValid");
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

export const profile = async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id).lean() //added new object like address
  user.adress = "swabi";
  return res.status(200).json({ user })
}

export const addAddressToAllUsers = async (req, res) => {
  try {
    //   const updateResult = await User.find({}, { $set: { address: 'swabi' } });
    const data = await User.find().lean();
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Error adding address to users:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};