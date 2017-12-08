var SelectorCamera = pc.createScript('selectorCamera');

SelectorCamera.attributes.add('selectionTime', {
    type: 'number',
    default: 3
});

SelectorCamera.attributes.add('range', {
    type: 'number',
    default: 100
});

// initialize code called once per entity
SelectorCamera.prototype.initialize = function() {
    this.app.on("selectorcamera:add", this.addItem, this);
    this.app.on("selectorcamera:remove", this.removeItem, this);

    this._current = null;
    this._selected = null;
    this._items = [];
    this._spheres = [];
    this._ray = new pc.Ray();
    this._timer = 0;
};

// update code called every frame
SelectorCamera.prototype.update = function(dt) {
    this._ray.origin.copy(this.entity.getPosition());
    this._ray.direction.copy(this.entity.forward).scale(this.range);

    var selected = null;
    for (var i = 0, n = this._items.length; i < n; i++) {
        var item = this._items[i];
        // test against aabb
        var result = this._spheres[i].intersectsRay(this._ray);
        if (result) {
            selected = item;
            if (item !== this._current) {
                if (this._current) {
                    this._current.fire("selectorcamera:unhover");
                    this.app.fire("selectorcamera:unhover", this._current);
                }

                item.fire("selectorcamera:hover");
                this.app.fire("selectorcamera:hover", item);
                this._current = item;
                this._selected = null;
                this._timer = 0;
            } else if (!this._selected) {
                this._timer += dt;
                item.fire("selectorcamera:selectionprogress", (this._timer / this.selectionTime));
                this.app.fire("selectorcamera:selectionprogress", (this._timer / this.selectionTime));
                if (this._timer > this.selectionTime) {
                    item.fire("selectorcamera:select");
                    this.app.fire("selectorcamera:select", item);
                    this._selected = item;
                }
            }
        }
    }
    if (this._current && !selected) {
        this._current.fire("selectorcamera:unhover");
        this.app.fire("selectorcamera:unhover", this._current);
        this._current = null;
        this._selected = null;
        this._timer = 0;
    }
};

SelectorCamera.prototype.addItem = function (e, sphere) {
    if (e.model) {
        this._items.push(e);
        this._spheres.push(sphere);
    }
};

SelectorCamera.prototype.removeItem = function (e) {
    var i = this._items.indexOf(e);
    if (i >= 0) {
        this._items.splice(i, 1);
        this._spheres.splice(i, 1);
    }
};
