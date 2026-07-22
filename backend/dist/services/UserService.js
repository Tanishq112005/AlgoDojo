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
exports.UserService = void 0;
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
class UserService {
    addContestInformation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, time_duration, codeforces_question, rating_codeforces, leetcode_question, solved_leetcode_question, rating_leetcode, solved_codeforces_question, total_question, date } = data;
            const user = yield UserRepository_1.default.findByEmail(email);
            if (!user || user.name !== name) {
                throw new Error("No such user is found");
            }
            const newContest = {
                total_question, time_duration, codeforces_question, leetcode_question,
                rating_codeforces, rating_leetcode, solved_codeforces_question,
                solved_leetcode_question, date
            };
            const updatedUser = yield UserRepository_1.default.addContestInfo(email, newContest);
            if (updatedUser) {
                const newTotalQuestion = (updatedUser.total_question || 0) + solved_codeforces_question + solved_leetcode_question;
                const newTotalContest = (updatedUser.total_contest || 0) + 1;
                yield UserRepository_1.default.updateContestStats(email, {
                    total_question: newTotalQuestion,
                    total_contest: newTotalContest
                });
            }
            return yield UserRepository_1.default.findByEmail(email);
        });
    }
    getUserDetails(name, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserRepository_1.default.findByEmail(email);
            if (!user || user.name !== name) {
                throw new Error("No Such Type of the User is Not present");
            }
            return user.contest_information;
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserRepository_1.default.findByEmail(email);
            if (!user) {
                throw new Error(`User with email ${email} not found.`);
            }
            return user;
        });
    }
}
exports.UserService = UserService;
exports.default = new UserService();
