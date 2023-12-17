//RUN FROM adventofcode.com
let inputs = (await (await fetch("https://adventofcode.com/2023/day/5/input")).text()).trim().split("\n\n");
let answer = Infinity;
let answer_p2 = Infinity;
let seeds = inputs[0].split(": ")[1].split(" ").map(function(str) {
  return Number(str);
});
let c1 = inputs[1].split(":\n")[1].split("\n");
let c2 = inputs[2].split(":\n")[1].split("\n");
let c3 = inputs[3].split(":\n")[1].split("\n");
let c4 = inputs[4].split(":\n")[1].split("\n");
let c5 = inputs[5].split(":\n")[1].split("\n");
let c6 = inputs[6].split(":\n")[1].split("\n");
let c7 = inputs[7].split(":\n")[1].split("\n");
for (let i in c1) c1[i] = c1[i].split(" ");
for (let i in c2) c2[i] = c2[i].split(" ");
for (let i in c3) c3[i] = c3[i].split(" ");
for (let i in c4) c4[i] = c4[i].split(" ");
for (let i in c5) c5[i] = c5[i].split(" ");
for (let i in c6) c6[i] = c6[i].split(" ");
for (let i in c7) c7[i] = c7[i].split(" ");

//sort arrays descending based on source (index 1). Convert shit to nums
function order(c) {
  c.sort((a, b) => {
    return Number(b[1]) - Number(a[1]);
  });
  for (var i = 0; i < c.length; i++) {
    c[i][0] = Number(c[i][0]);
    c[i][1] = Number(c[i][1]);
    c[i][2] = Number(c[i][2]);
    
    //sometimes a map is missing the zero source value. Add it
    if (i == c.length - 1 && c[i][1] != 0) {
      c.push([0, 0, c[i][1]]);
      break;
    }
  }
  return c;
}

//same logic for all steps
function process(s, c) {
  for (var i = 0; i < c.length; i++) {
    //since arrays are sorted DESC, finding the first array where s >= c[1] means this is the input to look for
    if (s >= c[i][1]) {
      let top_range = c[i][1] + c[i][2] - 1;
      //if source > top range, no modifier to destination, else modifier is the delta between source and destination
      let modifier = s > top_range ? 0 : c[i][0] - c[i][1];
      return s + modifier;
    }
  }
}

//numbers are too big to build individual maps. We'll be looking for ranges instead.
order(c1);
order(c2);
order(c3);
order(c4);
order(c5);
order(c6);
order(c7);

//process each seed and crawl through all steps
seeds.forEach(seed => {
  let x = process(process(process(process(process(process(process(seed, c1), c2), c3), c4), c5), c6), c7);
  answer = x < answer ? x : answer;
});
console.log(answer);

//yolo (be patient! huge brute force is huge)
for (let i = 0; i < seeds.length; i += 2) {
  for (let j = 0; j < seeds[i + 1]; j++) {
    let x = process(process(process(process(process(process(process(seeds[i] + j, c1), c2), c3), c4), c5), c6), c7);
    if (x < answer_p2) console.log("new best:" + x);
    answer_p2 = x < answer_p2 ? x : answer_p2;
  }
}
console.log("part 2 answer: " + answer_p2);
