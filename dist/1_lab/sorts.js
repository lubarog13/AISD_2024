"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectionSort = selectionSort;
exports.insertionSort = insertionSort;
exports.bubbleSort = bubbleSort;
exports.mergeSort = mergeSort;
exports.merge = merge;
exports.shellSort = shellSort;
exports.generateShell = generateShell;
exports.generatePratt = generatePratt;
exports.generateHibbard = generateHibbard;
exports.quickSort = quickSort;
exports.heapSort = heapSort;
exports.makeHeap = makeHeap;
exports.shuffleSort = shuffleSort;
/* T(n) = 4n + n^2 + 1 = O(n^2) */
function selectionSort(array) {
    /* T(n) = 4n + n^2 */
    for (let i = 0; i < array.length; i++) {
        let min = i;
        /* T(n) = n - 1*/
        for (let j = i; j < array.length; j++) {
            /* T(n)=2 - сравнение + код */
            if (array[j] < array[min]) {
                min = j;
            }
        }
        /* T(n)=4 - сравнение + обмен (зашито больше чем строчкой) */
        if (min != i) {
            [array[i], array[min]] = [array[min], array[i]];
        }
    }
    return array;
}
/* T(n) = 2n + n^2 + 1 = O(n^2) */
function insertionSort(array) {
    /* T(n) = 2n + n^2 */
    for (let i = 1; i < array.length; i++) {
        let current = array[i];
        let j = i - 1;
        /* T(n) = n - 1*/
        while (j > -1 && current < array[j]) {
            /* T(n)=2 - код */
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = current;
    }
    return array;
}
function bubbleSort(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
        }
    }
    return array;
}
function mergeSort(array) {
    if (array.length <= 1) {
        return array;
    }
    const middle = Math.floor(array.length / 2);
    const left = array.slice(0, middle);
    const right = array.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}
function merge(left, right) {
    let result = [];
    let l = 0;
    let r = 0;
    while (l < left.length && r < right.length) {
        if (left[l] < right[r]) {
            result.push(left[l]);
            l++;
        }
        else {
            result.push(right[r]);
            r++;
        }
    }
    return result.concat(left.slice(l)).concat(right.slice(r));
}
function shellSort(array, gapArr) {
    const n = array.length;
    for (let gap of gapArr) {
        for (let i = gap; i < n; i++) {
            let temp = array[i];
            let j;
            for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                array[j] = array[j - gap];
            }
            array[j] = temp;
        }
    }
    return array;
}
function generateShell(max) {
    let array = [1];
    let i = 0;
    while (array[i] <= max) {
        if (array[i] >= max) {
            array.pop();
            return array;
        }
        array.push(2 * array[i] + 1);
        i++;
    }
    array.pop();
    array.sort((a, b) => b - a);
    return array;
}
function generatePratt(max) {
    let array = [];
    let pow3 = 1;
    while (pow3 <= max) {
        let pow2 = pow3;
        while (pow2 <= max) {
            array.push(pow2);
            pow2 = pow2 * 2;
        }
        pow3 = pow3 * 3;
    }
    array.sort((a, b) => b - a);
    return array;
}
function generateHibbard(max) {
    let array = [1];
    let i = 1;
    while (array[i - 1] <= max) {
        if (array[i - 1] >= max) {
            array.pop();
            return array;
        }
        i++;
        array.push(2 ** i - 1);
    }
    array.pop();
    array.sort((a, b) => b - a);
    return array;
}
function quickSort(array) {
    if (array.length <= 1) {
        return array;
    }
    const current = array[array.length / 2];
    const left = [];
    const right = [];
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] < current) {
            left.push(array[i]);
        }
        else {
            right.push(array[i]);
        }
    }
    return [...quickSort(left), current, ...quickSort(right)];
}
function heapSort(array) {
    const size = array.length;
    for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
        makeHeap(array, size, i);
    }
    let j = size - 1;
    while (j >= 1) {
        [array[0], array[j]] = [array[j], array[0]];
        makeHeap(array, j, 0);
        j--;
    }
    return array;
}
function makeHeap(array, size, i) {
    let max = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    if (left < size && array[left] > array[max]) {
        max = left;
    }
    if (right < size && array[right] > array[max]) {
        max = right;
    }
    if (max != i) {
        [array[i], array[max]] = [array[max], array[i]];
        makeHeap(array, size, max);
    }
}
/*T(n) = n */
function checkArraySorted(array) {
    for (let i = 1; i < array.length; i++) {
        if (array[i] < array[i - 1])
            return false;
    }
    return true;
}
/* T(n) = 4n +1  */
function shuffle(array) {
    for (let i = 1; i < array.length; i++) {
        const j = Math.floor(Math.random() * (i - 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
/*
  T(n) = (5n + 1)*n! + 2 = O(n*n!)
*/
function shuffleSort(array) {
    if (array.length === 0 || array.length === 1)
        return array;
    /* 5n + 1 - каждый цикл
    Среднее время O будем считать по возможному кол-ву перестановок
  
    T(n) = (5n + 1)*n!
    */
    while (!checkArraySorted(array)) {
        array = shuffle(array);
    }
    return array;
}
