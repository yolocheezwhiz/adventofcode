//RUN FROM adventofcode.com
let inputs = (await (await fetch("https://adventofcode.com/2023/day/18/input")).text()).trim().split("\n");

let current = [0, 0];
let answer_p1 = 0;
let answer_p2 = 0;

//keep track of farthest coordinates
let topp = 0;
let bottom = 0;
let left = 0;
let right = 0;

//recycle from day 10
//draw a virtual polygon
let canvas = document.createElement('canvas');
let context = canvas.getContext('2d');
context.beginPath();
context.moveTo(0, 0);

//interpret instructions
for (let i = 0; i < inputs.length; i++) {
  let dir = inputs[i].split(" ")[0];
  let len = +inputs[i].split(" ")[1];

  //prepare to move
  if (dir == "U") current[0] -= len;
  if (dir == "D") current[0] += len;
  if (dir == "L") current[1] -= len;
  if (dir == "R") current[1] += len;

  //update farthest
  topp = Math.min(topp, current[0]);
  bottom = Math.max(bottom, current[0]);
  left = Math.min(left, current[1]);
  right = Math.max(right, current[1]);

  //move
  context.lineTo(current[0], current[1]);
}
context.closePath();

//calculate result
for (let y = topp; y <= bottom; y++) {
  for (let x = left; x <= right; x++) {
    if (context.isPointInPath(y, x)) answer_p1++;
  }
}
console.log("Answer part 1: " + answer_p1);

//part 2
//we cannot brute force like part 1, so we need to change the approach
current = [0, 0];
let arr = [];
arr.push(current[0], current[1]);

//we will need to add half the perimeter + 1 to the area
//https://en.wikipedia.org/wiki/Pick%27s_theorem
let perimeter = 0;

for (let i = 0; i < inputs.length; i++) {

  //extract instructions
  let instruction = inputs[i].split("#")[1].split(")")[0];
  let dir = instruction.substring(5);

  //0 means R, 1 means D, 2 means L, and 3 means U.
  dir = dir == "0" ? "R" : dir == "1" ? "D" : dir == "2" ? "L" : dir == "3" ? "U" : null;

  //hex to int
  let len = parseInt(instruction.substring(5, 0), 16);
  perimeter += len;

  //prepare to move
  if (dir == "U") current[0] -= len;
  if (dir == "D") current[0] += len;
  if (dir == "L") current[1] -= len;
  if (dir == "R") current[1] += len;

  //move
  arr.push(current[0], current[1]);
}

//https://stackoverflow.com/questions/24793288/calculating-the-area-of-an-irregular-polygon-using-javascript
function areaFromCoords(coordArray) {
  var x = coordArray,
    a = 0;
  
  // Must have even number of elements
  if (x.length % 2) return;

  // Process pairs, increment by 2 and stop at length - 2
  for (var i = 0, iLen = x.length - 2; i < iLen; i += 2) {
    a += x[i] * x[i + 3] - x[i + 2] * x[i + 1];
  }
  return Math.abs(a / 2);
}
answer_p2 = areaFromCoords(arr) + perimeter / 2 + 1;
console.log("Answer part 2: " + answer_p2);
