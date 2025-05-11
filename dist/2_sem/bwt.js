"use strict";
/* Дописать бвт без передачи t_matrix, написать сохранение картики побайтово в файл */
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeBWT = encodeBWT;
exports.decodeBWT = decodeBWT;
function compareByteTables(a, b) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] > b[i])
            return 1;
        if (a[i] < b[i])
            return -1;
    }
    return 0;
}
function encodeBWT(word) {
    let arr = [];
    let len = word.length;
    for (let i = 0; i < len; i++) {
        arr.push([...word.slice(i), ...word.slice(0, i)]);
    }
    arr.sort(compareByteTables);
    let sorted_arr = [...arr];
    sorted_arr.sort((a, b) => compareByteTables(a.slice(-1), b.slice(-1)));
    let tempArr = arr.map(it => new Uint8Array(it));
    const compareArrays = (a, b) => a.length === b.length &&
        a.every((element, index) => element === b[index]);
    let encodedArray = [];
    arr.map(it => encodedArray.push(it.slice(-1)[0]));
    return {
        encoded: new Uint8Array(encodedArray),
        index: tempArr.findIndex(it => compareArrays(it, word))
    };
}
function decodeBWT({ encoded, index }) {
    let tempMatrix = [];
    for (let i = 0; i < encoded.length; i++) {
        tempMatrix.push([encoded[i], i]);
    }
    tempMatrix.sort((a, b) => a[0] - b[0]);
    let t_matrix = {};
    for (let i in tempMatrix) {
        t_matrix[i] = tempMatrix[i][1];
    }
    let temp_arr = [];
    let len = encoded.length;
    let curr_ind = index;
    for (let i = 0; i < len; i++) {
        temp_arr.push(encoded[t_matrix[curr_ind]]);
        curr_ind = t_matrix[curr_ind];
    }
    return new Uint8Array(temp_arr);
}
