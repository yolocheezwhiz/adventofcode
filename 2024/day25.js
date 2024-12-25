// Standard config
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/25";
localStorage[day] ||= (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// Day specific stuff
const input = localStorage[day].split('\n\n');
const locks = [];
const keys = [];
let answer = 0;

// Gonna be easier to process stuff horizontally rather than vertically
function rotate(matrix) {
    const rotated = [];
    const rows = matrix.length;
    const cols = matrix[0].length;
    for (let col = 0; col < cols; col++) {
        const newRow = [];
        for (let row = rows - 1; row >= 0; row--) {
            newRow.push(matrix[row][col]);
        }
        rotated.push(newRow);
    }
    return rotated;
}

// Count # per row
function count(arr) {
    return arr.filter(c => c === '#').length;
}

// Split keys and locks. Parse them
input.forEach(elem => {
    const val = elem.split('\n').map(line => line.split(''));
    elem[0] === '.' ? keys.push(val) : locks.push(val);
});

// Same amount of locks and keys so no need to loop for each kind separately
for (let i = 0; i < locks.length; i++) {
    locks[i] = rotate(locks[i]);
    keys[i] = rotate(keys[i]);
}

// Count # per (rotated) row per key, and per lock
keys.forEach(key => {
    const [a, b, c, d, e] = [count(key[0]), count(key[1]), count(key[2]), count(key[3]), count(key[4])];
    locks.forEach(lock => {
        const [aa, bb, cc, dd, ee] = [count(lock[0]), count(lock[1]), count(lock[2]), count(lock[3]), count(lock[4])];
        // If each row for both a key and a lock have a combined total of 7 # or les, the key fits
        if (a + aa <= 7 && b + bb <= 7 && c + cc <= 7 && d + dd <= 7 && e + ee <= 7) answer++;
    });
});
console.log(`answer: ${answer}`);
console.log(`Solved in ${Date.now() - startTime} ms.`);
