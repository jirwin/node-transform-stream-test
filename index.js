var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

var test = require('tape');
var _ = require('underscore');


var TransformStreamTest = function(t, stream) {
  EventEmitter.call(this);
  this.t = t;
  this.stream = stream;
  this.index = 0;
};
inherits(TransformStreamTest, EventEmitter);


TransformStreamTest.prototype._incrementPlanned = function(num) {
  this.t.plan(this.t._plan += num);
};


TransformStreamTest.prototype.deepEqual = function(input, output, msg, callback, timeout) {
  var self = this,
      inputCounter = 0,
      outputCounter = 0,
      outputLength = 0,
      matchedOutput = [],
      finishedEvent;

  this.index++;

  finishedEvent = 'done' + this.index;

  input = input instanceof Array ? input : [input];

  if (!output) {
    output = [];
  }
  output = output instanceof Array ? output : [output];
  outputLength = output.length;

  function processChunk(chunk) {
    var foundMatch = false,
        i = 0;

    chunk = chunk instanceof Buffer ? chunk.toString() : chunk;

    outputCounter++;

    for (i = 0; i < output.length; i++) {
      if (!foundMatch) {
        if (_.isEqual(chunk, output[i])) {
          matchedOutput.push(output.splice(i, 1));
          foundMatch = true;
        }
      }
    }

    if (!foundMatch) {
      self.stream.removeListener('data', processChunk);
      self.emit(finishedEvent);
      return;
    }

    if (outputCounter === outputLength) {
      self.stream.removeListener('data', processChunk);
      self.emit(finishedEvent);
      return;
    }
  }

  this.stream.on('data', processChunk);

  this.once(finishedEvent, function() {
    self._incrementPlanned(3);
    self.t.equal(outputCounter, outputLength,
                 'The expected number of output chunks were seen.');
    self.t.equal(output.length, 0, 'Unmatched output: ' + JSON.stringify(output, null, 4));
    self.t.equal(outputLength, matchedOutput.length, 'All expected output was matched');
    callback(true, msg);
  });

  if (timeout) {
    setTimeout(this.emit.bind(this, finishedEvent), timeout);
  }

  _.each(input, function(inputChunk) {
    self.stream.write(inputChunk);
    inputCounter++;
  });

  this._incrementPlanned(1);
  this.t.equal(inputCounter,
               input.length,
               'The expected number of chunks were written to the stream.')
};


module.exports = function(t, stream) {
  return new TransformStreamTest(t, stream);
}

