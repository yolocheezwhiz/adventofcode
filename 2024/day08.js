// General configuration for adventofcode.com
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/8";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// Day-specific setup
const antennas = {};
const inputs = localStorage[day].split('\n').map(line => line.split(''));
const ylength = inputs.length;
const xlength = inputs[0].length;
// Use sets for position uniqueness
const antinodes = new Set();
const antinodesp2 = new Set();

// Find all antennas
for (let y in inputs) {
    for (let x in inputs[y]) {
        const val = inputs[y][x];
        // Skip empty terrain
        if (val === '.') {
            continue;
        }
        // For in loops cast y and x as strings. Recast as numbers.
        y = +y;
        x = +x;
        // set antenna type as array
        antennas[val] ||= [];
        // If there already is 1+ antenna of that type in the array
        antennas[val].forEach(([yy, xx]) => {
            // Add both the current and previous antenna to antinodes for part 2
            antinodesp2.add(y + ',' + x);
            antinodesp2.add(yy + ',' + xx);
            // Calculate the distance between the new antenna and previous ones
            const dy = yy - y;
            const dx = xx - x;
            // Loop for part 2
            let i = 1;
            while (true) {
                let stopLooping = true;
                // Check if antinode, starting from previous antenna, is in bounds
                if (yy + (dy * i) < ylength && yy + (dy * i) >= 0 && xx + (dx * i) < xlength && xx + (dx * i) >= 0) {
                    // Add it part 1 answer if in first iteration of the loop
                    if (i === 1) {
                        antinodes.add((yy + (dy * i)) + ',' + (xx + (dx * i)));
                    }
                    // Add to part 2 answer
                    antinodesp2.add((yy + (dy * i)) + ',' + (xx + (dx * i)));
                    // Since a least one antinode is in bound, keep looping
                    stopLooping = false;
                }
                // Same check, but from the new antenna
                if (y - (dy * i) < ylength && y - (dy * i) >= 0 && x - (dx * i) < xlength && x - (dx * i) >= 0) {
                    if (i === 1) {
                        antinodes.add((y - (dy * i)) + ',' + (x - (dx * i)));
                    }
                    antinodesp2.add((y - (dy * i)) + ',' + (x - (dx * i)));
                    stopLooping = false;
                }
                // Potential antinodes are all out of bounds, exit
                if (stopLooping) break;
                // At least one antinode is in bound, keep looping
                i++;
            }
        });
        // Add current antenna to array of antennas for that type
        antennas[val].push([y, x]);
    }
}
console.log('answer p1: ' + antinodes.size);
console.log('answer p2: ' + antinodesp2.size);
console.log('solved in ' + (Date.now() - startTime) + ' ms.');
