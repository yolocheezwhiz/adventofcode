//RUN FROM adventofcode.com/2023
let response = await fetch("https://adventofcode.com/2023/day/8/input");
let txt = await response.text();
let inputs = txt.trim().split("\n");

//starting pos
let my_pos = "AAA";
let maps = {};
let iter = 0;

//first line are the L/R instructions
let instructions = inputs[0];

//maps start at index 2
for (let i = 2; i < inputs.length; i++) {

  //build an object of maps, where key is the current pos, and value is [L,R] array
  let map = inputs[i];
  maps[map.split(" ")[0]] = [map.split("(")[1].split(",")[0], map.split(",")[1].split(")")[0].trim()];
}

//log answer
console.log("part 1 answer " + (function(pos) {
  while (true) {
    //loop through instructions until answer is found, set move as 0 (L) or 1 (R)
    let move = instructions[iter % instructions.length] == "L" ? 0 : 1;

    //change current pos
    pos = maps[pos][move];
    //add move AFTER
    iter++;
    //success
    if (pos == "ZZZ") return iter;
  }
})(my_pos));


//part2
iter = 0;
//the result is too big to loop indefinitely. instead, for each starting position, 
//we will check when an infinite loop happens where we reach a destination more than once after the same amount of instructions
let loops_length = [];
my_pos = [];

//find all starting positions
for (let x of Object.keys(maps))
  if (x[2] == "A") my_pos.push(x);

//run each pos concurrently
my_pos.forEach(pos => {
  //aggregate whenever an answer is potentially found
  let aggregator = [];
  //log answer
  (function(pos, iter) {
    while (true) {
      //loop through instructions until answer is found, set move as 0 (L) or 1 (R)
      let move = instructions[iter % instructions.length] == "L" ? 0 : 1;
      //change current pos
      pos = maps[pos][move];
      //add move AFTER
      iter++;

      //potential success
      if (pos[2] == "Z") aggregator.push([iter, pos]);
      //verify that the success loops (same destination, same loop length)
      if (aggregator.length > 1 && aggregator[aggregator.length - 1][1] == aggregator[aggregator.length - 2][1] &&
        aggregator[aggregator.length - 1][0] == 2 * aggregator[aggregator.length - 2][0]) {
        //if so, log how big the loop is
        loops_length.push(aggregator[aggregator.length - 2][0]);
        return
      }

    }
  })(pos, iter);
});

//now that we know the size of each loop, we need to find their Least Common Multiple (LCM)
const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

console.log("part 2 answer: " + lcm(...loops_length));
