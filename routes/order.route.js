import express from "express";
import {placeOrder, getAllUserOrder, getOrderById, updateOrderStatus, viewOrders} from "../controllers/order.controller.js";
import { verifyAccess} from "../middleware/auth.middleware.js";

const orderRouter = express.Router()
orderRouter.route("/order/:cartId").post(verifyAccess, placeOrder)
orderRouter.route("/order/:customerId").get(verifyAccess, getAllUserOrder)
orderRouter.route("/order/single/:id").get(verifyAccess,getOrderById)
// Only admin can access this route. It's protected with a middleware to veruify role
orderRouter.route("/order").get(verifyAccess, verifyAccess, viewOrders)


// Both admin and user can access this route however, there is check to limit what user can do in the controller
orderRouter.route("/order/:id/:status").put(verifyAccess,  updateOrderStatus)


export default orderRouter