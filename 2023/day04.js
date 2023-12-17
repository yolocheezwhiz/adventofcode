//RUN FROM adventofcode.com
let response = await fetch("https://adventofcode.com/2023/day/4/input");
let txt = await response.text();
let inputs = txt.trim().split("\n");

//Don't fuck up like yesterday. Ensure each part has a diff answer var
let answer_p1 = 0;
let answer_p2 = 0;

//for part 2 - [amount of cards, winning_nums]
let cards = [];

function part1() {
  inputs.forEach(input => {
  
    //build arrays
    let my_nums = [];
    let winning_nums = [];
    for (var i = 0; i < 10; i++) my_nums.push(input.substr(10 + i * 3, 2).trim());
    for (var i = 0; i < 25; i++) winning_nums.push(input.substr(42 + i * 3, 2).trim());
    //I'm lazy
    let value = 0.5;
    //for part 2
    let matches = 0;
    //multiply if true
    my_nums.forEach(num => {
      if (winning_nums.includes(num)) {
        value *= 2;
        matches++;
      }
    });
    cards.push([1, matches]);
    
    //I'm smart
    answer_p1 += Math.floor(value);
  });

  return answer_p1;
}

function part2() {
  let something = 0;
  //for each card
  for (var i = 0; i < cards.length; i++) {
    //add current card_amount to answer
    answer_p2 += cards[i][0];

    //distribute winnings to next cards
    for (var j = 1; j <= cards[i][1]; j++) {
      cards[i + j][0] = cards[i + j][0] + 1 * cards[i][0];
    }
  }
  return answer_p2;
}

console.log(part1());
console.log(part2());
