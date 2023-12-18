//RUN FROM adventofcode.com
let inputs = (await (await fetch("https://adventofcode.com/2023/day/17/input")).text()).trim().split("\n");
let graph = {};
let starting_obj = {};
let starting_neighbors;
let best = Infinity;
let part = 1;

//create a graph representing all y,x pos that can be reached vertically (_v) or horizontally (_h) in N_min, N_max turns.
//for example, pos 0,0 doesn't have a single neighbor to its right, it has three: 0,1 0,2 and 0,3. 
//if we decide to go to 0,1 we HAVE to move vertically next.

//set as function to facilitate part 2
function build_graph(range_min, range_max) {
  for (let col = 0; col < inputs.length; col++) {
    for (let row = 0; row < inputs[0].length; row++) {
      //set coordinates as being reachable both vertically and horizontally, as 2 separate coordinates
      graph[col + "," + row + "_v"] = {
        least: Infinity,
        neighbors: {}
      };
      graph[col + "," + row + "_h"] = {
        least: Infinity,
        neighbors: {}
      };
      //check if down neighbors exist 
      for (let i = range_min; i <= range_max; i++) {
        //if they do
        if (inputs[col + i]) {
          //create the key
          graph[col + "," + row + "_v"].neighbors[(col + i) + "," + row + "_h"] = 0;
          //sum the length to get to it
          for (let j = 1; j <= i; j++) {
            graph[col + "," + row + "_v"].neighbors[(col + i) + "," + row + "_h"] += +inputs[col + j][row];
          }
        }
        //repeat the process to go up
        if (inputs[col - i]) {
          graph[col + "," + row + "_v"].neighbors[(col - i) + "," + row + "_h"] = 0;
          for (let j = 1; j <= i; j++) {
            graph[col + "," + row + "_v"].neighbors[(col - i) + "," + row + "_h"] += +inputs[col - j][row];
          }
        }
        //repeat the process to go right
        if (inputs[col][row + i]) {
          graph[col + "," + row + "_h"].neighbors[col + "," + (row + i) + "_v"] = 0;
          for (let j = 1; j <= i; j++) {
            graph[col + "," + row + "_h"].neighbors[col + "," + (row + i) + "_v"] += +inputs[col][row + j];
          }
        }
        //repeat the process to go left
        if (inputs[col][row - i]) {
          graph[col + "," + row + "_h"].neighbors[col + "," + (row - i) + "_v"] = 0;
          for (let j = 1; j <= i; j++) {
            graph[col + "," + row + "_h"].neighbors[col + "," + (row - i) + "_v"] += +inputs[col][row - j];
          }
        }
      }
    }
  }

  //we shallow-copy-merge 0,0_h.neighbors and 0,0_v.neighbors together, as we want to try everything in a single backtracking.
  Object.assign(starting_obj, graph["0,0_h"].neighbors, graph["0,0_v"].neighbors);
  //Begin eval, using every vertical and horizontal neighbors of 0,0
  starting_neighbors = Object.keys(starting_obj);
  for (let i = 0; i < starting_neighbors.length; i++) {
    walk(starting_neighbors[i], starting_obj[starting_neighbors[i]], "0,0");
  }
}

//pass the whole neighbor object, and the path length to date
function walk(neighbor, cumul, from) {
  //if we already made it to this node in a shorter path, no need to proceed
  //we also stop if we already found a solution (vertically or horizontally) that is shorter than the current attempt
  if (cumul >= Math.min(graph[neighbor].least, best)) {
    return;
  }
  //if we made it to the exit (and past the previous if statement), this is potentially the best answer to date.
  if (neighbor.split("_")[0] == "140,140") {
    //check that cumul is shorter than both 140,140_h and 140,140_v
    if (cumul < best) {
      console.log("Part " + part + " best to date: " + cumul);
      // we set it as best for both directions
      best = cumul;
    }
    //let's keep trying other solutions
    return;
  } else {
    //save as shortest path to node so far
    graph[neighbor].least = cumul;
    //we reached a node in the shortest path to date. we will try all possible directions for it.  
    let n = Object.keys(graph[neighbor].neighbors);
    for (let i = 0; i < n.length; i++) {
      walk(n[i], cumul + graph[neighbor].neighbors[n[i]], neighbor);
    }
    return;
  }
}

//build graph
build_graph(1, 3);

//because we print stuff as we iterate to show progress, we save p1 answer for later
let answer_p1 = "part " + part + " answer: " + best;
//for part 2, we are simply going to change the neighbor ranges
part++;
graph = {};
starting_obj = {};
best = Infinity;
build_graph(4, 10);
console.log(answer_p1);
console.log("part " + part + " answer: " + best);
