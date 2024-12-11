// General configuration
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/10";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();

// Day-specific setup
const input = localStorage[day].split('\n').map(line => line.split('').map(Number));
let answerp1 = 0;
let answerp2 = 0;
const map = {};
const startingPoints = [];
const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

// Find paths to height 9
function countPaths(pos, height, trailHeads, visited, p1) {
    // Part 1 - Return if position already visited from this starting point
    if (p1){
        if (visited.has(pos)) return;
        visited.add(pos);
    }
    // We reached height 9
    if (height === 9) {
        // Add to the set of unique reachable heights
        if (p1) trailHeads.add(pos.value); 
        // For part 2, just increment the count of paths
        else answerp2++; 
        return;
    }
    // Hike up!
    for (const neighbor of pos.neighbors) {
        countPaths(neighbor, height + 1, trailHeads, visited, p1);
    }
}

// Create a linked list where zeroes lead to ones that lead to twos, etc.
input.forEach((row, y) => {
    row.forEach((cell, x) => {
        const pos = `${y}_${x}`;
        // Build a list of starting points.
        if (cell === 0) startingPoints.push(pos);
        // Initialize the map object for each position
        map[pos] = map[pos] || { value: pos, neighbors: [] };
        // Check adjacent cells to form neighbors of height + 1
        dirs.forEach(([dy, dx]) => {
            const newY = y + dy;
            const newX = x + dx;
            if (input[newY]?.[newX] !== undefined && input[newY][newX] - input[y][x] === 1) {
                const adjacentPos = `${newY}_${newX}`;
                map[adjacentPos] = map[adjacentPos] || { value: adjacentPos, neighbors: [] };
                map[pos].neighbors.push(map[adjacentPos]);
            }
        });
    });
});

// For each starting point, hike up
for (const start of startingPoints) {
    const trailHeads = new Set();
    const visited = new Set();
    // For part 1, we count unique trailheads
    countPaths(map[start], 0, trailHeads, visited, true); 
    answerp1 += trailHeads.size; 
    // For part 2, we count unique paths
    countPaths(map[start], 0, null, null, false);
}

console.log(`answer part 1: ${answerp1}`);
console.log(`answer part 2: ${answerp2}`);
console.log(`solved in ${Date.now() - startTime} ms`);
