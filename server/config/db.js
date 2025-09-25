import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB is successfully connected");
    });
    await mongoose.connect(`${process.env.MONGO_URL}/ai-image-generator`);
  } catch (error) {
    console.log(error);
  }
};
export default connectDB;
