import { customError } from "../middleware/error.middleware.js";
import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";
import bcrypt from "bcrypt"

const adminRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(customError(403, "name and email required"));
    }
    const existingAdmin = await userModel.findOne({email});
    if (existingAdmin) {
      return next(customError(403, "Email already taken"));
    }
    const hashedPassword = bcrypt.hashSync(password, 10)
    const newAdmin = new userModel({email, role: process.env.ADMINHASHEDCODE, password: hashedPassword })
    await newAdmin.save()
    return res.status(201).json({message: "Admin accounty created successful"})
  } catch (err) {
    next(err);
  }
};
const upgradeUserAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return next(customError(403, "No such user"));
    }
    const { role, ...rest } = user;
    await userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          rest,
          role: process.env.ADMINHASHEDCODE,
        },
      },
      { new: true }
    );
    return res.status(200).json({ message: "Successful" });
  } catch (err) {
    next(err);
  }
};

const addToProductsList = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;
    if (!name || !description || !price || !category || !stock) {
      return next(customError(403, "All product fields are required"));
    }
    const product = await productModel.findOne({ name });
    if (product) {
      return res
        .status(403)
        .json({
          message: "Products has already been added, rather increase the stcok",
        });
    }

    const newProduct = new productModel({
      name,
      description,
      price,
      category,
      stock,
    });
    await newProduct.save();
    return res.status(201).json({ message: "Product added successful" });
  } catch (err) {
    next(err);
  }
};
export { adminRegister, upgradeUserAccount, addToProductsList };
