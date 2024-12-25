// General configuration
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/6";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();

// Day-specific setup
const map = localStorage[day].split('\n').map(line => line.split(''));
const mapCopy = JSON.stringify(map.map(line => [...line]));
const mapLen = map.length;
const moves = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const answerp1 = new Set();
const pos = {};
let answerp2 = 0;
let dir;

// Find the starting position
outer: for (let y = 0; y < map.length; y++) {
    let stop;
    for (let x = 0; x < map[y].length; x++) {
        if (!map[y][x].match(/#|\./)) {
            pos.y = y;
            pos.x = x;
            // Check starting direction
            dir = '^>v<'.indexOf(map[y][x]);
            stop = true;
            break outer;
        }
    }
}

// Walk the map
function walk(p2Set, pos, dir, map) {
    const nextPos = {};
    let posKey, posDirKey;
    // Loop until the guard exists the map, or gets stuck in an endless loop
    while (true) {
        // Keep track of both the position, and from which direction its been visited
        posKey = pos.y + pos.x * mapLen
        posDirKey = posKey + dir * (mapLen ** 2);
        // Part 1 
        // We use the existence of p2Set as an indicator of whether we're in the recursive function or the main one
        // If in main loop add the position to part 1 answer
        if (!p2Set) answerp1.add(posKey);
        // Part 2
        // If the position has already been visited from this direction, we increment part 2 answer and exit the nested loop
        else if (!dir && p2Set.has(posDirKey)) {
            answerp2++;
            break;

        }

        // Regardless of Part
        // Check the next potential position
        nextPos.y = pos.y + moves[dir][0];
        nextPos.x = pos.x + moves[dir][1];
        // If out of bounds, exit loop
        if (nextPos.y < 0 || nextPos.x < 0 || nextPos.y >= mapLen || nextPos.x >= mapLen) break;
        // Verify it's not an obstacle
        else if (map[nextPos.y][nextPos.x] !== '#') {
            // If Part 1 and the next position has not already been visited
            // (incidentally prevents trying to put an obstacle at the guard's original position)
            if (!p2Set && !answerp1.has(nextPos.y + nextPos.x * mapLen)) {
                // Clone map, change the next pos for an obstacle, recurse for part 2
                const copy = JSON.parse(mapCopy);
                copy[nextPos.y][nextPos.x] = '#';
                walk(new Set(), { ...pos }, dir, copy);
            }
            // Set pos to next pos.
            pos.y = nextPos.y;
            pos.x = nextPos.x;
            // It's an obstacle, turn right (but stay on the current square)
        }

        else {
            // We add to the visited positions in this nested loop
            // Only if an obstacle, bumped into going up (reduces computing)
            if (p2Set && !dir) p2Set.add(posDirKey);
            dir = (dir + 1) % 4;
        }
        // Keep looping
    }
    // not really needed since we break out of loops to exit the function but for good measure
    return;
}
walk(p2Set = null, pos, dir, map);
console.log(`answer part 1: ${answerp1.size}`);
console.log(`answer part 2: ${answerp2}`);
// The last big optimization would be to precompute obstacle positions in a linked list. 
// This would make the code much simpler
// Run part 1
// From each position visited in part 1, create a fake obstacle, find it's neighbors in a copy of the linked list
// zoom zoom zoom
console.log(`solved in ${Date.now() - startTime} ms`);
