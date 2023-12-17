//RUN FROM adventofcode.com
let response = await fetch("https://adventofcode.com/2023/day/10/input");
let txt = await response.text();
let inputs = txt.trim().split("\n");


//coordinates to check, regex of character to look for per direction, stringified direction, stringified origin.
//I thought the regex was going to be used much more often, but whatever. It's there, I'm not changing it.
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

      //wasted 30 minutes on this, again. fuck JS weak typing.
      start = [+y, +x];
      break;
    }
  }
  if (start) break;
}

//find one direction to move to. If it errors here, there may be an adjacent pipe leading nowhere. just change the order of the conditions if needed (I'm lazy)
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

//part 1 is solved here, but I log it at the end of the script, after part 2's viz

//part 2's answer
let p2 = [];

//stringify coords as the detection includes the perimeter. We'll need to exclude from calculation
let str_coords = [];
for (let arr of coords) str_coords.push(arr[0] + "_" + arr[1]);

//build a map with only the perimeter
for (let y in inputs) {
  let str = ""
  for (let x in inputs[y]) str += str_coords.includes(y + "_" + x) ? inputs[y][x] : " ";
  inputs[y] = str;
}

//transpose the map
let transposed = [];
for (let x = 0; x < inputs.length; x++) {
  let str = "";
  for (let y = 0; y < inputs.length; y++) {
    str += inputs[y][x];
  }
  transposed.push(str);
}

//for each non-perimeter coordinates, we're going to evaluate the substrings left and right of it
//similarly, we will check for substrings up and down of it, using the transposed map
for (let y in inputs)
  for (let x in inputs[y]) {
    y = +y;
    x = +x;
    if (inputs[y][x] == " ") {

      //we can get rid of a bunch of characters we don't care about for this eval
      //My S is a "-". Yours may be something else. Adapt as needed
      //We discard - for left/right, and | for up/down evals
      let left = inputs[y].substr(0, x).replaceAll("S", "-").replaceAll(" ", "").replaceAll("-", "");
      let right = inputs[y].substr(x + 1).replaceAll("S", "-").replaceAll(" ", "").replaceAll("-", "");
      let up = transposed[x].substr(0, y).replaceAll("S", "-").replaceAll(" ", "").replaceAll("|", "");
      let down = transposed[x].substr(y + 1).replaceAll("S", "-").replaceAll(" ", "").replaceAll("|", "");

      //we count the occurences (left/right) of | as 1, FJ or L7 as 1 (they represent a diagonal of sorts, so only one border),
      //F7 or LJ as 2 (they represent a U turn of sorts, so 2 borders)
      //better represented as └┘ (LJ) ┌┐ (F7) └┐ (L7) ┌┘ (FJ)
      left = (left.match(/\||FJ|L7/g) || []).length + 2 * (left.match(/F7|LJ/g) || []).length;
      right = (right.match(/\||FJ|L7/g) || []).length + 2 * (right.match(/F7|LJ/g) || []).length;

      //same, but the "U turns" are using different combos / order of characters. better represented as 
      //┌ (FL) ┐ (7J) ┌ (FJ) ┐ (7L)
      //└      ┘      ┘      └
      up = (up.match(/\-|FJ|7L/g) || []).length + 2 * (up.match(/FL|7J/g) || []).length;
      down = (down.match(/\-|FJ|7L/g) || []).length + 2 * (down.match(/FL|7J/g) || []).length;

      //if all 4 checks are odd, the pos is in the perimeter
      //arguably, I could've used p2++ here, but it's just as easy to get p2.length, and p2 as array of pos will help vizualize the result, which is cool
      if (left % 2 && right % 2 && up % 2 && down % 2) p2.push(y + "_" + x);
    }
  }

//let's viz this thing just for the lols
let str = "";
for (let y in inputs) {
  for (let x in inputs[y]) {

    //should've replaced these characters for corners long ago, but I stumbled upon them after solving
    //this viz keeps the borders, * is inside, . is outside
    str += str_coords.includes(y + "_" + x) ? inputs[y][x].replace("J", "┘").replace("F", "┌").replace("7", "┐").replace("L", "└") : p2.includes(y + "_" + x) ? "*" : ".";
  }
  str += "\n";
}
console.log(str);
console.log("part 1 answer: " + coords.length / 2);
console.log("part 2 answer: " + p2.length);
