/*jshint esversion: 6 */
var Animations = {
    shake(params) {
        params = Object.assign({
            target: null,
            times: 10,
            spread: 1,
        }, params);

        var vec3 = new pc.Vec3();
        var anim = new Animated();
        for (let i = 0; i < params.times; i++) {
            anim.add({
                duration: 50,
                animate: [{
                    target: params.target.getLocalPosition.bind(params.target),
                    to: vec3.randomize(params.spread).toObject(),
                    setter: params.target.setLocalPosition.bind(params.target)
                }]
            });
        }

        anim.add({
            duration: 50,
            animate: [{
                target: params.target.getLocalPosition.bind(params.target),
                to: {x: 0, y: 0, z: 0},
                setter: params.target.setLocalPosition.bind(params.target)
            }]
        });

        return anim;
    }
};
