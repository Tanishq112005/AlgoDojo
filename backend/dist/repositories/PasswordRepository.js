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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordRepository = void 0;
const Password_1 = require("../models/Password");
class PasswordRepository {
    createOTP(email, otpHashed) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = new Password_1.Password({ email, otp_hased: otpHashed, used: false });
            return yield otp.save();
        });
    }
    findValidOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Password_1.Password.findOne({ email, used: false }).sort({ _id: -1 });
        });
    }
    markOTPAsUsed(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Password_1.Password.findByIdAndUpdate(id, { used: true });
        });
    }
}
exports.PasswordRepository = PasswordRepository;
exports.default = new PasswordRepository();
