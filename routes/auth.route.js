import express from "express"
import { signIn} from "../controllers/auth.controller.js"
import { verifyDetails } from "../middleware/error.middleware.js"
import { verifyCookie } from "../middleware/auth.middleware.js"

const authRouter = express.Router()
authRouter.route("/signin").post(verifyDetails, signIn)
authRouter.route("/refresh").get(verifyCookie, signIn)
export default authRouter


