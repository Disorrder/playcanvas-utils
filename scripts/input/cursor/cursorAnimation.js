/*jshint esversion: 6 */
var CursorAnimation = pc.createScript('cursorAnimation');

// CursorAnimation.attributes.add('zoomTo', {type: 'number', default: 1.2});
CursorAnimation.attributes.add('hoverScale', {type: 'vec3', default: [0.2, 0.2, 0.2]});
CursorAnimation.attributes.add('clickScale', {type: 'vec3', default: [0.5, 0.5, 0.5]});

CursorAnimation.extend({
    initialize() {
        this.camera = this.entity.parent.camera;
        this.cameraZoom = this.camera.entity.script.cameraZoom;

        this.entity.on('cursor:enter', this.enter, this);
        this.entity.on('cursor:leave', this.leave, this);
        this.entity.on('cursor:fusing', this.fusing, this);
        this.entity.on('cursor:click', this.click, this);

        this.currentAnim = null;
        this.initial = {
            // enabled: this.entity._enabled,
            scale: this.entity.getLocalScale().clone(),
        };

        this._fusingScaleDelta = new pc.Vec3();
        // potentially do it on attr change
        this._fusingScaleDelta.sub2(this.clickScale, this.hoverScale);
    },

    playAnimation(anim) {
        if (this.currentAnim) this.currentAnim.stop();
        this.currentAnim = anim.on('stop', () => {
            console.log('COMPLEEEE');
            this.currentAnim = null;
        }).play();
        return this;
    },

    enter(fusingTimeout) {
        var anim = new pc.AnimationTimeline()
        .add({
            duration: 300,
            animate: [{
                target: this.entity.getLocalScale(),
                to: this.hoverScale.toObject(),
                setter: this.entity.setLocalScale.bind(this.entity)
            }]
        })
        .add({
            duration: fusingTimeout - 300,
            animate: [{
                target: this.entity.getLocalScale(),
                to: this.clickScale.toObject(),
                setter: this.entity.setLocalScale.bind(this.entity)
            }, {
                target: this.entity.script.gfxDissolve,
                to: {threshold: 0.95}
            }]
        })
        ;
        return this.playAnimation(anim);
    },

    leave() {
        var anim = new pc.AnimationTimeline()
        .add({
            duration: 300,
            easing: pc.QuadraticOut,
            animate: [{
                target: this.entity.getLocalScale(),
                to: this.initial.scale.toObject(),
                setter: this.entity.setLocalScale.bind(this.entity)
            }, {
                target: this.entity.script.gfxDissolve,
                to: {threshold: 0}
            }]
        })
        ;
        return this.playAnimation(anim);
    },

    click() {
        var anim = new pc.AnimationTimeline()
        .add({
            duration: 300,
            easing: pc.QuadraticOut,
            animate: [{
                target: this.entity.getLocalScale(),
                from: {x: 0, y: 0, z: 0},
                to: this.initial.scale.toObject(),
                setter: this.entity.setLocalScale.bind(this.entity)
            }, {
                target: this.entity.script.gfxDissolve,
                to: {threshold: 0}
            }]
        })
        ;
        return this.playAnimation(anim);
    }
});
