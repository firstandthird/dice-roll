# Dice Roll

[![Build Status](https://travis-ci.org/firstandthird/dice-roll.svg?branch=master)](https://travis-ci.org/firstandthird/dice-roll)
![npm](https://img.shields.io/npm/v/dice-roll.svg)

A simple A/B test library for JavaScript

## Features

- Pass in any percentage to test
- Will cookie user so they stay in the test when they come back (requires: [cookie-monster](https://github.com/firstandthird/cookie-monster))
- Get a callback that tells you whether the user is in the test or not

## Installation

```sh
npm install dice-roll
```

## Usage

```js
  diceRoll('testName', expiration) //jquery style chaining
    .test(percentage, callback);
    .test(percentage2, callback2);
    .otherwise(callback3);
    .run();
```

## Example

```js
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
```
