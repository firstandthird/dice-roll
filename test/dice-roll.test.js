var should, diceRoll;
if (typeof module !== "undefined") { //nodejs
  should = require('chai').should();
  diceRoll = require('../dist/dice-roll');
} else { //browser
  should = chai.should();
}

describe('diceRoll', function() {

  afterEach(function(done) {
    if (typeof monster !== "undefined") {
      monster.remove('diceroll-name');
    }
    done();
  });

  describe('#init', function() {
    it('should take name and expires', function() {
      var dr = diceRoll('name', 10);
      dr.key.should.equal('diceroll-name');
      console.log(dr.expires);
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

  describe('#otherwise', function() {
    it('should set the elseCallback', function() {
      var f = function() {};
      var dr = diceRoll('name').otherwise(f);
      dr.elseCallback.should.equal(f);
    });
  });

  describe('#run', function() {
  
   it('should call test if 100%', function(done) {
     diceRoll('name')
      .test(100, function(perc, testNum) {
        perc.should.equal(100);
        testNum.should.equal(0);
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
      .otherwise(function() {
        done();
      })
      .run();
   });
   it('should call otherwise if no test passes', function(done) {
     diceRoll('name')
      .test(0, function() {
      })
      .otherwise(function(perc, testNum) {
        perc.should.equal(false);
        testNum.should.equal(1);
        done();
      })
      .run();
   });

   if (typeof monster !== "undefined") {
     describe('cookies enabled', function() {
       it('should remember last result', function(done) {
         var firstRun = -1;

         var f = function(perc, testNum) {
           if (firstRun == -1) {
             firstRun = testNum;
             run(); //run again
           } else {
             testNum.should.equal(firstRun);
             done();
           }
         };
         var run = function() {
           diceRoll('name')
            .test(40, f) 
            .test(40, f)
            .otherwise(f)
            .run();
         }
         run();
       });
     });
   }
  });
});
