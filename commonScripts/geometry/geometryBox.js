var GeometryBox = pc.createScript('geometryBox');

GeometryBox.attributes.add('halfExtents', {type: 'vec3', default: [0.5, 0.5, 0.5]});
GeometryBox.attributes.add('widthSegments', {type: 'number', default: 1});
GeometryBox.attributes.add('heightSegments', {type: 'number', default: 1});
GeometryBox.attributes.add('lengthSegments', {type: 'number', default: 1});

GeometryBox.prototype.initialize = function() {
    this.updateMesh();
    this.on('attr', this.updateMesh, this);
};

GeometryBox.prototype.createMesh = function() {
    var options = {
        halfExtents: this.halfExtents,
        widthSegments: this.widthSegments,
        heightSegments: this.heightSegments,
        lengthSegments: this.lengthSegments,
    };
    return pc.createBox(this.app.graphicsDevice, options);
};

GeometryBox.prototype.updateMesh = function() {
    this.entity.model.model.meshInstances[0].mesh = this.createMesh();
};
