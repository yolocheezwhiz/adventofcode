//RUN FROM adventofcode.com
let inputs = (await (await fetch("https://adventofcode.com/2023/day/16/input")).text()).trim().split("\n");

//boundaries
let up = 0;
let left = 0;
let down = inputs.length - 1;
let right = inputs[0].length - 1;

//instructions when light touches a surface
let slash = { u: "r", d: "l", l: "d", r: "u" };
let backslash = { u: "l", d: "r", l: "u", r: "d" };
let dash = { u: ["l", "r"], d: ["l", "r"], l: ["l"], r: ["r"] };
let pipe = { u: ["u"], d: ["d"], l: ["u", "d"], r: ["u", "d"] };

let answer_p1;

//for part 2
let best = 0;

function try_all_moves(dir, pos) {

    //we are going to need to pass these locally for part 2, so we wrap the move function into another function
    //since we don't care how often light passes on a given y,x coordinates, we use a set instead of an array
    //we ALSO use an array because light can enter an infinite loop. We want to return when this happens
    let set = new Set();
    let arr = [];
    function move(dir, pos) {

        //move current y,x coordinates
        if (dir === "u") pos[0]--;
        if (dir === "d") pos[0]++;
        if (dir === "l") pos[1]--;
        if (dir === "r") pos[1]++;

        //return if out of bounds
        if (pos[0] < up || pos[0] > down || pos[1] < left || pos[1] > right) return;

        //add position to set
        set.add(pos.toString());

        //we log y,x coords along with light direction. if we have a duplicate, it's an infinite loop and we need to exit
        if (arr.includes(pos.toString() + "_" + dir)) return;
        arr.push(pos.toString() + "_" + dir);

        //move to the next position(s) and direction(s)
        let char = inputs[pos[0]][pos[1]];
        if (char == ".") move(dir, [...pos]);
        if (char == "\\") move(backslash[dir], [...pos]);
        if (char == "/") move(slash[dir], [...pos]);
        if (char == "-") for (let x of dash[dir]) move(x, [...pos]);
        if (char == "|") for (let x of pipe[dir]) move(x, [...pos]);

        //we're done processing this pos/dir
        return;
    }

    move(dir, pos);

    //we only keep the first ever attempt as the p1 answer
    answer_p1 = answer_p1 || set.size;

    //keep track of best energization to date
    best = Math.max(best, set.size);
    return;
}

//start out of bounds, going right to [0,0]
try_all_moves("r", [0, -1]);

//part 2 is going to be very similar, we'll simply try every starting position/direction, and we'll keep track of the best answer
//we now need local arrs and sets

//yolo
for (let i = 0; i < down; i++) {

    //arguably, we could've been fancy and memoize what positions will be energized when passing on a y,x coordinates in a certain direction. 
    //this would've made the execution much faster,but we're lazy and capable of waiting 30 seconds to get the answer
    //so we just log progress to date to know the script isn't borked
    console.clear();
    console.log("trying left/right directions " + (i + 1) + "/" + (down + 1));
    try_all_moves("r", [i, -1]);
    try_all_moves("l", [i, right + 1]);
}
for (let i = 0; i < right; i++) {
    console.clear();
    console.log("trying up/down directions " + (i + 1) + "/" + (right + 1));
    try_all_moves("d", [-1, i]);
    try_all_moves("u", [down + 1, i]);
}
console.clear();
console.log("Part 1 answer: " + answer_p1);
console.log("Part 2 answer: " + best);
