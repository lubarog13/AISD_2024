"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get1LabPage = void 0;
const test_1 = require("../1_lab/test");
const arrays_1 = require("../1_lab/arrays");
const get1LabPage = (request, response) => {
    let randomArray = (0, arrays_1.generateRanomArray)();
    let selection_result = (0, test_1.testSelectionSort)(randomArray);
    let bubble_result = (0, test_1.testBubbleSort)(randomArray);
    let insertion_result = (0, test_1.testInsertionSort)(randomArray);
    let merge_result = (0, test_1.testMergeSort)(randomArray);
    let quick_result = (0, test_1.testQuickSort)(randomArray);
    let heap_result = (0, test_1.testHeapSort)(randomArray);
    let shell_result = (0, test_1.testShellSort)(randomArray);
    let hibbard_result = (0, test_1.testHibbardSort)(randomArray);
    let pratt_result = (0, test_1.testPrattSort)(randomArray);
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
    });
};
exports.get1LabPage = get1LabPage;
