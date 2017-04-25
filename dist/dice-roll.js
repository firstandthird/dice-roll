var DiceRoll = (function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function set$$1(name, value) {
  var days = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '/';
  var domain = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var secure = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

  var date = new Date();
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

  var expires = '';
  var valueToUse = '';
  var secureFlag = '';
  var domainFlag = '';

  if (days) {
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }

  if (type === 'object' && type !== 'undefined') {
    valueToUse = encodeURIComponent(JSON.stringify({ value: value }));
  } else {
    valueToUse = encodeURIComponent(value);
  }

  if (secure) {
    secureFlag = '; secure';
  }

  if (domain) {
    domainFlag = '; domain=' + encodeURIComponent(domain);
  }

  document.cookie = name + '=' + valueToUse + expires + '; path=' + path + secureFlag + domainFlag;
}

function get$1(name) {
  var nameEQ = name + '=';
  var split = document.cookie.split(';');
  var value = null;

  split.forEach(function (item) {
    var cleaned = item.trim();

    if (cleaned.indexOf(nameEQ) === 0) {
      value = decodeURIComponent(cleaned.substring(nameEQ.length, cleaned.length));

      if (value.substring(0, 1) === '{') {
        try {
          value = JSON.parse(value);
          value = value.value || null;
        } catch (e) {
          return;
        }
      }

      if (value === 'undefined') {
        value = undefined;
      }
    }
  });

  return value;
}

function remove(name) {
  set$$1(name, '', -1);
}

function increment(name, days) {
  var value = get$1(name) || 0;
  set$$1(name, ~~value + 1, days);
}

function decrement(name, days) {
  var value = get$1(name) || 0;
  set$$1(name, ~~value - 1, days);
}

var CookieMonster = {
  set: set$$1,
  get: get$1,
  remove: remove,
  increment: increment,
  decrement: decrement
};

var MAX = 1000;

var DiceRoll = function () {
  function DiceRoll(name) {
    var expires = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 7;
    classCallCheck(this, DiceRoll);

    this.expires = expires || 7;
    this.key = 'diceroll-' + name;
    this.cookieValue = CookieMonster.get(this.key) || false;
    this.tests = [];
  }

  createClass(DiceRoll, [{
    key: 'test',
    value: function test(percentage, callback) {
      this.tests.push({
        percentage: percentage,
        callback: callback
      });

      return this;
    }
  }, {
    key: 'otherwise',
    value: function otherwise(callback) {
      this.elseCallback = callback;
      return this;
    }
  }, {
    key: 'setCookie',
    value: function setCookie(i) {
      CookieMonster.set(this.key, i.toString(), this.expires);
    }
  }, {
    key: 'run',
    value: function run() {
      var rnd = Math.floor(Math.random() * MAX + 1);
      var c = this.tests.length;
      var start = 0;
      var i = 0;
      var pct = void 0;
      var opt = void 0;

      for (; i < c; i++) {
        var test = this.tests[i];

        if (!this.cookieValue) {
          pct = test.percentage / 100 * MAX;

          if (rnd >= start && rnd <= start + pct) {
            this.setCookie(i);
            test.callback(test.percentage, i);
            opt = true;
          } else {
            opt = false;
          }

          start += pct + 1;
        } else if (i.toString() === this.cookieValue) {
          opt = true;
          test.callback(test.percentage, i);
        }

        if (opt) return;
      }

      if (opt) {
        return;
      }

      // Not tossed in a pool
      if (this.elseCallback) {
        this.setCookie(i);
        this.elseCallback(false, i.toString());
      }
    }
  }]);
  return DiceRoll;
}();

function diceRoll(name, expires) {
  return new DiceRoll(name, expires);
}

return diceRoll;

}());

//# sourceMappingURL=dice-roll.js.map