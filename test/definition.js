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

test('assert(definition)', function (t) {
  t.throws(
    function () {
      assert({type: 'definition'});
    },
    /^AssertionError: `identifier` must be `string`: `{ type: 'definition' }`$/,
    'should throw if `definition` has no `identifier`'
  );

  t.throws(
    function () {
      assert({type: 'definition', identifier: 1});
    },
    /^AssertionError: `identifier` must be `string`: `{ type: 'definition', identifier: 1 }`$/,
    'should throw if `identifier` is not a `string`'
  );

  t.doesNotThrow(
    function () {
      assert({type: 'definition', identifier: '1'});
    },
    'should not throw if `definition` has no other properties'
  );

  t.throws(
    function () {
      assert({type: 'definition', identifier: '1', url: 1});
    },
    /^AssertionError: `url` must be `string`: `{ type: 'definition', identifier: '1', url: 1 }`$/,
    'should throw if `identifier` is not a `string`'
  );

  t.throws(
    function () {
      assert({type: 'definition', identifier: '1', title: 1});
    },
    /^AssertionError: `title` must be `string`: `{ type: 'definition', identifier: '1', title: 1 }`$/,
    'should throw if `title` is not a `string`'
  );

  t.end();
});
