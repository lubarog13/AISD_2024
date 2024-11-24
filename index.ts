import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { get1LabPage } from "./controllers/sortings.controller";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.set("view engine", "hbs");

app.get("/", get1LabPage);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
