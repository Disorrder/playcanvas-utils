/*jshint esversion: 6 */
var DisableHelper = pc.createScript('disableHelper');

DisableHelper.attributes.add('timeout', {type: 'number', default: 0});

DisableHelper.prototype.initialize = function() {
    setTimeout(() => {
        this.entity.enabled = false;
    }, this.timeout);
};
