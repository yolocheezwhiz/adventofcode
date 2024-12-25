const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/16";
localStorage[day] ||= (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();

// Day-specific setup
const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const map = localStorage[day].split('\n').map(line => line.split(''));
const mapLen = map.length // same for x and y
const yx = {};
let answerp1 = Infinity;
let answerp2 = new Set();
let S, E;

// Find S and E, and initiate each map key
for (let y = 0; y < mapLen; y++) {
    for (let x = 0; x < mapLen; x++) {
        if (map[y][x] === 'S') {
            S = [y, x];
            // We lazily don't create a key in yx for S, so we need to account for it in Part 2's answer
            // Use unique integers as object keys for faster processing
            answerp2.add(y + x * mapLen);
        }
        if (map[y][x] === 'E') E = [y, x];
    }
}

// Part 1
const queue = [];
queue.push({ pos: S, dir: [0, 1], score: 0 });
while (queue.length) {
    const { pos: [y, x], dir, score } = queue.shift();
    // Check if we've reached the end
    if (y === E[0] && x === E[1]) {
        // If lower score, set as the best so far
        if (score < answerp1) answerp1 = score;
        continue;
    }
    // Skip when too far from answer at a too high cost
    const yManhattan = Math.abs(E[0] - y);
    const xManhattan = Math.abs(E[1] - x);
    const atLeastOneTurn = yManhattan && xManhattan ? 1000 : 0;
    if (score + yManhattan + xManhattan + atLeastOneTurn >= answerp1) continue;
    // Try every dir
    dirs.forEach(([dy, dx]) => {
        // Calculate next position
        const newY = y + dy;
        const newX = x + dx;
        const nk = newY + newX * mapLen;
        const dk = dy + dx * mapLen;
        // Skip if 180-degree turn
        if (dir[0] * dy + dir[1] * dx === -1) return;
        // Skip if wall
        if (map[newY][newX] === '#') return;
        // Calculate the cost of movement
        let cost = score;
        cost += (dir[0] * dy + dir[1] * dx === 1) ? 1 : 1001;
        // If cost exceeds current path, skip
        if (yx[nk]?.[dk] <= cost) return;
        // Update cost to make it to this pos from this dir
        yx[nk] ||= {};
        yx[nk][dk] = cost;
        // Enqueue next position
        queue.push({ pos: [newY, newX], dir: [dy, dx], score: cost });
    });
}

// We now have part 1's answer, and an object (yx) representing best costs per position per dir. 
// We walk backward from E to S
queue.push({ pos: E, score: answerp1 });
while (queue.length) {
    const { pos: [y, x], score } = queue.shift();
    // Add pos to answer since it passed all checks
    answerp2.add(y + x * mapLen);
    // Try every dir
    dirs.forEach(([dy, dx]) => {
        const newY = y + dy;
        const newX = x + dx;
        const nk = newY + newX * mapLen;
        // Check if pos was evaluated in part 1
        const neighbor = yx[nk];
        let nCosts;
        // If so, Get the values for every dir
        if (neighbor) nCosts = Object.values(yx[nk]);
        // If any delta matches -1 or -1001, pos is valid, add to queue
        if (nCosts?.some(cost => cost === score - 1)) queue.push({ pos: [newY, newX], dir: [dy, dx], score: score - 1 });
        else if (nCosts?.some(cost => cost === score - 1001)) queue.push({ pos: [newY, newX], dir: [dy, dx], score: score - 1001 });
    });
}
console.log(`Answer Part 1: ${answerp1}`);
console.log(`Answer Part 2: ${answerp2.size}`);
console.log(`Solved in ${Date.now() - startTime} ms.`);
