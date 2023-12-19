//RUN FROM adventofcode.com
const headers = new Headers({
  "User-Agent": "github.com/yolocheezwhiz/adventofcode/"
});
//cache puzzle input
const day = "2023/day/19";
localStorage[day] = localStorage[day] || (await (await fetch("https://adventofcode.com/" + day + "/input", {
  headers: headers
})).text()).trim();
let inputs = localStorage[day].split('\n');
let answer_p1 = 0;
let answer_p2 = 0;
//we're gonna build an object of function calls
const workflow = {};
//split input where workflows end and where parts begin
const len = inputs.indexOf("");
//for part 2 - Ensure we'll evaluate until 4000
const ranges = {
  x: [4000],
  m: [4000],
  a: [4000],
  s: [4000]
};
//for part 2 before mutating inputs during part 1
for (let i = 0; i < len; i++) {
  //get function elements
  let split = inputs[i].split("{")[1].split("}")[0].split(/:|,/);
  for (let el of split)
    //find bool evaluations
    if (el.match(/(<|>)/)) {
      //log numbers (ranges) to look for, for x,m,a & s
      //if "<" decrement by 1 
      ranges[el.substring(0, 1)].push(+el.substring(2) + (el.substring(1, 2) == ">" ? 0 : -1));
    }
}
//for part 2 - remove duplicates and order arrays
const x = [...new Set(ranges.x)].sort((a, b) => a - b);
const m = [...new Set(ranges.m)].sort((a, b) => a - b);
const a = [...new Set(ranges.a)].sort((a, b) => a - b);
const s = [...new Set(ranges.s)].sort((a, b) => a - b);
//for each workflow
for (let i = 0; i < len; i++) {
  //get function name
  const func_name = inputs[i].split("{")[0];
  //replace that func_name in every workflow
  //avoid partial matches by ensuring the func_name is not immediately preceeded or followed by an alphabetic character 
  const reg = new RegExp("(?<![a-z])" + func_name + "(?![a-z])");
  //avoid modifying the function name at the beginning of the string
  for (let j = 0; j < len; j++) inputs[j] = inputs[j].split("{")[0] + "{" + inputs[j].split("{")[1].replace(reg, "workflow." + func_name + "(xmas)");
}
//we loop again, this time to build workflow functions
for (let i = 0; i < len; i++) {
  //get function name
  const func_name = inputs[i].split("{")[0];
  //build functions with ternary logic from workflows
  workflow[func_name] = new Function("x", "m", "a", "s", inputs[i]
    .replaceAll(":", "?")
    .replaceAll(",", ":")
    .replace("}", ";")
    .replace(/.*{/, "return ")
    .replaceAll("A", "x+m+a+s")
    .replaceAll("R", "0")
    .replaceAll("xmas", "x,m,a,s"));
}
//process each part
for (let i = len + 1; i < inputs.length; i++) {
  const xmas = inputs[i].replace("{x=", "").replace("m=", "").replace("a=", "").replace("s=", "").replace("}", "").split(",");
  answer_p1 += workflow.in(+xmas[0], +xmas[1], +xmas[2], +xmas[3]);
}
console.log("part 1 answer: " + answer_p1);

/* for part 2, let's just find value ranges. E.g.
 * x>4
 * x<12
 * x>7
 * ranges will be 1-4, 5-7, 8-11, 12-4000
 * expressed as [4,7,11,4000] (see lines 17-40 above)
 * what this means is for the same m,a,s values, x=5, x=6, x=7 will return the same A or R answer
 * we can then pass a single value (e.g. x=7) and count its result <range.length> times
 */
//beancounters
let log = x.length * m.length * a.length * s.length;
let bean = 0;
for (let i = 0; i < x.length; i++)
  for (let j = 0; j < m.length; j++)
    for (let k = 0; k < a.length; k++)
      for (let l = 0; l < s.length; l++, bean++) {
        /* we try every number in the range, if it passes, we check the diff with the previous num (or use the num if it's the first in the array), 
         * and multiply together
         * e.g suppose we compare 245 (previous num 243), 14 (first num in array), 150 (previous num 140), 3333 (previous num 3332)
         * if it passes the validations, we return ((245-243) * 14 * (150-140) * (3333-3332))
         * 2 * 14 * 10 * 1 = 280
         * which represents the range of values that pass this test
         */
        if (workflow.in(x[i], m[j], a[k], s[l]) > 0) answer_p2 += (x[i] - x[i - 1] || x[i]) * (m[j] - m[j - 1] || m[j]) * (a[k] - a[k - 1] || a[k]) * (s[l] - s[l - 1] || s[l]);
        //beancounting prints
        if (bean % 50000000 == 0) console.log(bean / 1000000 + "M/" + log / 1000000 + "M processed");
      }
console.log("part 1 answer: " + answer_p1);
console.log("part 2 answer: " + answer_p2);
/*
 * we could've made this much faster by computing ranges of ranges (e.g. x[1...8] && m[23...112] && a[77...79] && s[444...467] returns true)
 * but let's not over-engineer this. Holiday brain is Holiday
 */
