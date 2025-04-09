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

export function decode77(compressed: CodingListItem[]) {
    let bytesDecoded: number[] = []
    compressed.forEach(item => {
        let {position, len, byte} = item;
        bytesDecoded = [...bytesDecoded, ...bytesDecoded.slice(bytesDecoded.length - position, bytesDecoded.length - position + len), byte]
    })
    return new Uint8Array(bytesDecoded)
}