import express from "express";
import { getAllproduct, getProductsById, addNewProduct, updateProduct, deleteProduct, getByCategory} from "../controllers/product.controller.js";
import { verifyAccess, verifyRole } from "../middleware/auth.middleware.js";

const productRouter = express.Router()
productRouter.route("/product").get(getAllproduct)
productRouter.route("/product/category/:value").get(getByCategory)
productRouter.route("/product/:id").get(getProductsById)

// Admin specific route, user cant access this route because of the middleware for role verification
productRouter.route("/product").post(verifyAccess, verifyRole ,addNewProduct)
productRouter.route("/product/:id").put(verifyAccess, verifyRole ,updateProduct)
productRouter.route("/product/:id").delete(verifyAccess, verifyRole ,deleteProduct)
export default productRouter