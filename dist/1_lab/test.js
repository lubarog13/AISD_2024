"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSelectionSort = testSelectionSort;
exports.testSelectionSortTimes = testSelectionSortTimes;
exports.testBubbleSort = testBubbleSort;
exports.testBubbleSortTimes = testBubbleSortTimes;
exports.testInsertionSortTimes = testInsertionSortTimes;
exports.testMergeSortTimes = testMergeSortTimes;
exports.testHeapSortTimes = testHeapSortTimes;
exports.testQuickSortTimes = testQuickSortTimes;
exports.testShellSortTimes = testShellSortTimes;
exports.testHibbardSortTimes = testHibbardSortTimes;
exports.testPrattSortTimes = testPrattSortTimes;
exports.testInsertionSort = testInsertionSort;
exports.testMergeSort = testMergeSort;
exports.testQuickSort = testQuickSort;
exports.testHeapSort = testHeapSort;
exports.testShellSort = testShellSort;
exports.testHibbardSort = testHibbardSort;
exports.testPrattSort = testPrattSort;
exports.testQuadroSort = testQuadroSort;
exports.testNonQuadroSort = testNonQuadroSort;
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
function testSelectionSortTimes() {
    const arrayResults = {
        sorted: [],
        semiSorted: [],
        reverseSorted: [],
        randomSorted: [],
    };
    for (let i = 1; i <= 15; i++) {
        const a = performance.now();
        (0, sorts_1.selectionSort)([...(0, arrays_1.generateSortedArray)(i * 1000)]);
        const b = performance.now();
        (0, sorts_1.selectionSort)([...(0, arrays_1.generateSemiSortedArray)(i * 1000)]);
        const c = performance.now();
        (0, sorts_1.selectionSort)([...(0, arrays_1.generateReverseSortedArray)(i * 1000)]);
        const d = performance.now();
        (0, sorts_1.selectionSort)([...(0, arrays_1.generateRandomArray)(i * 1000)]);
        const e = performance.now();
        arrayResults.sorted.push(b - a);
        arrayResults.semiSorted.push(c - b);
        arrayResults.reverseSorted.push(d - c);
        arrayResults.randomSorted.push(e - d);
    }
    return arrayResults;
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
function testBubbleSortTimes() {
    const arrayResults = {
        sorted: [],
        semiSorted: [],
        reverseSorted: [],
        randomSorted: [],
    };
    for (let i = 1; i <= 15; i++) {
        const a = performance.now();
        (0, sorts_1.bubbleSort)([...(0, arrays_1.generateSortedArray)(i * 1000)]);
        const b = performance.now();
        (0, sorts_1.bubbleSort)([...(0, arrays_1.generateSemiSortedArray)(i * 1000)]);
        const c = performance.now();
        (0, sorts_1.bubbleSort)([...(0, arrays_1.generateReverseSortedArray)(i * 1000)]);
        const d = performance.now();
        (0, sorts_1.bubbleSort)([...(0, arrays_1.generateRandomArray)(i * 1000)]);
        const e = performance.now();
        arrayResults.sorted.push(b - a);
        arrayResults.semiSorted.push(c - b);
        arrayResults.reverseSorted.push(d - c);
        arrayResults.randomSorted.push(e - d);
    }
    return arrayResults;
}
function testInsertionSortTimes() {
    const arrayResults = {
        sorted: [],
        semiSorted: [],
        reverseSorted: [],
        randomSorted: [],
    };
    for (let i = 1; i <= 15; i++) {
        const a = performance.now();
        (0, sorts_1.insertionSort)([...(0, arrays_1.generateSortedArray)(i * 1000)]);
        const b = performance.now();
        (0, sorts_1.insertionSort)([...(0, arrays_1.generateSemiSortedArray)(i * 1000)]);
        const c = performance.now();
        (0, sorts_1.insertionSort)([...(0, arrays_1.generateReverseSortedArray)(i * 1000)]);
        const d = performance.now();
        (0, sorts_1.insertionSort)([...(0, arrays_1.generateRandomArray)(i * 1000)]);
        const e = performance.now();
        arrayResults.sorted.push(b - a);
        arrayResults.semiSorted.push(c - b);
        arrayResults.reverseSorted.push(d - c);
        arrayResults.randomSorted.push(e - d);
    }
    return arrayResults;
}
function testMergeSortTimes() {
    const arrayResults = {
        sorted: [],
        semiSorted: [],
        reverseSorted: [],
        randomSorted: [],
    };
    for (let i = 1; i <= 15; i++) {
        const a = performance.now();
        (0, sorts_1.mergeSort)([...(0, arrays_1.generateSortedArray)(i * 1000)]);
        const b = performance.now();
        (0, sorts_1.mergeSort)([...(0, arrays_1.generateSemiSortedArray)(i * 1000)]);
        const c = performance.now();
        (0, sorts_1.mergeSort)([...(0, arrays_1.generateReverseSortedArray)(i * 1000)]);
        const d = performance.now();
        (0, sorts_1.mergeSort)([...(0, arrays_1.generateRandomArray)(i * 1000)]);
        const e = performance.now();
        arrayResults.sorted.push(b - a);
        arrayResults.semiSorted.push(c - b);
        arrayResults.reverseSorted.push(d - c);
        arrayResults.randomSorted.push(e - d);
    }
    return arrayResults;
}
function testHeapSortTimes() {
    const arrayResults = {
        sorted: [],
        semiSorted: [],
        reverseSorted: [],
        randomSorted: [],
    };
    for (let i = 1; i <= 15; i++) {
        const a = performance.now();
        (0, sorts_1.heapSort)([...(0, arrays_1.generateSortedArray)(i * 1000)]);
        const b = performance.now();
        (0, sorts_1.heapSort)([...(0, arrays_1.generateSemiSortedArray)(i * 1000)]);
        const c = performance.now();
        (0, sorts_1.heapSort)([...(0, arrays_1.generateReverseSortedArray)(i * 1000)]);
        const d = performance.now();
        (0, sorts_1.heapSort)([...(0, arrays_1.generateRandomArray)(i * 1000)]);
        const e = performance.now();
        arrayResults.sorted.push(b - a);
        arrayResults.semiSorted.push(c - b);
        arrayResults.reverseSorted.push(d - c);
        arrayResults.randomSorted.push(e - d);
    }
    return arrayResults;
}
function testQuickSortTimes() {
    const arrayResults = {
        sorted: [],
        semiSorted: [],
        reverseSorted: [],
        randomSorted: [],
    };
    for (let i = 1; i <= 15; i++) {
        const a = performance.now();
        (0, sorts_1.quickSort)([...(0, arrays_1.generateSortedArray)(i * 1000)]);
        const b = performance.now();
        (0, sorts_1.quickSort)([...(0, arrays_1.generateSemiSortedArray)(i * 1000)]);
        const c = performance.now();
        (0, sorts_1.quickSort)([...(0, arrays_1.generateReverseSortedArray)(i * 1000)]);
        const d = performance.now();
        (0, sorts_1.quickSort)([...(0, arrays_1.generateRandomArray)(i * 1000)]);
        const e = performance.now();
        arrayResults.sorted.push(b - a);
        arrayResults.semiSorted.push(c - b);
        arrayResults.reverseSorted.push(d - c);
        arrayResults.randomSorted.push(e - d);
    }
    return arrayResults;
}
function testShellSortTimes() {
    const arrayResults = {
        sorted: [],
        semiSorted: [],
        reverseSorted: [],
        randomSorted: [],
    };
    for (let i = 1; i <= 15; i++) {
        const a = performance.now();
        (0, sorts_1.shellSort)([...(0, arrays_1.generateSortedArray)(i * 1000)], (0, sorts_1.generateShell)(i * 1000));
        const b = performance.now();
        (0, sorts_1.shellSort)([...(0, arrays_1.generateSemiSortedArray)(i * 1000)], (0, sorts_1.generateShell)(i * 1000));
        const c = performance.now();
        (0, sorts_1.shellSort)([...(0, arrays_1.generateReverseSortedArray)(i * 1000)], (0, sorts_1.generateShell)(i * 1000));
        const d = performance.now();
        (0, sorts_1.shellSort)([...(0, arrays_1.generateRandomArray)(i * 1000)], (0, sorts_1.generateShell)(i * 1000));
        const e = performance.now();
        arrayResults.sorted.push(b - a);
        arrayResults.semiSorted.push(c - b);
        arrayResults.reverseSorted.push(d - c);
        arrayResults.randomSorted.push(e - d);
    }
    return arrayResults;
}
function testHibbardSortTimes() {
    const arrayResults = {
        sorted: [],
        semiSorted: [],
        reverseSorted: [],
        randomSorted: [],
    };
    for (let i = 1; i <= 15; i++) {
        const a = performance.now();
        (0, sorts_1.shellSort)([...(0, arrays_1.generateSortedArray)(i * 1000)], (0, sorts_1.generateHibbard)(i * 1000));
        const b = performance.now();
        (0, sorts_1.shellSort)([...(0, arrays_1.generateSemiSortedArray)(i * 1000)], (0, sorts_1.generateHibbard)(i * 1000));
        const c = performance.now();
        (0, sorts_1.shellSort)([...(0, arrays_1.generateReverseSortedArray)(i * 1000)], (0, sorts_1.generateHibbard)(i * 1000));
        const d = performance.now();
        (0, sorts_1.shellSort)([...(0, arrays_1.generateRandomArray)(i * 1000)], (0, sorts_1.generateHibbard)(i * 1000));
        const e = performance.now();
        arrayResults.sorted.push(b - a);
        arrayResults.semiSorted.push(c - b);
        arrayResults.reverseSorted.push(d - c);
        arrayResults.randomSorted.push(e - d);
    }
    return arrayResults;
}
function testPrattSortTimes() {
    const arrayResults = {
        sorted: [],
        semiSorted: [],
        reverseSorted: [],
        randomSorted: [],
    };
    for (let i = 1; i <= 15; i++) {
        const a = performance.now();
        (0, sorts_1.shellSort)([...(0, arrays_1.generateSortedArray)(i * 1000)], (0, sorts_1.generatePratt)(i * 1000));
        const b = performance.now();
        (0, sorts_1.shellSort)([...(0, arrays_1.generateSemiSortedArray)(i * 1000)], (0, sorts_1.generatePratt)(i * 1000));
        const c = performance.now();
        (0, sorts_1.shellSort)([...(0, arrays_1.generateReverseSortedArray)(i * 1000)], (0, sorts_1.generatePratt)(i * 1000));
        const d = performance.now();
        (0, sorts_1.shellSort)([...(0, arrays_1.generateRandomArray)(i * 1000)], (0, sorts_1.generatePratt)(i * 1000));
        const e = performance.now();
        arrayResults.sorted.push(b - a);
        arrayResults.semiSorted.push(c - b);
        arrayResults.reverseSorted.push(d - c);
        arrayResults.randomSorted.push(e - d);
    }
    return arrayResults;
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
function testQuadroSort(length) {
    let arr = (0, arrays_1.generateRandomArray)(length);
    const a = performance.now();
    (0, sorts_1.selectionSort)([...arr]);
    const b = performance.now();
    (0, sorts_1.bubbleSort)([...arr]);
    const c = performance.now();
    (0, sorts_1.insertionSort)([...arr]);
    const d = performance.now();
    (0, sorts_1.shellSort)([...arr], (0, sorts_1.generateShell)(arr.length));
    const e = performance.now();
    return [b - a, c - b, d - c, e - d];
}
function testNonQuadroSort(length) {
    let arr = (0, arrays_1.generateRandomArray)(length);
    const a = performance.now();
    (0, sorts_1.mergeSort)([...arr]);
    const b = performance.now();
    (0, sorts_1.quickSort)([...arr]);
    const c = performance.now();
    (0, sorts_1.shellSort)([...arr], (0, sorts_1.generateHibbard)(arr.length));
    const d = performance.now();
    (0, sorts_1.shellSort)([...arr], (0, sorts_1.generatePratt)(arr.length));
    const e = performance.now();
    (0, sorts_1.heapSort)([...arr]);
    const f = performance.now();
    return [b - a, c - b, d - c, e - d, f - e];
}
