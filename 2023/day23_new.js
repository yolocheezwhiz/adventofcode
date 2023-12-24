//RUN FROM adventofcode.com
const headers = new Headers({
  "User-Agent": "github.com/yolocheezwhiz/adventofcode/"
});
//cache puzzle input
const day = "2023/day/23";
localStorage[day] = localStorage[day] || (await (await fetch("https://adventofcode.com/" + day + "/input", {
  headers: headers
})).text()).trim();
const inputs = localStorage[day].split('\n');
const begin = Date.now();
const start = "1,0";
const destination = (inputs.length - 1) + "," + (inputs.length - 2);
const wrong_dirs = ["^v", "v^", "<>", "><"];
let answer = 0;
let part_1 = true;
//convert the map to a graph
let graph = { "0,1": { temp: ["v"] } };
for (let y = 1; y < inputs.length - 1; y++)
    for (let x = 1; x < inputs[y].length - 1; x++) {
        if (inputs[y][x] == "#") continue;
        let neighbors = [];
        //check potential moves to neighboring pos
        if (inputs[y + 1][x] != "#") neighbors.push("v");
        if (inputs[y][x + 1] != "#") neighbors.push(">");
        if (inputs[y - 1][x] != "#") neighbors.push("^");
        if (inputs[y][x - 1] != "#") neighbors.push("<");
        if (neighbors.length > 2) graph[y + "," + x] = { temp: neighbors };
    }
const intersections = new Set(Object.keys(graph));

function find_next_intersection(y, x, dir, len, og_pos, og_dir, p1_eligible) {
    //if we climb a slope, set path as ineligible for part1
    if (wrong_dirs.includes(inputs[y][x] + dir)) p1_eligible = false;
    let neighbor;
    //find the neighbor for that direction
    if (inputs[y + 1][x] != "#" && !wrong_dirs.includes(dir + "v")) neighbor = [(y + 1), x, "v"];
    else if (inputs[y - 1][x] != "#" && !wrong_dirs.includes(dir + "^")) neighbor = [(y - 1), x, "^"];
    else if (inputs[y][x - 1] != "#" && !wrong_dirs.includes(dir + "<")) neighbor = [y, (x - 1), "<"];
    else if (inputs[y][x + 1] != "#" && !wrong_dirs.includes(dir + ">")) neighbor = [y, (x + 1), ">"];
    //check if it's an intersection or the final destination
    const str_pos = neighbor[0] + "," + neighbor[1];
    if (intersections.has(str_pos) || str_pos == destination) {
        //build graph, set length to neighbor
        graph[og_pos][str_pos] = { p1: p1_eligible, len: len + 1 };
        //delete temp when done emptying
        if (graph[og_pos].temp.length == 0) delete graph[og_pos].temp;
        return;
    }
    //keep walking
    else find_next_intersection(...neighbor, len + 1, og_pos, og_dir, p1_eligible);
    return;
}
//check all directions of all intersections + starting square
for (let pos in graph) while (graph[pos].temp) {
    const dir = graph[pos].temp.pop();
    let y = +pos.split(',')[0];
    let x = +pos.split(',')[1];
    //pre-move
    dir == "^" ? y-- : dir == "v" ? y++ : dir == "<" ? x-- : x++;
    find_next_intersection(y, x, dir, 1, pos, dir, true);
}

//we now have a graph of connected intersections, lengths between them, and whether or not the paths are eligible for part 1
//hike the graph
function hike(pos, steps, visited) {
    //we reached the destination
    if (pos == destination) {
        // set as new best
        if (steps > answer) answer = steps;
        return;
    }
    //else set as visited pos in this branch
    visited.push(pos);
    //try next intersections
    for (let next in graph[pos]) {
        //unless already visited
        if (visited.includes(next)) continue;
        //or ineligible for part 1
        if (part_1 && !graph[pos][next].p1) continue;
        hike(next, graph[pos][next].len + steps, [...visited]);
    }
    return;
}
hike('0,1', 0, []);
console.log("answer part 1: " + answer);
console.log("computed in " + ((Date.now()-begin)/1000) + " seconds");
console.log("part 2 is coming, please standby...");
console.log("for some reason, part 2 is now much slower. Can't figure out why...");
part_1 = false;
answer = 0;
hike('0,1', 0, [], false);
console.log("answer part 2: " + answer);
console.log("total run time: " + ((Date.now()-begin)/1000) + " seconds");
