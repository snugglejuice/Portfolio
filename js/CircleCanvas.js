


(function(w) {

  var canvas,context;

  var canvasWidth = 500;
  var canvasHeight = 500;

  var r = ((canvasWidth)/2);
  var n = 900;
  var vectorPoints = [];


  var pas =1000;

  var mouse =
  {
    x: 0,
    y: 0,
    px: 0,
    py:0,
    down: false
  }

  var pattern = 1;

  var color1 = "#99e1d9";
  var color2 = "#ff99c9";
  var color3 = "#c1bddb";
  var loop = 0;


  function init(){

    canvas = document.getElementById("renderCanvas");
    context= canvas.getContext("2d");



    //These two set the width and height of the canvas to the defined values.
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;


    initVector();
    w.onload = draw();

  }

  function updatePattern(value){
    pattern = value;
    console.log(pattern);
  }

  function initVector()
  {
    var nbPoint = 300;
    var p = Math.round(1000/nbPoint);
    var speed = 0.2;
    vectorPoints = [];

// Pattern 1
  if (pattern == 1){
      var r = 0;
      for (i = 0; i<n; i = i+p){
        vectorPoints.push(new point(i,r,1));
        r = r + speed*p;
      }
  }
// Pattern 2
  if (pattern == 2){
    for (i = 0; i<n; i = i+p){
       if (i%2 == 0)
       {
         vectorPoints.push(new point(i,10*speed*p,1));
       }
       else {
         vectorPoints.push(new point(i,10*speed*p,1));
       }
     }
  }

// Pattern 3
    if(pattern == 3){
      var r = 4*speed*p;
      for (i = 0; i<n; i = i+p){
        if (i<n/2){
          vectorPoints.push(new point(i,r,1));

        }
        else{
          vectorPoints.push(new point(i,r,-1));

        }
      }
    }
  }



  function drawLine(point)
  {

    // Draw
    context.beginPath();
    context.moveTo(point.x1,point.y1);
    context.lineTo(point.x2,point.y2);
    context.stroke();
    // Update
    point.nbPoint = point.nbPoint + point.speed;
    var t = point.rotation * (2 * Math.PI * point.nbPoint / n);
    point.x2 = (canvasWidth/2) +  r*Math.cos(t);
    point.y2 = (canvasWidth/2) +  r*Math.sin(t);
  }

  function drawCircle()
  {

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = color1;
    context.lineWidth = 1;



    var x = (canvasWidth/2) +  r*Math.cos(0);
    var y = (canvasWidth/2) + r*Math.sin(0);

    var x1 = x;
    var y1 = y;

    for (i = 1; i < n; i++)
    {
      var t = 2 * Math.PI * i / n;

      var x2 = (canvasWidth/2) + r*Math.cos(t);
      var y2 = (canvasWidth/2) + r*Math.sin(t);
      context.beginPath();
      context.moveTo(x1,y1);
      context.lineTo(x2,y2);
      context.stroke();

      x1 = x2;
      y1 = y2;

    }

    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x,y);
    context.stroke();


  }


  function draw()
  {
    loop = loop + 1;

    drawCircle();
    for (i=0; i<vectorPoints.length; i++)
    {
      drawLine(vectorPoints[i]);
    }
    requestAnimationFrame(draw);
  }

  function point(nbPoint,speed,rotation)
  {
    var t = 2 * Math.PI * nbPoint / n;
    var t2 = 2 * Math.PI * (nbPoint+1) / n;

    this.x1 = (canvasWidth/2) +  r*Math.cos(t);
    this.y1 = (canvasWidth/2) +  r*Math.sin(t);
    this.x2 = (canvasWidth/2) +  r*Math.cos(2);
    this.y2 = (canvasWidth/2) +  r*Math.sin(2);
    this.nbPoint = nbPoint + 1;

    this.speed = speed;
    this.rotation = rotation;
  }


    w.Circle = {
        initialize: init
    }

}(window)); //Passes "window" into the self-invoking function.


/*
Request animation frame polyfill. This enables you to use "requestAnimationFrame"
regardless of the browser the script is running in.
*/
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;


//And this line calls the init() function defined above to start the script.
Circle.initialize();
