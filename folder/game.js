//Calling it this because it will be main game JS thing?

var player = {
  money: 10, //current errors
  mps: 0, //errors per second
  firstCost: 10,
  secondCost: 100,
  thirdCost: 1000,
  firstAmount: 0,
  secondAmount: 0,
  thirdAmount: 0,
  firstClicked: false,
  secondClicked: false,
  thirdClicked: false,
}
const TIER_NAMES = ['first','second','third']; // can add more if more gens/story elements, cuz that uses this too


function buyGen(tier) {
  var level = TIER_NAMES[tier];
  if (player.money - player[level + "Cost"] >= 0) {
    player[level + "Amount"] ++;
    player.money -= player[level + "Cost"];
  }
}

function createStoryElement(message) {
  var second = JSON.stringify(TIER_NAMES[1] + "Message");
  var first = JSON.stringify(TIER_NAMES[0] + "Message");
  
  document.getElementById("firstMessage").innerHTML = message;
  document.getElementById("secondMessage").innerHTML = first;
  // YOU HAVE TO MANUALLY ADD MORE THINGS HERE IF YOU HAVE MORE MAX MESSAGES SHOWING AT ONCE
}

document.getElementById('gen1').onclick = function() {
  buyGen(0);
  if (player.firstClicked == false) {
    createStoryElement("You open up a browser to play games, but errors start entering the console.");
    player.firstClicked = true;
  }
}

document.getElementById('gen2').onclick = function() {
  buyGen(1);
  if (player.secondClicked == false) {
    createStoryElement("second thing");
    player.secondClicked = true;
  }
}

document.getElementById('gen3').onclick = function() {
  buyGen(2);
}
