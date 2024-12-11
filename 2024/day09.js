// General configuration
const headers = new Headers({ "User-Agent": "github.com/yolocheezwhiz/adventofcode/" });
const day = "2024/day/9";
localStorage[day] = localStorage[day] || (await(await fetch("https://adventofcode.com/" + day + "/input", { headers: headers })).text()).trim();
const startTime = Date.now();
// Day-specific setup
const input = localStorage[day].split('').map(Number);
const blocks = [];
const freeSpaces = [];

// Build an array of blocks, and an array of free spaces
for (let i = 0, isBlock; i < input.length; i++) {
    isBlock = !isBlock;
    (isBlock ? blocks : freeSpaces).push(input[i]);
}

function solve(p1) {
    const processed = new Set();
    let answer = 0;
    let blockIndex = 0;
    let freeIndex = 0;
    let freeCarryover = 0;
    let blockCarryover = 0;
    let checksumIter = 0;
    let setFirstBlock = true;
    let lastIndex = blocks.length - 1;
    // Instead of building a string|array, ordering it
    // We immediately calculate the checksum
    function checksum(a, b) {
        for (let i = 0; i < a; i++) answer+= (typeof b === 'number' ? b : 0) * checksumIter++;
        return;
    }
    // Find the next block(s) to checksum
    while (true) {
        // During the previous loop iteration, 
        // we might have an free space that wasn't fully used, 
        // or a block that wasn't fully placed in an free space (part 1)
        // so we need to account for this carryover
        const freeVal = freeCarryover ? freeCarryover : freeSpaces[freeIndex];
        const blockVal = blockCarryover ? blockCarryover : blocks[lastIndex];
        // We're done. Process the last block
        if (blockIndex === lastIndex) {
            if (!p1 && !setFirstBlock) checksum(freeVal, '.');
            checksum(blockVal, lastIndex);
            break;
        }
        // Set the first eligible block starting from the left
        else if (setFirstBlock) {
            checksum(blocks[blockIndex], processed.has(blockIndex) ? '.' : blockIndex);
            // Keep track of blocks processed by both incrementing blockIndex
            // but also by adding to the set
            // for when we'll process from the right (lastIndex)
            if (!p1) processed.add(blockIndex);
            blockIndex++;
            // Next will be free space
            setFirstBlock = false;
        }
        // We're about to try to fill free space using block from the right-hand side
        // Verify it hasn't already been used
        else if (!p1 && processed.has(lastIndex)) {
            lastIndex--;
            continue;
        }
        //  Try spreading the last block in the first free spaces
        else if (freeVal === blockVal) {
            // Blocks fit perfectly in the free space
            checksum(blockVal, lastIndex);
            if (!p1) processed.add(lastIndex);
            freeIndex++;
            lastIndex--;
            freeCarryover = 0;
            blockCarryover = 0;
            setFirstBlock = true;
        } else if (freeVal > blockVal) {
            // There will be free space left after placing the block
            checksum(blockVal, lastIndex);
            if (!p1) processed.add(lastIndex);
            lastIndex--;
            freeCarryover = freeVal - blockVal;
            blockCarryover = 0;
            setFirstBlock = false;
        } else if (freeVal < blockVal) {
            // free space is not big enough to place block
            // Part 1 - Partially distribute the block
            if (p1) {
                checksum(freeVal, lastIndex);
                freeIndex++;
                blockCarryover = blockVal - freeVal;
                freeCarryover = 0;
                setFirstBlock = true;
                // Part 2 - Find the next potential blocks to place in the free space
            } else {
                let throwAwayFreeSpace = true;
                for (let i = lastIndex - 1; i >= 0; i--) {
                    // Do just like part 1
                    // Blocks fit perfectly in the free space
                    if (freeVal === blocks[i] && !processed.has(i)) {
                        checksum(blocks[i], i);
                        processed.add(i);
                        freeIndex++;
                        freeCarryover = 0;
                        blockCarryover = 0;
                        setFirstBlock = true;
                        throwAwayFreeSpace = false;
                        break;
                        // There will be free space left after placing the block
                    } else if (freeVal > blocks[i] && !processed.has(i)) {
                        checksum(blocks[i], i);
                        processed.add(i);
                        freeCarryover = freeVal - blocks[i];
                        blockCarryover = 0;
                        setFirstBlock = false;
                        throwAwayFreeSpace = false;
                        break;
                    }
                }
                // free space cannot be filled
                if (throwAwayFreeSpace) {
                    checksum(freeVal, '.');
                    freeIndex++;
                    freeCarryover = 0;
                    setFirstBlock = true;
                }
            }
        }
    }
    return answer;
}
console.log(`answer part 1: ${solve(true)}`);
console.log(`answer part 2: ${solve(false)}`);
console.log(`solved in ${Date.now() - startTime} ms`);
