/*jshint esversion: 6 */

class RaycasterPhys {
    constructor(ray) {
        this.active = true;
        this.app = pc.app || pc.script.app;
        this.ray = ray || new pc.Ray();
        this.near = 0;
        this.far = 100;
    }

    get from() {
        return this.ray.origin.clone().add( this.ray.direction.clone().scale(this.near) );
    }

    get to() {
        return this.ray.origin.clone().add( this.ray.direction.clone().scale(this.far) );
    }

    castFirst() {
        this._result = this.app.systems.rigidbody.raycastFirst(this.from, this.to);
        if (this._result && this._result.entity.collision) this._result.entity = this._result.entity.collision.entity;
        // console.log('raycast res', this.from.toString(), this.to.toString(), result);
        return this._result;
    }
}

if (pc.RaycasterPhys) console.warn('pc.RaycasterPhys is already exists!');
pc.RaycasterPhys = RaycasterPhys;
