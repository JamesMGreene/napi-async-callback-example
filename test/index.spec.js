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

    it('should expect 3 parameters', function() {
      expect(() => { addon.add(); }).to.throw(TypeError, 'Invalid argument count');
      expect(() => { addon.add(1); }).to.throw(TypeError, 'Invalid argument count');
      expect(() => { addon.add(1, 2); }).to.throw(TypeError, 'Invalid argument count');
      expect(() => { addon.add(1, 2, function() {}, 3); }).to.throw(TypeError, 'Invalid argument count');
    });

    it('should expect valid parameters', function(done) {
      var badFn = () => { done(new TypeError('callback should not have been invoked')); };

      // Invalid param 1
      expect(() => { addon.add('a', 2, badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(false, 2, badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(true, 2, badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add({}, 2, badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add([], 2, badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add([1], 2, badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(() => { 1 }, 2, badFn); }).to.throw(TypeError, 'Invalid argument types');

      // Invalid param 2
      expect(() => { addon.add(1, 'b', badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, false, badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, true, badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, {}, badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, [], badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, [2], badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, () => { 2 }, badFn); }).to.throw(TypeError, 'Invalid argument types');

      // Invalid param 3
      expect(() => { addon.add(1, 2, 'c'); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, 2, false); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, 2, true); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, 2, {}); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, 2, []); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, 2, [3]); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(1, 2, 3); }).to.throw(TypeError, 'Invalid argument types');

      // Invalid params 1 + 2
      expect(() => { addon.add('a', 'b', badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(false, false, badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(true, true, badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add({}, {}, badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add([], [], badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add([1], [2], badFn); }).to.throw(TypeError, 'Invalid argument types');
      expect(() => { addon.add(() => { 1 }, () => { 2 }, badFn); }).to.throw(TypeError, 'Invalid argument types');

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

    it('should return `undefined`', function(done) {
      expect(addon.add(1, 2, function(err, sum) { done(err); })).to.equal(undefined);
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
