//RUN FROM adventofcode.com/2023
let response = await fetch("https://adventofcode.com/2023/day/7/input");
let txt = await response.text();
let inputs = txt.trim().split("\n");

let strength = "23456789TJQKA";
let hands = [];
let answer = 0;
for (let i in inputs) {

  //split cards and bet
  let parts = inputs[i].split(" ");

  //count characters per hand
  let reduced = [...parts[0]].reduce((a, e) => {
    a[e] = a[e] ? ++a[e] : 1;
    return a;
  }, {});

  //save this for next step
  hands.push([parts[0], parts[1], reduced]);
}

//sort the hands from weakest to strongest
hands.sort((a, b) => {
  let max_a = 0;
  let max_b = 0;

  //sort by 1 of a kind vs 2 vs 3 vs 4 vs 5
  for (let x of Object.values(a[2])) max_a = max_a > x ? max_a : x;
  for (let x of Object.values(b[2])) max_b = max_b > x ? max_b : x;
  if (max_a != max_b) return max_a - max_b;

  //when previous step returns an equality
  //check for 2 pairs and full houses
  let two_pair_a, two_pair_b, full_house_a, full_house_b;
  let arr_a = [];
  let arr_b = [];
  for (let x of Object.values(a[2])) arr_a.push(x);
  for (let x of Object.values(b[2])) arr_b.push(x);
  arr_a.sort((a, b) => {
    return b - a
  });
  arr_b.sort((a, b) => {
    return b - a
  });
  two_pair_a = arr_a[0] == 2 && arr_a[1] == 2;
  two_pair_b = arr_b[0] == 2 && arr_b[1] == 2;
  full_house_a = arr_a[0] == 3 && arr_a[1] == 2;
  full_house_b = arr_b[0] == 3 && arr_b[1] == 2;

  //convert bools to numbers, returns false first (since 0 < 1), meaning it sorts by weakest
  if (two_pair_a != two_pair_b) return Number(two_pair_a) - Number(two_pair_b);
  if (full_house_a != full_house_b) return Number(full_house_a) - Number(full_house_b);

  //sort by lowest 1st card, else by 2nd, else 3rd, else 4th, else 5th
  let to_num_a = [];
  let to_num_b = [];
  for (let x of a[0]) to_num_a.push(strength.indexOf(x));
  for (let x of b[0]) to_num_b.push(strength.indexOf(x));
  for (var i = 0; i < 5; i++)
    if (to_num_a[i] != to_num_b[i]) return to_num_a[i] - to_num_b[i];
});

for (let i = 0; i < hands.length; i++) answer += (i + 1) * hands[i][1];


console.log("answer part 1: " + answer);
