"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = (0, express_1.Router)();
router.post('/adding_contest_inforamtion', UserController_1.default.addContestInformation);
router.post('/getting_user_data', UserController_1.default.getUserDetails);
router.post('/finding_user', UserController_1.default.findUser);
exports.default = router;
