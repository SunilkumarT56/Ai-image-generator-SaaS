import express from "express";
import cors from "cors";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import imageRoutes from "./routes/imageRoute.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

//routes
app.use("/api/user", userRoutes);
app.use("/api/image", imageRoutes);

await connectDB();

app.get("/", (req, res) => {
  res.send("Api is working fine");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
