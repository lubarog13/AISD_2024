import {compareArrays} from "./functions";

export interface ItemNode {
  position: number;
  next: number;
}

export interface CodeListItem {
  bytes: number[];
  position: number;
}
export function encode78(bytes: Uint8Array): ItemNode[] {
  let buffer: number[] = [];
  let codes: CodeListItem[] = [{bytes: [], position:0}];
  let result: ItemNode[] = [];
  for (let i = 0; i < bytes.length; i++) {
    let indexOfCode = codes.findIndex((it) => compareArrays(it.bytes, [...buffer, bytes[i]]));
    if (indexOfCode !== -1) {
      buffer.push(bytes[i]);
    } else {
      indexOfCode = codes.findIndex((it) => compareArrays(it.bytes, buffer));
      result.push({ position: codes[indexOfCode].position, next: bytes[i] });
      codes.push({ bytes: [...buffer, bytes[i]], position: codes.length });
      buffer = [];
    }
  }
  if (buffer.length) {
    let lastByte = buffer.slice(-1)[0];
    buffer = buffer.slice(0, -1);
    let indexOfCode = codes.findIndex((it) => compareArrays(it.bytes, buffer));
    result.push({ position: codes[indexOfCode].position, next: lastByte });
  }
  return result;
}

export function decode78(encoded: ItemNode[]): Uint8Array {
  let codes: number[][] = [[]]
  let answer: number[] = []
  encoded.forEach(node => {
    let bytes = [...codes[node.position], node.next]
    answer = [...answer, ...bytes];
    codes.push(bytes)
  })
  return new Uint8Array(answer);
}
