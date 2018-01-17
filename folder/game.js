//Calling it this because it will be main game JS thing?

let player = {
  errors: new Decimal(10), //current errors
  compCost: [new Decimal(10),new Decimal(100),new Decimal(1000),new Decimal(10000),new Decimal(1e6),new Decimal(1e8),new Decimal(1e10),new Decimal(1e13),new Decimal(1e16)],
  compAmount: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
  compPow: [new Decimal(1),new Decimal(10),new Decimal(100),new Decimal(1000),new Decimal(10000),new Decimal(1e5),new Decimal(1e6),new Decimal(1e7),new Decimal(1e8)],
  prestige1: 0,
  prestige2: 0,
  story: 0,
  version: 0
}
const TIER_NAMES = ['first','second','third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']; // can add more if more gens/story elements, cuz that uses this too
const ROMAN_NUMERALS = ['I','II','III','IV','V','VI','VII','VIII','IX']
const costMult=[2,3,5,8,13,21,34,55,89]

function changeMults() {
  if (player.buyMult == 1) {
	  player.buyMult = 5;
  } else if (player.buyMult == 5) {
    player.buyMult = 10;
  } else if (player.buyMult == 10) {
    player.buyMult = 25;
  } else if (player.buyMult == 25) {
    player.buyMult = 50;
  } else if (player.buyMult == 50) {
    player.buyMult = 100;
  } else if (player.buyMult == 100) {
    player.buyMult = 1;
  }
}

function buyGen(tier) {
  if (player.errors.gte(player.compCost[tier])) {
	  player.compAmount[tier] = player.compAmount[tier].add(1)
    player.errors = player.errors.sub(player.compCost[tier])
    player.compCost[tier] = player.compCost[tier].mul(costMult[tier])

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

    display()
  }
}

function prestige(tier) {
  switch(tier) { //don't allow prestiging until you match reqs
    case 1: if (player.compAmount[player.prestige1].lt(10)) return; break;
    case 2: if (player.compAmount[player.prestige2+3].lt(20)) return; break;
  }
  player.errors = new Decimal(10); //current errors
  player.compCost = [new Decimal(10),new Decimal(100),new Decimal(1000),new Decimal(10000),new Decimal(1e6),new Decimal(1e8),new Decimal(1e10),new Decimal(1e13),new Decimal(1e16)];
  player.compAmount = [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)];
  player.compPow = [new Decimal(1),new Decimal(10),new Decimal(100),new Decimal(1000),new Decimal(10000),new Decimal(1e5),new Decimal(1e6),new Decimal(1e7),new Decimal(1e8)];
  if (tier==1) {
    player.prestige1++;
    for (let i=0;i<9;i++) player.compPow[i] =  player.compPow[i].mul(Math.pow(1.5,player.prestige1));
    document.getElementById("prestige1Gen").innerHTML = ROMAN_NUMERALS[player.prestige1]
  } else {
    player.prestige1 = 0;
    document.getElementById("prestige1Gen").innerHTML = 'I'
    if (tier==2) {
      player.prestige2++;
      document.getElementById("prestige2Gen").innerHTML = ROMAN_NUMERALS[player.prestige2+3]
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
  let ret = new Decimal(0);
  for (let i=0;i<9;i++) ret = ret.add(player.compAmount[i].mul(player.compPow[i]))
  return ret;
}

function display() {
  document.getElementById("errors").innerHTML = player.errors; //this is the base, except in the parentheses add the HTML tag of the thing you're changing
  document.getElementById("eps").innerHTML = getEPS();
  for (let i=0;i<4;i++) document.getElementById("cop"+(i+1)).innerHTML = "Buy a tier "+ROMAN_NUMERALS[i]+" computer. Cost: " + player.compCost[i] + " (" + player.compAmount[i] + ")";
  //document.getElementById("buyMult").innerHTML = player.buyMult + "x";
}

function increaseErrors() {
  player.errors = player.errors.add(getEPS());
  display()
}

function save() {
	localStorage.setItem('errorSave',btoa(JSON.stringify(player)))
}

function load() {
  save=JSON.parse(atob('errorSave'))
  if (save === null) return;
  player = save;

  //when adding a new player variable, PLEASE ADD A NEW LINE!!
  if (player.version == undefined) player.version = 0;
  
  //if the value is a Decimal, set it to be a Decimal here.
  player.errors = new Decimal(player.errors)
  for (let i=0;i<9;i++) {
    player.compAmount[i] = new Decimal(player.compAmount[i])
    player.compCost[i] = new Decimal(player.compCost[i])
    player.compPow[i] = new Decimal(player.compPow[i])
  }

}

load()
setInterval(increaseErrors,1000);
setInterval(save,10000);
