//Standard config
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/23";
localStorage[day] ||= (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// Day specific stuff
// Sort pairs right away, allowing for less validation cases during part 1
const records = localStorage[day].split('\n').map(line => line.split('-').sort());
const answerp1 = new Set();
const profiles = new Map();
let computers = new Set();
let answerp2;

// For each pair
for (let [a, b] of records) {
    // Build profiles (computer:[connections]), and a list of computers for part 2
    profiles.set(a, [...(profiles.get(a) || []), b]);
    profiles.set(b, [...(profiles.get(b) || []), a]);
    computers.add(a).add(b);
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
computers = Array.from(computers);
// Create a list of interconnected computers
const networks = computers.map(computer => {
    // Get the computers connected to the current computer
    const connectedComputers = profiles.get(computer);
    // For each connected computer, build a network of mutual connections
    return connectedComputers.flatMap(nextComputer => {
        // Get the next computer's connections and filter those that are mutual with the current computer
        return [computer, ...profiles.get(nextComputer).filter(nextNextComputer => profiles.get(nextNextComputer).includes(computer))];
    // Filter out duplicates and ensure valid network connections
    }).filter((computer, i, arr) => arr.indexOf(computer) === i && arr.every(otherComputer => otherComputer === computer || profiles.get(otherComputer).includes(computer)));
});

// Find the largest network
answerp2 = networks.reduce((max, currentNetwork) =>
    currentNetwork.length > max.length ? currentNetwork : max
).sort().join(',');

console.log(`answer part 1: ${answerp1.size}`);
console.log(`answer part 2: ${answerp2}`);
console.log(`solved in ${Date.now() - startTime} ms.`);
