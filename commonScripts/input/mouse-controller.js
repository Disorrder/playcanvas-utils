var MouseController = pc.createScript('mouseController');

MouseController.attributes.add('sensitivity', {type: 'number', default: 0.3, title: 'Sensitivity'});

// initialize code called once per entity
MouseController.prototype.initialize = function() {
    this._lookCamera = this.entity.script.lookCamera;

    if (this._lookCamera) {
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this._onMouseMove, this);

        // Remove the listeners so if this entity is destroyed
        this.on('destroy', function() {
            this.app.mouse.off(pc.EVENT_MOUSEMOVE, this._onMouseMove, this);
        });
    }

    // Disabling the context menu stops the browser displaying a menu when
    // you right-click the page
    this.app.mouse.disableContextMenu();
};


MouseController.prototype._onMouseMove = function (event) {
    if (this.app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)) {
        this._lookCamera.pitch -= event.dy * this.sensitivity;
        this._lookCamera.yaw -= event.dx * this.sensitivity;
    }
};
