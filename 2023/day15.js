//part 1 as a one-liner because we can!
console.log("Part 1 answer: " + (await (await fetch("https://adventofcode.com/2023/day/15/input")).text()).trim().split(",").reduce((a, b) => a + (b.split("").reduce((c, d) => (((c + Number(d.charCodeAt())) * 17) % 256), 0)), 0));

//compute hash
function hash(val) {
  return val.split("").reduce((a, b) => ((a + Number(b.charCodeAt())) * 17) % 256, 0);
}

//part 2
let inputs = ((await (await fetch("https://adventofcode.com/2023/day/15/input")).text()).trim().split(","));

//we create a box of 256 boxes
let boxes = Array.from({
  length: 256
}, () => []);

//for each input
for (let input of inputs) {

  //split at = or -
  input = input.split(/=|-/);

  //keep left hand side value pre hash
  let label = input[0];

  //hash left hand side value
  let box_num = hash(input[0]);

  //if split was done at - right hand side value is an empty string, which will be converted to false. Else, it will be converted to true
  let add = !!input[1];

  //convert the right hand side value to a number
  let lens_num = +input[1];

  //remove lens
  if (!add) {
    for (let i = 0; i < boxes[box_num].length; i++)
      if (boxes[box_num][i][0] == label) boxes[box_num].splice(i, 1);
  }

  //we try adding the lens
  else {
    let replace = false;
    for (let i = 0; i < boxes[box_num].length; i++)
      if (boxes[box_num][i][0] == label) {

        //lens already exists, we replace it
        replace = true;
        boxes[box_num][i][1] = lens_num;
        break;
      }

    //we need to add the lens
    if (!replace) boxes[box_num].push([label, lens_num]);
  }
}

//calculate final answer
let answer = 0;
for (let i = 0; i < boxes.length; i++)
  for (let j = 0; j < boxes[i].length; j++) answer += (i + 1) * (j + 1) * boxes[i][j][1];

console.log("Part 2 answer: " + answer);
