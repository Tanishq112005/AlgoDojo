"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const Database_1 = __importDefault(require("./lib/Database"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const problemRoutes_1 = __importDefault(require("./routes/problemRoutes"));
const judgeRoutes_1 = __importDefault(require("./routes/judgeRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.Port_number || 8000;
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
Database_1.default.connect();
app.use('/', problemRoutes_1.default);
app.use('/', judgeRoutes_1.default);
app.use('/', authRoutes_1.default);
app.use('/', userRoutes_1.default);
app.get("/health", (req, res) => {
    res.status(200).json({
        msg: "server is running properly"
    });
});
app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
});
