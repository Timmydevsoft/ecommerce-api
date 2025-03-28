import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const placeOrder = async (req, res, next) => {
  try {
    // first get the user sos as to use his/her email to make payment
    const user = await userModel.findById(req.id);
    const { cartId } = req.params;
    const cart = await cartModel.findById(cartId);
    // check if the user really have any cart records in db
    if (!cart) {
      return res.status(400).json({ message: "No item in cart to order" });
    }

    const { totalPrice, items, ...others } = cart;

    //After Payment Initiation sucessful, trheres no way to confirm payment since no front end.
    // I have to manually initiate payment manually for a user then open the call back url from paystack to approve the payment na dthen copy the authorization code for subsequent payment

    // Proceed to payment.
    const response = await axios.post(
      process.env.PAYSTACK_PAYMENT_URL,
      {
        email: user.email,
        amount: totalPrice * 100,
        authorization_code: process.env.PAYMENT_AUTHORIZATION_CODE,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTSACK_TEST_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // check if payment was successful
    if (!response.data.status) {
      return res
        .status(403)
        .json({ message: "Error making payment", status: response.data });
    }

    // Then palce order
    const newOther = new orderModel({
      customerId: req.id,
      totalPrice,
      status: "Pending",
      items,
    });
    await newOther.save();

    const { amount, transaction_date, gateway_response, ...rest } =
      response.data.data;
    const date = transaction_date.split("T")[0];
    return res.status(200).json({
      status: "Success",
      message: "Order placed successfully",
      payment_stastus: gateway_response,
      total_cost: amount / 100,
      paid_on: date,
    });
  } catch (err) {
    next(err);
  }
};

const getAllUserOrder = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const order = await orderModel
      .find({ customerId })
      .populate({ path: "items.productId", select: "name price -_id" });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderModel
      .findById(id)
      .populate({ path: "items.productId", select: ["name", "price", "-_id"] });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.customerId.toString() === req.id.toString()) {
      res.status(200).json(order);
    } else {
      const isAdmin = bcrypt.compareSync(process.env.ADMINCODE, req.role);
      if (!isAdmin) {
        return res
          .status(401)
          .json({
            status: false,
            message: "You can't view order that's not yours",
          });
      }
      res.status(200).json(order);
    }
  } catch (err) {
    next(err);
  }
};

const viewOrders = async (req, res, next) => {
  try {
    const orders = await orderModel
      .find()
      .populate({ path: "items.productId", select: ["name", "price", "-_id"] })
      .populate({path: "customerId", select: "userName"});
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const isAdmin = bcrypt.compareSync(process.env.ADMINCODE, req.role);

    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { status, ...others } = order;
    if (!isAdmin) {
      // This check ensure that customer is only trying to cancel order, any other status will return
      if (req.params.status !== process.env.USERORDERSTATUS) {
        return res
          .status(403)
          .json({ message: "You can only cancel your order" });
      }

      await orderModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            status: req.params.status,
            others,
          },
        },
        { new: true }
      );

      return res.status(200).json({ message: "Successful" });
    }

    const statusArray = process.env.ORDERSTATUS.split(",");
    let validStatus = statusArray.includes(req.params.status);
    if (!validStatus) {
      return res.status(403).json({ message: "Invalid status update" });
    }

    await orderModel.findByIdAndUpdate(
      req.params.id,
      { status: req.params.status, others },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: `order ${req.params.status} successful` });
  } catch (err) {
    next(err);
  }
};

export {
  placeOrder,
  getAllUserOrder,
  getOrderById,
  updateOrderStatus,
  viewOrders,
};
