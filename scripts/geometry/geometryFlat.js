/*jshint esversion: 6 */

// ref: https://forum.playcanvas.com/t/procedural-skinned-mesh/1550/2
var GeometryFlat = pc.createScript('geometryFlat');

GeometryFlat.extend({
    initialize() {
        var mesh = this.entity.model.model.meshInstances[0].mesh;
        var vBuffer = mesh.vertexBuffer;
        var [indices, vData] = this.getVertexData(mesh);
        if (indices.length > 65536) {
            return console.warn(`GeometryFlat can not be applied to ${this.entity.name}'s mesh, because it's indices more then 65535 (WebGL limitation).`,
                `vertices: ${vBuffer.numVertices}, indices: ${indices.length}.`
            );
        }

        // Duplicate vertices and reindex
        var new_indices = [];
        var new_vBuffer = new pc.VertexBuffer(vBuffer.device, vBuffer.format, indices.length, vBuffer.usage);
        var new_vIterator = new pc.VertexIterator(new_vBuffer);

        var new_vData = {};
        new_vBuffer.format.elements.forEach((v) => {
            new_vData[v.name] = [];
        });

        indices.forEach((index, i) => {
            new_indices.push(i);

            new_vBuffer.format.elements.forEach((v) => {
                let arr = vData[v.name].slice(index*v.numComponents, (index+1)*v.numComponents);
                new_vData[v.name] = new_vData[v.name].concat(arr);
            });
        });

        // Recalculate normals and tangents
        new_vData[pc.SEMANTIC_NORMAL] = pc.calculateNormals(new_vData[pc.SEMANTIC_POSITION], new_indices);
        new_vData[pc.SEMANTIC_TANGENT] = pc.calculateTangents(new_vData[pc.SEMANTIC_POSITION], new_vData[pc.SEMANTIC_NORMAL], new_vData[pc.SEMANTIC_TEXCOORD0], new_indices);

        // Write new vertices to buffer
        new_indices.forEach((index) => {
            new_vBuffer.format.elements.forEach((v) => {
                arr = new_vData[v.name];
                arr = arr.slice(index*v.numComponents, (index+1)*v.numComponents);
                let elem = new_vIterator.element[v.name];
                elem.set.apply(elem, arr);
            });
            new_vIterator.next();
        });
        new_vIterator.end();

        // Set new indices and vertices to mesh
        mesh.indexBuffer[0].storage = new Uint16Array(new_indices).buffer;
        mesh.indexBuffer[0].unlock();
        mesh.vertexBuffer = new_vBuffer;
    },

    getVertexData(mesh) {
        var indices = new Uint16Array(mesh.indexBuffer[0].lock());
        var vBuffer = mesh.vertexBuffer;
        var vIterator = new pc.VertexIterator(mesh.vertexBuffer);

        var vData = {};
        vBuffer.format.elements.forEach((v) => {
            vData[v.name] = [];
        });

        for (let i=0; i<vBuffer.numVertices; i++) {
            vBuffer.format.elements.forEach((v) => {
                let elem = vIterator.element[v.name];
                let arr = elem.array.slice(elem.index, elem.index+v.numComponents);
                arr.forEach((num) => vData[v.name].push(num));
            });
            vIterator.next();
        }
        vIterator.end();
        return [indices, vData];
    },
});


// Method with creating new mesh

// GeometryFlat.prototype.initialize = function() {
//     var mesh = this.entity.model.model.meshInstances[0].mesh;
//     var indices = new Uint16Array(mesh.indexBuffer[0].lock());
//     var vBuffer = mesh.vertexBuffer;
//     var vIterator = new pc.VertexIterator(mesh.vertexBuffer);
//     var vData = {};
//     vBuffer.format.elements.forEach((v) => {
//         vData[v.name] = [];
//     });

//     for (let i=0; i<vBuffer.numVertices; i++) {
//         vBuffer.format.elements.forEach((v) => {
//             let elem = vIterator.element[v.name];
//             let arr = elem.array.slice(elem.index, elem.index+v.numComponents);
//             arr.forEach((num) => vData[v.name].push(num));
//         });
//         vIterator.next();
//     }
//     vIterator.end();

//     var positions = vData[pc.SEMANTIC_POSITION];
//     var normals = vData[pc.SEMANTIC_NORMAL];
//     var uvs = vData[pc.SEMANTIC_TEXCOORD0];

//     console.log('before', this.entity, mesh, vIterator, indices, indices.length, positions);
//     var flatData = this.getFlatData({indices, positions, normals, uvs});
//     console.log('flat', flatData);

//     var new_mesh = pc.createMesh(vBuffer.device, flatData.positions, {
//         normals: flatData.normals,
//         uvs: flatData.uvs,
//         indices: flatData.indices
//     });
//     console.log('new mesh', new_mesh, new pc.VertexIterator(new_mesh.vertexBuffer));
//     this.entity.model.model.meshInstances[0].mesh = new_mesh;
//     // mesh.indexBuffer = new_mesh.indexBuffer;
//     // mesh.vertexBuffer = new_mesh.vertexBuffer;
// };

// GeometryFlat.prototype.getFlatData = function(data){
//     // Takes vertex data containing {indices,positions,normals,uvs}
//     // and duplicates the verticies so that the normals don't get interpolated
//     // returns new vertex data

//     var new_indices = [];
//     var new_positions = [];
//     var new_normals = [];
//     var new_uvs = data.uvs ? [] : undefined;

//     var index, x, y, z, u, v;

//     for(var i = 0; i<data.indices.length; i++){
//         // Loop over all the verticies
//         // Create a new positions for each
//         index = data.indices[i];
//         x = data.positions[index*3];
//         y = data.positions[index*3+1];
//         z = data.positions[index*3+2];
//         new_positions.push(x, y, z);

//         // Do the same for UV's
//         if (data.uvs) {
//             u = data.uvs[index*2];
//             v = data.uvs[index*2+1];
//             new_uvs.push(u, v);
//         }

//         // Use this new position in our index array
//         new_indices.push(i);
//     }

//     new_normals = pc.calculateNormals(new_positions, new_indices);
//     console.log('DATA', data, new_positions, new_indices, new_normals);

//     return {
//         indices: new_indices,
//         positions: new_positions,
//         normals: new_normals,
//         uvs: new_uvs
//     };
// };
