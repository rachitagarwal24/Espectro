var camera = {
	focus : 400,
	self : {
		x : 0,
		y : 0,
		z : 0
	},
	rotate : {
		x : 0,
		y : 0,
		z : 0
	},
	up : {
		x : 0,
		y : 1,
		z : 0
	},
	zoom : 1,
	display : {
		x : window.innerWidth/2,
		y : window.innerHeight/2,
		z : 0
	}
};
var affine = {
	world : {
		size : function(p, size) {
			return {
				x :	p.x * size.x,
				y : p.y * size.y,
				z : p.z * size.z
			}
		},
		rotate: {
			x : function(p, rotate) {
				return {
					x : p.x,
					y : p.y*Math.cos(dtr(rotate.x)) - p.z*Math.sin(dtr(rotate.x)),
					z : p.y*Math.sin(dtr(rotate.x)) + p.z*Math.cos(dtr(rotate.x))
				}
			},
			y : function(p, rotate) {
				return {
					x : p.x*Math.cos(dtr(rotate.y)) + p.z*Math.sin(dtr(rotate.y)),
					y : p.y,
					z : -p.x*Math.sin(dtr(rotate.y)) + p.z*Math.cos(dtr(rotate.y))
				}
			},
			z : function(p, rotate) {
				return {
					x : p.x*Math.cos(dtr(rotate.z)) - p.y*Math.sin(dtr(rotate.z)),
					y : p.x*Math.sin(dtr(rotate.z)) + p.y*Math.cos(dtr(rotate.z)),
					z : p.z
				}
			}
		},
		position : function(p, position) {
			return {
				x : p.x + position.x,
				y : p.y + position.y,
				z : p.z + position.z
			}
		},
	},
	view : {
		point : function(p) {
			return {
				x : p.x - camera.self.x,
				y : p.y - camera.self.y,
				z : p.z - camera.self.z
			}
		},
		x : function(p) {
			return {
				x : p.x,
				y : p.y*Math.cos(dtr(camera.rotate.x)) - p.z*Math.sin(dtr(camera.rotate.x)),
				z : p.y*Math.sin(dtr(camera.rotate.x)) + p.z*Math.cos(dtr(camera.rotate.x))
			}
		},
		y : function(p) {
			return {
				x : p.x*Math.cos(dtr(camera.rotate.y)) + p.z*Math.sin(dtr(camera.rotate.y)),
				y : p.y,
				z : p.x*-Math.sin(dtr(camera.rotate.y)) + p.z*Math.cos(dtr(camera.rotate.y))
			}
		},
		viewReset : function(p) {
			return {
				x : p.x - camera.self.x,
				y : p.y - camera.self.y,
				z : p.z - camera.self.z
			}
		},
		righthandedReversal : function(p) {
			return {
				x : p.x,
				y : -p.y,
				z : p.z,
			}
		}
	},
	perspective : function(p) {
		return {
			x : p.x * ((camera.focus-camera.self.z) / ((camera.focus-camera.self.z) - p.z)) * camera.zoom,
			y : p.y * ((camera.focus-camera.self.z) / ((camera.focus-camera.self.z) - p.z)) * camera.zoom,
			z : p.z * ((camera.focus-camera.self.z) / ((camera.focus-camera.self.z) - p.z)) * camera.zoom,
			p : ((camera.focus-camera.self.z) / ((camera.focus-camera.self.z) - p.z)) * camera.zoom,
		}
	},
	display : function(p, display) {
		return {
			x : p.x + display.x,
			y : p.y + display.y,
			z : p.z + display.z,
			p : p.p,
		}
	},
	process : function(model, size, rotate, position,display) {
		var ret = affine.world.size(model, size);
		ret = affine.world.rotate.x(ret, rotate);
		ret = affine.world.rotate.y(ret, rotate);
		ret = affine.world.rotate.z(ret, rotate);
		ret = affine.world.position(ret, position);
		ret = affine.view.point(ret);
		ret = affine.view.x(ret);
		ret = affine.view.y(ret);
		ret = affine.view.viewReset(ret);
		ret = affine.view.righthandedReversal(ret);
		ret = affine.perspective(ret);
		ret = affine.display(ret, display);
		return ret;
	}
};



var vertex3d = function(param) {
	this.affineIn = new Object;
	this.affineOut = new Object;
	if(param.vertex !== undefined) {
		this.affineIn.vertex = param.vertex;
	} else {
		this.affineIn.vertex = {x:0,y:0,z:0};
	};
	if(param.size !== undefined) {
		this.affineIn.size = param.size;
	} else {
		this.affineIn.size = {x:1,y:1,z:1};
	};
	if(param.rotate !== undefined) {
		this.affineIn.rotate = param.rotate;
	} else {
		this.affineIn.rotate = {x:0,y:0,z:0};
	};
	if(param.position !== undefined) {
		this.affineIn.position = param.position;
	} else {
		this.affineIn.position = {x:0,y:0,z:0};
	};
};
vertex3d.prototype = {
	vertexUpdate : function() {
		this.affineOut = affine.process(
			this.affineIn.vertex,
			this.affineIn.size,
			this.affineIn.rotate,
			this.affineIn.position,
			camera.display
		);
	}
};

	var dtr = function(v) {return v * Math.PI/180;};
    //cordinate system transformation.
	//polar to rectangle.
	var polarToRectangle =  function(dX, dY, radius) {
		var x = Math.sin(dtr(dX)) * Math.cos(dtr(dY)) * radius;
		var y = Math.sin(dtr(dX)) * Math.sin(dtr(dY)) * radius;
		var z = Math.cos(dtr(dX)) * radius;
		return {x:y, y:z, z:x};
	};
	//rectangle to polar.
	var rectangleToPolar = function(x, y, z) {
		if(x == 0)	var xD = 0.001;
		else		var xD = x;
		if(y == 0)	var yD = 0.001;
		else		var yD = y;
		if(z == 0)	var zD = 0.001;
		else		var zD = z;
		var radius = Math.sqrt(xD*xD + yD*yD + zD*zD);
		var theta = Math.atan(zD / Math.sqrt(xD*xD + yD*yD));
		var phi = Math.atan(yD / xD);
		return {x:theta*(180/Math.PI), y:phi*(180/Math.PI), r:radius};
	};
	var closeValue = function(minTime, maxTime) {
		this.flag = 0;
		this.progress = 0;
		this.startTime = 0;
		this.durationTime = 0;
		this.fromValue = 0;
		this.toValue = 0;
		this.minValue = 0;
		this.maxValue = 1;
		this.minDuration = minTime;
		this.maxDuration = maxTime;
	};
	closeValue.prototype = {
		init : function() {
			this.durationTime = this.minDuration + (this.maxDuration-this.minDuration) * Math.random();
			this.startTime = Date.now();
			this.progress = Math.min(1, ((Date.now()-this.startTime)/this.durationTime))
			this.fromValue = this.toValue;
			this.toValue = this.minValue + this.maxValue * Math.random();
			this.flag = 1;
			return this.fromValue + (this.toValue - this.fromValue) * this.progress;
		},
		update : function() {
			this.progress = Math.min(1, ((Date.now()-this.startTime)/this.durationTime));
			if(this.progress== 1) this.flag = 0;
			return this.fromValue + (this.toValue - this.fromValue) * this.progress;
		},
		execution : function() {
			if(this.flag == 0)		{return this.init()}
			else if(this.flag == 1)	{return this.update()};
		}
	};

	var strokeColor = "rgba(255,255,255,0.7)";
	var backgroundColor = "rgba(0,0,0,.5)";
	var vibrateFlag = false;
	
	var canvas = document.getElementById("canvas");
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	var ctx	= canvas.getContext("2d");
	ctx.strokeStyle = strokeColor;
		
	window.onresize = function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		camera.display.x = window.innerWidth/2;
		camera.display.y = window.innerHeight/2;
	};
	
	
	/* class */
	var	sphere = function(arg) {
		this.flag = true;
		this.type = "_";
		this.particleNum = arg.particleNum;
		this.center = {x:0, y:0, z:0};
		this.targetCenter = arg.center;
		this.radius = 0;
		this.targetRadius = arg.radius;
		
		this.degree = new Array();
		this.freeDegreeSpeed = new Array();
		for(var j=0; j<this.particleNum; j++) {
			this.degree[j] = {theta:0, phi:0};
			this.freeDegreeSpeed[j] = {theta:1*Math.random()-0.5, phi:1*Math.random()-0.5};
		};
		this.charsMap = new Object();
		for(var i in chars) {
			var buffer = document.getElementById(i).getContext("2d").getImageData(0, 0, 100, 100).data;
			this.charsMap[i] = new Array();
			var self = this;
			for(var j=0; j<this.particleNum; j++) {
				var redo = function() {
					var theta = Math.floor(Math.random()*100);
					var phi = Math.floor(Math.random()*100);
					if(buffer[(theta*400+(phi*4))] == 0) {
						self.charsMap[i].push(
							{
								theta:theta-50 + 360 * Math.round(Math.random()*2)-1,
								phi:phi-50 + 360 * Math.round(Math.random()*2)-1
							}
						);
					} else {
						redo();
					};
				};
				redo();	
			};
		};
		this.charsMap["@"] = new Array();
		for(var i=0; i<this.particleNum; i++) {
			this.charsMap["@"][i] = {theta:360*Math.random(), phi:360*Math.random()};
		};
		this.charsMap["_"] = new Array();
		for(var i=0; i<this.particleNum; i++) {
			this.charsMap["_"][i] = {theta:0, phi:0};
		};
		
		this.veticies = new Array();
		for(var i=0; i<this.particleNum; i++) {
			this.veticies[i] = new vertex3d({});
		};
	};
	sphere.prototype = {
		update : function() {
			for(var i=0; i<this.charsMap[this.type].length; i++) {
				if(this.degree[i].theta >= 30 && this.degree[i].phi >= 30) {
					this.flag = true;
					break;
				} else {
					this.flag = false;
				};	
			};
			this.radius =  this.radius + (this.targetRadius - this.radius) / 8;
			this.center.x = this.center.x + (this.targetCenter.x - this.center.x) / 8;
			this.center.y = this.center.y + (this.targetCenter.y - this.center.y) / 8;
			this.center.z = this.center.z + (this.targetCenter.z - this.center.z) / 8;
			for(var i=0; i<this.charsMap[this.type].length; i++) {
				if(this.type === "@") {
					this.charsMap[this.type][i].theta += this.freeDegreeSpeed[i].theta;
					this.charsMap[this.type][i].phi += this.freeDegreeSpeed[i].phi;
				};
				this.degree[i].theta =this.degree[i].theta + (this.charsMap[this.type][i].theta-this.degree[i].theta)/(4+20*Math.random());
				this.degree[i].phi = this.degree[i].phi + (this.charsMap[this.type][i].phi-this.degree[i].phi)/(4+20*Math.random());
				if(vibrateFlag == true) {
					var getPosition = polarToRectangle(this.degree[i].theta+90, this.degree[i].phi, this.radius+Math.random()*10);
				} else {
					var getPosition = polarToRectangle(this.degree[i].theta+90, this.degree[i].phi, this.radius);
				};
				this.veticies[i].affineIn.vertex = {
					x:getPosition.x,
					y:getPosition.y,
					z:getPosition.z
				};
				this.center.x
				this.veticies[i].affineIn.position = {
					x:this.center.x,
					y:this.center.y,
					z:this.center.z
				};
				this.veticies[i].vertexUpdate();
			};
		},
		draw : function() {
			if(this.flag == true) {
				ctx.beginPath();
				for(var i=0; i<this.veticies.length; i++) {
					for(var j=i; j<this.veticies.length; j++) {
						
						var distance = 
						(this.veticies[i].affineOut.x-this.veticies[j].affineOut.x)*(this.veticies[i].affineOut.x-this.veticies[j].affineOut.x) +
						(this.veticies[i].affineOut.y-this.veticies[j].affineOut.y)*(this.veticies[i].affineOut.y-this.veticies[j].affineOut.y);
						
						if(distance <= this.radius*3) {
							ctx.moveTo(
								this.veticies[i].affineOut.x,
								this.veticies[i].affineOut.y
							);
							ctx.lineTo(
								this.veticies[j].affineOut.x,
								this.veticies[j].affineOut.y
							);
						};
					};
				};
				ctx.closePath();
				ctx.stroke();
			};
		}
	};
	/* class */
	var sphereNum = 20;
	var s = new Array();
	/*-----------------------------------------------------*/
	var setup = function() {
		for(var i=0; i<sphereNum; i++) {
			s[i] = new sphere({radius:100, particleNum:250, center:{x:70*i - (sphereNum-1)*70/2,y:0,z:0}});
		};
	};
	/*-----------------------------------------------------*/
	var update = function() {
		for(var i=0; i<sphereNum; i++) {
			s[i].update();
		};
	};
	/*-----------------------------------------------------*/
	var draw = function() {
		for(var i=0; i<sphereNum; i++) {
			s[i].draw();
		};
	};
	
	
	var chars = {
		A : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAoVJREFUeNrsnO2RgkAQRGXrEsAQMAQJgVwMwRgMwVg0BA1BQpAQOErrPsrjdgfKnR3gzW/h5NE99M7iZW3brihZORAAC1jAAhawgAUCYAELWMACFrBAACxgAQtYwAIWCIAFLGABa0DtdrtMXGVZJvyqWfJ9w81mU9e1/PP3+z3P8yUqq2maQaS6ul6vC7Xh+XweeshyYQ2VFcqKfshMGnz3gBtx1O12K4piWcoabahU4pokrBGdbrmwUvV4o7C2221VVdjwJ456YOWPsta2nE0PdrLqxGXNiR82YQVXf8uC5fdRMEYlgZUslK7X665teUYLz8+YGj+k6VldUPKQyr/KWjR1Bj343do96SFJNE2mLEnD8nculAWsgc8yISz9Z6KzJqvfjKylLWdNVvIGD6xX6/nFBayiV2X/ncqT1yYPq36Ufwltdt3jTMnK+CLRHKwX3wFrACxTK0TtqUNw7+vv9wkeorYzpqqsoAp6g1UQhJq4nCkP9pouCEtt/KAKK3hVvanKH7U0e7wtG/aKyFCPb7XqOSmOVKfTSeESnB1ZaWZd6zaM2obnBmsGytILpeNexZKXws6YkrIU7rzCM3E+sBSiKcqy17PKslTgFftaNGA1TeN/a+EZ0/f7vecMh8Mh+Icul0twbWQ9wXfxOvg1qqryn0RyLcfjcfIJXmLA4GhBIpnYTteAJWm9wHqnsiSz0Ng7Y9Fh+V/Fks9hhJ07qricBQ+uBDv1win7tGFJgrVkTbcIWBJlCS0WVF/sHB8dluRWC2FJxDXip7FWYAnvs3C0InRiPHFl/CNqc1MHYAGLAhawgAUsYAGLAhawgAUsYAGLAhawgAUsYAGLAtZb6lOAAQB0jf7CahauSAAAAABJRU5ErkJggg==",
		
		C : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAn9JREFUeNrsnO2RgkAMhs8bG6AFLEFLoAVaoAVb0BKwBCgBSvBK8ErQErgczDg3fjA5YcOyPu/PG5fbPCZLCImLpmk+kE6fIAAWsIAFLGABCwTAAhawgAUsYIEAWMACFrCABSwQAMuJll7t5rvVzR/X63UURcD6VVmWdV1/ter5WJIkQi1pNdlem4l0Pp93u90LLhPHsSyU5fZ7ngZWnucDI0uWF0URPqwsy8YKC7lUyLBGJGXPyxSWBI6LY1eOsNBgyZHsLgM4nU4GJtglpYfD4XK5OLr4fr83MGFh1kWzWq3uE84R5dRzTZNSSTiVpMTgNE0lmeoSevFHfXI7+t1jGliSo2s+Jjl6VVV/HUTs32w2ykelQDJ45TPKw3NabnaatfIvArkbdmH1mrVC0JMv3uhuqImRZ94noCU836WeNTxj8KREYwGrv/aiPPiplOJZ1OCRdzX4njCcspo8L1hZK8KQMwtYCFjAAhawgAUsBCxgAQtYwBpbdV0vFFK+ncSz8CxgAcut3PUqBQjLoumDMJwfLE/eJ88D1vD3ycMbAOYUhhpePae4vhcuBFgaM8qyfMhL2bkbtXJrhk0zm7J7734C4Hg8KhGkaeraiqU/ntU5kUScmN0B+lcDrsX7fbOhAU2n5JAz0WBOzC7PctqssN1uLXq4AhhHsXErU88Sk+T7d3HloiiMWgONR+jk8B53/3meBztvKPEyYupoSWqysd/h8SjEJQV7ixlpUVVVr2VGssrYoa6yG6F7Vqi6/lRBzzNNN2Qhug6MTaKJYd08SN9XF+JWnuzQI1jUs4AFLAQsYAELWMACFgIWsIAFLGABCwELWMACFrDeVT8CDACBApVLFWwP8gAAAABJRU5ErkJggg==",
		D : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdVJREFUeNrs3GGNg0AQhuG2qQEsnIWzABKwABKwABJAAkgAC1g4CSCBm0COH702Gch1bmHf70dDmpLSJ7PLkOz2Ok3ThehygwAssMACCyywIAALLLDAAgssCMACCyywwAILArDAAutAudt8TRRFXddtPetjznrwOScIgpNj7cvXnIc34zgOwzBJkn+4oMkk8vP+9rKl0MqynGxzVKy1yoZhMMM69gTfNI3MhuM4cjdUpe/7NE3B2lBfO261/vZZVVWBtaG4DGYut7DCn+w412AkutWUtm27HkulSL3I+JIpXNnB+tWU/j5R2ih5xFFWpe99ljwJ5nmu+aR3c9arktE8PCtH6/nvhsqRCJZDAQsssMACCywCFlhggQUWWAQssMACCyywCFhg+Yz1prVwVJb3WDbLr6gsKgusV2mahsrSpigKzccM1kPcHB99URQpl8csG1feGrdW/gnNeixGm5ZcGVTW3bVScrlxPUnrsGwYA0uVLMu4G2oHYBzHYKkGYF3X9FkqqbZtzfa2HhhL5ilLqYvj236fRnRkhhIpgy70eFiis+wjl1cBspnLn+bKH1F712eBBRZYYBGwwAILLLDAImCBBRZYYIFFwAILLLDA8iTfAgwAhov2vlCJPZsAAAAASUVORK5CYII=",
		E : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNrs3MENwiAUgGExLsAsrNA3U1foTrBTR6gmJp56kINVy/efPTRf+ghI0rRt20XvdUUACxYsWLBgIYAFCxYsWLAQwIIFCxYsWAhgwYIFa7+ISB+otebNMoawYAkWLFiwYA3S7QefaZqmrt/nnMfFqrUaQ2sWLMGCBQsWLDv479b1n/pj+15KGRcrIrrORoft+I0hLFiwYMESLFiwHHd2Wpal67gzNNY8z8bQmgVLsGDBggULlmCd8bjTdbvzOk4ecCH29/eGz9Z1NYbWLFiwBAsWLFiwRij5ELU3CxYsWLBgIYAFCxYsWLAQwIIFCxYsWAhgwYIF65zdBRgAB2kfVa0J2mAAAAAASUVORK5CYII=",
		I : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKtJREFUeNrs3LERACAIBEGx/5LoDS0BAhNnLyba+ZioqqVeGwEsWLBgwYKFABYsWLBgwUIACxYsWLBgIYAFCxasWZkZje4ZLMuCBUuwYMGCBQuWYMGCBQsWLMGCBQsWLFiCBQsWLFiwBAsWLFiwYAkWLFiwYMESLFiwYMGCJViwYMGCBUuwHhQeUVsWLFiwYMFCAAsWLFiwYCGABQsWLFiwEMCCBQvWnx0BBgCIewtNidNjyQAAAABJRU5ErkJggg==",
		N : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAcpJREFUeNrs3OFxgjAYxvHSDVghjAAjsAIrsBwrZAVWYIRkBBqt57UejVFP+7z4f7+2x+nP5wnQYKt1XT+YsvmEACywwAILLLAgAAsssMACCywIwAILLLDAAgsCsMACC6zLqcpmmqZHjvBeyfLeKyeres0ma+HHXtd1COHuIzz7vWglK8aYaSILvKUmmsFq2xasy1mWZZ7nzeUMrI2RXbbAMo71VxPBshQuM1jOObBKmwiWsSaCtQus5ThgWQ2XGSxud65MOiGem8jZ0FgTwdoR1s8mgmUpXCpYmZPdN5bC2fCwI/KCufoyxnHM/DSEUHKQZ78LlWT1fW+giSLJSr+TKdowDArJEsJKIvkmUsPTeO/1myh06ZBPlsLmqxBWWrMyXilZ/371oHVRmm9ijBGs0iZSwxuaCNZpznfL+SaC9Ws9Ilk7aaLin2hkm6iIRbJua6LCc342sGTDJXQjDdad45wTbKLuhoVguMDaBZZgE6X3DdXCJXcjrYwl9K2wzVfSdV35Y97v9a0w8XCpJyvVs2kaklV6TlR4jM0GllQTwdJbs/Yx/F8HsMACCyywGLDAAgsssMBiwAILLLDAAosBCyywwLI0XwIMAAfXAsIjiXmrAAAAAElFTkSuQmCC",
		O : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAltJREFUeNrs3NFxgkAQgGHMpAEt4SxBS7AFW6AFW7AFLQFL0BK0BCwBSiCbMJNxCJ4b5fbI5d+HPDg4A5+3y4a5ZdI0TUbo4g0CsMACCyywwIIALLDAAgsssCAACyywwAILLAjAChLvYzuh0+nU+WSxWEynU7A+43q9Hg6Hy+UiTHVd3ztstVqJ2nq9lr/RzrWJF8fjUQh+e8LOud1uF+WE42CVZfkEU4dMrNPHOp/PQ9Ug4yWW2afesGXE0iv7o2vqNszy0RTrxTrlqV9VVSWFJfkS7p6+3W6TwgraH0l2G1zCxGbLkfScy+VSefB359n2q55O9TaKopAvptCUSpooF0inWuvvCXmeJ5KGytLeW3qU3YYsxkTScDababJJbmq962g+n0tKarIkhUc0GinP0wXlzUFZ3VJ4nuWpTUosuY38F6xALStPSsECCyywCLDAAgsssMAiwAILLLDAAosACyywwAILLAKsNLE0uxn8EXq2ICms0PMERliay/DsVPg5o5JyGjrnHh5T1/U9L82OD4OtEiNaWRL7/b73Q81eIs3v8WqMbVagMwSg3yZpMD1gtPMvU2/+axOqzSkp+b1rrTfKsgy+uMy2dud5HjTNDS7BrnUIuu866C8RYWUFHUdJcHZHykqIJrsoijRH6Aaf4NlsNikPZw7oZTBVEX/sVxLn9Xy0mQSLjyVRVZVc7XNksqCk/Nmfs11Tei/a9xS0ryrwd1JtSAsS6zUP8bEe/i/tvmIMpzcuLJ6UggUWARZYYIEFFlgEWGCBBRZYYBFggQUWWGD9y/gQYABO+P229yPVkwAAAABJRU5ErkJggg==",
		P : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdpJREFUeNrs3OGtgjAUhmEkLsAKrCAjlBFgBBzBFXAEWIERYARYgRFgBO4JJl5yfx3NtZbyfj8MJlbkEdrTYjwtyxIQXUIIwAILLLDAAgsCsMACCyywwIIALLDAAgsssCAACyywdpSznd10XZem6RsNoyi6XC6yIY+ybYx5PP1OFitp2/a/PrCQFUUhb7hYz/6wnpGzrO97m1g77rPk0k6SpK5rOnhtrterNS8fRkPxGoYBLG3yPAdLm3EcLVyM/hSlFrDOTh1wvGZ7vkiUbaXbkhdvm3telJZl+afhNE1SgiqPpaqqQ9dZUq8LQZZlmhfP80yfFSixpEwFS4vFaPh7PYKlzTdXZvyrs8AC6618eqTzB0tfx4MVNE3jwiAQ7uK0ut/vLpQXTmPJ9KWu6yRJlPMYY8yBVh2E5tmRD8Pw0lzvedPsKFgvrcnYnxL5U2eBpY1ZA5YqZVlSZ6lSVZWdaXbogZR+3fm4WHEct21rTcq50kEZueiKNZb36zrWdoyT7cdPtD57v2svWDKo3W43Z785Fv/AAgsssMAiYIEFFlhggUXAAgsssMACi4AF1mdy4o+oObPAAgsssMCCACywwAILLLAgAAsssMACCywIwAILLLD8zI8AAwDN//7sunXNSAAAAABJRU5ErkJggg==",
		R : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAiVJREFUeNrsm9FtwkAQRHGUBmghLdACLeASqIESoARTgl0ClGBKMCXgEpxJLEGElGQduI3v/ObDXz6Ze7rdm90VWdd1M2TTCwiABSxgAQtYwAIBsIAFLGABC1ggABawgAUsYAELBMACFrAi0qvPZ7Ise2T526cWi4Wey+VSz/+h1bnoub9ZvIqi6NwVJaxeOmh1XQPLqvl87nnEMp/x/YM562fpfOmUcRualOd527bAMul8Pu/3e4/4SCAMe2/RNA0ny3q4jsdjIqbUeLVd8/Qfdn46neS/pmJKtdWvSy6Xi2yBff93yxP3Wd/tdr1eG9NW6F1EkLO2260xbZHgP3JZ8GSU0m0ILJp/wEIxwbLcdA6NhzhgyZ0Dy3qsgGXVZrOxvLZarSYNS+V0nudVVf36pkoiedfgjaYE+lnCVNe1w3wsBetQFIXTJDH26U5ZlozCZpY81TSN59ww1jBUad1P812/GnUYChZhODgegTXsQmR8P+BaVLIP7UtHOgq7Onjj2rZtZfSNo40UYInU4XC4K6FV7liq6J7XpB28LjvhM/oDh4n02H2WYjN0cCVVGzr0XtKBpTB0aL+k03WwdEGZSA8QsMaldMIQWDcDAawnK7SJTwqWsTACFmEILHLWJHwpYchtCCxgPbPcUc7a7XYBf8f4/2HRy1jx6LXoR2EkeGAhYAELWMACFrAQsIAFLGABC1gIWMACFrCABSwELGB5612AAQCjKaY5iMyusQAAAABJRU5ErkJggg==",
		S : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVJREFUeNrsnOFtwkAMhUnVBViBFWAEGAFGYAVWgBFgBBiBjAAjwAgwAn1KKoQCSXw5Yl8uzz+qClVV7qvte+d3TfJ4PAYMWfwQAWERFmERFmERFhEQFmERFmERFmERAWERFmERFmERFhEQVivxG9TT3O/38/n8+slwOByPx4T1H9fr9XA4gFGapoD18WfAazqdzudzY3APu7hcLsvl0ulpR6PRdru1emAzWOv1uvEfGFl2u916AQvrxGo9CwK97HQ6xQ/Ln5QVL21Yq9Xqiw0X/V6zHlVhIRG+vkGBfpywsPe3saFjV40NFpbUkvqB/tBZgp4ohfIUtm0sHl/xfZqF5DdDfEUlSiU1+N6whRSOx2NUZQjxXbvmj1ubRGpA4iosQW/qgDNgrS7Pq68QkpQsHL/jH9GUZZAEVtkJvHfzrI/p5pq2XYIlKZOKja+23+nA0mvwkocpO+vV9nj8gMISErWr3UmSSKQDRMB73SExq7uS0kA1KOmQ81I7voQrHYSTGSTRZDIRyv1o3R15maDiFlkote0AyxDqXCICCp1IR5qHOKJxtSeeumG/3/cOFjq3a3K9tjzzxq89VvYxdcyrsnuGBTYKfV/H0grzFJBIMROr1cZk9eeF0Odlad832xwNeVnCQkATNN4fq8/eEcLK9YSPRYZy7hGsZ4oJT9qGxRgKrLzrN1NhaskVECyfqtQR98HBatb4dSoxUMMCyYVkcZrq9Nrdya9fCbWYxOXvDKzZbJbURVl9hXNbuQO+oeT+W1S+oWf/IqxW5veEVe/gN1b/EcKq3ex6B6vMK9S5TtQxWLvdzunzBg5uN2BJOjRqbbPZvJOSwNIpQ6WLISixxWIhdAmhFZwu4A6y+5WeQ0RRBGtHOwmxqC6GgFRL/zEwyO7BK7XVTtjR1a09zrGyjx1dlrCanr728O+7JRO/FfYtXn0xWT3tQsgLk+sOZjP43MtxRQZMhhdp9G4rV+jV/D0FFWfAcRb52woMH9UeVmGGVxjjBfUSjLBgBR58Fw1hERZhERZhMQiLsAiLsAiLsBiERViERViERVgMwiKsduJPgAEA+XyVu8uZ3pEAAAAASUVORK5CYII=",
		T : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANxJREFUeNrs3M0NgyAYgOHSuACzsALDwUzs0lWo6dHEnwvakOe9mvDhE/Bo6L2/dK03AliwYMGCBQsBLFiwYMGChQAWLFiwYMFCAAsWLFjbaq1hcOsIJ8s1hAVLsGDBggVr+pZ7xsQYc857Tz+/ThdJKa3rHIwY/hr9DyqlXNlqa+3ZfbqGvlmwYMGCJViwYMGCBUuwYMGCBQuWYMGCBQsWLMGCBQsWLFiCBQsWLFiwBAsWLFiwYCn4EbWTBQsWLFiwEMCCBQsWLFgIYMGCBQsWLASwYMGCNWdfAQYAm9kWXxDs58sAAAAASUVORK5CYII=",
		V : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAqxJREFUeNrsnNFxgzAQRK1MGsAlxCW4BTfnnlyCXQIuAUogipPxZDIZ3SLQnmT2PjNYSI/du0MQwjRNOwUWb0IgWIIlWIIlWIIlBIIlWIIlWIIlWEIgWIIlWIIlWIIlBIIlWIIlWD9xv98DEOfzGRktHoaMFk/aJKyPR5iHXS4XZDTksK7rkDNWasPj8YgIENSpeczpdGo4Z4GwxnFcBRZyurZhxbjdbqtYtW1YoC9MWKBV27YheLVNGyI+LSorEizkaq9iw1eAhdTyVWxYGtZuKh993yMzGYYhMQgywvV6LboQkrJir7hEXGA7+go2BA2SgGWalOFBGiwkxyeyElIKizYN1SkrAasSZQXOC7hRGvv9Hqk2//49/tYUV6wPSGZsQFlg9v1XXOMjVqkhbcBa4kTEg4SERYWV3ZoisMrtYfnAyi6IlZTC17EhoRSSbneegVz/jBudOCxn/tSnOxlOdN9K9rFhXo5HYHGyOxtWRtqqKGHxlWWqYK6ywKdt7cFCVDA3Z9FkVSOsP8oyd7I2Des3ryq2kh1hzeoequobdi5v0eBpyyyFTFI+sMwVPhmZsJge9IGFdw9I38CceeB/qiAiOBwO5h3i1+RCSB/W9z2T17uLsrquS2+8xI7B3Pks+ipWLTYEc7zpQXJ2d4NlrjPqrqre3c2GyDoRG/JhBZdv0ZhPxr7zWrp1cJj55BQLdRF/zp+z23vwy2Hx5+wGa2HV3xashYXfBVZw/NiY2aAn2tFhGDakrCXicpFVq7D4vbs/rOwcv0VlZa95i7DynmJxXsWqDlaeRrwSVpOwyHtYUlaDTWlea+o4Yf9/KJ8lLkdZVQFr1vp9YQV9iLolZQmWYAmWEAiWYAmWYAmWYAmBYAmWYAmWYAmWEAiWYAmWYAmWYAkBHp8CDABKCtGI2oWS6AAAAABJRU5ErkJggg==",
		Y : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAlVJREFUeNrsmn+NwkAQheEcgASQABKwgAWQgAUsYAEkgASQABJAQm8SLk1DSPd1e/ur+ebf42a7X+a9nel2XFXViNDiBwTAAhawgAUsYIEAWMACFrCABSwQAAtYwAIWsIAFAmABC1jA+ovX6zWdTseuWC6XSrbtdutMZcvZoqH2UwWOzWajPMb9fnemmkwmzjy2XLi9BId1vV4VWPv9vj3P4XBQ8thyBcOyWCwWzk3OZrP2JOv12pnEFgq6kRiw+heFiVTJYAsVD6u/3ZhInf9uS4TeRaTWQbH50+nk8adOS+R+GnbS0fF49D4ilPO0jMoy/16tVs6fXS4Xv7Iy+7clBlJZus0/n08Pv/takqUavL7tjxPNKPRvOwqToe7BH0r8KswE1h5ZhrrN11ZtkvRT7hAqy/SiNOK1o4sdg6Lu8ipL9KB6alEO0KDDYEqDf4dyxhsCRbOhh8GUMuzUzefStTdiHP87+MfjMZ/Pne72/mX7MCieAKV6lv6+xRm73S7yY6eBdT6f+8OKMAxmAUu0+fZhMP4zJ7vd6enN/yLkAgy+efHj3dyKw8BA7g3tLPMursgdQ+LTsKfNRxsGczF4b5sPejOYqcF7CyqZBtPK8P0SptM7g8jDYF6VZaQ6NQEpyyph61DH7XYTPwxJMAxm0jo0laXc7ycvq1Em32eJSlTeBQ4fVikBLGABC1jAAhYBLGABC1jAAhYBLGABC1jAAhYBLGABK3mkv2SlsoAFLBAAC1jAAhawgAUCYAELWMACFrBAACxgAQtYwAIWCIAVJH4FGABxraQlqLjfogAAAABJRU5ErkJggg=="
		
		};
	var charsLength = 0;
	var charCounter = 0;
	var bufferImages = {};
	var bufferCanvases = {};
	for(var i in chars) {
		charsLength++;
		bufferImages[i] = new Image();
		bufferImages[i].src = chars[i];
		bufferImages[i].onload = function() {
			charCounter++;
			if(charCounter === charsLength) {
				bufferDraw();
			};
		};
	};
	var bufferDraw = function() {
		for(var i in chars) {
			var canvas = document.createElement("canvas");
			canvas.id = i;
			document.getElementById("buffer").appendChild(canvas);
			document.getElementById(i).getContext("2d").drawImage(
				bufferImages[i],
				0,
				0,
				100,
				100
			);
		};
		start();
	};

	var textChanger = function(text, sphereRadius, sphereSpace, unitTime) {
		var changeIncrement = 0;
		var charNum = text.length;
		var center = new Array();
		for(var i=0; i<charNum; i++) {
			center[i] = {x:sphereSpace*i - sphereSpace*(charNum-1)/2, y:0, z:0};
		};
		var changer = function() {
			setTimeout(function() {
				s[changeIncrement].type = text[changeIncrement];
				s[changeIncrement].targetCenter = center[changeIncrement]; 
				s[changeIncrement].targetRadius = sphereRadius; 
				changeIncrement++;
				if(changeIncrement < charNum) {
					changer();
				};
			}, unitTime);
		};
		for(var i=charNum; i<s.length; i++) {
			s[i].type = "_";
		};
		changer();
	};
	
	var fullSet = function() {
		var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ__?!1234567890";
		var col = 10;
		var colUnit = 80;
		var rowUnit = 120;
		for(var i=0; i<alpha.length; i++) {
			s[i].targetCenter = {
				x:(i%10)*colUnit - (col-1)*colUnit/2,
				y:Math.floor(i/10)*-rowUnit + 180,
				z:0
			};
			s[i].type = alpha[i];
		};
	};
	var textSet = [
		{text:"ESPECTRO", sphereRadius:140, sphereSpace:80, unitTime:100, time:6000},
		{text:"A_DIVE", sphereRadius:120, sphereSpace:70, unitTime:120, time:4000},
		{text:"INTO", sphereRadius:120, sphereSpace:70, unitTime:50, time:3000},
		{text:"ECSTASY", sphereRadius:120, sphereSpace:70, unitTime:100, time:3000},
		
		{text:"@@@@@@@@", sphereRadius:60 + Math.random()*60, sphereSpace:200, unitTime:100, time:4000}
	];
	
	var textSetChangerIncrement = 0;
	var textSetChanger = function() {
		setTimeout(function() {			
			textChanger(
				textSet[textSetChangerIncrement].text,
				textSet[textSetChangerIncrement].sphereRadius,
				textSet[textSetChangerIncrement].sphereSpace,
				textSet[textSetChangerIncrement].unitTime
			);
			textSetChangerIncrement++;
			if(textSetChangerIncrement == textSet.length) {
				textSetChangerIncrement = 0;
			};
			textSetChanger();
		}, textSet[textSetChangerIncrement].time);
	};
	var vibrateCV = new closeValue(200, 500);
	var invertCV = new closeValue(1000, 1200);
	
	var start = function() {
		setup();
		setInterval(function() {
			if(vibrateCV.execution() > 0.8) {
					vibrateFlag = true;
			} else {
				vibrateFlag = false;
			};
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
			ctx.strokeStyle = strokeColor;
			update();
			draw();
		}, 1000/60);
		textSetChanger();
	};
	document.body.onmousemove = function(e) {
	camera.rotate.x = e.pageY/window.innerHeight * 180 - 90;
	camera.rotate.y = e.pageX/window.innerWidth * 180 - 90;
	document.onmousedown = function() {camera.zoom = Math.random()*1+1};
	document.onmouseup = function() {camera.zoom = 1};
};