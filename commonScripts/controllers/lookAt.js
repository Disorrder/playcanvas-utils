var LookAt = pc.createScript('lookAt');

LookAt.attributes.add('target', { type: 'entity' });

LookAt.prototype.update = function(dt) {
    if (this.target) {
        this.entity.lookAt(this.target.getPosition());
    }
};
