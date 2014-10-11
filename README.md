transform-stream-test
==========================

[![Build Status](https://travis-ci.org/jirwin/node-transform-stream-test.svg?branch=master)](https://travis-ci.org/jirwin/node-transform-stream-test)

## Install
`npm install transform-stream-test`

## What
A module that leverages tape to test a transform stream. Transform streams typically take a set of input chunks and deterministically pipes out chunks generated from the input.

`transform-stream-test` lets you easily create test cases(via tape) where you provide input and assert that you get the output you expect.

## Example
```js
var test = require('tape');
var through = require('through');
var tst = require('transform-stream-test');


test('simple test', function(t) {
  var stream = through(),
      fixture = tst(t, stream);

  t.plan(2);

  fixture.deepEqual(
    'foo bar one two three',
    'foo bar one two three',
    'Given a single input chunk the output matched',
    t.ok
  );

  fixture.deepEqual(
    ['foo', 'bar', 'one', 'two', 'three'],
    ['foo', 'bar', 'one', 'two', 'four'],
    'Given multiple input chunks the output chunks did not all match',
    t.error
  );
});

```

## Methods
You create a fixture by calling tst with a tape test object and the transform stream to test.

```js
var fixture = require('transform-stream-test')(t, transformStream);
```

### fixture.deepEqual(input, output, msg, cb, timeout)
Performs a deep equal comparing each output chunk received with each expected output chunk.

* `input`: Array of input chunks
* `output`: Array of expected output chunks
* `msg`: The description of the test case
* `cb`: function fired with `cb(success, msg)`
  * `success` is a boolean representing whether or not the output matched the expectation
  * `msg` is the same message provided above
* `timeout`: optional number of milliseconds to finish the test case
  * This is useful for when you don't expect any output

## License
Apache v2
