"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode78 = encode78;
exports.decode78 = decode78;
const functions_1 = require("./functions");
function encode78(bytes) {
    let buffer = [];
    let codes = [{ bytes: [], position: 0 }];
    let result = [];
    for (let i = 0; i < bytes.length; i++) {
        let indexOfCode = codes.findIndex((it) => (0, functions_1.compareArrays)(it.bytes, [...buffer, bytes[i]]));
        if (indexOfCode !== -1) {
            buffer.push(bytes[i]);
        }
        else {
            indexOfCode = codes.findIndex((it) => (0, functions_1.compareArrays)(it.bytes, buffer));
            result.push({ position: codes[indexOfCode].position, next: bytes[i] });
            codes.push({ bytes: [...buffer, bytes[i]], position: codes.length });
            buffer = [];
        }
    }
    if (buffer.length) {
        let lastByte = buffer.slice(-1)[0];
        buffer = buffer.slice(0, -1);
        let indexOfCode = codes.findIndex((it) => (0, functions_1.compareArrays)(it.bytes, buffer));
        result.push({ position: codes[indexOfCode].position, next: lastByte });
    }
    return result;
}
function decode78(encoded) {
    let codes = [[]];
    let answer = [];
    encoded.forEach(node => {
        let bytes = [...codes[node.position], node.next];
        answer = [...answer, ...bytes];
        codes.push(bytes);
    });
    return new Uint8Array(answer);
}
