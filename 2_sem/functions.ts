export const compareArrays = (a: number[] | Uint8Array, b: number[] | Uint8Array) =>
    a.length === b.length && a.every((element, index) => element === b[index]);

export function findCsa(arr: Uint8Array, subarr: Uint8Array, from_index: number = 0) {
    var i = from_index >>> 0,
        sl = subarr.length,
        l = arr.length + 1 - sl;

    loop: for (; i<l; i++) {
        for (var j=0; j<sl; j++)
            if (arr[i+j] !== subarr[j])
                continue loop;
        return i;
    }
    return -1;
}
