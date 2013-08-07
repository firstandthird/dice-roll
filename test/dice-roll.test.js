
suite('diceRoll', function() {

  teardown(function(done) {
    if (typeof monster !== "undefined") {
      monster.remove('diceroll-name');
    }
    done();
  });

  suite('#init', function() {

    test('should take name and expires', function() {
      var dr = diceRoll('name', 10);
      assert.equal(dr.key, 'diceroll-name');
      assert.equal(dr.expires, 10);
    });

    test('should default to 7 day expires', function() {
      var dr = diceRoll('name');
      assert.equal(dr.expires, 7);
    });
  });

  suite('#test', function() {

    test('should add to tests', function() {
      var f = function() {};
      var dr = diceRoll('name').test(10, f);
      assert.equal(dr.tests.length, 1);
      assert.equal(dr.tests[0].percentage, 10);
      assert.equal(dr.tests[0].callback, f);
    });

  });

  suite('#otherwise', function() {
    test('should set the elseCallback', function() {
      var f = function() {};
      var dr = diceRoll('name').otherwise(f);
      assert.equal(dr.elseCallback, f);
    });
  });

  suite('#run', function() {
  
   test('should call test if 100%', function(done) {
     diceRoll('name')
      .test(100, function(perc, testNum) {
        assert.equal(perc, 100);
        assert.equal(testNum, 0);
        done();
      })
      .run();
   }); 
   
   test('should allow for multiple tests', function(done) {
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
   test('should call otherwise if no test passes', function(done) {
     diceRoll('name')
      .test(0, function() {
      })
      .otherwise(function(perc, testNum) {
        assert.equal(perc, false);
        assert.equal(testNum, 1);
        done();
      })
      .run();
   });

   if (typeof monster !== "undefined") {
     suite('cookies enabled', function() {
       test('should remember last result', function(done) {
         var firstRun = -1;

         var f = function(perc, testNum) {
           if (firstRun == -1) {
             firstRun = testNum;
             run(); //run again
           } else {
             assert.equal(testNum, firstRun);
             done();
           }
         };
         var run = function() {
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
         };
         run();
       });
     });
   }
  });
});
