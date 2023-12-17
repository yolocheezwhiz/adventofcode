//RUN FROM adventofcode.com/2023
let response = await fetch("https://adventofcode.com/2023/day/9/input");
let txt = await response.text();
let inputs = txt.trim().split("\n");
let answer_p1 = 0;
let answer_p2 = 0;

//recursively reduce the array by calculating the diff between each values
function red(arr, reduced) {
  let brake = true;
  let diff = [];
  for (let i in arr) {
    //can't compare first value to undefined
    if (i > 0) {
      //calc diff
      let x = arr[i] - arr[i - 1];
      //if any diff != 0, we'll need to recurse
      if (x != 0) brake = false;
      //create new arr with diffs
      diff.push(x);
    }
  }
  //build a nested array of diffs (plus original input)
  reduced.push(diff);
  //recurse until true (last array is only zeros)
  return brake ? reduced : red(diff, reduced);
}

function proc(is_part_1) {
  //check each line
  for (let input of inputs) {
    //split into individual values
    let history = input.split(" ");
    //convert values from strings to numbers
    for (let i in history) history[i] = +history[i];
    //build nested array of diffs
    //it'll be easy to forget to include the original array in the final computation. 
    //consequently, we add it here, not just as a param to eval, but as the final result to process after the recursion.
    let result = red(history, [history]);
    //we now have a nested array representing the original array and its recursed arrays of diffs
    let num_agg = 0;
    //loop to crawl back up the nested array until we emptied it
    while (true) {
      //remove the last nested array
      let arr = result.pop();
      //take the first or last value of this array
      let num = arr[is_part_1 ? "pop" : "shift"]();
      //in part two, we need to substract current aggregated val instead of adding it
      num_agg = num + (is_part_1 ? num_agg : -num_agg);
      //we emptied the array
      if (result.length == 0) break;
    }
    //add line's answer to part's answer
    if (is_part_1) answer_p1 += num_agg;
    else answer_p2 += num_agg;
  }
  //we return the final value
  return "part " + (is_part_1 ? 1 : 2) + " answer: " + (is_part_1 ? answer_p1 : answer_p2);
}
//part 1
console.log(proc(true));
//part 2
console.log(proc(false));
