//game.js and only game.js
var shiftDown=false;
var controlDown=false;
player = {
  errors: new Decimal(10), //current errors
  totalErrors: new Decimal(0), //total errors that display in stats
  compAmount: [0,0,0,0,0,0,0,0,0], //amounts that are shown on computer button
  boostPower:0, //
  prestiges: [0,0,0], //amount of prestiges where [X,0,0] is X UCs, [0,X,0] is X I.P. changes/internet boosts and [0,0,X] is X networks
  story: -1, //amount of story.
  upgrades: [], //see lines 261-274
  playtime: 0, //total time spent online ingame
  time: 0, //total time displayed in stats
  version: 1, //very important
  build: 17, //used for us to communicate commits, helps a lot
  hotfix: 0, //another way
  options: {
	  hotkeys:true, //whether or not hotkeys are enabled (on by default)
	  notation:0 //notation setting, see options
  }
}
tab='computers'
oldtab=tab
const story = ['','','','','']
const TIER_NAMES = ['first','second','third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']; // can add more if more gens/story elements, cuz that uses this too
const ROMAN_NUMERALS=[]
const costMult=[2,2.5,3,4,5,6,8,10,12]

var costs={comp:[new Decimal(10),new Decimal(100),new Decimal(1e3),new Decimal(1e4),new Decimal(1e6),new Decimal(1e8),new Decimal(1e10),new Decimal(1e13),new Decimal(1e16)],boost:new Decimal(0),upgs:[new Decimal(0)]}
var storyMessages=["Pancakes is ready!","Wakey wakey! Aw, c'mon, you still got the rest of the day to sleep. Get up baby, get up!","Nice! A Tier III Computer. Well deserved.","A Tier IV Computer is great, isn't it?","Computers are waking up...","Ah, here we are. Awake and operational.","Network is being horrible. These upgrades don't do anything. What I'd give for an ethernet cord.","I still haven't introduced myself? I'm your first ever Tier I computer. I can't believe you've finally had the care to upgrade me.","Trust me. I stay through it all. Keep getting these I.P. Changes and we'll be set in no time.","Errors? Still? You can do better than that!",
	"Atta boy! Keep getting em. Also, Tier VI Computers are my best friends. Get more!","Tier VII computers are bullies. Get through them NOW.","Tier VIII! Soon, everybody, soon.","The Internet Boosts are in sight. Get 35 Tier IX computers to buy one.","I got a boost? Good job, you get a <i>small</i> prize.","Networks was found, but all are private for me. :(","Congratulations! You just beat the game! (for now...)","Why not you play other games like the inspiration at the title screen until the next update comes out?" /*Normal gameplay ends here.*/,"The PC found a network! This seems legit. Let's hop on.","Computer: Connecting network. Please wait, this may take a few minutes.","Aw, really? I hate these things.","Computer: Connected.",
	"Finally! Can't wait to test this bad boy out.","Hey, we're off! Got a I.P. Change as well. The end is near.","Another network? I find out your new network was better so I installed it.","A third network? I am getting notifications for that..."]
var finalMessages=["Congratulations! You just beat the game! (because FrostBite told N1 is impossible for now...)","Woah, seventy-seven T9 computers? Congratulations, you got a bronze cake.","78 T9 COMPUTERS!? WHOO! The prize would be silver cake!","SEVENTY-NINE TIER IX COMPUTER!?!?! YAHOO!!! The prize would be golden cake!","EIGHTY!?! HOW DID YOU MADE THIS POSSIBLE!?! YOU JUST FOUND A NETWORK!?! OMG!!! YOU GET A PLATINUM CAKE!!!"]
	
function updateElement(elementID,value) {
	document.getElementById(elementID).innerHTML=value
}
	
function updateClass(elementID,value) {
	document.getElementById(elementID).className=value
}
	
function showElement(elementID,style) {
	document.getElementById(elementID).style.display=style
}
	
function hideElement(elementID) {
	document.getElementById(elementID).style.display='none'
}

var notationArray = ["Standard","Scientific","Engineering","Logarithm","Letters","Mixed"]

function abbreviate(i) {
	if(i==0) return "K"
	if(i==1) return "M"
	if(i==2) return "B"
	var units = ["","U","Du","T","Q","Qi","S","Sp","O","N"]
	var tens = ["","D","V","Tg","Qg","Qig","Sg","SPg","Og","Ng"]
	var hundreds = ["","C","Dc","Tc","Qc","Qic","Sc","Spc","Oc","Nc"]
	var higherAbbs = ["","MI","MC","NA","PC","FM"]
	var result=''
	var step=0
	while (i>0) {
		if (i%1000>0) {
			if (step>0&&i%1000==1) {
				if (result=='') {
					result=higherAbbs[step]
				} else {
					result=higherAbbs[step]+'-'+result
				}
			} else {
				var unit = units[i%10]
				var ten = tens[Math.floor(i/10)%10]
				var hundred = hundreds[Math.floor(i/100)%10]
				if (result=='') {
					result=unit+ten+hundred+higherAbbs[step]
				} else {
					result=unit+ten+hundred+higherAbbs[step]+'-'+result
				}
			}
		}
		i=Math.floor(i/1000)
		step++
	}
	return result
}

function format(num,decimalPoints=0,offset=0) {
	num=new Decimal(num)
	if (isNaN(num.mantissa)) {
		return '?'
	} else if (num.gte(1/0)) {
		return 'Infinite'
	} else if (num.lt(999.5)) {
		return num.round()
	} else {
		var abbid=Math.max(Math.floor(num.e/3)-offset,0)
		var mantissa=num.div(Decimal.pow(1000,abbid)).toFixed((abbid>0&&decimalPoints<2)?2:decimalPoints)
		if (mantissa==Math.pow(1000,1+offset)) {
			mantissa=mantissa/1000
			abbid+=1
		}
		if (player.options.notation==0||(player.options.notation==5&&abbid<5)) return mantissa+abbreviate(abbid-1)
		if (player.options.notation==1) return (num.div(Decimal.pow(10,num.e)).toFixed((abbid>0&&decimalPoints<2)?2:decimalPoints))+"e"+num.e
		if (player.options.notation==2) return mantissa+"e"+(abbid*3)
		if (player.options.notation==3) return "e"+Math.round(1000*num.log10())/1000
		if (player.options.notation==4) return mantissa+letter(abbid)
		if (player.options.notation==5&&abbid>4) return mantissa+letter(abbid+22)
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
	player.options.notation++
	if(player.options.notation>notationArray.length-1) player.options.notation=0
	updateElement("notationID",notationArray[player.options.notation])
}

function toggleHotkeys() {
	if (player.options.hotkeys==true)player.options.hotkeys=false;
	else if (player.options.hotkeys==false)player.options.hotkeys=true;
	let enabled = "enabled";
	if (!player.options.hotkeys) enabled="disabled";
	else if (player.options.hotkeys) enabled="enabled";
	updateElement('hotkeysbtn',"Hotkeys: "+enabled)
}

function switchTab(tabid) {
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

function updateCosts() {
	var baseCosts=[10,100,1e3,1e4,1e6,1e8,1e10,1e13,1e16]
	for (i=0;i<9;i++) {
		costs.comp[i]=Decimal.times(baseCosts[i],Decimal.pow(costMult[i],player.compAmount[i]))
	}
	costs.boost=new Decimal(1e3).times(Decimal.pow(4+Math.floor(player.boostPower/100)*2,player.boostPower))
}

function buyGen(tier,bulk=1) {
  if (player.errors.gte(costs.comp[tier])) {
    player.errors = player.errors.sub(costs.comp[tier])
	player.compAmount[tier]+=1
	updateCosts()

    switch (tier) {
      case 0: newStory(0); break;
      case 1: newStory(1); break;
      case 2: newStory(2); break;
      case 3: newStory(3); break;
      case 4: newStory(9); break;
    }
  }
}

function maxGen() {
	for (tier=Math.min(player.prestiges[1]+3,8);tier>-1;tier--) {
		if (player.errors.gte(costs.comp[tier])) {
			var bulk=Math.max(Math.floor(player.errors.div(costs.comp[tier]).times(costMult[tier]-1).add(1).log10()/Math.log10(costMult[tier])),0)
			console.log(bulk)
			player.errors=player.errors.sub(Decimal.pow(costMult[tier],bulk).sub(1).div(costMult[tier]-1).times(costs.comp[tier]))
			player.compAmount[tier]+=bulk
			updateCosts()

			switch (tier) {
			  case 0: newStory(0); break
			  case 1: newStory(1); break;
			  case 2: newStory(2); break;
			  case 3: newStory(3); break;
			  case 4: newStory(9); break;
			}
		}
	}
}

function buyGenUpgrade() {
  if (player.errors.gte(costs.boost)) {
    player.errors=player.errors.sub(costs.boost)
    player.boostPower+=1
    updateCosts()
  }
}
function maxGenUpgrade() {
  if (player.compAmount[2]>0) {
    while (player.errors.gte(costs.boost)) {
      player.errors=player.errors.sub(costs.boost)
      player.boostPower+=1
      updateCosts()
    }
  }
}

function prestige(tier) {
    if (player.compAmount[Math.min(player.prestiges[0],8)]<Math.max(player.prestiges[0]*10-70,10) && tier == 1) return;
    else if (player.compAmount[Math.min(player.prestiges[1]+3,8)]<Math.max(player.prestiges[1]*15-40,20) && tier == 2) return;
    else if (player.compAmount[8]<player.prestiges[2]*40+70 && tier == 3) return;
    else if (tier == Infinity && !confirm('Are you really sure to reset? You will lose everything you have!')) return;
  if (tier==Infinity) {
	//Highest tier - Hard reset
	localStorage.clear('errorSave')
	player.playtime=0
	player.totalErrors=new Decimal(0)
	player.story=-1
	  player.prestiges=[0,0,0]
	updateStory()
  }
  if (tier>2) {
	//Tier 3 - Networks
	player.upgrades=[]
  }
  
  player.errors = new Decimal(10); //current errors
  player.compAmount=[0,0,0,0,0,0,0,0,0]
  player.boostPower=0
  player.time=new Date().getTime()
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
        case 8: newStory(15); break;
      }
      if (player.prestiges[2]==1) newStory(21);
    } else {
      player.prestiges[1] = 0
      if (tier==3) {
        player.prestiges[2]++;
        switch(player.prestiges[2]) {
          case 1: newStory(17); break;
          case 2: newStory(22); break;
          case 3: newStory(23); break;
        }
      }
    }
  }
  updateCosts()
}

function getMultTier(tier) {  let ret = new Decimal.pow(10,tier-1)
  ret = ret.mul(Decimal.pow(Math.pow(1.05,tier),player.compAmount[tier-1]))
  ret = ret.mul(Decimal.pow(2+0.5*player.prestiges[2],player.boostPower))
  if (player.prestiges[0]>=tier) ret = ret.mul(player.upgrades.includes(14)?2.5:2)
  if (player.prestiges[0]>9&&tier==9) ret = ret.mul(Decimal.pow(player.upgrades.includes(14)?2.5:2,player.prestiges[0]-9))
  ret = ret.mul(Decimal.pow(2+Math.floor(player.compAmount[8]/5)*0.5,player.prestiges[1]))
  if (player.upgrades.includes(1)) ret = ret.mul(2)
  if (player.upgrades.includes(2)) ret = ret.mul(5)
  if (player.upgrades.includes(3)) ret = ret.mul(10)
  if (player.upgrades.includes(17)) ret = ret.mul(100)
  if (player.upgrades.includes(18)) ret = ret.mul(1000)
  if (player.upgrades.includes(19)) ret = ret.mul(10000)
  if (player.upgrades.includes(20)) ret = ret.mul(100000)
  if (player.upgrades.includes(21)) ret = ret.mul(1000000)
  if (player.upgrades.includes(4)&&tier==1) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[0])))
  if (player.upgrades.includes(5)&&tier==2) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[1])))
  if (player.upgrades.includes(6)&&tier==3) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[2])))
  if (player.upgrades.includes(7)&&tier==4) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[3])))
  if (player.upgrades.includes(8)&&tier==5) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[4])))
  if (player.upgrades.includes(9)&&tier==6) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[5])))
  if (player.upgrades.includes(10)&&tier==7) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[6])))
  if (player.upgrades.includes(11)&&tier==8) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[7])))
  if (player.upgrades.includes(12)&&tier==9) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[8])))
  if (player.upgrades.includes(13)) ret = ret.mul(Math.pow(1.05,Math.sqrt(player.compAmount[0]+player.compAmount[1]+player.compAmount[2]+player.compAmount[3]+player.compAmount[4]+player.compAmount[5]+player.compAmount[6]+player.compAmount[7]+player.compAmount[8])))
  if (player.upgrades.includes(14)&&tier<5) ret = ret.mul(10)
  if (player.upgrades.includes(22)) ret = ret.mul(1000000)
  return ret
}

function getEPS() {
  let ret = new Decimal(0);
  for (let i=0;i<9;i++) {
    ret = ret.add(Decimal.mul(getMultTier(i+1),player.compAmount[i]))
  }
  return ret;
}

function checkIfAffordable(id) {
	if (player.upgrades.includes(id)) return false
	switch (id) {
		case 1: if (player.errors.lt(1e4)) {return false}; return true
		case 2: if (player.errors.lt(1e10)) {return false}; return true
		case 3: if (player.errors.lt(1e20)) {return false}; return true
		case 17: if (player.errors.lt(1e30)) {return false}; return true
		case 18: if (player.errors.lt(1e35)) {return false}; return true
		case 19: if (player.errors.lt(1e40)) {return false}; return true
		case 20: if (player.errors.lt(1e50)) {return false}; return true
		case 21: if (player.errors.lt(1e65)) {return false}; return true
		case 4: if (player.errors.lt(1e35)||player.compAmount[0]<100) {return false}; return true
		case 5: if (player.errors.lt(1e40)||player.compAmount[1]<100) {return false}; return true
		case 6: if (player.errors.lt(1e50)||player.compAmount[2]<100) {return false}; return true
		case 7: if (player.errors.lt(1e65)||player.compAmount[3]<100) {return false}; return true
		case 8: if (player.errors.lt(1e75)||player.compAmount[4]<100) {return false}; return true
		case 9: if (player.errors.lt(1e85)||player.compAmount[5]<100) {return false}; return true
		case 10: if (player.errors.lt(1e100)||player.compAmount[6]<100) {return false}; return true
		case 11: if (player.errors.lt(1e115)||player.compAmount[7]<100) {return false}; return true
		case 12: if (player.errors.lt(1e125)||player.compAmount[8]<100) {return false}; return true
		case 13: if (player.errors.lt(1e140)) return false
			for (check=4;check<13;check++) {
				if (!player.upgrades.includes(check)||player.compAmount[check-4]<110) return false
			}
			return true
		case 14: if (player.prestiges[0]<9) {return false}; return true
		case 15: if (player.prestiges[1]<5) {return false}; return true
		case 16: if (player.prestiges[1]<7) {return false}; return true
		case 22: if (player.prestiges[2]<1||player.errors.lt(1e3)) {return false}; return true
	}
	return false
}

function buyUpg(id) {
	if (!checkIfAffordable(id)) return
	switch (id) {
		case 1: player.errors=player.errors.sub(1e4); break
		case 2: player.errors=player.errors.sub(1e10); break
		case 3: player.errors=player.errors.sub(1e20); break
		case 17: player.errors=player.errors.sub(1e30); break
		case 18: player.errors=player.errors.sub(1e35); break
		case 19: player.errors=player.errors.sub(1e40); break
		case 20: player.errors=player.errors.sub(1e50); break
		case 21: player.errors=player.errors.sub(1e65); break
		case 4: player.errors=player.errors.sub(1e35); break
		case 5: player.errors=player.errors.sub(1e40); break
		case 6: player.errors=player.errors.sub(1e50); break
		case 7: player.errors=player.errors.sub(1e65); break
		case 8: player.errors=player.errors.sub(1e75); break
		case 9: player.errors=player.errors.sub(1e85); break
		case 10: player.errors=player.errors.sub(1e100); break
		case 11: player.errors=player.errors.sub(1e115); break
		case 12: player.errors=player.errors.sub(1e125); break
		case 13: player.errors=player.errors.sub(1e140); break
	}
	player.upgrades.push(id)
}

function gameTick() {
  if (player.time>0) {
	  var s=(new Date().getTime()-player.time)/1000 // number of seconds since last tick
	  var maximumAdd = getEPS().mul(s).min(Decimal.sub(Number.MAX_VALUE,player.errors))
	  player.errors = player.errors.add(maximumAdd);
	  player.totalErrors = player.totalErrors.add(maximumAdd);
	  player.playtime+=s
  }
  player.time = new Date().getTime()
  updateElement('errors',format(player.errors)) //this is the base, except in the parentheses add the HTML tag of the thing you're changing
  updateElement('eps',format(getEPS()))
  if (player.compAmount[2]>0) {
	  showElement('genUpgrade','block');
	  updateElement('genIncrease',(4+player.prestiges[2])/2);
	  updateElement('genIncreaseCost','成本: ' + format(costs.boost));
	  updateElement('genBoost',format(Decimal.pow(2+0.5*player.prestiges[2],player.boostPower)));
	  if (player.errors.lt(costs.boost)) updateClass('genIncreaseCost','cantBuy')
	  else updateClass('genIncreaseCost','')
  } else {
	  hideElement('genUpgrade')
  }
  if (tab!=oldtab) {
	  hideElement(oldtab+'Tab')
	  showElement(tab+'Tab','block')
	  oldtab=tab
  }
  if (player.prestiges[0]<Math.min(player.prestiges[1]+4,player.upgrades.includes(16)?Math.max(player.prestiges[1]+4,9):9)) {
	  updateElement('prestige1Gen',Math.max(player.prestiges[0]*10-70,10)+' Tier '+ROMAN_NUMERALS[Math.min(player.prestiges[0]+1,9)])
	  hideElement('maxout')
	  showElement('abletoprestige','inline')
  } else {
	  hideElement('abletoprestige')
	  showElement('maxout','inline')
  }
  updateElement('prestige2Gen',format(Math.max(player.prestiges[1]*15-40,20),0,1)+' Tier '+ROMAN_NUMERALS[Math.min(player.prestiges[1]+4,9)])
  if (player.prestiges[1]<3) {
	  hideElement('upgcate1')
	  updateElement('upgradereq','Unlocks at 3 I.P. changes')
  } else {
	  showElement('upgcate1','inline')
	  updateElement('upg1button','成本: '+format(1e4))
	  updateElement('upg2button','成本: '+format(1e10))
	  updateElement('upg3button','成本: '+format(1e20))
	  updateElement('upg4button','成本: 100 TI電腦和'+format(1e35))
	  updateElement('upg5button','成本: 100 TII電腦和'+format(1e40))
	  updateElement('upg6button','成本: 100 TIII電腦和'+format(1e50))
	  updateElement('upg7button','成本: 100 TIV電腦和'+format(1e65))
	  updateElement('upg8button','成本: 100 TV電腦和'+format(1e75))
	  updateElement('upg9button','成本: 100 TVI電腦和'+format(1e85))
	  updateElement('upg10button','成本: 100 TVII電腦和'+format(1e100))
	  updateElement('upg11button','成本: 100 TVIII電腦和'+format(1e115))
	  updateElement('upg12button','成本: 100 TIX電腦和'+format(1e125))
	  updateElement('upg17button','成本: '+format(1e30))
	  updateElement('upg18button','成本: '+format(1e35))
	  updateElement('upg19button','成本: '+format(1e40))
	  updateElement('upg20button','成本: '+format(1e50))
	  updateElement('upg21button','成本: '+format(1e65))
	  updateElement('upg22button','成本: 第一個網絡和'+format(1e3))
	  var check=0
	  for (i=4;i<13;i++) {
		  if (player.upgrades.includes(i)) check++
	  }
	  if (check>8) {
		  showElement('upg13','inline')
		  updateElement('upg13button','成本: 各110電腦和'+format(1e140))
	  } else {
		  hideElement('upg13')
	  }
	  for (i=1;i<14;i++) {
		  if (player.upgrades.includes(i)) updateClass('upg'+i+'button','boughtUpgrade')
		  else if (checkIfAffordable(i)) updateClass('upg'+i+'button','')
		  else updateClass('upg'+i+'button','cantBuy')
	  }
	  for (i=17;i<=22;i++) {
		  if (player.upgrades.includes(i)) updateClass('upg'+i+'button','boughtUpgrade')
		  else if (checkIfAffordable(i)) updateClass('upg'+i+'button','')
		  else updateClass('upg'+i+'button','cantBuy')
	  }
	  updateElement('upgradereq','Next at 5 I.P. changes')
  }
  if (player.prestiges[1]<5) {
	  updateElement('ipChange','Gain Tier '+ROMAN_NUMERALS[player.prestiges[1]+5]+' Computer, but resets everything.')
	  updateElement('prestige2Type','I.P. Change')
	  showElement('upgradereq','inline')
	  hideElement('upgcate2')
  } else {
	  updateElement('ipChange','Gain boost for computers, but resets everything.')
	  updateElement('prestige2Type','Internet boost')
	  hideElement('upgradereq')
	  showElement('upgcate2','inline')
	  for (i=14;i<17;i++) {
		  if (player.upgrades.includes(i)) updateClass('upg'+i+'button','boughtUpgrade')
		  else if (checkIfAffordable(i)) updateClass('upg'+i+'button','')
		  else updateClass('upg'+i+'button','cantBuy')
	  }
  }
  if (player.compAmount[8]>=100||player.prestiges[2]>=2) {
	  showElement('theEndButton','inline')
	  newStory(16)
  } else {
	  hideElement('theEndButton')
  }
  updateElement('prestige3Req',player.prestiges[2]*40+70)
  updateElement('netMulti',(5+player.prestiges[2])/2)
  if (tab=='computers') {
	  for (let i=0;i<Math.min(player.prestiges[1]+4,9);i++) {
		  updateElement("cop"+(i+1),"Cost: " + format(costs.comp[i]) + " (" + player.compAmount[i] + ")")
		  if (player.errors.lt(costs.comp[i])) updateClass("cop"+(i+1),'cantBuy')
		  else updateClass("cop"+(i+1),'')
	  }
	  for (i=0;i<5;i++) {
		  if (player.prestiges[1]>i) {
			showElement(TIER_NAMES[i+4]+'Comp','block')
		  } else {
			hideElement(TIER_NAMES[i+4]+'Comp')
		  }
	  }
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
  if (tab=='theEnd') {
	  updateElement('finalMessage',player.prestiges[2]>0?finalMessages[4]:finalMessages[player.compAmount[8]-76])
  }
}

function save() {
	localStorage.setItem('errorSave',btoa(JSON.stringify(player)))
}

function load(savefile) {
  try {
	  savefile=JSON.parse(atob(savefile));
	  //To prevent to trying to load a save file with glitches.

	  //when adding a new player variable, PLEASE ADD A NEW LINE!!
	  if (savefile.version == undefined) savefile.version = 0;
	  if (savefile.build == undefined) savefile.build = 0;
	  if (savefile.version <= 0) {
		  if (savefile.build < 1) {
			for (let i=0;i<9;i++) {
				savefile.compCost[i] = parseint(savefile.compCost[i])
				savefile.compPow[i] = parseint(savefile.compPow[i])
			}
		  }
		  if (savefile.build < 2) {
			savefile.time=new Date().getTime()
		  }
		  if (savefile.build < 3) {
			savefile.prestiges=[savefile.prestige1,savefile.prestige2,0]
			savefile.timeUpgrades=0
			delete savefile.prestige1
			delete savefile.prestige2
		  }
		  if (savefile.build < 4) {
			savefile.playtime=0
			savefile.totalErrors=0
		  }
		  if (savefile.build < 5) {
			savefile.boost=1
			delete savefile.timeUpgrades
		  }
		  if (savefile.build<6) {
			savefile.genUpgradeCost=1000
		  }
		  if (savefile.build<7) {
			savefile.story-=1
		  }
		  if (savefile.build<8) {
			savefile.notation=0
		  }
		  if (savefile.build<10) {
			savefile.boostPower=Math.floor(Decimal.log10(savefile.boost)/Math.log10(2))
			if (isNaN(savefile.boost)) savefile.boostPower=0
			delete savefile.compCost
			delete savefile.compPow
			delete savefile.boost
			delete savefile.genUpgradeCost
		  }
		savefile.build = 0
	  }
	  if (savefile.version <= 1) {
	    if (savefile.build < 1) {
			savefile.upgrades=[]
		}
	    if (savefile.build < 2) {
			if (savefile.upgrades.includes(1)) savefile.upgrades=[3]
		}
	    if (savefile.build < 12) {
			savefile.options={hotkeys:true,
				notation:savefile.notation}
			delete savefile.notation
		}
	  }
	  savefile.version = player.version
	  savefile.build = player.build
	  
	  //if the value is a Decimal, set it to be a Decimal here.
	  if (savefile.errors=='NaN') savefile.errors=new Decimal(10)
	  else savefile.errors = new Decimal(savefile.errors)
	  savefile.totalErrors = new Decimal(savefile.totalErrors)
	  
	  player=savefile
	  //And then safety put the save file to player!
	  
      updateCosts()
	  updateStory()
	  updateElement("notationID",notationArray[player.options.notation])
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
	Table.innerHTML=''
    for (var i=0;i<=player.story;i++) {
		var row=Table.insertRow(i)
		row.innerHTML='<td>'+storyMessages[i]+'</td>'
    }
}
window.addEventListener('keydown', function(event) {
    if (event.keyCode == 17) controlDown = true;
    if (event.keyCode == 16) shiftDown = true;
}, false);


window.addEventListener('keydown', function(event) {
	if (!player.options.hotkeys) return;
    const tmp = event.keyCode;
    switch (tmp) {
        case 77: // M
            document.getElementById("maxAll").onclick()
        break;
		    
        case 84: // T
		    if (shiftDown) buyGenUpgrade(); 
        else  maxGenUpgrade();
        break;
    }    
}, false);


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
				    gameTick()
				} catch (e) {
					console.log(e)
				}
				tickspeed=(new Date().getTime()-startTime)*0.2+tickspeed*0.8
				updated=true
			},tickspeed)
		}
	},0)
	setInterval(save,1000);
}

