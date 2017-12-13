var EntityCollision = pc.createScript('entityCollision');

EntityCollision.attributes.add('target', {type: 'entity'});

EntityCollision.prototype.initialize = function() {
    this.on('attr:collision', this.attrCollision, this);
    this.attrCollision();
};

EntityCollision.prototype.attrCollision = function() {
    this.entity.collision = this.target.collision;
    this.entity.collision.entity = this.entity;
};
