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
let answerp2 = 0;

function random(n, arr) {
    for (let i = 0; i < 2000; i++) {
        // Part 1 (simplified) operations
          n = (n ^ (n << 6)) & 0xFFFFFF;
          n = (n ^ (n >> 5)) & 0xFFFFFF; 
          n = (n ^ (n << 11)) & 0xFFFFFF; 
        // Push the last digit to the array
        arr.push(n % 10); 
    }
    return n;
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
    const diffs = [];
    // Build array of diffs
    for (let i = 0; i < arr.length - 1; i++) diffs.push(arr[i + 1] - arr[i]);
    // read diffs
    for (let i = 0; i < diffs.length - 3; i++) {
        // Convert diffs in a unique int to use as key
        const key = diffs[i] + diffs[i + 1] * 20 + diffs[i + 2] * 400 + diffs[i + 3] * 8000;
        // Get bananas
        const bananas = arr[i + 4];
        // If it's the first time we see this key for the current secret number
        if (!seen.has(key)) {
            // Remember it
            seen.add(key);
            // Add bananas to the count for this key, and eagerly get part 2 answer
            const sum = (countBananas.get(key) || 0) + bananas;
            answerp2 = answerp2 > sum ? answerp2 : sum;
            countBananas.set(key, sum);
        }
    }
});
console.log(`answer part 2: ${answerp2}`);
console.log(`solved in ${Date.now() - startTime} ms.`);
