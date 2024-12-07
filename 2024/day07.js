// General configuration for adventofcode.com
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/7";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// Day-specific setup
// Originally I did line.split(':') instead of line.split(': '). 
// This yielded a zero at the beginning of each input, and messed up part 2
const inputs = localStorage[day].split('\n').map(line => line.split(': ').map(entries => entries.split(' ').map(Number)));
let answerp1 = 0;
let addInP2 = 0;

// At first I brute forced. 
// Then I realized a good way to avoid it is to check if the answer is divisible by the last number in the array, or ends with it.
// So we're going to eval starting from right to left, and remove the array element from the answer ...
function rtl(partialResult, num, otherNums, p2) {
    // ...until it equals the first element of the array
    if (otherNums.length === 1) {
        if (partialResult / num === Number(otherNums)) return true;
        if (partialResult - num === Number(otherNums)) return true;
        // Only eval strings in p2
        if (p2 && Number(otherNums).toString() + num === partialResult.toString()) return true
        // We made it to the last element of the array, but unfortunately the condition wasn't met
        else return false
    } else {
        const nextNum = otherNums.pop();
        // If the answer is divisible by the current number, we recurse 
        if (partialResult % num === 0 && rtl(partialResult / num, nextNum, [...otherNums], p2)) return true;
        // If the answer is greater than or equal to the current number, we recurse
        if (partialResult - num >= 0 && rtl(partialResult - num, nextNum, [...otherNums], p2)) return true;
        // If the answer ends with the current number, we recurse
        if (p2 && partialResult.toString().endsWith(num.toString()) && rtl(Number(partialResult.toString().replace(new RegExp(num + '$'), '')), nextNum, [...otherNums], p2)) return true;
        // We recursed as much as we could, and no true value was returned, input isn't good
        else return false
    }
}

inputs.forEach(([result, nums]) => {
    // My parsing above set the answer as an array with a single value. Extract it
    const answer = Number(result);
    // Don't forget to pop outside of the function invokation's arguments, else p2 will be wrong
    const firstNum = nums.pop();
    // Don't forget to spread nums to a new array, else p2 will be wrong
    if (rtl(answer, firstNum, [...nums], false)) answerp1 += answer;
    // We only eval strings concat when p1 failed. 
    // We'll add the result to p1 to get p2's answer.
    else if (rtl(answer, firstNum, [...nums], true)) addInP2 += answer;
});
console.log('answer p1: ' + answerp1);
console.log('answer p2: ' + (answerp1 + addInP2));
console.log('solved in ' + (Date.now() - startTime) + ' ms.');
