"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const router = (0, express_1.Router)();
router.post('/login', AuthController_1.default.login);
router.post('/sign_up', AuthController_1.default.register);
router.post('/validating_auth', AuthMiddleware_1.default.validateAuthEndpoint);
router.post('/forgot_password', AuthController_1.default.forgotPassword);
router.post('/verification', AuthController_1.default.verifyPassword);
exports.default = router;
