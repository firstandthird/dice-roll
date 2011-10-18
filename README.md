#Dice Roll
A simple a/b test library for javascript

## Features

- Pass in any percentage to test
- Will cookie user so they stay in the test when they come back (req: [cookie-monster](https://github.com/jgallen23/cookie-monster))
- Get a callback that tells you whether the user is in the test or not

## Installation

download [cookie-monster](https://github.com/jgallen23/cookie-monster) (not required, but good to have) then download dice-roll.js from dist directory

or

	ender build dice-roll

## Usage

	new DiceRoll('testName', percentage, expires, callback);

## Example

	new DiceRoll('testName', 10, 7, function(opt) {
		//10% of the time opt will be 1
		//user will be in test for 7 days
	});
