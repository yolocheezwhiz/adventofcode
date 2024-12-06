// General configuration for adventofcode.com
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/6";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();

// Day-specific setup
const map = localStorage[day].split('\n').map(line => line.split(''));
let pos = '';
let direction = '';
// I'm glad I used this approach for Part 1, it made part 2 quite easy
const obstacles = new Set();
const visited = new Set(); // Its size will be part 1's answer

// Convert coordinates to 'y_x' string
const toKey = (a, b) => `${a}_${b}`;
// And vice-versa
const toNums = (y_x) => y_x.split('_').map(Number);

// Functionalized switch-case as it's being used and abused today
function evalSwitch(key, cases) {
    return cases[key]();
}

// Find the next obstacle based on direction from current pos
function findNextObstacle(pos, direction, obstacles) {
    const [y, x] = toNums(pos);
    let nextObstacleDistance = Infinity;
    let nextObstacle = null;
    obstacles.forEach(obstacle => {
        const [oy, ox] = toNums(obstacle);
        const { condition, distance } = evalSwitch(direction, {
            '^': () => ({ condition: ox === x && oy < y, distance: Math.abs(oy - y) }),
            '>': () => ({ condition: oy === y && ox > x, distance: Math.abs(ox - x) }),
            'v': () => ({ condition: ox === x && oy > y, distance: Math.abs(oy - y) }),
            '<': () => ({ condition: oy === y && ox < x, distance: Math.abs(ox - x) })
        });
        // If the obstacle is in the guard's path, and it's the closest one
        if (condition && distance < nextObstacleDistance) {
            // Set as next obstacle
            nextObstacleDistance = distance;
            nextObstacle = obstacle;
        }
    });
    return nextObstacle;
}

// Move the guard up to next obstacle or edge of map
function move(pos, direction, nextObstacle, visited, bumpedIntoFromDir) {

    // Part 2: Log obstacle bumped into, and from which direction
    if (bumpedIntoFromDir) {
        const bumpCount = bumpedIntoFromDir.size;
        bumpedIntoFromDir.add(toKey(pos, direction));
        // If bumped into twice, we have an endless loop
        if (bumpCount === bumpedIntoFromDir.size) return 'break';
    }

    const [y, x] = toNums(pos);
    const [ny, nx] = toNums(nextObstacle);

    // Skip during Part 2 for performance
    if (visited) {
        // Add to visited positions
        evalSwitch(direction, {
            '^': () => { for (let i = y; i > ny; i--) visited.add(toKey(i, x)); },
            '>': () => { for (let i = x; i < nx; i++) visited.add(toKey(y, i)); },
            'v': () => { for (let i = y; i < ny; i++) visited.add(toKey(i, x)); },
            '<': () => { for (let i = x; i > nx; i--) visited.add(toKey(y, i)); }
        });
    }
    // Set new pos
    return evalSwitch(direction, {
        '^': () => toKey(ny + 1, nx),
        '>': () => toKey(ny, nx - 1),
        'v': () => toKey(ny - 1, nx),
        '<': () => toKey(ny, nx + 1)
    });
}

// Parse map to find starting position and obstacles
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        const z = map[y][x];
        if (z === '#') obstacles.add(toKey(y, x));
        else if (z !== '.') {
            pos = toKey(y, x);
            direction = z;
        }
        // Here we could be tempted to keep track of all '.' for Part 2
        // But that would be a lot of looping for no reason
        // See end of script for a better approach
        else { }
    }
}

function solvePuzzle(pos, direction, obstacles, visited, bumpedIntoFromDir) {
    while (true) {
        // Find next obstacle
        const nextObstacle = findNextObstacle(pos, direction, obstacles) ||
            evalSwitch(direction, {
                '^': () => toKey(-1, toNums(pos)[1]),
                '>': () => toKey(toNums(pos)[0], map[0].length),
                'v': () => toKey(map.length, toNums(pos)[1]),
                '<': () => toKey(toNums(pos)[0], -1)
            });
        // Move to it
        const result = move(pos, direction, nextObstacle, visited, bumpedIntoFromDir);

        // Break out of Part 2's endless loops
        if (result === 'break') {
            answerp2++;
            break;
        }
        // Set new pos for next loop iteration
        pos = result;

        // If obstacle is out of bounds, we completed Part 1
        // (And need to eval another option for Part 2)
        if (!obstacles.has(nextObstacle)) break;

        // Change direction after hitting an obstacle
        direction = evalSwitch(direction, {
            '^': () => '>',
            '>': () => 'v',
            'v': () => '<',
            '<': () => '^'
        });
    }
}

solvePuzzle(pos, direction, obstacles, visited, null);
console.log('answer p1: ' + visited.size);

// For Part 2, we'll want to loop and try adding new obstacles
// We don't want to try thousands of obstacles that we already know we'll never bump into
// So let's add obstacles from visited positions from Part 1 only
visited.delete(pos); // (except the starting pos)

let answerp2 = 0;
let test = 0;
console.log('Sorry, I haven\'t had time to optimize Part 2 yet.');
visited.forEach((newObstacle) => {
    test++;
    if (test % 250 === 0) console.log(`Testing new obstacle ${test}/${visited.size}.`);
    const bumpedIntoFromDir = new Set();
    // One optimization would be to start walking the guard from that obstacle instead. I estimate the improvement to be around 40%
    // The real optimization would be something like linked list between the obstacles 
    // Update it for each newObstacle 
    // And find cycles from newObstacle
    // But I got other stuff to do
    obstacles.add(newObstacle);
    solvePuzzle(pos, direction, obstacles, null, bumpedIntoFromDir);
    obstacles.delete(newObstacle);
});
console.log('answer p2: ' + answerp2);
console.log('solved in ' + (Date.now() - startTime) + ' ms.');
