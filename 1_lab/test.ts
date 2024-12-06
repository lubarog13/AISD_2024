import {
  generateRandomArray, generateReverseSortedArray, generateSemiSortedArray, generateSortedArray,
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

export function testSelectionSortTimes() {
  const arrayResults = {
    sorted: [] as number[],
    semiSorted: [] as number[],
    reverseSorted: [] as number[],
    randomSorted: [] as number[],
  };
  for (let i=1;i<=15;i++) {
    const a = performance.now();
    selectionSort([...generateSortedArray(i*1000)]);
    const b = performance.now();
    selectionSort([...generateSemiSortedArray(i*1000)]);
    const c = performance.now();
    selectionSort([...generateReverseSortedArray(i*1000)]);
    const d = performance.now();
    selectionSort([...generateRandomArray(i*1000)]);
    const e = performance.now();
    arrayResults.sorted.push(b-a);
    arrayResults.semiSorted.push(c - b);
    arrayResults.reverseSorted.push(d -c);
    arrayResults.randomSorted.push(e - d);
  }
  return arrayResults;
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

export function testBubbleSortTimes() {
  const arrayResults = {
    sorted: [] as number[],
    semiSorted: [] as number[],
    reverseSorted: [] as number[],
    randomSorted: [] as number[],
  };
  for (let i=1;i<=15;i++) {
    const a = performance.now();
    bubbleSort([...generateSortedArray(i*1000)]);
    const b = performance.now();
    bubbleSort([...generateSemiSortedArray(i*1000)]);
    const c = performance.now();
    bubbleSort([...generateReverseSortedArray(i*1000)]);
    const d = performance.now();
    bubbleSort([...generateRandomArray(i*1000)]);
    const e = performance.now();
    arrayResults.sorted.push(b-a);
    arrayResults.semiSorted.push(c - b);
    arrayResults.reverseSorted.push(d -c);
    arrayResults.randomSorted.push(e - d);
  }
  return arrayResults;
}
export function testInsertionSortTimes() {
  const arrayResults = {
    sorted: [] as number[],
    semiSorted: [] as number[],
    reverseSorted: [] as number[],
    randomSorted: [] as number[],
  };
  for (let i=1;i<=15;i++) {
    const a = performance.now();
    insertionSort([...generateSortedArray(i*1000)]);
    const b = performance.now();
    insertionSort([...generateSemiSortedArray(i*1000)]);
    const c = performance.now();
    insertionSort([...generateReverseSortedArray(i*1000)]);
    const d = performance.now();
    insertionSort([...generateRandomArray(i*1000)]);
    const e = performance.now();
    arrayResults.sorted.push(b-a);
    arrayResults.semiSorted.push(c - b);
    arrayResults.reverseSorted.push(d -c);
    arrayResults.randomSorted.push(e - d);
  }
  return arrayResults;
}

export function testMergeSortTimes() {
  const arrayResults = {
    sorted: [] as number[],
    semiSorted: [] as number[],
    reverseSorted: [] as number[],
    randomSorted: [] as number[],
  };
  for (let i=1;i<=15;i++) {
    const a = performance.now();
    mergeSort([...generateSortedArray(i*1000)]);
    const b = performance.now();
    mergeSort([...generateSemiSortedArray(i*1000)]);
    const c = performance.now();
    mergeSort([...generateReverseSortedArray(i*1000)]);
    const d = performance.now();
    mergeSort([...generateRandomArray(i*1000)]);
    const e = performance.now();
    arrayResults.sorted.push(b-a);
    arrayResults.semiSorted.push(c - b);
    arrayResults.reverseSorted.push(d -c);
    arrayResults.randomSorted.push(e - d);
  }
  return arrayResults;
}

export function testHeapSortTimes() {
  const arrayResults = {
    sorted: [] as number[],
    semiSorted: [] as number[],
    reverseSorted: [] as number[],
    randomSorted: [] as number[],
  };
  for (let i=1;i<=15;i++) {
    const a = performance.now();
    heapSort([...generateSortedArray(i*1000)]);
    const b = performance.now();
    heapSort([...generateSemiSortedArray(i*1000)]);
    const c = performance.now();
    heapSort([...generateReverseSortedArray(i*1000)]);
    const d = performance.now();
    heapSort([...generateRandomArray(i*1000)]);
    const e = performance.now();
    arrayResults.sorted.push(b-a);
    arrayResults.semiSorted.push(c - b);
    arrayResults.reverseSorted.push(d -c);
    arrayResults.randomSorted.push(e - d);
  }
  return arrayResults;
}
export function testQuickSortTimes() {
  const arrayResults = {
    sorted: [] as number[],
    semiSorted: [] as number[],
    reverseSorted: [] as number[],
    randomSorted: [] as number[],
  };
  for (let i=1;i<=15;i++) {
    const a = performance.now();
    quickSort([...generateSortedArray(i*1000)]);
    const b = performance.now();
    quickSort([...generateSemiSortedArray(i*1000)]);
    const c = performance.now();
    quickSort([...generateReverseSortedArray(i*1000)]);
    const d = performance.now();
    quickSort([...generateRandomArray(i*1000)]);
    const e = performance.now();
    arrayResults.sorted.push(b-a);
    arrayResults.semiSorted.push(c - b);
    arrayResults.reverseSorted.push(d -c);
    arrayResults.randomSorted.push(e - d);
  }
  return arrayResults;
}
export function testShellSortTimes() {
  const arrayResults = {
    sorted: [] as number[],
    semiSorted: [] as number[],
    reverseSorted: [] as number[],
    randomSorted: [] as number[],
  };
  for (let i=1;i<=15;i++) {
    const a = performance.now();
    shellSort([...generateSortedArray(i*1000)], generateShell(i*1000));
    const b = performance.now();
    shellSort([...generateSemiSortedArray(i*1000)], generateShell(i*1000));
    const c = performance.now();
    shellSort([...generateReverseSortedArray(i*1000)], generateShell(i*1000));
    const d = performance.now();
    shellSort([...generateRandomArray(i*1000)], generateShell(i*1000));
    const e = performance.now();
    arrayResults.sorted.push(b-a);
    arrayResults.semiSorted.push(c - b);
    arrayResults.reverseSorted.push(d -c);
    arrayResults.randomSorted.push(e - d);
  }
  return arrayResults;
}
export function testHibbardSortTimes() {
  const arrayResults = {
    sorted: [] as number[],
    semiSorted: [] as number[],
    reverseSorted: [] as number[],
    randomSorted: [] as number[],
  };
  for (let i=1;i<=15;i++) {
    const a = performance.now();
    shellSort([...generateSortedArray(i*1000)], generateHibbard(i*1000));
    const b = performance.now();
    shellSort([...generateSemiSortedArray(i*1000)], generateHibbard(i*1000));
    const c = performance.now();
    shellSort([...generateReverseSortedArray(i*1000)], generateHibbard(i*1000));
    const d = performance.now();
    shellSort([...generateRandomArray(i*1000)], generateHibbard(i*1000));
    const e = performance.now();
    arrayResults.sorted.push(b-a);
    arrayResults.semiSorted.push(c - b);
    arrayResults.reverseSorted.push(d -c);
    arrayResults.randomSorted.push(e - d);
  }
  return arrayResults;
}
export function testPrattSortTimes() {
  const arrayResults = {
    sorted: [] as number[],
    semiSorted: [] as number[],
    reverseSorted: [] as number[],
    randomSorted: [] as number[],
  };
  for (let i=1;i<=15;i++) {
    const a = performance.now();
    shellSort([...generateSortedArray(i*1000)], generatePratt(i*1000));
    const b = performance.now();
    shellSort([...generateSemiSortedArray(i*1000)], generatePratt(i*1000));
    const c = performance.now();
    shellSort([...generateReverseSortedArray(i*1000)], generatePratt(i*1000));
    const d = performance.now();
    shellSort([...generateRandomArray(i*1000)], generatePratt(i*1000));
    const e = performance.now();
    arrayResults.sorted.push(b-a);
    arrayResults.semiSorted.push(c - b);
    arrayResults.reverseSorted.push(d -c);
    arrayResults.randomSorted.push(e - d);
  }
  return arrayResults;
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

export function testQuadroSort(length: number): [number, number, number, number] {
  let arr = generateRandomArray(length);
  const a = performance.now();
  selectionSort([...arr]);
  const b = performance.now();
  bubbleSort([...arr]);
  const c = performance.now();
  insertionSort([...arr]);
  const d = performance.now();
  shellSort([...arr], generateShell(arr.length));
  const e = performance.now();
  return [b - a, c - b, d - c, e - d];
}

export function testNonQuadroSort(length: number): [number, number, number, number, number] {
  let arr = generateRandomArray(length);
  const a = performance.now();
  mergeSort([...arr]);
  const b = performance.now();
  quickSort([...arr]);
  const c = performance.now();
  shellSort([...arr], generateHibbard(arr.length));
  const d = performance.now();
  shellSort([...arr], generatePratt(arr.length));
  const e = performance.now();
  heapSort([...arr]);
  const f = performance.now();
  return [b - a, c - b, d - c, e - d, f - e];
}