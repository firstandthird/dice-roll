var should, diceRoll;
if (typeof require !== "undefined") { //nodejs
  should = require('chai').should();
  diceRoll = require('../dist/dice-roll');
} else { //browser
  should = chai.should();
}

describe('diceRoll', function() {

  describe('#init', function() {
    it('should take name and expires', function() {
      var dr = diceRoll('name', 10);
      console.log(dr.key);
      dr.key.should.equal('diceroll-name');
      dr.expires.should.equal(10);
    });
    it('should default to 7 day expires', function() {
      var dr = diceRoll('name');
      dr.expires.should.equal(7);
    });
  });

  describe('#test', function() {
    it('should add to tests', function() {
      var f = function() {};
      var dr = diceRoll('name').test(10, f);
      dr.tests.length.should.equal(1);
      dr.tests[0].percentage.should.equal(10);
      dr.tests[0].callback.should.equal(f);
    });
  });

  describe('#else', function() {
    it('should set the elseCallback', function() {
      var f = function() {};
      var dr = diceRoll('name').else(f);
      dr.elseCallback.should.equal(f);
    });
  });

  describe('#run', function() {
  
   it('should call test if 100%', function(done) {
     diceRoll('name')
      .test(100, function() {
        done();
      })
      .run();
   }); 
   
   it('should allow for multiple tests', function(done) {
     diceRoll('name')
      .test(50, function() {
        done();
      })
      .test(50, function() {
        done();
      })
      .run();
   });
   it ('should work if no tests are defined', function(done) {
     diceRoll('name')
      .else(function() {
        done();
      })
      .run();
   });
   it('should call else if no test passes', function(done) {
     diceRoll('name')
      .test(0, function() {
      })
      .else(function() {
        done();
      })
      .run();
   });
  });

  //tests for cookies
});

/*
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
  var roll = new DiceRoll(testName, 7);
  roll.test(0, function(percent){
    ok(0);
  }).else(function(){
    ok(1);
  }).run();
});
test('roll 100%', function() {
  expect(1);
  var roll = new DiceRoll(testName, 7);
  roll.test(100, function(percent){
    ok(1);
  }).else(function(){
    ok(0);
  }).run();
});

test('repeat roll', function() {
  expect(1);

  var roll = new DiceRoll(testName, 7);
  roll.test(100, function(percent){
    var roll2 = new DiceRoll(testName, 7);
    roll2.test(100, function(p){
      ok(1);
    }).test(50, function(p){
      ok(0);
    }).test(100, function(p){
      ok(0);
    }).else(function(){
      ok(0);
    }).run();
  }).test(50, function(p){
    ok(0);
  }).test(100, function(p){
    ok(0);
  }).else(function(){
    ok(0);
  }).run();

});
test('multiple tests', function() {
  expect(1);

  var roll = new DiceRoll(testName, 7);
  roll.test(0, function(p){
    ok(0);
  }).test(50, function(p){
    ok(1);
  }).test(50, function(p){
    ok(1);
  }).else(function(){
    ok(0);
  }).run();
});

test('roll 50%', function() {
  expect(1);
  var roll = new DiceRoll(testName, 7);
  roll.test(50, function(p){
    ok(1);
  }).else(function(){
    ok(1);
  }).run();
});
*/
