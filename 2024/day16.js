const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/16";
localStorage[day] ||= (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();

// Day-specific setup
const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const yx = {};
const map = localStorage[day].split('\n').map(line => line.split(''));
const mapLen = map.length // same for x and y
let answerp1 = Infinity;
let answerp2 = new Set();
let S, E;

// Find S and E, and initiate each map key
for (let y = 0; y < mapLen; y++) {
    for (let x = 0; x < mapLen; x++) {
        if (map[y][x] === 'S') S = [y, x];
        if (map[y][x] === 'E') E = [y, x];
        // keep keys as integers to speed up processing
        if (map[y][x] !== '#') yx[y + x * mapLen] = {};
    }
}

function solve(part2) {
    // DFS will overflow. Have to go with BFS.
    const queue = [];
    queue.push({ pos: S, dir: [0, 1], score: 0, /* Only care about path for part 2 */ path: part2 ? new Set([S[0] + S[1] * mapLen]) : null });
    while (queue.length) {
        // Check first queue element
        const { pos: [y, x], dir, score, path } = queue.shift();
        // If score is too high, skip
        if (score > answerp1) continue;
        // Check if at the end
        if (y === E[0] && x === E[1]) {
            // If lowest score, set as best to date
            if (score < answerp1) {
                answerp1 = score;
                // Replace answerp2 with current path
                if (part2) answerp2 = new Set(path);
            }
            // If we reach the best score from a different path, merge paths
            else if (part2 && score === answerp1) answerp2 = new Set([...answerp2, ...path]);
            // No need to keep processing since we reached E
            continue;
        }
        dirs.forEach(([dy, dx]) => {
            // Evaluate each possible next step
            const newY = y + dy;
            const newX = x + dx;
                        // If 180-degree turn, skip
            if (dir[0] * dy + dir[1] * dx === -1) return;
            // If wall, skip
            if (map[newY][newX] === '#') return;
            // If already visited in this branch, skip
            if (part2 && path.has(newY + newX * mapLen)) return;

            // Calculate cost of movement
            let cost = score;
            cost += (dir[0] * dy + dir[1] * dx === 1) ? 1 : 1001;
            // If cost for next position from this direction is too high, skip
            // For part 1, we can do <= instead of <, so we simulate this with cost + 1
            if (yx[newY + newX * mapLen][dy + dx * mapLen] < (part2 ? cost : cost + 1)) return;
            // Update score
            yx[newY + newX * mapLen][dy + dx * mapLen] = cost;
            // Enqueue next pos
            queue.push({
                pos: [newY, newX],
                dir: [dy, dx],
                score: cost,
                path: part2 ? new Set([...path, newY + newX * mapLen]) : null
            });
        });
    }
}
// Both parts could be solved in one go, but it's faster to get answer from part 1 without path tracking
solve();
// And then the rule score > answerp1 is going to be more efficient during part 2
solve(true);
console.log(`Answer Part 1: ${answerp1}`);
console.log(`Answer Part 2: ${answerp2.size}`);
console.log(`Solved in ${Date.now() - startTime} ms.`);
