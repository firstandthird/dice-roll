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
  this.else = callback;
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
          this.monster.set(this.key, test.percentage+'', this.expires);
        }
        test.callback(test.percentage);
        opt = true;
      } else {
        opt = false;
      }

      start += pct+1;
    } else if(test.percentage == this.cookie) {
      opt = true;
      test.callback(this.cookie);
    }

    if(opt) return;
  }

  //not tossed in a pool
  if(this.else) this.else();
};