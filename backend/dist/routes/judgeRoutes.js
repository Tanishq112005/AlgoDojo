"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const JudgeController_1 = __importDefault(require("../controllers/JudgeController"));
const router = (0, express_1.Router)();
router.post('/checking_the_problem', JudgeController_1.default.checkProblem);
exports.default = router;
