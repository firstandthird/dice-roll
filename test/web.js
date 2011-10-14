if (typeof ender !== "undefined") {
  DiceRoll = require("dice-roll"); 
}
var testName = 'test1';

module('Dice Roll', { 
  teardown: function() {
    var monster = window.monster;
    if (typeof ender !== "undefined") {
      monster = require('cookie-monster');
    }
    if (typeof monster !== 'undefined') {
      monster.remove('diceroll-test1');
      monster.remove('diceroll-test2');
    }
  }
});

test('monster', function() {
  ok((typeof monster !== 'undefined' || (typeof ender !== "undefined" && require('cookie-monster'))), 'monster needs to exist for repeat roll to work');
});

test('roll 0%', function() {
  expect(1);
  new DiceRoll(testName, 0, 7, function(opt) {
    equal(opt, 0); 
  });
});
test('roll 100%', function() {
  expect(1);
  new DiceRoll(testName, 100, 7, function(opt) {
    equal(opt, 1); 
  });
});
test('repeat roll', function() {
  expect(1);
  new DiceRoll(testName, 100, 7, function(opt) {
    var val = opt;
    new DiceRoll(testName, 0, 7, function(opt) {
      equal(opt, val);
    });
  });
});
test('multiple tests', function() {
  new DiceRoll(testName, 100, 7, function(opt) {
    var val = opt;
    new DiceRoll('test2', 0, 7, function(opt) {
      notEqual(opt, val);
    });
  });
});

test('roll 50%', function() {
  expect(1);
  new DiceRoll(testName, 50, 7, function(opt) {
    ok((opt == 1 || opt === 0));
  });
});
