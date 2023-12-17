//RUN FROM adventofcode.com/2023
let response = await fetch("https://adventofcode.com/2023/day/2/input");
let txt = await response.text();
let inputs = txt.trim().split("\n");
let answer = 0;
let red = 12;
let green = 13;
let blue = 14;

//PART 1
function part1() {
  inputs.forEach(x => {
    let is_possible = true;

    //puzzle is simple, let's just split on spaces
    let y = x.split(' ');
    
    //no need to start at zero
    for (let i = 3; i < y.length; i++) {
      
      // if a split contains <color>, check if the qty (previous number) is greater than <color_qty>
      if (y[i].match(/^red/g) && Number(y[i - 1]) > red) {
        is_possible = false;
        break;
      } else if (y[i].match(/^green/g) && Number(y[i - 1]) > green) {
        is_possible = false;
        break;
      } else if (y[i].match(/^blue/g) && Number(y[i - 1]) > blue) {
        is_possible = false;
        break;
      }
    }
    
    //add game num to answer
    answer += is_possible ? Number(y[1].split(':')[0]) : 0;
  });
  return answer;
}


//PART 2
function part2() {
  answer = 0;
  inputs.forEach(x => {
    let red = 0;
    let green = 0;
    let blue = 0;
    
    //puzzle is still simple, let's just split on spaces
    let y = x.split(' ');
    
    //no need to start at zero
    for (let i = 3; i < y.length; i++) {
      
      //I'm lazy
      let temp = Number(y[i - 1]);
      
      //find highest value of each (which is the lowest possible count needed per game)
      if (y[i].match(/^red/g)) red = red > temp ? red : temp;
      else if (y[i].match(/^green/g)) green = green > temp ? green : temp;
      else if (y[i].match(/^blue/g)) blue = blue > temp ? blue : temp;
    }
    
    //add power to sum
    answer += red * green * blue;
  });
  return answer;
}

//print results
console.log(part1());
console.log(part2());
