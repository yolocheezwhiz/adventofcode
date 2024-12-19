// Default config
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/19";
localStorage[day] ||= (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();

// Day specific stuff
const input = localStorage[day].split('\n\n');
const towels = input[0].split(', ');
const patterns = input[1].split('\n');
let answerp1 = 0;
let answerp2 = 0;

// DFS - Cache results 
function memoize(partialPattern, towels, memo) {
    // If we've already matched this partial pattern, return its count
    if (memo.has(partialPattern)) return memo.get(partialPattern);
    // We've successfully matched the entire pattern
    if (!partialPattern.length) return 1;
    // This is the first time we get this pattern
    // Find the towels that can be added next
    const count = towels.filter((towel) => partialPattern.startsWith(towel))
        // Recurse and sum
        .reduce((sum, towel) => sum + memoize(partialPattern.slice(towel.length), towels, memo), 0);
    // cache result for this partial pattern and return it
    memo.set(partialPattern, count);
    return count;
}

// Solve one pattern at a time
patterns.forEach((pattern) => {
    const totalCount = memoize(pattern, towels, new Map());
    // P1: If the pattern can be built
    if (totalCount) answerp1++;
    // P2: Sum possible ways to build the pattern
    answerp2 += totalCount;
});

console.log(`Answer Part 1: ${answerp1}`);
console.log(`Answer Part 2: ${answerp2}`);
console.log(`Solved in ${Date.now() - startTime} ms.`);
