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

let bean = 0;
for (let i = 0; i < inputs.length; i++) {
  for (let j = i + 1; j < inputs.length; j++) {
    let line1 = inputs[i].split(/, | @ /g);
    let line2 = inputs[j].split(/, | @ /g);
    let x1 = +line1[0];
    let x2 = +line1[3] + x1;
    let x3 = +line2[0];
    let x4 = +line2[3] + x3;
    let y1 = +line1[1];
    let y2 = +line1[4] + y1;
    let y3 = +line2[1];
    let y4 = +line2[4] + y3;
    let intersection = intersect(x1, y1, x2, y2, x3, y3, x4, y4);
    if(intersection){  
    let x = intersection['x'];
    let y = intersection['y'];
    //check event happens in the future    
    if (x > x1 == x2-x1 > 0 && y > y1 == y2-y1 > 0 && x > x3 == x4-x3 > 0 && y > y3 == y4-y3 > 0 && 
        //check intersection is in bound
        x >= 200000000000000 && x <= 400000000000000 && y >= 200000000000000 && y <= 400000000000000) bean++
    }
  }
}
console.log("answer part 1: " + bean);
