let response = await fetch("https://adventofcode.com/2023/day/7/input");
let txt = await response.text();
let inputs = txt.trim().split("\n");

let strength = "J23456789TQKA";
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

  //modify object because for some reason max_a / max_b default to J's value if J's value is highest
  let clone_a = {
    ...a[2]
  };
  let clone_b = {
    ...b[2]
  };
  let J_val_a = clone_a.J || 0;
  let J_val_b = clone_b.J || 0;
  delete clone_a.J;
  delete clone_b.J;

  for (let x of Object.values(clone_a)) max_a = max_a > x ? max_a : x;
  for (let x of Object.values(clone_b)) max_b = max_b > x ? max_b : x;

  //add J to max
  max_a += J_val_a;
  max_b += J_val_b;

  //sort by single cards < 2 of a kind < 3 of a kind < 4 < 5
  if (max_a != max_b) return max_a - max_b;

  //when previous step returns an equality
  //check for 2 pairs and full houses
  let two_pair_a, two_pair_b, full_house_a, full_house_b;
  let arr_a = [];
  let arr_b = [];

  for (let x of Object.values(clone_a)) arr_a.push(x);
  for (let x of Object.values(clone_b)) arr_b.push(x);

  //sort by biggest count first
  arr_a.sort((a, b) => {
    return b - a
  });
  arr_b.sort((a, b) => {
    return b - a
  });

  //add Js to biggest count
  arr_a[0] += J_val_a;
  arr_b[0] += J_val_b;

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
console.log("answer part 2: " + answer);
