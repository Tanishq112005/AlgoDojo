"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProblemController_1 = __importDefault(require("../controllers/ProblemController"));
const router = (0, express_1.Router)();
router.post('/problems_codeforces', ProblemController_1.default.getCodeforcesProblems);
router.post('/full_question_codeforces', ProblemController_1.default.getFullCodeforcesQuestion);
router.post('/problems_leetcode', ProblemController_1.default.getLeetcodeProblems);
router.post('/full_leetcode_question', ProblemController_1.default.getFullLeetcodeQuestion);
exports.default = router;
