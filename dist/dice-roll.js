/*!
  * Dice Roll - A javascript A/B library 
  * v0.0.3
  * https://github.com/jgallen23/dice-roll
  * copyright JGA 2011
  * MIT License
  */

!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
  else this[name] = definition();
}('dice-roll', function() {

var max = 1000;
var monster = (typeof ender !== "undefined")?require("cookie-monster"):window.monster;

var DiceRoll = function(name, expires) {
  this.expires = expires || 7;
  this.key = "diceroll-"+name;
  this.cookieValue = (monster)?monster.get(this.key):false;
  this.tests = [];

};

DiceRoll.prototype.test = function(percentage, callback) {
  this.tests.push({
    percentage: percentage,
    callback: callback
  });

  return this;
};

DiceRoll.prototype.else = function(callback) {
  this.elseCb = callback;
  return this;
};

DiceRoll.prototype.run = function() {
  var rnd = Math.floor(Math.random() * max + 1);
  var start = 0;
  var pct, test, cookie, opt, val;

  for (var i = 0, c = this.tests.length; i<c; i++) {
    test = this.tests[i];
    val = test.percentage + ':' + i;
    
    if(!this.cookieValue) {
      pct = (test.percentage / 100) * max;

      if(rnd >= start && rnd <= (start+pct)) {
        if (monster) {
          monster.set(this.key, val, this.expires);
        }
        test.callback(test.percentage);
        opt = true;
      } else {
        opt = false;
      }

      start += pct + 1;
    } else if(val == this.cookieValue) {
      opt = true;
      test.callback(this.cookieValue);
    }

    if (opt) return;
  }

  //not tossed in a pool
  if (this.elseCb) 
    this.elseCb();
};

var diceRoll = function(name, expires) {
  return new DiceRoll(name, expires);
};

  return diceRoll;
});
