//RUN FROM adventofcode.com
const headers = new Headers({
  "User-Agent": "github.com/yolocheezwhiz/adventofcode/"
});
//cache puzzle input
const day = "2023/day/20";
localStorage[day] = localStorage[day] || (await (await fetch("https://adventofcode.com/" + day + "/input", {
  headers: headers
})).text()).trim();
let inputs = localStorage[day].split('\n');
let inputs_clone = [...inputs];
let prefixes = [];
let modules = [];
let modules_memory = {};
let to_modules = [];
inputs_clone.forEach((el, i) => {
  prefixes.push(el.substring(0, 1));
  //remove module prefixes
  inputs_clone[i] = el.replace(/&|%/, "");
  //get source module names
  modules.push(inputs_clone[i].split(" ")[0]);
  //get destination modules arrays
  to_modules.push((inputs_clone[i]).split(" -> ")[1].split(", "));
});
//let's build an object of modules memory
for (let i in modules) {
  //single mem
  if (prefixes[i].match(/b|%/)) modules_memory[modules[i]] = "low";
  else {
    //per source mem
    modules_memory[modules[i]] = {};
    for (let j in to_modules)
      if (to_modules[j].includes(modules[i])) modules_memory[modules[i]][modules[j]] = "low";
  }
}
//part 2
//find the source sending pulses to rx
let rx_source;
for (let line of inputs_clone)
  if (line.match(/rx/)) rx_source = line.substring(0, 2);
//set the source's sources
let sources = {
  ...modules_memory[rx_source]
};
//set sources as arrays
for (let i in sources) sources[i] = [];
//back to part 1
//this problem is basically is a BFS (Pulses are always processed in the order they are sent.) in a for loop (press the button N times)
//p1 beancounters
let low = 0;
let high = 0;
//check if a Conjunction's memories are all set to high
function all_high_mem(mod_mem) {
  for (let key in mod_mem)
    if (mod_mem[key] != "high") return "high";
  return "low";
}
//main
function press_button(i) {
  //We use a queue for BFS 
  //We pass the source + destination node + signal sent, as the sender's module memory might change after we send the signal but before we process it
  let queue = [
    ["button", "broadcaster", "low"]
  ];
  //aim at emptying the queue
  while (queue.length > 0) {
    //get first queue element and parse it
    let signal = queue.shift();
    let source = signal[0];
    let module = signal[1];
    //account for when prefix doesn't exist (rx)
    let prefix = prefixes[modules.indexOf(module)] || "";
    let strength = signal[2];
    let index = modules.indexOf(module);
    //account for when targets don't exist (rx)
    let targets = to_modules[index] || [];
    //part 2 - we check when signal to rx_source is high
    if (module == rx_source && strength == "high") {
      //log cycle number (+1 to account for starting at zero) for that source
      sources[source].push(i + 1);
    }
    //count beans
    strength == "low" ? low++ : high++;
    //change memory as required
    //switch when signal is low
    if (prefix == "%" && strength == "low") modules_memory[module] = modules_memory[module] == "low" ? "high" : "low";
    //log signal received
    if (prefix == "&") modules_memory[module][source] = strength;
    //determine the signal to send
    let emit = prefix.match(/b|%/) ? modules_memory[module] : all_high_mem(modules_memory[module]);
    //PULSE OUT!
    for (let target of targets)
      //unless prefix is & and strength is high
      if (!(prefix == "%" && strength == "high")) queue.push([module, target, emit]);
  }
}
//loop to infinity (yolo) for part 2 instead of 1000
for (let i = 0; i < Infinity; i++) {
  //part 2
  let lcm_nums = [];
  //we want to validate a pattern in high signal, per source
  for (let source in sources) {
    //not enough data to establish pattern
    if (sources[source].length < 2) break;
    //if a pattern is detected (repeats after N cycles)
    else if (sources[source][sources[source].length - 1] - sources[source][sources[source].length - 2] == sources[source][sources[source].length - 2] - (sources[source][sources[source].length - 3] || 0))
      //we log the pattern length + the offset || 0
      //e.g. if pattern is 8, 16, 24. pattern is 8, ezpz
      //if pattern is 3, 11, 19, 27. pattern is still 8, plus the offset of 3
      //(not perfect but I think it's good enough for this puzzle)
      //diff between last and 2nd to last value
      lcm_nums.push(sources[source][sources[source].length - 1] - sources[source][sources[source].length - 2] +
        //add offset or zero
        (sources[source][sources[source].length - 3] || 0));
  }
  //we have a pattern for each source, calc LCM
  if (lcm_nums.length == Object.keys(sources).length) {
    const lcm = (...arr) => {
      const gcd = (x, y) => (!y ? x : gcd(y, x % y));
      const _lcm = (x, y) => (x * y) / gcd(x, y);
      return [...arr].reduce((a, b) => _lcm(a, b));
    };
    //we're done, exit endless loop
    console.log("part 2 answer: " + lcm(...lcm_nums));
    break;
  }
  if (i == 1000) console.log("part 1 answer: " + (low * high));
  press_button(i);
}
