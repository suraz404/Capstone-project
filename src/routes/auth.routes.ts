import { Router } from "express";
import { registerUser } from "../services/auth.service.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //not writing service logic her
    //service login -service file

    await registerUser(email, password);

    res.status(201).json({
      success: true,
      message: "Registration done , Please Login to continue",
    });
  } catch (error) {
    next(error);
  }
});
