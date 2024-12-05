// run from adventofcode.com in the dev console
// standard config for all days
const headers = new Headers({
    "User-Agent": "github.com/yolocheezwhiz/adventofcode/"
});
const day = "2024/day/4";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", {
    headers: headers
})).text()).trim();
const startTime = Date.now();
const parsedInputs = localStorage[day].split('\n');

//day specific stuff
const len = parsedInputs.length;
let answerp1 = 0;
let answerp2 = 0;

// use a regex to find all matches forward and backward
function count(arguments) {
    arguments.forEach(str => answerp1 += (str.match(/XMAS/g) || []).length
      // split regex in to. something like /XMAS|SAMX/g won't eval properly
      // as it'll skip overlapping matches
        + (str.match(/SAMX/g) || []).length);
}

for (let y = 0; y < len; y++) {
    let horizontal = '';
    let vertical = '';
    // when looping through the grid, for each diagonal, 
    // we'll want to eval corner to middle, and middle to other corner
    // for example
    // A B C
    // D E F
    // G H I
    // if we eval once in the loop, we'll end up with (for the NW to SE diagonal)
    // 'AEI','BF','C'
    // we need to also eval 'G','DH' in the same diagonal direction
    // and avoid scanning 'AEI' twice
    let slashDiagonal1 = '';
    let slashDiagonal2 = '';
    let backslashDiagonal1 = '';
    let backslashDiagonal2 = '';

    // just read the current line
    horizontal = parsedInputs[y];
    // stay within the y loop
    for (let x = 0; x < len; x++) {
        // swap x and y
        vertical += parsedInputs[x][y];
        // increment both axis to eval both halves of the diagonal
        backslashDiagonal1 += parsedInputs[x + y]?.[x] || '';
        backslashDiagonal2 += parsedInputs[x]?.[x + y] || '';
        slashDiagonal1 += parsedInputs[y + x]?.[len - 1 - x] || '';
        slashDiagonal2 += parsedInputs[x]?.[len - 1 - (x + y)] || '';
    }
    // "avoid scanning 'AEI' twice"
    if (!y) slashDiagonal2 = '', backslashDiagonal2 = '';
    count([horizontal, vertical, slashDiagonal1, slashDiagonal2, backslashDiagonal1, backslashDiagonal2]);
}

console.log('answer p1: ' + answerp1);

// welp, part 1 was "fun" 
// (I wasted a lot of time on tiny mistakes) 
// but it definitely doesn't help with part 2
// let's just eval Xs kthxbai

for (let p = parsedInputs, y = 1; y < len - 1; y++) {
    // look for:
    for (let x = 1; x < len - 1; x++) {
        // M . M
        // . A .
        // S . S
        if (p[y - 1][x - 1] === "M" && p[y - 1][x + 1] === "M" && p[y][x] === "A" && p[y + 1][x - 1] === "S" && p[y + 1][x + 1] === "S") answerp2++;
        // S . S
        // . A .
        // M . M
        else if (p[y - 1][x - 1] === "S" && p[y - 1][x + 1] === "S" && p[y][x] === "A" && p[y + 1][x - 1] === "M" && p[y + 1][x + 1] === "M") answerp2++;
        // M . S
        // . A .
        // M . S
        else if (p[y - 1][x - 1] === "M" && p[y - 1][x + 1] === "S" && p[y][x] === "A" && p[y + 1][x - 1] === "M" && p[y + 1][x + 1] === "S") answerp2++;
        // S . M
        // . A .
        // S . M
        else if (p[y - 1][x - 1] === "S" && p[y - 1][x + 1] === "M" && p[y][x] === "A" && p[y + 1][x - 1] === "S" && p[y + 1][x + 1] === "M") answerp2++;
    }
}

console.log('answer p2: ' + answerp2);
console.log('solved in ' + (Date.now() - now) + ' ms.');
