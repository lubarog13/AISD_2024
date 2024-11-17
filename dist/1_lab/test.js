"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSelectionSort = testSelectionSort;
exports.testBubbleSort = testBubbleSort;
exports.testInsertionSort = testInsertionSort;
exports.testMergeSort = testMergeSort;
exports.testQuickSort = testQuickSort;
exports.testHeapSort = testHeapSort;
exports.testShellSort = testShellSort;
exports.testHibbardSort = testHibbardSort;
exports.testPrattSort = testPrattSort;
const arrays_1 = require("./arrays");
const sorts_1 = require("./sorts");
function testSelectionSort(randomArray) {
    const a = performance.now();
    (0, sorts_1.selectionSort)([...arrays_1.sortedArray]);
    const b = performance.now();
    (0, sorts_1.selectionSort)([...arrays_1.semiSortedArray]);
    const c = performance.now();
    (0, sorts_1.selectionSort)([...arrays_1.reversedArray]);
    const d = performance.now();
    (0, sorts_1.selectionSort)([...randomArray]);
    const e = performance.now();
    return [b - a, c - b, d - c, e - d];
}
function testBubbleSort(randomArray) {
    const a = performance.now();
    (0, sorts_1.bubbleSort)([...arrays_1.sortedArray]);
    const b = performance.now();
    (0, sorts_1.bubbleSort)([...arrays_1.semiSortedArray]);
    const c = performance.now();
    (0, sorts_1.bubbleSort)([...arrays_1.reversedArray]);
    const d = performance.now();
    (0, sorts_1.bubbleSort)([...randomArray]);
    const e = performance.now();
    return [b - a, c - b, d - c, e - d];
}
function testInsertionSort(randomArray) {
    const a = performance.now();
    (0, sorts_1.insertionSort)([...arrays_1.sortedArray]);
    const b = performance.now();
    (0, sorts_1.insertionSort)([...arrays_1.semiSortedArray]);
    const c = performance.now();
    (0, sorts_1.insertionSort)([...arrays_1.reversedArray]);
    const d = performance.now();
    (0, sorts_1.insertionSort)([...randomArray]);
    const e = performance.now();
    return [b - a, c - b, d - c, e - d];
}
function testMergeSort(randomArray) {
    const a = performance.now();
    (0, sorts_1.mergeSort)([...arrays_1.sortedArray]);
    const b = performance.now();
    (0, sorts_1.mergeSort)([...arrays_1.semiSortedArray]);
    const c = performance.now();
    (0, sorts_1.mergeSort)([...arrays_1.reversedArray]);
    const d = performance.now();
    (0, sorts_1.mergeSort)([...randomArray]);
    const e = performance.now();
    return [b - a, c - b, d - c, e - d];
}
function testQuickSort(randomArray) {
    const a = performance.now();
    (0, sorts_1.quickSort)([...arrays_1.sortedArray]);
    const b = performance.now();
    (0, sorts_1.quickSort)([...arrays_1.semiSortedArray]);
    const c = performance.now();
    (0, sorts_1.quickSort)([...arrays_1.reversedArray]);
    const d = performance.now();
    (0, sorts_1.quickSort)([...randomArray]);
    const e = performance.now();
    return [b - a, c - b, d - c, e - d];
}
function testHeapSort(randomArray) {
    const a = performance.now();
    (0, sorts_1.heapSort)([...arrays_1.sortedArray]);
    const b = performance.now();
    (0, sorts_1.heapSort)([...arrays_1.semiSortedArray]);
    const c = performance.now();
    (0, sorts_1.heapSort)([...arrays_1.reversedArray]);
    const d = performance.now();
    (0, sorts_1.heapSort)([...randomArray]);
    const e = performance.now();
    return [b - a, c - b, d - c, e - d];
}
function testShellSort(randomArray) {
    const a = performance.now();
    (0, sorts_1.shellSort)([...arrays_1.sortedArray], (0, sorts_1.generateShell)(arrays_1.sortedArray.length));
    const b = performance.now();
    (0, sorts_1.shellSort)([...arrays_1.semiSortedArray], (0, sorts_1.generateShell)(arrays_1.semiSortedArray.length));
    const c = performance.now();
    (0, sorts_1.shellSort)([...arrays_1.reversedArray], (0, sorts_1.generateShell)(arrays_1.reversedArray.length));
    const d = performance.now();
    (0, sorts_1.shellSort)([...randomArray], (0, sorts_1.generateShell)(randomArray.length));
    const e = performance.now();
    return [b - a, c - b, d - c, e - d];
}
function testHibbardSort(randomArray) {
    const a = performance.now();
    (0, sorts_1.shellSort)([...arrays_1.sortedArray], (0, sorts_1.generateHibbard)(arrays_1.sortedArray.length));
    const b = performance.now();
    (0, sorts_1.shellSort)([...arrays_1.semiSortedArray], (0, sorts_1.generateHibbard)(arrays_1.semiSortedArray.length));
    const c = performance.now();
    (0, sorts_1.shellSort)([...arrays_1.reversedArray], (0, sorts_1.generateHibbard)(arrays_1.reversedArray.length));
    const d = performance.now();
    (0, sorts_1.shellSort)([...randomArray], (0, sorts_1.generateHibbard)(randomArray.length));
    const e = performance.now();
    return [b - a, c - b, d - c, e - d];
}
function testPrattSort(randomArray) {
    const a = performance.now();
    (0, sorts_1.shellSort)([...arrays_1.sortedArray], (0, sorts_1.generatePratt)(arrays_1.sortedArray.length));
    const b = performance.now();
    (0, sorts_1.shellSort)([...arrays_1.semiSortedArray], (0, sorts_1.generatePratt)(arrays_1.semiSortedArray.length));
    const c = performance.now();
    (0, sorts_1.shellSort)([...arrays_1.reversedArray], (0, sorts_1.generatePratt)(arrays_1.reversedArray.length));
    const d = performance.now();
    (0, sorts_1.shellSort)([...randomArray], (0, sorts_1.generatePratt)(randomArray.length));
    const e = performance.now();
    return [b - a, c - b, d - c, e - d];
}
