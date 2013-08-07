/*!
 * dice-roll - A basic A/B test library
 * v0.0.4
 * https://github.com/jgallen23/dice-roll
 * copyright Greg Allen 2013
 * MIT License
*/
/*!
 * cookie-monster - a simple cookie library
 * v0.2.0
 * https://github.com/jgallen23/cookie-monster
 * copyright Greg Allen 2013
 * MIT License
*/
var monster = {
  set: function(name, value, days, path) {
    var date = new Date(),
        expires = '',
        type = typeof(value),
        valueToUse = '';
    path = path || "/";
    if (days) {
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    if (type === "object"  && type !== "undefined") {
        if(!("JSON" in window)) throw "Bummer, your browser doesn't support JSON parsing.";
        valueToUse = JSON.stringify({v:value});
    } else {
      valueToUse = encodeURIComponent(value);
    }

    document.cookie = name + "=" + valueToUse + expires + "; path=" + path;
  },
  get: function(name) {
    var nameEQ = name + "=",
        ca = document.cookie.split(';'),
        value = '',
        firstChar = '',
        parsed={};
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        value = c.substring(nameEQ.length, c.length);
        firstChar = value.substring(0, 1);
        if(firstChar=="{"){
          parsed = JSON.parse(value);
          if("v" in parsed) return parsed.v;
        }
        if (value=="undefined") return undefined;
        return decodeURIComponent(value);
      }
    }
    return null;
  },
  remove: function(name) {
    this.set(name, "", -1);
  },
  increment: function(name, days) {
    var value = this.get(name) || 0;
    this.set(name, (parseInt(value, 10) + 1), days);
  },
  decrement: function(name, days) {
    var value = this.get(name) || 0;
    this.set(name, (parseInt(value, 10) - 1), days);
  }
};

var max = 1000;
//monster should be loaded only in browser.
var monster = (typeof module !== 'undefined')?false:(typeof ender !== "undefined")?require("cookie-monster"):window.monster;

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

DiceRoll.prototype.otherwise = function(callback) {
  this.elseCallback = callback;
  return this;
};

DiceRoll.prototype.run = function() {
  var rnd = Math.floor(Math.random() * max + 1);
  var start = 0;
  var pct, test, cookie, opt, val;

  for (var i = 0, c = this.tests.length; i<c; i++) {
    test = this.tests[i];
    
    if(!this.cookieValue) {
      pct = (test.percentage / 100) * max;

      if(rnd >= start && rnd <= (start+pct)) {
        if (monster) {
          monster.set(this.key, i.toString(), this.expires);
        }
        test.callback(test.percentage, i);
        opt = true;
      } else {
        opt = false;
      }

      start += pct + 1;
    } else if (i.toString() == this.cookieValue) {
      opt = true;
      test.callback(test.percentage, i);
    }

    if (opt) return;
  }

  //not tossed in a pool
  if (this.elseCallback)  {
    if (monster) {
      monster.set(this.key, i.toString(), this.expires);
    }
    this.elseCallback(false, i);
  }
};

var diceRoll = function(name, expires) {
  return new DiceRoll(name, expires);
};
