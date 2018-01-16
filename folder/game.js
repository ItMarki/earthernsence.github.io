//Calling it this because it will be main game JS thing?

var player = {
  errors: 10, //current errors
  eps: 0, //errors per second
  firstCost: 10,
  secondCost: 100,
  thirdCost: 1000,
  fourthCost: 10000, //prices adjustable
  firstAmount: 0,
  secondAmount: 0,
  thirdAmount: 0,
  fourthAmount: 0,
  firstClicked: false,
  secondClicked: false,
  thirdClicked: false,
  fourthClicked: false,
}
const TIER_NAMES = ['first','second','third', 'fourth']; // can add more if more gens/story elements, cuz that uses this too


function buyGen(tier) {
  var level = TIER_NAMES[tier];
  if (player.errors - player[level + "Cost"] >= 0) {
    player[level + "Amount"] ++;
    player.errors -= player[level + "Cost"];
  }
}

function createStoryElement(message) {
  var second = JSON.stringify(TIER_NAMES[1] + "Message");
  var first = JSON.stringify(TIER_NAMES[0] + "Message");
  
  document.getElementById("firstMessage").innerHTML = message;
  document.getElementById("secondMessage").innerHTML = JSON.parse(first);
  // YOU HAVE TO MANUALLY ADD MORE THINGS HERE IF YOU HAVE MORE MAX MESSAGES SHOWING AT ONCE
}

document.getElementById('cop1').onclick = function() {
  buyGen(0);
  if (player.firstClicked == false) {
    createStoryElement("You open up a browser to play games, but errors start entering the console.");
    player.firstClicked = true;
  }
}

document.getElementById('cop2').onclick = function() {
  buyGen(1);
  if (player.secondClicked == false) {
    createStoryElement("Pancakes is ready!");
    player.secondClicked = true;
  }
}

document.getElementById('cop3').onclick = function() {
  buyGen(2);
}

document.getElementById('cop4').onclick = function() {
  buyGen(3);
}
