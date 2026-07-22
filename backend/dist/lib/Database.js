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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Database {
    constructor() {
        this.uri = process.env.MONGO_DB || process.env.Mongo_db || '';
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.uri) {
                    throw new Error('Mongo_db environment variable is not defined.');
                }
                yield mongoose_1.default.connect(this.uri);
                console.log('MongoDB connected successfully');
            }
            catch (err) {
                console.error('Error in MongoDB connection:', err);
            }
        });
    }
}
exports.default = new Database();
