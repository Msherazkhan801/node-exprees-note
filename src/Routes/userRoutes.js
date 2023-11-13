import express from "express"
import  { SignUp ,SignIn, profile,addAddressToAllUsers } from "../Controller/User.js"
import { verifyToken } from "../Middelware/verifyToken.js";
const app =express()

  app.post("/signup", SignUp);
  app.post("/login", SignIn);
  app.get("/profile/:id",verifyToken,profile)
  app.get("/all-user",verifyToken,addAddressToAllUsers)
  
export default app;
  