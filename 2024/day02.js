// run from adventofcode.com in the dev console
// standard config for all days
const headers = new Headers({
    "User-Agent": "github.com/yolocheezwhiz/adventofcode/"
});
const day = "2024/day/2";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", {
    headers: headers
})).text()).trim();
const startTime = Date.now();
const parsedInputs = localStorage[day].split('\n')
    // day specific line parsing
    .map(line => line.split(' ').map(Number));
let answerp1 = 0;
let answerp2 = 0;

// moving the logic into a function for part 2
function check(line) {
    // check if ordered or reverse ordered by creating ordered and reversed clones and see if they match the original
    const orderedClone = [...line];
    // gotta love javascript number sorting that sorts alphabetically by default
    orderedClone.sort(function (a, b) { return a - b });
    const reversedClone = [...orderedClone];
    reversedClone.reverse();
    if (line.toString() !== orderedClone.toString() && line.toString() !== reversedClone.toString()) return true
    // check for repeating numbers by cloning to a set and comparing their size/length
    const set = new Set(line);
    if (set.size !== line.length) return true
    // check if jump size is at most 3 in absolute values
    for (let ii = 0; ii < line.length - 1; ii++) if (Math.abs(line[ii] - line[ii + 1]) > 3) return true
    // all tests passed
    return
}

// process each line
for (let i = 0; i < parsedInputs.length; i++) {
    let failure;
    const line = parsedInputs[i];
    // check for any failure
    failure = check(line);
    if (!failure) {
        // all tests passed, increment answer for both parts and check next line
        answerp1++;
        answerp2++;
        continue;
    }
    // test failed, test partial arrays for part 2
    // here we want at least a single iteration to pass
    failure = false;
    for (let iii = 0; iii < line.length; iii++) {
        const partialLine = [...line];
        // remove one array element
        partialLine.splice(iii, 1);
        failure = check(partialLine);
        // partial array passed the part 2 tests
        if (!failure) break;
    }
    // partial array passed the part 2 tests
    if (!failure) answerp2++;
}

console.log('answer p1: ' + answerp1);
console.log('answer p2: ' + answerp2);
console.log('solved in ' + (Date.now() - startTime) + ' ms.')
