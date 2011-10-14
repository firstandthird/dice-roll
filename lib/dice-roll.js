var DiceRoll = function(name, percentage, expires, callback) {
  expires = expires || 7;
  var key = "diceroll-"+name;
  var monster = (typeof ender !== "undefined")?require("cookie-monster"):window.monster;
  var cookie = (monster)?monster.get(key):false;
  if (!cookie) {
    var max = 1000; 
    var pct = percentage / 100;
    var rnd = Math.floor(Math.random()*max+1);
    var opt = ((max*pct)>=rnd)?1:0;
    if (monster)
      monster.set(key, opt, expires);
    callback(opt);
  } else {
    callback(cookie);
  }
};
