//RUN FROM adventofcode.com
let headers = new Headers({
    "User-Agent": "github.com/yolocheezwhiz/adventofcode/"
});
let day = "2022/day/24";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", {
    headers: headers
})).text()).trim();
let inputs = localStorage[day].split('\n');

//keep track of each blizzard direction separately
let up = [];
let down = [];
let left = [];
let right = [];
//build an empty clone of each directional array
let clone_up = [];
let clone_down = [];
let clone_left = [];
let clone_right = [];
//do it again. this will make sense (sort of) later
let cy_clone_up = [];
let cy_clone_down = [];
let cy_clone_left = [];
let cy_clone_right = [];
//create a nested array for each direction
//skip first/last indexes 
for (let y = 1; y < inputs.length - 1; y++) {
    up.push([]);
    down.push([]);
    left.push([]);
    right.push([]);
    clone_up.push([]);
    clone_down.push([]);
    clone_left.push([]);
    clone_right.push([]);
    cy_clone_up.push([]);
    cy_clone_down.push([]);
    cy_clone_left.push([]);
    cy_clone_right.push([]);
    //fill array with puzzle input, converted in a boolean expression representing whether a blizzard exists in that location
    //fill clones with undefined
    //skip first/last indexes 
    for (let x = 1; x < inputs[y].length - 1; x++) {
        up[y - 1].push(inputs[y][x] == "^");
        down[y - 1].push(inputs[y][x] == "v");
        left[y - 1].push(inputs[y][x] == "<");
        right[y - 1].push(inputs[y][x] == ">");
        clone_up[y - 1].push(null);
        clone_down[y - 1].push(null);
        clone_left[y - 1].push(null);
        clone_right[y - 1].push(null);
        cy_clone_up[y - 1].push(null);
        cy_clone_down[y - 1].push(null);
        cy_clone_left[y - 1].push(null);
        cy_clone_right[y - 1].push(null);
    }
}
//Crunching this in advance as opposed to crunching this after every movement attempt is a huge time saver
//this will represent safe positions per turn
let big_map = [];
//LCM of 25x120 (map size) is 600, meaning that blizzard patterns will repeat after 600 turns
let iter = 0;
while (iter < 600) {
    //always set entrance and exit as safe positions
    big_map[iter] = {
        "-1,0": true,
        "25,119": true
    };
    for (let y = 0; y < up.length; y++)  for (let x = 0; x < up[y].length; x++) {
        //"move" each blizzard by 1, or to the other end of the map
        if (up[y][x]) clone_up[y + (y === 0 ? up.length - 1 : -1)][x] = true;
        if (down[y][x]) clone_down[(y === down.length - 1 ? 0 : y + 1)][x] = true;
        if (left[y][x]) clone_left[y][(x === 0 ? left[y].length - 1 : x - 1)] = true;
        if (right[y][x]) clone_right[y][(x === right[y].length - 1 ? 0 : x + 1)] = true;
    }
    //let's set map to new values using clones
    up = JSON.parse(JSON.stringify(clone_up));
    down = JSON.parse(JSON.stringify(clone_down));
    left = JSON.parse(JSON.stringify(clone_left));
    right = JSON.parse(JSON.stringify(clone_right));
    //let's reset clones using cy_clones
    clone_up = JSON.parse(JSON.stringify(cy_clone_up));
    clone_down = JSON.parse(JSON.stringify(cy_clone_down));
    clone_left = JSON.parse(JSON.stringify(cy_clone_left));
    clone_right = JSON.parse(JSON.stringify(cy_clone_right));
    //check for all safe positions for that turn, set them as big_map ingredients
    for (let y = 0; y < up.length; y++) for (let x = 0; x < up[y].length; x++)  if (!up[y][x] && !down[y][x] && !left[y][x] && !right[y][x]) big_map[iter][y + "," + x] = true;
    iter++;
}
//for each value of big_map[N], we're going to check potential moves (up, down, left, right, stay) in the next big_map[N+1]
let arr = Array.from({ length: 600 }, (_, index) => index);
for (let i of arr) {
    i = +i;
    for (let pos of Object.keys(big_map[i])) {
        let j = i == 599 ? 0 : i + 1;
        let p_o_s = pos.split(",");
        let u = (Number(p_o_s[0]) - 1) + "," + p_o_s[1];
        let d = (Number(p_o_s[0]) + 1) + "," + p_o_s[1];
        let l = p_o_s[0] + "," + (Number(p_o_s[1]) - 1);
        let r = p_o_s[0] + "," + (Number(p_o_s[1]) + 1);
        let moves = [];
        if (big_map[j][r]) moves.push(r);
        if (big_map[j][d]) moves.push(d);
        if (big_map[j][pos]) moves.push(pos);
        if (big_map[j][u]) moves.push(u);
        if (big_map[j][l]) moves.push(l);
        //we set the key's value with potential moves
        if (moves.length > 0) big_map[i][pos] = moves;
    }
}
//because we set safe pos per turn AFTER moving the blizzards, the last big_map array is actually index 0, and index 0 is actually after turn 1. 
//because we don't want to rework the code, we just move the last index at the beginning
big_map.unshift(big_map.pop());
//we now have a an array big_map of 600 nested objects representing an eligible position at that turn, and their potential next moves.
//we try "every" branch, with aggressive pruning
let forth = true;
let already_tried = new Set();
let best = Infinity;
let best_arr = [];
//showdown
function move(pos, turn) {
    //we keep track of positions already tried for a given turn number. This is by far the best pruning method
    let attempt = pos + "_" + (turn % 600);
    if (already_tried.has(attempt)) return;
    else already_tried.add(attempt);
    //return when turn too long
    if (turn >= best) return;
    turn++;
    //best result to date
    if ((pos == '25,119' && forth) || (pos == "-1,0" && !forth)) {
        best = turn;
        return;
    }
    //forward and onward!
    //we ensure there are moves to try for this pos
    if (big_map[turn % 600][pos]) {
        //we favor going right/down if moving forward
        if (forth) for (let i = 0; i < big_map[turn % 600][pos].length; i++) move(big_map[turn % 600][pos][i], turn);
        //we favor going left/up if moving back
        else for (let i = big_map[turn % 600][pos].length - 1; i >= 0; i--) move(big_map[turn % 600][pos][i], turn);
    }
}
//1st run
for (let i = 0; i < big_map[0]['-1,0'].length; i++) move(big_map[0]['-1,0'][i], 1);
//Reset stuff between parts
best_arr.push(best);
forth = !forth;
already_tried = new Set();
best = Infinity;
//2nd run
for (let i = big_map[best_arr[0]]['25,119'].length - 1; i >= 0; i--) move(big_map[best_arr[0]]['25,119'][i], best_arr[0] + 1);
//Reset stuff between parts
best_arr.push(best);
forth = !forth;
already_tried = new Set();
best = Infinity;
//3rd run
for (let i = 0; i < big_map[best_arr[1]]['-1,0'].length; i++) move(big_map[best_arr[1]]['-1,0'][i], best_arr[1] + 1);
best_arr.push(best);
console.log("part 1 answer: " + best_arr[0]);
console.log("part 2 answer: " + best_arr[2]);
