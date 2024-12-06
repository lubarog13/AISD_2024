"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reversedArray = exports.semiSortedArray = exports.sortedArray = void 0;
exports.generateSortedArray = generateSortedArray;
exports.generateSemiSortedArray = generateSemiSortedArray;
exports.generateReverseSortedArray = generateReverseSortedArray;
exports.generateRandomArray = generateRandomArray;
const len = 10000;
function generateSortedArray(length = len) {
    let arr = [-1000];
    for (let i = 1; i < length + 1; i++) {
        arr.push(Math.round(arr[i - 1] + Math.round(Math.random() * 5)));
    }
    return arr;
}
function generateSemiSortedArray(length = len) {
    let arr = [-3000];
    for (let i = 1; i < length; i++) {
        arr.push(Math.round(arr[i - 1] + Math.round(Math.random() * 5)));
    }
    for (let i = 0; i < Math.round(length / 10); i++) {
        let a = Math.random() * length;
        let b = Math.random() * length;
        [arr[a], arr[b]] = [arr[b], arr[a]];
    }
    return arr;
}
function generateReverseSortedArray(length = len) {
    let arr = [10000];
    for (let i = 1; i < length + 1; i++) {
        arr.push(Math.round(arr[i - 1] - Math.round(Math.random() * 5)));
    }
    return arr;
}
function generateRandomArray(length = len) {
    let arr = [];
    for (let i = 0; i < length; i++) {
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
