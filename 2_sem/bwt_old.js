function encode_bwt(word) {
    let arr = [];
    let len = word.length
    for (let i = 0; i<len;i++) {
        arr.push(word.slice(i) + word.slice(0, i))
    }
    arr.sort()
    let sorted_arr = [...arr]
    sorted_arr.sort((a, b) => {
        if (a.slice(-1) > b.slice(-1)) return 1
        if (a.slice(-1) < b.slice(-1)) return -1
        return 0
    })
    let t_matrix = {}
    arr.forEach((it, i) => {
        t_matrix[sorted_arr.indexOf(it)] = i
    })
    console.log(sorted_arr)
    return {
        encoded: arr.map(it => it.slice(-1)).join(""),
        index: arr.indexOf(word),
        t_matrix
    }
}

function decode_bwt({encoded, index, t_matrix}) {
    let lemp_str = ''
    let len = encoded.length
    let curr_ind = index
    for (let i = 0; i<len;i++) {
        lemp_str += encoded[t_matrix[curr_ind]]
        curr_ind = t_matrix[curr_ind]
    }
    return lemp_str
}

console.log(encode_bwt(""))
decode_bwt(encode_bwt('абракадабра'))