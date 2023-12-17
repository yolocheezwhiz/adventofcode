//RUN FROM adventofcode.com
let inputs = (await (await fetch("https://adventofcode.com/2023/day/6/input")).text()).trim().split("\n");
let t = inputs[0].split(":")[1].split(/\s+/).filter(Boolean).map(Number);
let d = inputs[1].split(":")[1].split(/\s+/).filter(Boolean).map(Number);

//answer
let a = 1;

//loop through inputs
for (let i = 0, l = 0; i < t.length; i++, l = 0) {
  //press the button 1ms more each time
  for (let j = t[i], k = 0; k < t[i]; k++) {
    //since pressing the button increments speed by 1 for each 1ms pressed, the calc is simple
    //(total_time - time_pressed) * time_pressed_meaning_speed
    //verify that it's greater than record
    if ((t[i] - k) * k > d[i]) l++;
  }
  a *= l;
}
console.log("part 1 answer: " + a);

//part 2
//exact same thing but the the numbers joined
a = 1;
t = [+t.join("")];
d = [+d.join("")];

for (let i = 0, l = 0; i < t.length; i++, l = 0) {
  for (let j = t[i], k = 0; k < t[i]; k++) {
    if ((t[i] - k) * k > d[i]) l++;
  }
  a *= l;
}
console.log("part 2 answer: " + a);
