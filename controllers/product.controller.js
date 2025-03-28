import productModel from "../models/product.model.js"
const addNewProduct = async(req, res, next)=>{
    console.log("triggered")
    try{
        const{ name, description, price, category, stock} = req.body
        if(!name || !description || !price || !category || !stock){
            return res.status(401).json({message: "All field are required"})
        }
       
        const stockNumber = Number(stock)
        const newProduct = new productModel({
            name, description, price, category, stock: stockNumber
        })

        await newProduct.save()
        return res.status(201).json({message: "New product added successfully"})
    }
    catch(err){
        
    }
}
const deleteProduct = async(req, res, next)=>{
    try{
        const{id}=req.params
        const product = await productModel.findById(id)
        if(!product){
            return res.status(404).json({message: "Product not found"})
        }
        const{name, ...others} = product
        await productModel.findByIdAndDelete(id)
        return res.status(200).json({message: `${name} deleted sucessfully`})
    }
    catch(err){
        next(err)
    }
}
const updateProduct = async(req, res, next)=>{
    try{
        const{ name, description, price, category, stock} = req.body
        if(!name || !description || !price || !category || !stock){
            return res.status(401).json({message: "All field are required"})
        }
        const{id}=req.params
        const product = await productModel.findById(id)
        if(!product){
            return res.status(404).json({message: "Product not found"})
        }
        await productModel.findByIdAndUpdate(
            id,
            {
                $set:{name, description, price, category, stock}
            },
            {new: true}
        )

        res.status(200).json({message: "Product updated successfuly"})
    }
    catch(err){
        next(err)
    }
}

const getAllproduct = async(req, res, next)=>{
    try{
        const products = await productModel.find()
        return res.status(200).json(products)
    }
    catch(err){
        next(err)
    }
}

const getProductsById = async(req, res, next)=>{
    try{
        const{id} = req.params  
        const product = await productModel.findById(id)
        if(!product){
            return res.status(404).json({message: "Product not found"})
        }
        return res.status(200).json(product)
    }
    catch(err){
        next(err)
    }
}

const getByCategory = async(req, res, next)=>{
    try{
        const{value} = req.params
        console.log(value)
        const products = await productModel.find({category: value})
        if(!products){
            return res.status(404).json({message: 'Product not found'})
        }
        return res.status(200).json({products})
    }
    catch(err){
        next(err)
    }
}

export{addNewProduct,updateProduct, deleteProduct,getAllproduct, getProductsById, getByCategory }