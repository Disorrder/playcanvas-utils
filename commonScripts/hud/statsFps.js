var StatsFps = pc.createScript('statsFps');

StatsFps.attributes.add('delay', {type: 'number', min: 0, max: 1000});

StatsFps.prototype.initialize = function() {
    this.dt = 0;
    this.frames = 0;
    this._lastTest = 0;
};

StatsFps.prototype.update = function(dt) {
    this.dt += dt / this.app.timeScale;
    this.frames++;

    if (this.app._time - this._lastTest < this.delay) return;
    this._lastTest = this.app._time;

    this.entity.element.text = Math.round( this.frames / this.dt );
    this.dt = 0;
    this.frames = 0;
};
