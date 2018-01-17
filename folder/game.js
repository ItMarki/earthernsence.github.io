//Calling it this because it will be main game JS thing?

var player = {
  errors: 10, //current errors
  compCost: [10,100,1000,10000,1e6,1e8,1e10,1e13,1e16],
  compAmount: [0,0,0,0,0,0,0,0,0],
  compPow: [1,10,100,1000,1e4,1e5,1e6,1e7,1e8],
  story: 0
}
const TIER_NAMES = ['first','second','third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']; // can add more if more gens/story elements, cuz that uses this too
const ROMAN_NUMERALS = ['I','II','III','IV','V','VI','VII','VIII','IX']
const costMult=[2,3,5,8,13,21,34,55,89]

function buyGen(tier) {
  if (player.errors>=player.compCost[tier]) {
	  player.compAmount[tier]++
    player.errors-=player.compCost[tier]
    player.compCost[tier]*=costMult[tier]

    switch (tier) {
      case 0: if (player.story==0) {
        createStoryElement("Pancakes is ready!")
        player.story++
      } break;
      case 1: if (player.story==1) {
        createStoryElement("But NOPE! No pancakes for you. Too many console errors.")
        player.story++
      } break;
      case 2: if (player.story==2) {
        createStoryElement("Nice! A Tier III Computer. Well deserved.")
        player.story++
      } break;
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
  let ret = 0;
  for (let i=0;i<9;i++) ret += player.compAmount[i]*player.compPow[i]
  return ret;
}

function display() {
  document.getElementById("errors").innerHTML = player.errors; //this is the base, except in the parentheses add the HTML tag of the thing you're changing
  document.getElementById("eps").innerHTML = getEPS();
  for (let i=0;i<4;i++) document.getElementById("cop"+(i+1)).innerHTML = "Buy a tier "+ROMAN_NUMERALS[i]+" computer. Cost: " + player.compCost[i] + " (" + player.compAmount[i] + ")";
}

function increaseErrors() {
  player.errors+=getEPS();
  display()
}

setInterval(function(){
  increaseErrors();
},1000);
