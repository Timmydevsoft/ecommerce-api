import mongoose, {Schema} from "mongoose";
const CartSchema = new mongoose.Schema(
    {
        userId: {type: Schema.Types.ObjectId, ref: "user"},
        totalPrice: {type: Number, required: true},
        items:[
         {
             productId: {type: Schema.Types.ObjectId, ref:"product", required: true},
             quantity:{type: Number, required: true},
             price:{type: Number, required: true}
         }
        ]
     },
     {timestamps: true}
)

const cartModel = new mongoose.model("cart", CartSchema)
export default cartModel

// {
//     "productId" : "", 
//     "quantity": "", 
//     "price": ""
// }