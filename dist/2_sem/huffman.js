"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeHuffman = encodeHuffman;
exports.decodeHuffman = decodeHuffman;
class Queue {
    constructor(capacity = Infinity) {
        this.capacity = capacity;
        this.storage = [];
    }
    enqueue(item) {
        if (this.size() === this.capacity) {
            throw Error("Queue has reached max capacity, you cannot add more items");
        }
        this.storage.push(item);
    }
    dequeue() {
        return this.storage.shift();
    }
    getItems() {
        return this.storage;
    }
    size() {
        return this.storage.length;
    }
}
/*
# Нахождение частот символов в строке
def count_symb(S):
    N = len(S)
    counter = numpy.array([0 for _ in range(128)])
    for s in S:
        counter[ord(s)] += 1
    return counter
*/
function countSymbols(bytes) {
    let len = bytes.length;
    let counter = Array(256).fill(0);
    for (let i = 0; i < len; i++) {
        counter[bytes[i]] += 1;
    }
    return counter;
}
/*
# Нахождение вероятностей символов в строке
def prob_estimate(S):
    N = len(S)
    P = numpy.array([0 for _ in range(128)])
    for s in S:
        P[ord(s)] += 1
    P = P/N
    return P
*/
function probEstimate(bytes) {
    let len = bytes.length;
    let probs = Array(256).fill(0);
    for (let i = 0; i < len; i++) {
        probs[bytes[i]] += 1;
    }
    return probs.map((it) => it / len);
}
/*
# Вычисление энтропии строки
def entropy(S):
    P = prob_estimate(S)
    P = numpy.array(list(filter(lambda x: x!=0,P)))
    E = -sum(numpy.log2(P) * P)
    return E

*/
function entropy(bytes) {
    let probs = probEstimate(bytes).filter(it => it !== 0);
    return -1 * probs.map(it => Math.log2(it) * it).reduce((a, it) => {
        return a + it;
    }, 0);
}
/*

# Наивная реализация преобразования движения к началу
def MTF(S):
    T = [chr(i) for i in range(128)]
    L = []
    S_new = ""
    for s in S:
        i = T.index(s)
        L.append(i)
        S_new += chr(i)
        T = [T[i]] + T[:i] + T[i+1:]
    return S_new

*/
/*

# Обратное преобразование
def iMTF(S):
    T = [chr(i) for i in range(128)]
    S_new = ""
    for s in S:
        i = ord(s)
        S_new += T[i]
        T = [T[i]] + T[:i] + T[i+1:]
    return S_new

*/
/*

# Класс узла для дерева Хаффмана
class Node():
    def __init__(self, symbol = None, counter = None, left = None, right =None, parent = None):
        self.symbol = symbol
        self.counter = counter
        self.left = left
        self.right = right
        self.parent = parent
    def __lt__(self, other):
        return self.counter < other.counter
*

*/
class HuffmanNode {
    constructor(symbol = null, counter = null, left = null, right = null, parent = null) {
        this.symbol = symbol;
        this.counter = counter;
        this.left = left;
        this.right = right;
        this.parent = parent;
    }
    ;
    compare(node) {
        return (this.counter || 0) - (node.counter || 0);
    }
}
function encodeHuffman(bytes) {
    let c = countSymbols(bytes);
    let leafs = [];
    let queue = new Queue();
    for (let i = 0; i < 128; i++) {
        if (c[i] !== 0) {
            let leaf = new HuffmanNode(i, c[i]);
            leafs.push(leaf);
            queue.enqueue(leaf);
        }
    }
    queue.getItems().sort((a, b) => {
        return a.compare(b);
    });
    while (queue.size() >= 2) {
        let left_node = queue.dequeue();
        let right_node = queue.dequeue();
        let parent_node = new HuffmanNode(null, null, left_node, right_node, null);
        if (left_node)
            left_node.parent = parent_node;
        if (right_node)
            right_node.parent = parent_node;
        parent_node.counter = ((left_node === null || left_node === void 0 ? void 0 : left_node.counter) || 0) + ((right_node === null || right_node === void 0 ? void 0 : right_node.counter) || 0);
        queue.enqueue(parent_node);
    }
    let codes = {};
    leafs.forEach(leaf => {
        var _a;
        let node = leaf;
        let code = "";
        while ((node === null || node === void 0 ? void 0 : node.parent) !== null) {
            if (((_a = node === null || node === void 0 ? void 0 : node.parent) === null || _a === void 0 ? void 0 : _a.left) === node) {
                code = "0" + code;
            }
            else {
                code = "1" + code;
            }
            node = node === null || node === void 0 ? void 0 : node.parent;
        }
        codes[leaf.symbol || 0] = code;
    });
    let coded_message = "";
    for (let i = 0; i < bytes.length; i++) {
        coded_message += codes[bytes[i]];
    }
    let k = 8 - coded_message.length % 8;
    coded_message += "0".repeat(k);
    let new_bytes = [];
    for (let i = 0; i < coded_message.length; i += 8) {
        let x = parseInt(coded_message.slice(i, i + 8), 2);
        new_bytes.push(x);
    }
    return { result: new Uint8Array(new_bytes), codes: codes };
}
function decodeHuffman(encoded) {
    let result = [];
    let coded_message = Array.from(encoded.result).map(it => {
        return it.toString(2).padStart(8, '0');
    }).join('');
    let buff = '';
    let dict = Object.fromEntries(Object.entries(encoded.codes).map(a => a.reverse()));
    for (let i = 0; i < coded_message.length; i++) {
        buff += coded_message[i];
        if (dict[buff]) {
            result.push(Number(dict[buff]));
            buff = '';
        }
    }
    return new Uint8Array(result);
}
