var Canvas = require('drawille');
var bresenham = require('bresenham');
var glMatrix = require('gl-matrix');
var mat2d = glMatrix.mat2d;
var vec2 = glMatrix.vec2;

function Context(width, height) {
  this.width = width;
  this.height = height;
  this.canvas = new Canvas(width, height);
  this.m = mat2d.create();
}

var methods = ['save', 'restore', 'scale', 'rotate', 'translate', 'transform', 'setTransform', 'resetTransform', 'createLinearGradient', 'createRadialGradient', 'createPattern', 'clearRect', 'fillRect', 'strokeRect', 'beginPath', 'fill', 'stroke', 'drawFocusIfNeeded', 'clip', 'isPointInPath', 'isPointInStroke', 'fillText', 'strokeText', 'measureText', 'drawImage', 'createImageData', 'getImageData', 'putImageData', 'getContextAttributes', 'setLineDash', 'getLineDash', 'setAlpha', 'setCompositeOperation', 'setLineWidth', 'setLineCap', 'setLineJoin', 'setMiterLimit', 'clearShadow', 'setStrokeColor', 'setFillColor', 'drawImageFromRect', 'setShadow', 'closePath', 'moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arcTo', 'rect', 'arc', 'ellipse'];

methods.forEach(function(name) {
  Context.prototype[name] = function() {};
});

function triangle(a, b, f) {
  for(var i = 0; i < a.length; i++) {
    for(var j = 0; j < b.length; j++) {
      bresenham(a[i].x, a[i].y, b[j].x, b[j].y, f);
    }
  }
}

function quad(m, x, y, w, h, f) {
  var p1 = vec2.transformMat2d(vec2.create(), vec2.fromValues(x, y), m);
  var p2 = vec2.transformMat2d(vec2.create(), vec2.fromValues(x+w, y), m);
  var p3 = vec2.transformMat2d(vec2.create(), vec2.fromValues(x, y+h), m);
  var p4 = vec2.transformMat2d(vec2.create(), vec2.fromValues(x+w, y+h), m);
  triangle(bresenham(p1[0], p1[1], p2[0], p2[1]), bresenham(p1[0], p1[1], p3[0], p3[1]), f);
  triangle(bresenham(p4[0], p4[1], p2[0], p2[1]), bresenham(p4[0], p4[1], p3[0], p3[1]), f);
}

Context.prototype.clearRect = function(x, y, w, h) {
  quad(this.m, x, y, w, h, this.canvas.unset.bind(this.canvas));
};

Context.prototype.fillRect = function(x, y, w, h) {
  quad(this.m, x, y, w, h, this.canvas.set.bind(this.canvas));
};

module.exports = Context;
