//game.js and only game.js-v1.5 edits
var shiftDown=false;
var controlDown=false;
const defaultPlayer = {
  errors: new Decimal(10), //current errors
  totalErrors: new Decimal(0), //total errors that display in stats
  compAmount: [0,0,0,0,0,0,0,0,0], //amounts that are shown on computer button
  boostPower:0, //prodBoost
  prestiges: [0,0,0,0], //amount of prestiges where [X,0,0] is X UCs, [0,X,0] is X I.P. changes/internet boosts and [0,0,X] is X networks, and [0,0,0,X] is warnings.
  story: -1, //amount of story.
  upgrades: {}, //see lines 261-274
  downtimeChallenge: 0,
  dtUpgrades: [],
  dtChallCompleted: {},
  bugfixes: new Decimal(0),
  warningPlaytime: 0,
  fastestWarning: Number.MAX_VALUE,
  lastWarnings: [],
  warnings: new Decimal(0), //displayed on the bottom bar
  totalWarnings: new Decimal(0), //displayed in stats
  warningUpgrades: [],
  warnUpgsGenerationLastTick: {},
  generatedCompAmount: [0,0,0,0,0,0,0,0,0],
  errorExpansion:{pieceSize:100,
	  expansions:0,
	  upgrades:[]},
  playtime: 0, //total time spent online ingame
  time: 0, //total time displayed in stats
  version: 1.5, //very important
  build: 24, //used for us to communicate commits, helps a lot
  hotfix: 1, //another way to use commits
  options: {
    hotkeys:true, //whether or not hotkeys are enabled (on by default)
    notation:0 //notation setting, see options
  },
  canStopBugFixer: true,
  bugFixerOfflineTimer: 0
}
Object.freeze(defaultPlayer) //I will want to die if defaultPlayer gets edited by game again...
player = defaultPlayer
tab='computers'
oldtab=tab
dttab='downtimeChallenges'
olddttab=dttab
statsTab='statisticsTab'
oldStatsTab=statsTab
wartab='warUpgTab'
oldwartab=wartab
EEtab='UpgAndPiecesTab'
oldEEtab='UpgAndPiecesTab'
percentage=0
realPercentage=0
gameSpeed = 1
inputing = false
const story = ['','','','','']
const TIER_NAMES = ['first','second','third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']; // can add more if more gens/story elements, cuz that uses this too
const ROMAN_NUMERALS=[]
const costMult=[2,2.5,3,4,5,6,8,10,12]

var costs={comp:[new Decimal(10),new Decimal(100),new Decimal(1e3),new Decimal(1e4),new Decimal(1e6),new Decimal(1e8),new Decimal(1e10),new Decimal(1e13),new Decimal(1e16)],boost:new Decimal(0),warUpgs:[1,1,2,1,2,5,10,15,20,30,30,60,120],DTU:[1e50,1e30,1e40,1e35,1e40,1e40,1e75,1e40,1e50,1e45,1e50,1e50,1e60,1e55,1e60,1e60,1e75,1e65,1e100,1e70],pieceSize:new Decimal(0),eeUpgrades:[]}
var storyMessages=["Pancakes is ready!",
"Wakey wakey! Aw, c'mon, you still got the rest of the day to sleep. Get up baby, get up!",
"Nice! A Tier III Computer. Well deserved.",
"A Tier IV Computer is great, isn't it?",
"Computers are waking up...",
"Ah, here we are. Awake and operational.",
"Network is being horrible. These upgrades don't do anything. What I'd give for an ethernet cord.",
"I still haven't introduced myself? I'm your first ever Tier I computer. I can't believe you've finally had the care to upgrade me.",
"Trust me. I stay through it all. Keep getting these I.P. Changes and we'll be set in no time.",
"Errors? Still? You can do better than that!",
"Atta boy! Keep getting em. Also, Tier VI Computers are my best friends. Get more!",
"Tier VII computers are bullies. Get through them NOW.",
"Tier VIII! Soon, everybody, soon.",
"The Internet Boosts are in sight. Get 20 Tier IX computers to buy one.",
"I got a boost? Good job, you get a <i>small</i> prize.",
"Networks was found, but all are private for me. :(",
"The PC found a network! This seems legit. Let's hop on.",
"Computer: Connecting network. Please wait, this may take a few minutes.",
"Aw, really? I hate these things.",
"Computer: Connected.",
"Finally! Can't wait to test this bad boy out.",
"Hey, we're off! Got a I.P. Change as well. The end is near.",
"You just did a downtime! Congraturation! now there are only 3 left......",
"You have done ALL these DCs! Those upgrades will bring you higher then you can ever imagine!",
"Mighty large number you got there! Sorry, but it's mandatory operation to reset it.",
"More downtime? Wait a minute... just do it anyways.",
"Now you've gotta do it all over again. But you are <i>stronger</i>. Get out there! Make me proud!",
"Congratulations! You just beat the game! (for now...)<br>Why not you play other games like the inspiration at the title screen until the next update comes out?"]
var warnUpgsGenerationDuration={6:2,7:4,8:8,9:16,10:Number.MAX_VALUE}

function updateElement(elementID,value) {
  document.getElementById(elementID).innerHTML=value
}
  
function updateClass(elementID,value) {
  document.getElementById(elementID).className=value
}
  
function showElement(elementID,style="inline-block") {
  document.getElementById(elementID).style.display=style
}
  
function hideElement(elementID) {
  document.getElementById(elementID).style.display='none'
}
function exitChall() {
  if (!player.downtimeChallenge>0) return;
  prestige(3,-1)
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

function format(num,decimalPoints=0,offset=0,rounded=true) {
  num=new Decimal(num)
  if (num.lt(10)&&!rounded) {
	  var sub10=num.toFixed(decimalPoints)
	  if (parseFloat(sub10)<10) return sub10
  }
  if (isNaN(num.mantissa)) {
    return '?'
  } else if (num.gte(1/0)) {
    return 'Infinite'
  } else if (num.lt(999.5)) {
    return Math.round(num.toNumber())
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
    return "a short time"
  } else if (s < Infinity) {
    times = {'year':31556952,
    'month':2592000,
    'day':86400,
    'hour':3600,
    'minute':60,
    'second':1}
    out = []
    for (var name in times) {
      len = times[name]
      if (s > len) {
        amounts = Math.floor(s/len)
        out.push(amounts.toString() + " " + name + (s>1?'s':''))
        s = s % len
      }
    }
    if (out.length >= 2) {
      var first = out.pop()
      var second = out.pop()
      out.push(second + ' and ' + first)
    }
    return out.join(', ')
  } else {
    return 'forever'
  }
}

function switchNotation() {
  player.options.notation++
  if(player.options.notation>notationArray.length-1) player.options.notation=0
  updateElement("notationID",notationArray[player.options.notation])
}

function toggleHotkeys() {
	player.options.hotkeys=!player.options.hotkeys
	if (player.options.hotkeys) {
		updateElement('hotkeysbtn',"Hotkeys: Enabled")
		showElement('hotkeyText','inline-block')
	} else {
		updateElement('hotkeysbtn',"Hotkeys: Disabled")
		hideElement('hotkeyText')
	}
}

function switchTab(tabid) {
  tab=tabid
}

function switchDTTab(tabid) {
  dttab=tabid
}

function switchWarTab(tabid) {
  wartab=tabid
}

function switchStatsTab(tabid) {
  statsTab=tabid
}

function switchEETab(tabid) {
  EEtab=tabid
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
  costs.pieceSize=Decimal.pow(2+player.errorExpansion.expansions*0.5,Math.floor(100/player.errorExpansion.pieceSize))
}

function buyGen(tier,bulk=1) {
  if (player.errors.gte(costs.comp[tier]) && !(player.downtimeChallenge==3 && tier != 0 && player.compAmount[tier] >= player.compAmount[tier-1])) {
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
  for (i=Math.min(player.prestiges[1]+3,8);i>-1;i--) {
    if (player.errors.gte(costs.comp[i]) && !(player.downtimeChallenge==3 && i != 0 && player.compAmount[i] >= player.compAmount[i-1])) {
      var bulk=Math.max(Math.floor(player.errors.div(costs.comp[i]).times(costMult[i]-1).add(1).log10()/Math.log10(costMult[i])),0)
      if (player.downtimeChallenge==3 && i != 0) bulk = Math.min(bulk,player.compAmount[i-1] - player.compAmount[i])
      player.errors=player.errors.sub(Decimal.pow(costMult[i],bulk).sub(1).div(costMult[i]-1).times(costs.comp[i]))
      player.compAmount[i]+=bulk
      updateCosts()

      switch (i) {
        case 0: newStory(0); break;
        case 1: newStory(1); break;
        case 2: newStory(2); break;
        case 3: newStory(3); break;
        case 4: newStory(9); break;
      }
    }
  }
}

function buyGenUpgrade() {
  if (player.errors.gte(costs.boost) && PBunlocked()) {
    player.errors=player.errors.sub(costs.boost)
    player.boostPower+=1
    if (player.downtimeChallenge==7) {
		for (i=0;i<9;i++) {
			player.compAmount[i]=Math.max(player.compAmount[i]-1,0)
		}
    }
    updateCosts()
  }
}

function maxGenUpgrade() {
  while (player.errors.gte(costs.boost) && PBunlocked()) {
    player.errors=player.errors.sub(costs.boost);
    player.boostPower+=1;
    if (player.downtimeChallenge==7) {
		for (i=0;i<9;i++) {
			player.compAmount[i]=Math.max(player.compAmount[i]-1,0)
		}
    }
    updateCosts();
  }
}

function prestige(tier,challid=0) {
  if (challid==0) {
    if ((player.compAmount[Math.min(player.prestiges[0],8)]<Math.max(player.prestiges[0]*10-70,10)||player.downtimeChallenge==11) && tier == 1) return;
    else if (tier == 2) {
      if (player.prestiges[1]<=5) {
        if (player.compAmount[player.prestiges[1]+3] < (haveDU(15)?15:20)) return;
      } else if (player.compAmount[8] < 15*(player.prestiges[1]-5)+(haveDU(15)?15:20)) return;
    }
    else if ((player.compAmount[8]<player.prestiges[2]*250+50||(player.downtimeChallenge==9&&challid==0)) && tier == 3) return;
    else if (player.errors.lt(Number.MAX_VALUE) && tier == 4) return;
    else if (tier == Infinity && !confirm('Are you really sure to reset? You will lose everything you have!')) return;
  } else {
	if (tier==3) {
	  if (challid==-1) if (!confirm('If you exit the challenge, you return to the normal world but lose everything except your networks.')) return;
	  if (challid>0) if (!confirm('If you start the challenge, you will reset as normal. These challenges will not reset on prestiges but reset when you reach the required amount of errors!')) return;
	}
  }
  if (tier==Infinity) {
    //Highest tier - Hard reset
    localStorage.clear('errorSave')
    load(btoa(JSON.stringify(defaultPlayer)))
    console.log('I mean \'Game resetted!\', sorry about that.')
    updateStory()
    warnUpgsGenerationDuration[10]=Number.MAX_VALUE
    save()
    location.reload()
  }
  if (tier>3) {
    //Tier 4 - Warnings
    player.dtChallCompleted= {}
    player.dtUpgrades = []
    var warningGain=1
    if (tier==4) {
    	if (player.fastestWarning>player.warningPlaytime) {
    		player.fastestWarning=player.warningPlaytime
    		warnUpgsGenerationDuration[10]=player.fastestWarning*1000
    	}
    	if (challid==0?player.lastWarnings.unshift([player.warningPlaytime,warningGain])>5:false) {
    		player.lastWarnings.pop()
    	}
    }
    player.warningPlaytime=0
    player.warnings=(tier==4)?player.warnings.add(warningGain):new Decimal(0)
    player.totalWarnings=(tier==Infinity)?new Decimal(0):player.totalWarnings.add(warningGain)
  }
  if (tier>2) {
    //Tier 3 - Networks
    if (tier == 3 && haveUpg(14)) player.upgrades={14: 1};
    else player.upgrades={};
  }
  
  player.errors = new Decimal(10); //current errors
  player.generatedCompAmount=[0,0,0,0,0,0,0,0,0]
  player.boostPower=0
  player.time=new Date().getTime()
  player.genUpgradeCost=new Decimal(1000)
  player.bugfixes=new Decimal(0)
  if (tier==1) {
    player.prestiges[0] += (challid == -2?player.prestiges[0]>0?-player.prestiges[0]:0:1)
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
  }
  if (tier > 1 || challid == -2) {
    player.canStopBugFixer = true
    player.bugFixerOfflineTimer = 0
  }
  if (tier==2) {
    player.prestiges[1] += (challid == -2?(player.prestiges[1]>0?-1:0):1)
    switch (player.prestiges[1]) {
      case 1: newStory(8); break;
      case 2: newStory(10); break;
      case 3: newStory(11); break;
      case 4: newStory(12); break;
      case 5: newStory(13); break;
      case 6: newStory(14); break;
      case 8: newStory(15); break;
    }
    if (player.prestiges[2]==1) newStory(21);
  } else if (tier>2) {
    if (haveWU(12)) player.prestiges[1]=6
    else if (haveWU(11)) player.prestiges[1]=3
    else player.prestiges[1]=0
  }
  if (tier==3) {
    player.downtimeChallenge=Math.max(challid,0)
    if (challid==0) player.prestiges[2]++;
	if (challid==11) player.prestiges[2]=0
    switch(player.prestiges[2]) {
      case 1: newStory(17); break;
    }
  } else if (tier>3) {
    player.prestiges[2] = haveWU(13)?1:0
    player.downtimeChallenge=0
  }
  if (tier==4) {
    player.prestiges[3]++;
    switch(player.prestiges[3]) {
      case 1: newStory(25); break;
      case 2: newStory(26); break;
    }
  } else if (tier>4) {
    player.prestiges[3] = 0
  }
  player.compAmount=(tier<4&&haveDU(3))?[1,1,1,1,0,0,0,0,0]:[0,0,0,0,0,0,0,0,0]
  if (haveDU(9)) player.prestiges[1] = Math.max(player.prestiges[1],1)
  updateCosts()
}

function completeChall() {
  id = player.downtimeChallenge
  prestige(3,-2)
  if (player.dtChallCompleted[id-1]==undefined) player.dtChallCompleted[id-1]=1
  else player.dtChallCompleted[id-1]++
  switch (Object.keys(player.dtChallCompleted).length) {
    case 1: newStory(22);break;
    case 4: newStory(23);break;
  } 
  player.bugfixes = 0
}

function getMultTier(tier) {  let ret = new Decimal.pow(((player.downtimeChallenge==4&&tier>5)||player.downtimeChallenge==6)?5:10,tier-1)
  ret = ret.mul(Decimal.pow(Math.pow(1.05 + Math.max((tier-4)/100,0),tier),player.compAmount[tier-1]))
  ret = ret.mul(Decimal.pow(Math.pow((haveDU(1)?2.1:2)+0.5*(player.downtimeChallenge==9?0:player.prestiges[2]),(player.downtimeChallenge==1)?0.5:1),player.boostPower)) // PB
  ret = ret.mul(Decimal.pow(2+Math.floor(player.compAmount[8]/5)*0.5,player.prestiges[1]))
  if (player.prestiges[0]>=tier) ret = ret.mul(haveDU(7)?3:haveUpg(13)?2.5:2) // UC
  if (player.prestiges[0]>9&&tier==9) ret = ret.mul(Decimal.pow(haveDU(7)?3:2,player.prestiges[0]-9)) // IB
  if (haveUpg(1,false)) ret = ret.mul(Decimal.pow(2,player.upgrades[1]))
  if (haveUpg(2,false)) ret = ret.mul(Decimal.pow(2,player.upgrades[2]))
  if (haveUpg(3)&&tier==1) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[0])))
  if (haveUpg(4)&&tier==2) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[1])))
  if (haveUpg(5)&&tier==3) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[2])))
  if (haveUpg(6)&&tier==4) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[3])))
  if (haveUpg(7)&&tier==5) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[4])))
  if (haveUpg(8)&&tier==6) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[5])))
  if (haveUpg(9)&&tier==7) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[6])))
  if (haveUpg(10)&&tier==8) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[7])))
  if (haveUpg(11)&&tier==9) ret = ret.mul(Math.pow(1.15,Math.sqrt(player.compAmount[8])))
  if (haveUpg(12)) ret = ret.mul(Math.pow(1.05,Math.sqrt(player.compAmount.reduce((a, b) => a + b, 0))))
  if (haveUpg(14)) ret = ret.mul(5)
  if (haveWU(1)) ret = ret.mul(getUpgradeMultiplier(1))
  if (haveWU(2)) ret = ret.mul(getUpgradeMultiplier(2))
  if (haveWU(3)) ret = ret.mul(getUpgradeMultiplier(3,tier))
  if (haveWU(4)) ret = ret.mul(getUpgradeMultiplier(4))
  // Insert DT stuffs here
  if (haveDU(Math.ceil(tier/2)*2)) ret = ret.mul(2)
  if (haveDU(Math.ceil(tier/2)*2+10)) ret = ret.mul(10)
  if (haveDU(5) && tier == 9) ret = ret.mul(Decimal.pow(1.1,player.compAmount[8]))
  if (haveDU(7)) ret = ret.mul(2,player.prestiges[1])
  if (haveDU(11)) ret = ret.mul(1.25)
  if (haveDU(13)) ret = ret.mul(1+(player.boostPower/100))
  if (tier >= 5 && player.downtimeChallenge==2) ret = new Decimal(0)
  if (player.downtimeChallenge==3) ret = ret.div(1+(player.compAmount.reduce((a, b) => a + b, 0)/5))
  return ret
}

function getEPS() {
  let ret = new Decimal(0);
  for (let i=0;i<9;i++) {
    ret = ret.add(Decimal.mul(getMultTier(i+1),player.compAmount[i]+player.generatedCompAmount[i]))
  }
  return ret;
}

function checkIfAffordable(id) {
  if (haveUpg(id)) return false
  switch (id) {
    case 1: if (player.errors.lt(Decimal.pow10(Math.pow(1.5,2+(haveUpg(1,false)?player.upgrades[1]:0))))) {return false}; return true
    case 2: if (player.errors.lt(Decimal.pow10(10+35*(haveUpg(2,false)?player.upgrades[2]:0)))) {return false}; return true
    case 3: if (player.errors.lt(1e35)||player.compAmount[0]<100) {return false}; return true
    case 4: if (player.errors.lt(1e40)||player.compAmount[1]<100) {return false}; return true
    case 5: if (player.errors.lt(1e50)||player.compAmount[2]<100) {return false}; return true
    case 6: if (player.errors.lt(1e65)||player.compAmount[3]<100) {return false}; return true
    case 7: if (player.errors.lt(1e75)||player.compAmount[4]<100) {return false}; return true
    case 8: if (player.errors.lt(1e85)||player.compAmount[5]<100) {return false}; return true
    case 9: if (player.errors.lt(1e100)||player.compAmount[6]<100) {return false}; return true
    case 10: if (player.errors.lt(1e115)||player.compAmount[7]<100) {return false}; return true
    case 11: if (player.errors.lt(1e125)||player.compAmount[8]<100) {return false}; return true
    case 12: if (player.errors.lt(1e140)) return false
             for (check=3;check<12;check++) {
               if (!haveUpg(check)||player.compAmount[check-4]<110) return false
             }
             return true
    case 13: if (player.prestiges[0]<9) {return false}; return true
    case 14: if (player.prestiges[1]<5) {return false}; return true
    case 15: if (player.prestiges[1]<7) {return false}; return true
    case 16: if (player.prestiges[2]<1||player.errors.lt(1e3)) {return false}; return true
}
  return false
}

function buyUpg(id) {
  if (!checkIfAffordable(id)) return
  switch (id) {
    case 1: player.errors=player.errors.sub(Decimal.pow10(Math.pow(1.5,2+(haveUpg(1,false)?player.upgrades[1]:0)))); break
    case 2: player.errors=player.errors.sub(Decimal.pow10(10+35*(haveUpg(2,false)?player.upgrades[2]:0))); break
    case 3: player.errors=player.errors.sub(1e35); break
    case 4: player.errors=player.errors.sub(1e40); break
    case 5: player.errors=player.errors.sub(1e50); break
    case 6: player.errors=player.errors.sub(1e65); break
    case 7: player.errors=player.errors.sub(1e75); break
    case 8: player.errors=player.errors.sub(1e85); break
    case 9: player.errors=player.errors.sub(1e100); break
    case 10: player.errors=player.errors.sub(1e115); break
    case 11: player.errors=player.errors.sub(1e125); break
    case 12: player.errors=player.errors.sub(1e140); break
    case 16: player.errors=player.errors.sub(1e3); break
  }
  if (haveUpg(id,false)) player.upgrades[id]++
  else player.upgrades[id]=1
}

function getUpgradeMultiplier(id,tier) {
  if (id==1) mp = 1+Math.sqrt((player.playtime+1)/86400*2)
  if (id==2) mp = player.warningUpgrades.length*2
  if (id==3) mp = Math.pow(2,Math.floor(player.compAmount[tier-1]/10))
  if (id==4) mp = player.totalWarnings*2
  if (id==5) mp = Math.pow(Math.floor(player.warnings),2)
  return Math.max(1, mp)
}

function buyWarUpg(id) {
  if (!haveWU(id)) {
    if (player.warnings.gte(costs.warUpgs[id-1])) {
      player.warnings=player.warnings.sub(costs.warUpgs[id-1])
      player.warningUpgrades.push(id)
      if (id>5&&id<11) player.warnUpgsGenerationLastTick[id]=player.playtime
    }
  }
}

function buyPieceSizeUpgrade(id) {
  if (!player.errorExpansion.pieceSize>1) {
    if (player.warnings.gte(costs.pieceSize)) {
      player.warnings=player.warnings.sub(costs.pieceSize)
      player.errorExpansion.pieceSize=Math.max(player.errorExpansion.pieceSize-1,0)
	  updateCosts()
    }
  }
}

function gameTick() {
  var ePS=getEPS()
  if (haveDU(19) && Math.random() <= 0.01) ePS *= 100
  var errorstobugfixesRatio=new Decimal(0)
  if (player.time>0) {
    s=((new Date().getTime()-player.time)/1000)*(player.options.debug?gameSpeed:1)*(player.downtimeChallenge == 8?0.1:1) // number of seconds since last tick
    player.bugFixerOfflineTimer = Math.max(player.bugFixerOfflineTimer-s,0)
    var addAmount=ePS.mul(s).min(Decimal.sub(Number.MAX_VALUE,player.errors))
    player.errors = player.errors.add(addAmount);
    player.totalErrors = player.totalErrors.add(addAmount);
    player.playtime+=s
    player.warningPlaytime+=s
    if (player.errors.gte(Number.MAX_VALUE)) prestige(4);
    if (player.downtimeChallenge==5 && ePS.gt(0) && player.bugFixerOfflineTimer == 0) {
      timeLeft = s
      do {
        player.bugfixes=player.bugfixes.add(player.bugfixes.div(Math.max(Math.min(80-player.errors.log10(),10),3)).max(1).times(Math.min(0.01,timeLeft)))
        errorstobugfixesRatio=player.errors.div(player.bugfixes)
        if (errorstobugfixesRatio.lt(1)) prestige(2,-2)
        timeLeft -= 0.01
      } while (timeLeft > 0)
    }
    for (i in player.warnUpgsGenerationLastTick) {
		i=parseInt(i)
    	var occurrences=Math.floor((player.playtime-player.warnUpgsGenerationLastTick[i])/warnUpgsGenerationDuration[i])
    	if (occurrences>0) {
			player.warnUpgsGenerationLastTick[i]+=occurrences*warnUpgsGenerationDuration[i]
			if (i==10) {
				player.warnings=player.warnings.add(occurrences)
			} else {
				player.generatedCompAmount[i-6]+=occurrences
			}
    	}
    }
    move()
  }
  player.time = new Date().getTime()
  updateElement('errors',format(player.errors)) //this is the base, except in the parentheses add the HTML tag of the thing you're changing
  updateElement('eps',(ePS.eq(0))?0:format(ePS,1,0,false))
  if (player.downtimeChallenge==5) {
	  showElement('bugfixes','block')
	  var hurryUp=false
	  if (player.errors.gt(1e70)) hurryUp=errorstobugfixesRatio.lt(1e10)
      if (player.bugFixerOfflineTimer > 0) {
        updateElement('bugfixes','<b>There are '+format(player.bugfixes,1,0,false)+' bugfixes. (Stopped for '+player.bugFixerOfflineTimer.toFixed(1)+' seconds)</b>')
        updateClass('bugfixes','hurryUp')
      } else if (hurryUp) {
		updateElement('bugfixes','<b>There are '+format(player.bugfixes,1,0,false)+' bugfixes. (He\'s catching up! HURRY!)</b>')
		updateClass('bugfixes','hurryUp')
	  } else {
		updateElement('bugfixes','There are '+format(player.bugfixes,1,0,false)+' bugfixes.')
		updateClass('bugfixes','bugfixes')
	  }
  } else {
	  hideElement('bugfixes','block')
  }
  if (player.compAmount.slice(2,9).reduce((a, b) => a + b, 0) > 0) {
    showElement('genUpgrade','block');
    updateElement('genIncrease',Math.pow(((haveDU(1))?2.1:2)+0.5*(player.downtimeChallenge==9?0:player.prestiges[2]),(player.downtimeChallenge==1)?0.5:1).toPrecision(2));
    updateElement('genIncreaseCost','Cost: ' + format(costs.boost));
    updateElement('genBoost',format(Decimal.pow(Math.pow((haveDU(1))?2.1:2+0.5*player.prestiges[2],(player.downtimeChallenge==1)?0.5:1),player.boostPower),1,0,false));
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
  if (dttab!=olddttab) {
    hideElement(olddttab+'Tab')
    showElement(dttab+'Tab','block')
    olddttab=dttab
  }
  if (wartab!=oldwartab) {
    hideElement(oldwartab)
    showElement(wartab)
    oldwartab=wartab
  }
  if (statsTab!=oldStatsTab) {
    hideElement(oldStatsTab)
    showElement(statsTab)
    oldStatsTab=statsTab
  }
  if (EEtab!=oldEEtab) {
    hideElement(oldEEtab)
    showElement(EEtab)
    oldEEtab=EEtab
  }
  if (player.downtimeChallenge==11) {
	  hideElement('upgradeComputers')
  } else {
	  showElement('upgradeComputers','block')
	  if (player.prestiges[0]<Math.min(player.prestiges[1]+4,haveUpg(15)?Math.max(player.prestiges[1]+4,9):9)) {
		updateElement('prestige1Gen',Math.max(player.prestiges[0]*10-70,10)+' Tier '+ROMAN_NUMERALS[Math.min(player.prestiges[0]+1,9)])
		hideElement('maxout')
		showElement('abletoprestige','inline')
	  } else {
		hideElement('abletoprestige')
		showElement('maxout','inline')
	  }
  }
  if (player.prestiges[1]<=5 && player.compAmount[Math.min(player.prestiges[1]+3)] < haveDU(15)?15:20) {
    updateElement('prestige2Gen', (haveDU(15)?15:20).toString() + ' Tier ' + ROMAN_NUMERALS[player.prestiges[1]+4])
  } else {
    updateElement('prestige2Gen', 15*(player.prestiges[1]-5)+(haveDU(15)?20:15) +' Tier IX')
  }
  updateElement('prestige2Gen',(Math.max(player.prestiges[1]-5,0)*15+((haveDU(15)&&player.downtimeChallenge==0)?15:20))+' Tier '+ROMAN_NUMERALS[Math.min(player.prestiges[1]+4,9)])
  if (player.prestiges[1]<5 || player.downtimeChallenge != 0) showElement('upgradereq','inline');
  if (player.downtimeChallenge != 0 && !debugIsOn("showAllUpg")) {
    hideElement('upgcate1')
    updateElement('upgradereq','Upgrades are unavailable in DC')
  } else if (player.prestiges[1]<2 && !debugIsOn("showAllUpg")) {
    hideElement('upgcate1')
    updateElement('upgradereq','Unlocks at 2 I.P. changes')
  } else {
    showElement('upgcate1','inline')
    updateElement('upg1button','Cost: '+format(Decimal.pow10(Math.pow(1.5,2+(haveUpg(1,false)?player.upgrades[1]:0)))))
    updateElement('upg2button','Cost: '+format(Decimal.pow10(10+35*(haveUpg(2,false)?player.upgrades[2]:0))))
    if (player.prestiges[1]<3 && !debugIsOn("showAllUpg")) {
      hideElement('upgcate2')
      updateElement('upgradereq','Next at 3 I.P. changes')
    } else {
      showElement('upgcate2','inline')
      updateElement('upg3button','Cost: 100 TI comps & '+format(1e35))
      updateElement('upg4button','Cost: 100 TII comps & '+format(1e40))
      updateElement('upg5button','Cost: 100 TIII comps & '+format(1e50))
      updateElement('upg6button','Cost: 100 TIV comps & '+format(1e65))
      updateElement('upg7button','Cost: 100 TV comps & '+format(1e75))
      updateElement('upg8button','Cost: 100 TVI comps & '+format(1e85))
      updateElement('upg9button','Cost: 100 TVII comps & '+format(1e100))
      updateElement('upg10button','Cost: 100 TVIII comps & '+format(1e115))
      updateElement('upg11button','Cost: 100 TIX comps & '+format(1e125))
      updateElement('upg16button','Cost: N1 & '+format(1e3))
      if (player.prestiges[1]<5 && !debugIsOn("showAllUpg")) {
          updateElement('upgradereq','Next at 5 I.P. changes')
          hideElement('upgcate3')
      } else {
        hideElement('upgradereq')
        showElement('upgcate3','inline')
        for (i=13;i<17;i++) {
          if (haveUpg(i))
          updateClass('upg'+i+'button','boughtUpgrade')
          else if (checkIfAffordable(i)) updateClass('upg'+i+'button','')
          else updateClass('upg'+i+'button','cantBuy')
        }
      }
    }
    var check=0
    for (i=3;i<12;i++) {
      if (haveUpg(i)) check++
    }
    if (check>8) {
      showElement('upg12','inline')
      updateElement('upg12button','Cost: 110 comps each & '+format(1e140))
    } else {
      hideElement('upg12')
    }
    for (i=1;i<13;i++) {
      if (haveUpg(i)) updateClass('upg'+i+'button','boughtUpgrade')
      else if (checkIfAffordable(i)) updateClass('upg'+i+'button','')
      else updateClass('upg'+i+'button','cantBuy')
    }
  }
  if (player.prestiges[1]<5) updateElement('ipChange','Gain Tier '+ROMAN_NUMERALS[player.prestiges[1]+5]+' Computer, but resets everything.');
  else updateElement('ipChange','Gain boost for computers, but resets everything.');
  if (player.prestiges[1]>=5) updateElement('prestige2Type','Internet boost');
  else updateElement('prestige2Type','I.P. Change');
  showElement('networks','block')
  updateElement('prestige3Req',player.prestiges[2]*250+50)
  updateElement('netMulti',(5+player.prestiges[2])/2)
  if (player.canStopBugFixer && player.downtimeChallenge == 5) {
    showElement("stopBugFixerButton",'inline-block')
  } else {
    hideElement("stopBugFixerButton")
  }
  if (player.prestiges[3]>0||player.warnings.gt(0)) {
    showElement('warningTabButton','inline-block')
    showElement('warnings','block')
    updateElement('warnings','You have '+format(player.warnings)+' warnings.')
    document.getElementById('percentToWarning').style.width='calc(80% - 200px)'
  } else {
    hideElement('warningTabButton')
    hideElement('warnings')
    document.getElementById('percentToWarning').style.width='calc(80% - 20px)'
  }
  if (false) {
    showElement('theEndButton','inline')
    newStory(27)
  } else {
    hideElement('theEndButton')
  }
  if (tab=='computers') {
    for (let i=0;i<Math.min(player.prestiges[1]+4,9);i++) {
      updateElement("cop"+(i+1)+"mult",(player.compAmount[i]+player.generatedCompAmount[i])==0?'':'('+format(getMultTier(i+1).times(player.compAmount[i]+player.generatedCompAmount[i]))+'/s)')
      updateElement("cop"+(i+1),"Cost: " + format(costs.comp[i]) + " (" + player.compAmount[i] + (player.generatedCompAmount[i]==0?'':' + '+player.generatedCompAmount[i]) + ")")
      if (player.errors.lt(costs.comp[i]) || (player.downtimeChallenge==3 && i != 0 && player.compAmount[i] >= player.compAmount[i-1])) updateClass("cop"+(i+1),'cantBuy')
      else {
          updateClass("cop"+(i+1),'')
      }
    }
    for (i=0;i<5;i++) {
      if (player.prestiges[1]>i) {
      showElement(TIER_NAMES[i+4]+'Comp','block')
      } else {
      hideElement(TIER_NAMES[i+4]+'Comp')
      }
    }
  }
  if (tab=='warning') {
    updateElement("w1Multi",getUpgradeMultiplier(1).toFixed(2))
    updateElement("w2Multi",getUpgradeMultiplier(2).toFixed(2))
    updateElement("w4Multi",getUpgradeMultiplier(4).toFixed(2))
    updateElement("w5Multi",getUpgradeMultiplier(5).toFixed(2))
    if (wartab == "warUpgTab") {
      for (i=1;i<14;i++) {
        if (haveWU(i)) {
          updateClass("warUpg"+i.toString(),"warUpg boughtUpgrade")
        } else {
          updateClass("warUpg"+i.toString(),"warUpg")
        }
      }
    }
  }
  if (tab=='stats') {
	if (player.prestiges[3]>0||player.warnings.gt(0)) {
		showElement('statsTabButtons','block')
	} else {
		hideElement('statsTabButtons')
	}
	if (statsTab=='statisticsTab') {
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
		if (player.prestiges[3]>0||player.totalWarnings.gt(0)) {
		  showElement('statsPrestige4','block')
		  if (player.prestiges[3]>0) {
			showElement('statsP4times','block')
			updateElement('statsP4times','You have warned '+format(player.prestiges[3],0,1)+' times.')
		  } else {
			hideElement('statsP4times')
		  }
		  if (player.fastestWarning<Number.MAX_VALUE) {
			showElement('statsP4fastestTime','block')
			updateElement('statsP4fastestTime','Your fastest warning is in '+formatTime(player.fastestWarning)+'.')
		  } else {
			hideElement('statsP4fastestTime')
		  }
		  updateElement('statsP4totalWarnings','You have gained a total of '+format(player.totalWarnings)+' warnings.')
		  updateElement('statsP4playtime','Your time in this current warning is '+formatTime(player.warningPlaytime)+'.')
		} else {
		  hideElement('statsPrestige4')
		}
	}
	if (statsTab=='lastWarningsTab') {
		for (i=0;i<5;i++) {
			if (player.lastWarnings[i]==undefined) updateElement('statsPrevWarning'+(i+1),'')
			else updateElement('statsPrevWarning'+(i+1),'The '+(i==0?'':TIER_NAMES[i]+' to ')+'last warning took '+formatTime(player.lastWarnings[i][0])+' and earned you '+(Decimal.eq(player.lastWarnings[i][1],1)?'1 warning.':format(player.lastWarnings[i][1])+' warnings.'))
		}
	}
  }
  if (tab=='downtime') {
	  if (dttab=='downtimeChallenges') {
		  for (i=0;i<10;i++) {
			  document.getElementById('dt'+(i+1)).className = (player.downtimeChallenge==(i+1))?'redDTbutton':(typeof player.dtChallCompleted[i] == 'undefined')?'normDTbutton':'greenDTbutton'
		  }
		  if (player.prestiges[3]>0) {
			  showElement('postWarnDTchalls','table-row')
			  document.getElementById('dt11').className = (player.downtimeChallenge==11)?'redDTbutton':(typeof player.dtChallCompleted[10] == 'undefined')?'normDTbutton':'greenDTbutton'
		  } else {
			  hideElement('postWarnDTchalls')
		  }
	  }
	  if (dttab=='downtimeUpgrades') {
          var discs = [NaN,
                  'Production boost boosts everything more.<br>Cost: '+format(1e50),
                  'T1 & T2 computers produces twice as fast.<br>Cost: '+format(1e30),
                  'You start with single T1-T4 computers.<br>Cost: '+format(1e40),
                  'T3 & T4 computers produces twice as fast.<br>Cost: '+format(1e35),
                  'When you buy T9, it multiplies it\'s own production by 1.1x.<br>Cost: '+format(1e40), // 5th
                  'T5 & T6 computers produces twice as fast.<br>Cost: '+format(1e40),
                  'All prestiges are better except networks.<br>UCs give 3x multiplier, IPs give the next tier as well as a 2x multiplier, and IBs give 3x.<br>Cost: '+format(1e75),
                  'T7 & T8 computers produces twice as fast.<br>Cost: '+format(1e40),
                  'Start with IP1.<br>Cost: '+format(1e50),
                  'T9 computers produces twice as fast.<br>Cost: '+format(1e45), // 10th
                  'All computers have a 1.25x multiplier.<br>Cost: '+format(1e50),
                  'T1 & T2 Computers produces 10x as fast.<br>Cost: '+format(1e50),
                  'Every production boost you buy multiplies each computer\'s power by 1.01x. Additive.<br>Cost: '+format(1e60),
                  'T3 & T4 Computers produces 10x as fast.<br>Cost: '+format(1e55),
                  'Reduce first I.P. Change cost to 15.<br>Cost: '+format(1e60), // 15th
                  'T5 & T6 Computers produces 10x as fast.<br>Cost: '+format(1e60),
                  'Removed due to OP.<br>Cost: 1e75.<br>Cost: '+format(1e75),
                  'T7 & T8 Computers produces 10x as fast.<br>Cost: '+format(1e65),
                  'You have a 1% chance to get a 100x production boost.<br>Cost: '+format(1e100),
                  'T9 computers produces 10x as fast.<br>Cost: '+format(1e70)]
		  for (i = 1;i <= 10;i++) {
            si = i.toString() // string i
            if (player.dtChallCompleted[i-1]==undefined && !debugIsOn("showAllDU")) {
              hideElement('dc'+si+'upgrades')
            } else {
              showElement('dc'+si+'upgrades','block')
              for (i2 = i*2-1;i2 <= i*2;i2++) {
                si2 = i2.toString()
                updateClass('du'+si2,haveDU(i2)?'greenDTbutton':'normDTbutton')
                updateElement('du'+si2,discs[si2])
              }
            }
          }
	  }
  }
  if ([3,5,7].includes(player.downtimeChallenge)) showElement("backward");
  else hideElement("backward")
  
  if (player.options.debug) showElement('debugButton','inline-block')
  else hideElement('debugButton')
  
  updateElement("processDisplay",format((new Decimal(1e4)).div(Decimal.pow(2,haveUpg(1,false)?player.upgrades[1]:0),1,0,false)))
  updateElement("coreDisplay",Math.pow(2,haveUpg(2,false)?player.upgrades[2]:false))
    
  //insert all dc targets here from now on
  if (player.downtimeChallenge == 1  && player.prestiges[0] >= 4)    completeChall();
  if (player.downtimeChallenge == 2  && player.prestiges[0] >= 8)    completeChall();
  if (player.downtimeChallenge == 3  && player.compAmount[8] >= 55)  completeChall();
  if (player.downtimeChallenge == 4  && player.compAmount[8] >= 60)  completeChall();
  if (player.downtimeChallenge == 5  && player.prestiges[1] >= 11)    completeChall();
  if (player.downtimeChallenge == 6  && player.compAmount[8] >= 55)  completeChall();
  if (player.downtimeChallenge == 7  && player.prestiges[0] >= 9)    completeChall();
  if (player.downtimeChallenge == 8  && player.presitges[0] >= 5)    completeChall();
  if (player.downtimeChallenge == 9  && player.prestiges[1] >= 7)    completeChall();
  if (player.downtimeChallenge == 11 && player.prestiges[2] >= 2)    completeChall();
}

function save() {
  localStorage.setItem('errorSave',btoa(JSON.stringify(player)))
}

function load(savefile,firstTime=true) {
  if (savefile == "enable debug") {
    player.options.debug = true
    alert("Debug enabled! have fun!")
    return 0
  } else if (savefile == "disable debug") {
    player.options.debug = false
    alert("Debug disabled! idk who will do this though")
    return 0
  }
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
        notation:savefile.notation,debug:false}
      delete savefile.notation
    }
    savefile.build=0
    }
    if (savefile.version <= 1.5) {
      if (savefile.build < 1) {
      savefile.prestiges[3]=0
      savefile.warnings=0
      savefile.totalWarnings=0
    }
      if (savefile.build < 6) {
      savefile.warningUpgrades=[]
    }
      if (savefile.build < 14) {
      savefile.downtimeChallenge=0
      savefile.dtChallCompleted={}
    }
      if (savefile.build < 15) {
        savefile.dtUpgrades = []
      }
      if (savefile.build < 17) {
        if (savefile.story>23) savefile.story+=1
	  }
      if (savefile.build < 20) {
        savefile.bugfixes=0
	  }
	  if (savefile.build < 22) {
		savefile.warningPlaytime=(savefile.prestiges[3]==0?savefile.playtime:0)
		savefile.fastestWarning=Number.MAX_VALUE
		savefile.lastWarnings=[]
		savefile.warnUpgsGenerationLastTick={}
		savefile.generatedCompAmount=[0,0,0,0,0,0,0,0,0]
		if (savefile.warningUpgrades.includes(6)) savefile.warnUpgsGenerationLastTick[6]=savefile.playtime
		if (savefile.warningUpgrades.includes(7)) savefile.warnUpgsGenerationLastTick[7]=savefile.playtime
		if (savefile.warningUpgrades.includes(8)) savefile.warnUpgsGenerationLastTick[8]=savefile.playtime
		if (savefile.warningUpgrades.includes(9)) savefile.warnUpgsGenerationLastTick[9]=savefile.playtime
		if (savefile.warningUpgrades.includes(10)) savefile.warnUpgsGenerationLastTick[10]=savefile.playtime
	  }
	  if (savefile.build<23) {
		savefile.errorExpansion={pieceSize:100,expansions:0,upgrades:[]}
	  }
      if (savefile.build<23.2) {
        savefile.canStopBugFixer = true
        savefile.bugFixerOfflineTimer = 0
      }
      if (savefile.build<24) {
        alert("Your upgrades will now be cleared due to a new update, sorry!")
        savefile.upgrades = {}
      }
    }
    savefile.version = player.version
    savefile.build = player.build
    
    //if the value is a Decimal, set it to be a Decimal here.
    if (savefile.errors=='NaN') savefile.errors = new Decimal(10)
    else savefile.errors = new Decimal(savefile.errors)
    savefile.totalErrors = new Decimal(savefile.totalErrors)
	
    savefile.bugfixes=new Decimal(savefile.bugfixes)
  
    savefile.warnings = new Decimal(savefile.warnings)
    savefile.totalWarnings = new Decimal(savefile.totalWarnings)
    
    if (savefile.options.debug == null) savefile.options.debug = false
    
    player=savefile
	updateCosts()
	if (player.options.hotkeys) {
		updateElement('hotkeysbtn',"Hotkeys: Enabled")
		showElement('hotkeyText','inline-block')
	} else {
		updateElement('hotkeysbtn',"Hotkeys: Disabled")
		hideElement('hotkeyText')
	}
	if (player.fastestWarning<Number.MAX_VALUE) warnUpgsGenerationDuration[10]=player.fastestWarning*1000
	
    console.log('Game loaded!')
	return false
  } catch (e) {
    console.log('Your save failed to load:')
	console.error(e)
	if (firstTime) {
		console.log('We will load the default savefile instead now.')
		player=defaultPlayer
	}
	return true
  }
  //And then safety put the save file to player!
  
  percentage=Math.min(player.errors.add(1).log10()*0.32440704,100)
  realPercentage=percentage
    
  updateCosts()
  updateStory()
  updateElement("notationID",notationArray[player.options.notation])
}

function exportSave() {
  var savefile=btoa(JSON.stringify(player))
  showElement('exportSave','block')
  document.getElementById("exportText").value=btoa(JSON.stringify(player))
}

function importSave() {
  var input=prompt('Copy and paste in your exported file and press enter.')
  if (load(input,false)) {
    if (input!=null) {
      alert('Your save was invalid or caused a game-breaking bug. :(')
      load(localStorage.getItem('errorSave'))
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
    if (inputing) return;
    if (event.keyCode == 17) controlDown = true;
    if (event.keyCode == 16) shiftDown = true;
}, false);


window.addEventListener('keydown', function(event) {
  if (!player.options.hotkeys || inputing) return;
    const tmp = event.keyCode;
    switch (tmp) {
        case 49: // 1
        case 97:
          buyGen(0);
        break;
        
        case 50: // 2
        case 98:
          buyGen(1);
        break;
        
        case 51: // 3
        case 99:
          buyGen(2);
        break;
        
        case 52: // 4
        case 100:
          buyGen(3);
        break;
        
        case 53: // 5
        case 101:
          buyGen(4);
        break;
        
        case 54: // 6
        case 102:
          buyGen(5);
        break;
        
        case 55: // 7
        case 103:
          buyGen(6);
        break;
        
        case 56: // 8
        case 104:
          buyGen(7);
        break;
        
        case 57: // 9
        case 105:
          buyGen(8);
        break;
        
        case 77: // M
          document.getElementById("maxAll").onclick()
        break;
        
        case 80: // P
          if (shiftDown) buyGenUpgrade(); 
          else  maxGenUpgrade();
        break;
        
        case 85: // U
          prestige(1);
        break;
        
        case 73: // I
          prestige(2);
        break;
        
        case 78: // N
          prestige(3);
        break;
        
        case 87: // W
          prestige(4);
        break;
    }    
}, false);

function move() {
  realPercentage=Math.min(player.errors.add(1).log10()*0.32440704,100)
  var diff=Math.abs(percentage-realPercentage)
  percentage=realPercentage*(1-Math.pow(Math.min(Math.pow(1-diff/100,3),0.001),s))+percentage*(Math.pow(Math.min(Math.pow(1-diff/100,3),0.001),s))
  if (realPercentage<24.995) {
    document.getElementById("percentToWarningBar").style['background-color']='#22ff00'
  } else if (realPercentage<49.995) {
    document.getElementById("percentToWarningBar").style['background-color']='#ffce00'
  } else if (realPercentage<74.995) {
    document.getElementById("percentToWarningBar").style['background-color']='#e57200'
  } else if (realPercentage<99.995) {
    document.getElementById("percentToWarningBar").style['background-color']='#e50000'
  } else {
    document.getElementById("percentToWarningBar").style['background-color']='#191919'
  }
  document.getElementById("percentToWarningBar").style.width=percentage+'%'
  if (realPercentage<99.995) {
    document.getElementById('percentToWarningProgress').style.color='#191919'
  } else {
    document.getElementById('percentToWarningProgress').style.color='#e5e5e5'
  }
    updateElement('percentToWarningProgress',realPercentage.toFixed(2)+'%')
} 

var gameFucked = false
var triedFix = false
var lastError = "Nothing"
var testing = 0
function gameInit() {
  setupRoman()
  load(localStorage.getItem('errorSave'))
  costs.boost=new Decimal(1e3).times(Decimal.pow(4+Math.floor(player.boostPower/100)*2,player.boostPower))
  var tickspeed=0
  var s=0
  document.getElementById("gameSpeedIn").addEventListener("focusout", changeSpeed)
  updated=true
  setInterval(function()
  { 
    if (!gameFucked) {  
      if (updated) {
        updated=false
        setTimeout(function(){
          var startTime=new Date().getTime()
          try {
            gameTick()
          } catch (e) {
            console.log('A game error has occured:')
            console.error(e)
            tryFix(e)
          } finally {
            testing = Math.max(0,testing-1)
            if (triedFix && testing == 0) {
              console.log("YAY it works now")
              recover()
            }
          }
          tickspeed=(new Date().getTime()-startTime)*0.2+tickspeed*0.8
          updated=true
        },tickspeed)
      }
    }
  },0)
  setInterval(save,1000);
}

function recover() {
  gameFucked = false
  triedFix = false
  lastError = "Nothing"
  testing = 0
}
function tryFix(e,manual=false) {
  if (!manual && triedFix) {
    console.log("ANOTHER error? ahhhh")
  }
  if (!manual) messages = e.message.split(" ")
  if (!manual && e.message == lastError) {
    console.log("SAME ERROR?")
    console.log('Sorry! Something is wrong with the game! Stopping the game, you can restart the game with recover() if you think you fixed it')
    gameFucked = true
    return false
  }
  if (manual || messages[0].split(".")[0] == "player") {
    if (!manual) console.log('Detected save error, trying to fix it...')
    else console.log('Trying to fix your save...')
    if (typeof player != 'object') {
      console.log('Sorry! the whole save is ruined! loading default save...')
      load("default")
      return
    }
    Object.keys(defaultPlayer).forEach((foo) => { // Can't use var for name :(
      if (!(foo in player)) {
        player[foo] = defaultPlayer[foo]
        console.log("Added missing "+foo+" data into savefile")
      } else if (typeof player[foo] != typeof defaultPlayer[foo]) {
        player[foo] = defaultPlayer[foo]
        console.log("Resetting "+foo+" to default valve")
      } else {
        switch (typeof defaultPlayer[foo]) {
          case "object":
            if (player[foo].constructor.name == "e" && (isNaN(player[foo].mantissa) || isNaN(player[foo].exponent))) {
              player[foo] = defaultPlayer[foo]
              console.log("Resetting "+foo+" to default valve due to NaN's everywhere")
            }
            break;
        }
      }
    })
    console.log("Done, hope this works...")
  } else {
    console.log("I have no idea what happened, hope this wont happen again...")
  }
  if (!manual) {
    lastError = e.message
    triedFix = true
    testing = 50
  }
}

function buyDTU(id) {
  if (haveDU(id)) return;
  if (player.errors.gte(costs.DTU[id-1])&&player.dtChallCompleted[Math.floor((id-1)/2)]!=undefined) {
    player.errors = player.errors.sub(costs.DTU[id-1])
    player.dtUpgrades.push(id)
  }
}

function haveDU(id) {
  return player.dtUpgrades.includes(id) && [0,9].includes(player.downtimeChallenge)
}

function changeSpeed() {
  inputing = false
  speedin = document.getElementById("gameSpeedIn")
  if (!speedin.checkValidity() || parseFloat(speedin.value) < 0 || speedin.value == "") speedin.value = gameSpeed
  else gameSpeed = speedin.value
}

function debugIsOn(option) {
  return document.getElementById(option).checked && player.options.debug
}

function stopBugFixer(time) {
  player.bugFixerOfflineTimer = time
}
  
function haveUpg(id,max=true) {
  if (max) {
    if (id == 1) return player.upgrades[1] == 13
    if (id == 2) return player.upgrades[2] == 8
  }
  return player.upgrades.hasOwnProperty(id) && player.upgrades[id] > 0
}
      
function haveWU(id) {
  return player.warningUpgrades.includes(id)
}
  
function PBunlocked() {
  return player.compAmount.slice(2,9).reduce((a, b) => a + b, 0) > 0
}