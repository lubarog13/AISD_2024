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
  generateRandomArray,
  reversedArray,
  semiSortedArray,
  sortedArray,
} from "../1_lab/arrays";

export const get1LabPage = (request: Request, response: Response) => {
  let randomArray = generateRandomArray();
  let selection_result = testSelectionSort(randomArray);
  let bubble_result = testBubbleSort(randomArray);
  let insertion_result = testInsertionSort(randomArray);
  let merge_result = testMergeSort(randomArray);
  let quick_result = testQuickSort(randomArray);
  let heap_result = testHeapSort(randomArray);
  let shell_result = testShellSort(randomArray);
  let hibbard_result = testHibbardSort(randomArray);
  let pratt_result = testPrattSort(randomArray);
  let fastest_results = selection_result.map(it =>{ return  {name: 'Сортировка выбором', value: it}});
  for (let i =0;i<=3;i++) {
    if (bubble_result[i] < fastest_results[i].value) {
      fastest_results[i] = {name: 'Сортировка пузырьком', value: bubble_result[i]}
    }
    if (insertion_result[i] < fastest_results[i].value) {
      fastest_results[i] = {name: 'Сортировка вставками', value: insertion_result[i]}
    }
    if (merge_result[i] < fastest_results[i].value) {
      fastest_results[i] = {name: 'Сортировка слиянием', value: merge_result[i]}
    }
    if (quick_result[i] < fastest_results[i].value) {
      fastest_results[i] = {name: 'Быстрая сортировка', value: quick_result[i]}
    }
    if (heap_result[i] < fastest_results[i].value) {
      fastest_results[i] = {name: 'Пирамидальная сортировка', value: heap_result[i]}
    }
    if (shell_result[i] < fastest_results[i].value) {
      fastest_results[i] = {name: 'Сортировка Шелла (ряд Шелла)', value: shell_result[i]}
    }
    if (pratt_result[i] < fastest_results[i].value) {
      fastest_results[i] = {name: 'Сортировка Шелла (ряд Пратта)', value: pratt_result[i]}
    }
    if (hibbard_result[i] < fastest_results[i].value) {
      fastest_results[i] = {name: 'Сортировка Шелла (ряд Хиббарда)', value: hibbard_result[i]}
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
    sortedArray: sortedArray.join(", "),
    semiSortedArray: semiSortedArray.join(", "),
    reversedArray: reversedArray.join(", "),
    randomArray: randomArray.join(", "),
    fastest_results,
  });
};
