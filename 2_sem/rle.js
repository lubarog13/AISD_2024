function encode(str) {
    let new_str = '';
    let tempArr = []
    let counter = 1;
    let prevCounter = 0;
    for (let i = 1; i<str.length; i++) {
        if (str[i]!==str[i-1]) {
            if (counter===1) {
                tempArr.push(str[i-1])
            } else {
                if (tempArr.length && tempArr.length > 1) {
                    new_str += '$' + tempArr.length + tempArr.join('')
                    tempArr = []
                } else if (tempArr.length) {
                    new_str += tempArr.length + tempArr.join('')
                    tempArr = []
                }
                new_str += counter + str[i-1];
                counter = 1
            }
        } else counter++;
    }
    if (counter===1) {
        tempArr.push(str[str.length-1]);
    }
    if (tempArr.length && tempArr.length > 1) {
        new_str += '$' + tempArr.length + tempArr.join('')
    } else if (tempArr.length) {
        new_str += tempArr.length + tempArr.join('')
    }
    if (counter > 1) {
        new_str+=counter + str[str.length-1];
    }
    return new_str;
}

function decode(str) {
    let counter = ''
    let tempArr = []
    let new_str = ''
    let isCharSeq = false
    for (let i=0;i<str.length;i++) {
        if (str[i] >= '0' && str[i] <= '9') {
            if (isCharSeq && tempArr.length) {
                new_str += tempArr.join('')
                isCharSeq = false
                tempArr = []
                counter = ''
            }
            counter+=str[i]
        } else if (str[i] === '$') {
            isCharSeq = true
        } else {
            if (isCharSeq) {
                tempArr.push(str[i])
            } else {
                new_str += str[i].repeat(Number(counter))
                counter = ''
            }
        }
    }
    if (tempArr.length) {
        new_str += tempArr.join('')
    }
    return new_str
}