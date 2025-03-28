import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    if (connect) {
      console.log("Database connection sucessful");
    }
  } catch (err) {
    console.log(err);
  }
};
export { dbConnect };
