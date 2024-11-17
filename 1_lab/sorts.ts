/* T(n) = 4n + n^2 + 1 = O(n^2) */
export function selectionSort(array: number[]): number[] {
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
export function insertionSort(array: number[]): number[] {
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

export function bubbleSort(array: number[]): number[] {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }

  return array;
}

export function mergeSort(array: number[]): number[] {
  if (array.length <= 1) {
    return array;
  }
  const middle = Math.floor(array.length / 2);
  const left = array.slice(0, middle);
  const right = array.slice(middle);
  return merge(mergeSort(left), mergeSort(right));
}

export function merge(left: number[], right: number[]): number[] {
  let result: number[] = [];
  let l = 0;
  let r = 0;

  while (l < left.length && r < right.length) {
    if (left[l] < right[r]) {
      result.push(left[l]);
      l++;
    } else {
      result.push(right[r]);
      r++;
    }
  }

  return result.concat(left.slice(l)).concat(right.slice(r));
}

export function shellSort(array: number[], gapArr: number[]): number[] {
  var n = array.length;

  for (let gap of gapArr) {
    for (let i = gap; i < n; i++) {
      var temp = array[i];
      var j;
      for (j = i; j >= gap && array[j - gap] > temp; j -= gap)
        array[j] = array[j - gap];

      array[j] = temp;
    }
  }
  return array;
}

export function generateShell(max: number): number[] {
  let array: number[] = [];
  let i = 0,
    current = 0;
  let j = 1;
  while (current <= max / 2) {
    current = i + j;
    array.push(current);
    i = j;
    j = current;
  }
  return array;
}
export function generatePratt(max: number): number[] {
  let i1 = 0,
    i2 = 0;
  let array: number[] = [1];
  for (let i = 1; i < max; ++i) {
    if (array[i1] * 2 < array[i2] * 3) {
      array[i] = array[i1] * 2;
      i1++;
    } else if (array[i1] * 2 > array[i2] * 3) {
      array[i] = array[i2] * 3;
      i2++;
    } else {
      array[i] = array[i1] * 2;
      i1++;
      i2++;
    }
    if (array[i] > max / 2) {
      return array;
    }
  }
  return array;
}

export function generateHibbard(max: number): number[] {
  let array: number[] = [1];
  let i = 1;
  while (i <= max / 2) {
    if (i >= max / 2) {
      return array;
    }
    i *= 2;
    array.push(i);
  }
  return array;
}

export function quickSort(array: number[]): number[] {
  if (array.length <= 1) {
    return array;
  }

  const current = array[array.length - 1];

  const left: number[] = [];
  const right: number[] = [];

  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] < current) {
      left.push(array[i]);
    } else {
      right.push(array[i]);
    }
  }
  return [...quickSort(left), current, ...quickSort(right)];
}

export function heapSort(array: number[]) {
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
}

export function makeHeap(array: number[], size: number, i: number) {
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
function checkArraySorted(array: number[]): boolean {
  for (let i = 1; i < array.length; i++) {
    if (array[i] < array[i - 1]) return false;
  }
  return true;
}

/* T(n) = 4n +1  */
function shuffle(array: number[]): number[] {
  for (let i = 1; i < array.length; i++) {
    const j = Math.floor(Math.random() * (i - 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/*
  T(n) = (5n + 1)*n! + 2 = O(n*n!)
*/
export function shuffleSort(array: number[]): number[] {
  if (array.length === 0 || array.length === 1) return array;
  /* 5n + 1 - каждый цикл
  Среднее время O будем считать по возможному кол-ву перестановок

  T(n) = (5n + 1)*n!
  */
  while (!checkArraySorted(array)) {
    array = shuffle(array);
  }
  return array;
}
