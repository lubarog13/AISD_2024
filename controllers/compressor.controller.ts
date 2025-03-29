import { Request, Response } from "express";
const fs = require("fs");
import {encodeRLE, decodeRLE} from "../2_sem/rle";
import {encodeBWT, decodeBWT} from "../2_sem/bwt";
import {decode78, encode78} from "../2_sem/lz78";
import {decode77, encode77} from "../2_sem/lz77";
import {compareArrays} from "../2_sem/functions";

export const formPage = (request: Request, response: Response) => {
  response.render("fileCompress");
};
export const postFileToServer = (request: Request, response: Response) => {
  // @ts-ignore
  const file = request.file;
  if (!file) {
    response.status(400).send("No files were uploaded.");
  }
  const bytes = fs.readFileSync(file.path);
  const bytesArray = new Uint8Array(bytes);
  // let encoded = encode(bytesArray);
  // let decoded = decode(encoded)
  // let encodedBwt = encodeBwt(bytesArray);
  // let decodedBwt = decodeBwt(encodedBwt)
  // console.log(encodedBwt, decodedBwt, new TextDecoder().decode(encodedBwt.encoded), new TextDecoder().decode(decodedBwt))
  let encoded77 = encode77(bytesArray);
  let decoded77 = decode77(encoded77);
  let encoded77Content = encoded77.map(it => it.byte);
  response.status(200).render('fileCompress', {success: compareArrays(bytesArray, decoded77), size: encoded77Content.length * 3});
};
