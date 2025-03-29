import {compareArrays} from "./functions";

export interface ItemNode {
  position: number;
  next: number;
}

export interface CodeListItem {
  bytes: number[];
  position: number;
}

/*
* list<Node> encodeLZ78(string s):
    string buffer = ""                              // текущий префикс
    map<string, int> dict = {}                      // словарь
    list<Node> ans = []                             // ответ
    for i = 0 .. s.length - 1:
        if dict.hasKey(buffer + s[i]):              // можем ли мы увеличить префикс
            buffer += s[i]
        else:
            ans.push({dict[buffer], s[i]})          // добавляем пару в ответ
            dict[buffer + s[i]] = dict.length + 1   // добавляем слово в словарь
            buffer = ""                             // сбрасываем буфер
    if not (buffer is empty): // если буффер не пуст - этот код уже был, нужно его добавить в конец словаря
        last_ch = buffer.peek() // берем последний символ буффера, как "новый" символ
        buffer.pop() // удаляем последний символ из буфера
        ans.push({dict[buffer], last_ch}) // добавляем пару в ответ
    return ans
* */

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
/*
* string decodeLZ78(list<Node> encoded):
    list<string> dict = [""]                        // словарь, слово с номером 0 — пустая строка
    string ans = ""                                 // ответ
    for node in encoded:
        word = dict[node.pos] + node.next           // составляем слово из уже известного из словаря и новой буквы
        ans += word                                 // приписываем к ответу
        dict.push(word)                             // добавляем в словарь
    return ans
* */

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
