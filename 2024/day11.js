const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/11";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();

// Day-specific setup
let input = localStorage[day].split(' ').map(Number);
// We can't bruteforce part 2
// So we keep track of how often we see the same number and not repeat the same operation more than once
let occurrences = new Map();
// Start with each number having an occurrence of 1
input.forEach(num => occurrences.set(num, (occurrences.get(num) || 0) + 1));
for (let i = 1; i <= 75; i++) {
    const newOccurrences = new Map();
    occurrences.forEach((count, num) => {
        if (!num) newOccurrences.set(1, (newOccurrences.get(1) || 0) + count);
        else {
            const str = String(num);
            const len = str.length;
            if (!(len % 2)) {
                const part1 = Number(str.slice(0, len / 2));
                const part2 = Number(str.slice(len / 2));
                newOccurrences.set(part1, (newOccurrences.get(part1) || 0) + count);
                newOccurrences.set(part2, (newOccurrences.get(part2) || 0) + count);
            } else {
                const multiplied = num * 2024;
                newOccurrences.set(multiplied, (newOccurrences.get(multiplied) || 0) + count);
            }
        }
    });
    // Update occurrences for the next loop
    occurrences = newOccurrences;
    // We just reduce everything to get the array length
    if (i === 25) console.log(`answer part 1: ${Array.from(occurrences.values()).reduce((sum, count) => sum + count, 0)}`);
}
console.log(`answer part 2: ${Array.from(occurrences.values()).reduce((sum, count) => sum + count, 0)}`);
console.log(`solved in ${Date.now() - startTime} ms`);
