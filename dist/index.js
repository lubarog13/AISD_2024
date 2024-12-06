"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const sortings_controller_1 = require("./controllers/sortings.controller");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.set("view engine", "hbs");
app.get("/", sortings_controller_1.get1LabPage);
app.get("/selection", sortings_controller_1.selectionSortPage);
app.get("/bubble", sortings_controller_1.bubbleSortPage);
app.get("/insertion", sortings_controller_1.insertionSortPage);
app.get("/merge", sortings_controller_1.mergeSortPage);
app.get("/shell", sortings_controller_1.shellSortPage);
app.get("/hibbard", sortings_controller_1.hibbardSortPage);
app.get("/pratt", sortings_controller_1.prattSortPage);
app.get("/quick", sortings_controller_1.quickSortPage);
app.get("/heap", sortings_controller_1.heapSortPage);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
