const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/14";
localStorage[day] ||= (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// Day-specific setup
const xSize = 101;
const ySize = 103;
const xCutoff = (xSize - 1) / 2;
const yCutoff = (ySize - 1) / 2;
const quadrants = { "q1": 0, "q2": 0, "q3": 0, "q4": 0 };
let input = localStorage[day].split('\n').map(line => line.match(/-?\d+/g).map(Number));
let seconds = 100;
let answerp1 = 0;

input.forEach(([px, py, vx, vy]) => {
    // Convert the direction to a positive integer
    if (vx < 0) vx += xSize;
    if (vy < 0) vy += ySize;
    // Evaluate the position of the robot after N seconds
    let xFinal = (vx * seconds + px) % xSize;
    let yFinal = (vy * seconds + py) % ySize;
    // Find the quadrant the robot is in
    // Ignore robots in the cutoffs
    let q;
    if      (xFinal < xCutoff && yFinal < yCutoff) q = 'q1';
    else if (xFinal > xCutoff && yFinal < yCutoff) q = 'q2';
    else if (xFinal < xCutoff && yFinal > yCutoff) q = 'q3';
    else if (xFinal > xCutoff && yFinal > yCutoff) q = 'q4';
    if (q) quadrants[q]++;
});
answerp1 = Object.values(quadrants).reduce((a, b) => a * b, 1);

// Part 2
seconds = 0;
while (true) {
    let xP2Obj = {};
    let yP2Obj = {};
    input.forEach(([px, py, vx, vy]) => {
        if (vx < 0) vx += xSize;
        if (vy < 0) vy += ySize;
        let xFinal = (vx * seconds + px) % xSize;
        let yFinal = (vy * seconds + py) % ySize;
        // Log how many robots are on each row, and on each column
        xP2Obj[xFinal] ||= 0;
        xP2Obj[xFinal]++;
        yP2Obj[yFinal] ||= 0;
        yP2Obj[yFinal]++;
    });
    // Assume that when a lot of robots are on the same row, and a lot on the same column, we found the tree
    // It's lazy, I know. Perfect is the enemy of good enough
    const xAlignedRobots = Math.max(...Object.values(xP2Obj));
    const yAlignedRobots = Math.max(...Object.values(yP2Obj));
    // Try with higher numbers if answer is too low
    if (xAlignedRobots > 20 && yAlignedRobots > 20) break;
    seconds++;
}

// Print the tree for good measure
const line = Array(xSize).fill('.');
const map = Array.from({ length: ySize }, () => [...line]);
let toPrint = '';

input.forEach(([px, py, vx, vy]) => {
    if (vx < 0) vx += xSize;
    if (vy < 0) vy += ySize;
    const xFinal = (vx * seconds + px) % xSize;
    const yFinal = (vy * seconds + py) % ySize;
    map[yFinal][xFinal] = "*";
});

map.forEach(line => toPrint += `${line.join('')}\n`);
console.log(toPrint);
console.log(`answer part 1: ${answerp1}`);
console.log(`answer part 2: ${seconds}`);
console.log(`solved in ${Date.now() - startTime} ms`);
