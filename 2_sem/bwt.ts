
/* Дописать бвт без передачи t_matrix, написать сохранение картики побайтово в файл */

export interface EncodedTable {
    encoded: Uint8Array,
    index: number
}

function compareByteTables(a: Array<number>, b: Array<number>): number {
    for (let i=0;i<a.length;i++) {
            if (a[i]> b[i]) return 1;
            if (a[i] < b[i]) return -1;
    }
    return 0
}

export function encodeBWT(word: Uint8Array): EncodedTable  {
    let arr: Array<Array<number>> = [];
    let len = word.length
    for (let i = 0; i<len;i++) {
        arr.push([...word.slice(i), ...word.slice(0, i)])
    }
    arr.sort(compareByteTables)
    let sorted_arr = [...arr]
    sorted_arr.sort((a, b) => compareByteTables(a.slice(-1), b.slice(-1)))
    let tempArr = arr.map(it => new Uint8Array(it));
    const compareArrays = (a: Uint8Array, b: Uint8Array) =>
        a.length === b.length &&
        a.every((element, index) => element === b[index]);
    let encodedArray: number[] = [];
    arr.map(it => encodedArray.push(it.slice(-1)[0]))
    return {
        encoded: new Uint8Array(encodedArray),
        index: tempArr.findIndex(it => compareArrays(it, word))
    }
}

export function decodeBWT({encoded, index}: EncodedTable): Uint8Array {
    let tempMatrix: number[][] = []
    for (let i = 0; i<encoded.length;i++) {
        tempMatrix.push([encoded[i], i])
    }
    tempMatrix.sort((a, b) => a[0] - b[0])
    let t_matrix: {[index:string]: number} = {}
    for (let i in tempMatrix) {
        t_matrix[i] = tempMatrix[i][1];
    }
    let temp_arr: number[]  =[]
    let len = encoded.length
    let curr_ind = index
    for (let i = 0; i<len;i++) {
        temp_arr.push(encoded[t_matrix[curr_ind]])
        curr_ind = t_matrix[curr_ind]
    }
    return new Uint8Array(temp_arr)
}