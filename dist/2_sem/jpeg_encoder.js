"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Q = exports.ZigZag = void 0;
exports.getImageDataFromImage = getImageDataFromImage;
exports.encodeJPEG = encodeJPEG;
const fs_1 = __importDefault(require("fs"));
const jpeg_decoder_1 = require("./jpeg_decoder");
exports.ZigZag = [
    [0, 1, 5, 6, 14, 15, 27, 28],
    [2, 4, 7, 13, 16, 26, 29, 42],
    [3, 8, 12, 17, 25, 30, 41, 43],
    [9, 11, 18, 24, 31, 40, 44, 53],
    [10, 19, 23, 32, 39, 45, 52, 54],
    [20, 22, 33, 38, 46, 51, 55, 60],
    [21, 34, 37, 47, 50, 56, 59, 61],
    [35, 36, 48, 49, 57, 58, 62, 63]
];
exports.Q = [
    [16, 11, 10, 16, 24, 40, 51, 61],
    [12, 12, 14, 19, 26, 58, 60, 55],
    [14, 13, 16, 24, 40, 57, 69, 56],
    [14, 17, 22, 29, 51, 87, 80, 62],
    [18, 22, 37, 56, 68, 109, 103, 77],
    [24, 35, 55, 64, 81, 104, 113, 92],
    [49, 64, 78, 87, 103, 121, 120, 101],
    [72, 92, 95, 98, 112, 100, 103, 99]
];
function dct(block) {
    const N = 8; // Block size
    const result = Array(N).fill(0).map(() => Array(N).fill(0));
    // Helper function to calculate alpha(u) and alpha(v)
    const alpha = (u) => u === 0 ? 1 / Math.sqrt(N) : Math.sqrt(2 / N);
    // 2D DCT implementation
    for (let u = 0; u < N; u++) {
        for (let v = 0; v < N; v++) {
            let sum = 0;
            for (let x = 0; x < N; x++) {
                for (let y = 0; y < N; y++) {
                    const cos1 = Math.cos((2 * x + 1) * u * Math.PI / (2 * N));
                    const cos2 = Math.cos((2 * y + 1) * v * Math.PI / (2 * N));
                    try {
                        sum += block[x][y] * cos1 * cos2;
                    }
                    catch (e) {
                        console.log(block);
                        throw new Error("Вот тут");
                    }
                }
            }
            result[u][v] = alpha(u) * alpha(v) * sum;
        }
    }
    return result;
}
function quantizeDCT(block) {
    const result = Array(8).fill(0).map(() => Array(8).fill(0));
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            result[i][j] = Math.round(block[i][j] / exports.Q[i][j]);
        }
    }
    return result;
}
function zigzag(block) {
    const result = new Array(64);
    for (let i = 0; i < 64; i++) {
        let blockXIndex = 0;
        let blockYIndex = 0;
        for (let index1 in exports.ZigZag) {
            if (exports.ZigZag[index1].indexOf(i) != -1) {
                blockXIndex = Number(index1);
                blockYIndex = exports.ZigZag[index1].indexOf(i);
                break;
            }
        }
        result[i] = block[blockXIndex][blockYIndex];
    }
    return result;
}
function rgbaToRgb(pixel, alpha) {
    let new_pixel = {
        r: ((1 - alpha) * (pixel.r / 255) + (alpha * pixel.r / 255)) * 255,
        g: ((1 - alpha) * (pixel.g / 255) + (alpha * pixel.g / 255)) * 255,
        b: ((1 - alpha) * (pixel.b / 255) + (alpha * pixel.b / 255)) * 255
    };
    return new_pixel;
}
function rgbToYCbCr(pixel) {
    return {
        y: 0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b,
        cb: -0.168736 * pixel.r - 0.331264 * pixel.g + 0.5 * pixel.b + 128,
        cr: 0.5 * pixel.r - 0.418688 * pixel.g - 0.081312 * pixel.b + 128
    };
}
function resizeBlock(block) {
    const newBlock = [];
    for (let i = 0; i < block.length; i += 2) {
        const newRow = [];
        for (let j = 0; j < block[i].length; j += 2) {
            newRow.push(block[i][j]);
        }
        newBlock.push(newRow);
    }
    return newBlock;
}
function resizeImage(image) {
    if (image.width % 16 !== 0 || image.height % 16 !== 0) {
        const newWidth = image.width + (16 - image.width % 16);
        const newHeight = image.height + (16 - image.height % 16);
        const newImage = Object.assign({}, image);
        newImage.width = newWidth;
        newImage.height = newHeight;
        for (let i = 0; i < image.height; i++) {
            newImage.pixels[i].push(...new Array(newWidth - image.width).fill({ r: 0, g: 0, b: 0 }));
        }
        for (let i = image.height; i < newHeight; i++) {
            newImage.pixels.push(new Array(newWidth).fill({ r: 0, g: 0, b: 0 }));
        }
        return newImage;
    }
    return image;
}
function createBlocks(matrix) {
    const blocks = [];
    let x = 0;
    let y = 0;
    for (let i = 0; i < matrix.length; i += 8) {
        for (let j = 0; j < matrix[i].length; j += 8) {
            blocks.push({ x: x, y: y, pixels: matrix.slice(i, i + 8).map(row => row.slice(j, j + 8)) });
            y++;
        }
        x++;
        y = 0;
    }
    return blocks;
}
function runLengthEncode(block) {
    const result = [];
    let zeroCount = 0;
    for (let i = 0; i < block.length; i++) {
        if (block[i] === 0) {
            zeroCount++;
        }
        else {
            if (zeroCount > 0) {
                result.push({ count: zeroCount, value: 0 });
                zeroCount = 0;
            }
            result.push({ count: 1, value: block[i] });
        }
    }
    // Handle trailing zeros
    if (zeroCount > 0) {
        result.push({ count: zeroCount, value: 0 });
    }
    return result;
}
function buildFrequencyTable(data) {
    const frequencyTable = new Map();
    data.forEach(pair => {
        const count = frequencyTable.get(pair.value) || 0;
        frequencyTable.set(pair.value, count + 1);
        if (pair.value === 0) {
            const count_count = frequencyTable.get(pair.count) || 0;
            frequencyTable.set(pair.count, count_count + 1);
        }
    });
    return frequencyTable;
}
function buildHuffmanTree(frequencyTable) {
    const nodes = [];
    // Create leaf nodes
    frequencyTable.forEach((frequency, value) => {
        nodes.push({
            value,
            frequency,
            left: null,
            right: null
        });
    });
    // Build tree
    while (nodes.length > 1) {
        nodes.sort((a, b) => a.frequency - b.frequency);
        const left = nodes.shift();
        const right = nodes.shift();
        const parent = {
            value: null,
            frequency: left.frequency + right.frequency,
            left,
            right
        };
        nodes.push(parent);
    }
    return nodes[0];
}
function generateHuffmanCodes(node, prefix = '', codes = []) {
    if (node.value !== null) {
        codes.push({ value: node.value, code: prefix });
    }
    else {
        if (node.left) {
            generateHuffmanCodes(node.left, prefix + '0', codes);
        }
        if (node.right) {
            generateHuffmanCodes(node.right, prefix + '1', codes);
        }
    }
    return codes;
}
function huffmanEncode(data, codes) {
    let encoded = '';
    data.forEach(pair => {
        const code = codes.find(c => c.value === pair.value);
        if (code && pair.value !== 0) {
            encoded += code.code;
        }
        else if (code) {
            const sizeCode = codes.find(c => c.value === pair.count);
            if (sizeCode) {
                encoded += sizeCode.code;
                encoded += code.code;
            }
        }
    });
    return encoded;
}
function getImageDataFromImage(idOrElement) {
    var theImg = (typeof (idOrElement) == 'string') ? document.getElementById(idOrElement) : idOrElement;
    var cvs = document.createElement('canvas');
    if (theImg instanceof HTMLImageElement) {
        cvs.width = theImg.width;
        cvs.height = theImg.height;
        var ctx = cvs.getContext("2d");
        if (ctx) {
            ctx.drawImage(theImg, 0, 0);
            return (ctx.getImageData(0, 0, cvs.width, cvs.height));
        }
    }
    return null;
}
function encodeJPEG(imageData) {
    let image = {
        width: imageData.width,
        height: imageData.height,
        pixels: []
    };
    console.log(imageData.width, imageData.height, Object.keys(imageData.data).length, Object.keys(imageData.data).length / (imageData.width * imageData.height));
    for (let i = 0; i < imageData.height; i++) {
        image.pixels.push([]);
        for (let j = 0; j < imageData.width * 4; j += 4) {
            const pixel = {
                r: imageData.data[i * imageData.width + j],
                g: imageData.data[i * imageData.width + j + 1],
                b: imageData.data[i * imageData.width + j + 2]
            };
            image.pixels[i].push(rgbaToRgb(pixel, imageData.data[i * imageData.width + j + 3] / 255));
        }
    }
    image = resizeImage(image);
    let yMatrix = [];
    let cbMatrix = [];
    let crMatrix = [];
    image.pixels.forEach(row => {
        yMatrix.push([]);
        cbMatrix.push([]);
        crMatrix.push([]);
        row.forEach(pixel => {
            const yCbCr = rgbToYCbCr(pixel);
            yMatrix[yMatrix.length - 1].push(yCbCr.y);
            cbMatrix[cbMatrix.length - 1].push(yCbCr.cb);
            crMatrix[crMatrix.length - 1].push(yCbCr.cr);
        });
    });
    cbMatrix = resizeBlock(cbMatrix);
    crMatrix = resizeBlock(crMatrix);
    // Process Y blocks
    let yBlocks = createBlocks(yMatrix).map(block => {
        const dctBlock = dct(block.pixels);
        const quantizedBlock = quantizeDCT(dctBlock);
        const zigzagBlock = zigzag(quantizedBlock);
        return runLengthEncode(zigzagBlock);
    });
    // Process Cb blocks
    let cbBlocks = createBlocks(cbMatrix).map(block => {
        const dctBlock = dct(block.pixels);
        const quantizedBlock = quantizeDCT(dctBlock);
        const zigzagBlock = zigzag(quantizedBlock);
        return runLengthEncode(zigzagBlock);
    });
    // Process Cr blocks
    let crBlocks = createBlocks(crMatrix).map(block => {
        const dctBlock = dct(block.pixels);
        const quantizedBlock = quantizeDCT(dctBlock);
        const zigzagBlock = zigzag(quantizedBlock);
        return runLengthEncode(zigzagBlock);
    });
    // Generate Huffman codes for each channel
    const yFrequencyTable = buildFrequencyTable(yBlocks.flat());
    const cbFrequencyTable = buildFrequencyTable(cbBlocks.flat());
    const crFrequencyTable = buildFrequencyTable(crBlocks.flat());
    const yHuffmanTree = buildHuffmanTree(yFrequencyTable);
    const cbHuffmanTree = buildHuffmanTree(cbFrequencyTable);
    const crHuffmanTree = buildHuffmanTree(crFrequencyTable);
    const yHuffmanCodes = generateHuffmanCodes(yHuffmanTree);
    const cbHuffmanCodes = generateHuffmanCodes(cbHuffmanTree);
    const crHuffmanCodes = generateHuffmanCodes(crHuffmanTree);
    // Encode each block using Huffman coding
    const encodedYBlocks = yBlocks.map(block => huffmanEncode(block, yHuffmanCodes));
    const encodedCbBlocks = cbBlocks.map(block => huffmanEncode(block, cbHuffmanCodes));
    const encodedCrBlocks = crBlocks.map(block => huffmanEncode(block, crHuffmanCodes));
    return {
        width: image.width,
        height: image.height,
        yBlocks: encodedYBlocks,
        cbBlocks: encodedCbBlocks,
        crBlocks: encodedCrBlocks,
        yHuffmanCodes,
        cbHuffmanCodes,
        crHuffmanCodes
    };
}
function readFile(path) {
    const file = fs_1.default.readFileSync(path, 'utf8');
    return JSON.parse(file);
}
'';
console.log((0, jpeg_decoder_1.decodeJPEG)(encodeJPEG(readFile('../files/temp_small.json'))));
