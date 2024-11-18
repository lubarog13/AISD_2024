"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get1LabPage = void 0;
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
