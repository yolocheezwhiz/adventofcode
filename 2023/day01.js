//RUN in dev console from adventofcode.com/2023
const response = await fetch("https://adventofcode.com/2023/day/1/input");
const txt = await response.text();
const inputs = txt.trim().split("\n");

//PART 1
function part1() {

  let total = 0;
  
  //iterate over each line
  inputs.forEach(input => {
    let digit1, digit2;

    //check each char individually
    for (var x of input) {
    
      //if char is a number and digit1 doesn't yet exist (this will act as "first index of")
      if (!isNaN(x) && !digit1) digit1 = x;
      
      //if char is a number (this will act as "last index of")
      if (!isNaN(x)) digit2 = x;
    }
    
    //sum up results per input
    total += Number(digit1.concat(digit2));
  });
  return total
}

//PART 2
function part2() {
  let total = 0;
  
  //iterate over each line
  inputs.forEach(input => {

    let best_low = 9999;
    let best_high = -1;
    let best_low_val;
    let best_high_val;

    //embed func in loop to simplify args passing and skip return logic
    //dirty but it works
    function crunch(val_int, val_str) {
      let w = input.indexOf(val_int);
      let x = input.indexOf(val_str);
      let y = input.lastIndexOf(val_int);
      let z = input.lastIndexOf(val_str);
      
      //if value is > -1 (is found) and lower than current lowest index, set as best pos and val to date
      if (w > -1 && w < best_low) {
        best_low = w;
        best_low_val = val_int;
      }
      //same but set the val as int instead of keeping its stringified val 
      if (x > -1 && x < best_low) {
        best_low = x;
        best_low_val = val_int;
      }
      
      //same as the two ifs above, but checks for highest vals
      if (y > -1 && y > best_high) {
        best_high = y;
        best_high_val = val_int;
      }
      if (z > -1 && z > best_high) {
        best_high = z;
        best_high_val = val_int;
      }
    }
    crunch("1", "one");
    crunch("2", "two");
    crunch("3", "three");
    crunch("4", "four");
    crunch("5", "five");
    crunch("6", "six");
    crunch("7", "seven");
    crunch("8", "eight");
    crunch("9", "nine");
    total += Number(best_low_val.concat(best_high_val));
  });
  return total
}

//print results
console.log(part1());
console.log(part2());
