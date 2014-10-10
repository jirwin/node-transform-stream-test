var test = require('tape');
var _ = require('underscore');

var TransformStreamTest = function(t, stream) {
  this.t = t;
  this.stream = stream;
  this.index = 0;
};

TransformStreamTest.prototype.deepEqual = function(input, output, callback) {
  var self = this,
      outputCounter = 0,
      matches = 0,
      finishedEvent;

  this.index++;

  finishedEvent = 'done' + this.index;

  input = input instanceof Array ? input : [input];
  output = output instanceof Array ? output : [output];

  function processChunk(chunk) {
    var foundMatch = false;

    chunk = chunk instanceof Buffer ? chunk.toString() : chunk;

    outputCounter++;

    _.each(output, function(expectedChunk) {
      if (_.isEqual(chunk, expectedChunk)) {
        if (!foundMatch) {
          matches++;
        }
        foundMatch = true;
      }
    });

    if (!foundMatch) {
      self.stream.removeListener('data', processChunk);
      callback(false);
      return;
    }

    if (outputCounter === output.length) {
      self.stream.removeListener('data', processChunk);
      self.stream.emit(finishedEvent);
      return;
    }
  }

  this.stream.on('data', processChunk);

  this.stream.once(finishedEvent, function() {
    var plan = self.t._plan;

    self.t.plan(plan += 2);

    self.t.equal(outputCounter,
                 output.length,
                 'The expected number of output objects were seen.');
    self.t.equal(output.length,
                 matches,
                 'The expected number of output objects matched.');
    callback(true);
  });

  _.each(input, function(inputChunk) {
    self.stream.write(inputChunk);
  });
};


module.exports = function(t, stream) {
  return new TransformStreamTest(t, stream);
}
