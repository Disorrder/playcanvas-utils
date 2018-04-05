var GeometryCylinder = pc.createScript('geometryCylinder');

GeometryCylinder.attributes.add('radius', {type: 'number', default: 0.5});
GeometryCylinder.attributes.add('height', {type: 'number', default: 1});
GeometryCylinder.attributes.add('heightSegments', {type: 'number', default: 5});
GeometryCylinder.attributes.add('capSegments', {type: 'number', default: 20});

GeometryCylinder.prototype.initialize = function() {
    this.updateMesh();
    this.on('attr', this.updateMesh, this);
};

GeometryCylinder.prototype.createMesh = function() {
    var options = {
        radius: this.radius,
        height: this.height,
        heightSegments: this.heightSegments,
        capSegments: this.capSegments,
    };
    return pc.createCylinder(this.app.graphicsDevice, options);
};

GeometryCylinder.prototype.updateMesh = function() {
    this.entity.model.model.meshInstances[0].mesh = this.createMesh();
};
