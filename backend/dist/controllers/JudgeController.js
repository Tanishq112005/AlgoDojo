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
exports.JudgeController = void 0;
const JudgeService_1 = __importDefault(require("../services/JudgeService"));
class JudgeController {
    checkProblem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { language = 'c++', code, testCases } = req.body;
            if (!code) {
                return res.status(400).json({ Error: "Missing 'code' in request body." });
            }
            try {
                let cases = testCases;
                if (!cases && req.body.question && req.body.question.sampleTestCase) {
                    cases = [{ input: req.body.question.sampleTestCase, output: '' }];
                }
                const result = yield JudgeService_1.default.evaluateCode(language, code, cases);
                if (result.success) {
                    res.status(200).json({ result: "true" });
                }
                else {
                    res.status(200).json({ result: `false\n${result.message}` });
                }
            }
            catch (err) {
                console.error("Judge error:", err);
                return res.status(500).json({
                    Error: {
                        message: err.message
                    }
                });
            }
        });
    }
}
exports.JudgeController = JudgeController;
exports.default = new JudgeController();
