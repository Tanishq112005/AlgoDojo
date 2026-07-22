import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const result = await AuthService.registerUser(req.body);
      res.status(201).json({
        message: "User created successfully",
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      if (error.message === "A user with this email already exists.") {
        return res.status(409).json({ message: error.message });
      }
      if (error.message === "Name, email, and password are required.") {
        return res.status(400).json({ message: error.message });
      }
      console.error("Error during user registration:", error);
      res.status(500).json({ message: "Internal Server Error. Please try again later." });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await AuthService.loginUser(req.body);
      res.status(200).json({
        message: "Login successful",
        token: result.token,
        user: result.user
      });
    } catch (error: any) {
      if (error.message === "Invalid credentials.") {
        return res.status(401).json({ message: error.message });
      }
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Email is required." });
    }
    
    try {
      await AuthService.forgotPassword(email);
      res.status(200).json({ msg: "ok" });
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      res.status(500).json({ msg: error.message || "Internal Server Error" });
    }
  }

  async verifyPassword(req: Request, res: Response) {
    try {
      await AuthService.verifyPassword(req.body);
      res.status(200).json({ msg: "ok" });
    } catch (error: any) {
      console.error("Verify Password Error:", error);
      res.status(400).json({ msg: error.message });
    }
  }
}

export default new AuthController();
