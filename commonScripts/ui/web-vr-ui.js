var WebVrUi = pc.createScript('webVrUi');

WebVrUi.attributes.add("camera", {type: "entity", title: "Camera"});
WebVrUi.attributes.add("enterVrWhite", {type: "asset", title: "Enter VR White Asset"});
WebVrUi.attributes.add("enterVrOrange", {type: "asset", title: "Enter VR Orange Asset"});
WebVrUi.attributes.add("infoBoxLifeSpan", {type: "number", default: 3, title: "Info Box Life Span",});

WebVrUi.prototype.initialize = function() {
    if (this.app.vr && this.app.vr.display) {
        this.app.vr.display.on("presentchange", this.onVrPresentChange, this);
    }

    this.app.assets.load(this.enterVrWhite);
    this.app.assets.load(this.enterVrOrange);

    // HTML UI setup
    var css = '#vr-button {position: absolute;right: 0px;bottom: 0px;background-image: url("'+ this.enterVrWhite.getFileUrl() +'");width: 146px;height: 104px;display: block;'+
        'background-position: 0px 0px;background-size: 146px 104px; cursor: pointer;}' +
	    '#vr-button:hover {background-image: url("' + this.enterVrOrange.getFileUrl() + '");}' +
        '#info-box {position: absolute;	right: 140px;bottom: 26px;display: block;background-color: rgba(0,0,0, 168);color: rgb(218, 218, 218);padding: 5px 10px 5px 10px;max-width: 220px;}' +
        '#info-box a, #info-box a:hover, #info-box a:visited, #info-box a:active {text-decoration: underline;color: rgb(218, 218, 218);}';

    var style = pc.createStyle(css);
    document.head.appendChild(style);

    this.vrButtonDiv = document.createElement("div");
    this.vrButtonDiv.id = "vr-button";
    this.vrButtonDiv.innerHTML = "&nbsp";

    document.body.appendChild(this.vrButtonDiv);

    this.infoBoxDiv = document.createElement("div");
    this.infoBoxDiv.id = "info-box";

    this.infoBoxLifeTime = 0;
    this.infoBoxShowing = false;

    this.vrEntered = false;

    var self = this;

    var onEnterVrPressedEvent = function() {
        // If WebVR is available and a VrDisplay is attached
        if (self.app.vr && self.app.vr.display) {
            if(self.vrEntered) {
                // Exit vr (needed for non-mobile)
                self.camera.camera.exitVr(function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            }
            else {
                // Enter vr
                self.camera.camera.enterVr(function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        }
        else {
            if (!self.infoBoxShowing) {
                if (self.app.vr.isSupported) {
                    self.infoBoxDiv.innerHTML = "No VR display or headset is detected.";
                }
                else {
                    self.infoBoxDiv.innerHTML = "Sorry, your browser does not support WebVR :(. Please go <a href='https://webvr.info/' target='_blank'>here</a> for more information.";
                }

                self.infoBoxLifeTime = self.infoBoxLifeSpan;
                document.body.appendChild(self.infoBoxDiv);
                self.infoBoxShowing = true;
            }
        }
    };

    this.vrButtonDiv.addEventListener('click', onEnterVrPressedEvent, false);

    // try and enter vr immediately for Carmel browser
    onEnterVrPressedEvent();
};

// update code called every frame
WebVrUi.prototype.update = function(dt) {
    if (this.infoBoxShowing) {
        this.infoBoxLifeTime -= dt;
        if (this.infoBoxLifeTime <= 0) {
            document.body.removeChild(this.infoBoxDiv);
            this.infoBoxShowing = false;
        }
    }
};

WebVrUi.prototype.onVrPresentChange = function(display) {
    if (display.presenting) {
        // Only remove the VR button if we are on mobile
        if (pc.isMobile()) {
            document.body.removeChild(this.vrButtonDiv);
        }
        this.vrEntered = true;
    }
    else {
        if (pc.isMobile()) {
            document.body.appendChild(this.vrButtonDiv);
        }
        this.vrEntered = false;
    }
};

WebVrUi.prototype.scaleInfoPanel = function(scale) {
};
