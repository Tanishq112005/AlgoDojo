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
exports.AuthController = void 0;
const AuthService_1 = __importDefault(require("../services/AuthService"));
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield AuthService_1.default.registerUser(req.body);
                res.status(201).json({
                    message: "User created successfully",
                    token: result.token,
                    user: result.user,
                });
            }
            catch (error) {
                if (error.message === "A user with this email already exists.") {
                    return res.status(409).json({ message: error.message });
                }
                if (error.message === "Name, email, and password are required.") {
                    return res.status(400).json({ message: error.message });
                }
                console.error("Error during user registration:", error);
                res.status(500).json({ message: "Internal Server Error. Please try again later." });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield AuthService_1.default.loginUser(req.body);
                res.status(200).json({
                    message: "Login successful",
                    token: result.token,
                    user: result.user
                });
            }
            catch (error) {
                if (error.message === "Invalid credentials.") {
                    return res.status(401).json({ message: error.message });
                }
                console.error("Login Error:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ msg: "Email is required." });
            }
            try {
                yield AuthService_1.default.forgotPassword(email);
                res.status(200).json({ msg: "ok" });
            }
            catch (error) {
                console.error("Forgot Password Error:", error);
                res.status(500).json({ msg: error.message || "Internal Server Error" });
            }
        });
    }
    verifyPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield AuthService_1.default.verifyPassword(req.body);
                res.status(200).json({ msg: "ok" });
            }
            catch (error) {
                console.error("Verify Password Error:", error);
                res.status(400).json({ msg: error.message });
            }
        });
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
