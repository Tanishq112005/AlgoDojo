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
exports.ProblemController = void 0;
const ProblemService_1 = __importDefault(require("../services/ProblemService"));
class ProblemController {
    getCodeforcesProblems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const rating = req.body.rating;
            try {
                const filtered = yield ProblemService_1.default.getCodeforcesProblems(rating);
                res.status(200).json({ status: "OK", result: { problems: filtered } });
            }
            catch (err) {
                res.status(404).json({ Error: "Error occurs in calling the codeforces api" });
            }
        });
    }
    getFullCodeforcesQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contestId, index } = req.body;
            if (!contestId || !index) {
                return res.status(400).json({ error: 'Please provide both contestId and index' });
            }
            try {
                const result = yield ProblemService_1.default.scrapeCodeforcesProblem(contestId.toString(), index.toString());
                res.status(200).json(result);
            }
            catch (err) {
                console.error('Error scraping full question:', err);
                if (err.message === 'ScrapeFailed') {
                    res.status(502).json({ error: 'Failed to scrape full question from Codeforces' });
                }
                else {
                    res.status(500).json({ error: err.message || err });
                }
            }
        });
    }
    getLeetcodeProblems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { difficulty } = req.body;
            if (!difficulty) {
                return res.status(400).json({ error: "Please send { difficulty: 'easy' } as JSON" });
            }
            try {
                const result = yield ProblemService_1.default.getLeetcodeProblems(difficulty);
                return res.json(result);
            }
            catch (err) {
                return res.status(500).json({ error: err.message });
            }
        });
    }
    getFullLeetcodeQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { titleSlug } = req.body;
            if (!titleSlug) {
                return res.status(400).json({ error: "Please send { titleSlug: 'two-sum' }" });
            }
            try {
                const result = yield ProblemService_1.default.getFullLeetcodeQuestion(titleSlug);
                return res.json(result);
            }
            catch (err) {
                if (err.status) {
                    return res.status(err.status).json(err.data);
                }
                return res.status(500).json({ error: err.message });
            }
        });
    }
}
exports.ProblemController = ProblemController;
exports.default = new ProblemController();
