import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
import { customError } from "../middleware/error.middleware.js";
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String, required: true },
    role: {
      type: String,
      enum: [process.env.ADMINHASHEDCODE, process.env.CUSTOMERHASHEDCODE],
      default: process.env.CUSTOMERHASHEDCODE,
    },
  },
  { timestamps: true }
);

UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const orderModel = mongoose.model("order");
      const cartModel = mongoose.model("cart");

      const orders = await orderModel.find({ customerId: this._id });
      let orderNuber;
      if (orders.length === 0) {
        await cartModel.deleteMany({ userId: this._id });
        next();
      } else {
        orderNuber = orders.length;
        if (orderNuber > 0) {
          const statusArray = orders.map((items) => items.status);
          if (
            statusArray.includes("Pending") ||
            statusArray.includes("Shipped")
          ) {
            return next(customError(403, "You have active orders"));
            
          } else {
            await orderModel.deleteMany({ customerId: this._id });
            next()
          }
        }
        next();
      }
    } catch (err) {
      next(err);
    }
  }
);
const userModel = new mongoose.model("user", UserSchema);
export default userModel;
