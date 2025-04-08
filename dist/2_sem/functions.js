"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareArrays = void 0;
exports.findCsa = findCsa;
const compareArrays = (a, b) => a.length === b.length && a.every((element, index) => element === b[index]);
exports.compareArrays = compareArrays;
function findCsa(arr, subarr, from_index = 0) {
    var i = from_index >>> 0, sl = subarr.length, l = arr.length + 1 - sl;
    loop: for (; i < l; i++) {
        for (var j = 0; j < sl; j++)
            if (arr[i + j] !== subarr[j])
                continue loop;
        return i;
    }
    return -1;
}
