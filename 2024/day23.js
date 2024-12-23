//Standard config
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/23";
localStorage[day] ||= (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// Day specific stuff
// Sort pairs right away, allowing for less validation cases during part 1
const records = localStorage[day].split('\n').map(line => line.split('-').sort());
const answerp1 = new Set();
const computers = new Set();
const profiles = {};
let answerp2;

// Part 1
// For each pair
for (let [a, b] of records) {
    // Only consider the starting pair where a value starts with t
    if (a.startsWith('t') || b.startsWith('t')) {
        // Check all other pairs
        for (let [c, d] of records) {
            // Since it's already sorted, we only care about b matching the other pair
            if (b !== c && b !== d) continue;
            // And we don't want a to match, because it'd mean we're evaluating the same pair
            if (a === c || a === d) continue;
            // Similar logic with the 3rd pair
            for (let [e, f] of records) {
                // Since sorted, e must equal a to close the loop
                if (e !== a) continue;
                // 3rd pair must not equal 1st pair
                if (b === f) continue;
                // f must match the 2nd pair
                if (c !== f && d !== f) continue;
                // We found a triangle. 
                // a,b,f must represent the 3 unique values
                // Now we just want to avoid double counting, so we sort and set
                // The set size will represent the answer
                answerp1.add([a, b, f].sort().join(''));
            }
        }
    }
}

// Part 2
// For each record
records.forEach(([a, b]) => {
    // Build a set of computers
    computers.add(a).add(b);
    // Build profiles (computer + all their connections)
    (profiles[a] ||= new Set([a])).add(b), (profiles[b] ||= new Set([b])).add(a);
});

const computerArr = Array.from(computers);
let stop;
// Observation shows us that each computer has 13 connections, forming clusters of size 14
// No cluster is exactly the same
// Hypothesis is that they all have one 'bad connection' each, and that the final cluster is of size 13
// We'll test this hypothesis
for (let computer of computerArr) {
    // If answer has already been found, stop
    if (stop) break;
    // for each profile
    Object.values(profiles).forEach(profile1 => {
        // If answer has already been found, stop
        if (stop) return;
        let count = 0;
        // remove a computer
        if (!profile1.has(computer)) return;
        const clone = new Set(profile1);
        clone.delete(computer);
        const profile1Arr = Array.from(clone);
        // Check if this cluster of size 13 is found in other clusters
        Object.values(profiles).forEach(profile2 => {
            const profile2Arr = Array.from(profile2);
            // If so, increment count
            if (profile1Arr.every(element => profile2Arr.includes(element))) count++;
        });
        // If there are 13 clusters sharing the same 13 computers, we found the answer
        if (count === 13) {
            answerp2 = profile1Arr.sort().join(',');
            stop = true;
        }
        // It works, good enough. Merry pre-Christmas
        // No need to implement that looks for partial matches of any size
    });
}
console.log(`answer part 1: ${answerp1.size}`);
console.log(`answer part 2: ${answerp2}`);
console.log(`solved in ${Date.now() - startTime} ms.`);
