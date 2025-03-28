import mongoose from "mongoose";

const CatergorySchema =  mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        description: {type: String, required: true}
    },
    {timestamps: true}
)

const categoryModel = mongoose.model("category", CatergorySchema)
export default categoryModel