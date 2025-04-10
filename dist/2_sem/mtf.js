"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeMtf = encodeMtf;
exports.decodeMtf = decodeMtf;
function encodeMtf(bytes) {
    let dictionary = [...Array(256).keys()];
    let result = [];
    bytes.forEach(byte => {
        let rank = bytes.indexOf(byte);
        result.push(rank);
        dictionary.splice(rank, 1);
        dictionary = [byte, ...dictionary];
    });
    return { encoded: new Uint8Array(result), dictionary };
}
function decodeMtf(encoded) {
    let result = [];
    encoded.encoded.forEach(rank => {
        let byte = encoded.dictionary.splice(rank, 1)[0];
        result.push(byte);
        encoded.dictionary = [byte, ...encoded.dictionary];
    });
    return new Uint8Array(result);
}
