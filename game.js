var canvas = document.getElementById('canvas')
canvas.width = innerWidth;
canvas.height = innerHeight;

var renderer = new GLGE.Renderer(canvas);

var XMLdoc = new GLGE.Document();
var camera;
var cameraOffset;

var player, wheel1, wheel2, car, scene;


XMLdoc.onLoad = function () {
  scene = XMLdoc.getElement("mainscene");
  camera = XMLdoc.getElement("mainCamera");
  cameraOffset = XMLdoc.getElement("cameraOffset");
  car = XMLdoc.getElement("car");
  player = XMLdoc.getElement("player");
  wheel1 = XMLdoc.getElement("wheel1");
  wheel2 = XMLdoc.getElement("wheel2");

  var keys = new GLGE.KeyInput();

  /*
  var positions=[];
  for(var x=-50; x<50;x++){
    if(x!=0){
      positions.push(x); positions.push(0); positions.push(-50); positions.push(x);
      positions.push(0); positions.push(50); positions.push(50); positions.push(0);
      positions.push(x); positions.push(-50); positions.push(0); positions.push(x);
    }
  }
  
  var line=(new GLGE.Object).setDrawType(GLGE.DRAW_LINES);
  line.setMesh((new GLGE.Mesh).setPositions(positions));
  line.setMaterial(XMLdoc.getElement( "lines" ));
  scene.addObject(line);
  */
    
  scene.setGravity([0, -9.8, 0, 0]);
  renderer.setScene(scene);
  renderer.render();
  var lasttime;
  
  
  
  var rot = 0;
  var speed = 0;
  var render = function (){
    var now = +new Date;
    // Player physics
    if (keys.isKeyPressed(GLGE.KI_W)) {	
      speed = 6;
    } else if (keys.isKeyPressed(GLGE.KI_S)) {
      speed = -6;
    } else {
      speed = 0;
    }
    if (keys.isKeyPressed(GLGE.KI_SPACE)) {
      if (player.locY < 1) {
        //player.setVelocityY(10);
        speed = 0;
      }




    }
    if(keys.isKeyPressed(GLGE.KI_A)) {
      rot = 2;
    } else if(keys.isKeyPressed(GLGE.KI_D)) {
      rot = -2;
    } else {
      rot = 0;
    }

    if (lasttime) {
      var dt = (now - lasttime) / 500;
      var speed_x, speed_y;
      scene.physicsTick(dt);
      if (player.locY < 1) {
        player.setRotY(player.rotY + rot*dt);
        speed_x = speed * Math.cos(player.rotY);
        speed_z = speed * Math.sin(-player.rotY);
        player.setLocX(player.locX + speed_x*dt);
        player.setLocZ(player.locZ + speed_z*dt);
        camera.setLocX(player.locX);
        camera.setLocZ(player.locZ+40);
      }
    }
    lasttime = now;
    renderer.render();
    window.requestAnimationFrame(render);
  };
  render();
};

XMLdoc.load("scene.xml");

