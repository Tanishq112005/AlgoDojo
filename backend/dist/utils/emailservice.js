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
exports.emailService = void 0;
const axios_1 = __importDefault(require("axios"));
exports.emailService = {
    sendTransacEmail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const apiKey = process.env.BREVO_API_KEY || "";
            if (!apiKey) {
                throw new Error("BREVO_API_KEY is not configured in .env");
            }
            try {
                const response = yield axios_1.default.post("https://api.brevo.com/v3/smtp/email", {
                    sender: options.sender,
                    to: options.to,
                    subject: options.subject,
                    htmlContent: options.htmlContent,
                    textContent: options.textContent,
                }, {
                    headers: {
                        "api-key": apiKey,
                        "Content-Type": "application/json",
                        "accept": "application/json",
                    },
                });
                return response.data;
            }
            catch (error) {
                const errorMsg = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message;
                throw new Error(`Email Failed: ${errorMsg}`);
            }
        });
    }
};
