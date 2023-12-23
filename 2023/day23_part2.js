//increase stack size
//e.g. node --stack-size=1500 day23.js
//your stringified input, e.g.
let inputs = "#.#####################\n#.......#########...###\n#######.#########.#.###\n###.....#.>.>.###.#.###\n###v#####.#v#.###.#.###\n###.>...#.#.#.....#...#\n###v###.#.#.#########.#\n###...#.#.#.......#...#\n#####.#.#.#######.#.###\n#.....#.#.#.......#...#\n#.#####.#.#.#########v#\n#.#...#...#...###...>.#\n#.#.#v#######v###.###v#\n#...#.>.#...>.>.#.###.#\n#####v#.#.###v#.#.###.#\n#.....#...#...#.#.#...#\n#.#########.###.#.#.###\n#...###...#...#...#.###\n###.###.#.###v#####v###\n#...#...#.#.>.>.#.>.###\n#.###.###.#.###.#.#v###\n#.....###...###...#...#\n#####################.#";
inputs = inputs.split("\n");
const start = "1,1";
console.log(inputs.length,inputs[0].length)
const destination = "22,21"; //"140,139" for real input
const wrong_dirs = ["^v", "v^", "<>", "><"];
let answer = 0;
let part_1 = true;
//convert the map to a graph
let graph = {};
(function find_next_intersection(y, x, dir, len, og_pos) {
    //we reached the destination
    if (y + "," + x == destination) {
        //save to graph
        graph[y + "," + x] = graph[y + "," + x] || {};
        //specify previous intersection && steps to make it from there
        graph[y + "," + x][og_pos] = len;
        return;
    }
    let check_neighbors = true;
    let neighbors = [];
    //check potential moves to neighboring pos
    if (inputs[y - 1][x] != "#" && !wrong_dirs.includes(dir + "^")) neighbors.push([(y - 1), x, "^"]);
    if (inputs[y + 1][x] != "#" && !wrong_dirs.includes(dir + "v")) neighbors.push([(y + 1), x, "v"]);
    if (inputs[y][x - 1] != "#" && !wrong_dirs.includes(dir + "<")) neighbors.push([y, (x - 1), "<"]);
    if (inputs[y][x + 1] != "#" && !wrong_dirs.includes(dir + ">")) neighbors.push([y, (x + 1), ">"]);
    //if there is only one valid neighbor, check it
    if (neighbors.length == 1) { find_next_intersection(...neighbors[0], len + 1, og_pos); return; }
    //else we found an intersection
    //we will want to log its distance from the previous intersection, but not try it's neighbors if we already checked them
    if (graph[y + "," + x]) check_neighbors = false;
    graph[y + "," + x] = graph[y + "," + x] || {};
    //set neighbors length in graph
    graph[y + "," + x][og_pos] = len;
    //check neighbors if needed
    if (check_neighbors) for (let neighbor of neighbors) find_next_intersection(...neighbor, 1, y + "," + x);
    return;
}(1, 1, "v", 1, "0,1"));
//we now have a partial graph, we need to write its opposites.
//e.g. if 19,19 led to 39,13 in 170 steps, then we need to write in the graph that 39,13 leads to 19,19 in 170 steps too
for (let key in graph) for (let kv in graph[key]) {
    graph[kv] = graph[kv] || {};
    graph[kv][key] = graph[key][kv];
}
//hike the graph
function hike(pos, steps, visited) {
    //we reached the destination
    if (pos == destination) {
        // set as new best
        if (steps > answer) answer = steps, console.log("new best: " + steps);
        return;
    }
    //set as visited pos
    visited.push(pos);
    //try next intersections
    for (let next in graph[pos]) {
        //unless already visited
        if (visited.includes(next)) continue;
        hike(next, graph[pos][next] + steps, [...visited]);
    }
    return;
}
hike('0,1', 0, []);
console.log("answer part 2: " + answer);
