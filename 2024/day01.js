// run in browser dev console from adventofcode.com 
const headers = new Headers({
    "User-Agent": "github.com/yolocheezwhiz/adventofcode/"
});

// cache puzzle input
const day = "2024/day/1";
const now = Date.now();
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", {
    headers: headers
})).text()).trim();
const startTime = Date.now();
const leftArr = [];
const rightArr = [];
const parsedInputs = localStorage[day].split('\n').map(input => input.split('   ').map(Number));
let answerp1 = 0;
let answerp2 = 0;

// organize input into left and right arrays, then sort them
for (let [left, right] of parsedInputs) leftArr.push(left), rightArr.push(right);
leftArr.sort(); rightArr.sort();

// solve part 1 
// the catch here is that the right value can be smaller than the left one 
// which is never the case in the example input
// so we need to calculate the absolute value
// and add to the answer
for (let i = 0; i < parsedInputs.length; i++) answerp1 += Math.abs(rightArr[i] - leftArr[i]);

// solve part 2
// we simply loop through the left-hand side array
// and use reduce on the right-hand side one to count occurences of the current loop element
// we multiply the count by the value of the element
// and add to the answer
leftArr.forEach(elem => answerp2 += rightArr.reduce((count, val) => (val === elem ? count + 1 : count), 0) * elem);
console.log('answer part 1: ' + answerp1);
console.log('answer part 2: ' + answerp2);
console.log('solved in ' + (Date.now() - startTime) + "ms.");
