const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/15";
localStorage[day] ||= (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// Day-specific setup
const input = localStorage[day].split('\n\n');
const moves = input[1].replaceAll('\n', '');
const dirs = { '^': [-1, 0], '>': [0, 1], 'v': [1, 0], '<': [0, -1] };
let map = input[0].split('\n').map(line => line.split(''));
let robot, evaluatedBoxes;

// Find robot, replace it on the map with an empty space
function findRobot() {
    outer: for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] === '@') {
                robot = [y, x];
                map[y][x] = '.';
                break outer;
            }
        }
    }
    return;
}

function moveRobot(part) {    
    // Process each move
    for (let i = 0; i < moves.length; i++) {
        const [y, x] = dirs[moves[i]];
        const [nextY, nextX] = [robot[0] + y, robot[1] + x];
        // We hit a wall, do nothing
        if (map[nextY][nextX] === '#') {
            continue;
        }
        // Empty space, move
        if (map[nextY][nextX] === '.') {
            robot = [nextY, nextX];
            continue;
        }
        // It's a box. Find next wall or empty space
        let [furtherY, furtherX] = [nextY + y, nextX + x];
        // During part 2, moving horizontally is roughly the same as in part 1
        if (part === 1 || x) {
            while (true) {
                // If it's a wall, do nothing
                if (map[furtherY][furtherX] === '#') {
                    break;
                }
                // If it's a box, check further
                if (map[furtherY][furtherX] !== '.') {
                    [furtherY, furtherX] = [furtherY + y, furtherX + x];
                    continue;
                }
                // It's an empty space, move robot
                robot = [nextY, nextX];
                // Push boxes
                // In part 1, we swap the values of the current box with the empty space
                if (part === 1) {
                    map[nextY][nextX] = '.';
                    map[furtherY][furtherX] = 'O';
                    // In part 2, we splice the empty space out and reinject it before the box(es)
                    // This prevents swapping half a box with the empty space
                } else {
                    map[furtherY].splice(nextX, 0, map[furtherY].splice(furtherX, 1)[0]);
                }
                break;
            }
        } else {
            // It's a box to move vertically during part 2
            // Keep track of all things to potentially move
            evaluatedBoxes = new Set();
            // Recursively check if boxes can be moved
            if (canTheBoxBeMoved(map[nextY][nextX], nextY, nextX, y)){
                // Stuff can be moved
                // Build an array of [y,x] half-boxes to push
                const boxesToMove = Array.from(evaluatedBoxes).map(pos=>pos.split(',').map(Number));
                // Sort them so that the boxes further away from the robot are the first in the array
                boxesToMove.sort((a, b) => Math.abs(b[0] - robot[0]) - Math.abs(a[0] - robot[0]));
                // Swap each box part with empty space above|below
                boxesToMove.forEach(([boxY,boxX])=>{
                    map[boxY + y][boxX] = map[boxY][boxX];
                    map[boxY][boxX] = '.';
                })
                // Move robot
                robot = [nextY, nextX];
            }
        }
    }
}

// Check if box in part 2 is movable vertically
function canTheBoxBeMoved(boxSide, checkY, checkX, y) {
    // If the current box to check is the left side, we also have to check if the right side can be pushed, and vice versa
    const valueToCheck = boxSide === '[' ? 1 : -1;
    // Add both halves of the box to stuff to move
    const [half1Y, half1X] = [checkY, checkX];
    const [half2Y, half2X] = [checkY, checkX + valueToCheck];
    evaluatedBoxes.add([half1Y, half1X].toString());
    evaluatedBoxes.add([half2Y, half2X].toString());
    // If there is at least one wall, box cannot be moved
    if (map[half1Y + y][half1X] === '#' || map[half2Y + y][half2X] === '#') {
        return false;
    } else {
        // Return true automatically if the space above|below one half is empty
        // Otherwise recurse
        return (map[half1Y + y][half1X] === '.' ? true : canTheBoxBeMoved(map[half1Y + y][half1X], half1Y + y, half1X, y))
            && (map[half2Y + y][half2X] === '.' ? true : canTheBoxBeMoved(map[half2Y + y][half2X], half2Y + y, half2X, y));
    }
}

// Calculate answer
function GPS(part) {
    let answer = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x].match(/O|\[/)) {
                answer += y * 100 + x;
            }
        }
    }
    console.log(`answer part ${part}: ${answer}`);
}

// Rebuild map for part 2
function rewriteMap() {
    map = [];
    const rows = input[0].split('\n');
    for (let row of rows) {
        const r = [];
        for (let i = 0; i < row.length; i++) {
            switch (row[i]) {
                case '@':
                    r.push('@', '.');
                    break;
                case 'O':
                    r.push('[', ']');
                    break;
                default:
                    r.push(row[i], row[i]);
                    break;
            }
        }
        map.push(r);
    }
}

// Part 1
findRobot();
moveRobot(1);
GPS(1);
// Part 2
rewriteMap();
findRobot();
moveRobot(2);
GPS(2);
console.log(`solved in ${Date.now() - startTime} ms.`);
