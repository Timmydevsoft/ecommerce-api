import mongoose, { Schema } from "mongoose";
const ProductSchema = new mongoose.Schema({
    name:{type: String, required:true, unique: true},
    description:{type: String, required:true},
    price: {type: Number, require: true},
    category:{type:String, required: true},
    // category:{type: Schema.Types.ObjectId, ref: "category", required: true}, This is how it's supposed to be as the catergory id will be sent from the clint, however to keek it simple I leave it like this for now till I am ready to build the front end
    stock: {type: Number, required: true},
},{timestamps: true})

const productModel = new mongoose.model("product", ProductSchema)
 
export default productModel


// {
//     "name": "HOT 10 LTE",
//     "description": "Android mobile phone",
//     "category": "Phone"
//     "price": 200000,
//     "stock": 20
  
// }