var WasdController = pc.createScript('wasdController');

WasdController.attributes.add('velocity', {type: 'number', default: 1});

// initialize code called once per entity
WasdController.prototype.initialize = function() {
    this.force = new pc.Vec3();
    this._force = new pc.Vec3();

    this.camera = this.entity.findByName('Camera');
};

// update code called every frame
WasdController.prototype.update = function(dt) {
    this._force.set(0, 0, 0);

    if (this.app.keyboard.isPressed(pc.KEY_A)) {
        this._force.x -= this.camera.right.x;
        this._force.z -= this.camera.right.z;
    }

    if (this.app.keyboard.isPressed(pc.KEY_D)) {
        this._force.x += this.camera.right.x;
        this._force.z += this.camera.right.z;
    }

    if (this.app.keyboard.isPressed(pc.KEY_W)) {
        this._force.x += this.camera.forward.x;
        this._force.z += this.camera.forward.z;
    }

    if (this.app.keyboard.isPressed(pc.KEY_S)) {
        this._force.x -= this.camera.forward.x;
        this._force.z -= this.camera.forward.z;
    }

    if (this._force.x === 0 && this._force.y === 0) return;

    this._force.normalize().scale(this.velocity * dt);

    if (this.entity.rigidbody && this.entity.rigidbody.active) {
        // with physics
        this.entity.rigidbody.applyForce(this._force);
    } else {
        // without physics
        this.entity.translate(this._force);
    }
};
