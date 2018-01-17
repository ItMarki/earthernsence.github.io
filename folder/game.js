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
    return true;
  } else return false;
}

function createStoryElement(message) {
  
  document.getElementById("secondStory").innerHTML = document.getElementById("firstStory").innerHTML;
  document.getElementById("firstStory").innerHTML = message
  // YOU HAVE TO MANUALLY ADD MORE THINGS HERE IF YOU HAVE MORE MAX MESSAGES SHOWING AT ONCE
}

document.getElementById('cop1').onclick = function() {
  if (player.firstClicked == false && buyGen(0) == true) {
    createStoryElement("Pancakes is ready!");
    player.firstClicked = true;
  }
}

document.getElementById('cop2').onclick = function() {
  if (player.secondClicked == false && buyGen(1) == true) {
    createStoryElement("But NOPE! No pancakes for you. Too many console errors.");
    player.secondClicked = true;
  }
}

document.getElementById('cop3').onclick = function() {
  if (player.thirdClicked == false &&   buyGen(2) == true) {
    createStoryElement("Nice! A Tier III Computer. Well deserved.");
    player.thirdClicked = true;
  }
}

document.getElementById('cop4').onclick = function() {
  buyGen(3);
}

function getEPS() {
  player.eps = (player.firstAmount * 1) + (player.secondAmount * 10) + (player.thirdAmount * 100); // can change base amounts of how much they produce, or change it to just be firsts cuz AD elements
}

function display() {
   getEPS();
  
  document.getElementById("errors").innerHTML = player.errors; //this is the base, except in the parentheses add the HTML tag of the thing you're changing
  document.getElementById("eps").innerHTML = player.eps;
  document.getElementById("cop1").innerHTML = "Buy a tier I computer. Cost: " + player.firstCost + " (" + player.firstAmount + ")";
  document.getElementById("cop2").innerHTML = "Buy a tier II computer. Cost: " + player.secondCost + " (" + player.secondAmount + ")";
  document.getElementById("cop3").innerHTML = "Buy a tier III computer. Cost: " + player.thirdCost + " (" + player.thirdAmount + ")";
  document.getElementById("cop4").innerHTML = "Buy a tier IV computer. Cost: " + player.fourthCost + " (" + player.fourthAmount + ")";
}

function increaseErrors() {
  getEPS();
  player.errors += player.eps;
  display();
}

setInterval(function(){
  increaseErrors();
}, 1000);
