/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://ender.no.de)
  * Build: ender build ../
  * =============================================================
  */

/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011 (@ded @fat)
  * http://ender.no.de
  * License MIT
  */
!function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context.$

  function require (identifier) {
    // modules can be required from ender's build system, or found on the window
    var module = modules[identifier] || window[identifier]
    if (!module) throw new Error("Requested module '" + identifier + "' has not been defined.")
    return module
  }

  function provide (name, what) {
    return (modules[name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }

  function boosh(s, r, els) {
    // string || node || nodelist || window
    if (typeof s == 'string' || s.nodeName || (s.length && 'item' in s) || s == window) {
      els = ender._select(s, r)
      els.selector = s
    } else els = isFinite(s.length) ? s : [s]
    return aug(els, boosh)
  }

  function ender(s, r) {
    return boosh(s, r)
  }

  aug(ender, {
      _VERSION: '0.3.6'
    , fn: boosh // for easy compat to jQuery plugins
    , ender: function (o, chain) {
        aug(chain ? boosh : ender, o)
      }
    , _select: function (s, r) {
        return (r || document).querySelectorAll(s)
      }
  })

  aug(boosh, {
    forEach: function (fn, scope, i) {
      // opt out of native forEach so we can intentionally call our own scope
      // defaulting to the current item and be able to return self
      for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(scope || this[i], this[i], i, this)
      // return self for chaining
      return this
    },
    $: ender // handy reference to self
  })

  ender.noConflict = function () {
    context.$ = old
    return this
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = ender
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = context['ender'] || ender

}(this);

!function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Cookie Monster - A javascript cookie library 
    * v0.0.2
    * https://github.com/jgallen23/cookie-monster
    * copyright JGA 2011
    * MIT License
    */
  
  !function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
    else this[name] = definition();
  }('monster', function() {
  
  var monster = function() {
    return {
      set: function(name, value, days, path) {
        var date = new Date(),
            expires = '',
            type = typeof(value),
            valueToUse = '';
        path = path || "/";
        if (days) {
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toGMTString();
        }
        if(type !== "string"  && type !== "undefined"){
            if(!("JSON" in window)) throw "Bummer, your browser doesn't support JSON parsing.";
            valueToUse = JSON.stringify({v:value});
        }
        else
          valueToUse = escape(value);
        
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
            if(value=="undefined") return undefined;
            return unescape(value);
          }
        }
        return null;
      },
      remove: function(name) {
        this.set(name, "", -1);
      }
    };
  }();
  
    return monster;
  });
  

  provide("cookie-monster", module.exports);

  $.ender(module.exports);

}();

!function () {

  var module = { exports: {} }, exports = module.exports;

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
  }('DiceRoll', function() {
  
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
  
    for(var i = 0, c = this.tests.length; i<c; i++) {
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
  
        start += pct+1;
      } else if(val == this.cookieValue) {
        opt = true;
        test.callback(this.cookieValue);
      }
  
      if(opt) return;
    }
  
    //not tossed in a pool
    if(this.elseCb) this.elseCb();
  };
  
  var diceRoll = function() {
    return new DiceRoll.apply(this, arguments);
  };
  
    return DiceRoll;
  });
  

  provide("dice-roll", module.exports);

  $.ender(module.exports);

}();