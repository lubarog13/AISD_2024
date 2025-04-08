"use strict";
/*
* from collections.abc import Generator, Iterable

class MoveToFront:
    """
    >>> mtf = MoveToFront()
    >>> list(mtf.encode("Wikipedia"))
    [87, 105, 107, 1, 112, 104, 104, 3, 102]
    >>> mtf.decode([87, 105, 107, 1, 112, 104, 104, 3, 102])
    'Wikipedia'
    >>> list(mtf.encode("wikipedia"))
    [119, 106, 108, 1, 113, 105, 105, 3, 103]
    >>> mtf.decode([119, 106, 108, 1, 113, 105, 105, 3, 103])
    'wikipedia'
    """
    def __init__(self, common_dictionary: Iterable[int] = range(256)):
        """
        Instead of always transmitting an "original" dictionary,
        it is simpler to just agree on an initial set.
        Here we use the 256 possible values of a byte.
        """
        # consume the iterable so it can be used multiple times
        self.common_dictionary = list(common_dictionary)

    def encode(self, plain_text: str) -> Generator[int]:
        # Changing the common dictionary is a bad idea. Make a copy.
        dictionary = list(self.common_dictionary)

        # Read in each character
        for c in plain_text.encode("latin-1"):  # Change to bytes for 256.
            # Find the rank of the character in the dictionary [O(k)]
            rank = dictionary.index(c)  # the encoded character
            yield rank

            # Update the dictionary [Θ(k) for insert]
            dictionary.pop(rank)
            dictionary.insert(0, c)

    def decode(self, compressed_data: Iterable[int]) -> str:
        """
        Inverse function that recover the original text
        """
        dictionary = list(self.common_dictionary)
        plain_text = []

        # Read in each rank in the encoded text
        for rank in compressed_data:
            # Remove the character of that rank from the dictionary
            e = dictionary.pop(rank)
            plain_text.append(e)

            # Insert the character at the beginning of dictionary
            dictionary.insert(0, e)

        return bytes(plain_text).decode("latin-1")  # Return original string
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeMtf = encodeMtf;
exports.decodeMtf = decodeMtf;
function encodeMtf(bytes) {
    let dictionary = [...Array(256).keys()];
    let result = [];
    bytes.forEach(byte => {
        let rank = bytes.indexOf(byte);
        result.push(rank);
        dictionary.splice(rank, 1);
        dictionary = [byte, ...dictionary];
    });
    return { encoded: new Uint8Array(result), dictionary };
}
function decodeMtf(encoded) {
    let result = [];
    encoded.encoded.forEach(rank => {
        let byte = encoded.dictionary.splice(rank, 1)[0];
        result.push(byte);
        encoded.dictionary = [byte, ...encoded.dictionary];
    });
    return new Uint8Array(result);
}
