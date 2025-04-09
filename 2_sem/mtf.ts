
interface MtfEncode {
    encoded: Uint8Array,
    dictionary: number[]
}
export function encodeMtf(bytes: Uint8Array): MtfEncode {
    let dictionary = [...Array(256).keys()];
    let result: number[] = []
    bytes.forEach(byte => {
        let rank = bytes.indexOf(byte);
        result.push(rank)
        dictionary.splice(rank, 1)
        dictionary = [byte, ...dictionary];
    })
    return {encoded: new Uint8Array(result), dictionary}
}

export function decodeMtf(encoded: MtfEncode): Uint8Array {
    let result : number[] = []
    encoded.encoded.forEach(rank => {
        let byte = encoded.dictionary.splice(rank, 1)[0]
        result.push(byte)
        encoded.dictionary = [byte, ...encoded.dictionary]
    })
    return new Uint8Array(result)
}