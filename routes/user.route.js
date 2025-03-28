import express from "express"
import { verifyAccess, verifyCookie } from "../middleware/auth.middleware.js"
import { createAccount, deleteAccount } from "../controllers/user.controller.js"
import { verifyDetails } from "../middleware/error.middleware.js"


const userRouter = express.Router()

userRouter.route("/user").post(verifyDetails, createAccount)
userRouter.route("/user/:id").put(verifyDetails, verifyAccess)
userRouter.route("/user/:id").delete(verifyAccess ,deleteAccount)

export default userRouter