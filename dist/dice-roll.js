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

var DiceRoll = function(name, expires) {
  this.expires = expires || 7;
  this.max = 1000;
  this.key = "diceroll-"+name;
  this.monster = (typeof ender !== "undefined")?require("cookie-monster"):window.monster;
  this.cookie = (this.monster)?this.monster.get(this.key):false;
  this.tests = [];

  return this;
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
  var rnd = Math.floor(Math.random()*this.max+1);
  var start = 0;
  var pct, test, cookie, opt;

  for(var i = 0, c = this.tests.length; i<c; i++) {
    test = this.tests[i];
    
    if(!this.cookie) {
      pct = (test.percentage / 100)*this.max;

      if(rnd >= start && rnd <= (start+pct)) {
        if (this.monster) {
          this.monster.set(this.key, test.percentage+':'+i, this.expires);
        }
        test.callback(test.percentage);
        opt = true;
      } else {
        opt = false;
      }

      start += pct+1;
    } else if(test.percentage+':'+i == this.cookie) {
      opt = true;
      test.callback(this.cookie);
    }

    if(opt) return;
  }

  //not tossed in a pool
  if(this.elseCb) this.elseCb();
};
  return DiceRoll;
});
