import CookieMonster from '@firstandthird/cookie-monster';
import test from 'tape-rollup';
import diceRoll from '../index';

const teardown = () => {
  CookieMonster.remove('diceroll-name');
};

test('add diceRoll to window', assert => {
  assert.equal(typeof diceRoll, 'function');
  assert.end();
});

test('should take name and expires', assert => {
  const dr = diceRoll('name', 10);
  assert.equal(dr.key, 'diceroll-name');
  assert.equal(dr.expires, 10);
  assert.end();
});

test('should default to 7 day expires', assert => {
  const dr = diceRoll('name');
  assert.equal(dr.expires, 7);
  assert.end();
});

test('should add to tests', assert => {
  const f = () => {};
  const dr = diceRoll('name').test(10, f);
  assert.equal(dr.tests.length, 1);
  assert.equal(dr.tests[0].percentage, 10);
  assert.equal(dr.tests[0].callback, f);
  assert.end();
});

test('should set the elseCallback', assert => {
  const f = () => {};
  const dr = diceRoll('name').otherwise(f);
  assert.equal(dr.elseCallback, f);
  assert.end();
});

test('should call test if 100%', assert => {
  diceRoll('name')
    .test(100, (perc, testNum) => {
      assert.equal(perc, 100);
      assert.equal(testNum, 0);
      assert.end();
    })
    .run();
  teardown();
});

test('should allow for multiple tests', assert => {
  diceRoll('name')
    .test(50, () => {
      assert.pass('pass');
      assert.end();
    })
    .test(50, () => {
      assert.pass('pass');
      assert.end();
    })
    .run();
  teardown();
});

test('should work if no tests are defined', assert => {
  diceRoll('name')
    .otherwise(() => {
      assert.pass('pass');
      assert.end();
    })
    .run();
  teardown();
});

test('should call otherwise if no test passes', assert => {
  diceRoll('name')
    .test(0, () => {})
    .otherwise((perc, testNum) => {
      assert.equal(perc, false);
      assert.equal(testNum, '1');
      assert.end();
    })
    .run();
  teardown();
});

test('should remember last result', assert => {
  let firstRun = -1;
  const f = (perc, testNum) => {
    if (firstRun === -1) {
      firstRun = testNum;
      run(); //eslint-disable-line no-use-before-define
    } else {
      assert.equal(testNum, firstRun);
      assert.end();
    }
  };

  function run() {
    diceRoll('name')
      .test(10, f)
      .test(10, f)
      .test(10, f)
      .test(10, f)
      .test(10, f)
      .test(10, f)
      .test(10, f)
      .test(10, f)
      .otherwise(f)
      .run();
  }

  run();
  teardown();
});
