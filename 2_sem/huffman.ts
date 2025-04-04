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

interface HuffmanResult {
    codes: {[index: number]: string},
    result: Uint8Array
}

export function encodeHuffman(bytes: Uint8Array): HuffmanResult {
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
    let new_bytes = []
    for (let i=0; i<coded_message.length;i+=8) {
        let x = parseInt(coded_message.slice(i, i+8), 2)
        new_bytes.push(x)
    }
    return {result: new Uint8Array(new_bytes), codes: codes}
}

export function decodeHuffman(encoded: HuffmanResult) : Uint8Array {
    let result: number[] = []
    let coded_message: string = Array.from(encoded.result).map(it => {
        return it.toString(2).padStart(8, '0')
    }).join('')
    let buff = '';
    let dict = Object.fromEntries(Object.entries(encoded.codes).map(a => a.reverse()))
    for (let i=0;i<coded_message.length;i++) {
        buff+= coded_message[i];
        if (dict[buff]) {
            result.push(Number(dict[buff]));
            buff = ''
        }
    }
    return new Uint8Array(result)
}