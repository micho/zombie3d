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
    this.player.setLinearVelocityDamping([0.7, 11, 0.7]);
    this.player.setFriction(0);

    this.player.grounded = true;
    this.player.addEventListener("collision", function (e) {
      this.grounded = true;
    });

    var ogroColor = new GLGE.Texture({ Src: "skin.jpg" });
    var ogroMaterial = new GLGE.Material({ Specular: 0 })
      .addMaterialLayer(new GLGE.MaterialLayer({
        Texture: ogroColor,
        Mapinput: GLGE.UV1,
        Mapto: GLGE.M_COLOR
      }))
      .addTexture(ogroColor);

    /*
    this.ogro = new GLGE.MD2({
      Src: "ogro.md2",
      Material: ogroMaterial,
      MD2Animation: "stand",
      Scale: 0.1,
      LocY: 2.2,
      RotX: -1.57
    });
    */

    //this.scene.addObject(this.ogro);

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
    var playerMat = this.player.getModelMatrix(),
        speed = 10,
        rotSpeed = 600;

    if (this.keys.isKeyPressed(GLGE.KI_W)) {
      this.player.setVelocityX(playerMat[0] * speed);
      this.player.setVelocityZ(playerMat[2] * -speed);
      if (this.player.children[0].MD2Anim !== "run") {
        this.player.children[0].setMD2Animation("run");
      }
    } else if (this.keys.isKeyPressed(GLGE.KI_S)) {
      this.player.setVelocityX(playerMat[0] * -speed);
      this.player.setVelocityZ(playerMat[2] * speed);
      if (this.player.children[0].MD2Anim !== "run") {
        this.player.children[0].setMD2Animation("run");
      }
    } else {
      if (this.player.children[0].MD2Anim !== "stand") {
        this.player.children[0].setMD2Animation("stand");
      }
    }

    if (this.keys.isKeyPressed(GLGE.KI_A)) {
      this.player.addBodyTorque([0, rotSpeed, 0]);
    } else if (this.keys.isKeyPressed(GLGE.KI_D)) {
      this.player.addBodyTorque([0, -rotSpeed, 0]);
    }

    if (this.keys.isKeyPressed(GLGE.KI_SPACE)) {
      if (this.player.grounded) {
        this.player.grounded = false;
        this.player.setVelocityY(10);
      }
    }

    if (this.keys.isKeyPressed(GLGE.KI_CTRL)) {
      this.fire();
    }
  },
  fire: _.throttle(function () {
    console.log("control");
  }, 300),
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
