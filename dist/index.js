"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const sortings_controller_1 = require("./controllers/sortings.controller");
const compressor_controller_1 = require("./controllers/compressor.controller");
const os = __importStar(require("node:os"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const multer = require("multer");
const upload = multer({ dest: os.tmpdir() });
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
app.get("/minify", compressor_controller_1.formPage);
app.post("/minify", upload.single("file"), compressor_controller_1.postFileToServer);
app.use('/files', express_1.default.static('files'));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
