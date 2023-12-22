//RUN FROM adventofcode.com
const headers = new Headers({
  "User-Agent": "github.com/yolocheezwhiz/adventofcode/"
});

//cache puzzle input
const day = "2023/day/22";
localStorage[day] = localStorage[day] || (await (await fetch("https://adventofcode.com/" + day + "/input", {
  headers: headers
})).text()).trim();
let inputs = localStorage[day].split('\n');
let no_zap_pls = new Set();
let stacked_clone;
let answer_p2 = 0;

//sort array by lowest z
let bricks = inputs.sort((a, b) => {
  return Math.min(+a.split(",").slice(-1), +a.split("~")[0].split(",")[2]) -
    Math.min(+b.split(",").slice(-1), +b.split("~")[0].split(",")[2]);
});

//build a function for part 2, and move all variables (or almost) in it
function drop_bricks(bricks) {
  let spl = [];
  let left = [];
  let right = [];
  let minx = 0;
  let miny = 0;
  let maxx = 0;
  let maxy = 0;
  let xy_lowest = {};
  let stacked = {};
  //split rows in left/right and side arguments
  for (let i in bricks) {
    spl.push(bricks[i].split("~"));
    left.push(spl[i][0].split(","));
    right.push(spl[i][1].split(","));

    //set bricks has not having fallen yet, and not sitting on anything
    stacked[bricks[i]] = {
      drop: 0,
      sitting_on: []
    };

    //convert values to integers
    for (let j in left[i]) left[i][j] = +left[i][j], right[i][j] = +right[i][j];

    //get min/max of x and y
    minx = Math.min(minx, left[i][0], right[i][0]);
    miny = Math.min(miny, left[i][1], right[i][1]);
    maxx = Math.max(maxx, left[i][0], right[i][0]);
    maxy = Math.max(maxy, left[i][1], right[i][1]);
  }

  //build an object of current lowest value of each x,y pos, and what it will be occupied by
  for (let x = minx; x <= maxx; x++) {
    for (let y = miny; y <= maxy; y++) {
      xy_lowest[x + "," + y] = {
        brick: null,
        height: 0,
      };
    }
  }

  //for each brick
  for (let i = 0; i < bricks.length; i++) {

    //right-hand side is always bigger than left-hand side
    //console.log(right[i][0]-left[i][0],right[i][1]-left[i][1],right[i][2]-left[i][2]);
    //get all x,y coordinates of the brick, z as standalones
    let coords = [];
    for (let x = left[i][0]; x <= right[i][0]; x++)
      for (let y = left[i][1]; y <= right[i][1]; y++)
        for (let z = left[i][2]; z <= right[i][2]; z++) coords.push([x + "," + y, z]);

    //dropping bricks!   
    let drop = 0;
    while (true) {
      let brk;

      //if any z is touching something below
      for (let j = 0; j < coords.length; j++) {

        if (coords[j][1] + drop - 1 == xy_lowest[coords[j][0]].height) {

          //stop trying to drop brick
          brk = true;

          //check and set what it is sitting on, and how much the brick dropped (feels like it could be useful for part2)
          stacked[bricks[i]].drop = drop;
          let to_push = xy_lowest[coords[j][0]].brick || "floor";
          if (!stacked[bricks[i]].sitting_on.includes(to_push)) stacked[bricks[i]].sitting_on.push(xy_lowest[coords[j][0]].brick || "floor");
        }
      }

      //set xy_lowest for all pos and break
      if (brk) {
        for (let j = 0; j < coords.length; j++) {
          xy_lowest[coords[j][0]].brick = bricks[i];
          xy_lowest[coords[j][0]].height = coords[j][1] + drop;
        }
        break;
      }

      //else, drop brick by 1 and try again
      drop--;
    }
  }

  //part 2 - count bricks that dropped
  let drop_count = 0;

  //if a brick is sitting on a single brick, that single brick cannot be safely zapped
  for (let i in stacked) {
    if (stacked[i].sitting_on.length == 1 && stacked[i].sitting_on[0] != "floor") no_zap_pls.add(stacked[i].sitting_on[0]);
    if (stacked[i].drop < 0) drop_count++;
  }
  //need to keep for part 2
  stacked_clone = {
    ...stacked
  };
  return drop_count;
}
drop_bricks(bricks);
console.log("part 1 answer: " + (inputs.length - no_zap_pls.size));

//part 2
//rebuild the bricks object with new z coordinates
let clone = [];
for (let brick of bricks) {
  let spl = brick.split("~");
  let left = spl[0].split(",");
  let right = spl[1].split(",");
  clone.push(left[0] + "," + left[1] + "," + (+left[2] + stacked_clone[brick].drop) + "~" + right[0] + "," + right[1] + "," + (+right[2] + stacked_clone[brick].drop));
}

//for each brick we're NOT supposed to zap remove it
for (let brick of no_zap_pls) {
  let bricks_clone = [...clone];
  bricks_clone.splice(bricks_clone.indexOf(brick), 1);

  //check how many bricks dropped
  answer_p2 += drop_bricks(bricks_clone);
}
console.log("part 2 answer: " + answer_p2);
