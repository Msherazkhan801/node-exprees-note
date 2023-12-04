import express from "express"
import  { SignUp ,SignIn, profile,addAddressToAllUsers } from "../Controller/User.js"
import { verifyToken } from "../Middelware/verifyToken.js";
import { upload } from "../Middelware/multer.middleware.js";
const app =express()

  app.post("/signup",upload.fields([
    {
      name:"avatar",
      maxCount:1
    },
    {
      name:"coverImage",
      maxCount:1
   
    }
  ]), SignUp);
  app.post("/login", SignIn);
  app.get("/profile/:id",verifyToken,profile)
  app.get("/all-user",verifyToken,addAddressToAllUsers)
  
export default app;
  