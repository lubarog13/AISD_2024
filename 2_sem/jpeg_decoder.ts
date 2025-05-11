import {HuffmanCode, Pixel, YQ, UVQ, RunLengthPair, YCbCr, ZigZag} from "./jpeg_encoder";

class ImageDataLocal {
    width: number;
    height: number;
    data: Uint8Array;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.data = new Uint8Array(new ArrayBuffer(this.width * this.height))
    }
}

function huffmanDecode(encoded: string, codes: HuffmanCode[]): RunLengthPair[] {
    const result: RunLengthPair[] = [];
    let currentCode = '';

    for (let i = 0; i < encoded.length; i++) {
        currentCode += encoded[i];
        const matchingCode = codes.find(c => c.code === currentCode);

        if (matchingCode) {
            if (matchingCode.value === 0) {
                let prevValue = result.pop();
                result.push({count: prevValue?.value || 1, value: matchingCode.value})
            }else {
                result.push({count: 1, value: matchingCode.value});
            }
            currentCode = '';
        }
    }

    return result;
}

function inverseZigzag(block: number[]): number[][] {
    const result: number[][] = Array(8).fill(0).map(() => Array(8).fill(0));

    for (let i = 0; i < 64; i++) {
        let blockXIndex = 0;
        let blockYIndex = 0;
        for (let index1 in ZigZag) {
            if (ZigZag[index1].indexOf(i)!=-1) {
                blockXIndex = Number(index1);
                blockYIndex = ZigZag[index1].indexOf(i)
                break;
            }
        }
        result[blockXIndex][blockYIndex] = block[i] || 0;
    }
    return result;
}

function rleDecode(encoded: RunLengthPair[]): number[] {
    const result: number[] = [];
    for (let i = 0; i < encoded.length; i++) {
        const pair = encoded[i];
        for (let j = 0; j < pair.count; j++) {
            result.push(pair.value);
        }
    }
    return result;
}

function inverseQuantizeDCT(block: number[][], isY: boolean): number[][] {
    const result: number[][] = Array(8).fill(0).map(() => Array(8).fill(0));
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            result[i][j] = block[i][j] * (isY ? YQ[i][j] : UVQ[i][j]);
        }
    }
    return result;
}

function inverseDCT(block: number[][]): number[][] {
    const N = 8;
    const result: number[][] = Array(N).fill(0).map(() => Array(N).fill(0));

    const alpha = (u: number) => u === 0 ? 1 / Math.sqrt(N) : Math.sqrt(2 / N);

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

function yCbCrToRGB(yCbCr: YCbCr): Pixel {
    const y = yCbCr.y;
    const cb = yCbCr.cb - 128;
    const cr = yCbCr.cr - 128;

    return {
        r: Math.max(0, Math.min(255, y + 1.402 * cr)),
        g: Math.max(0, Math.min(255, y - 0.344136 * cb - 0.714136 * cr)),
        b: Math.max(0, Math.min(255, y + 1.772 * cb))
    };
}

function reconstructBlock(block: number[][], isY: boolean): number[][] {
    const quantized = inverseQuantizeDCT(block, isY);
    return inverseDCT(quantized);
}

function resizeBlockTo16x16(block: number[][]): number[][] {
    const result_prev = Array(8).fill(0).map(() => Array(16).fill(0));
    let x = 0, y = 0;
    for (let i = 0; i < 8; i ++) {
        for (let j = 0; j < 16; j += 2) {
            result_prev[i][j] = block[x][y];
            if (y < 7)
                result_prev[i][j + 1] = Math.floor((block[x][y] + block[x][y + 1]) / 2);
            else
                result_prev[i][j + 1] = block[x][y];
            y++;
        }
    }
    const result = Array(16).fill(0).map(() => Array(16).fill(0));
    for (let i = 0; i < 16; i+=2) {
        for (let j = 0; j < 16; j++) {
            result[i][j] = result_prev[x][j];
        }
        for (let j = 0; j < 16; j++) {
            if (x < 7)
                result[i + 1][j] = Math.floor((result[i][j] + result_prev[x + 1][j]) / 2);
            else
                result[i + 1][j] = result[i][j];
        }
        x++;
    }
    return result;
}

function joinBlocksToMatrix(blocks: number[][][], width: number, height: number, blockSize: number): number[][] {
    const matrix: number[][] = Array(height).fill(0).map(() => Array(width).fill(0));
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

export function decodeJPEG(encodedData: {
    width: number;
    height: number;
    yBlocks: string[];
    cbBlocks: string[];
    crBlocks: string[];
    yHuffmanCodes: HuffmanCode[];
    cbHuffmanCodes: HuffmanCode[];
    crHuffmanCodes: HuffmanCode[];
}): ImageDataLocal {
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


    for (let i=0; i<encodedData.height; i++) {
        for (let j=0; j<encodedData.width; j++) {
            const yCbCr: YCbCr = {
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

export function imageDataToImage(imageDataLocal: ImageDataLocal) {
        const imageData = new ImageData(imageDataLocal.width, imageDataLocal.height);
        imageData.data.set(imageDataLocal.data); 
        
        const canvas = document.createElement( "canvas" );
        canvas.width = imageData.width;
        canvas.height = imageData.height;

        const ctx = canvas.getContext( "2d" );
        if (ctx) {
            ctx.putImageData( imageData, 0, 0 );
        }

        const image = document.querySelector('.compressed-image') as HTMLImageElement;
        if (image) {
            image.src = canvas.toDataURL();
        }
}