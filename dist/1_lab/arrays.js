"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reversedArray = exports.semiSortedArray = exports.sortedArray = void 0;
exports.generateRandomArray = generateRandomArray;
const len = 3000;
function generateSortedArray() {
    let arr = [-1000];
    for (let i = 1; i < len + 1; i++) {
        arr.push(Math.round(arr[i - 1] + Math.round(Math.random() * 5)));
    }
    return arr;
}
function generateSemiSortedArray() {
    let arr = [-3000];
    for (let i = 1; i < len; i++) {
        arr.push(Math.round(arr[i - 1] + Math.round(Math.random() * 5)));
    }
    for (let i = 0; i < Math.round(len / 10); i++) {
        let a = Math.random() * len;
        let b = Math.random() * len;
        [arr[a], arr[b]] = [arr[b], arr[a]];
    }
    return arr;
}
function generateReverseSortedArray() {
    let arr = [10000];
    for (let i = 1; i < len + 1; i++) {
        arr.push(Math.round(arr[i - 1] - Math.round(Math.random() * 5)));
    }
    return arr;
}
function generateRandomArray() {
    let arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(Math.round(10000 * Math.random()) - 3000);
    }
    return arr;
}
let sortedArray = generateSortedArray();
exports.sortedArray = sortedArray;
let semiSortedArray = generateSemiSortedArray();
exports.semiSortedArray = semiSortedArray;
let reversedArray = generateReverseSortedArray();
exports.reversedArray = reversedArray;
