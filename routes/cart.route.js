import express from "express"
import { addToCart,getCartById, removeItemFromCart, updateItemQuantity, clearCart, getCartItem } from "../controllers/cart.controller.js"
import { verifyAccess, verifyRole } from "../middleware/auth.middleware.js"

const cartRouter = express.Router()

cartRouter.route("/cart").post(verifyAccess, addToCart)
cartRouter.route("/cart").get(verifyAccess, getCartItem)

// a body containing the productId and the newQuantity must be sent along
cartRouter.route("/cart/:action").put(verifyAccess, updateItemQuantity)s
cartRouter.route("/cart/clear").delete(verifyAccess ,clearCart)
cartRouter.route("/cart/:productId").delete(verifyAccess, removeItemFromCart)



// Only admin ca access this route
cartRouter.route("/cart/:id").get(verifyAccess,verifyRole ,getCartById)
export default cartRouter