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
const start = "1,1";
const destination = "140,139";
const wrong_dirs = ["^v", "v^", "<>", "><"];
let pos_longest = {
  "0,1^": new Set(["0,1"])
};
let answer = 0;
let is_subset = (set1, set2) => [...set1].every(val => set2.has(val));

//convert the map to a graph
let graph = {
    "0,1":["1,1"],
    "140,139":["139,139"]
};
for (let y = 1; y < inputs.length-1; y++) 
    for (let x = 1; x<inputs[y].length-1;x++) {
        if (inputs[y][x] == "#") continue;
        let neighbors = [];
        if (inputs[y-1][x] != "#") neighbors.push([(y-1)+","+x,"^"]);
        if (inputs[y+1][x] != "#") neighbors.push([(y+1)+","+x,"v"]);
        if (inputs[y][x-1] != "#") neighbors.push([y+","+(x-1),"<"]);
        if (inputs[y][x+1] != "#") neighbors.push([y+","+(x+1),">"]);
        graph[y+","+x] = neighbors;
}

function hike(pos, visited, dir) {
  //arrived
  if (pos == destination) {
    if (visited.size > answer) {
      console.log("best so far:" + visited.size);
      answer = visited.size;
    }
    return;
  }
  const y = +pos.split(",")[0];
  const x = +pos.split(",")[1];
  //took a longer hike to make it to that pos
  if (graph[pos][0].length>2&&pos_longest[pos + dir] && is_subset(visited, pos_longest[pos + dir])) return;
  //against the slope
  if (!part2 && wrong_dirs.includes(dir + inputs[y][x])) return;
  //pos is valid, add to visited set & to pos_longest
  visited.add(pos);
  pos_longest[pos + dir] = new Set(visited);
  //hike!
  for (let next of graph[pos]) if (!visited.has(next[0])) hike(next[0], new Set(visited), next[1]);
  return;
}

hike(start, new Set(["0,1"]), "v");
console.log("answer part 1: " + answer);
