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
