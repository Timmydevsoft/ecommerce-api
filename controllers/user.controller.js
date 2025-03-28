import { customError } from "../middleware/error.middleware.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

const createAccount = async (req, res, next) => {
  try {
    const { email, userName, password } = req.body;
    const existingAccount = await userModel.findOne({ email });
    if (existingAccount) {
      return next(customError(403, "Email is already taken"));
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newAccount = new userModel({
      email,
      userName,
      password: hashedPassword,
    });
    await newAccount.save();
    return res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    next(err);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.id.toString() !== id.toString()) {
      return res
        .status(401)
        .json({ message: "You can only delete your own account" });
    }

    const user = await userModel.findById(req.id);
    if (!user) {
      return res.status(404).json({ message: "No such user" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "Account deletion successful" });
  } catch (err) {
    next(err);
  }
};

const updateAccount = async (req, res, next) => {
  try {
    const { email, userName, password } = req.body;
    let hashedPassword;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user with such email" });
    }
    if (req.id.toString() !== req.id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own account" });
    }
    hashedPassword = bcrypt.hashSync(password, 10);
    await userModel.findByIdAndUpdate(
      req.id,
      {
        $set: {
          email,
          userName,
          password: hashedPassword,
        },
      },
      { new: true }
    );
  } catch (err) {
    next(err);
  }
};

export { createAccount, deleteAccount, updateAccount };
