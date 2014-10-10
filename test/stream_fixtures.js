var inherits = require('util').inherits;
var Transform = require('stream').Transform;


var TestObjectTransform = function() {
  Transform.call(this, {objectMode: true});
};
inherits(TestObjectTransform, Transform);

TestObjectTransform.prototype._transform = function(obj, encoding, callback) {
  this.push(obj);
  callback();
};


var DoubleObjectTransform = function() {
  Transform.call(this, {objectMode: true});
};
inherits(DoubleObjectTransform, Transform);

DoubleObjectTransform.prototype._transform = function(obj, encoding, callback) {
  this.push(obj);
  this.push(obj);
  callback();
};


var ReverseTransform = function() {
  Transform.call(this);
};
inherits(ReverseTransform, Transform);

ReverseTransform.prototype._transform = function(chunk, encoding, callback) {
  this.push(chunk.toString().split('').reverse().join(''));
  callback();
};


exports.TestObjectTransform = TestObjectTransform;
exports.DoubleObjectTransform = DoubleObjectTransform;
exports.ReverseTransform = ReverseTransform;

