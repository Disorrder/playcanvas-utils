// ref: https://github.com/playcanvas/engine/blob/master/src/script/script.js
// last update: 0.218.0
class ScriptType {
    constructor(args) {
        if (! args || ! args.app || ! args.entity) {
            console.warn('script \'' + name + '\' has missing arguments in consructor');
        }

        pc.events.attach(this);

        this.app = args.app;
        this.entity = args.entity;
        this._enabled = typeof(args.enabled) === 'boolean' ? args.enabled : true;
        this._enabledOld = this.enabled;
        this.__attributes = { };
        this.__attributesRaw = args.attributes || null;
        // this.__scriptType = this; //?
    }

    __initializeAttributes(force) {
        if (! force && ! this.__attributesRaw)
            return;

        // set attributes values
        for(var key in script.attributes.index) {
            if (this.__attributesRaw && this.__attributesRaw.hasOwnProperty(key)) {
                this[key] = this.__attributesRaw[key];
            } else if (! this.__attributes.hasOwnProperty(key)) {
                if (script.attributes.index[key].hasOwnProperty('default')) {
                    this[key] = script.attributes.index[key].default;
                } else {
                    this[key] = null;
                }
            }
        }

        this.__attributesRaw = null;
    }

    static extend(methods) {
        for(var key in methods) {
            if (!methods.hasOwnProperty(key)) continue;
            this.prototype[key] = methods[key];
        }
    }
}






// pc.createScript = function() {
//
// }
