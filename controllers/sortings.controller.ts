import express, { Express, Request, Response } from "express";
import {
  testBubbleSort,
  testHeapSort,
  testHibbardSort,
  testInsertionSort,
  testMergeSort,
  testPrattSort,
  testQuickSort,
  testSelectionSort,
  testShellSort,
} from "../1_lab/test";
import {
  generateRanomArray,
  reversedArray,
  semiSortedArray,
  sortedArray,
} from "../1_lab/arrays";

export const get1LabPage = (request: Request, response: Response) => {
  let randomArray = generateRanomArray();
  let selection_result = testSelectionSort(randomArray);
  let bubble_result = testBubbleSort(randomArray);
  let insertion_result = testInsertionSort(randomArray);
  let merge_result = testMergeSort(randomArray);
  let quick_result = testQuickSort(randomArray);
  let heap_result = testHeapSort(randomArray);
  let shell_result = testShellSort(randomArray);
  let hibbard_result = testHibbardSort(randomArray);
  let pratt_result = testPrattSort(randomArray);
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
    sortedArray: sortedArray.join(", "),
    semiSortedArray: semiSortedArray.join(", "),
    reversedArray: reversedArray.join(", "),
    randomArray: randomArray.join(", "),
  });
};
