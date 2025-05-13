"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJPEG = decodeJPEG;
exports.showMatrix = showMatrix;
exports.imageDataToImage = imageDataToImage;
class ImageDataLocal {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.data = new Uint8Array(new ArrayBuffer(this.width * this.height * 4));
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
function inverseQuantizeDCT(block, isY) {
    const result = Array(8).fill(0).map(() => Array(8).fill(0));
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            result[i][j] = block[i][j] / 255 * (isY ? exports.YQ[i][j] : exports.UVQ[i][j]);
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
function reconstructBlock(block, isY) {
    const quantized = inverseQuantizeDCT(block, isY);
    return inverseDCT(quantized);
}
function resizeBlockTo16x16(block) {
    const result_prev = Array(8).fill(0).map(() => Array(16).fill(0));
    let x = 0, y = 0;
    for (let i = 0; i < 8; i++) {
        y = 0;
        for (let j = 0; j < 16; j += 2) {
            result_prev[i][j] = block[x][y];
            if (y < 7)
                result_prev[i][j + 1] = (block[i][y] + block[i][y + 1]) / 2;
            else
                result_prev[i][j + 1] = block[i][y];
            y++;
        }
    }
    const result = Array(16).fill(0).map(() => Array(16).fill(0));
    for (let i = 0; i < 16; i += 2) {
        for (let j = 0; j < 16; j++) {
            result[i][j] = result_prev[x][j];
        }
        for (let j = 0; j < 16; j++) {
            if (x < 7)
                result[i + 1][j] = (result[i][j] + result_prev[x + 1][j]) / 2;
            else
                result[i + 1][j] = result[i][j];
        }
        x++;
    }
    return result;
}
function joinBlocksToMatrix(blocks, width, height, blockSize) {
    const matrix = Array(height).fill(0).map(() => Array(width).fill(0));
    let blockIndex = 0;
    for (let i = 0; i < height; i += blockSize) {
        for (let j = 0; j < width; j += blockSize) {
            const block = blocks[blockIndex++];
            for (let x = 0; x < blockSize; x++) {
                for (let y = 0; y < blockSize; y++) {
                    if (i + x < height && j + y < width) {
                        matrix[i + x][j + y] = block[x][y];
                    }
                }
            }
        }
    }
    return matrix;
}
function decodeJPEG(encodedData) {
    const decodedYBlocks = encodedData.yBlocks.map(block => huffmanDecode(block, encodedData.yHuffmanCodes));
    const decodedCbBlocks = encodedData.cbBlocks.map(block => huffmanDecode(block, encodedData.cbHuffmanCodes));
    const decodedCrBlocks = encodedData.crBlocks.map(block => huffmanDecode(block, encodedData.crHuffmanCodes));
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
    const reconstructedYBlocks = yBlocks.map(block => reconstructBlock(block, true));
    const reconstructedCbBlocks = cbBlocks.map(block => reconstructBlock(block, false));
    const reconstructedCrBlocks = crBlocks.map(block => reconstructBlock(block, false));
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
            const pixelIndex = (i * encodedData.width + j) * 4;
            data[pixelIndex] = rgb.r;
            data[pixelIndex + 1] = rgb.g;
            data[pixelIndex + 2] = rgb.b;
            data[pixelIndex + 3] = 255;
        }
    }
    console.log(imageData.data)
    return imageData;
}
function showMatrix(matrix) {
    const table = document.createElement('table');
    for (let i = 0; i < matrix.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < matrix[i].length; j++) {
            const cell = document.createElement('td');
            cell.textContent = matrix[i][j].toString();
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    document.body.appendChild(table);
}
function imageDataToImage(imageDataLocal, className) {
    const imageData = new ImageData(imageDataLocal.width, imageDataLocal.height);
    imageData.data.set(imageDataLocal.data);
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.putImageData(imageData, 0, 0);
    }
    const image = document.querySelector(className);
    if (image) {
        image.src = canvas.toDataURL();
    }
}
