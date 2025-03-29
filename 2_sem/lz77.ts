/*
* def LZ77(S):
    buffer_size = 10
    string_size = 10
    coding_list = []
    buffer = ""
    N = len(S)
    i = 0
    while i < N:
        buffer = S[max(0,i-buffer_size) : i]
        print(i, repr(buffer))
        new_buffer_size = len(buffer)
        shift = -1
        for j in range(string_size, -1, -1):
            subS = S[i : min(i + j,N)]
            shift = buffer.find(subS)
            if shift != -1:
                break
        coding_list.append((new_buffer_size - shift, len(subS), S[i + len(subS)]))
        i += len(subS)+1
    return coding_list
*/
import {findCsa} from "./functions";

export interface CodingListItem {
    position: number,
    len: number,
    byte: number
}
export function encode77(bytes: Uint8Array){
    let bufferSize = 10;
    let stringSize = 10
    let codingList: CodingListItem[] = []
    // let buffer : Uint8Array = []
    let ind  = 0
    while (ind < bytes.length) {
        let buffer = bytes.slice(Math.max(0, ind - bufferSize ), ind);
        let shift = -1;
        let subS: Uint8Array | null = null;
        for (let j = stringSize;j > -1;j--) {
            subS = bytes.slice(ind, Math.min(ind + j, bytes.length))
            shift = findCsa(buffer, subS);
            if (shift !== -1)
                break
        }
        codingList.push({position: buffer.length - shift, len: subS?.length || 0, byte: bytes[ind + (subS?.length || 0)]})
        ind += (subS?.length || 0) + 1
    }
    return codingList;
}

/*
# декодирование LZ77
def iLZ77(compressed_message):
    compressed_message = [(0,0,"a"), (0,0,"b"),(2,2,"c"),(5,4,"e")]
    S = ""
    for t in compressed_message:
        shift, length, symbol = t
        print(t)
        N =len(S)
        S += S[N-shift : N-shift+length]+ symbol
    return S*/

export function decode77(compressed: CodingListItem[]) {
    let bytesDecoded: number[] = []
    compressed.forEach(item => {
        let {position, len, byte} = item;
        bytesDecoded = [...bytesDecoded, ...bytesDecoded.slice(bytesDecoded.length - position, bytesDecoded.length - position + len), byte]
    })
    return new Uint8Array(bytesDecoded)
}