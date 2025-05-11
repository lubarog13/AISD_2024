"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJPEG = decodeJPEG;
exports.imageDataToImage = imageDataToImage;
const jpeg_encoder_1 = require("./jpeg_encoder");
class ImageDataLocal {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.data = new Uint8Array(new ArrayBuffer(this.width * this.height));
    }
}
function huffmanDecode(encoded, codes) {
    const result = [];
    let currentCode = '';
    for (let i = 0; i < encoded.length; i++) {
        currentCode += encoded[i];
        const matchingCode = codes.find(c => c.code === currentCode);
        if (matchingCode) {
            if (matchingCode.value === 0) {
                let prevValue = result.pop();
                result.push({ count: (prevValue === null || prevValue === void 0 ? void 0 : prevValue.value) || 1, value: matchingCode.value });
            }
            else {
                result.push({ count: 1, value: matchingCode.value });
            }
            currentCode = '';
        }
    }
    return result;
}
function inverseZigzag(block) {
    const result = Array(8).fill(0).map(() => Array(8).fill(0));
    //@ToDo Переписать
    let blockXIndex = 0;
    let blockYIndex = 0;
    for (let i = 0; i < 64; i++) {
        let blockXIndex = 0;
        let blockYIndex = 0;
        for (let index1 in jpeg_encoder_1.ZigZag) {
            if (jpeg_encoder_1.ZigZag[index1].indexOf(i) != -1) {
                blockXIndex = Number(index1);
                blockYIndex = jpeg_encoder_1.ZigZag[index1].indexOf(i);
                break;
            }
        }
        result[blockXIndex][blockYIndex] = block[i] || 0;
    }
    return result;
}
function rleDecode(encoded) {
    const result = [];
    for (let i = 0; i < encoded.length; i++) {
        const pair = encoded[i];
        for (let j = 0; j < pair.count; j++) {
            result.push(pair.value);
        }
    }
    return result;
}
function inverseQuantizeDCT(block) {
    const result = Array(8).fill(0).map(() => Array(8).fill(0));
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            result[i][j] = block[i][j] * jpeg_encoder_1.Q[i][j];
        }
    }
    return result;
}
function inverseDCT(block) {
    const N = 8;
    const result = Array(N).fill(0).map(() => Array(N).fill(0));
    const alpha = (u) => u === 0 ? 1 / Math.sqrt(N) : Math.sqrt(2 / N);
    for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
            let sum = 0;
            for (let u = 0; u < N; u++) {
                for (let v = 0; v < N; v++) {
                    const cos1 = Math.cos((2 * x + 1) * u * Math.PI / (2 * N));
                    const cos2 = Math.cos((2 * y + 1) * v * Math.PI / (2 * N));
                    sum += alpha(u) * alpha(v) * block[u][v] * cos1 * cos2;
                }
            }
            result[x][y] = sum;
        }
    }
    return result;
}
function yCbCrToRGB(yCbCr) {
    const y = yCbCr.y;
    const cb = yCbCr.cb - 128;
    const cr = yCbCr.cr - 128;
    return {
        r: Math.max(0, Math.min(255, y + 1.402 * cr)),
        g: Math.max(0, Math.min(255, y - 0.344136 * cb - 0.714136 * cr)),
        b: Math.max(0, Math.min(255, y + 1.772 * cb))
    };
}
function reconstructBlock(block) {
    const quantized = inverseQuantizeDCT(block);
    return inverseDCT(quantized);
}
function resizeBlockTo16x16(block) {
    const result = Array(16).fill(0).map(() => Array(16).fill(0));
    let x = 0, y = 0;
    for (let i = 0; i < 16; i += 2) {
        for (let j = 0; j < 16; j += 2) {
            result[i][j] = block[x][y];
            if (y < 7)
                result[i][j + 1] = Math.floor((block[x][y] + block[x][y + 1]) / 2);
            else
                result[i][j + 1] = block[x][y];
            y++;
        }
        y = 0;
        for (let j = 0; j < 16; j += 2) {
            if (x < 7) {
                result[i + 1][j] = Math.floor((block[x][y] + block[x + 1][y]) / 2);
                if (y < 7)
                    result[i + 1][j + 1] = Math.floor((block[x][y + 1] + block[x + 1][y + 1]) / 2);
                else
                    result[i + 1][j + 1] = block[x][y];
            }
            else {
                result[i + 1][j] = block[x][y];
                if (y < 7)
                    result[i + 1][j + 1] = block[x][y + 1];
                else
                    result[i + 1][j + 1] = block[x][y];
            }
            y++;
        }
        x++;
        y = 0;
    }
    return result;
}
function joinBlocksToMatrix(blocks, width, height, blockSize) {
    const matrix = Array(height).fill(0).map(() => Array(width).fill(0));
    const blocksPerRow = width / blockSize;
    const blocksPerCol = height / blockSize;
    for (let blockRow = 0; blockRow < blocksPerCol; blockRow++) {
        for (let blockCol = 0; blockCol < blocksPerRow; blockCol++) {
            const block = blocks[blockRow * blocksPerRow + blockCol];
            for (let i = 0; i < blockSize; i++) {
                for (let j = 0; j < blockSize; j++) {
                    matrix[blockRow * blockSize + i][blockCol * blockSize + j] = block[i][j];
                }
            }
        }
    }
    return matrix;
}
function decodeJPEG(encodedData) {
    // Decode blocks using Huffman codes
    const decodedYBlocks = encodedData.yBlocks.map(block => huffmanDecode(block, encodedData.yHuffmanCodes));
    const decodedCbBlocks = encodedData.cbBlocks.map(block => huffmanDecode(block, encodedData.cbHuffmanCodes));
    const decodedCrBlocks = encodedData.crBlocks.map(block => huffmanDecode(block, encodedData.crHuffmanCodes));
    // Convert run-length encoded blocks back to 8x8 blocks
    const yBlocks = decodedYBlocks.map(block => {
        const zigzagBlock = rleDecode(block);
        return inverseZigzag(zigzagBlock);
    });
    const cbBlocks = decodedCbBlocks.map(block => {
        const zigzagBlock = rleDecode(block);
        return inverseZigzag(zigzagBlock);
    });
    const crBlocks = decodedCrBlocks.map(block => {
        const zigzagBlock = rleDecode(block);
        return inverseZigzag(zigzagBlock);
    });
    // Reconstruct blocks
    const reconstructedYBlocks = yBlocks.map(reconstructBlock);
    const reconstructedCbBlocks = cbBlocks.map(reconstructBlock);
    const reconstructedCrBlocks = crBlocks.map(reconstructBlock);
    // Create image data
    const imageData = new ImageDataLocal(encodedData.width, encodedData.height);
    const data = imageData.data;
    const reconstructedYMatrix = joinBlocksToMatrix(reconstructedYBlocks, encodedData.width, encodedData.height, 8);
    const reconstructedCbMatrix = joinBlocksToMatrix(reconstructedCbBlocks.map(resizeBlockTo16x16), encodedData.width, encodedData.height, 16);
    const reconstructedCrMatrix = joinBlocksToMatrix(reconstructedCrBlocks.map(resizeBlockTo16x16), encodedData.width, encodedData.height, 16);
    for (let i = 0; i < encodedData.height; i++) {
        for (let j = 0; j < encodedData.width; j++) {
            const yCbCr = {
                y: reconstructedYMatrix[i][j],
                cb: reconstructedCbMatrix[i][j],
                cr: reconstructedCrMatrix[i][j]
            };
            const rgb = yCbCrToRGB(yCbCr);
            const pixelIndex = (i * encodedData.height + j) * 4;
            data[pixelIndex] = rgb.r;
            data[pixelIndex + 1] = rgb.g;
            data[pixelIndex + 2] = rgb.b;
            data[pixelIndex + 3] = 255;
        }
    }
    return imageData;
}
function imageDataToImage(imageDataLocal) {
    const imageData = new ImageData(imageDataLocal.width, imageDataLocal.height);
    imageData.data.set(imageDataLocal.data); // This example assumes that you already have ImageData object
    // 1. Render ImageData inside <canvas>
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.putImageData(imageData, 0, 0);
    }
    const image = document.querySelector('.compressed-image');
    if (image) {
        image.src = canvas.toDataURL();
    }
}
