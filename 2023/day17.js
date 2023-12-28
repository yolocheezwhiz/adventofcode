//REVISED USING BFS

//RUN FROM adventofcode.com
const start = Date.now();
let inputs = (await (await fetch("https://adventofcode.com/2023/day/17/input")).text()).trim().split("\n");
let graph = {};
let starting_obj = {};
let queue;
let y_bound = inputs.length;
let x_bound = inputs[0].length;
//create a graph representing all y,x pos that can be reached vertically (_v) or horizontally (_h) in N_min, N_max turns.
//for example, pos 0,0 doesn't have a single neighbor to its right, it has three: 0,1 0,2 and 0,3. 
//if we decide to go to 0,1 we HAVE to move vertically next.
function build_graph(range_min, range_max) {
  for (let col = 0; col < inputs.length; col++)
    for (let row = 0; row < inputs[0].length; row++) {
      //set coordinates as being reachable both vertically and horizontally, as 2 separate coordinates
      graph[col + "," + row + "_v"] = JSON.parse('{"least":999999,"neighbors":{}}');
      graph[col + "," + row + "_h"] = JSON.parse('{"least":999999,"neighbors":{}}');
      //check if down neighbors exist 
      for (let i = range_min; i <= range_max; i++) {
        //if they do
        if (col + i < y_bound) {
          //create the key
          graph[col + "," + row + "_v"].neighbors[(col + i) + "," + row + "_h"] = 0;
          //sum the length to get to it
          for (let j = 1; j <= i; j++) graph[col + "," + row + "_v"].neighbors[(col + i) + "," + row + "_h"] += +inputs[col + j][row];
        }
        //repeat the process to go up
        if (col - i >= 0) {
          graph[col + "," + row + "_v"].neighbors[(col - i) + "," + row + "_h"] = 0;
          for (let j = 1; j <= i; j++) graph[col + "," + row + "_v"].neighbors[(col - i) + "," + row + "_h"] += +inputs[col - j][row];
        }
        //repeat the process to go right
        if (row + i < x_bound) {
          graph[col + "," + row + "_h"].neighbors[col + "," + (row + i) + "_v"] = 0;
          for (let j = 1; j <= i; j++) graph[col + "," + row + "_h"].neighbors[col + "," + (row + i) + "_v"] += +inputs[col][row + j];
        }
        //repeat the process to go left
        if (row - i >= 0) {
          graph[col + "," + row + "_h"].neighbors[col + "," + (row - i) + "_v"] = 0;
          for (let j = 1; j <= i; j++) graph[col + "," + row + "_h"].neighbors[col + "," + (row - i) + "_v"] += +inputs[col][row - j];
        }
      }
    }
}

function walk() {
  //we shallow-copy-merge 0,0_h.neighbors and 0,0_v.neighbors together
  Object.assign(starting_obj, graph["0,0_h"].neighbors, graph["0,0_v"].neighbors);
  //set path length to zero for starting pos
  graph['0,0_h'].least = 0;
  graph['0,0_v'].least = 0;
  //BFS
  queue = Object.keys(starting_obj);
  //We keep track of next node, and current one
  for (let i in queue) queue[i] = [queue[i], queue[i].match("h") ? "0,0_v" : "0,0_h"];
  //We set length to neighbors from starting pos  
  for (let i in queue) graph[queue[i][0]].least = graph[queue[i][1]].least + graph[queue[i][1]].neighbors[queue[i][0]];
  while (queue.length > 0) {
    let next = queue.shift();
    for (let el in graph[next[0]].neighbors) {
      //we check if path to neighbor is shortest, set if true, and add to queue  
      let cumul = graph[next[0]].neighbors[el] + graph[next[0]].least
      if (cumul < graph[el].least) {
        graph[el].least = cumul;
        queue.push([el, next[0]]);
      }
    }
  }
}

//build graph and walk it
build_graph(1, 3);
walk();
//answer is shortest path to 140,140, reached either horizontally or vertically
console.log("part 1 answer: " + Math.min(graph["140,140_h"].least, graph["140,140_v"].least));
//reset stuff
graph = {};
starting_obj = {};
//for part 2, we are simply going to change the neighbor ranges
build_graph(4, 10);
walk();
console.log("part 2 answer: " + Math.min(graph["140,140_h"].least, graph["140,140_v"].least))
console.log(Date.now() - start);
