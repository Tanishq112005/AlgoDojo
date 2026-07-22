import UserRepository from '../repositories/UserRepository';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { IUser } from '../models/User';

export class AuthService {
  async registerUser(userData: any): Promise<{ token: string; user: IUser }> {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required.");
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("A user with this email already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserRepository.createUser({
      name,
      email,
      password: hashedPassword,
      total_contest: 0,
      total_question: 0,
      contest_information: []
    });

    const userForToken = {
      id: newUser._id as string,
      name: newUser.name as string,
      email: newUser.email as string,
      password: newUser.password as string,
    };

    const token = generateToken(userForToken);
    return { token, user: newUser };
  }

  async loginUser(userData: any): Promise<{ token: string; user: IUser }> {
    const { email, password } = userData;

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      throw new Error("Invalid credentials.");
    }

    const userForToken = {
      id: user._id as string,
      name: user.name as string,
      email: user.email as string,
      password: user.password as string
    };
    const token = generateToken(userForToken);

    return { token, user };
  }
  async forgotPassword(email: string): Promise<void> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error("User with this email not found.");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const otpHashed = await bcrypt.hash(otp, salt);

    await UserRepository.updateUser(user._id as string, { otp: otpHashed });

    const sender = {
      email: process.env.COMPANY_MAIL || "algodojo1@gmail.com",
      name: "AlgoDojo Team"
    };

    const receivers = [{ email: email }];

    const emailService = require('../utils/emailservice').emailService;
    try {
      await emailService.sendTransacEmail({
        sender,
        to: receivers,
        subject: "AlgoDojo Password Reset OTP",
        textContent: `Your OTP for password reset is: ${otp}. It is valid for a short time.`,
        htmlContent: `<h3>Your OTP for password reset is: <b>${otp}</b></h3>`
      });
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send OTP email.");
    }
  }

  async verifyPassword(userData: any): Promise<void> {
    const { email, otp, new_password } = userData;
    if (!email || !otp || !new_password) {
      throw new Error("Email, OTP, and new password are required.");
    }

    const user = await UserRepository.findByEmail(email);
    if (!user || !user.otp) {
      throw new Error("No active OTP found for this user. Please request a new one.");
    }

    const isMatch = await bcrypt.compare(otp.toString(), user.otp as string);
    if (!isMatch) {
      throw new Error("Invalid OTP.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    await UserRepository.updateUser(user._id as string, { 
      password: hashedPassword,
      otp: "" // Clear the OTP so it can't be reused
    });
  }
}

export default new AuthService();
