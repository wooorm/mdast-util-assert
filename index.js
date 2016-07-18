/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module mdast-util-assert
 * @fileoverview Assert `unist` nodes.
 */

'use strict';

/* eslint-env commonjs */
/* eslint-disable babel/new-cap */

/* Dependencies. */
var assert = require('assert');
var array = require('x-is-array');
var zwitch = require('zwitch');
var mapz = require('mapz');
var unist = require('unist-util-assert');

/* Construct. */
var mdast = zwitch('type');

/* Expose. */
module.exports = exports = unist.wrap(mdast);

exports.parent = unist.wrap(parent);
exports.text = unist.text;
exports.void = unist.void;
exports.wrap = unist.wrap;
exports.all = mapz(exports, {key: 'children', indices: false});

/* Core interface. */
mdast.invalid = mdast.unknown = unknown;

/* Per-type handling. */
mdast.handlers = {
  root: unist.wrap(root),
  paragraph: exports.parent,
  blockquote: exports.parent,
  tableRow: exports.parent,
  tableCell: exports.parent,
  strong: exports.parent,
  emphasis: exports.parent,
  delete: exports.parent,
  listItem: unist.wrap(listItem),
  footnote: exports.parent,
  heading: unist.wrap(heading),
  text: exports.text,
  inlineCode: exports.text,
  yaml: exports.text,
  code: unist.wrap(code),
  thematicBreak: exports.void,
  break: exports.void,
  list: unist.wrap(list),
  footnoteDefinition: unist.wrap(footnoteDefinition),
  definition: unist.wrap(definition),
  link: unist.wrap(link),
  image: unist.wrap(image),
  linkReference: unist.wrap(linkReference),
  imageReference: unist.wrap(imageReference),
  footnoteReference: unist.wrap(footnoteReference),
  table: unist.wrap(table),
  html: exports.text
};

function unknown(node, ancestor) {
  unist(node, ancestor);
}

function parent(node) {
  unist.parent(node);
  exports.all(node);
}

function root(node, ancestor) {
  parent(node);

  assert.equal(ancestor, undefined, '`root` should not have a parent');
}

function list(node) {
  parent(node);

  if (node.loose != null) {
    assert.equal(typeof node.loose, 'boolean', '`loose` must be `boolean`');
  }

  if (node.ordered != null) {
    assert.equal(typeof node.ordered, 'boolean', '`ordered` must be `boolean`');
  }

  if (!node.ordered) {
    assert.ok(node.start == null, 'unordered lists must not have `start`');
  } else if (node.start != null) {
    assert.equal(typeof node.start, 'number', 'ordered lists must have `start`');
    assert.ok(node.start >= 0, '`start` must be gte `0`');
  }
}

function listItem(node) {
  parent(node);

  if (node.loose != null) {
    assert.equal(typeof node.loose, 'boolean', '`loose` must be `boolean`');
  }

  if (node.checked != null) {
    assert.equal(typeof node.checked, 'boolean', '`checked` must be `boolean`');
  }
}

function heading(node) {
  parent(node);

  assert.ok(node.depth > 0, '`depth` should be gte `1`');
  assert.ok(node.depth <= 6, '`depth` should be lte `6`');
}

function code(node) {
  unist.text(node);

  if (node.lang != null) {
    assert.equal(typeof node.lang, 'string', '`lang` must be `string`');
  }
}

function footnoteDefinition(node) {
  parent(node);

  assert.equal(typeof node.identifier, 'string', '`footnoteDefinition` must have `identifier`');
}

function definition(node) {
  unist.void(node);

  assert.equal(typeof node.identifier, 'string', '`identifier` must be `string`');

  if (node.url != null) {
    assert.equal(typeof node.url, 'string', '`url` must be `string`');
  }

  if (node.title != null) {
    assert.equal(typeof node.title, 'string', '`title` must be `string`');
  }
}

function link(node) {
  parent(node);

  if (node.url != null) {
    assert.equal(typeof node.url, 'string', '`url` must be `string`');
  }

  if (node.title != null) {
    assert.equal(typeof node.title, 'string', '`title` must be `string`');
  }
}

function image(node) {
  unist.void(node);

  if (node.url != null) {
    assert.equal(typeof node.url, 'string', '`url` must be `string`');
  }

  if (node.alt != null) {
    assert.equal(typeof node.alt, 'string', '`alt` must be `string`');
  }

  if (node.title != null) {
    assert.equal(typeof node.title, 'string', '`title` must be `string`');
  }
}

function linkReference(node) {
  parent(node);

  assert.equal(typeof node.identifier, 'string', '`identifier` must be `string`');

  if (node.referenceType != null) {
    assert.notEqual(
      ['shortcut', 'collapsed', 'full'].indexOf(node.referenceType),
      -1,
      '`referenceType` must be `shortcut`, `collapsed`, or `full`'
    );
  }
}

function imageReference(node) {
  unist.void(node);

  assert.equal(
    typeof node.identifier,
    'string',
    '`identifier` must be `string`'
  );

  if (node.alt != null) {
    assert.equal(typeof node.alt, 'string', '`alt` must be `string`');
  }

  if (node.referenceType != null) {
    assert.notEqual(
      ['shortcut', 'collapsed', 'full'].indexOf(node.referenceType),
      -1,
      '`referenceType` must be `shortcut`, `collapsed`, or `full`'
    );
  }
}

function footnoteReference(node) {
  unist.void(node);

  assert.equal(typeof node.identifier, 'string', '`identifier` must be `string`');
}

function table(node) {
  var align;
  var val;
  var length;
  var index;

  parent(node);

  align = node.align;

  if (align != null) {
    assert.ok(array(align), '`align` must be `array`');

    length = align.length;
    index = -1;

    while (++index < length) {
      val = align[index];

      if (val != null) {
        assert.notEqual(
          ['left', 'right', 'center'].indexOf(val),
          -1,
          'each align in table must be `null, \'left\', \'right\', \'center\'`'
        );
      }
    }
  }
}
