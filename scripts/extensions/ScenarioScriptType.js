/*jshint esversion: 6 */

pc.ScenarioScriptType = {
    initType() {
        this.scenario = new pc.AnimationTimeline();

        if (this.autoplay) {
            setTimeout(() => {
               this.scenario.play();
            });
        }

        if (~location.search.indexOf('debug=true')) {
            this.scenario
            .on('begin', () => {
                console.log('Debug timescale speed up!', this.__scriptType.__name, this);
                this.app.timeScale = 4;
            })
            .on('complete', () => {
                console.log('Debug timescale end!', this.__scriptType.__name, this);
                this.app.timeScale = 1;
            });
        }
    },

    runScript() {
        this.scenario.play();
    },

    findEntities(entities) {
        var res = {};
        for (let name in entities) {
            if (typeof entities[name] !== 'string') continue;
            if (entities[name][0] === '/') {
                res[name] = this.app.root.findByPath('Root'+entities[name]);
            } else {
                res[name] = this.entity.findByName(entities[name]);
            }
        }
        return res;
    },

    // frames generator
    frameShowDissolve(entity, params) {
        var target = params.target || entity;
        return Object.assign({
            animate: [{
                target: target.script.gfxDissolve,
                from: {threshold: 1},
                to: {threshold: 0} // target.script.gfxDissolve.threshold
            }],
            begin(frame) {
                entity.enabled = true;
            }
        }, params);
    },
    frameHideDissolve(entity, params) {
        var target = params.target || entity;
        return Object.assign({
            animate: [{
                target: target.script.gfxDissolve,
                from: {threshold: 0}, // target.script.gfxDissolve.threshold
                to: {threshold: 1}
            }],
            complete(frame) {
                entity.enabled = false;
                target.script.gfxDissolve.threshold = frame.animate[0].from.threshold;
            }
        }, params);
    },

    frameShowElement(entity, params) {
        return Object.assign({
            animate: [{
                target: entity.element,
                from: {opacity: 0},
                to: {opacity: 1}
            }],
            begin() {
                entity.enabled = true;
            }
        }, params);
    },

    frameHideElement(entity, params) {
        return Object.assign({
            animate: [{
                target: entity.element,
                from: {opacity: 1},
                to: {opacity: 0}
            }],
            complete() {
                entity.enabled = false;
            }
        }, params);
    },

    frameShowSound(entity, params) {
        return Object.assign({
            duration: 200,
            animate: [{
                target: entity.sound,
                from: {volume: 0},
                to: {volume: 1}
            }],
            begin() {
                entity.enabled = true;
            }
        }, params);
    },

    //?
    setToFrameEntities(frame, params) {
        frame.animate.forEach((v) => {
            let entity = v.__entity || v.target.entity;
            if (!entity) return;
            Object.assign(entity, params);
        });
    }
};
