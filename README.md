#Dice Roll
A simple a/b test library for javascript

## Features

- Pass in any percentage to test
- Will cookie user so they stay in the test when they come back (requires: [cookie-monster](https://github.com/jgallen23/cookie-monster))
- Get a callback that tells you whether the user is in the test or not

## Installation

download [dice-roll.js](https://github.com/jgallen23/dice-roll/blob/master/dist/dice-roll.js) from dist directory.
(If you want the test to be persistance across visits, download [cookie-monster](https://github.com/jgallen23/cookie-monster) as well)

or

	ender build dice-roll

## Usage

	diceRoll('testName', expiration)
		.test(percentage, callback);
		.test(percentage2, callback2);
		.otherwise(callback3);
		.run();

## Example

	diceRoll('testName', 1) //cookied for 1 day
		.test(10, function() {
			//10% of the time user will be in this test
		});
		.test(20, function() {
			//20% of the time user will be in this test 
		});
		.otherwise(function() {
			//called if not in either other test (70% of the time)
		});
		.run();
