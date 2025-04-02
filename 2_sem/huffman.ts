interface IQueue<T> {
    enqueue(item: T): void;
    dequeue(): T | undefined;
    getItems(): T[];
    size(): number;
}

class Queue<T> implements IQueue<T> {
    private storage: T[] = [];

    constructor(private capacity: number = Infinity) {}

    enqueue(item: T): void {
        if (this.size() === this.capacity) {
            throw Error("Queue has reached max capacity, you cannot add more items");
        }
        this.storage.push(item);
    }
    dequeue(): T | undefined {
        return this.storage.shift();
    }

    getItems(): T[] {
        return this.storage;
    }

    size(): number {
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

function countSymbols(bytes: Uint8Array) : Array<number> {
    let len = bytes.length;
    let counter: Array<number> = Array(256).fill(0)
    for (let i=0;i<len;i++) {
        counter[bytes[i]] += 1
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

function probEstimate(bytes: Uint8Array): Array<number> {
    let len = bytes.length;
    let probs: Array<number> = Array(256).fill(0)
    for (let i=0;i<len;i++) {
        probs[bytes[i]] += 1
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

function entropy(bytes: Uint8Array): number {
    let probs = probEstimate(bytes).filter(it => it!==0);
    return -1 * probs.map(it => Math.log2(it) * it).reduce((a, it) => {
        return a + it
    },0);
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

function moveToForward(bytes: Uint8Array): Uint8Array {
    let t = [...Array(256).keys()];
    let newStr: number[] = [];
    for (let i=0;i<bytes.length;i++) {
        let index = t.indexOf(bytes[i]);
        newStr.push(i)
        t = [t[i], ...t.slice(0, index), ...t.slice(index+1)]
    }
    return new Uint8Array(newStr)
}

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

function inverseMoveToForward(bytes: Uint8Array): Uint8Array {
    let t = [...Array(256).keys()];
    let newStr: number[] = []
    for (let i=0;i<bytes.length;i++) {
        let index = bytes[i]
        newStr.push(t[index])
        t = [t[i], ...t.slice(0, index), ...t.slice(index+1)]
    }
    return new Uint8Array(newStr);
}

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
    symbol: number | null;
    counter: number | null;
    left: HuffmanNode | null;
    right: HuffmanNode | null;
    parent: HuffmanNode | null;
    constructor(symbol: number | null = null, counter: number | null = null, left: HuffmanNode | null=null, right: HuffmanNode | null=null, parent: HuffmanNode | null=null) {
        this.symbol = symbol;
        this.counter = counter;
        this.left = left;
        this.right = right;
        this.parent = parent;
    };
    compare(node: HuffmanNode) {
        return (this.counter || 0) - (node.counter || 0);
    }
}

/*
* # Статический алгоритм Хаффмана
def HA(S):
    C = count_symb(S)
    list_of_leafs = []
    Q = queue.PriorityQueue()
    for i in range(128):
        if C[i] != 0:
            leaf = Node(symbol=chr(i), counter=C[i])
            list_of_leafs.append(leaf)
            Q.put(leaf)
    while Q.qsize() >= 2:
        left_node = Q.get()
        right_node = Q.get()
        parent_node = Node(left=left_node,right=right_node)
        left_node.parent = parent_node
        right_node.parent = parent_node
        parent_node.counter = left_node.counter + right_node.counter
        Q.put(parent_node)
    codes = {}
    for leaf in list_of_leafs:
        node = leaf
        code  = ""
        while node.parent != None:
            if node.parent.left == node:
                code = "0" + code
            else:
                code = "1" + code
            node = node.parent
        codes[leaf.symbol] = code
    coded_message = ""
    for s in S:
        coded_message += codes[s]
    k = 8 - len(coded_message)%8
    coded_message += (8 - len(coded_message)%8)*"0"
    bytes_string = b""
    for i in range(0,len(coded_message),8):
        s = coded_message[i:i+8]
        x = string_binary_to_int(s)
        print(x)
        bytes_string += x.to_bytes(1,"big")
    return bytes_string
*/

function getInt64Bytes(x: number) {
    let y= Math.floor(x/2**32);
    return [y,(y<<8),(y<<16),(y<<24), x,(x<<8),(x<<16),(x<<24)].map(z=> z>>>24)
}

function intFromBytes(byteArr: Array<number>) {
    return byteArr.reduce((a,c,i)=> a+c*2**(56-i*8),0)
}


function huffmanEncoding(bytes: Uint8Array) {
    let c = countSymbols(bytes);
    let leafs: Array<HuffmanNode> = [];
    let queue = new Queue<HuffmanNode>()
    for (let i=0;i<128;i++) {
        if (c[i]!==0) {
            let leaf = new HuffmanNode(i, c[i])
            leafs.push(leaf);
            queue.enqueue(leaf)
        }
    }
    queue.getItems().sort((a, b) => {
        return a.compare(b);
    })
    while (queue.size() >= 2) {
        let left_node: HuffmanNode | undefined = queue.dequeue()
        let right_node: HuffmanNode | undefined = queue.dequeue()
        let parent_node = new HuffmanNode(null, null, left_node, right_node, null);
        if (left_node) left_node.parent = parent_node;
        if (right_node) right_node.parent = parent_node;
        parent_node.counter = (left_node?.counter || 0) + (right_node?.counter || 0);
        queue.enqueue(parent_node)
    }
    let codes:  {[index: number]:string}  = {}
    leafs.forEach(leaf => {
        let node = leaf;
        let code = ""
        while (node?.parent!==null) {
            if (node?.parent?.left===node) {
                code = "0" + code;
            }
            else {
                code = "1" + code;
            }
            node = node?.parent;
        }
        codes[leaf.symbol || 0] = code;
    })
    let coded_message = ""
    for (let i=0;i<bytes.length;i++) {
        coded_message += codes[bytes[i]]
    }
    let k = 8 - coded_message.length%8
    coded_message += "0".repeat(k)
    console.log(codes, coded_message)
    let new_bytes = ""
    for (let i=0; i<coded_message.length;i+=8) {
        let x = stringBinaryToInt(coded_message.slice(i, i+8))
        console.log(x)
        new_bytes+=x
    }
    let utf8Encode = new TextEncoder();
    return utf8Encode.encode(new_bytes)
}
/*

# Преобразование строки размером 8 из нулей и единиц в двоичное число
def string_binary_to_int(s):
    X = 0
    for i in range(8):
        if s[i] == "1":
            X = X + 2**(7-i)
    return X
*/

function stringBinaryToInt(str: string) : number {
    let x = 0
    for (let i=0;i<8;i++) {
        if (str[i] === "1") {
            x = x+2**(7-i)
        }
    }
    return x
}

/*
# Средняя длина кода символа в строке при заданной кодировке
def mean_length_of_codes(codes,S):
    P = prob_estimate(S)
    L = 0
    for s in S:
        L += len(codes[s])
    L = L/len(S)
    return L

*/

function meanCodeLength(codes: {[index: string]:string}, str: string): number {
    return str.split('').reduce((a, it) => {
         return a + codes[it].length
     },0) / str.length;
}

/*

# Получение длин кодов Хаффмана
def codes_to_length(codes):
    symbol_lengths = {}
    for item in codes.items():
        symbol = item[0]
        symbol_lengths[symbol] = len(item[1])
    return symbol_lengths
*/

function codesToLength(codes: {[index: string]:string}): {[index: string]:number} {
    let lengths: {[index: string]:number} = {}
    Object.keys(codes).forEach(it => {
        lengths[it] = codes[it].length
    })
    return lengths;
}

/*
# Преобразование длин кодов Хаффмана в канонические коды
def length_to_codes(symbol_lengths):
    symbol_lengths = dict(sorted(symbol_lengths.items(), key = lambda item: item[1]))
    # print(symbol_lengths)
    codes = {}
    i = 0
    for item in symbol_lengths.items():
        symbol = item[0]
        L = item[1]
        if i == 0:
            code = 0
        else:
            code = (prevCode + 1) * 2**(L-prevLen)
        newStr = f'0b{code:032b}'
        codes[symbol] = newStr[-L:]
        prevCode = code
        prevLen = L
        i += 1
    return codes
* */

function lengthToCodes(lengths: {[index: string]:number}) {
    lengths = Object.fromEntries(
        Object.entries(lengths).sort(([,a],[,b]) => a-b)
    );
    let codes: {[index: string]:string} = {}
    let prevCode = -1
    let prevLen = 0
    Object.keys(lengths).forEach(item => {
        let code = (prevCode + 1) * 2**(lengths[item] - prevLen)
        let newStr = `0b{${Number(code.toString(2)).toFixed(32)}`
        codes[item] = newStr.slice(-lengths[item]);
        prevCode = code
        prevLen = lengths[item]
    })
    return codes

}


console.log(huffmanEncoding(new Uint8Array(new TextEncoder().encode("banana"))))