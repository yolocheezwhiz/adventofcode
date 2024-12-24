// Standard config
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/24";
localStorage[day] ||= (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// Day specific stuff
const input = localStorage[day].split('\n\n').map(elements => elements.split('\n'));
const gates = { AND: (l, r) => l & r, OR: (l, r) => l | r, XOR: (l, r) => l ^ r };
const values = {};
const onlyZs = {};
const dontDestroyMe = [];
let min = Infinity;
let max = -Infinity;
let destroyMe = [];
let answerp2 = [];
let answerp1;

// Map existing values
input[0].forEach(line => {
    const [key, val] = line.split(': ');
    values[key] = Number(val);
    // Find min bits (0 obviously, but whatever), and `z` max bit (which will be `x`||`y` max bit + 1)
    min = Math.min(min, Number(key.substring(1)));
    max = Math.max(max, Number(key.substring(1)) + 1);
});

// Build an array of parsed instructions
input[1].forEach(line => {
    const [l, op, r, _, a] = line.split(' ');
    dontDestroyMe.push({ op: op, l: l, r: r, a: a });
    destroyMe.push({ op: op, l: l, r: r, a: a });
});

// Attempt to process each instruction until all processed
while (destroyMe.length) {
    // Take the first one
    const i = destroyMe.shift();
    // If a value is not yet defined, put it back at the end of the array to re-eval later
    if (isNaN(values[i.l]) || isNaN(values[i.r])) destroyMe.push(i);
    else {
        // Set value
        values[i.a] = gates[i.op](values[i.l], values[i.r]);
        // If it's a z, set it separately
        if (i.a[0] === 'z') onlyZs[i.a] = values[i.a];

        // Part 2 
        // Manual testing & observation until rules for bad connections are identified
        // Which in essence are:
        // Except when `x` or `y` is the min bit (00) ... 
        // ... and except when `z` is the max bit (45) ...
        // ... operator cannot be <operator> when output is/is_not `z`... 
        // ... and/or operator cannot be <operator> when input are/are_not `x` and `y` ...
        // ... and/or output has to be an input of a specific operator 
        if ((i.a[0] === 'z' && i.op !== 'XOR' && Number(i.a.substring(1)) < max) ||
            (i.a[0] !== 'z' && !'xy'.match(i.l[0]) && !'xy'.match(i.r[0]) && i.op === 'XOR') ||
            ('xy'.match(i.l[0]) && Number(i.l.substring(1)) > min && 'xy'.match(i.r[0]) && Number(i.r.substring(1)) > min && i.op === 'XOR' && !dontDestroyMe.some(next => next.op === 'XOR' && (next.l === i.a || next.r === i.a))) ||
            ('xy'.match(i.l[0]) && Number(i.l.substring(1)) > min && 'xy'.match(i.r[0]) && Number(i.r.substring(1)) > min && i.op === 'AND' && !dontDestroyMe.some(next => next.op === 'OR' && (next.l === i.a || next.r === i.a))))
            // Add output wire to array of bad connections
            answerp2.push(i.a);
    }
}

// Sort the z keys in alphabetical order, reverse order, build a string from values, convert to a number from binary
console.log(`answer part 1: ${parseInt(Object.keys(onlyZs).sort().reverse().map(key => onlyZs[key]).join(''), 2)}`);
console.log(`answer part 2: ${answerp2.sort().join(',')}`);
console.log(`solved in ${Date.now() - startTime} ms.`);
