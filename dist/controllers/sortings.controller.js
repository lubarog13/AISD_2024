"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prattSortPage = exports.hibbardSortPage = exports.shellSortPage = exports.heapSortPage = exports.quickSortPage = exports.mergeSortPage = exports.insertionSortPage = exports.bubbleSortPage = exports.selectionSortPage = exports.get1LabPage = void 0;
const test_1 = require("../1_lab/test");
const arrays_1 = require("../1_lab/arrays");
const get1LabPage = (request, response) => {
    let randomArray = (0, arrays_1.generateRandomArray)();
    let selection_result = (0, test_1.testSelectionSort)(randomArray);
    let bubble_result = (0, test_1.testBubbleSort)(randomArray);
    let insertion_result = (0, test_1.testInsertionSort)(randomArray);
    let merge_result = (0, test_1.testMergeSort)(randomArray);
    let quick_result = (0, test_1.testQuickSort)(randomArray);
    let heap_result = (0, test_1.testHeapSort)(randomArray);
    let shell_result = (0, test_1.testShellSort)(randomArray);
    let hibbard_result = (0, test_1.testHibbardSort)(randomArray);
    let pratt_result = (0, test_1.testPrattSort)(randomArray);
    let quadroResults = [];
    let nonQuadroResults = [];
    for (let i = 1; i <= 10; i++) {
        quadroResults.push((0, test_1.testQuadroSort)(i * 1000));
        nonQuadroResults.push((0, test_1.testNonQuadroSort)(i * 1000));
    }
    let fastest_results = selection_result.map(it => { return { name: 'Сортировка выбором', value: it }; });
    for (let i = 0; i <= 3; i++) {
        if (bubble_result[i] < fastest_results[i].value) {
            fastest_results[i] = { name: 'Сортировка пузырьком', value: bubble_result[i] };
        }
        if (insertion_result[i] < fastest_results[i].value) {
            fastest_results[i] = { name: 'Сортировка вставками', value: insertion_result[i] };
        }
        if (merge_result[i] < fastest_results[i].value) {
            fastest_results[i] = { name: 'Сортировка слиянием', value: merge_result[i] };
        }
        if (quick_result[i] < fastest_results[i].value) {
            fastest_results[i] = { name: 'Быстрая сортировка', value: quick_result[i] };
        }
        if (heap_result[i] < fastest_results[i].value) {
            fastest_results[i] = { name: 'Пирамидальная сортировка', value: heap_result[i] };
        }
        if (shell_result[i] < fastest_results[i].value) {
            fastest_results[i] = { name: 'Сортировка Шелла (ряд Шелла)', value: shell_result[i] };
        }
        if (pratt_result[i] < fastest_results[i].value) {
            fastest_results[i] = { name: 'Сортировка Шелла (ряд Пратта)', value: pratt_result[i] };
        }
        if (hibbard_result[i] < fastest_results[i].value) {
            fastest_results[i] = { name: 'Сортировка Шелла (ряд Хиббарда)', value: hibbard_result[i] };
        }
    }
    response.render("index", {
        quadroResults: [quadroResults.map(it => it[0]), quadroResults.map(it => it[1]), quadroResults.map(it => it[2]), quadroResults.map(it => it[3])],
        nonQuadroResults: [nonQuadroResults.map(it => it[0]), nonQuadroResults.map(it => it[1]), nonQuadroResults.map(it => it[2]), nonQuadroResults.map(it => it[3]), nonQuadroResults.map(it => it[4])],
        selection_result,
        bubble_result,
        insertion_result,
        merge_result,
        quick_result,
        heap_result,
        shell_result,
        hibbard_result,
        pratt_result,
        sortedArray: arrays_1.sortedArray.join(", "),
        semiSortedArray: arrays_1.semiSortedArray.join(", "),
        reversedArray: arrays_1.reversedArray.join(", "),
        randomArray: randomArray.join(", "),
        fastest_results,
    });
};
exports.get1LabPage = get1LabPage;
const selectionSortPage = (request, response) => {
    response.render("algorithm", {
        name: "сортировки выбором",
        selection_result: (0, test_1.testSelectionSortTimes)()
    });
};
exports.selectionSortPage = selectionSortPage;
const bubbleSortPage = (request, response) => {
    response.render("algorithm", {
        name: "сортировки пузырьком",
        selection_result: (0, test_1.testBubbleSortTimes)()
    });
};
exports.bubbleSortPage = bubbleSortPage;
const insertionSortPage = (request, response) => {
    response.render("algorithm", {
        name: "сортировки вставками",
        selection_result: (0, test_1.testInsertionSortTimes)()
    });
};
exports.insertionSortPage = insertionSortPage;
const mergeSortPage = (request, response) => {
    response.render("algorithm", {
        name: "сортировки слиянием",
        selection_result: (0, test_1.testMergeSortTimes)()
    });
};
exports.mergeSortPage = mergeSortPage;
const quickSortPage = (request, response) => {
    response.render("algorithm", {
        name: "быстрой сортировки",
        selection_result: (0, test_1.testQuickSortTimes)()
    });
};
exports.quickSortPage = quickSortPage;
const heapSortPage = (request, response) => {
    response.render("algorithm", {
        name: "пирамидальной сортировки",
        selection_result: (0, test_1.testHeapSortTimes)()
    });
};
exports.heapSortPage = heapSortPage;
const shellSortPage = (request, response) => {
    response.render("algorithm", {
        name: "сортировки Шелла (ряд Шелла)",
        selection_result: (0, test_1.testShellSortTimes)()
    });
};
exports.shellSortPage = shellSortPage;
const hibbardSortPage = (request, response) => {
    response.render("algorithm", {
        name: "сортировки Шелла (ряд Хиббарда)",
        selection_result: (0, test_1.testHibbardSortTimes)()
    });
};
exports.hibbardSortPage = hibbardSortPage;
const prattSortPage = (request, response) => {
    response.render("algorithm", {
        name: "сортировки Шелла (ряд Пратта)",
        selection_result: (0, test_1.testPrattSortTimes)()
    });
};
exports.prattSortPage = prattSortPage;
