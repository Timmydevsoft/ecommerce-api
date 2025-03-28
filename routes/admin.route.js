import express from "express"
import { verifyAccess, verifyRole } from "../middleware/auth.middleware.js"
import { adminRegister, upgradeUserAccount } from "../controllers/admin.controler.js"


const adminRouter = express.Router()
adminRouter.route("/admin/register").post(adminRegister)
adminRouter.route("/promote/:id").put(verifyAccess, verifyRole, upgradeUserAccount)
export default adminRouter