import jwt from "jsonwebtoken";

export const generateToken = async (id) => {
  return jwt.sign({id}, process.env.SECRET_KEY , {
    expiresIn: "1d",
  });
};
