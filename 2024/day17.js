const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/17";
localStorage[day] ||= (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();

// Day-specific setup
let [A, B, C, ...Program] = localStorage[day].match(/\d+/gm).map(Number);
let answerp2 = [];
let jump, answer, p2String;

// Helper funcs
function combo(x) {
    return [0, 1, 2, 3, A, B, C, null][x];
}

function pow(x) {
    return Math.floor(A / Math.pow(2, combo(x)));
}

// Instructions
const proc = {
    0: (x) => { A = pow(x); },
    1: (x) => { B = (B ^ x) >>> 0; },
    2: (x) => { B = combo(x) % 8; },
    3: (x) => { if (A) pointer = x, jump = false; },
    4: (x) => { B = B ^ C; },
    5: (x) => { answer.push(combo(x) % 8); },
    6: (x) => { B = pow(x); },
    7: (x) => { C = pow(x); },
};

// Part one is simply a matter of properly reading instructions and applying them
function solve() {
    pointer = 0;
    answer = [];
    while (pointer < Program.length) {
        jump = true;
        const instruction = Program[pointer];
        const operand = Program[pointer + 1];
        proc[instruction](operand);
        if (jump) pointer += 2;
    }
}
solve();
console.log(`Answer Part 1: ${answer.toString()}`);

// Part 2 is a bitch, to say the least
// Testing various A values show a base 8 pattern, 
// where left-most value of the answer is based on the A%8 value
// 2nd left-most value is based on (A/8)%8 value
// 3rd => (A/64)%8. Etc.
// Logic of part 2 is therefore to try to build the stringified, reversed, program values
p2String = [...Program].reverse().join('');

function voodooMagick(sum, power) {
    for (let i = 0; i < 8; i++) {
        // Start with power 15 (expected answer length - 1)
        // Which influences the last value of the program
        // But that represents the first character of the reverse program value (p2String)
        // Test all values of `i` from 0 to 7
        let partialSum = sum + Math.pow(8, power) * i
        A = partialSum;
        B = 0;
        C = 0;
        solve();
        // Stringify the test's answer
        let str = answer.reverse().join('');
        // If we built the entire answer part 1 reversed string, we found one of many potential answers to part 2
        if (p2String === str) {
            answerp2.push(partialSum);
            return;
        }
        // We check if `i` helped us build the string correctly so far.
        // If so, we recurse, keeping in memory the current partial sum
        // And decrement the exponent
        else if (p2String.startsWith(str.substring(0, p2String.length - power))) {
            voodooMagick(partialSum, power - 1);
        }
    }
}
//YOLO
voodooMagick(0, 15);
// We keep the lowest value of all answers found
console.log(`Answer Part 2: ${Math.min(...answerp2)}`);
console.log(`Solved in ${Date.now() - startTime} ms.`);
