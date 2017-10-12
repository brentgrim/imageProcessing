var processButtons = processButtons || [];


processButtons.push(
    function demonize(imageData) {
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
			if(data[i] > 64){					// red
				data[i + 1] = data[i + 1]/2;    // green
				data[i + 2] = data[i + 2]/2;	// blue
			}
			else{
						data[i + 3] =  64;
			}
		}
        return imageData;
    }
);
processButtons.push(
    function swapColors(imageData) {
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
			    data[i] = data[i+1]			// red
				data[i + 1] = data[i + 2];	// green
				data[i + 2] = data[i];		// blue
		}
        return imageData;
    }
);

processButtons.push(
    function vertstriped(imageData) {
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 8) {
            data[i] = data[i];
			data[i+1] = data[i+1];
			data[i+2] = data[i+2];
			data[i+3] = data[i+3];
			data[i+4] = 0;
			data[i+5] = 0;
			data[i+6] = 0;
			data[i+7] = 0;
        }
        return imageData;
    }
);

processButtons.push(
    function horistriped(imageData) {
        var data = imageData.data;
		var width = imageData.width;
        for (var i = 0; i < data.length; i += 4) {
			if((i %(width*8)) > width*4){
				data[i] = data[i];
				data[i+1] = data[i+1];
				data[i+2] = data[i+2];
				data[i+3] = data[i+3];
				data[i+4] = 0;
				data[i+5] = 0;
				data[i+6] = 0;
				data[i+7] = 0;
			}
        }
        return imageData;
    }
);
processButtons.push(
 function threshold(imageData) {
  var data = imageData.data;
  for (var i=0; i<data.length; i+=4) {
    var r = data[i];
    var g = data[i+1];
    var b = data[i+2];
    var v = (0.2*r + 0.7*g + 0.07*b >= 150) ? 255 : 0;
    data[i] = data[i+1] = data[i+2] = v;
  }
  return imageData;
});

processButtons.push(
    function squish(imageData) {
		var data = imageData.data;
		var width = imageData.width;
		var height = imageData.height;
		
		var newData = new ImageData(width/2,height);
		var newDataArray = newData.data;
 
		
        for (var i = 0; i < data.length; i += 8) {
			
				newDataArray[i/2] = data[i];
				newDataArray[i/2+1] = data[i+1];
				newDataArray[i/2+2] = data[i+2];
				newDataArray[i/2+3] = data[i+3];
        }
		return newData;
    }
);
processButtons.push(
    function slice(imageData) {
		var data = imageData.data;
		var width = imageData.width;
		var height = imageData.height;
		
		var newData = new ImageData(width/2,height/2);
		var newDataArray = newData.data;
 
		var j = 0;
        for (var i = 0; i < data.length; i += 8) {
			if(i % (width * 8) > width*4)
				if(i != 0){
					newDataArray[j] = data[i];
					newDataArray[j+1] = data[i+1];
					newDataArray[j+2] = data[i+2];
					newDataArray[j+3] = data[i+3];
					j+= 4;
			}
        }
		return newData;
    }
);

processButtons.push(
    function quarter(imageData) {
        var width = imageData.width;
        var height = imageData.height;
        var data = imageData.data;        
        var newImage = new ImageData(width/2,height/2);
        var newData = newImage.data;
        var row = 0;
        var column = 0;
        var j = 0;

        for (var i = 0; i < data.length; i += 4) {
            if((i / 4) % width == 0 && i != 0){
				row++;
			}
            column = (i / 4) % width;
            if((column % 2) && (row % 2)){
              newData[j]   = data[i];
              newData[j+1] = data[i+1];
              newData[j+2] = data[i+2];
              newData[j+3] = data[i+3];
              j += 4;
            }
        }
        return newImage;
    }
);

processButtons.push(
    function quadruple(imageData) {
        var width = imageData.width;
        var height = imageData.height;
        var data = imageData.data;
        
        var newImage = new ImageData(width*2,height*2);
        var newData = newImage.data;
        
        var row = 0;
        var column = 0;

        for (var i = 0; i < data.length; i += 4) {
			if((i / 4) % width == 0 && i != 0){
				row+=2;
			}
            column = (i / 4) % width;
            
			for(var j = 0; j < 4; j++){
				newData[row*width*2*4     + 2*column*4+j]      = data[i+j];
				newData[row*width*2*4     + (2*column+1)*4+j]  = data[i+j];
				newData[(row+1)*width*2*4 + 2*column*4+j]      = data[i+j];
				newData[(row+1)*width*2*4 + (2*column+1)*4+j]  = data[i+j];            
            }
        }
        return newImage;
    }
);

processButtons.push(
    function sharpen(imageData) {
		weights = 
		[  
		 0, -1,  0,
		 -1, 5,  -1,
		 0, -1,  0 
		];
		
		var side = Math.sqrt(weights.length);
		var src = imageData.data;
		var width = imageData.width;
		var height = imageData.height;
		
		var output = new ImageData(width, height);
		var dst = output.data;
		
		//Iterate through pixels
		for (var y=0; y<height; y++) {
			for (var x=0; x<width; x++) {
				var dstOffset = (y*width+x)*4;
		//Calculate the weighed sum of the source image pixels
				var r=0, g=0, b=0;
				for (var cy=0; cy<side; cy++) {
					for (var cx=0; cx<side; cx++) {
						var yShift = y + cy -  Math.floor(side/2);
						var xShift = x + cx -  Math.floor(side/2);
						if (yShift >= 0 && yShift < height && xShift >= 0 && xShift < width) {
							var srcOffset = (yShift*width+xShift) * 4;
							r += src[srcOffset]   *  weights[cy*side+cx];
							g += src[srcOffset+1] *  weights[cy*side+cx];
							b += src[srcOffset+2] *  weights[cy*side+cx];
						}
					}
				}
				dst[dstOffset] = r;
				dst[dstOffset+1] = g;
				dst[dstOffset+2] = b;
		//Make completely opaque
				dst[dstOffset+3] = 255;
			}
		}
	return output;
	}
);


processButtons.push(
    function blur(imageData) {
		//only part different than sharpen is input 
		weights = 
		[  
		 .1, .1,  .1,
		 .1, .1,  .1,
		 .1, .1,  .1, 
		];
		
		var side = Math.sqrt(weights.length);
		var src = imageData.data;
		var width = imageData.width;
		var height = imageData.height;
		
		var output = new ImageData(width, height);
		var dst = output.data;
		
		//Iterate through pixels
		for (var y=0; y<height; y++) {
			for (var x=0; x<width; x++) {
				var dstOffset = (y*width+x)*4;
		//Calculate the weighed sum of the source image pixels
				var r=0, g=0, b=0;
				for (var cy=0; cy<side; cy++) {
					for (var cx=0; cx<side; cx++) {
						var yShift = y + cy -  Math.floor(side/2);
						var xShift = x + cx -  Math.floor(side/2);
						if (yShift >= 0 && yShift < height && xShift >= 0 && xShift < width) {
							var srcOffset = (yShift*width+xShift) * 4;
							r += src[srcOffset]   *  weights[cy*side+cx];
							g += src[srcOffset+1] *  weights[cy*side+cx];
							b += src[srcOffset+2] *  weights[cy*side+cx];
						}
					}
				}
				dst[dstOffset] = r;
				dst[dstOffset+1] = g;
				dst[dstOffset+2] = b;
		//Make completely opaque
				dst[dstOffset+3] = 255;
			}
		}
	return output;
	}
);

processButtons.push(
    function sobel(imageData) {
		//emphasizes edges 
		//only part different than sharpen is input 
		weights = 
		[  
		 1, 1,  1,
		 1, .5,  -1,
		 -1, -1,  -1, 
		];
		
		var side = Math.sqrt(weights.length);
		var src = imageData.data;
		var width = imageData.width;
		var height = imageData.height;
		
		var output = new ImageData(width, height);
		var dst = output.data;
		
		//Iterate through pixels
		for (var y=0; y<height; y++) {
			for (var x=0; x<width; x++) {
				var dstOffset = (y*width+x)*4;
		//Calculate the weighed sum of the source image pixels
				var r=0, g=0, b=0;
				for (var yCoord=0; yCoord<side; yCoord++) {
					for (var xCoord=0; xCoord<side; xCoord++) {
						var yShift = y + yCoord -  Math.floor(side/2);
						var xShift = x + xCoord -  Math.floor(side/2);
						if (yShift >= 0 && yShift < height && xShift >= 0 && xShift < width) {
							var srcOffset = (yShift*width+xShift) * 4;
							r += src[srcOffset]   *  weights[yCoord*side+xCoord];
							g += src[srcOffset+1] *  weights[yCoord*side+xCoord];
							b += src[srcOffset+2] *  weights[yCoord*side+xCoord];
						}
					}
				}
				dst[dstOffset] = r;
				dst[dstOffset+1] = g;
				dst[dstOffset+2] = b;
		//Make completely opaque
				dst[dstOffset+3] = 255;
			}
		}
	return output;
	}
);
processButtons.push(
    function sobel2(imageData) {
		//emphasizes edges 
		//only part different than sharpen is input 
		weights = 
		[  
		 -1, 0,  1,
		 -2, 0,  2,
		 -1, 0,  1, 
		];
		
		var side = Math.sqrt(weights.length);
		var src = imageData.data;
		var width = imageData.width;
		var height = imageData.height;
		
		var output = new ImageData(width, height);
		var dst = output.data;
		
		//Iterate through pixels
		for (var y=0; y<height; y++) {
			for (var x=0; x<width; x++) {
				var dstOffset = (y*width+x)*4;
		//Calculate the weighed sum of the source image pixels
				var r=0, g=0, b=0;
				for (var yCoord=0; yCoord<side; yCoord++) {
					for (var xCoord=0; xCoord<side; xCoord++) {
						var yShift = y + yCoord -  Math.floor(side/2);
						var xShift = x + xCoord -  Math.floor(side/2);
						if (yShift >= 0 && yShift < height && xShift >= 0 && xShift < width) {
							var srcOffset = (yShift*width+xShift) * 4;
							r += src[srcOffset]   *  weights[yCoord*side+xCoord];
							g += src[srcOffset+1] *  weights[yCoord*side+xCoord];
							b += src[srcOffset+2] *  weights[yCoord*side+xCoord];
						}
					}
				}
				dst[dstOffset] = r;
				dst[dstOffset+1] = g;
				dst[dstOffset+2] = b;
		//Make completely opaque
				dst[dstOffset+3] = 255;
			}
		}
	return output;
	}
);

processButtons.push(
    function sobel3(imageData) {
		//emphasizes edges 
		//only part different than sharpen is input 
		weights = 
		[  
		 -1, -2,  -1,
		  0, 0,  0,
		  1, 2,  1, 
		];
		
		var side = Math.sqrt(weights.length);
		var src = imageData.data;
		var width = imageData.width;
		var height = imageData.height;
		
		var output = new ImageData(width, height);
		var dst = output.data;
		
		//Iterate through pixels
		for (var y=0; y<height; y++) {
			for (var x=0; x<width; x++) {
				var dstOffset = (y*width+x)*4;
		//Calculate the weighed sum of the source image pixels
				var r=0, g=0, b=0;
				for (var yCoord=0; yCoord<side; yCoord++) {
					for (var xCoord=0; xCoord<side; xCoord++) {
						var yShift = y + yCoord -  Math.floor(side/2);
						var xShift = x + xCoord -  Math.floor(side/2);
						if (yShift >= 0 && yShift < height && xShift >= 0 && xShift < width) {
							var srcOffset = (yShift*width+xShift) * 4;
							r += src[srcOffset]   *  weights[yCoord*side+xCoord];
							g += src[srcOffset+1] *  weights[yCoord*side+xCoord];
							b += src[srcOffset+2] *  weights[yCoord*side+xCoord];
						}
					}
				}
				dst[dstOffset] = r;
				dst[dstOffset+1] = g;
				dst[dstOffset+2] = b;
		//Make completely opaque
				dst[dstOffset+3] = 255;
			}
		}
	return output;
	}
);

processButtons.push(
    function average(imageData) {
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
			    data[i] = data[i+1]			// red
				data[i + 1] = data[i + 2];	// green
				data[i + 2] = data[i];		// blue
		}
        return imageData;
    }
);