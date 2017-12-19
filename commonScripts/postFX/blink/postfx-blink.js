/*jshint esversion: 6 */
class PostfxBlink extends pc.PostEffect {
    constructor(device, options) {
        super(device);
        this.scope = device.scope;

        this.uniforms = {
            t: 0,
            uColor: [0, 0, 0, 1]
        };

        var vs = pc.app.assets.find('postfx-basic.vert').resource;
        var fs = pc.app.assets.find('postfx-blink.frag').resource;
        this.shader = new pc.Shader(device, {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION
            },
            vshader: vs,
            fshader: fs
        });
        this.shader.link();
    }

    render(inputTarget, outputTarget, rect) {
        for (let name in this.uniforms) {
            this.scope.resolve(name).setValue(this.uniforms[name]);
        }

        this.scope.resolve("uColorBuffer").setValue(inputTarget.colorBuffer); // get picture from camera
        pc.posteffect.drawFullscreenQuad(this.device, outputTarget, this.vertexBuffer, this.shader, rect); // update screen image
    }
}

pc.posteffect.PostfxBlink = PostfxBlink;
