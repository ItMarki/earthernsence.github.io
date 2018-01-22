//Calling it this because it will be main game JS thing?

player = {
  errors: new Decimal(10), //current errors
  totalErrors: new Decimal(0),
  compCost: [new Decimal(10),new Decimal(100),new Decimal(1000),new Decimal(10000),new Decimal(1e6),new Decimal(1e8),new Decimal(1e10),new Decimal(1e13),new Decimal(1e16)],
  compAmount: [0,0,0,0,0,0,0,0,0],
  compPow: [1,10,100,1000,1e4,1e5,1e6,1e7,1e8],
		genUpgradeCost: new Decimal(1000),
  boost: new Decimal(1),
  prestiges: [0,0,0],
  story: 0,
  playtime: 0,
  time: new Date().getTime(),
  version: 0,
  build: 5
}
tab='computers'
const story = ['','','','','']
const TIER_NAMES = ['first','second','third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']; // can add more if more gens/story elements, cuz that uses this too
const ROMAN_NUMERALS=[]
const costMult=[2,2.5,3,4,6,9,14,22,35]
const abbs=['','k','M','B','T']

	
function updateElement(elementID,value) {
	document.getElementById(elementID).innerHTML=value
}
	
function showElement(elementID,style) {
	document.getElementById(elementID).style.display=style
}
	
function hideElement(elementID) {
	document.getElementById(elementID).style.display='none'
}

function format(num,decimalPoints=0,offset=0) {
	num=new Decimal(num)
	if (isNaN(num.mantissa)) {
		return '?'
	} else if (num.eq(1/0)) {
		return 'Infinite'
	} else {
		var abbid=Math.max(Math.floor(num.e/3)-offset,0)
		var mantissa=num.div(Decimal.pow(1000,abbid)).toFixed((decimalPoints<2)?2:decimalPoints)
		if (mantissa==Math.pow(1000,1+offset)) {
			mantissa=mantissa/1000
			abbid+=1
		}
		return mantissa+(abbid>4?letter(abbid+22):abbs[abbid])
	}
}

function letter(label) {
	var letters='abcdefghijklmnopqrstuvwxyz'
	var result=''
	do {
		var id=(label-1)%26
		result=letters.slice(id,id+1)+result
		label=Math.floor((label-1)/26)
	} while (label>0)
	return result
}

function formatTime(s) {
	if (s < 1) {
		return Math.floor(s*1000)+' milliseconds'
	} else if (s < 60) {
		return Math.floor(s*100)/100+' seconds'
	} else if (s < 3600) {
		return Math.floor(s/60)+' minutes and '+Math.floor(s%60)+' seconds'
	} else if (s < 86400) {
		return Math.floor(s/3600)+' hours, '+Math.floor(s/60%60)+' minutes, and '+Math.floor(s%60)+' seconds'
	} else if (s < 2629746) {
		return Math.floor(s/86400)+' days, '+Math.floor(s/3600%24)+' hours, '+Math.floor(s/60%60)+' minutes, and '+Math.floor(s%60)+' seconds'
	} else if (s < 31556952) {
		return Math.floor(s/2629746)+' months, '+Math.floor(s%2629746/86400)+' days, '+Math.floor(s%2629746/3600%24)+' hours, '+Math.floor(s%2629746/60%60)+' minutes, and '+Math.floor(s%2629746%60)+' seconds'
	} else if (s < Infinity) {
		return format(Math.floor(s/31556952))+' years, '+Math.floor(s/2629746%12)+' months, '+Math.floor(s%2629746/86400)+' days, '+Math.floor(s%2629746/3600%24)+' hours, '+Math.floor(s%2629746/60%60)+' minutes, and '+Math.floor(s%2629746%60)+' seconds'
	} else {
		return 'Infinite'
	}
}

function switchTab(tabid) {
	hideElement(tab+'Tab')
	showElement(tabid+'Tab','block')
	tab=tabid
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
        createStoryElement("Wakey wakey! Aw, c'mon, you still got the rest of the day to sleep. Get up baby, get up!")
        player.story++
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

function buyGenUpgrade() {
    if (player.errors.gte(player.genUpgradeCost)) {
    player.errors = player.errors.sub(player.genUpgradeCost);
    player.boost=player.boost.mul(new Decimal(2));
    player.genUpgradeCost = player.genUpgradeCost.mul(new Decimal(10));
  }
  display()
}

function prestige(tier) {
  switch(tier) { //don't allow prestiging until you match reqs
    case 1: if (player.compAmount[player.prestiges[0]] < 10) return; break;
    case 2: if (player.compAmount[player.prestiges[1]+3] < 20) return; break;
    case 3: if (player.compAmount[8] < 60+40*player.prestiges[2]) return; break;
    case Infinity: if (!confirm('Are you really sure to reset? You will lose everything you have!')) return; break;
  }
  if (tier==Infinity) {
	//Highest tier - Hard reset
	localStorage.clear('errorSave')
  }
  if (tier==3) {
	//Tier 3 - Networks
	player.prestiges[2]=(tier==3)?player.prestiges[2]+1:0
  }
  if (tier==2) {
	//Tier 2 - I.P. change
	player.prestiges[1]=(tier==2)?player.prestiges[1]+1:0
  }
  
  //Tier 1 - Update computers
  player.prestiges[0]=(tier==1)?player.prestiges[0]+1:0
  player.errors = new Decimal(10); //current errors
  player.compCost = [new Decimal(10),new Decimal(100),new Decimal(1000),new Decimal(10000),new Decimal(1e6),new Decimal(1e8),new Decimal(1e10),new Decimal(1e13),new Decimal(1e16)];
  player.compAmount=[0,0,0,0,0,0,0,0,0]
  player.compPow=[1,10,100,1000,1e4,1e5,1e6,1e7,1e8]
  player.boost=new Decimal(1)
  player.time = new Date().getTime()
  display()
  
  switch (tier) {
	  case 1: if (player.story==4&&player.prestiges[0]==1) {
		createStoryElement("Wonderful, you have upgraded your computers.")
        player.story+=1
	  }
	  if (player.story==5&&player.prestiges[0]==4) {
		createStoryElement("You max out your computers but it still giving you errors. Why not do something else?")
        player.story+=1
	  } break
	  
	  case 2: if (player.story==6&&player.prestiges[1]==1) {
		createStoryElement("You bought your new computer. What it does do now?")
        player.story+=1
	  } 
	  if (player.story==8&&player.prestiges[1]==2) {
		createStoryElement("You keep buying your new computers, but it doesn\'t work for all.")
        player.story+=1
	  } 
	  if (player.story==9&&player.prestiges[1]==5) {
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
  for (let i=0;i<9;i++) ret = ret.add(Decimal.times(player.compAmount[i],player.compPow[i]).times(Decimal.pow(1.1,player.compAmount[i]-1)).times(player.boost))
  return ret;
}

function display() {
  document.getElementById("errors").innerHTML = format(player.errors) //this is the base, except in the parentheses add the HTML tag of the thing you're changing
  document.getElementById("eps").innerHTML = format(getEPS())
  if (tab=='computers') {
	  for (let i=0;i<Math.min(player.prestiges[1]+4,9);i++) document.getElementById("cop"+(i+1)).innerHTML = "Cost: " + format(player.compCost[i]) + " (" + player.compAmount[i] + ")"
	  for (i=0;i<5;i++) {
		  if (player.prestiges[1]>i) {
			showElement(TIER_NAMES[i+4]+'Comp','block')
		  } else {
			hideElement(TIER_NAMES[i+4]+'Comp')
		  }
	  }
	  if (player.compAmount[2]>0) {
		  showElement('genUpgrade','block');
		  updateElement('genIncreaseCost','Cost: ' + format(player.genUpgradeCost));
		  updateElement('genBoost',player.boost);
	  } else {
		  hideElement('genUpgrade')
	  }
	  if (player.prestiges[1]<5) {
		  updateElement('prestige2Gen',ROMAN_NUMERALS[player.prestiges[1]+4])
		  updateElement('afterPrestige2Gen',ROMAN_NUMERALS[player.prestiges[1]+5])
		  hideElement('maxout2')
		  showElement('abletoprestige2','inline')
	  } else {
		  hideElement('abletoprestige2')
		  showElement('maxout2','inline')
	  }
	  if (player.prestiges[0]<player.prestiges[1]+4) {
		  updateElement('prestige1Gen',ROMAN_NUMERALS[player.prestiges[0]+1])
		  hideElement('maxout')
		  showElement('abletoprestige','inline')
	  } else {
		  hideElement('abletoprestige')
		  showElement('maxout','inline')
	  }
	  updateElement('prestige3Req',60+40*player.prestiges[2])
  }
  if (tab=='stats') {
	  updateElement('statsTotal','You have gained a total of '+format(player.totalErrors)+' errors.')
	  updateElement('statsPlaytime','You have played for '+formatTime(player.playtime)+'.')
	  if (player.prestiges[0]>0) {
		  showElement('statsPrestige1','block')
		  updateElement('statsPrestige1','You upgraded your computers, '+format(player.prestiges[0],0,1)+' times.')
	  } else {
		  hideElement('statsPrestige1')
	  }
	  if (player.prestiges[1]>0) {
		  showElement('statsPrestige2','block')
		  updateElement('statsPrestige2','You have '+format(player.prestiges[1],0,1)+' new computers.')
	  } else {
		  hideElement('statsPrestige2')
	  }
	  if (player.prestiges[2]>0) {
		  showElement('statsPrestige3','block')
		  updateElement('statsPrestige3','You have '+format(player.prestiges[2],0,1)+' networks.')
	  } else {
		  hideElement('statsPrestige3')
	  }
  }
}

function increaseErrors() {
  var s = (new Date().getTime()-player.time)/1000 // number of seconds since last tick
  player.time = new Date().getTime()
  player.errors = player.errors.add(getEPS().mul(s));
  player.totalErrors = player.totalErrors.add(getEPS().mul(s));
  player.playtime+=s
  display()
}

function save() {
	localStorage.setItem('errorSave',btoa(JSON.stringify(player)))
}

function load(savefile) {
  try {
	  player=JSON.parse(atob(savefile));

	  //when adding a new player variable, PLEASE ADD A NEW LINE!!
	  if (player.version == undefined) player.version = 0;
	  if (player.build == undefined) player.build = 0;
	  if (player.genUpgradeCost == undefined) player.genUpgradeCost = 1000;
	  if (player.build < 1) {
		for (let i=0;i<9;i++) {
			player.compCost[i] = parseint(player.compCost[i])
			player.compPow[i] = parseint(player.compPow[i])
		}
	  }
	  if (player.build < 2) {
		player.time=new Date().getTime()
	  }
	  if (player.build < 3) {
		player.prestiges=[player.prestige1,player.prestige2,0]
		player.timeUpgrades=0
		delete player.prestige1
		delete player.prestige2
	  }
	  if (player.build < 4) {
		player.playtime=0
		player.totalErrors=0
	  }
	  if (player.build < 5) {
		player.boost=1
		delete player.timeUpgrades
	  }
	  player.version = 0
	  player.build = 5
	  
	  //if the value is a Decimal, set it to be a Decimal here.
	  player.errors = new Decimal(player.errors)
	  player.totalErrors = new Decimal(player.totalErrors)
	  for (let i=0;i<9;i++) {
		player.compCost[i] = new Decimal(player.compCost[i])
	  }
	  player.genUpgradecost = new Decimal(player.genUpgradeCost);
	  player.boost=new Decimal(player.boost)
	  
	  increaseErrors()
	  console.log('Game loaded!')
  } catch (e) {
	  console.log('Your save failed to load:\n'+e)
  }
}

function exportSave() {
	var savefile=btoa(JSON.stringify(player))
	showElement('exportSave','block')
	document.getElementById("exportText").value=btoa(JSON.stringify(player))
}

function importSave() {
	var input=prompt('Copy and paste in your exported file and press enter.')
	if (load(input)) {
		if (input!=null) {
			alert('Your save was invalid or caused a game-breaking bug. :(')
		}
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

function gameInit() {
	setupRoman()
	load(localStorage.getItem('errorSave'))
	
	var tickspeed=0
	updated=true
	setInterval(function(){
		if (updated) {
			updated=false
			setTimeout(function(){
				var startTime=new Date().getTime()
				try {
					increaseErrors()
				} catch (e) {
					console.log('A game error has been occured: '+e)
				}
				tickspeed=(new Date().getTime()-startTime)*0.2+tickspeed*0.8
				updated=true
			},tickspeed)
		}
	},0)
	setInterval(save,10000);
}
