const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/18";
localStorage[day] ||= (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// Day-specific setup
const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const bytes = localStorage[day].split('\n').map(line => line.split(',').map(Number));
let answer;
// Build map, set fallen bytes
const map = Array.from({ length: 71 }, () => Array(71).fill('.'));
for (let i = 0 ; i < 1024; i++){
    map[bytes[i][0]][bytes[i][1]] = '#';
}

function solve() {
    // BFS
    const queue = [];
    const yx = {};
    answer = Infinity;
    queue.push({ pos: [0,0], score: 0});
    while (queue.length) {
        // Check first queue element
        const { pos: [y, x], score} = queue.shift();
        yx[`${y},${x}`] ||= Infinity;
        // Skip pos where score is too high. 
        if (score >= yx[`${y},${x}`] || score >= answer) continue;
        // Check if at the end
        if (y === 70 && x === 70) {
            answer = score;
            continue;
        }
        // Set score for current pos
        yx[`${y},${x}`] = score;
        // Evaluate each possible next step
        dirs.forEach(([dy, dx]) => {
            const newY = y + dy;
            const newX = x + dx;
            // If wall or out of bounds, skip
            if (map[newY]?.[newX] !== '.') return;
            // If score for next position is too high, skip
            if (yx[`${newY},${newX}`] <= score + 1) return;
            // Enqueue next pos, increment score
            queue.push({ pos: [newY, newX], score: score + 1 });
        });
    }
}

// Solve part 1
solve();
console.log(`Answer Part 1: ${answer}`);
// Solve part 2
// Drop all bytes
for (let i = 1024 ; i < bytes.length; i++){
    map[bytes[i][0]][bytes[i][1]] = '#';
}
// Remove one byte at a time, starting from last
for (let i = bytes.length - 1 ; i >= 1024; i--){
    map[bytes[i][0]][bytes[i][1]] = '.';
    solve();
    // If a path is found, we're done.
    if (answer !== Infinity) {
        console.log(`Answer Part 2: ${bytes[i]}`);
        break;
    }
}
console.log(`Solved in ${Date.now() - startTime} ms.`);
