//RUN FROM adventofcode.com
let response = await fetch("https://adventofcode.com/2023/day/10/input");
let txt = await response.text();
let inputs = txt.trim().split("\n");

//coordinates to check, regex of character to look for per direction, stringified direction, stringified origin.
//I thought the regex was going to be used much more often, but whatever
let u = [-1, 0, /S|\||7|F/, "u", "d"];
let d = [1, 0, /S|\||J|L/, "d", "u"];
let l = [0, -1, /S|\-|F|L/, "l", "r"];
let r = [0, 1, /S|\-|J|7/, "r", "l"];

//what to check per character
let validation = {
  "|": [u, d],
  "-": [l, r],
  "J": [u, l],
  "7": [d, l],
  "F": [d, r],
  "L": [u, r]
};

//find the S
let start;
for (let y in inputs) {
  for (let x in inputs[y]) {
    if (inputs[y][x] == "S") {

      //wasted 30 minutes on this, again. stupid JS
      start = [+y, +x];
      break;
    }
  }
  if (start) break;
}

//find one direction to move to. If it errors here, there may be an adjacent pipe leading nowhere. just change the order of the if else if conditions (I'm lazy)
let to
if (inputs[start[0] - 1][start[1]].match(u[2])) to = [...u]
else if (inputs[start[0] + 1][start[1]].match(d[2])) to = [...d]
else if (inputs[start[0]][start[1] - 1].match(l[2])) to = [...l]
else if (inputs[start[0]][start[1] + 1].match(r[2])) to = [...r]

let i = 0;
let char;
let pos = start;

//needed for part 2
let coords = [];

//iterate through the pipe loop
while (true) {
  coords.push(pos);
  //count path length
  i++;
  //change current position
  pos = [pos[0] + to[0], pos[1] + to[1]];

  //find new character
  char = inputs[pos[0]][pos[1]];

  //check if we completed the loop
  if (char == "S") break;

  //check potential moves
  let moves = validation[char];

  //discard the move that would bring us back to our previous position
  to = to[4] != moves[0][3] ? moves[0] : moves[1];
}
console.log("part 1 answer: " + i / 2);

//part 2's answer
let p2 = 0;

//stringify coords as the detection includes the perimeter. We'll need to exclude from calculation
let str_coords = [];
for (let arr of coords) str_coords.push(arr[0] + "_" + arr[1]);

//draw a virtual polygon (other methods attempted failed miserably)
let canvas = document.createElement('canvas');
let context = canvas.getContext('2d');
context.beginPath();

//set origin
let first = coords.shift();
context.moveTo(first[0], first[1]);

//draw the polygon
for (let elem of coords) context.lineTo(elem[0], elem[1]);
context.closePath();

//check each coordinates of the map, exclude the perimeter
for (let y in inputs)
  for (let x in inputs[y])
    if (context.isPointInPath(+y, +x) && !(str_coords.includes(y + "_" + x))) p2++;
console.log("part 2 answer: " + p2);
