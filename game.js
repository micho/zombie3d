var GLGE = window.GLGE,
    canvas = document.getElementById('canvas'),
    XMLdoc = new GLGE.Document(),
    app;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

app = {
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

    // Start rendering
    this.render.call(this);
  },
  render: function () {
    var now = +new Date(),
        rot, speed, dt, speed_x, speed_z;

    // Player physics
    if (this.keys.isKeyPressed(GLGE.KI_W)) {
      speed = 6;
    } else if (this.keys.isKeyPressed(GLGE.KI_S)) {
      speed = -6;
    } else {
      speed = 0;
    }
    if (this.keys.isKeyPressed(GLGE.KI_SPACE)) {
      console.log('jump!');
    }
    if (this.keys.isKeyPressed(GLGE.KI_A)) {
      rot = 2;
    } else if (this.keys.isKeyPressed(GLGE.KI_D)) {
      rot = -2;
    } else {
      rot = 0;
    }

    if (this.lasttime) {
      dt = (now - this.lasttime) / 500;
      this.scene.physicsTick(dt);
      if (this.player.locY < 1) {
        this.player.setRotY(this.player.rotY + rot * dt);
        speed_x = speed * Math.cos(this.player.rotY);
        speed_z = speed * Math.sin(-this.player.rotY);
        this.player.setLocX(this.player.locX + speed_x * dt);
        this.player.setLocZ(this.player.locZ + speed_z * dt);
        this.camera.setLocX(this.player.locX);
        this.camera.setLocZ(this.player.locZ + 40);
      }
    }
    this.lasttime = now;
    this.renderer.render();
    window.requestAnimationFrame(this.render.bind(this));
  }
};

XMLdoc.onLoad = app.init.bind(app);
XMLdoc.load("scene.xml");

