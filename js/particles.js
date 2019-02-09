/*
 function which creates particles and update their coordonnate with mouse
 mouse motion

*/

(function(w){

  /*
    Declaration of all variables i need to create my particule system
  */
  var canvas,context;

  var canvasWidth = 1500;
  var canvasHeight = 1500;
  var resolution = 10; // Size of cell

  var nbCol = canvasWidth / resolution;
  var nbRow = canvasHeight / resolution;

  var vectorCells = [] // vector of cells
  var vectorParticles = [] // vector of Particles

  var nbParticles = 10000; // number of particles in the canvas

  var mouse =
  {
     x: 0,
     y: 0,
     px:0,
     py:0,
     down: true
  };

  var ptr_size = 40;

  function init(){

    canvas = document.getElementById("renderCanvas");
    context = canvas.getContext("2d");

    //These two set the width and height of the canvas to the defined values.
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // fill the vector particles
    for (i = 0; i<nbParticles; i++)
    {
      vectorParticles.push(new particle(Math.random()*canvasWidth,Math.random()*canvasHeight));
    }

    // fill the vector cells

    for (i = 0; i<nbCol; i++){
      vectorCells[i] = []
      for (j=0; j<nbRow; j++){
        var cellData = new cell(i*resolution, j*resolution, resolution);

        vectorCells[i][j] = cellData;
        vectorCells[i][j].col = i;
        vectorCells[i][j].row = j;

      }
    }

    for (i = 0; i<nbCol; i++){
      for (j=0; j<nbRow; j++){
        var cellData = vectorCells[i][j];

        var rowUp = (j - 1 < 0) ? nbRow - 1 : j-1;
        var rowDown = (j + 1 >= nbRow) ? 0 : j+1;
        var colLeft = (i - 1 < 0) ? nbCol - 1 : i-1;
        var colRight = (i + 1 >= nbCol) ? 0 : i+1;

        var up = vectorCells[i][rowUp];
        var left = vectorCells[colLeft][j];
        var up_left = vectorCells[colLeft][rowUp];
        var up_right = vectorCells[colRight][rowUp];

        cellData.up = up;
        cellData.left = left;
        cellData.up_left = up_left;
        cellData.up_right = up_right;

        up.down = vectorCells[i][j];
        left.right = vectorCells[i][j];
        up_left.down_left = vectorCells[i][j];
        up_right.down_right = vectorCells[i][j];

      }
    }


    // EVENT MANAGER

    w.addEventListener("mousedown", mouse_down_handler);
    w.addEventListener("touchstart", mouse_down_handler);

    w.addEventListener("mouseup", mouse_up_handler);
    w.addEventListener("touchend", touch_end_handler);

    canvas.addEventListener("mousemove", mouse_move_handler);
    canvas.addEventListener("touchmove", touch_move_handler);

    w.onload = draw();

  }

  function mouse_down_handler(e)
  {
    e.preventDefault();
    mouse.down =false;
  }

  function mouse_up_handler()
  {
    mouse.down = true;
  }

  function touch_end_handler(e) {
      if (!e.touches) mouse.down = true;
  }

  function mouse_move_handler(e) {

      mouse.px = mouse.x;
      mouse.py = mouse.y;

      mouse.x = e.offsetX || e.layerX;
      mouse.y = e.offsetY || e.layerY;
  }

  function touch_move_handler(e) {
      mouse.px = mouse.x;
      mouse.py = mouse.y;

      var rect = canvas.getBoundingClientRect();

      mouse.x = e.touches[0].pageX - rect.left;
      mouse.y = e.touches[0].pageY - rect.top;
  }


  function draw_particle()
  {

    for ( i = 0; i< vectorParticles.length; i++)
    {
       var p = vectorParticles[i];

       // verify if the particle is in the canvasWidt

       if (p.x >= 0 && p.x < canvasWidth && p.y > 0 && p.y < canvasHeight)
       {
         if (((Math.floor(Math.random() * 6) + 1  )%2) == 0)
         {
           context.strokeStyle = "#99e1d9";
         }
         else{
           context.strokeStyle = "#FF99C9";
         }
         // we search for in each cells is the particle
         var col = parseInt(p.x / resolution);
         var row = parseInt(p.y / resolution);

         var cell_data = vectorCells[col][row];

         var ax = (p.x % resolution) / resolution;
         var ay = (p.y % resolution) / resolution;

         p.xv += (1 - ax) * cell_data.xv * 0.05;
         p.xy += (1 - ay) *cell_data.yv * 0.05;
         p.xv += ax * cell_data.right.xv * 0.05;
         p.yv += ax * cell_data.right.yv * 0.05;

         p.xv += ay * cell_data.down.xv * 0.05;
         p.yv += ay * cell_data.down.yv * 0.05;

         p.x += p.xv;
         p.y += p.yv;

         var dx = p.px - p.x;
         var dy = p.py - p.y;

         var dist = Math.sqrt(dx * dx + dy * dy);
         var limit = Math.random()*0.5;

         if (dist > limit)
         {
           context.lineWidth = 1;
           context.beginPath();
           context.moveTo(p.x,p.y);
           context.lineTo(p.px,p.py);
           context.stroke();
         }
         else {
           context.beginPath();
           context.moveTo(p.x,p.y);
           context.lineTo(p.x + limit, p.y + limit);
           context.stroke();
         }

         p.px = p.x;
         p.py = p.y

       }

       else {
         p.x = p.px = Math.random() * canvasWidth;
         p.y = p.py =Math.random() * canvasHeight;
       }

       p.xv *= 0.5;
       p.yv *= 0.5;

    }
  }

  function change_cell_velocity(c,xv,yv,size)
  {
    var dx = c.x - mouse.x;
    var dy = c.y - mouse.y;
    var dist = Math.sqrt(dy * dy + dx * dx);

    if (dist < size)
    {
      if (dist < 4)
      {
        dist = size;
      }

      var strength = size/dist;
      c.xv += xv*strength;
      c.yv += yv*strength;
    }
  }

  function update_pressure(cell)
  {
    var pressure_x = (
        cell.up_left.xv * 0.5 //Divided in half because it's diagonal
        + cell.left.xv
        + cell.down_left.xv * 0.5 //Same
        - cell.up_right.xv * 0.5 //Same
        - cell.right.xv
        - cell.down_right.xv * 0.5 //Same
    );

    //This does the same for the Y axis.
    var pressure_y = (
        cell.up_left.yv * 0.5
        + cell.up.yv
        + cell.up_right.yv * 0.5
        - cell.down_left.yv * 0.5
        - cell.down.yv
        - cell.down_right.yv * 0.5
    );


    cell.pressure = (pressure_x + pressure_y) * 0.25;


  }


  function update_velocity(cell)
  {
    cell.xv += (
        cell.up_left.pressure * 0.5
        + cell.left.pressure
        + cell.down_left.pressure * 0.5
        - cell.up_right.pressure * 0.5
        - cell.right.pressure
        - cell.down_right.pressure * 0.5
    ) * 0.25;


    cell.yv += (
        cell.up_left.pressure * 0.5
        + cell.up.pressure
        + cell.up_right.pressure * 0.5
        - cell.down_left.pressure * 0.5
        - cell.down.pressure
        - cell.down_right.pressure * 0.5
    ) * 0.25;


    cell.xv *= 0.99;
    cell.yv *= 0.99;
  }

  function draw()
  {
    var mouse_xv = mouse.x - mouse.px;
    var mouse_yv = mouse.y - mouse.py;

    for ( i = 0; i < nbCol; i ++)
    {
      for ( j =  0; j < nbRow; j++)
      {
        if (mouse.down)
        {
          change_cell_velocity(vectorCells[i][j],mouse_xv,mouse_yv,ptr_size);
        }
        update_pressure(vectorCells[i][j]);

      }
    }
    context.clearRect(0, 0, canvas.width, canvas.height);

    draw_particle();

    for (i = 0; i < nbCol; i ++)
    {
      for (j = 0; j < nbRow; j ++)
      {
        update_velocity(vectorCells[i][j]);
      }
    }

    mouse.px = mouse.x;
    mouse.py = mouse.y;

    requestAnimationFrame(draw);
  }

  function cell(x,y,resolution)
  {
    this.x = x;
    this.y = y;
    this.xv = 0;
    this.yv = 0;
    this.resolution = resolution;
    this.pressure = 0;
  }

  function particle(x,y)
  {
    this.x = this.px = x;
    this.y = this.py = y;
    this.xv = this.yv = 0;
  }


  w.Fluid = {
      initialize: init
  }

}(window))

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
Fluid.initialize();
