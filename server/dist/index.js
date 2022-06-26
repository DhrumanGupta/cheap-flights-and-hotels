"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 1337;
app.get("/", (req, res) => {
    res.send({ res: "pong" });
});
app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
});
