//RUN FROM adventofcode.co
const headers = new Headers({
  "User-Agent": "github.com/yolocheezwhiz/adventofcode/"
});
//cache puzzle input
const day = "2023/day/25";
localStorage[day] = localStorage[day] || (await (await fetch("https://adventofcode.com/" + day + "/input", {
  headers: headers
})).text()).trim();
let inputs = localStorage[day].split('\n');
let tuples = [];
let neighbors = {};
let max_length = {};
let min = Infinity;
let max = 0;
let iter = 0;
let bool = true;

//build tuples per line
//e.g. for line a: b c d. Tuples would be ab , ac , ad && their opposite ba , ca , da
for (let input of inputs) {
  input = input.replace(":", "").split(" ");
  for (let i = 1; i < input.length; i++) {
    tuples.push([input[0], input[i]], [input[i], input[0]]);
  }
}

//build sets of immediate neighbors for each node
for (let tuple of tuples) {
  neighbors[tuple[0]] = neighbors[tuple[0]] || new Set();
  neighbors[tuple[0]].add(tuple[1]);
}

//find length to farthest node (using BFS), per node (for loop)
for (let key in neighbors) {
  let i = 1;
  let queue = [...neighbors[key]];
  let visited = new Set([key]);
  while (queue.length > 0) {
    let next_queue = new Set();
    for (let el of queue) {
      visited.add(el);
      for (let x of neighbors[el]) {
        if (!visited.has(x)) {
          next_queue.add(x);
        }
      }
    }
    i++;
    queue = [...next_queue];
  }
  max_length[key] = i;
}

//find min and max lengths from previous step
for (let key in max_length) {
  min = Math.min(min, max_length[key]);
  max = Math.max(max, max_length[key]);
}

//yolo
while (bool) {
  let middle = [];
  let mid_tuples = [];

  //here, we assume graph is roughly split in two equal parts (if not, this script will go Brrrrrrrrrrrrr)
  //nodes with shortest path to farthest nodes are likely the ones to remove edges from (as they are in the middle)
  //find all shortest paths nodes
  for (let key in max_length) {
    if (max_length[key] <= min + iter) {
      middle.push(key);
    }
  }

  //get tuples using these nodes, if any
  for (let i = 0; i < middle.length; i++) {
    for (let j = i + 1; j < middle.length; j++) {
      if (neighbors[middle[i]].has(middle[j])) {
        mid_tuples.push([middle[i], middle[j]]);
      }
    }
  }

  //we try removing all combinations of 3 edges
  for (let i = 0; i < mid_tuples.length; i++) {
    for (let j = i + 1; j < mid_tuples.length; j++) {
      for (let k = j + 1; k < mid_tuples.length; k++) {
        let ii = mid_tuples[i];
        let jj = mid_tuples[j];
        let kk = mid_tuples[k];
        neighbors[ii[0]].delete(ii[1]);
        neighbors[ii[1]].delete(ii[0]);
        neighbors[jj[0]].delete(jj[1]);
        neighbors[jj[1]].delete(jj[0]);
        neighbors[kk[0]].delete(kk[1]);
        neighbors[kk[1]].delete(kk[0]);

        //use random key (could just have used tuples[0][0] but I'm funny)
        let key = tuples[Math.floor(Math.random() * tuples.length)][0];

        //re-run previous step (too lazy to functionalize this) with a single random key
        let queue = [...neighbors[key]];
        let visited = new Set([key]);
        while (queue.length > 0) {
          let next_queue = new Set();
          for (let el of queue) {
            visited.add(el);
            for (let x of neighbors[el]) {
              if (!visited.has(x)) {
                next_queue.add(x);
              }
            }
          }
          queue = [...next_queue];
        }
        //if we can't walk the whole graph anymore, we successfully removed the right 3 edges
        //we use < neighbors - 1 to account for the possibility of having isolated a single node
        if (visited.size < Object.keys(neighbors).length-1) {
          console.log("answer: " + (visited.size * (Object.keys(neighbors).length - visited.size)));
          //exit the while loop
          bool = false;
        }
        //else, re-add edges to the graph
        neighbors[ii[0]].add(ii[1]);
        neighbors[ii[1]].add(ii[0]);
        neighbors[jj[0]].add(jj[1]);
        neighbors[jj[1]].add(jj[0]);
        neighbors[kk[0]].add(kk[1]);
        neighbors[kk[1]].add(kk[0]);
      }
    }
  }
  //we tried all edges removal possibilities and failed miserably, let's try again, but add some more middle nodes
  iter++;
}
