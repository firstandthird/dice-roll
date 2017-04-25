import CookieMonster from '@firstandthird/cookie-monster';

const MAX = 1000;

class DiceRoll {
  constructor(name, expires = 7) {
    this.expires = expires || 7;
    this.key = `diceroll-${name}`;
    this.cookieValue = CookieMonster.get(this.key) || false;
    this.tests = [];
  }

  test(percentage, callback) {
    this.tests.push({
      percentage,
      callback
    });

    return this;
  }

  otherwise(callback) {
    this.elseCallback = callback;
    return this;
  }

  setCookie(i) {
    CookieMonster.set(this.key, i.toString(), this.expires);
  }

  run() {
    const rnd = Math.floor(Math.random() * MAX + 1);
    const c = this.tests.length;
    let start = 0;
    let i = 0;
    let pct;
    let opt;

    for (;i < c; i++) {
      const test = this.tests[i];

      if (!this.cookieValue) {
        pct = (test.percentage / 100) * MAX;

        if (rnd >= start && rnd <= (start + pct)) {
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
}

export default function diceRoll(name, expires) {
  return new DiceRoll(name, expires);
}
