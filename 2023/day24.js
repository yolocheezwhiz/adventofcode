//RUN FROM adventofcode.com
const headers = new Headers({
  "User-Agent": "github.com/yolocheezwhiz/adventofcode/"
});
//cache puzzle input
const day = "2023/day/24";
localStorage[day] = localStorage[day] || (await (await fetch("https://adventofcode.com/" + day + "/input", {
  headers: headers
})).text()).trim();
let inputs = localStorage[day].split('\n');
let bean = 0;
let shared_vxs = [];
let shared_vys = [];
let shared_vzs = [];
let vx;
let vy;
let vz;

//thanks google
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  var ua, ub, denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom == 0) return null;
  ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1)
  };
}

//compare lines to one another
for (let i = 0; i < inputs.length; i++) {
  //always start j > 1 to avoid double - counting and evaluating a line to itself
  for (let j = i + 1; j < inputs.length; j++) {
    let line1 = inputs[i].split(/, | @ /g);
    let line2 = inputs[j].split(/, | @ /g);
    //get a x pos  
    let x1 = +line1[0];
    //get its next pos by adding velocity  
    let x2 = +line1[3] + x1;
    //do the same for the next line  
    let x3 = +line2[0];
    let x4 = +line2[3] + x3;
    //do the same for the y axis  
    let y1 = +line1[1];
    let y2 = +line1[4] + y1;
    let y3 = +line2[1];
    let y4 = +line2[4] + y3;
    //compute intersection  
    let intersection = intersect(x1, y1, x2, y2, x3, y3, x4, y4);
    if (intersection) {
      let x = intersection.x;
      let y = intersection.y;
      //check event happens in the future    
      if (x > x1 == x2 - x1 > 0 && y > y1 == y2 - y1 > 0 && x > x3 == x4 - x3 > 0 && y > y3 == y4 - y3 > 0 &&
        //check intersection is in bound
        x >= 2e14 && x <= 4e14 && y >= 2e14 && y <= 4e14) bean++
    }

    //added for p2  
    let z1 = +line1[2];
    let z2 = +line1[5] + y1;
    let z3 = +line2[2];
    let z4 = +line2[5] + y3;
    
    //extract velocities for p2  
    let vx_l1 = +line1[3];
    let vx_l2 = +line2[3];
    let vy_l1 = +line1[4];
    let vy_l2 = +line2[4];
    let vz_l1 = +line1[5];
    let vz_l2 = +line2[5];
    
    //when a line shares the velocity with another, save the velocity and the diff between the 2 pos
    if (vx_l1 == vx_l2) shared_vxs.push([vx_l1, x1 - x3, line1, line2]);
    if (vy_l1 == vy_l2) shared_vys.push([vy_l1, y1 - y3]);
    if (vz_l1 == vz_l2) shared_vzs.push([vz_l1, z1 - z3]);
  }
}
console.log("answer part 1: " + bean);

//part 2
//sort by absolute smaller integers first
function sort(arr){
return arr.sort((a, b) => {
  return Math.abs(a[1]) - Math.abs(b[1]);
});
}
let sorted_x = sort(shared_vxs);
let sorted_y = sort(shared_vys);
let sorted_z = sort(shared_vzs);

/*
 * here the logic is that, for a given common velocity (e.g. 3) for different pos (e.g. 8 vs 11)
 * there are only a few velocities that will ensure we cross both lines
 * here, the diff between 8 and 11 is 3. The factors of 3 are 1,3
 * the diff between 11 and 8 is -3, The factors are -1,-3
 * factors are -3,-1,1,3
 * if we add the velocity to each, we get 0,2,4,6
 * these are the potential velocities of our rock. Proof:
 * starting at 8,11 (we touch 8)
 * <4: => we never catch up to 11
 * +4: => 11,14 (we are at 12) => 14,17 (we are at 16) => 17,20 (we touch at 20)
 * +5: => 11,14 (we are at 13) => 14,17 (we passed past it at 18)
 * +6: => 11,14 (we touch 14) 
 * >6: => 11,14 (we passed past it at 15)
 * starting at 8,11 (we touch 11)
 * >2: => 11,14 (we are at 14, 8 never catches up to us)
 * +2: => 11,14 (we are at 13), 14,17 (we are at 15) => 17,20 (we touch at 17)
 * +1: => 11,14 (we are at 12), 14,17 (we are at 13, 8 passed past us)
 * +0: => 11,14 (we touch at 11)
 * <0: => 11,14 (we are at 10, 8 passed past us)
 * valid velocities: 0,2,4,6
 * if we repeat the process for each rock, we will find a common velocity
 * if we repeat for all 3 axes, we have the rock trajectory
 * but calculating factors of huge numbers is a slow process
 * so we COULD calculate the potential velocities of the first rock, and then checking only these for subsequent rocks
 * but we'll still have a slow first x, first y & first z calc
 * instead, each time a potential velocity is found, we check right away if it is present in all rocks or not
 * as soon as we find one, we break out of the loop
 */

function find_factors(velocity, diff, dir) {
  let factor;
  for (let i = 1; i <= Math.abs(diff) / 2; i++) {
  
    //we found a potential velocity, check if it is found in ALL other lines
    factor = i + velocity;
    if (validate_factor(factor, dir)) return (velocity > 0 ? 1 : -1) * factor;
    factor = -i + velocity;
    if (validate_factor(factor, dir)) return (velocity > 0 ? 1 : -1) * factor;
  }
  
  //we never make it there, but technically...
  //add the diff itself as a potential factor  
  factor = Math.abs(diff) + velocity;
  if (validate_factor(factor, dir)) return (velocity > 0 ? 1 : -1) * factor;
  factor = -Math.abs(diff) + velocity;
  if (validate_factor(factor, dir)) return (velocity > 0 ? 1 : -1) * factor;
}

function validate_factor(factor, dir) {

  //check with axis we're currently looking at
  const sorted_vs = dir === 'x' ? sorted_x : dir === 'y' ? sorted_y : sorted_z;
  
  //check all lines to see if this velocity could make sense
  for (let i = 1; i < sorted_vs.length; i++)
    if (!((factor + sorted_vs[i][0] <= Math.abs(sorted_vs[i][1]) &&
          Math.abs(sorted_vs[i][1]) % (factor + sorted_vs[i][0]) === 0) ||
        (factor - sorted_vs[i][0] <= Math.abs(sorted_vs[i][1]) &&
          Math.abs(sorted_vs[i][1]) % (factor - sorted_vs[i][0]) === 0)))
          
      //cancel if a line doesn't share this potential velocity
      return false;

  //great success!
  return true;
}

//find trajectories
vx = find_factors(sorted_x[0][0], sorted_x[0][1], "x");
vy = find_factors(sorted_y[0][0], sorted_y[0][1], "y");
vz = find_factors(sorted_z[0][0], sorted_z[0][1], "z");

//now to find which pos to start from. We will only need a couple of lines for this.
//let's use 2 lines where vx is the same
let l1 = sorted_x[0][2];
let l2 = sorted_x[0][3];

//get the y pos, velocities
let y1 = +l1[1];
let vy1 = +l1[4];
let y2 = +l2[1];
let vy2 = +l2[4];

//get x distance between lines
let dist_x = l1[0]-l2[0];

//calc the # of epochs between them 
//let's reuse the example above. Suppose the x velocity is 4, rocks velocity is 3, and dist between them is 3 (8,11)
//this means that it'll take us 3 epochs to reach stone 2 after we reach stone 1
let e = dist_x/(l1[3]-vx);

//we calculated earlier our rock velocities, so the y distance to travel after reach rock 1 will be epochs * vy
let dist_y = e * vy;

//suppose we reach rock 1 after N nanoseconds, the y pos will be: y1 + (N * vy1)
//and then to reach rock 2, the y pos will be: y2 + (N + e) * vy2
//and we need the distance between the two to be dist_y
//all of this can be expressed as (y2 + (N + e) * vy2) - (y1 + N * vy1) = dist_y
//let's isolate N
let N = (y2-y1-dist_y + e*vy2)/(vy1-vy2);

//we now know how many nanoseconds it took to reach the first rock
//we calculate that rock's position at N, which is our rock's position too
let x1 = +l1[0];
let vx1 = +l1[3];
let z1 = +l1[2];
let vz1 = +l1[5];
let pos_at_N = [x1 + N * vx1, y1 + N * vy1, z1 + N * vz1];

//lastly, we go back N times using our rock's velocities to find its origin
let og_pos = [pos_at_N[0] - (N * vx),  pos_at_N[1] - (N * vy), pos_at_N[2] - (N * vz)];
console.log("og position: ", og_pos);
console.log("answer_p2: ", og_pos[0]+og_pos[1]+og_pos[2]);
