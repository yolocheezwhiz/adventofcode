// run from adventofcode.com in the dev console
// standard config for all days
const headers = new Headers({
    "User-Agent": "github.com/yolocheezwhiz/adventofcode/"
});
const day = "2024/day/3";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", {
    headers: headers
})).text()).trim();
const startTime = Date.now();
const input = localStorage[day]

// regex to find the valid instructions
let regex = /mul\([0-9]{1,3},[0-9]{1,3}\)/g;

// for each valid instruction, extract the 2 numbers 
// multiply them through a reduce function
// and add to answer
function multiply(input, part) {
    let answer = 0;
    input.match(regex).forEach(op => (answer += op.replace('mul(', '').replace(')', '').split(',').map(Number).reduce((a, b) => a * b)));
    console.log('answer ' + part + ': ' + answer);
    return
}

// part 1
multiply(input, 'p1');

// for part 2, we add a "do()" at the beginning
// then split the string by "don't()"
// and then split again all array elements by "do()"
// we throw away the first section of each array through slice
// which are the don't() instructions
// finally, we join back together the valid instructions and rerun part one
const filteredInput = ("do()" + input).split("don't()").flatMap(elem => elem.split("do()").slice(1)).join();
multiply(filteredInput, 'p2');
console.log('solved in ' + (Date.now() - now) + ' ms.');
