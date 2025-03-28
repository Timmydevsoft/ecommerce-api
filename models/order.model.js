import mongoose, { Schema } from "mongoose";
import { customError } from "../middleware/error.middleware.js";


const orderSchema = new mongoose.Schema(
    {
        customerId: { type: Schema.Types.ObjectId, ref: "user" },
        totalPrice: { type: Number, required: true },
        status: { type: String, enum: ["Pending", " Shipped", "Delivered", "Canceled"], default: "Pending" },

        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "product", required: true },
                quantity: { type: Number, required: true },
            }
        ]
    },
    { timestamps: true }
)

orderSchema.post("save", async function(doc, next){
    try{
        const cartModel = mongoose.model("cart")
        
        const productModel = mongoose.model("product")
        
        for(let item of this.items){
            const product = await productModel.findById(item.productId)
            if(product.stock < item.quantity){
                return next(customError(403, `No enough ${product.name} in stock`))
            }
            product.stock -=item.quantity
            await product.save()
        }
        await cartModel.deleteOne({userId: doc.customerId})
        next()
    }
    catch(err){
        next(customError(403, "Error clearing cart after making order"))
    }
}
)

const orderModel = mongoose.model("order", orderSchema)
export default orderModel