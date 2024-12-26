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
let highestX = 0;
let highestY = 0;
let iX;
let iY;
let answerp2;

// Part 2
// Hypothesis is the Christmas tree will generate an alignment of robots on both the X and Y axes
// We don't need to loop until both axes are aligned simultaneously
// Each robot's x position will repeat every 101 seconds, and every 103 seconds for the y position
// So we start by calculating when the X axis alignment happens, and when the Y one happens, over 101/103 seconds
// Try every second up to 103
for (let i = 0; i < Math.max(xSize, ySize); i++) {
    const xP2Obj = {};
    const yP2Obj = {};
    // For each robot
    input.forEach(([px, py, vx, vy]) => {
        // Convert negative movements to positive ones
        if (vx < 0) vx += xSize;
        if (vy < 0) vy += ySize;
        // Check where the robot will be after `i` seconds
        let xFinal = (vx * i + px) % xSize;
        let yFinal = (vy * i + py) % ySize;
        // Log how many robots are on each row, and on each column
        xP2Obj[xFinal] ||= 0;
        xP2Obj[xFinal]++;
        yP2Obj[yFinal] ||= 0;
        yP2Obj[yFinal]++;

        // Part 1    
        // Find the quadrant the robot is in
        // Ignore robots in the cutoffs
        if (i === 100) {
            let q;
            if (xFinal < xCutoff && yFinal < yCutoff) q = 'q1';
            else if (xFinal > xCutoff && yFinal < yCutoff) q = 'q2';
            else if (xFinal < xCutoff && yFinal > yCutoff) q = 'q3';
            else if (xFinal > xCutoff && yFinal > yCutoff) q = 'q4';
            if (q) quadrants[q]++;
        }
    });
    // Get the highest count of robots per row/column
    const xAlignedRobots = Math.max(...Object.values(xP2Obj));
    const yAlignedRobots = Math.max(...Object.values(yP2Obj));
    // Check at which second we have the highest X alignment
    if (xAlignedRobots > highestX) {
        highestX = xAlignedRobots;
        iX = i;
    }
    // Check at which second we have the highest Y alignment
    if (yAlignedRobots > highestY) {
        highestY = yAlignedRobots;
        iY = i;
    }
    // Compute part 1 answer
    if (i === 100) answerp1 = Object.values(quadrants).reduce((a, b) => a * b, 1);
}
// Every `iX` out of `xSize` seconds, robots will be aligned horizontally
// Every `iY` out of `ySize` seconds, robots will be aligned vertically
// Using the Chinese Remainder Theorem, we can extract the smallest amount of seconds
// where robots will be aligned on both axes simultaneously
answerp2 = xSize * ySize + (ySize * iX - xSize * iY) / (ySize - xSize);

console.log(`answer part 1: ${answerp1}`);
console.log(`answer part 2: ${answerp2}`);
console.log(`solved in ${Date.now() - startTime} ms`);
