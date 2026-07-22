import { Request, Response } from 'express';
import UserService from '../services/UserService';

export class UserController {
  async addContestInformation(req: Request, res: Response) {
    try {
      const updatedUser = await UserService.addContestInformation(req.body);
      res.status(200).json({
        msg: "Contest info added successfully",
        user: updatedUser
      });
    } catch (error: any) {
      if (error.message === "No such user is found") {
        return res.status(404).json({ msg: error.message });
      }
      console.log(error);
      res.status(500).json({ err: error.message });
    }
  }

  async getUserDetails(req: Request, res: Response) {
    const { name, email } = req.body;
    try {
      const contestData = await UserService.getUserDetails(name, email);
      res.status(200).json({
        name,
        email,
        contest: contestData
      });
    } catch (error: any) {
      res.status(404).json({ err: error.message });
    }
  }

  async findUser(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Email is required in the request body." });
    }

    try {
      const user = await UserService.findUserByEmail(email);
      res.status(200).json(user);
    } catch (err: any) {
      if (err.message.includes('not found')) {
        return res.status(404).json({ msg: err.message });
      }
      console.error("Error finding user:", err);
      res.status(500).json({ msg: "Server error while finding user." });
    }
  }
}

export default new UserController();
