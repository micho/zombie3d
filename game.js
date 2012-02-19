var GLGE = window.GLGE,
    canvas = document.getElementById('canvas'),
    XMLdoc = new GLGE.Document(),
    app;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

app = {
  sounds: {
    shot: _.throttle(function  () {
        (new window.Audio("shot.mp3")).play();
      }, 300)
  },
  init: function () {
    // Initialize modules
    this.renderer = new GLGE.Renderer(canvas);
    this.keys = new GLGE.KeyInput();

    // Get elements
    this.scene = XMLdoc.getElement("mainscene");
    this.camera = XMLdoc.getElement("mainCamera");
    this.car = XMLdoc.getElement("car");
    this.player = XMLdoc.getElement("player");

    // Configure world settings
    this.scene.setGravity([0, -9.8, 0, 0]);
    this.renderer.setScene(this.scene);
    this.renderer.render();
    //this.player.setType(GLGE.PHYSICS_LOC);
    this.player.setRotationalVelocityDamping([0, 0.1, 0]);
    this.player.setLinearVelocityDamping([0.95, 11, 0.95]);
    this.player.setFriction(0);

    this.player.grounded = true;
    this.player.addEventListener("collision", function (e) {
      this.grounded = true;
    });

    // Start rendering
    this.render.call(this);
  },
  render: function () {
    var now = +new Date(), dt;

    if (this.lasttime) {
      dt = (now - this.lasttime) / 500;

      this.cameraFollow();
      this.processInput();

      this.scene.physicsTick(dt);
    }
    this.lasttime = now;
    this.renderer.render();
    window.requestAnimationFrame(this.render.bind(this));
  },
  processInput: function () {
    var playerMat = this.player.getModelMatrix();

    if (this.keys.isKeyPressed(GLGE.KI_W)) {
      this.player.setVelocityX(playerMat[0] * 5);
      this.player.setVelocityZ(playerMat[2] * -5);
    } else if (this.keys.isKeyPressed(GLGE.KI_S)) {
      this.player.setVelocityX(playerMat[0] * -5);
      this.player.setVelocityZ(playerMat[2] * 5);
    }

    if (this.keys.isKeyPressed(GLGE.KI_A)) {
      this.player.addBodyTorque([0, 500, 0]);
    } else if (this.keys.isKeyPressed(GLGE.KI_D)) {
      this.player.addBodyTorque([0, -500, 0]);
    }

    if (this.keys.isKeyPressed(GLGE.KI_SPACE)) {
      if (this.player.grounded) {
        this.player.grounded = false;
        this.player.setVelocityY(10);
      }
    }

  },
  cameraFollow: function () {
    this.camera.setLocX(this.player.locX);
    this.camera.setLocZ(this.player.locZ + 40);
  }
};

XMLdoc.onLoad = app.init.bind(app);
XMLdoc.load("scene.xml");

/*

  My attempts to make the player walk over the world

    app.player.setType(GLGE.PHYSICS_LOC);
    app.player.setFriction(0);
    app.player.setRestitution(0);
    app.player.setVelocityX(speed_x);
    app.player.setVelocityZ(speed_z);

*/
