/*jshint esversion: 6 */

var CursorController = pc.createScript('cursorController');

CursorController.attributes.add('near', {
    type: 'number',
    min: 0, max: 1e6,
    default: 0
});
CursorController.attributes.add('far', {
    type: 'number',
    min: 0, max: Infinity,
    default: 1e6
});

CursorController.attributes.add('fuseTimeout', {
    type: 'number',
    title: 'Fusing',
    description: 'Fuse timeout',
    min: 0, max: 3000,
    default: 1700
});

CursorController.extend({
    initialize() {
        this.camera = this.entity.parent;
        this.player = this.entity.getAllParents().find((v) => v.tags.has('player'));
        this.raycaster = new pc.RaycasterPhys();
        // this.raycaster = new pc.Raycaster();
        this.raycaster.near = this.near;
        this.raycaster.far = this.far;

        this._state = 'none'; // one of: none, hover, hold
        this._stateTime = 0;
        this._currentEntity = null;

        this.on('attr:near', () => this.raycaster.near = this.near);
        this.on('attr:far', () => this.raycaster.far = this.far);
    },
    update(dt) {
        // this.raycaster.update();
        this.raycaster.ray.origin.copy(this.camera.getPosition());
        this.raycaster.ray.direction.copy(this.camera.forward);

        let selected = this.raycaster.castFirst();
        let selectedEntity;
        if (selected) {
            if (selected.entity.tags.has('interactive')) {
                selected.interactiveEntity = selected.entity;
            } else {
                selected.interactiveEntity = selected.entity.findParents((v) => v.tags.has('interactive')); // TODO refactor this shit to entity's animation params
            }
            selectedEntity = selected.interactiveEntity;
        }

        if (selectedEntity !== this._currentEntity) {
            if (this._currentEntity) {
                this._state = 'none';
                this.fireEvent(this._currentEntity, 'cursor:leave');
            }

            this._currentEntity = selectedEntity;
        }
        if (this._currentEntity) {
            if (this._state === 'none') {
                this._state = 'hover';
                this._stateTime = this.app._time;
                this.fireEvent(this._currentEntity, 'cursor:enter', this.fuseTimeout);
            }
            if (this._state === 'hover') {
                var fusingTime = (this.app._time - this._stateTime) / this.fuseTimeout;
                fusingTime = pc.math.clamp(fusingTime, 0, 1);
                this.fireEvent(this._currentEntity, 'cursor:fusing', fusingTime);

                if (fusingTime >= 1) {
                    this._state = 'hold';
                    this.fireEvent(this._currentEntity, 'cursor:click');
                }
            }

            // console.log('upd', this._currentEntity._guid, this._state, fusingTime, this.app._time, this._stateTime, this.fuseTimeout);
        }
    },
    fireEvent(entity, ...args) {
        args.push(this.player);
        this.entity.fire.apply(this.entity, args);
        entity.fire.apply(entity, args);
    }
});
