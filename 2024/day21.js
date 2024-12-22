const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/21";
localStorage[day] ||= (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
const codes = localStorage[day].split('\n');
const keypad1 = [[7, 8, 9], [4, 5, 6], [1, 2, 3], ['', 0, 'A']];
const keypad2 = [['', '^', 'A'], ['<', 'v', '>']];
const numsRobot = {};
const dirsRobot = {};
// For each keypad, we're going to identify the optimal robot arm path
// Because robots can press A multiple times in a row (e.g. move left twice)
// optimal paths will never alternate between horizontal and vertical more than once.
// E.g. <^< is bad. <<^ or ^<< is better, 
// as it requires less back and forth from the direction button to the A button
// Part 2: While >^A is similar to ^>A, the latter is better
// (>^A) => (vA^<A>A) => (v<A^>A<A<vA>>^AvA^A) part2 starts here => (v<A<A>>^A<Av>A^A<<vA>>^A<<vA>A^>AvAA^<A>Av<A^>A<A>A)
// (^>A) => (<Av>A^A) => (v<<A>>^A<vA>A^A<A>A) part2 starts here => (<vA<AA>>^AvAA<^A>Av<<A>A^>AvA^A<A>Av<<A>>^AvA^A)
// Long story short, we need to favor buttons further away from A when applicable
function mapMovements(keypad, obj, isNumKeypad) {
    // Depending no the keypad, we determine where the empty button is
    const [emptyButtonRow, emptyButtonCol] = [isNumKeypad ? keypad.length - 1 : 0, 0];
    // Get the first button on the keypad
    for (let y = 0; y < keypad.length; y++) {
        for (let x = 0; x < keypad[0].length; x++) {
            const button1 = keypad[y][x];
            // Ignore the empty one
            if (button1 === '') continue;
            // Get the second button
            for (let y2 = 0; y2 < keypad.length; y2++) {
                for (let x2 = 0; x2 < keypad[0].length; x2++) {
                    const button2 = keypad[y2][x2];
                    // Ignore the empty one
                    if (button2 === '') continue;
                    // If hMov is negative, it's going right, else left
                    // If vMov is negative, it's going down, else up
                    const hMov = x2 - x;
                    const vMov = y2 - y;
                    // Build movement string
                    const hStr = (hMov > 0 ? '>' : '<').repeat(Math.abs(hMov));
                    const vStr = (vMov > 0 ? 'v' : '^').repeat(Math.abs(vMov));
                    // Since we favor left movement over vertical over right movement, we order the 2 substrings accordingly
                    let arrStr = hMov < 0 ? [hStr, vStr] : [vStr, hStr];
                    // If the path will make the robot panic, we reverse the substring
                    // We join substrings, and set it as movement from a button to another
                    obj[`${button1}${button2}`] = 
                    (x === emptyButtonCol || x2 === emptyButtonCol) 
                    && (y === emptyButtonRow || y2 === emptyButtonRow) 
                    // Every movement will end with a button press. We add it here.
                    ? arrStr.reverse().join('') + 'A' 
                    : arrStr.join('') + 'A';
                }
            }
        }
    }
}

function solve(part, recursionCount) {
    let answer = 0;
    // For each code
    codes.forEach(code => {
        // We get its numerical value to use it as string length multiplier later
        const num = Number(code.replace('A', ''));
        // Add 'A' prefix for first movement, as the robot starts at the A position
        let movesWithCount = numKeypadRobotMovement('A' + code, numsRobot); 
        // This returns the unique movements we'll need the robot to make, and their respective count
        // This is required for part 2 else the string is too big to eval
        // We recurse 2/25 times
        for (let i = 0; i < recursionCount; i++) movesWithCount = dirKeypadRobotMovement(movesWithCount, dirsRobot);
        // We're done recursing. We reduce everything to get the string (button presses) length
        const totalMovements = Object.values(movesWithCount).reduce((sum, count) => sum + count, 0);
        // We multiply by the code num value and increment the answer.
        answer += num * totalMovements;
    });
    console.log(`answer part ${part}: ${answer}`);
}

function numKeypadRobotMovement(code, robot) {
    const movesWithCount = {};
    for (let i = 0; i < code.length - 1; i++) {
        // Evaluate every movement from a button to the other
        const movement = code[i] + code[i + 1];
        const instruction = robot[movement];
        // Similar to this previous line:
        // let movesWithCount = numKeypadRobotMovement('A' + code, numsRobot);
        // We need to ensure each instruction begins on the A button 
        const move = 'A' + instruction.substring(0,1);
        // This is where the magic happens for part 2
        // We do not build a string of movements to re-evaluate recursively
        // Instead, we keep track of every unique action, and count how often they happen
        movesWithCount[move] ||= 0;
        movesWithCount[move]++;
        for (let j = 0; j < instruction.length - 1; j++) {
            const move = instruction[j] + instruction[j + 1];
            movesWithCount[move] ||= 0;
            movesWithCount[move]++;
        }
    }
    // We return not a string, but an object of substrings with counts
    return movesWithCount;
}

// We proceed in a very similar fashion to what we just did above, but using an object as an input
function dirKeypadRobotMovement(movesWithCount, robot) {
    const newMovesWithCount = {};
    for (const [movement, count] of Object.entries(movesWithCount)) {
        // Extract movement from two chars
        const instruction = robot[movement[0] + movement[1]];
        // Add 'A' to the start of each instruction
        const move = 'A' + instruction.substring(0, 1);
        newMovesWithCount[move] ||= 0;
        // We increment not with 1, but with the count from the previous step
        newMovesWithCount[move] += count;
        for (let i = 0; i < instruction.length - 1; i++) {
            const move = instruction[i] + instruction[i + 1];
            newMovesWithCount[move] ||= 0;
            // We increment not with 1, but with the count from the previous step
            newMovesWithCount[move] += count;
        }
    }
    return newMovesWithCount;
}
// Aaaaaand... we somehow survived the implementation of that recursion.
mapMovements(keypad1, numsRobot, true);
mapMovements(keypad2, dirsRobot, false);
solve(1, 2);
solve(2, 25);
console.log(`Solved in ${Date.now() - startTime} ms.`);
