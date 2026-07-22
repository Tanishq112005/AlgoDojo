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
exports.UserController = void 0;
const UserService_1 = __importDefault(require("../services/UserService"));
class UserController {
    addContestInformation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield UserService_1.default.addContestInformation(req.body);
                res.status(200).json({
                    msg: "Contest info added successfully",
                    user: updatedUser
                });
            }
            catch (error) {
                if (error.message === "No such user is found") {
                    return res.status(404).json({ msg: error.message });
                }
                console.log(error);
                res.status(500).json({ err: error.message });
            }
        });
    }
    getUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email } = req.body;
            try {
                const contestData = yield UserService_1.default.getUserDetails(name, email);
                res.status(200).json({
                    name,
                    email,
                    contest: contestData
                });
            }
            catch (error) {
                res.status(404).json({ err: error.message });
            }
        });
    }
    findUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ msg: "Email is required in the request body." });
            }
            try {
                const user = yield UserService_1.default.findUserByEmail(email);
                res.status(200).json(user);
            }
            catch (err) {
                if (err.message.includes('not found')) {
                    return res.status(404).json({ msg: err.message });
                }
                console.error("Error finding user:", err);
                res.status(500).json({ msg: "Server error while finding user." });
            }
        });
    }
}
exports.UserController = UserController;
exports.default = new UserController();
