const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/12";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();

// Day-specific setup
const map = localStorage[day].split('\n').map(line => line.split(''));
const mapLen = map.length // same for x and y
let answerp1 = 0;
let answerp2 = 0;
const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function fence(y, x, posValue, region, edges) {
    let neighbors = 0;
    // Set the plot as visited
    region[y + x * mapLen] = 0
    // Check plots up, down, left, right
    dirs.forEach(([dy, dx]) => {
        const yy = y + dy;
        const xx = x + dx;
        // If the same type of plot
        if (map[yy]?.[xx] === posValue) {
            // Add to neighbor count
            neighbors++;
            // Recursively check the neighboring plot if not visited already
            if (isNaN(region[yy + xx * mapLen])) fence(yy, xx, posValue, region, edges);
        } 
        // If the plot is not of the same type (or is out of bound), draw a line there for part 2
        // use dy as condition to know if the line should be horizontal or vertical
        else if (dy) edges.add(`${yy - 0.5 * dy}_${xx - 0.5},${yy - 0.5 * dy}_${xx + 0.5}`);
        else edges.add(`${yy - 0.5}_${xx - 0.5 * dx},${yy + 0.5}_${xx - 0.5 * dx}`);
    });
    // Set the amount of neighboring plot of the same type for the current position
    region[y + x * mapLen] = neighbors;
    return;
}

// For part 2, let's keep it simple
// Count line junctions that are going straight
function countStraightLines(edges) {
    let straightLines = 0;
    const edgesArr = Array.from(edges);
    for (let i = 0; i < edgesArr.length; i++) {
        let notACorner = false;
        const [a, b] = edgesArr[i].split(',');
        let count = 0;
        for (let j = i + 1; j < edgesArr.length; j++) {
            const [a2, b2] = edgesArr[j].split(',');
            // If a line and another share their last/first coordinates, they touch
            if (b === a2 || a === b2) {
                count++;
                const [y, x] = a.split('_');
                const [y2, x2] = b2.split('_');
                // If one of their x or y position is the same, the line is straight
                if (y === y2 || x === x2) notACorner = true;
            }
        }
        // False positives are possible when a line touches more than one line, so we add the && count === 1 condition
        // e.g. If we were to draw lines here
        // A would be a single area
        // A "plus sign" shaped lines would exist in the middle of 
        // BA
        // AC
        // But it's actually not a straight line
        /*
        AAAA
        ABAA
        AACA
        AAAA
        */
        if (notACorner && count === 1) straightLines += 1;
    }
    return straightLines;
}

// Walk the map
map.forEach((line, y) => line.forEach((val, x) => {
    const region = {};
    const edges = new Set();
    // We only walk non-empty plots
    if (map[y][x] !== '.') fence(y, x, val, region, edges);
    let perimeter = 0;
    let area = 0;
    // Once we recursively walked the map for a plot type starting at pos 0,0
    Object.entries(region).forEach(([pos, neighbors]) => {
        // the size of the region is the area
        area++;
        // The perimeter is 4 minus neighbors for every plot
        perimeter += 4 - neighbors;
        // To prevent evaluating them again, we set the visited plots on fire!!!!!!!!!!!!!!!
        xx = Math.floor(+pos / mapLen);
        yy = pos - (xx * mapLen);
        map[yy][xx] = '.';
    });
    answerp1 += perimeter * area;
    // We simply reduce the perimeter by the amount of straight line junctions
    answerp2 += (perimeter - countStraightLines(edges)) * area;
}));

console.log(`answer part 1: ${answerp1}`);
console.log(`answer part 2: ${answerp2}`);
console.log(`solved in ${Date.now() - startTime} ms`);
