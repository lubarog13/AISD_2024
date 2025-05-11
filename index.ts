import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
  bubbleSortPage,
  get1LabPage,
  heapSortPage,
  hibbardSortPage,
  insertionSortPage,
  mergeSortPage,
  prattSortPage,
  quickSortPage,
  selectionSortPage,
  shellSortPage,
} from "./controllers/sortings.controller";
import {
  formPage,
  postFileToServer,
  saveFilesBytes,
  getJpegPage,
} from "./controllers/compressor.controller";
import * as os from "node:os";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const multer = require("multer");
const upload = multer({ dest: os.tmpdir() });
app.set("view engine", "hbs");

app.get("/", get1LabPage);

app.get("/selection", selectionSortPage);
app.get("/bubble", bubbleSortPage);
app.get("/insertion", insertionSortPage);
app.get("/merge", mergeSortPage);
app.get("/shell", shellSortPage);
app.get("/hibbard", hibbardSortPage);
app.get("/pratt", prattSortPage);
app.get("/quick", quickSortPage);
app.get("/heap", heapSortPage);
app.get("/minify", formPage);
app.get("/save-bytes", saveFilesBytes);
app.post("/minify", upload.single("file"), postFileToServer);
app.use('/files', express.static('files'))
app.get('/jpeg', getJpegPage);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
