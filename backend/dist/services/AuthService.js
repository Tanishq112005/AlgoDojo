"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
class AuthService {
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = userData;
            if (!name || !email || !password) {
                throw new Error("Name, email, and password are required.");
            }
            const existingUser = yield UserRepository_1.default.findByEmail(email);
            if (existingUser) {
                throw new Error("A user with this email already exists.");
            }
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
            const newUser = yield UserRepository_1.default.createUser({
                name,
                email,
                password: hashedPassword,
                total_contest: 0,
                total_question: 0,
                contest_information: []
            });
            const userForToken = {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
            };
            const token = (0, jwt_1.generateToken)(userForToken);
            return { token, user: newUser };
        });
    }
    loginUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = userData;
            const user = yield UserRepository_1.default.findByEmail(email);
            if (!user) {
                throw new Error("Invalid credentials.");
            }
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new Error("Invalid credentials.");
            }
            const userForToken = {
                id: user._id,
                name: user.name,
                email: user.email,
                password: user.password
            };
            const token = (0, jwt_1.generateToken)(userForToken);
            return { token, user };
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserRepository_1.default.findByEmail(email);
            if (!user) {
                throw new Error("User with this email not found.");
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const salt = yield bcryptjs_1.default.genSalt(10);
            const otpHashed = yield bcryptjs_1.default.hash(otp, salt);
            yield UserRepository_1.default.updateUser(user._id, { otp: otpHashed });
            const sender = {
                email: process.env.COMPANY_MAIL || "algodojo1@gmail.com",
                name: "AlgoDojo Team"
            };
            const receivers = [{ email: email }];
            const emailService = require('../utils/emailservice').emailService;
            try {
                yield emailService.sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: "AlgoDojo Password Reset OTP",
                    textContent: `Your OTP for password reset is: ${otp}. It is valid for a short time.`,
                    htmlContent: `<h3>Your OTP for password reset is: <b>${otp}</b></h3>`
                });
            }
            catch (error) {
                console.error("Error sending email:", error);
                throw new Error("Failed to send OTP email.");
            }
        });
    }
    verifyPassword(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, otp, new_password } = userData;
            if (!email || !otp || !new_password) {
                throw new Error("Email, OTP, and new password are required.");
            }
            const user = yield UserRepository_1.default.findByEmail(email);
            if (!user || !user.otp) {
                throw new Error("No active OTP found for this user. Please request a new one.");
            }
            const isMatch = yield bcryptjs_1.default.compare(otp.toString(), user.otp);
            if (!isMatch) {
                throw new Error("Invalid OTP.");
            }
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedPassword = yield bcryptjs_1.default.hash(new_password, salt);
            yield UserRepository_1.default.updateUser(user._id, {
                password: hashedPassword,
                otp: "" // Clear the OTP so it can't be reused
            });
        });
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
