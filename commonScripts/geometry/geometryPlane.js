/*jshint esversion: 6 */
var GeometryPlane = pc.createScript('geometryPlane');

GeometryPlane.attributes.add('halfExtents', {type: 'vec2', default: [0.5, 0.5]});
GeometryPlane.attributes.add('widthSegments', {type: 'number', default: 1});
GeometryPlane.attributes.add('lengthSegments', {type: 'number', default: 1});

GeometryPlane.attributes.add('_modifyUV', {type: 'boolean', description: 'Make UVs 1 per'});

GeometryPlane.prototype.initialize = function() {
    this.updateMesh();
    this.on('attr', this.updateMesh, this);
};

GeometryPlane.prototype.createMesh = function() {
    var options = {
        halfExtents: this.halfExtents,
        widthSegments: this.widthSegments,
        lengthSegments: this.lengthSegments,
    };
    return pc.createPlane(this.app.graphicsDevice, options);
};

GeometryPlane.prototype.updateMesh = function() {
    this.entity.model.model.meshInstances[0].mesh = this.createMesh();
    this.modifyUV();
};

GeometryPlane.prototype.modifyUV = function() {
    var mesh = this.entity.model.model.meshInstances[0].mesh;
    var vIterator = new pc.VertexIterator(mesh.vertexBuffer);
    var uv = vIterator.element[pc.SEMANTIC_TEXCOORD0];

    var width = this.halfExtents.x * 2;
    var length = this.halfExtents.y * 2;

    for (let i = 0, len = vIterator.vertexBuffer.numVertices; i < len; i++) {
        let _uv = uv.array.slice(uv.index, uv.index+2);
        uv.set(_uv[0] * width, _uv[1] * length);
        vIterator.next();
    }
    vIterator.end();
};
