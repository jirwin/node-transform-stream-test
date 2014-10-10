var test = require('tape');

var tst = require('../index');
var streams = require('./stream_fixtures');


test('single input', function(t) {
  var fixture = tst(t, new streams.TestObjectTransform());

  t.plan(1);

  fixture.deepEqual(
    {'foo': 'bar'},
    {'foo': 'bar'},
    'Given a single input the output matched',
    t.ok
  );
});

test('single input, bad ouput', function(t) {
  var fixture = tst(t, new streams.TestObjectTransform());

  t.plan(1);

  fixture.deepEqual(
    {'foo': 'bar'},
    {'foo': 'anything else'},
    'Input did not match output as expected',
    t.ifError
  );
});


test('multiple input', function(t) {
  var fixture = tst(t, new streams.TestObjectTransform());

  t.plan(1);

  fixture.deepEqual(
    [{'foo': 'bar'}, {'baz': 'qux'}],
    [{'foo': 'bar'}, {'baz': 'qux'}],
    'Given multiple inputs the outputs matched.',
    t.ok
  );
});


test('double output', function(t) {
  var fixture = tst(t, new streams.DoubleObjectTransform());

  t.plan(1);

  fixture.deepEqual(
    [{'foo': 'bar'}],
    [{'foo': 'bar'}, {'foo': 'bar'}],
    'For a single input we received two idential outputs',
    t.ok
  );
});


test('reverse string', function(t) {
  var fixture = tst(t, new streams.ReverseTransform()),
      matchString = 'one fish two fish';

  t.plan(1);

  fixture.deepEqual(
    matchString,
    matchString.split('').reverse().join(''),
    'Given a string the output matched the reverse of the string',
    t.ok
  );
});


test('reverse unicode string', function(t) {
  var fixture = tst(t, new streams.ReverseTransform()),
      matchString = 'Do you wanna build a ☃?';

  t.plan(1);

  fixture.deepEqual(
    matchString,
    matchString.split('').reverse().join(''),
    'Given a string with unicode characters the output matched the reverse of the string',
    t.ok
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
      'Given a string the output matched the reverse of the string',
      t.ok
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
    'Given a string the output matched the reverse of the string',
    t.ok
  );

  fixture.deepEqual(
    matchString2,
    matchString2.split('').reverse().join(''),
    'Given a string the output matched the reverse of the string',
    t.ok
  );

  fixture.deepEqual(
    matchString3,
    matchString3.split('').reverse().join(''),
    'Given a string the output matched the reverse of the string',
    t.ok
  );

  fixture.deepEqual(
    matchString4,
    matchString4.split('').reverse().join(''),
    'Given a string the output matched the reverse of the string',
    t.ok
  );
});
