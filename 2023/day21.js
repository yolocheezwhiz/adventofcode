//RUN FROM adventofcode.com
const headers = new Headers({
  "User-Agent": "github.com/yolocheezwhiz/adventofcode/"
});

//cache puzzle input
const day = "2023/day/21";
localStorage[day] = localStorage[day] || (await (await fetch("https://adventofcode.com/" + day + "/input", {
  headers: headers
})).text()).trim();
let inputs = localStorage[day].split('\n');

//find the S
let S;
for (let y in inputs)
  for (let x in inputs[y]) {
    if (inputs[y][x] == "S") S = y + "," + x;
  }
  
//let's use a double BFS queue for part 1 (I'm trying to get more confortable with queues)
let queue = [S];
let visited = [];
let valid = [];
let part1 = true;

function bfs(i, q) {

  //wipe global queue, as we are processing its current clone q
  queue = [];

  function eval_pos(pos) {
  
    //let's evaluate all potential moves from here.
    for (let dir of JSON.parse('[[-1,0],[1,0],[0,-1],[0,1]]')) {
      let next_pos = [+pos[0] + dir[0], +pos[1] + dir[1]];
      let str = next_pos.toString();
      
      //already visited || already added to next queue
      if (visited.includes(str) || queue.includes(str)) continue;
      
      //out of bounds
      if (next_pos[0] < 0 || next_pos[0] > inputs.length - 1 || next_pos[1] < 0 || next_pos[1] > inputs[0].length - 1) continue;
      
      //is a rock
      if (inputs[next_pos[0]][next_pos[1]] == "#") continue;
      
      //else add to queue
      queue.push(str);
    }
    return;
  }
  
  //empty current queue q
  while (q.length > 0) {
    let next = q.shift();
    
    //convert to y,x pos
    let yx = next.split(",");
    
    //add to visited array
    visited.push(next);
    
    //add to valid when i is odd
    if (i % 2 == 0) valid.push(next);
    eval_pos(yx);
  }
  
  //log answer at 64 steps during part 1
  if (i == 64 && part1) console.log("answer part 1: " + valid.length);
}

//walk the whole map for part 2
for (let i = 0; i <= Infinity; i++) {
  bfs(i, [...queue]);
  
  //break when done
  if (queue.length == 0) break;
}

part1 = false;
//Use Google sheets and draw a diamond shapes over 5 x (3x3) maps. You'll notice
//when arriving at the edge of a map, we have filled middle map squares, who have two patterns
//XOX
//OXO
//XOX
//where Xs will use odd numbers as valid, whereas Os will use even numbers
//we also have large triangles north-east, north-west, south-east, south-west
//we have 1 less of each, than maps we fully traverse
//we also have small triangles. we have as many as maps we fully traverse
//we also have north south west east extremeties (one of each), that we consider as not fully traversed
//we also notice that extremities and small triangles are using even numbers instead of odd, while large triangles use odd numbers
let short_triangles = 0;
let large_triangles = 0;
let extremities = 0;
let mid_squares = 1;
let semi_mid_squares = 0;

//calc number of full maps we traverse
let full = (26501365 - 65) / 131;
let j = 0;

//calc number of mid squares vs semi-mid squares 
function calc(x) {
  x % 2 == 0 ? mid_squares += j : semi_mid_squares += j;
  j += 4;
}
for (let x = 0; x < full; x++) calc(x);

//value per square, calculated by crawling the whole map during part 1
let mid_value = visited.length - valid.length; //even numbers
let semi_value = valid.length; //odd numbers

//small triangles
//we find the values of triangles and extremities by partially filling the map from corners
["0,0", "0,130", "130,0", "130,130"].forEach(pos => {
  queue = [pos];
  visited = [];
  valid = [];
  //we fill to mid
  for (let i = 0; i <= 65; i++) bfs(i, [...queue]);
  //keep odd
  short_triangles += valid.length;
});
//large triangles
["0,0", "0,130", "130,0", "130,130"].forEach(pos => {
  queue = [pos];
  visited = [];
  valid = [];
  //we fill by a length and a half
  for (let i = 0; i <= 196; i++) bfs(i, [...queue]);
  //keep even
  large_triangles += visited.length - valid.length;
});
//extremities
//we start on sides, and fill by a length
["0,65", "65,0", "65,130", "130,65"].forEach(pos => {
  queue = [pos];
  visited = [];
  valid = [];
  for (let i = 0; i <= 131; i++) bfs(i, [...queue]);
  //keep odd
  extremities += valid.length;
});

//add this all up
console.log("part 2 answer: " + (
  mid_squares * mid_value +
  semi_mid_squares * semi_value +
  full * short_triangles +
  (full - 1) * large_triangles +
  extremities));
