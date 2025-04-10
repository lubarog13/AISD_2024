"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode77 = encode77;
exports.decode77 = decode77;
const functions_1 = require("./functions");
function encode77(bytes) {
    let bufferSize = 10;
    let stringSize = 10;
    let codingList = [];
    // let buffer : Uint8Array = []
    let ind = 0;
    while (ind < bytes.length) {
        let buffer = bytes.slice(Math.max(0, ind - bufferSize), ind);
        let shift = -1;
        let subS = null;
        for (let j = stringSize; j > -1; j--) {
            subS = bytes.slice(ind, Math.min(ind + j, bytes.length));
            shift = (0, functions_1.findCsa)(buffer, subS);
            if (shift !== -1)
                break;
        }
        codingList.push({ position: buffer.length - shift, len: (subS === null || subS === void 0 ? void 0 : subS.length) || 0, byte: bytes[ind + ((subS === null || subS === void 0 ? void 0 : subS.length) || 0)] });
        ind += ((subS === null || subS === void 0 ? void 0 : subS.length) || 0) + 1;
    }
    return codingList;
}
function decode77(compressed) {
    let bytesDecoded = [];
    compressed.forEach(item => {
        let { position, len, byte } = item;
        bytesDecoded = [...bytesDecoded, ...bytesDecoded.slice(bytesDecoded.length - position, bytesDecoded.length - position + len), byte];
    });
    return new Uint8Array(bytesDecoded);
}
