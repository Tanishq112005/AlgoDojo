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
exports.ProblemService = void 0;
const axios_1 = __importDefault(require("axios"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
class ProblemService {
    getCodeforcesProblems(rating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get('https://codeforces.com/api/problemset.problems');
                const problems = response.data.result.problems;
                const filtered = problems.filter((problem) => problem.rating === rating);
                return filtered;
            }
            catch (err) {
                throw new Error("Error occurs in calling the codeforces api");
            }
        });
    }
    scrapeCodeforcesProblem(contestId, problemIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://codeforces.com/contest/${contestId}/problem/${problemIndex}?mobile=false`;
            const launchOptions = {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ]
            };
            if (process.env.PUPPETEER_EXECUTABLE_PATH) {
                launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
            }
            const browser = yield puppeteer_core_1.default.launch(launchOptions);
            const page = yield browser.newPage();
            yield page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                '(KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36');
            yield page.setViewport({ width: 1280, height: 800 });
            try {
                yield page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
                yield page.waitForSelector('div.problem-statement', { timeout: 20000 });
                const data = yield page.evaluate(() => {
                    var _a, _b, _c;
                    const container = document.querySelector('div.problem-statement');
                    if (!container) {
                        return {
                            title: '', timeLimit: '', memoryLimit: '', statementParas: [], statementHTML: '', samples: []
                        };
                    }
                    const header = container.querySelector('.header');
                    const title = ((_a = header === null || header === void 0 ? void 0 : header.querySelector('.title')) === null || _a === void 0 ? void 0 : _a.innerText.trim()) || '';
                    const timeLimit = ((_b = header === null || header === void 0 ? void 0 : header.querySelector('.time-limit')) === null || _b === void 0 ? void 0 : _b.innerText.trim()) || '';
                    const memoryLimit = ((_c = header === null || header === void 0 ? void 0 : header.querySelector('.memory-limit')) === null || _c === void 0 ? void 0 : _c.innerText.trim()) || '';
                    const statementParas = Array.from(container.querySelectorAll('div:not(.header):not(.input-specification):not(.output-specification) > p')).map(p => p.innerText.trim());
                    const statementHTML = container.innerHTML.trim();
                    const inputs = Array.from(container.querySelectorAll('.sample-test .input pre')).map(el => el.innerText.trim());
                    const outputs = Array.from(container.querySelectorAll('.sample-test .output pre')).map(el => el.innerText.trim());
                    const samples = inputs.map((input, i) => ({ input, output: outputs[i] || '' }));
                    return { title, timeLimit, memoryLimit, statementParas, statementHTML, samples };
                });
                return Object.assign({ contestId, problemIndex, url, scrapedAt: new Date().toISOString() }, data);
            }
            catch (error) {
                throw new Error('ScrapeFailed');
            }
            finally {
                yield browser.close();
            }
        });
    }
    getLeetcodeProblems(difficulty) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      query questionList(
        $categorySlug: String,
        $filters: QuestionListFilterInput,
        $limit: Int,
        $skip: Int
      ) {
        questionList(
          categorySlug: $categorySlug,
          filters: $filters,
          limit: $limit,
          skip: $skip
        ) {
          totalNum
          data {
            questionFrontendId
            title
            titleSlug
            difficulty
            isPaidOnly
            topicTags {
              name
            }
          }
        }
      }
    `;
            const variables = {
                categorySlug: "", skip: 0, limit: 50,
                filters: { difficulty: difficulty.toUpperCase() },
            };
            try {
                const response = yield axios_1.default.post('https://leetcode.com/graphql', { operationName: "questionList", query, variables }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0',
                        'Referer': 'https://leetcode.com/problemset/all/',
                        'Origin': 'https://leetcode.com',
                    },
                });
                const nodeSet = response.data.data.questionList.data;
                const unpaid = nodeSet.filter((q) => q.isPaidOnly === false);
                return { total: response.data.data.questionList.totalNum, unpaid };
            }
            catch (err) {
                throw new Error("Unexpected error fetching from LeetCode");
            }
        });
    }
    getFullLeetcodeQuestion(titleSlug) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = `
      query getQuestion($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          content
          sampleTestCase
        }
      }
    `;
            const variables = { titleSlug };
            try {
                const response = yield axios_1.default.post('https://leetcode.com/graphql', { operationName: "getQuestion", query, variables }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0',
                        'Referer': `https://leetcode.com/problems/${titleSlug}/`,
                        'Origin': 'https://leetcode.com',
                    },
                });
                const q = response.data.data.question;
                if (!q) {
                    throw new Error("Question not found");
                }
                return {
                    titleSlug,
                    descriptionHtml: q.content,
                    sampleTestCase: q.sampleTestCase
                };
            }
            catch (err) {
                if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) >= 400 && err.response.status < 500) {
                    throw { status: err.response.status, data: err.response.data };
                }
                throw new Error("Failed to fetch question details");
            }
        });
    }
}
exports.ProblemService = ProblemService;
exports.default = new ProblemService();
