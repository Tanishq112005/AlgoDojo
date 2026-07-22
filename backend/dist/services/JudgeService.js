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
exports.JudgeService = void 0;
const axios_1 = __importDefault(require("axios"));
class JudgeService {
    constructor() {
        this.wandboxUrl = 'https://wandbox.org/api/compile.json';
    }
    evaluateCode(language, code, testCases) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!testCases || testCases.length === 0) {
                return { success: false, message: "No test cases provided." };
            }
            let compiler = 'gcc-head';
            let lang = language.toLowerCase();
            if (lang === 'c++' || lang === 'cpp') {
                compiler = 'gcc-head';
            }
            else if (lang === 'python') {
                compiler = 'cpython-head';
            }
            else if (lang === 'javascript' || lang === 'js') {
                compiler = 'nodejs-20.17.0';
            }
            else if (lang === 'java') {
                compiler = 'openjdk-jdk-22+36';
            }
            else {
                return { success: false, message: `Unsupported language: ${language}` };
            }
            for (let i = 0; i < testCases.length; i++) {
                const tc = testCases[i];
                try {
                    const response = yield axios_1.default.post(this.wandboxUrl, {
                        compiler: compiler,
                        code: code,
                        stdin: tc.input
                    });
                    const result = response.data;
                    // Wandbox returns status '0' on success. If it's a compile error, compiler_error is populated.
                    // If it's a runtime error, program_error is populated.
                    if (result.compiler_error) {
                        return { success: false, message: `Compilation Error:\n${result.compiler_error}` };
                    }
                    if (result.status !== '0' && result.program_error) {
                        return { success: false, message: `Runtime Error:\n${result.program_error}` };
                    }
                    const actualOutput = (result.program_output || '').trim();
                    const expectedOutput = (tc.output || '').trim();
                    if (actualOutput !== expectedOutput) {
                        return {
                            success: false,
                            message: `Wrong Answer on Test Case ${i + 1}\nInput:\n${tc.input}\nExpected:\n${expectedOutput}\nActual:\n${actualOutput}`
                        };
                    }
                }
                catch (error) {
                    console.error("Wandbox API Error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                    return { success: false, message: "Internal server error during code execution." };
                }
            }
            return { success: true, message: "All test cases passed." };
        });
    }
}
exports.JudgeService = JudgeService;
exports.default = new JudgeService();
