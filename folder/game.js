//Calling it this because it will be main game JS thing?

var player = {
  money: 10, //current errors
  mps: 0, //errors per second
  firstCost: 10,
  secondCost: 100,
  thirdCost: 1000,
  firstAmount: 0,
  secondAmount: 0,
  thirdAmount: 0,
}
const GEN_TIERS = ['first','second','third']; // can add more if more gens

function buyGen(tier) {
  var level = GEN_TIERS[tier];
  if (player.money - player[level + "Cost"] >= 0) {
    player[level + "Amount"] ++;
    player.money -= player[level + "Cost"];
  }
}

document.getElementById('gen1').onclick = function() {
  buyGen(0);
}

document.getElementById('gen2').onclick = function() {
  buyGen(1);
}

document.getElementById('gen3').onclick = function() {
  buyGen(2);
}
