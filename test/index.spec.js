// Userland modules
var chai = require('chai');

// Local modules
var addon = require('../');


// Local variales
var expect = chai.expect;



describe('addon', function() {

  it('should have all expected keys', function() {
    expect(addon).to.contain.all.keys(['add']);
  });


  describe('.add', function() {

    it('should be a function', function() {
      expect(addon.add).to.be.a('function');
    });

    it('should synchronously throw when less than 3 parameters', function() {
      expect(() => { addon.add(); }).to.throw(TypeError, 'Invalid argument count');
      expect(() => { addon.add(1); }).to.throw(TypeError, 'Invalid argument count');
      expect(() => { addon.add(1, 2); }).to.throw(TypeError, 'Invalid argument count');
    });

    it('should asynchronously invoke the callback with an Error when more than 3 parameters', function(done) {
      // Arrange
      var step = 0;

      // Act
      addon.add(1, 2, function(err, sum) {
        // Assert more
        expect(err).to.be.an.instanceOf(TypeError);
        expect(err.message).to.equal('Invalid argument count');
        expect(sum).to.equal(undefined);
        expect(step).to.equal(1);
        done();
      }, { another: 'argument' });

      // Assert
      expect(step).to.equal(0);
      step++;
    });

    it('should synchronously throw when 3rd parameter is not a function', function(done) {
      // Invalid param 3
      expect(() => { addon.add(1, 2, 'c'); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, 2, false); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, 2, true); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, 2, {}); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, 2, []); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, 2, [3]); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, 2, 3); }).to.throw(TypeError, 'Invalid argument types');

      // Invalid params 1 + 3
      expect(() => { addon.add('a', 2, 'c'); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(false, 2, false); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(true, 2, true); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add({}, 2, {}); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add([], 2, []); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add([1], 2, [3]); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(() => { 1 }, 2, 3); }).to.throw(TypeError, 'Invalid argument types');

      // Invalid params 2 + 3
      expect(() => { addon.add(1, 'b', 'c'); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, false, false); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, true, true); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, {}, {}); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, [], []); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, [2], [3]); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, () => { 2 }, 3); }).to.throw(TypeError, 'Invalid argument types');

      // Invalid params 1 + 2 + 3
      expect(() => { addon.add('a', 'b', 'c'); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(false, false, false); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(true, true, true); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add({}, {}, {}); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add([], [], []); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add([1], [2], [3]); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(() => { 1 }, () => { 2 }, 3); }).to.throw(TypeError, 'Invalid argument types');

      done();
    });

    it('should asynchronously invoke the callback with an Error when other parameters are invalid', function(done) {
      var timerId,
          expectedCount = 0,
          actualCount = 0,
          step = 0,
          errorCheckerFn = function() {
            expectedCount++;

            return function(err, sum) {
              if (timerId) {
                clearTimeout(timerId);
                timerId = null;
              }

              actualCount++;

              // Assert more
              expect(err).to.be.an.instanceOf(TypeError);
              expect(err.message).to.equal('Invalid argument types');
              expect(sum).to.equal(undefined);
              expect(actualCount).to.be.within(0, expectedCount);
              expect(step).to.equal(1);

              timerId = setTimeout(
                function() {
                  if (actualCount === expectedCount) {
                    done();
                  }
                },
                25
              );
            };
          };

      // Invalid param 1
      addon.add('a', 2, errorCheckerFn());
      addon.add(false, 2, errorCheckerFn());
      addon.add(true, 2, errorCheckerFn());
      addon.add({}, 2, errorCheckerFn());
      addon.add([], 2, errorCheckerFn());
      addon.add([1], 2, errorCheckerFn());
      addon.add(() => { 1 }, 2, errorCheckerFn());

      // Invalid param 2
      addon.add(1, 'b', errorCheckerFn());
      addon.add(1, false, errorCheckerFn());
      addon.add(1, true, errorCheckerFn());
      addon.add(1, {}, errorCheckerFn());
      addon.add(1, [], errorCheckerFn());
      addon.add(1, [2], errorCheckerFn());
      addon.add(1, () => { 2 }, errorCheckerFn());

      // Invalid params 1 + 2
      addon.add('a', 'b', errorCheckerFn());
      addon.add(false, false, errorCheckerFn());
      addon.add(true, true, errorCheckerFn());
      addon.add({}, {}, errorCheckerFn());
      addon.add([], [], errorCheckerFn());
      addon.add([1], [2], errorCheckerFn());
      addon.add(() => { 1 }, () => { 2 }, errorCheckerFn());

      // Assert
      expect(step).to.equal(0);
      step++;
    });

    it('should return `undefined`', function(done) {
      expect(
        addon.add(1, 2, function( err /*, sum */ ) { done(err); })
      ).to.equal(undefined);
    });

    it('should execute callback', function(done) {
      addon.add(
        1, 2,
        function(err, sum) {
          expect(err).to.not.exist;
          expect(sum).to.equal(3);
          done();
        }
      );
    });

    it('should execute callback asynchronously', function(done) {
      // Arrange
      var step = 0;

      // Act
      addon.add(
        1, 2,
        function(err, sum) {
          // Assert more
          expect(err).to.not.exist;
          expect(sum).to.equal(3);
          expect(step).to.equal(1);
          done();
        }
      );

      // Assert
      expect(step).to.equal(0);
      step++;
    });

    it('should add numbers together', function(done) {
      var timerId,
          expectedCount = 0,
          actualCount = 0,
          sumCheckerFn = function(sumExpected) {
            expectedCount++;

            return function(err, sum) {
              if (timerId) {
                clearTimeout(timerId);
                timerId = null;
              }

              actualCount++;

              expect(err).to.not.exist;
              expect(sum).to.equal(sumExpected);
              expect(actualCount).to.be.within(0, expectedCount);

              timerId = setTimeout(
                function() {
                  if (actualCount === expectedCount) {
                    done();
                  }
                },
                25
              );
            };
          };

      // zeroes
      addon.add(0, 0, sumCheckerFn(0));

      // zeroes + positives
      addon.add(0, 1, sumCheckerFn(1));
      addon.add(1, 0, sumCheckerFn(1));

      // zeroes + negatives
      addon.add(0, -1, sumCheckerFn(-1));
      addon.add(-1, 0, sumCheckerFn(-1));

      // positives
      addon.add(2, 3, sumCheckerFn(5));
      addon.add(3, 2, sumCheckerFn(5));

      // negatives
      addon.add(-2, -3, sumCheckerFn(-5));
      addon.add(-3, -2, sumCheckerFn(-5));

      // postives + negatives
      addon.add(2, -3, sumCheckerFn(-1));
      addon.add(-3, 2, sumCheckerFn(-1));
      addon.add(-2, 3, sumCheckerFn(1));
      addon.add(3, -2, sumCheckerFn(1));
    });

  });

});
