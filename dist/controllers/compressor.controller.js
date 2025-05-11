"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJpegPage = exports.postFileToServer = exports.formPage = void 0;
exports.saveFilesBytes = saveFilesBytes;
const fs = require("fs");
const rle_1 = require("../2_sem/rle");
const bwt_1 = require("../2_sem/bwt");
const lz78_1 = require("../2_sem/lz78");
const lz77_1 = require("../2_sem/lz77");
const mtf_1 = require("../2_sem/mtf");
const huffman_1 = require("../2_sem/huffman");
const node_inspector_1 = require("node:inspector");
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
function compressFile(filename, content, part = 'all') {
    let algorithms = [];
    if (part === 'lz77' || part === 'all') {
        let encoded77 = (0, lz77_1.encode77)(content);
        let decoded77 = (0, lz77_1.decode77)(encoded77);
        let encoded77Content = encoded77.map(it => it.byte);
        algorithms.push({
            name: filename,
            algorithm: 'LZ77',
            size: (content.length / 1024).toFixed(2),
            compressed_size: (encoded77Content.length * 3 / 1024).toFixed(2),
            decompressed_size: (decoded77.length / 1024).toFixed(2),
            coeff: (content.length / (encoded77Content.length * 3) * 100).toFixed(3),
            link: `files/bytes/${filename}`
        });
        let encodedHa = (0, huffman_1.encodeHuffman)(new Uint8Array(encoded77Content));
        let encodedHaSize = encodedHa.result.length;
        let decodedHa = (0, huffman_1.decodeHuffman)(encodedHa);
        encoded77.forEach(it => {
            it.byte = decodedHa[it.byte];
        });
        decoded77 = (0, lz77_1.decode77)(encoded77);
        algorithms.push({
            name: filename,
            algorithm: 'LZ77 + HA',
            size: (content.length / 1024).toFixed(2),
            compressed_size: (encodedHaSize / 1024).toFixed(2),
            decompressed_size: (decoded77.length / 1024).toFixed(2),
            coeff: (content.length / encodedHaSize * 100).toFixed(3),
            link: `files/bytes/${filename}`
        });
    }
    if (part === 'lz78' || part === 'all') {
        let encoded78 = (0, lz78_1.encode78)(content);
        let decoded78 = (0, lz78_1.decode78)(encoded78);
        let encoded78Size = encoded78.length * 2;
        algorithms.push({
            name: filename,
            algorithm: 'LZ78',
            size: (content.length / 1024).toFixed(2),
            compressed_size: (encoded78Size / 1024).toFixed(2),
            decompressed_size: (decoded78.length / 1024).toFixed(2),
            coeff: (content.length / encoded78Size * 100).toFixed(3),
            link: `files/bytes/${filename}`
        });
        let encodedHa = (0, huffman_1.encodeHuffman)(new Uint8Array(encoded78.map(it => it.next)));
        let encodedHaSize = encodedHa.result.length;
        let decodedHa = (0, huffman_1.decodeHuffman)(encodedHa);
        encoded78.forEach(it => {
            it.next = decodedHa[it.next];
        });
        decoded78 = (0, lz78_1.decode78)(encoded78);
        algorithms.push({
            name: filename,
            algorithm: 'LZ78 + HA',
            size: (content.length / 1024).toFixed(2),
            compressed_size: (encodedHaSize / 1024).toFixed(2),
            decompressed_size: (decoded78.length / 1024).toFixed(2),
            coeff: (content.length / encodedHaSize * 100).toFixed(3),
            link: `files/bytes/${filename}`
        });
    }
    if (part === 'rle' || part === 'all') {
        let encodedRle = (0, rle_1.encodeRLE)(content);
        let decodedRle = (0, rle_1.decodeRLE)(encodedRle);
        let encodedRleSize = encodedRle.length;
        algorithms.push({
            name: filename,
            algorithm: 'RLE',
            size: (content.length / 1024).toFixed(2),
            compressed_size: (encodedRleSize / 1024).toFixed(2),
            decompressed_size: (decodedRle.length / 1024).toFixed(2),
            coeff: (content.length / encodedRleSize * 100).toFixed(3),
            link: `files/bytes/${filename}`
        });
        if (content.length < 5000) {
            let encodedBwt = (0, bwt_1.encodeBWT)(content);
            encodedRle = (0, rle_1.encodeRLE)(encodedBwt.encoded);
            encodedRleSize = encodedRle.length;
            decodedRle = (0, rle_1.decodeRLE)(encodedRle);
            let decodedBWT = (0, bwt_1.decodeBWT)({ encoded: decodedRle, index: encodedBwt.index });
            algorithms.push({
                name: filename,
                algorithm: 'BWT + RLE',
                size: (content.length / 1024).toFixed(2),
                compressed_size: (encodedRleSize / 1024).toFixed(2),
                decompressed_size: (decodedBWT.length / 1024).toFixed(2),
                coeff: (encodedRleSize / content.length * 100).toFixed(3),
                link: `files/bytes/${filename}`
            });
            let encodedMtf = (0, mtf_1.encodeMtf)(encodedBwt.encoded);
            encodedRle = (0, rle_1.encodeRLE)(encodedMtf.encoded);
            let encodedHa = (0, huffman_1.encodeHuffman)(encodedRle);
            let encodedHaSize = encodedHa.result.length;
            let decodedHa = (0, huffman_1.decodeHuffman)(encodedHa);
            decodedRle = (0, rle_1.decodeRLE)(decodedHa);
            let decodedMtf = (0, mtf_1.decodeMtf)({ encoded: decodedRle, dictionary: encodedMtf.dictionary });
            decodedBWT = (0, bwt_1.decodeBWT)({ encoded: decodedMtf, index: encodedBwt.index });
            algorithms.push({
                name: filename,
                algorithm: 'BWT  + MTF + RLE + HA',
                size: (content.length / 1024).toFixed(2),
                compressed_size: (encodedHaSize / 1024).toFixed(2),
                decompressed_size: (decodedBWT.length / 1024).toFixed(2),
                coeff: (encodedHaSize / content.length * 100).toFixed(3),
                link: `files/bytes/${filename}`
            });
        }
        else {
            node_inspector_1.console.log('compressing parts');
            let contentParts = [];
            for (let i = 0; i < content.length; i += 5000) {
                contentParts = [...contentParts, content.slice(i, i + 5000)];
            }
            node_inspector_1.console.log(contentParts.length);
            let encodedBwtParts = contentParts.map(it => (0, bwt_1.encodeBWT)(it));
            let encodedRleParts = encodedBwtParts.map(it => (0, rle_1.encodeRLE)(it.encoded));
            let encodedRlePartsSize = encodedRleParts.reduce((acc, it) => acc + it.length, 0);
            let decodedRleParts = encodedRleParts.map(it => (0, rle_1.decodeRLE)(it));
            let decodedBWTParts = decodedRleParts.map((it, index) => (0, bwt_1.decodeBWT)({ encoded: it, index: encodedBwtParts[index].index }));
            let decodedBWTPartsSize = decodedBWTParts.reduce((acc, it) => acc + it.length, 0);
            algorithms.push({
                name: filename,
                algorithm: `BWT + RLE ${contentParts.length}`,
                size: (content.length / 1024).toFixed(2),
                compressed_size: (encodedRlePartsSize / 1024).toFixed(2),
                decompressed_size: (decodedBWTPartsSize / 1024).toFixed(2),
                coeff: (content.length / encodedRlePartsSize * 100).toFixed(2),
                link: `files/bytes/${filename}`
            });
            let encodedMtfParts = encodedBwtParts.map(it => (0, mtf_1.encodeMtf)(it.encoded));
            encodedRleParts = encodedMtfParts.map(it => (0, rle_1.encodeRLE)(it.encoded));
            let encodedHaParts = encodedRleParts.map(it => (0, huffman_1.encodeHuffman)(it));
            let encodedHaPartsSize = encodedHaParts.reduce((acc, it) => acc + it.result.length, 0);
            let decodedHaParts = encodedHaParts.map(it => (0, huffman_1.decodeHuffman)(it));
            decodedRleParts = decodedHaParts.map(it => (0, rle_1.decodeRLE)(it));
            let decodedMtfParts = decodedRleParts.map((it, index) => (0, mtf_1.decodeMtf)({ encoded: it, dictionary: encodedMtfParts[index].dictionary }));
            decodedBWTParts = decodedMtfParts.map((it, index) => (0, bwt_1.decodeBWT)({ encoded: it, index: encodedBwtParts[index].index }));
            decodedBWTPartsSize = decodedBWTParts.reduce((acc, it) => acc + it.length, 0);
            algorithms.push({
                name: filename,
                algorithm: 'BWT + MTF + RLE + HA',
                size: (content.length / 1024).toFixed(2),
                compressed_size: (encodedHaPartsSize / 1024).toFixed(2),
                decompressed_size: (decodedBWTPartsSize / 1024).toFixed(2),
                coeff: (content.length / encodedHaPartsSize * 100).toFixed(3),
                link: `files/bytes/${filename}`
            });
        }
    }
    if (part === 'ha' || part === 'all') {
        let encodedHa = (0, huffman_1.encodeHuffman)(content);
        let encodedHaSize = encodedHa.result.length;
        let decodedHa = (0, huffman_1.decodeHuffman)(encodedHa);
        algorithms.push({
            name: filename,
            algorithm: 'HA',
            size: (content.length / 1024).toFixed(2),
            compressed_size: (encodedHaSize / 1024).toFixed(2),
            decompressed_size: (decodedHa.length / 1024).toFixed(2),
            coeff: (content.length / encodedHaSize * 100).toFixed(3),
            link: `files/bytes/${filename}`
        });
        if (content.length < 5000) {
            let encodedBwt = (0, bwt_1.encodeBWT)(content);
            let encodedMtf = (0, mtf_1.encodeMtf)(encodedBwt.encoded);
            encodedHa = (0, huffman_1.encodeHuffman)(encodedMtf.encoded);
            encodedHaSize = encodedHa.result.length;
            decodedHa = (0, huffman_1.decodeHuffman)(encodedHa);
            let decodedMtf = (0, mtf_1.decodeMtf)({ encoded: decodedHa, dictionary: encodedMtf.dictionary });
            let decodedBWT = (0, bwt_1.decodeBWT)({ encoded: decodedMtf, index: encodedBwt.index });
            algorithms.push({
                name: filename,
                algorithm: 'BWT + MTF + HA',
                size: (content.length / 1024).toFixed(2),
                compressed_size: (encodedHaSize / 1024).toFixed(2),
                decompressed_size: (decodedBWT.length / 1024).toFixed(2),
                coeff: (content.length / encodedHaSize * 100).toFixed(3),
                link: `files/bytes/${filename}`
            });
            let encodedRle = (0, rle_1.encodeRLE)(encodedMtf.encoded);
            encodedHa = (0, huffman_1.encodeHuffman)(encodedRle);
            encodedHaSize = encodedHa.result.length;
            decodedHa = (0, huffman_1.decodeHuffman)(encodedHa);
            let decodedRle = (0, rle_1.decodeRLE)(decodedHa);
            decodedMtf = (0, mtf_1.decodeMtf)({ encoded: decodedRle, dictionary: encodedMtf.dictionary });
            decodedBWT = (0, bwt_1.decodeBWT)({ encoded: decodedMtf, index: encodedBwt.index });
            algorithms.push({
                name: filename,
                algorithm: 'BWT  + MTF + RLE + HA',
                size: (content.length / 1024).toFixed(2),
                compressed_size: (encodedHaSize / 1024).toFixed(2),
                decompressed_size: (decodedBWT.length / 1024).toFixed(2),
                coeff: (content.length / encodedHaSize * 100).toFixed(3),
                link: `files/bytes/${filename}`
            });
        }
        else {
            let contentParts = [];
            for (let i = 0; i < content.length; i += 5000) {
                contentParts = [...contentParts, content.slice(i, i + 5000)];
            }
            let encodedBwtParts = contentParts.map(it => (0, bwt_1.encodeBWT)(it));
            let encodedMtfParts = encodedBwtParts.map(it => (0, mtf_1.encodeMtf)(it.encoded));
            let encodedHaParts = encodedMtfParts.map(it => (0, huffman_1.encodeHuffman)(it.encoded));
            let encodedHaPartsSize = encodedHaParts.reduce((acc, it) => acc + it.result.length, 0);
            let decodedHaParts = encodedHaParts.map(it => (0, huffman_1.decodeHuffman)(it));
            let decodedMtfParts = decodedHaParts.map((it, index) => (0, mtf_1.decodeMtf)({ encoded: it, dictionary: encodedMtfParts[index].dictionary }));
            let decodedBwtParts = decodedMtfParts.map((it, index) => (0, bwt_1.decodeBWT)({ encoded: it, index: encodedBwtParts[index].index }));
            let decodedBwtPartsSize = decodedBwtParts.reduce((acc, it) => acc + it.length, 0);
            algorithms.push({
                name: filename,
                algorithm: 'BWT + MTF + HA',
                size: (content.length / 1024).toFixed(2),
                compressed_size: (encodedHaPartsSize / 1024).toFixed(2),
                decompressed_size: (decodedBwtPartsSize / 1024).toFixed(2),
                coeff: (content.length / encodedHaPartsSize * 100).toFixed(3),
                link: `files/bytes/${filename}`
            });
            let encodedRleParts = encodedMtfParts.map(it => (0, rle_1.encodeRLE)(it.encoded));
            encodedHaParts = encodedRleParts.map(it => (0, huffman_1.encodeHuffman)(it));
            encodedHaPartsSize = encodedHaParts.reduce((acc, it) => acc + it.result.length, 0);
            decodedHaParts = encodedHaParts.map(it => (0, huffman_1.decodeHuffman)(it));
            let decodedRleParts = decodedHaParts.map(it => (0, rle_1.decodeRLE)(it));
            decodedMtfParts = decodedRleParts.map((it, index) => (0, mtf_1.decodeMtf)({ encoded: it, dictionary: encodedMtfParts[index].dictionary }));
            decodedBwtParts = decodedMtfParts.map((it, index) => (0, bwt_1.decodeBWT)({ encoded: it, index: encodedBwtParts[index].index }));
            decodedBwtPartsSize = decodedBwtParts.reduce((acc, it) => acc + it.length, 0);
            algorithms.push({
                name: filename,
                algorithm: 'BWT + MTF + RLE + HA',
                size: (content.length / 1024).toFixed(2),
                compressed_size: (encodedHaPartsSize / 1024).toFixed(2),
                decompressed_size: (decodedBwtPartsSize / 1024).toFixed(2),
                coeff: (content.length / encodedHaPartsSize * 100).toFixed(3),
                link: `files/bytes/${filename}`
            });
        }
    }
    return algorithms;
}
function saveFilesBytes(request, response) {
    fs.readdir('files/format/', function (err, filenames) {
        if (err) {
            node_inspector_1.console.log(err);
            return;
        }
        filenames.forEach(function (filename) {
            let content = fs.readFileSync('files/format/' + filename);
            fs.writeFileSync('files/bytes/' + filename.replace('.', '_'), new Uint8Array(content));
        });
        response.status(200).send('ok');
    });
}
function comressStaticFiles(onFilesRead, part = 'all') {
    let files = [];
    fs.readdir('files/bytes/', function (err, filenames) {
        node_inspector_1.console.log(filenames);
        if (err) {
            node_inspector_1.console.log(err);
            return;
        }
        filenames.forEach(function (filename) {
            let content = fs.readFileSync('files/bytes/' + filename);
            node_inspector_1.console.log(content.length);
            files = [...files, ...compressFile(filename, new Uint8Array(content), part)];
        });
        onFilesRead(files);
    });
}
const formPage = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let files = [];
    let algorithm = (typeof request.query.algorithm === 'string' ? request.query.algorithm : 'lz77');
    // response.write(algorithm);
    node_inspector_1.console.log(algorithm);
    comressStaticFiles((val) => {
        files = val;
        let resp = { file: files };
        // @ts-ignore
        resp[algorithm] = true;
        response.render("fileCompress", resp);
    }, algorithm);
});
exports.formPage = formPage;
const postFileToServer = (request, response) => {
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
    }
    else {
        response.status(200).render('fileCompress', {
            success: false,
            size: 0
        });
    }
};
exports.postFileToServer = postFileToServer;
const getJpegPage = (request, response) => {
    response.status(200).render('jpeg');
};
exports.getJpegPage = getJpegPage;
