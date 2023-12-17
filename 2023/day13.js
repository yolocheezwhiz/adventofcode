//RUN FROM adventofcode.com
let response = await fetch("https://adventofcode.com/2023/day/13/input");
let txt = await response.text();

//split at double linebreaks to eval each map individually
let inputs = txt.split("\n\n");
let answer_p1 = 0;
let answer_p2 = 0;

function solve(p2_bool) {

  //for each map
  for (let map of inputs) {

    //split rows
    let rows = map.split("\n");

    //transpose map
    let transposed = [];
    for (let y in rows) {
      for (let x in rows[y]) {
        transposed[x] = transposed[x] || "";
        transposed[x] += rows[y][x];
      }
    }

    //test maps
    check_mirrors(rows, 100);
    check_mirrors(transposed, 1);

    function check_mirrors(input, multiplier) {

      //check each row except last one
      for (let i = 0; i < input.length - 1; i++) {
        let count_diff = 0;

        //compare a row to the next, then those around them... until either the first or last row is reached
        for (let j = 0; j <= Math.min(i, input.length - i - 2); j++)

          //count differences in compared rows
          count_diff += input[i - j].split('').filter((char, index) => char !== input[i + 1 + j][index]).length;

        //if differences == 0 (part 1), or == 1 (part 2), increment result by multiplying the row index + 1 by 1 if it's a transposed map, or by 100 if not transposed
        if (count_diff == p2_bool) return p2_bool ? answer_p2 += (i + 1) * multiplier : answer_p1 += (i + 1) * multiplier;
      }
      //no symmetry|smudged symmetry found in this map or transposed map
      return
    }
  }
  //return result
  return p2_bool ? answer_p2 : answer_p1;
}

console.log("Part 1 answer: " + solve(false));
console.log("Part 2 answer: " + solve(true));
