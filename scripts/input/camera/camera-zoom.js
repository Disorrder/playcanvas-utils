var CameraZoom = pc.createScript('cameraZoom');

CameraZoom.attributes.add('zoom', {type: 'number', min: 0.1, max: 8, default: 1});

CameraZoom.prototype.initialize = function() {
    this.camera = this.entity.camera;
    this.on('attr:zoom', this.updZoom, this);
};

CameraZoom.prototype.updZoom = function(val, oldVal) { // не надёжно, могут накапливаться погрешности
    var fov = this.camera.fov * oldVal;
    this.camera.fov = fov / val;
};
