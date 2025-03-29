export function encodeRLE(bytes: Uint8Array): Uint8Array {
    let new_arr = [];
    let tempArr = []
    let counter = 1;
    let maxLen = 127;
    let prevCounter = 0;
    for (let i = 1; i<bytes.length; i++) {
        if (bytes[i]!==bytes[i-1] || counter >= maxLen) {
            if (counter===1 && tempArr.length < maxLen) {
                tempArr.push(bytes[i-1])
            } else {
                if (tempArr.length && tempArr.length > 1) {
                    new_arr.push(parseInt('1' + tempArr.length.toString(2).padStart(7, '0'), 2))
                    tempArr.forEach(byte => {
                        new_arr.push(byte)
                    });
                    tempArr = []
                } else if (tempArr.length) {
                    new_arr.push(tempArr.length)
                    tempArr.forEach(byte => {
                        new_arr.push(byte)
                    });
                    tempArr = []
                }
                new_arr.push(counter);
                new_arr.push(bytes[i-1]);
                counter = 1
            }
        } else counter++;
    }
    if (counter===1) {
        tempArr.push(bytes[bytes.length-1]);
    }
    if (tempArr.length && tempArr.length > 1) {
        new_arr.push(parseInt('1' + tempArr.length.toString(2).padStart(7, '0'), 2))
        tempArr.forEach(byte => {
            new_arr.push(byte)
        });
    } else if (tempArr.length) {
        new_arr.push(tempArr.length)
        tempArr.forEach(byte => {
            new_arr.push(byte)
        });
    }
    if (counter > 1) {
        new_arr.push(counter);
        new_arr.push(bytes[bytes.length-1]);
    }
    return new Uint8Array(new_arr);
}

export function decodeRLE(bytes: Uint8Array): Uint8Array {
    let counter = 0
    let tempArr = []
    let new_arr = []
    let isCharSeq = false;
    let isCounterElement = true
    for (let i=0;i<bytes.length;i++) {
        let bytesString = bytes[i].toString(2).padStart(8, '0')
        if (isCounterElement) {
            if (bytesString[0] === '1') {
                isCharSeq = true
                counter = parseInt(bytesString.slice(1), 2)
            } else {
                counter = parseInt(bytesString.slice(1), 2)
            }
            isCounterElement = false;
        }
        else {
            if (isCharSeq) {
                tempArr.push(bytes[i])
                counter--;
            } else {
                for (let j=0;j<counter;j++) {
                    new_arr.push(bytes[i])
                }
                isCounterElement = true
            }
            if (isCharSeq && counter===0 && tempArr.length) {
                tempArr.forEach(byte => {
                    new_arr.push(byte)
                });
                isCharSeq = false
                tempArr = []
                counter = 0
                isCounterElement = true
            }
        }
    }
    if (tempArr.length) {
        tempArr.forEach(byte => {
            new_arr.push(byte)
        });
    }
    return new Uint8Array(new_arr);
}