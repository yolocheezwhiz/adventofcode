//RUN FROM adventofcode.com
let response = await fetch("https://adventofcode.com/2023/day/14/input");
let txt = await response.text();
let inputs = txt.trim().split("\n");
let pattern = [];
let p1_bool = true;

function where_to(map, direction) {
  let load = 0;

  //crunch rows top down else bottom up
  for (let y = (direction == "up" ? 0 : map.length - 1);
    (direction == "up" ? y < map.length : y >= 0);
    (direction == "up" ? y++ : y--)) {

    //crunch columns left to right else right to left
    for (let x = (direction == "left" ? 0 : map[y].length - 1);
      (direction == "left" ? x < map[y].length : x >= 0);
      (direction == "left" ? x++ : x--)) {

      //recursively move boulders on the map
      (function move(y, x) {
        let _y, _x;

        //move depends on direction
        switch (direction) {
          case "up":
            _y = y - 1;
            _x = x;
            break;
          case "down":
            _y = y + 1;
            _x = x;
            break;
          case "left":
            _y = y;
            _x = x - 1;
            break;
          case "right":
            _y = y;
            _x = x + 1;
            break;
          default:
            throw new Error("Invalid direction");
        }

        // check if the new position is within bounds and that the position is currently a boulder with an empty space adjacent to it
        if (_y >= 0 && _y < map.length && _x >= 0 && _x < map[y].length && map[y][x] == "O" && map[_y][_x] == ".") {

          // swap boulder to empty space
          map[y] = map[y].substring(0, x) + "." + map[y].substring(x + 1);
          map[_y] = map[_y].substring(0, _x) + "O" + map[_y].substring(_x + 1);

          // go to the object's new position, see if it needs to be moved further
          move(_y, _x);
        }
        //return to the loop to find next boulder
        return;
      })(y, x);
    }
  }

  //once the direction is completed, compute load if part 1, or after going right (part 2)
  if (p1_bool || direction == "right")
    for (let i = 0, multiplier = 1; i < map.length; i++, multiplier++) {
      load += (map[map.length - 1 - i].match(/O/g) || []).length * multiplier;
    }

  //return load, and mutated map
  return [map, load];
}

console.log("Part 1 answer: " + where_to(inputs, "up")[1]);

p1_bool = false;
let u, l, d;
let answer;

//the loop uses the map from previous direction. set u's "previous" direction to OG inputs
let r = [inputs];

let i = 0

while (true) {
  i++;
  u = where_to(r[0], "up");
  l = where_to(u[0], "left");
  d = where_to(l[0], "down");
  r = where_to(d[0], "right");

  //stringify map after a full cycle, append load
  let str_map = r[0].join("\n") + "_" + r[1].toString();

  //check if the map pattern repeats
  if (pattern.includes(str_map)) {
    answer = [pattern.indexOf(str_map), pattern.length];
    break;
  }

  //keep track of the stringified map, and load
  else pattern.push(str_map);
}

//now that we know when the pattern starts repeating, we need to figure out what will be the pattern at index 999 999 999
let repeats_from = answer[0];
let cycle_length = answer[1] - repeats_from;
let modulo = (999999999 - repeats_from) % cycle_length;

//extract back load from stringified map at the right index
let p2_answer = +pattern[repeats_from + modulo].split("_")[1];
console.log("Part 2 answer: " + p2_answer);
