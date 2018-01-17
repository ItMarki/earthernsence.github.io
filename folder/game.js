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
  story: 0
}
const TIER_NAMES = ['first','second','third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']; // can add more if more gens/story elements, cuz that uses this too
var costMult=[2,3,5,8,13,21,34,55,89]


function buyGen(tier) {
  var level = TIER_NAMES[tier];
  if (player.errors>=player[level+"Cost"]) {
	player[level+"Amount"]+=1
    player.errors-=player[level+"Cost"]
	player[level+"Cost"]*=costMult[tier]
	if (tier==0&&player.story==0) {
		createStoryElement("Pancakes is ready!")
		player.story+=1
	}
	if (tier==1&&player.story==1) {
		createStoryElement("But NOPE! No pancakes for you. Too many console errors.")
		player.story+=1
	}
	if (tier==2&&player.story==2) {
		createStoryElement("Nice! A Tier III Computer. Well deserved.")
		player.story+=1
	}
  }
}

function createStoryElement(message) {
  
  document.getElementById("fifthStory").innerHTML = document.getElementById("fourthStory").innerHTML;
  document.getElementById("fourthStory").innerHTML = document.getElementById("thirdStory").innerHTML;
  document.getElementById("thirdStory").innerHTML = document.getElementById("secondStory").innerHTML;
  document.getElementById("secondStory").innerHTML = document.getElementById("firstStory").innerHTML;
  document.getElementById("firstStory").innerHTML = message
  // YOU HAVE TO MANUALLY ADD MORE THINGS HERE IF YOU HAVE MORE MAX MESSAGES SHOWING AT ONCE
}

function getEPS() {
  player.eps = (player.firstAmount * 1)+(player.secondAmount * 10)+(player.thirdAmount * 100)+(player.fourthAmount*1000)+(player.fifthAmount*10000); // can change base amounts of how much they produce, or change it to just be firsts cuz AD elements
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
  getEPS()
  player.errors+=player.eps;
  display()
}

setInterval(function(){
  increaseErrors();
},1000);
