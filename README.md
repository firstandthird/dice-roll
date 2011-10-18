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

	new DiceRoll('testName', percentage, expires, callback);

## Example

	new DiceRoll('testName', 10, 7, function(opt) {
		//10% of the time opt will be 1
		//user will be in test for 7 days
	});
