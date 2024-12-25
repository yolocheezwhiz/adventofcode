// General configuration
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/6";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// Day-specific setup
const map = localStorage[day].split('\n').map(line => line.split(''));
// x and y are same length
const mapLen = map.length;
const moves = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const answerp1 = new Set();
const obstacleSet = new Set();
const pos = {};
let answerp2 = 0;
let dir;

// Find the starting position and obstacles
for (let y = 0; y < mapLen; y++) {
    for (let x = 0; x < mapLen; x++) {
        // Save pos (in general through the script) as integers for faster processing
        if (map[y][x] === '#') obstacleSet.add(y + x * mapLen); 
        else if (!map[y][x].match(/\./)) {
            pos.y = y;
            pos.x = x;
            dir = '^>v<'.indexOf(map[y][x]);
        }
    }
}

// Walk the map
function walk(p2Set, pos, dir, p2Obstacle) {
    const nextPos = {};
    let posKey, posDirKey, nextPosKey;
    // Loop until the guard exits the map or gets stuck in an endless loop
    while (true) {
        // Keep track of both the position, and from which direction it's been visited
        posKey = pos.y + pos.x * mapLen;
        posDirKey = posKey + dir * mapLen ** 2;
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
        // Check the next potential position
        nextPos.y = pos.y + moves[dir][0];
        nextPos.x = pos.x + moves[dir][1];
        nextPosKey = nextPos.y + nextPos.x * mapLen;
        // If out of bounds, exit loop
        if (nextPos.y < 0 || nextPos.x < 0 || nextPos.y >= mapLen || nextPos.x >= mapLen) break;
        // Verify it's not an obstacle
        if (!obstacleSet.has(nextPosKey) && nextPosKey !== p2Obstacle) {
            // If Part 1 and the next position has not already been visited
            if (!p2Set && !answerp1.has(nextPosKey)) {
                // Recurse for Part 2 with the current obstacle added
                walk(new Set(), { ...pos }, dir, nextPosKey);
            }
            // Set pos to next position
            pos.y = nextPos.y;
            pos.x = nextPos.x;
        } else {
            // It's an obstacle, turn right (without moving)
            if (p2Set && !dir) p2Set.add(posDirKey);
            dir = (dir + 1) % 4;
        }
    }
}

walk(p2Set = null, pos, dir, obstacleSet);
console.log(`answer part 1: ${answerp1.size}`);
console.log(`answer part 2: ${answerp2}`);
console.log(`solved in ${Date.now() - startTime} ms`);
