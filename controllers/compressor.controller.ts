import { Request, Response } from "express";
const fs = require("fs");
import { encodeRLE, decodeRLE } from "../2_sem/rle";
import { encodeBWT, decodeBWT } from "../2_sem/bwt";
import { decode78, encode78 } from "../2_sem/lz78";
import { decode77, encode77 } from "../2_sem/lz77";
import { decodeMtf, encodeMtf } from "../2_sem/mtf";
import { decodeHuffman, encodeHuffman } from "../2_sem/huffman";
import { console } from "node:inspector";

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
  if (part === 'lz77' || part === 'all') {
    let encoded77 = encode77(content);
    let decoded77 = decode77(encoded77);
    let encoded77Content = encoded77.map(it => it.byte);
    algorithms.push({
      name: filename,
      algorithm: 'LZ77',
      size: (content.length / 1024).toFixed(2),
      compressed_size: (encoded77Content.length * 3 / 1024).toFixed(2),
      decompressed_size: (decoded77.length / 1024).toFixed(2),
      coeff: ( content.length / (encoded77Content.length * 3) * 100).toFixed(3),
      link: `files/bytes/${filename}`
    })
    let encodedHa = encodeHuffman(new Uint8Array(encoded77Content));
    let encodedHaSize = encodedHa.result.length;
    let decodedHa = decodeHuffman(encodedHa);
    encoded77.forEach(it => {
      it.byte = decodedHa[it.byte];
    })
    decoded77 = decode77(encoded77);
    algorithms.push({
      name: filename,
      algorithm: 'LZ77 + HA',
      size: (content.length / 1024).toFixed(2),
      compressed_size: (encodedHaSize / 1024).toFixed(2),
      decompressed_size: (decoded77.length / 1024).toFixed(2),
      coeff: (content.length / encodedHaSize * 100).toFixed(3),
      link: `files/bytes/${filename}`
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
      coeff: (content.length / encoded78Size * 100).toFixed(3),
      link: `files/bytes/${filename}`
    })
    let encodedHa = encodeHuffman(new Uint8Array(encoded78.map(it => it.next)));
    let encodedHaSize = encodedHa.result.length;
    let decodedHa = decodeHuffman(encodedHa);
    encoded78.forEach(it => {
      it.next = decodedHa[it.next];
    })
    decoded78 = decode78(encoded78);
    algorithms.push({
      name: filename,
      algorithm: 'LZ78 + HA',
      size: (content.length / 1024).toFixed(2),
      compressed_size: (encodedHaSize / 1024).toFixed(2),
      decompressed_size: (decoded78.length / 1024).toFixed(2),
      coeff: (content.length / encodedHaSize * 100).toFixed(3),
      link: `files/bytes/${filename}`
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
      coeff: (content.length / encodedRleSize * 100).toFixed(3),
      link: `files/bytes/${filename}`
    })
    if (content.length < 5000) {
      let encodedBwt = encodeBWT(content);
      encodedRle = encodeRLE(encodedBwt.encoded);
      encodedRleSize = encodedRle.length;
      decodedRle = decodeRLE(encodedRle);
      let decodedBWT = decodeBWT({ encoded: decodedRle, index: encodedBwt.index })
      algorithms.push({
        name: filename,
        algorithm: 'BWT + RLE',
        size: (content.length / 1024).toFixed(2),
        compressed_size: (encodedRleSize / 1024).toFixed(2),
        decompressed_size: (decodedBWT.length / 1024).toFixed(2),
        coeff: (encodedRleSize / content.length * 100).toFixed(3),
        link: `files/bytes/${filename}`
      })
      let encodedMtf = encodeMtf(encodedBwt.encoded);
      encodedRle = encodeRLE(encodedMtf.encoded);
      let encodedHa = encodeHuffman(encodedRle);
      let encodedHaSize = encodedHa.result.length;
      let decodedHa = decodeHuffman(encodedHa);
      decodedRle = decodeRLE(decodedHa);
      let decodedMtf = decodeMtf({ encoded: decodedRle, dictionary: encodedMtf.dictionary });
      decodedBWT = decodeBWT({ encoded: decodedMtf, index: encodedBwt.index })
      algorithms.push({
        name: filename,
        algorithm: 'BWT  + MTF + RLE + HA',
        size: (content.length / 1024).toFixed(2),
        compressed_size: (encodedHaSize / 1024).toFixed(2),
        decompressed_size: (decodedBWT.length / 1024).toFixed(2),
        coeff: (encodedHaSize / content.length * 100).toFixed(3),
        link: `files/bytes/${filename}`
      })
  } else {
    console.log('compressing parts')
    let contentParts: Uint8Array[] = [];
    for (let i=0;i<content.length;i+=5000) {
      contentParts = [...contentParts, content.slice(i, i+5000)];
    }
    console.log(contentParts.length)
    let encodedBwtParts = contentParts.map(it => encodeBWT(it));
    let encodedRleParts = encodedBwtParts.map(it => encodeRLE(it.encoded))
    let encodedRlePartsSize = encodedRleParts.reduce((acc, it) => acc + it.length, 0);
    let decodedRleParts = encodedRleParts.map(it => decodeRLE(it));
    let decodedBWTParts = decodedRleParts.map((it, index) => decodeBWT({ encoded: it, index: encodedBwtParts[index].index }));
    let decodedBWTPartsSize = decodedBWTParts.reduce((acc, it) => acc + it.length, 0);
    algorithms.push({
      name: filename,
      algorithm: `BWT + RLE ${contentParts.length}`,
      size: (content.length / 1024).toFixed(2),
      compressed_size: (encodedRlePartsSize / 1024).toFixed(2),
      decompressed_size: (decodedBWTPartsSize / 1024).toFixed(2),
      coeff: (content.length / encodedRlePartsSize * 100).toFixed(2),
      link: `files/bytes/${filename}`
    })
    let encodedMtfParts = encodedBwtParts.map(it => encodeMtf(it.encoded));
    encodedRleParts = encodedMtfParts.map(it => encodeRLE(it.encoded));
    let encodedHaParts = encodedRleParts.map(it => encodeHuffman(it));
    let encodedHaPartsSize = encodedHaParts.reduce((acc, it) => acc + it.result.length, 0);
    let decodedHaParts = encodedHaParts.map(it => decodeHuffman(it));
    decodedRleParts = decodedHaParts.map(it => decodeRLE(it));
    let decodedMtfParts = decodedRleParts.map((it, index) => decodeMtf({ encoded: it, dictionary: encodedMtfParts[index].dictionary }));
    decodedBWTParts = decodedMtfParts.map((it, index) => decodeBWT({ encoded: it, index: encodedBwtParts[index].index }));
    decodedBWTPartsSize = decodedBWTParts.reduce((acc, it) => acc + it.length, 0);
    algorithms.push({
      name: filename,
      algorithm: 'BWT + MTF + RLE + HA',
      size: (content.length / 1024).toFixed(2),
      compressed_size: (encodedHaPartsSize / 1024).toFixed(2),
      decompressed_size: (decodedBWTPartsSize / 1024).toFixed(2),
      coeff: ( content.length / encodedHaPartsSize * 100).toFixed(3),
      link: `files/bytes/${filename}`
    });
  }
  }
  if (part === 'ha' || part === 'all') {
    let encodedHa = encodeHuffman(content);
    let encodedHaSize = encodedHa.result.length;
    let decodedHa = decodeHuffman(encodedHa);
    algorithms.push({
      name: filename,
      algorithm: 'HA',
      size: (content.length / 1024).toFixed(2),
      compressed_size: (encodedHaSize / 1024).toFixed(2),
      decompressed_size: (decodedHa.length / 1024).toFixed(2),
      coeff: (content.length / encodedHaSize * 100).toFixed(3),
      link: `files/bytes/${filename}`
    })
    if (content.length < 5000) {
      let encodedBwt = encodeBWT(content);
      let encodedMtf = encodeMtf(encodedBwt.encoded); 
      encodedHa = encodeHuffman(encodedMtf.encoded);
      encodedHaSize = encodedHa.result.length;
      decodedHa = decodeHuffman(encodedHa);
      let decodedMtf = decodeMtf({ encoded: decodedHa, dictionary: encodedMtf.dictionary });
      let decodedBWT = decodeBWT({ encoded: decodedMtf, index: encodedBwt.index })
      algorithms.push({
        name: filename,
        algorithm: 'BWT + MTF + HA',
        size: (content.length / 1024).toFixed(2),
        compressed_size: (encodedHaSize / 1024).toFixed(2),
        decompressed_size: (decodedBWT.length / 1024).toFixed(2),
        coeff: (content.length / encodedHaSize * 100).toFixed(3),
        link: `files/bytes/${filename}`
      })
      let encodedRle = encodeRLE(encodedMtf.encoded);
      encodedHa = encodeHuffman(encodedRle);
      encodedHaSize = encodedHa.result.length;
      decodedHa = decodeHuffman(encodedHa);
      let decodedRle = decodeRLE(decodedHa);
      decodedMtf = decodeMtf({ encoded: decodedRle, dictionary: encodedMtf.dictionary });
      decodedBWT = decodeBWT({ encoded: decodedMtf, index: encodedBwt.index })
      algorithms.push({
        name: filename,
        algorithm: 'BWT  + MTF + RLE + HA',
        size: (content.length / 1024).toFixed(2),
        compressed_size: (encodedHaSize / 1024).toFixed(2),
        decompressed_size: (decodedBWT.length / 1024).toFixed(2),
        coeff: (content.length / encodedHaSize * 100).toFixed(3),
        link: `files/bytes/${filename}`
      })
  } else {
    let contentParts: Uint8Array[] = [];
    for (let i=0;i<content.length;i+=5000) {
      contentParts = [...contentParts, content.slice(i, i+5000)];
    }
    let encodedBwtParts = contentParts.map(it => encodeBWT(it));
    let encodedMtfParts = encodedBwtParts.map(it => encodeMtf(it.encoded));
    let encodedHaParts = encodedMtfParts.map(it => encodeHuffman(it.encoded));
    let encodedHaPartsSize = encodedHaParts.reduce((acc, it) => acc + it.result.length, 0);
    let decodedHaParts = encodedHaParts.map(it => decodeHuffman(it));
    let decodedMtfParts = decodedHaParts.map((it, index) => decodeMtf({ encoded: it, dictionary: encodedMtfParts[index].dictionary }));
    let decodedBwtParts = decodedMtfParts.map((it, index) => decodeBWT({ encoded: it, index: encodedBwtParts[index].index}));
    let decodedBwtPartsSize = decodedBwtParts.reduce((acc, it) => acc + it.length, 0);
    algorithms.push({
      name: filename,
      algorithm: 'BWT + MTF + HA',
      size: (content.length / 1024).toFixed(2),
      compressed_size: (encodedHaPartsSize / 1024).toFixed(2),
      decompressed_size: (decodedBwtPartsSize / 1024).toFixed(2),
      coeff: (content.length / encodedHaPartsSize * 100).toFixed(3),
      link: `files/bytes/${filename}`
    })
    let encodedRleParts = encodedMtfParts.map(it => encodeRLE(it.encoded));
    encodedHaParts = encodedRleParts.map(it => encodeHuffman(it));
    encodedHaPartsSize = encodedHaParts.reduce((acc, it) => acc + it.result.length, 0);
    decodedHaParts = encodedHaParts.map(it => decodeHuffman(it));
    let decodedRleParts = decodedHaParts.map(it => decodeRLE(it));
    decodedMtfParts = decodedRleParts.map((it, index) => decodeMtf({ encoded: it, dictionary: encodedMtfParts[index].dictionary }));
    decodedBwtParts = decodedMtfParts.map((it, index) => decodeBWT({ encoded: it, index: encodedBwtParts[index].index }));
    decodedBwtPartsSize = decodedBwtParts.reduce((acc, it) => acc + it.length, 0);
    algorithms.push({
      name: filename,
      algorithm: 'BWT + MTF + RLE + HA',
      size: (content.length / 1024).toFixed(2),
      compressed_size: (encodedHaPartsSize / 1024).toFixed(2),
      decompressed_size: (decodedBwtPartsSize / 1024).toFixed(2),
      coeff: (content.length / encodedHaPartsSize * 100).toFixed(3),
      link: `files/bytes/${filename}`
    })
  }
  }
  return algorithms;
}

export function saveFilesBytes(request: Request, response: Response) {
  fs.readdir('files/format/', function (err: (NodeJS.ErrnoException | null), filenames: string[]) {
    if (err) {
      console.log(err)
      return;
    }
    filenames.forEach(function (filename) {
      let content = fs.readFileSync('files/format/' + filename);
      fs.writeFileSync('files/bytes/' + filename.replace('.', '_'), new Uint8Array(content));
    });
    response.status(200).send('ok')
  });
}


function comressStaticFiles(onFilesRead: (_: CompressedFile[]) => void, part: string = 'all') {
  let files: CompressedFile[] = [];
  fs.readdir('files/bytes/', function (err: (NodeJS.ErrnoException | null), filenames: string[]) {
    console.log(filenames)
    if (err) {
      console.log(err)
      return;
    }
    filenames.forEach(function (filename) {
      let content = fs.readFileSync('files/bytes/' + filename);
      console.log(content.length)
      files = [...files, ...compressFile(filename, new Uint8Array(content), part)];
    });
    onFilesRead(files)
  });
}


export const formPage = async (request: Request, response: Response) => {
  let files: CompressedFile[] = []
  let algorithm = (typeof request.query.algorithm === 'string' ? request.query.algorithm : 'lz77')
  // response.write(algorithm);
  console.log(algorithm)
  comressStaticFiles((val) => {
    files = val
    let resp = { file: files }
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
  let new_file = compressFile(file.name || '', bytesArray, 'all');
  if (new_file.length) {
    response.status(200).render('fileCompress', {
      success: true,
      file: new_file,
      algorithm: true,
      size: Math.min(...new_file.map(it => Number(it.compressed_size)))
    });
  } else {
    response.status(200).render('fileCompress', {
      success: false,
      size: 0
    });
  }
};
