import {
  generateRanomArray,
  reversedArray,
  semiSortedArray,
  sortedArray,
} from "./arrays";
import {
  selectionSort,
  bubbleSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  shellSort,
  generateShell,
  generateHibbard,
  generatePratt,
} from "./sorts";

export function testSelectionSort(
  randomArray: number[]
): [number, number, number, number] {
  const a = performance.now();
  selectionSort([...sortedArray]);
  const b = performance.now();
  selectionSort([...semiSortedArray]);
  const c = performance.now();
  selectionSort([...reversedArray]);
  const d = performance.now();
  selectionSort([...randomArray]);
  const e = performance.now();
  return [b - a, c - b, d - c, e - d];
}
export function testBubbleSort(
  randomArray: number[]
): [number, number, number, number] {
  const a = performance.now();
  bubbleSort([...sortedArray]);
  const b = performance.now();
  bubbleSort([...semiSortedArray]);
  const c = performance.now();
  bubbleSort([...reversedArray]);
  const d = performance.now();
  bubbleSort([...randomArray]);
  const e = performance.now();
  return [b - a, c - b, d - c, e - d];
}
export function testInsertionSort(
  randomArray: number[]
): [number, number, number, number] {
  const a = performance.now();
  insertionSort([...sortedArray]);
  const b = performance.now();
  insertionSort([...semiSortedArray]);
  const c = performance.now();
  insertionSort([...reversedArray]);
  const d = performance.now();
  insertionSort([...randomArray]);
  const e = performance.now();
  return [b - a, c - b, d - c, e - d];
}
export function testMergeSort(
  randomArray: number[]
): [number, number, number, number] {
  const a = performance.now();
  mergeSort([...sortedArray]);
  const b = performance.now();
  mergeSort([...semiSortedArray]);
  const c = performance.now();
  mergeSort([...reversedArray]);
  const d = performance.now();
  mergeSort([...randomArray]);
  const e = performance.now();
  return [b - a, c - b, d - c, e - d];
}

export function testQuickSort(
  randomArray: number[]
): [number, number, number, number] {
  const a = performance.now();
  quickSort([...sortedArray]);
  const b = performance.now();
  quickSort([...semiSortedArray]);
  const c = performance.now();
  quickSort([...reversedArray]);
  const d = performance.now();
  quickSort([...randomArray]);
  const e = performance.now();
  return [b - a, c - b, d - c, e - d];
}

export function testHeapSort(
  randomArray: number[]
): [number, number, number, number] {
  const a = performance.now();
  heapSort([...sortedArray]);
  const b = performance.now();
  heapSort([...semiSortedArray]);
  const c = performance.now();
  heapSort([...reversedArray]);
  const d = performance.now();
  heapSort([...randomArray]);
  const e = performance.now();
  return [b - a, c - b, d - c, e - d];
}

export function testShellSort(
  randomArray: number[]
): [number, number, number, number] {
  const a = performance.now();
  shellSort([...sortedArray], generateShell(sortedArray.length));
  const b = performance.now();
  shellSort([...semiSortedArray], generateShell(semiSortedArray.length));
  const c = performance.now();
  shellSort([...reversedArray], generateShell(reversedArray.length));
  const d = performance.now();
  shellSort([...randomArray], generateShell(randomArray.length));
  const e = performance.now();
  return [b - a, c - b, d - c, e - d];
}

export function testHibbardSort(
  randomArray: number[]
): [number, number, number, number] {
  const a = performance.now();
  shellSort([...sortedArray], generateHibbard(sortedArray.length));
  const b = performance.now();
  shellSort([...semiSortedArray], generateHibbard(semiSortedArray.length));
  const c = performance.now();
  shellSort([...reversedArray], generateHibbard(reversedArray.length));
  const d = performance.now();
  shellSort([...randomArray], generateHibbard(randomArray.length));
  const e = performance.now();
  return [b - a, c - b, d - c, e - d];
}

export function testPrattSort(
  randomArray: number[]
): [number, number, number, number] {
  const a = performance.now();
  shellSort([...sortedArray], generatePratt(sortedArray.length));
  const b = performance.now();
  shellSort([...semiSortedArray], generatePratt(semiSortedArray.length));
  const c = performance.now();
  shellSort([...reversedArray], generatePratt(reversedArray.length));
  const d = performance.now();
  shellSort([...randomArray], generatePratt(randomArray.length));
  const e = performance.now();
  return [b - a, c - b, d - c, e - d];
}
