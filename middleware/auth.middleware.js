import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import {customError} from "./error.middleware.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt"

const verifyAccess = async(req, res, next)=>{
  try{
    const authHeader = req.headers.authorization || req.headers.Authorization
    let accessToken
    if(authHeader && authHeader.startsWith("Bearer ")){
      accessToken = authHeader.split(" ")[1]
      jwt.verify(
        accessToken, 
        process.env.SECRET_KEY,
        async( err, decoded)=>{
          if(err){
            return next(customError(403, "Not authorized"))
          }
          const isAuser = await userModel.findById(decoded.id)
          if(!isAuser){
            return next(customError(401, "You are not a valid user"))
          }
          req.id = decoded.id
          req.role = decoded.role
          next()
        }
      )
    }else{
      return res.status(401).json({message: "No valid authorization header"})
    }

  }
  catch(err){
    next(customError(403, err.message))
  }
}

const verifyCookie = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json("No credentials");
    jwt.verify(
      refreshToken,
      process.env.REFRESH_KEY,
      async (err, decoded) => {
        if(err){
        
          return res.status(400).json("Not a valid user")
        }
        const user = await User.findById(decoded.id)
        if(!user) return next(customError(401, "You are not authorized"))
        req.id = user._id
       next()
      }
    );
  } catch (err) {
    next(err)
    console.log(err)
  }
};
const verifyRole = async (req, res, next) => {
  try {
      let role = process.env.ADMINCODE
      const isAnAdmin = bcrypt.compareSync(role, req.role)
      if (!isAnAdmin) {
          return res.status(403).json({ message: "Forbidden action" })
      }
      next()
  }
  catch (err) {
      next(err)
  }
}
export{verifyAccess, verifyCookie, verifyRole}
