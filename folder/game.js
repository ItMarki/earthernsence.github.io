//Calling it this because it will be main game JS thing?

player = {
  errors: new Decimal(10), //current errors
  compCost: [new Decimal(10),new Decimal(100),new Decimal(1000),new Decimal(10000),new Decimal(1e6),new Decimal(1e8),new Decimal(1e10),new Decimal(1e13),new Decimal(1e16)],
  compAmount: [0,0,0,0,0,0,0,0,0],
  compPow: [1,10,100,1000,1e4,1e5,1e6,1e7,1e8],
  prestige1: 0,
  prestige2: 0,
  story: 0,
  version: 0,
  build: 1
}
const story = ['','','','','']
const TIER_NAMES = ['first','second','third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']; // can add more if more gens/story elements, cuz that uses this too
const ROMAN_NUMERALS=[]
const costMult=[2,2.5,3,4,6,9,14,22,35]

	
function updateElement(elementID,value) {
	document.getElementById(elementID).innerHTML=value
}
	
function showElement(elementID,style) {
	document.getElementById(elementID).style.display=style
}
	
function hideElement(elementID) {
	document.getElementById(elementID).style.display='none'
}

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
  document.getElementById('buyMult').innerHTML=player.buyMult+'x'
}

function buyGen(tier,bulk=1) {
  if (player.errors.gte(player.compCost[tier])) {
	player.compAmount[tier]+=1
    player.errors = player.errors.sub(player.compCost[tier])
    player.compCost[tier] = player.compCost[tier].mul(costMult[tier])

    switch (tier) {
      case 0: if (player.story==0) {
        createStoryElement("Pancakes is ready!")
        player.story+=1
      } break;
      case 1: if (player.story==1) {
        createStoryElement("But NOPE! No pancakes for you. Too many console errors.")
        player.story+=1
      } break;
      case 2: if (player.story==2) {
        createStoryElement("Nice! A Tier III Computer. Well deserved.")
        player.story+=1
      } break;
      case 3: if (player.story==3) {
        createStoryElement("A Tier IV Computer was powerful, does it?")
        player.story+=1
      } break;
      case 4: if (player.story==7) {
        createStoryElement("Your new computer still generates errors. Oh come on!")
        player.story+=1
      } break;
    }

    display()
  }
}

function prestige(tier) {
  switch(tier) { //don't allow prestiging until you match reqs
    case 1: if (player.compAmount[player.prestige1] < 10) return; break;
    case 2: if (player.compAmount[player.prestige2+3] < 20) return; break;
  }
  //Tier 2 - I.P. change
  player.prestige2+=1
  
  //Tier 1 - Update computers
  player.prestige1=(tier==1)?player.prestige1+1:0
  player.errors = new Decimal(10); //current errors
  player.compCost = [new Decimal(10),new Decimal(100),new Decimal(1000),new Decimal(10000),new Decimal(1e6),new Decimal(1e8),new Decimal(1e10),new Decimal(1e13),new Decimal(1e16)];
  player.compAmount=[0,0,0,0,0,0,0,0,0]
  player.compPow=[1,10,100,1000,1e4,1e5,1e6,1e7,1e8]
  display()
  
  switch (tier) {
	  case 1: if (player.story==4&&player.prestige1==1) {
		createStoryElement("Wonderful, you have upgraded your computers.")
        player.story+=1
	  }
	  if (player.story==5&&player.prestige1==4) {
		createStoryElement("You max out your computers but it still giving you errors. Why not do something else?")
        player.story+=1
	  } break
	  
	  case 2: if (player.story==6&&player.prestige2==1) {
		createStoryElement("You bought your new computer. What it does do now?")
        player.story+=1
	  } 
	  if (player.story==8&&player.prestige2==2) {
		createStoryElement("You keep buying your new computers, but it doesn\'t work for all.")
        player.story+=1
	  } 
	  if (player.story==9&&player.prestige2==5) {
		createStoryElement("You ran out of computers. We need to setup a network.")
        player.story+=1
	  } break
  }
}

function createStoryElement(message) {
	for (j=4;j>0;j--) {
		story[j]=story[j-1]
		updateElement(TIER_NAMES[j]+'Story',story[j])
	}
	story[0]=message
	updateElement('firstStory',story[0])
}

function getEPS() {
  let ret = new Decimal(0);
  for (let i=0;i<9;i++) ret = ret.add(player.compAmount[i]*player.compPow[i])
  return ret;
}

function display() {
  document.getElementById("errors").innerHTML = player.errors //this is the base, except in the parentheses add the HTML tag of the thing you're changing
  document.getElementById("eps").innerHTML = getEPS()
  for (let i=0;i<Math.min(player.prestige2+4,9);i++) document.getElementById("cop"+(i+1)).innerHTML = "Cost: " + player.compCost[i] + " (" + player.compAmount[i] + ")"
  for (i=0;i<5;i++) {
  	  if (player.prestige2>i) {
		showElement(TIER_NAMES[i+4]+'Comp','block')
	  } else {
		hideElement(TIER_NAMES[i+4]+'Comp')
	  }
  }
  if (player.prestige2<5) {
	  updateElement('prestige2Gen',ROMAN_NUMERALS[player.prestige2+4])
	  updateElement('afterPrestige2Gen',ROMAN_NUMERALS[player.prestige2+5])
	  hideElement('maxout2')
	  showElement('abletoprestige2','inline')
  } else {
	  hideElement('abletoprestige2')
	  showElement('maxout2','inline')
  }
  if (player.prestige1<player.prestige2+4) {
	  updateElement('prestige1Gen',ROMAN_NUMERALS[player.prestige1+1])
	  hideElement('maxout')
	  showElement('abletoprestige','inline')
  } else {
	  hideElement('abletoprestige')
	  showElement('maxout','inline')
  }
}

function increaseErrors() {
  player.errors = player.errors.add(getEPS());
  display()
}

function save() {
	localStorage.setItem('errorSave',btoa(JSON.stringify(player)))
}

function load() {
  try {
	  savefile=JSON.parse(atob(localStorage.getItem('errorSave')))
	  player = savefile;

	  //when adding a new player variable, PLEASE ADD A NEW LINE!!
	  if (player.version == undefined) player.version = 0;
	  if (player.build == undefined) player.build = 0;
	  if (player.build < 1) {
		for (let i=0;i<9;i++) {
			player.compCost[i] = parseint(player.compCost[i])
			player.compPow[i] = parseint(player.compPow[i])
		}
	  }
	  player.version = 0
	  player.build = 1
	  
	  //if the value is a Decimal, set it to be a Decimal here.
	  player.errors = new Decimal(player.errors)
	  for (let i=0;i<9;i++) {
		player.compCost[i] = new Decimal(player.compCost[i])
	  }
  } catch (e) {
	  console.log('Your save failed to load:\n'+e)
  }
}

function setupRoman() {
	var thousands = ['','M','MM','MMM']
	var hundreds = ['','C','CC','CCC','CD','D','DC','DCC','DCCC','CM']
	var tens = ['','X','XX','XXX','XL','L','LX','LXX','LXXX','XC']
	var ones = ['','I','II','III','IV','V','VI','VII','VIII','IX']
	
	for (i=0;i<4;i++) {
		for (j=0;j<10;j++) {
			for (k=0;k<10;k++) {
				for (l=0;l<10;l++) {
					ROMAN_NUMERALS.push(thousands[i]+hundreds[j]+tens[k]+ones[l])
				}
			}
		}
	}
}


function drawStorybox() {
  rect(50, 50, 150, 250);
  line(50, 75, 150, 75); 
}
//drawStorybox();

setupRoman()
load()
setInterval(increaseErrors,1000);
setInterval(save,10000);
