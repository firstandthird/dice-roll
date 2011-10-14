/*!
  * Dice Roll - A javascript A/B library 
  * v0.0.2
  * https://github.com/jgallen23/dice-roll
  * copyright JGA 2011
  * MIT License
  */

!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
  else this[name] = definition();
}('DiceRoll', function() {

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

  return DiceRoll;
});
