const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/20";
localStorage[day] ||= (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// Day-specific setup
const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const dirs2 = [[-2, 0], [0, 2], [2, 0], [0, -2]]; // Jump through a single wall
const racetrack = new Map();
const map = localStorage[day].split('\n').map(line => line.split(''));
let dir = [0, 0]; // Initial state is not moving
let answerp1 = 0;
let answerp2 = 0;
let pico = 0;
let s, e, x, y;

// Find S and E, and initiate each map key
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
        if (map[y][x] === 'S') {
            s = [y, x];
            // At first I was lazily not storing x and y individually
            // Thinking I could just parse the key itself when reading an entry
            // While true, it slowed down this script about 50x
            // So now we save x and y without being lazy
            racetrack.set(`${y},${x}`, { picos: pico, x: x, y: y });
            pico++;
        }
        if (map[y][x] === 'E') e = [y, x];
    }
}
// Set back y, x at the starting pos
[y, x] = s;

// Build the racetrack
while (true) {
    // Try every direction to find the next track
    dirs.forEach(([dy, dx]) => {
        const newY = y + dy;
        const newX = x + dx;
        // If wall, skip.
        if (map[newY][newX] === '#') return;
        // If 180-degree turn, skip
        if (dir[0] * dy + dir[1] * dx === -1) return;
        // We found the next track, set it as new pos
        [y, x, dir] = [newY, newX, [dy, dx]];
        // Save it in the racetrack, along with the picos to get there
        racetrack.set(`${y},${x}`, { picos: pico, x: x, y: y });
        pico++;
    });
    // Exit found
    if (e[0] === y && e[1] === x) break;
}

// Part 1 - Jump over a single wall
// This works without Array.from in the dev console, but we add it anyway for Node.js shenanigans
const trackArr = Array.from(racetrack.entries());
// For each track
trackArr.forEach(([_, obj]) => {
    // Extract values
    [y, x, cheatFrom] = [obj.y, obj.x, obj.picos];
    // Check if a track exists 2 steps away
    dirs2.forEach(([dy, dx]) => {
        const newY = y + dy;
        const newX = x + dx;
        const cheatTo = racetrack.get(`${newY},${newX}`);
        // If so and the diff is >= 100 + the cost of the cheat, increment answer
        if (cheatTo && cheatTo.picos - cheatFrom >= 100 + 2) answerp1++;
    });
});

// Part 2 - Manhattan distance
// No need to scan the last 100 values + minimal cost of cheat of 2, since it won't be a cheat worth 100 points +
for (let i = 0; i < trackArr.length - (100 + 2); i++) {
    // Extract values
    const from = trackArr[i][1];
    const [y, x, cheatFrom] = [from.y, from.x, from.picos];
    // Evaluate all tracks AFTER the current one
    for (let j = i + 1; j < trackArr.length; j++) {
        // Extract values
        const to = trackArr[j][1];
        const [y2, x2, cheatTo] = [to.y, to.x, to.picos];
        // Calc Manhattan distance between the tracks
        const yDiff = Math.abs(y - y2);
        const xDiff = Math.abs(x - x2);
        const Manhattan = yDiff + xDiff;
        // If Manhattan is 20 or less, and diff is >= 100 + cost of cheat. increment answer
        if (Manhattan <= 20 && cheatTo - cheatFrom - Manhattan >= 100) answerp2++;
    }
}

console.log(`Answer Part 1: ${answerp1}`);
console.log(`Answer Part 2: ${answerp2}`);
console.log(`Solved in ${Date.now() - startTime} ms.`);
