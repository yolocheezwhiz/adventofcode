//Standard config
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/22";
localStorage[day] ||= (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// Day specific stuff
const numbers = localStorage[day].split('\n').map(Number);
const lastDigits = [];
const bananas = [];
const keySet = new Set();
let answerp1 = 0;

function random(num, arr) {
    // Part 1 operations
    for (let i = 0; i < 2000; i++) {
        step1 = ((num ^ (num * 64)) >>> 0) % 16777216;
        step2 = ((step1 ^ Math.floor(step1 / 32)) >>> 0) % 16777216;
        num = ((step2 ^ (step2 * 2048)) >>> 0) % 16777216;
        // Keep track of the results last digit for part 2
        arr.push(num % 10);
    }
    return num;
}

// Eval each secret number
numbers.forEach(num => {
    // Keep track for part 2
    const arr = [num % 10];
    answerp1 += random(num, arr);
    lastDigits.push(arr);
});
console.log(`answer part 1: ${answerp1}`);

// Part 2
const countBananas = new Map();
lastDigits.forEach(arr => {
    // Keep track of seen patterns to evaluate them once per secret number
    const seen = new Set();
    // Initialize the first pattern values
    let [a, b, c, d, e] = [arr[0], arr[1], arr[2], arr[3], arr[4]];
    // Convert into initial diffs
    a = b - a;
    b = c - b;
    c = d - c;
    d = e - d;
    for (let i = 0; i < arr.length - 4; i++) {
        // Avoid overly scanning the array, shift values instead
        if (i) {
            a = b;
            b = c;
            c = d;
            d = arr[i + 4] - arr[i + 3];
        }
        // Create string pattern to use as key
        const key = `${a},${b},${c},${d}`;
        // Get bananas
        const bananas = arr[i + 4];
        // If it's the first time we see this key for the current secret number
        if (!seen.has(key)) {
            // Remember it
            seen.add(key);
            // Add bananas to the count for this key
            countBananas.set(key, (countBananas.get(key) || 0) + bananas);
        }
    }
});
// Get the max banana value
console.log(`answer part 2: ${Math.max(...countBananas.values())}`);
console.log(`solved in ${Date.now() - startTime} ms.`);
