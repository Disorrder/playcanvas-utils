var GeometrySphere = pc.createScript('geometrySphere');

GeometrySphere.attributes.add('radius', {type: 'number', default: 0.5});
GeometrySphere.attributes.add('latitudeBands', {type: 'number', default: 16});
GeometrySphere.attributes.add('longitudeBands', {type: 'number', default: 32});

GeometrySphere.prototype.initialize = function() {
    this.updateMesh();
    this.on('attr', this.updateMesh, this);
};

GeometrySphere.prototype.createMesh = function() {
    var options = {
        radius: this.radius,
        latitudeBands: this.latitudeBands,
        longitudeBands: this.longitudeBands,
    };
    return pc.createSphere(this.app.graphicsDevice, options);
};

GeometrySphere.prototype.updateMesh = function() {
    this.entity.model.model.meshInstances[0].mesh = this.createMesh();
};
