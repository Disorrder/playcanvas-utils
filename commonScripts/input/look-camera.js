var LookCamera = pc.createScript('lookCamera');

LookCamera.DEFAULT_HUMAN_HEIGHT = 1.67;

Object.defineProperty(LookCamera.prototype, "pitch", {
    get: function() {
        return this._pitch;
    },

    set: function(value) {
        this._pitch = pc.math.clamp(value, -90, 90);
    }
});


// Property to get and set the yaw of the camera around the pivot point (degrees)
Object.defineProperty(LookCamera.prototype, "yaw", {
    get: function() {
        return this._yaw;
    },

    set: function(value) {
        this._yaw = value;
    }
});


LookCamera.prototype.initialize = function () {
    this._offsetParent = this.entity.parent;

    // Camera euler angle rotation around x and y axes
    var rotation = this.entity.getRotation();
    this._yaw = this._getYaw(rotation);
    this._pitch = this._getPitch(rotation, this._yaw);

    this._magicWindowEnabled = false;
    this._presenting = false;

    this._hasStageParams = false;

    if (this.app.vr && this.app.vr.display) {
        var appVrDisplay = this.app.vr.display;

        if (appVrDisplay.display.stageParameters) {
            this._hasStageParams = true;
        }

        this.entity.camera.vrDisplay = appVrDisplay;
        appVrDisplay.on("presentchange", this._onVrPresentChange, this);

        if (appVrDisplay.capabilities.hasPosition) {
            if (this._hasStageParams) {
                var pos = this._offsetParent.getPosition();
                this._offsetParent.setPosition(pos.x, pos.y - LookCamera.DEFAULT_HUMAN_HEIGHT, pos.z);
            }
        }

        this._magicWindowEnabled = true;
    }
};


LookCamera.prototype.update = function (dt) {
    if (this._magicWindowEnabled || this._presenting) {
        // If we are using the magic window, then only use the touch x to rotate the view horizontally
        this._offsetParent.setLocalEulerAngles(0, this.yaw, 0);
    }
    else {
        this._offsetParent.setLocalEulerAngles(this.pitch, this.yaw, 0);
    }
};


LookCamera.prototype._onVrPresentChange = function(display) {
    if (display.presenting) {
        this._offsetParent.setLocalEulerAngles(0, this.yaw, 0);
        this._presenting = true;

    } else {
        if (this._magicWindowEnabled) {
            if (this.app.vr && this.app.vr.display) {
                var appVrDisplay = this.app.vr.display;
                this.entity.camera.vrDisplay = appVrDisplay;
            }
        }

        this._presenting = false;
    }
};


LookCamera.quatWithoutYaw = new pc.Quat();
LookCamera.yawOffset = new pc.Quat();

LookCamera.prototype._getPitch = function(quat, yaw) {
    var quatWithoutYaw = LookCamera.quatWithoutYaw;
    var yawOffset = LookCamera.yawOffset;

    yawOffset.setFromEulerAngles(0, -yaw, 0);
    quatWithoutYaw.mul2(yawOffset, quat);

    var transformedForward = new pc.Vec3();

    quatWithoutYaw.transformVector(pc.Vec3.FORWARD, transformedForward);

    return Math.atan2(transformedForward.y, -transformedForward.z) * pc.math.RAD_TO_DEG;
};


LookCamera.transformedForward = new pc.Vec3();

LookCamera.prototype._getYaw = function (quat) {
    var transformedForward = LookCamera.transformedForward;
    quat.transformVector(pc.Vec3.FORWARD, transformedForward);

    return Math.atan2(-transformedForward.x, -transformedForward.z) * pc.math.RAD_TO_DEG;
};

LookCamera.prototype._setEntityAlpha = function(entity, alpha) {
    if (entity.model && entity.model.enabled) {
        var a = pc.math.clamp(alpha, 0, 1);
        var meshInstances = entity.model.meshInstances;
        for(var i = 0; i < meshInstances.length; ++i) {
            // WARNING: setParameter() is still a beta feature and may change in the future
            // This is where we set how transparent we want the object to be on a value between 0 and 1
            // 0 = fully transparent
            // 1 = fully opaque

            // Note: The materials on the model MUST have alpha set on opacity -> blend type and be slight less than 1
            meshInstances[i].setParameter("material_opacity", a);
        }
    }
};
