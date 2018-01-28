//game.js

player = {
  errors: new Decimal(10), //current errors
  totalErrors: new Decimal(0),
  compCost: [new Decimal(10),new Decimal(100),new Decimal(1000),new Decimal(10000),new Decimal(1e6),new Decimal(1e8),new Decimal(1e10),new Decimal(1e13),new Decimal(1e16)],
  compAmount: [0,0,0,0,0,0,0,0,0],
  compPow: [1,10,100,1000,1e4,1e5,1e6,1e7,1e8],
  genUpgradeCost: new Decimal(1000),
  boost: new Decimal(1),
  prestiges: [0,0,0],
  story: -1,
  playtime: 0,
  time: new Date().getTime(),
  notation: 0,
  version: 0,
  build: 8
}
tab='computers'
const story = ['','','','','']
const TIER_NAMES = ['first','second','third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']; // can add more if more gens/story elements, cuz that uses this too
const ROMAN_NUMERALS=[]
const costMult=[2,2.5,3,4,5,6,8,10,12]

var storyMessages=["Pancakes is ready!","Wakey wakey! Aw, c'mon, you still got the rest of the day to sleep. Get up baby, get up!","Nice! A Tier III Computer. Well deserved.","A Tier IV Computer is great, isn't it?","Computers are waking up...","Ah, here we are. Awake and operational.","Network is being horrible. These upgrades don't do anything. What I'd give for an ethernet cord.","I still haven't introduced myself? I'm your first ever Tier I computer. I can't believe you've finally had the care to upgrade me.","Trust me. I stay through it all. Keep getting these I.P. Changes and we'll be set in no time.","Errors? Still? You can do better than that!",
	"Atta boy! Keep getting em. Also, Tier VI Computers are my best friends. Get more!","Tier VII computers are bullies. Get through them NOW.","Tier VIII! Soon, everybody, soon.","The Internet Boosts are in sight. Get 20 Tier IX computers to buy one.","I got a boost? Good job, you get a <i>small</i> prize.","Networks was found, but all are private for me. :(","The PC found a network! This seems legit. Let's hop on.","Computer: Connecting network. Please wait, this may take a few minutes.","Aw, really? I hate these things.","Computer: Connected.",
	"Finally! Can't wait to test this bad boy out.","Hey, we're off! Got a I.P. Change as well. The end is near.","Another network? I find out your new network was better so I installed it."]
	
function updateElement(elementID,value) {
	document.getElementById(elementID).innerHTML=value
}
	
function showElement(elementID,style) {
	document.getElementById(elementID).style.display=style
}
	
function hideElement(elementID) {
	document.getElementById(elementID).style.display='none'
}

var notationArray = ["Standard","Scientific","Engineering","Logarithm"]

function abbreviate(i) {
	if(i==0) return "K"
	if(i==1) return "M"
	if(i==2) return "B"
	var units = ["","U","Du","T","Q","Qi","S","Sp","O","N"]
	var tens = ["","D","V","Tg","Qg","Qig","Sg","SPg","Og","Ng"]
	var hundreds = ["","C","Dc","Tc","Qc","Qic","Sc","Spc","Oc","Nc"]
	var i2=Math.floor(i/10)
	var i3=Math.floor(i2/10)
	var unit = units[i%10]
	var ten = tens[i2%10]
	var hundred = hundreds[i3%10]
	return unit+ten+hundred
}

function format(num,decimalPoints=0,offset=0) {
	if (num.lte(9999.5)) return a.toFixed(3)
	num=new Decimal(num)
	if (isNaN(num.mantissa)) {
		return '?'
	} else if (num.eq(1/0)) {
		return 'Infinite'
	} else {
		var e = num.e;
		var e2 = 3*Math.floor(e/3);
		var abbid=Math.max(Math.floor(num.e/3)-offset,0)
		var m=num.div(Decimal.pow(10,num.e)).toFixed((abbid>0&&decimalPoints<2)?2:decimalPoints)
		if (m>9.9995) {
			m = 1
			e++
		}
		var m2=num.div(Decimal.pow(1000,abbid)).toFixed((abbid>0&&decimalPoints<2)?2:decimalPoints)
		if (m2>999.95) {
			m2 = 1
		abbid++
		}
	if (player.notation==1) return num.toExponential(3).replace("e+","e")
	if (player.notation==3) return "e"+Math.round(1000*num.log10())/1000
	if(player.notation==0) return m2+abbreviate(abbid)
		if(player.notation==2) return m2+"e"+e2
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

function switchNotation() {
	player.notation++
	if(player.notation>notationArray.length-1) game.notation=0
	updateElement("notationID",notationArray[game.notation])
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

function newStory(story) {
  if (player.story>=story) return;
  player.story=story
  updateStory()
}

function buyGen(tier,bulk=1) {
  if (player.errors.gte(player.compCost[tier])) {
	player.compAmount[tier]++
    player.errors = player.errors.sub(player.compCost[tier])
    player.compCost[tier] = player.compCost[tier].mul(costMult[tier])

    switch (tier) {
      case 0: newStory(0); break;
      case 1: newStory(1); break;
      case 2: newStory(2); break;
      case 3: newStory(3); break;
      case 4: newStory(9); break;
    }

    display()
  }
}

function buyGenUpgrade() {
  if (player.errors.gte(player.genUpgradeCost)) {
    player.errors = player.errors.sub(player.genUpgradeCost);
    player.boost=player.boost.mul(new Decimal(2+0.01*player.prestiges[2]));
    player.genUpgradeCost = player.genUpgradeCost.mul(new Decimal(4));
  }
}

function prestige(tier) {
  switch(tier) { //don't allow prestiging until you match reqs
    case 1: if (player.compAmount[player.prestiges[0]] < 10) return; break;
    case 2: if (player.compAmount[Math.min(player.prestiges[1]+3,8)] < 20+Math.max(player.prestiges[1]-5,0)) return; break;
    case 3: if (player.compAmount[8] < 60+40*player.prestiges[2]) return; break;
    case Infinity: if (!confirm('Are you really sure to reset? You will lose everything you have!')) return; break;
  }
  if (tier==Infinity) {
	//Highest tier - Hard reset
	localStorage.clear('errorSave')
	player.playtime=0
	player.totalErrors=new Decimal(0)
	player.story=-1
	updateStory()
  }
  
  player.errors = new Decimal(10); //current errors
  player.compCost = [new Decimal(10),new Decimal(100),new Decimal(1000),new Decimal(10000),new Decimal(1e6),new Decimal(1e8),new Decimal(1e10),new Decimal(1e13),new Decimal(1e16)];
  player.compAmount=[0,0,0,0,0,0,0,0,0]
  player.compPow=[1,10,100,1000,1e4,1e5,1e6,1e7,1e8]
  player.boost=Decimal.pow(2+0.01*player.prestiges[2],Math.max(player.prestiges[1]-5,0)*5)
  player.time = new Date().getTime()
  player.genUpgradeCost=new Decimal(1000)
  if (tier==1) {
    player.prestiges[0]++
    switch(player.prestiges[2]) {
      case 0: switch(player.prestiges[0]) {
        case 1: newStory(4); break;
        case 2: newStory(5); break;
        case 3: newStory(6); break;
        case 4: newStory(7); break;
      } break;
      case 1: switch(player.prestiges[0]) {
        case 1: newStory(18); break;
        case 2: newStory(20); break;
      }
    }    
  } else {
    player.prestiges[0] = 0
    if (tier==2) {
      player.prestiges[1]++
      switch(player.prestiges[1]) {
        case 1: newStory(8); break;
        case 2: newStory(10); break;
        case 3: newStory(11); break;
        case 4: newStory(12); break;
        case 5: newStory(13); break;
        case 6: newStory(14); break;
        case 9: newStory(15); break;
      }
      if (player.prestiges[2]==1) newStory(21);
    } else {
      player.prestiges[1] = 0
      if (tier==3) {
        player.prestiges[2]++;
        switch(player.prestiges[2]) {
          case 1: newStory(17); break;
          case 2: newStory(22); break;
        }
      }
    }
  }
  display()
}

function getMultTier(tier) {
  let ret = new Decimal(1);
  if (player.prestiges[0] >= tier) ret = ret.mul(2);
  return ret;
}
function getEPS() {
  let ret = new Decimal(0);
  for (let i=0;i<9;i++) {
    ret = ret.add(Decimal.pow(Math.pow(1.05,i+1),player.compAmount[i]-1).times(player.compAmount[i]).mul(player.compPow[i]).times(player.boost).mul(getMultTier(i+1)))
  }
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
		  updateElement('genIncrease',(2+0.01*player.prestiges[2]));
		  updateElement('genIncreaseCost','Cost: ' + format(player.genUpgradeCost));
		  updateElement('genBoost',format(player.boost));
	  } else {
		  hideElement('genUpgrade')
}
	  updateElement('prestige2Gen',format(20+Math.max(player.prestiges[1]-5,0),0,1)+' Tier '+ROMAN_NUMERALS[Math.min(player.prestiges[1]+4,9)])
	  if (player.prestiges[1]<5) {
		updateElement('ipChange','Gain Tier '+ROMAN_NUMERALS[player.prestiges[1]+5]+' Computer, but resets everything.')
		updateElement('prestige2Type','I.P. Change')
	  } else {
		updateElement('ipChange','Gain headstart for boost, but resets everything.')
		updateElement('prestige2Type','Internet boost')
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
		  if (player.prestiges[1]<6) {
			  updateElement('statsPrestige2','You have '+player.prestiges[1]+' new computers.')
		  } else {
			  updateElement('statsPrestige2','You have 5 new computers and boosted your computers '+format(player.prestiges[1]-5,0,1)+' times.')
		  }
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
	  if (player.build<6) {
		player.genUpgradeCost=1000
	  }
	  if (player.build<7) {
		player.story-=1
	  }
	  if (player.build<8) {
		player.notation=0
	  }
	  player.version = 0
	  player.build = 8
	  
	  //if the value is a Decimal, set it to be a Decimal here.
	  player.errors = new Decimal(player.errors)
	  player.totalErrors = new Decimal(player.totalErrors)
	  for (let i=0;i<9;i++) {
		player.compCost[i] = new Decimal(player.compCost[i])
	  }
	  player.genUpgradeCost = new Decimal(player.genUpgradeCost);
	  player.boost=new Decimal(player.boost)
	  
	  increaseErrors()
	  updateStory()
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

function updateStory() {
    var Table = document.getElementsByClassName("storybox")[0].tBodies[0];
    for(var i = 0;i<player.story+1;i++){
         if(Table.rows.length<=i){ 
            var Row = Table.insertRow(i);
            var Cell = Row.insertCell(0);
         }
         Table.rows[i].cells[0].innerHTML = storyMessages[i];
    }
}



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
