import User from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";

export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;
    const user = await User.findById(userId);
    if (!user || !prompt) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }
    if (user.creditBalance === 0 || user.creditBalance < 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient credits",
      });
    }
    const formData = new FormData();
    formData.append("prompt", prompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIP_DROP_API,
        },
        responseType: "arraybuffer",
      }
    );
    const base64Image = Buffer.from(data).toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    await User.findByIdAndUpdate(userId, { creditBalance : user.creditBalance - 1 });

    res.status(200).json({
      success: true,
      image: resultImage,
      message: "Image generated successfully",
    });



  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
