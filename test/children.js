import test from 'tape'
import {assert} from '../index.js'

test('children', function (t) {
  t.throws(
    function () {
      assert({type: 'paragraph', children: {alpha: 'bravo'}})
    },
    /`children` should be an array: `{ type: 'paragraph', children: { alpha: 'bravo' } }`$/,
    'should throw if given a non-node child in children'
  )

  t.throws(
    function () {
      assert({type: 'paragraph', children: ['one']})
    },
    /node should be an object: `'one'` in `{ type: 'paragraph', children: \[ 'one' ] }`$/,
    'should throw if given a non-node child in children'
  )

  t.doesNotThrow(function () {
    assert({type: 'paragraph', children: [{type: 'text', value: 'alpha'}]})
  }, 'should not throw on vald children')

  t.throws(
    function () {
      assert({
        type: 'paragraph',
        children: [{type: 'bar', children: ['one']}]
      })
    },
    /node should be an object: `'one'` in `{ type: 'bar', children: \[ 'one' ] }`$/,
    'should throw on invalid descendants'
  )

  t.end()
})
