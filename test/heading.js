/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module mdast-util-assert
 * @fileoverview Test suite for `mdast-util-assert`.
 */

'use strict';

/* eslint-env node */

/* Dependencies. */
var test = require('tape');
var assert = require('..');

test('assert(heading)', function (t) {
  t.throws(
    function () {
      assert({type: 'heading'});
    },
    /^AssertionError: parent should have `children`: `{ type: 'heading' }`$/,
    'should throw if a `heading` is not a parent'
  );

  t.throws(
    function () {
      assert({type: 'heading', depth: 0, children: []});
    },
    /^AssertionError: `depth` should be gte `1`: `{ type: 'heading', depth: 0, children: \[\] }`$/,
    'should throw if `depth` is lower than 1'
  );

  t.throws(
    function () {
      assert({type: 'heading', depth: 7, children: []});
    },
    /^AssertionError: `depth` should be lte `6`: `{ type: 'heading', depth: 7, children: \[\] }`$/,
    'should throw if `depth` is lower than 7'
  );

  t.doesNotThrow(
    function () {
      assert({type: 'heading', depth: 1, children: []});
    },
    'should not throw if `heading` is between 0 and 7'
  );

  t.end();
});
