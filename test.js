;(function() {
  'use strict';

  function Visualizer(audio, canvas) {
    // set up the hooks
    this.canvas = canvas;
    this.audio = audio;
    this.audioContext = null

    this.canvasContext = canvas.getContext("2d");

    this.WIDTH = canvas.width;
    this.HEIGHT = canvas.height;

    // clear the canvas
    this.canvasContext.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    this.canvasContext.fillStyle = 'rgb(200, 200, 200)';
    this.canvasContext.fillRect(0, 0, this.WIDTH, this.HEIGHT);
  }
  Visualizer.prototype.load = function(){
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // set up the analyser
    // audio -> analyser -> speaker
    console.log(this)
    this.analyser = this.audioContext.createAnalyser();
    this.source = this.audioContext.createMediaElementSource(this.audio);
    this.source.connect(this.analyser);
    // let the audio pass through to the speaker
    this.analyser.connect(this.audioContext.destination);

    // set up the data
    this.analyser.fftSize = 1024;
    this.bufferLength = this.analyser.fftSize;
    this.dataArray = new Float32Array(this.bufferLength);
    this.frame = 0;
  }

  Visualizer.prototype.render = function(data, len, context, WIDTH, HEIGHT) {
    // clear the canvas
    context.fillStyle = 'rgb(70, 70, 70)';
    context.fillRect(0, 0, WIDTH, HEIGHT);

    // configure the stroke
    context.lineWIDTH = 2;
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.beginPath();

    // draw the waves
    var x = 0, sliceWIDTH = WIDTH * 1.0 / len;
    context.moveTo(0, data[0] * HEIGHT/2 + HEIGHT/2);
    for(var i = 1; i < len; i++) {
      var y = HEIGHT/2 + data[i] * HEIGHT/2;
      context.lineTo(x, y);
      x += sliceWIDTH;
    }
    context.lineTo(WIDTH, data[len-1] * HEIGHT/2 + HEIGHT/2);

    // show it
    context.stroke();
  };

  Visualizer.prototype.draw = function() {
    if(!this.audioContext){
      this.load()
    }
    if (!this.audio.paused) {
      // update the data
      this.analyser.getFloatTimeDomainData(this.dataArray);
      // draw in the canvas
      this.render(this.dataArray, this.bufferLength,
        this.canvasContext, this.WIDTH, this.HEIGHT);
    }

    var self = this;  // requestAnimationFrame binds global this
    this.frame = requestAnimationFrame(function() {
      self.draw();
    });
  };

  function init() {
    var audioNode = document.getElementById('audio-source');
    var canvasNode = document.getElementById('waves');

    var visualizer = new Visualizer(audioNode, canvasNode);
    audioNode.addEventListener('play',function () {
      visualizer.draw();
    })
    //
  }

  init();  // kick it off

}());
