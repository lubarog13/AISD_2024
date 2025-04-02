import { Request, Response } from "express";
const fs = require("fs");
import {encodeRLE, decodeRLE} from "../2_sem/rle";
import {encodeBWT, decodeBWT} from "../2_sem/bwt";
import {decode78, encode78} from "../2_sem/lz78";
import {decode77, encode77} from "../2_sem/lz77";
import {compareArrays} from "../2_sem/functions";

interface CompressedFile {
  name: string,
  algorithm: string,
  size: string,
  compressed_size: string,
  decompressed_size: string,
  coeff: string,
  link: string
}

/*
* 1. HA
2. Run-length encoding (RLE)
3. BWT + RLE
4. BWT + MTF + HA
5. BWT + MTF + RLE + HA
6. LZ77
7. LZ77 + HA
8. LZ78
9. LZ78 + HA
* */

function compressFile(filename: string, content: Uint8Array, part: string = 'all'): CompressedFile[] {

  let algorithms: CompressedFile[] = []
  if (part === 'lz77' || part === 'all' ) {
    let encoded77 = encode77(content);
    let decoded77 = decode77(encoded77);
    let encoded77Content = encoded77.map(it => it.byte);
    algorithms.push({
      name: filename,
      algorithm: 'LZ77',
      size: (content.length / 1024).toFixed(2),
      compressed_size: (encoded77Content.length * 3 / 1024).toFixed(2),
      decompressed_size: (decoded77.length / 1024).toFixed(2),
      coeff: ((encoded77Content.length * 3) / content.length * 100).toFixed(2),
      link: `files/${filename}`
    })
  }
  if (part === 'lz78' || part === 'all') {
    let encoded78 = encode78(content);
    let decoded78 = decode78(encoded78);
    let encoded78Size = encoded78.length * 2;
    algorithms.push({
      name: filename,
      algorithm: 'LZ78',
      size: (content.length / 1024).toFixed(2),
      compressed_size: (encoded78Size / 1024).toFixed(2),
      decompressed_size: (decoded78.length / 1024).toFixed(2),
      coeff: (encoded78Size / content.length * 100).toFixed(2),
      link: `files/${filename}`
    })
  }
  if (part === 'rle' || part === 'all') {
    let encodedRle = encodeRLE(content);
    let decodedRle = decodeRLE(encodedRle);
    let encodedRleSize = encodedRle.length;
    algorithms.push({
      name: filename,
      algorithm: 'RLE',
      size: (content.length / 1024).toFixed(2),
      compressed_size: (encodedRleSize / 1024).toFixed(2),
      decompressed_size: (decodedRle.length / 1024).toFixed(2),
      coeff: (encodedRleSize / content.length * 100).toFixed(2),
      link: `files/${filename}`
    })
    let encodedBwt = encodeBWT(content);
    encodedRle = encodeRLE(encodedBwt.encoded);
    encodedRleSize = encodedRle.length;
    decodedRle = decodeRLE(encodedRle);
    let decodedBWT = decodeBWT({encoded: decodedRle, index: encodedBwt.index, t_matrix: encodedBwt.t_matrix})
    algorithms.push({
      name: filename,
      algorithm: 'BWT + RLE',
      size: (content.length / 1024).toFixed(2),
      compressed_size: (encodedRleSize / 1024).toFixed(2),
      decompressed_size: (decodedBWT.length / 1024).toFixed(2),
      coeff: (encodedRleSize / content.length * 100).toFixed(2),
      link: `files/${filename}`
    })
  }
  return algorithms;
}
function comressStaticFiles(onFilesRead: (_: CompressedFile[]) => void, part: string = 'all') {
  let files: CompressedFile[] = [];
  fs.readdir('files/', function(err: (NodeJS.ErrnoException | null), filenames: string[]) {
    console.log(filenames)
    if (err) {
      console.log(err)
      return;
    }
    filenames.forEach(function(filename) {
      let content = fs.readFileSync('files/' + filename);
        console.log(content.length)
        files = [...files, ...compressFile(filename, new Uint8Array(content), part)];
    });
    onFilesRead(files)
  });
}


export const formPage = async (request: Request, response: Response) => {
  let files: CompressedFile[] = []
  let algorithm =(typeof request.query.algorithm==='string'? request.query.algorithm : 'lz77')
  comressStaticFiles((val) => {
    files = val
    let resp = {file: files}
    // @ts-ignore
    resp[algorithm] = true
    response.render("fileCompress", resp);
  }, algorithm)
};
export const postFileToServer = (request: Request, response: Response) => {
  // @ts-ignore
  const file = request.file;
  if (!file) {
    response.status(400).send("No files were uploaded.");
  }
  const bytes = fs.readFileSync(file.path);
  const bytesArray = new Uint8Array(bytes);
  let new_file = compressFile(file.name || '', bytesArray);
  if (new_file.length) {
    response.status(200).render('fileCompress', {
      success: true,
      size: new_file[0].compressed_size
    });
  } else {
    response.status(200).render('fileCompress', {
      success: false,
      size: 0
    });
  }
};
