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
    roll2.test(0, function(p){
      ok(0);
    }).test(50, function(p){
      ok(0);
    }).test(100, function(p){
      ok(1);
    }).else(function(){
      ok(0);
    }).run();
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
