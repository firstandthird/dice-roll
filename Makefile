boosh:
	smoosh make ./build.json
	cd integration && ender build ../

test:
	./node_modules/.bin/mocha -R list test/dice-roll.test.js

.PHONY: test
