import express from "express"
import { verifyAccess, verifyRole } from "../middleware/auth.middleware.js"
import {  addCateGory,deleteCategory,getCategory, getCategoryById, updateCategory } from "../controllers/category.controller.js"
const categoryRouter = express.Router()
categoryRouter.route("/category").post(verifyAccess,verifyRole, addCateGory)
categoryRouter.route("/category").get(verifyAccess, verifyRole, getCategory)
categoryRouter.route("/category/:id").get(verifyAccess, verifyRole, getCategoryById)
categoryRouter.route("/category/:id").put(verifyAccess, verifyRole, updateCategory)
categoryRouter.route("/category/:id").delete(verifyAccess, verifyRole, deleteCategory)
export default categoryRouter