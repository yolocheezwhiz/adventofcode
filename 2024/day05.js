// run from adventofcode.com in the dev console
// standard config for all days
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/5";
const now = Date.now();
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// day specific stuff
// index 0 is the stringified rules, index 1 is the stringified update instructions
const splitInputs = localStorage[day].split('\n\n');
const rules = splitInputs[0].split('\n').map(x => x.split('|').map(Number));
const updates = splitInputs[1].split('\n').map(x => x.split(',').map(Number));
let answerp1 = 0;
let answerp2 = 0;
// process each update instruction
updates.forEach(update => {
    // assume ordering is correct
    let isOrdered = true;

    // used for part 2
    const rulesThatApply = {};

    for (let rule of rules) {
        const i = update.indexOf(rule[0]);
        const ii = update.indexOf(rule[1]);
        // rule doesn't apply, skip
        if (i === -1 || ii === -1) continue;
        // if both numbers of the rule are found in the update instruction
        // the rule is applicable to the current update instruction
        // we count the occurences of the left-hand side number
        rulesThatApply[rule[0]] ||= 0;
        rulesThatApply[rule[0]]++;
        // if ordered, part 1, else part 2
        if (i > ii) isOrdered = false;
    }
    // update instruction is ordered, get the middle page number
    if (isOrdered) answerp1 += update[0.5 * (update.length - 1)];
    else {
        // update instruction is unordered
        // order the applicable rules by count of occurences of the left-hand side value DESC
        // logic being: 
        // the left-hand side value of applicable rules with the biggest count MUST BE the first page of the update instruction
        // the next one must be the second page. so on so forth
        // this yields the correct page order, minus the last page
        // which never appears as a left-hand side value in the rules
        let sortedKeys = Object.keys(rulesThatApply).sort(function (a, b) { return rulesThatApply[b] - rulesThatApply[a] });
        // if the last page was in the sorted keys, it'd be 0.5 * (sortedKeys.length - 1)
        // but since that page is the in the sorted keys, we omit the -1 part.
        answerp2 += +sortedKeys[0.5 * (sortedKeys.length)];
    }
});
console.log('answer p1: ' + answerp1);
console.log('answer p2: ' + answerp2);
console.log('solved in ' + (Date.now() - now) + ' ms.');
