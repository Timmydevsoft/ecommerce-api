import { customError } from "../middleware/error.middleware.js";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import bcrypt from "bcrypt";

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, price } = req.body;
    if (!productId || !quantity || !price) {
      return next(customError(403, "All field sre required"));
    }
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404, "Selected item is out of stock");
    }

    if (product.stock < quantity) {
      return res
        .status(403)
        .json({ success: false, message: "Product quantity exceeds stock" });
    }

    const cart = await cartModel.findOne({ userId: req.id });
    if (cart) {
      const { items, _id, totalPrice, ...rest } = cart;
      let existingItem;
      let newTotalPrice;
      const index = items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );
      if (index < 0) {
        const newItem = { productId, quantity, price };
        items.push(newItem);
        newTotalPrice =
          Number(totalPrice) + Number(product.price) * Number(quantity);
      } else {
        existingItem = items[index];
        let newQuantity = Number(existingItem.quantity) + Number(quantity);
        newTotalPrice =
          Number(totalPrice) +
          Number(existingItem.quantity) * Number(existingItem.price);
        items.splice(index, 1, { quantity: newQuantity, productId, price });
      }
      await cartModel.findByIdAndUpdate(
        _id,
        { rest, totalPrice: newTotalPrice, items },
        { new: true }
      );
      return res.status(200).json({ message: "Successful" });
    } else {
      // const totalPrice = Number(product.price) * Number(quantity)
      const newCart = new cartModel({
        userId: req.id,
        totalPrice: Number(quantity) * Number(price),
        items: [{ productId, quantity, price }],
      });
      await newCart.save();
      return res.status(200).json({ message: "Successful" });
    }
  } catch (err) {
    next(err);
  }
};

const getCartItem = async (req, res, next) => {
  try {
    const user = req.id;
    const isAdmin = bcrypt.compareSync(process.env.ADMINCODE, req.role);
    if (!isAdmin) {
      const cartList = await cartModel
        .findOne({ userId: user })
        .populate({
          path: "items.productId",
          select: ["name", "price", "-_id"],
        });
      if (!cartList) {
        return res.status(404).json({ message: "Your cart is empty" });
      }
      // need to do some .populate here
      return res.status(200).json(cartList);
    }
    // Only admin can get this response
    const carts = await cartModel.find();
    return res.status(200).json(carts);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Updating the quantity of an item already added to cart
const updateItemQuantity = async (req, res, next) => {
  try {
    const { quantity, productId } = req.body;
    if (!quantity || !productId) {
      return res
        .status(403)
        .json({ message: "ProductId and Quantity required" });
    }
    // check the availability of the product
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404, "Selected item is out of stock");
    }
    // check if the user really have a cart
    const cart = await cartModel.findOne({ userId: req.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const { totalPrice, items, _id, ...others } = cart;
    // filter the location of the target item in the cart
    const index = items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );
    if (index < 0) {
      return res.status(404).json({ message: "The item is not in cart" });
    }
    let newQuantity;

    let newTotalPrice;
    let targetItem = items[index];

    const { action } = req.params;

    const allowedAction = process.env.ACTIONARRAY.split(" ");

    // check the action params from the url {add or reduce}
    if (!allowedAction.includes(action)) {
      return res.status(403).json({ message: "Invalid action parameter" });
    }

    if (action === "add") {
      newQuantity = Number(targetItem.quantity) + Number(quantity);
      newTotalPrice =
        Number(totalPrice) + Number(quantity) * Number(targetItem.price);
    } else {
        // reduce the quantity
      newQuantity = Number(targetItem.quantity) - Number(quantity);
      if (newQuantity <= 0) {
        return res
          .status(403)
          .json({ message: "Invalid quantity to be removed" });
      }
      newTotalPrice =
        Number(totalPrice) - Number(quantity) * Number(targetItem.price);
    }

    // update algorithm
    let newItem = { quantity: newQuantity, productId, price: targetItem.price };
    items.splice(index, 1, newItem);
    await cartModel.findByIdAndUpdate(
      _id,
      {
        $set: { items, totalPrice: newTotalPrice, others },
      },
      { new: true }
    );
    res.status(200).json({ items, totalPrice: newTotalPrice, others });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getCartById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cart = await cartModel.findById(id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    return res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};

const removeItemFromCart = async (req, res, next) => {
  try {
    //
    const { productId } = req.params;
    const cart = await cartModel.findOne({ userId: req.id });
    if (!cart) {
      return res.status(403).json({ message: "You dont have item in cart" });
    }

    const { totalPrice, items, _id, ...others } = cart;
    const index = items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );
    if (index < 0) {
      return res.status(404).json({ message: "No such item in cart" });
    }
    let itemToremove = items[index];
    const lessPrice =
      Number(itemToremove?.price) * Number(itemToremove?.quantity);
    let newPrice = totalPrice - lessPrice;
    items.splice(index, 1);
    await cartModel.findByIdAndUpdate(
      _id,
      { totalPrice: newPrice, items, others },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Item removed from cart updated successfully" });
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    console.log("fired");
    const user = req.id;
    const cart = await cartModel.findOne({ userId: user });
    if (!cart) {
      return res.status(404).json({ messsage: "You dont have cart" });
    }
    await cart.deleteOne();
    return res.status(200).json({ message: "Cart cleared successful" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export {
  addToCart,
  getCartItem,
  getCartById,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
};
