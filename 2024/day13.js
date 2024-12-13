const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/13";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();

// Day-specific setup
let inputs = localStorage[day].split('\n');
let answerp1 = 0;
let answerp2 = 0;

// One input at a time
for (let i = 0; i < inputs.length; i += 4) {

    // Parse values from input
    const parseButtonAValues = inputs[i].match(/X\+(-?\d+), Y\+(-?\d+)/);
    const AX = parseInt(parseButtonAValues[1], 10);
    const AY = parseInt(parseButtonAValues[2], 10);

    const parseButtonBValues = inputs[i + 1].match(/X\+(-?\d+), Y\+(-?\d+)/);
    const BX = parseInt(parseButtonBValues[1], 10);
    const BY = parseInt(parseButtonBValues[2], 10);

    const parsePrizeValues = inputs[i + 2].match(/X\=(-?\d+), Y\=(-?\d+)/);
    const PX = parseInt(parsePrizeValues[1], 10);
    const PY = parseInt(parsePrizeValues[2], 10);
    
    //Adapt values for part 2
    const PXp2 = PX + 10000000000000;
    const PYp2 = PY + 10000000000000;

    // Calculate required button presses
    // Advent of Algebra
    const countA = (PX * BY - BX * PY) / (BY * AX - BX * AY);
    const countB = (PY * AX - AY * PX) / (BY * AX - BX * AY);
    
    // Same for part 2
    const countAp2 = (PXp2 * BY - BX * PYp2) / (BY * AX - BX * AY);
    const countBp2 = (PYp2 * AX - AY * PXp2) / (BY * AX - BX * AY);

    // Only consider valid values (integers between 0 and 100)
    if (Number.isInteger(countA) && Number.isInteger(countB) && countA>=0 && countB >=0 && countA <=100 && countB <= 100) {
        answerp1 += countA * 3 + countB;
    }
    // Same but remove the <= 100 condition for part 2
    if (Number.isInteger(countAp2) && Number.isInteger(countBp2) && countAp2>=0 && countBp2 >=0) {
        answerp2 += countAp2 * 3 + countBp2;
    }
}
console.log(`answer part 1: ${answerp1}`);
console.log(`answer part 2: ${answerp2}`);
console.log(`solved in ${Date.now() - startTime} ms`);
