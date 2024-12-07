// General configuration for adventofcode.com
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/7";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// Day-specific setup
const inputs = localStorage[day].split('\n').map(line => line.split(':').map(entries => entries.split(' ').map(Number)));
let answerp1 = 0;
let answerp2 = 0;
// For each line
inputs.forEach(([left, right]) => {
    // My parsing above set the answer as an array with a single value. Extract it
    const answer = Number(left);
    // Extract the first number to eval, set it in a Set
    let potentialAnswers = new Set([right.shift()]);
    // For each num left to process
    right.forEach(num2 => {
        const temp = new Set();
        // Add, multiply, and concat
        potentialAnswers.forEach(num1 => {
            // Properly process nums as nums
            if (typeof num1 === 'number') {
                temp.add(num1 + num2);
                temp.add(num1 * num2);
                temp.add('' + num1 + num2);
            // And strings as strings
            } else {
                temp.add('' + (Number(num1) + num2));
                temp.add('' + (Number(num1) * num2));
                temp.add('' + num1 + num2);
            }
        });
        // Replace potentialAnswers with the new Set
        potentialAnswers = temp;
    });
    // Now we just check if the Set includes the answer
    if (potentialAnswers.has(answer)) answerp1 += answer;
    // Or the stringified answer
    if (potentialAnswers.has('' + answer)) answerp2 += answer;
});
console.log('answer p1: ' + answerp1);
console.log('answer p2: ' + answerp2);
console.log('solved in ' + (Date.now() - startTime) + ' ms.');
