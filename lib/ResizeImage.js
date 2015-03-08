'use strict';

function scaleImage(maxWidth, maxHeight, currentWidth, currentHeight) {
  var ratio = currentHeight/currentWidth;

  if (currentWidth >= maxWidth && ratio <= 1) {
    currentWidth = maxWidth;
    currentHeight = currentWidth * ratio;
  }
  else if (currentHeight >= maxHeight) {
    currentHeight = maxHeight;
    currentWidth = currentHeight/ratio;
  }

  return {
    width: currentWidth,
    height: currentHeight
  };
}

module.exports = function(imageSource, opts, cb) {
  if(!opts.width || !opts.height){
    return cb(new Error('max height or width required'));
  }
  var img = new Image();
  img.onload = function() {
    var scaledSize = scaleImage(opts.width, opts.height, img.width, img.height);
    var canvas = document.createElement('canvas');
    canvas.height = canvas.width * (img.height/img.width);
    var ctx = canvas.getContext('2d');
    canvas.width = scaledSize.width;
    canvas.height = scaledSize.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return cb(null, canvas.toDataURL());
  };

  img.src = URL.createObjectURL(imageSource);
  img.onerror = cb;
};