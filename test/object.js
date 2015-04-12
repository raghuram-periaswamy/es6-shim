/*global describe, it, expect, require, Symbol */

describe('Object', function () {
  (typeof process !== 'undefined' && process.env.NO_ES6_SHIM ? it.skip : it)('is on the exported object', function () {
    var exported = require('../');
    expect(exported.Object).to.equal(Object);
  });

  var functionsHaveNames = (function foo() {}).name === 'foo';
  var ifFunctionsHaveNamesIt = functionsHaveNames ? it : xit;
  var ifExtensionsPreventable = Object.preventExtensions ? it : xit;

  /*jshint notypeof: true */
  var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';
  /*jshint notypeof: false */
  var ifSymbolsIt = hasSymbols ? it : xit;

  if (Object.getOwnPropertyNames) {
    describe('.getOwnPropertyNames()', function () {
      it('throws on null or undefined', function () {
        expect(function () { Object.getOwnPropertyNames(); }).to['throw'](TypeError);
        expect(function () { Object.getOwnPropertyNames(undefined); }).to['throw'](TypeError);
        expect(function () { Object.getOwnPropertyNames(null); }).to['throw'](TypeError);
      });

      it('works on primitives', function () {
        [true, false, NaN, 42, /a/g, 'foo'].forEach(function (item) {
          expect(Object.getOwnPropertyNames(item)).to.eql(Object.getOwnPropertyNames(Object(item)));
        });
      });
    });
  }

  if (Object.getOwnPropertyDescriptor) {
    describe('.getOwnPropertyDescriptor()', function () {
      it('throws on null or undefined', function () {
        expect(function () { Object.getOwnPropertyDescriptor(); }).to['throw'](TypeError);
        expect(function () { Object.getOwnPropertyDescriptor(undefined); }).to['throw'](TypeError);
        expect(function () { Object.getOwnPropertyDescriptor(null); }).to['throw'](TypeError);
      });

      it('works on primitives', function () {
        [true, false, NaN, 42, /a/g, 'foo'].forEach(function (item) {
          expect(Object.getOwnPropertyDescriptor(item, 'foo')).to.eql(Object.getOwnPropertyDescriptor(Object(item), 'foo'));
        });
      });
    });
  }

  if (Object.seal) {
    describe('.seal()', function () {
      it('works on primitives', function () {
        [null, undefined, true, false, NaN, 42, 'foo'].forEach(function (item) {
          expect(Object.seal(item)).to.eql(item);
        });
      });
    });
  }

  if (Object.isSealed) {
    describe('.isSealed()', function () {
      it('works on primitives', function () {
        [null, undefined, true, false, NaN, 42, 'foo'].forEach(function (item) {
          expect(Object.isSealed(item)).to.equal(true);
        });
      });
    });
  }

  if (Object.freeze) {
    describe('.freeze()', function () {
      it('works on primitives', function () {
        [null, undefined, true, false, NaN, 42, 'foo'].forEach(function (item) {
          expect(Object.freeze(item)).to.eql(item);
        });
      });
    });
  }

  if (Object.isFrozen) {
    describe('.isFrozen()', function () {
      it('works on primitives', function () {
        [null, undefined, true, false, NaN, 42, 'foo'].forEach(function (item) {
          expect(Object.isFrozen(item)).to.equal(true);
        });
      });
    });
  }

  if (Object.preventExtensions) {
    describe('.preventExtensions()', function () {
      it('works on primitives', function () {
        [null, undefined, true, false, NaN, 42, 'foo'].forEach(function (item) {
          expect(Object.preventExtensions(item)).to.eql(item);
        });
      });
    });
  }

  if (Object.isExtensible) {
    describe('.isExtensible()', function () {
      it('works on primitives', function () {
        [null, undefined, true, false, NaN, 42, 'foo'].forEach(function (item) {
          expect(Object.isExtensible(item)).to.equal(false);
        });
      });
    });
  }

  describe('.keys()', function () {
    it('works on strings', function () {
      expect(Object.keys('foo')).to.eql(['0', '1', '2']);
    });

    it('throws on null or undefined', function () {
      expect(function () { Object.keys(); }).to['throw'](TypeError);
      expect(function () { Object.keys(undefined); }).to['throw'](TypeError);
      expect(function () { Object.keys(null); }).to['throw'](TypeError);
    });

    it('works on other primitives', function () {
      [true, false, NaN, 42, /a/g].forEach(function (item) {
        expect(Object.keys(item)).to.eql([]);
      });
    });
  });

  describe('.is()', function () {
    if (!Object.hasOwnProperty('is')) {
      return it('exists', function () {
        expect(Object).to.have.property('is');
      });
    }

    ifFunctionsHaveNamesIt('has the right name', function () {
      expect(Object.is).to.have.property('name', 'is');
    });

    it('should have the right arity', function () {
      expect(Object.is).to.have.property('length', 2);
    });

    it('should compare regular objects correctly', function () {
      [null, undefined, [0], 5, 'str', {a: null}].map(function (item) {
        return Object.is(item, item);
      }).forEach(function (result) {
        expect(result).to.equal(true);
      });
    });

    it('should compare 0 and -0 correctly', function () {
      expect(Object.is(0, -0)).to.equal(false);
    });

    it('should compare NaNs correctly', function () {
      expect(Object.is(NaN, NaN)).to.equal(true);
    });
  });

  describe('.assign()', function () {
    if (!Object.hasOwnProperty('assign')) {
      return it('exists', function () {
        expect(Object).to.have.property('assign');
      });
    }

    it('has the correct length', function () {
      expect(Object.assign.length).to.eql(2);
    });

    it('returns the modified target object', function () {
      var target = {};
      var returned = Object.assign(target, { a: 1 });
      expect(returned).to.equal(target);
    });

    it('should merge two objects', function () {
      var target = { a: 1 };
      var returned = Object.assign(target, { b: 2 });
      expect(returned).to.eql({ a: 1, b: 2 });
    });

    it('should merge three objects', function () {
      var target = { a: 1 };
      var source1 = { b: 2 };
      var source2 = { c: 3 };
      var returned = Object.assign(target, source1, source2);
      expect(returned).to.eql({ a: 1, b: 2, c: 3 });
    });

    it('only iterates over own keys', function () {
      var Foo = function () {};
      Foo.prototype.bar = true;
      var foo = new Foo();
      foo.baz = true;
      var target = { a: 1 };
      var returned = Object.assign(target, foo);
      expect(returned).to.equal(target);
      expect(target).to.eql({ baz: true, a: 1 });
    });

    it('throws when target is not an object', function () {
      expect(function () { Object.assign(null); }).to['throw'](TypeError);
    });

    it('ignores non-object sources', function () {
      expect(Object.assign({ a: 1 }, null, { b: 2 })).to.eql({ a: 1, b: 2 });
      expect(Object.assign({ a: 1 }, undefined, { b: 2 })).to.eql({ a: 1, b: 2 });
      expect(Object.assign({ a: 1 }, { b: 2 }, null)).to.eql({ a: 1, b: 2 });
    });

    ifExtensionsPreventable('does not have pending exceptions', function () {
      'use strict';
      // Firefox 37 still has "pending exception" logic in its Object.assign implementation,
      // which is 72% slower than our shim, and Firefox 40's native implementation.
      var thrower = Object.preventExtensions({ 1: 2 });
      var error;
      try { Object.assign(thrower, 'xy'); } catch (e) { error = e; }
      expect(error).to.be.an.instanceOf(TypeError);
      expect(thrower).to.have.property(1, 2);
    });

    ifSymbolsIt('includes enumerable symbols, after keys', function () {
      var visited = [];
      var obj = {};
      Object.defineProperty(obj, 'a', { get: function () { visited.push('a'); return 42; }, enumerable: true });
      var symbol = Symbol('enumerable');
      Object.defineProperty(obj, symbol, { get: function () { visited.push(symbol); return Infinity; }, enumerable: true });
      var nonEnumSymbol = Symbol('non-enumerable');
      Object.defineProperty(obj, nonEnumSymbol, { get: function () { visited.push(nonEnumSymbol); return -Infinity; }, enumerable: false });
      var target = Object.assign({}, obj);
      expect(visited).to.eql(['a', symbol]);
      expect(target.a).to.equal(42);
      expect(target[symbol]).to.equal(Infinity);
      expect(target[nonEnumSymbol]).not.to.equal(-Infinity);
    });
  });

  describe('Object.setPrototypeOf()', function () {
    if (!Object.setPrototypeOf) {
      return; // IE < 11
    }

    describe('argument checking', function () {
      it('should throw TypeError if first arg is not object', function () {
        var nonObjects = [null, undefined, true, false, 1, 3, 'foo'];
        nonObjects.forEach(function (value) {
          expect(function () { Object.setPrototypeOf(value); }).to['throw'](TypeError);
        });
      });

      it('should throw TypeError if second arg is not object or null', function () {
        expect(function () { Object.setPrototypeOf({}, null); }).not.to['throw'](TypeError);
        var invalidPrototypes = [true, false, 1, 3, 'foo'];
        invalidPrototypes.forEach(function (proto) {
          expect(function () { Object.setPrototypeOf({}, proto); }).to['throw'](TypeError);
        });
      });
    });

    describe('set prototype', function () {
      it('should work', function () {
        var Foo = function () {};
        var Bar = {};
        var foo = new Foo();
        expect(Object.getPrototypeOf(foo)).to.equal(Foo.prototype);

        var fooBar = Object.setPrototypeOf(foo, Bar);
        expect(fooBar).to.equal(foo);
        expect(Object.getPrototypeOf(foo)).to.equal(Bar);
      });
      it('should be able to set to null', function () {
        var Foo = function () {};
        var foo = new Foo();

        var fooNull = Object.setPrototypeOf(foo, null);
        expect(fooNull).to.equal(foo);
        expect(Object.getPrototypeOf(foo)).to.equal(null);
      });
    });
  });
});
