import jwt from "jsonwebtoken";

const generateToken = async (userId, res) => {
  try {
    const token = await jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token);
  } catch (error) {
    console.log("Error in generate Token " + error);
  }
};

export default generateToken;
