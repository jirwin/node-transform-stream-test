var test = require('tape');

var tst = require('../index');
var streams = require('./stream_fixtures');


test('single input', function(t) {
  var fixture = tst(t, new streams.TestObjectTransform());

  t.plan(1);

  fixture.deepEqual({'foo': 'bar'}, {'foo': 'bar'}, function(success) {
    t.ok(success, 'Given a single input the output matched.');
  });
});

test('single input, bad ouput', function(t) {
  var fixture = tst(t, new streams.TestObjectTransform());

  t.plan(1);

  fixture.deepEqual(
    {'foo': 'bar'},
    {'foo': 'anything else'},
    function(success) {
      t.ifError(success, 'Input did not match output as expected.');
    }
  );
});


test('multiple input', function(t) {
  var fixture = tst(t, new streams.TestObjectTransform());

  t.plan(1);

  fixture.deepEqual(
    [{'foo': 'bar'}, {'baz': 'qux'}],
    [{'foo': 'bar'}, {'baz': 'qux'}],
    function(success) {
      t.ok(success, 'Given multiple inputs the outputs matched.');
    }
  );
});


test('double output', function(t) {
  var fixture = tst(t, new streams.DoubleObjectTransform());

  t.plan(1);

  fixture.deepEqual(
    [{'foo': 'bar'}],
    [{'foo': 'bar'}, {'foo': 'bar'}],
    function(success) {
      t.ok(success, 'For a single input we received two identical outputs.');
    }
  );
});


test('reverse string', function(t) {
  var fixture = tst(t, new streams.ReverseTransform()),
      matchString = 'one fish two fish';

  t.plan(1);

  fixture.deepEqual(
    matchString,
    matchString.split('').reverse().join(''),
    function(success) {
      t.ok(success, 'Given a string the output matched the reverse of the string.');
    }
  );
});


test('reverse unicode string', function(t) {
  var fixture = tst(t, new streams.ReverseTransform()),
      matchString = 'Do you wanna build a ☃?';

  t.plan(1);

  fixture.deepEqual(
    matchString,
    matchString.split('').reverse().join(''),
    function(success) {
      t.ok(success, 'Given a string with unicode characters the output matched the reverse of the string.');
    }
  );
});


test('reverse string - multiple async loop test cases', function(t) {
  var fixture = tst(t, new streams.ReverseTransform()),
      matchStrings = [
        'one fish two fish',
        'red fish blue fish',
        'black fish blue fish',
        'old fish new fish'
      ];

  t.plan(matchStrings.length);

  matchStrings.forEach(function(matchString) {
    fixture.deepEqual(
      matchString,
      matchString.split('').reverse().join(''),
      function(success) {
        t.ok(success, 'Given a string the output matched the reverse of the string.');
      }
    );
  });
});


test('reverse string - multiple async test cases', function(t) {
  var fixture = tst(t, new streams.ReverseTransform()),
      matchString1 = 'one fish two fish',
      matchString2 = 'red fish blue fish',
      matchString3 = 'black fish blue fish',
      matchString4 = 'old fish new fish';

  t.plan(4);

  fixture.deepEqual(
    matchString1,
    matchString1.split('').reverse().join(''),
    function(success) {
      t.ok(success, 'Given a string the output matched the reverse of the string.');
    }
  );

  fixture.deepEqual(
    matchString2,
    matchString2.split('').reverse().join(''),
    function(success) {
      t.ok(success, 'Given a string the output matched the reverse of the string.');
    }
  );

  fixture.deepEqual(
    matchString3,
    matchString3.split('').reverse().join(''),
    function(success) {
      t.ok(success, 'Given a string the output matched the reverse of the string.');
    }
  );

  fixture.deepEqual(
    matchString4,
    matchString4.split('').reverse().join(''),
    function(success) {
      t.ok(success, 'Given a string the output matched the reverse of the string.');
    }
  );
});
