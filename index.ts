import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
  bubbleSortPage,
  get1LabPage, heapSortPage, hibbardSortPage,
  insertionSortPage,
  mergeSortPage, prattSortPage, quickSortPage,
  selectionSortPage, shellSortPage
} from "./controllers/sortings.controller";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.set("view engine", "hbs");

app.get("/", get1LabPage);

app.get("/selection", selectionSortPage)
app.get("/bubble", bubbleSortPage)
app.get("/insertion", insertionSortPage)
app.get("/merge", mergeSortPage)
app.get("/shell", shellSortPage)
app.get("/hibbard", hibbardSortPage)
app.get("/pratt", prattSortPage)
app.get("/quick", quickSortPage)
app.get("/heap", heapSortPage)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
