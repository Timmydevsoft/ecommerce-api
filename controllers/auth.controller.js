import jwt from "jsonwebtoken";
import { customError } from "../middleware/error.middleware.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isAuser = await userModel.findOne({ email });
    if (!isAuser) {
      return next(customError(403, "It's not a valid account or  wrong email"));
    }
    const isAvalidUser = bcrypt.compareSync(password, isAuser.password);
    if (!isAvalidUser) {
      return next(customError(401, "Invalid password"));
    }

    const accessToken = jwt.sign({ id: isAuser._id, role: isAuser.role }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    // const accessToken = jwt.sign({ id: isAuser._id }, process.env.SECRET_KEY, {
    //   expiresIn: "1h",
    // });
    const refreshToken = jwt.sign(
      { id: isAuser._id },
      process.env.REFRESH_KEY,
      { expiresIn: "7d" }
    );

    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ successfull: true, token: accessToken });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

const getRefresh = async (req, res, next) => {
  try {
    const accessToken = jwt.sign({ id: isAuser._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.status(200).json({ accessToken: accessToken });
  } catch (err) {
    next(err);
  }
};
export { signIn, getRefresh };
