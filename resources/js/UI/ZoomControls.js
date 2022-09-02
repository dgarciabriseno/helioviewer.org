// TODO: for debug only
var zoomer;

function create_focal_point(x, y) {
    let d = document.createElement('div');
    d.style.position = "absolute";
    d.style.left = x + 'px';
    d.style.top = y + 'px';
    d.style.background = "lightgreen";
    d.style.width = "10px";
    d.style.height = "10px";
    document.body.appendChild(d);
}
/**
 * @fileOverview Contains the class definition for an ZoomControls class.
 * @author <a href="mailto:jeff.stys@nasa.gov">Jeff Stys</a>
 * @author <a href="mailto:keith.hughitt@nasa.gov">Keith Hughitt</a>
 */
/*jslint browser: true, white: true, onevar: true, undef: true, nomen: false,
eqeqeq: true, plusplus: true, bitwise: true, regexp: false, strict: true,
newcap: true, immed: true, maxlen: 80, sub: true */
/*globals $, Class */
"use strict";
var ZoomControls = Class.extend(
    /** @lends ZoomControls.prototype */
    {
    /**
     * @constructs
     *
     * Creates a new ZoomControl
     */
    init: function (id, imageScale, increments, minImageScale, maxImageScale) {
        this.id            = id;
        this.imageScale    = imageScale;
        this.increments    = increments;
        this.minImageScale = minImageScale;
        this.maxImageScale = maxImageScale;

        this.zoomInBtn  = $('#zoom-in-button');
        this.zoomSlider = $('#zoomControlSlider');
        this.zoomOutBtn = $('#zoom-out-button');

        this._initSlider();
        this._initEventHandlers();
        this._enablePinchZoom();
    },

    /**
     * Adjusts the zoom-control slider
     *
     * @param {Integer} v The new zoom value.
     */
    _onSlide: function (v) {
        this._setImageScale(v);
    },

    /**
     * Translates from jQuery slider values to zoom-levels, and updates the
     * zoom-level.
     *
     * @param {Object} v jQuery slider value
     */
    _setImageScale: function (v) {
        $(document).trigger('image-scale-changed', [this.increments[v]]);
        $(document).trigger('replot-celestial-objects');
        $(document).trigger('replot-event-markers');
        $(document).trigger('earth-scale');
        $(document).trigger('update-external-datasource-integration');
    },

    /**
     * @description Initializes zoom level slider
     */
    _initSlider: function () {
        var description, self = this;

        // Reverse orientation so that moving slider up zooms in
        this.increments.reverse();

        // Initialize slider
        this.zoomSlider.slider({
            slide: function (event, slider) {
                self._onSlide(slider.value);
                //slider.handle = slider.value;
            },
            min: 0,
            max: this.increments.length - 1,
            step: 1,
            orientation: 'vertical',
            value: $.inArray(this.imageScale, this.increments)
        });

        // Add tooltip
        description = "Drag this handle up and down to zoom in and out of " +
                      "the displayed image.";
        $("#zoomControlSlider > .ui-slider-handle").attr('title', description)
                                                   .qtip();
    },

    /**
     * Checks if the viewport is already at maximum zoom.
     */
    _canZoomIn: function () {
        let index = this.zoomSlider.slider("value") + 1;
        return this.increments[index] >= this.minImageScale;
    },

    /**
     * Checks if the viewport is already at maximum zoom.
     */
    _canZoomOut: function () {
        let index = this.zoomSlider.slider("value") - 1;
        return this.increments[index] <= this.maxImageScale;
    },

    /**
     * @description Responds to zoom in button click
     */
    _onZoomInBtnClick: function () {
        var index = this.zoomSlider.slider("value") + 1;

        if (this._canZoomIn()) {
            this.zoomSlider.slider("value", index);
            this._setImageScale(index);
        }
    },

    /**
     * @description Responds to zoom out button click
     */
    _onZoomOutBtnClick: function () {
        var index = this.zoomSlider.slider("value") - 1;

        if (this._canZoomOut()) {
            this.zoomSlider.slider("value", index);
            this._setImageScale(index);
        }
    },

    /**
     * Handles mouse-wheel movements
     *
     * @param {Event} event Event class
     */
    _onMouseWheelMove: function (e, delta) {
        if(scrollLock){
	        return false;
        }
        
        //Lock the scroll
        scrollLock = true;
        window.setTimeout(function(){
            scrollLock = false;
        },500);
        
        if (delta > 0) {
            this.zoomInBtn.click();
        } else {
            this.zoomOutBtn.click();
        }
        
        return false;
    },

    /**
     * @description Initializes zoom control-related event-handlers
     */
    _initEventHandlers: function () {
        this.zoomInBtn.click($.proxy(this._onZoomInBtnClick, this));
        this.zoomOutBtn.click($.proxy(this._onZoomOutBtnClick, this));

        $("#helioviewer-viewport").mousewheel(
            $.proxy(this._onMouseWheelMove, this));

        $(document).bind("zoom-in",  $.proxy(this._onZoomInBtnClick, this))
                   .bind("zoom-out", $.proxy(this._onZoomOutBtnClick, this));

    },


    /**
     * Calculates the offset of the focus of the touch relative to the container being scaled.
     * This allows us to make sure the portion the user is focusing on stays on screen during
     * the pinch zoom.
     * @param {Object} center {left, top} coordinates relative to the page
     * @returns {Object} {left, top} coordinates relative to the scaled container
     */
    _getMovingContainerAnchor: function (center, scale) {
        let sandbox = document.getElementById('sandbox');
        let container_pos = $('#moving-container').position();

        let x = center.left - parseInt(sandbox.style.left) - container_pos.left;
        let y = center.top - parseInt(sandbox.style.top) - container_pos.top;
        x = x / scale;
        y = y / scale;
        /** for visualizing clicks 
         let sandbox_pos = $('#sandbox').position();
         let div = document.createElement('div');
         div.style.width = "25px";
         div.style.height = "25px";
         div.style.position = "absolute";
         div.style.left = (x)  + "px";
         div.style.top = (y) + "px";
         div.style.background = "purple";
         div.style.transform = "translateX(-50%) translateY(-50%)";
         $('#moving-container')[0].appendChild(div);
         /**/
        // return {left: 0, top: 0};
        return {left: x, top: y};
    },

    /**
     * When the image size changes, we need to recompute the position of the image
     * to keep the anchor point centered on screen.
     */
    _resetViewportAnchor: function (viewport, anchor) {
        viewport.style.left = (parseInt(viewport.style.left) - anchor.left) + "px"
        viewport.style.top = (parseInt(viewport.style.top) - anchor.top) + "px"
    },

    /**
     * Sets the anchor point on the viewport to the new anchor position
     * This requires shifting the image so it appears seamless to the user.
     */
    _setViewportAnchor: function (viewport, anchor, scale) {
        // Get the current anchor point. Adjust the position so the image does not
        // appear to move when we set the new anchor point
        if (viewport.style.transformOrigin != "") {
            let origin_data = viewport.style.transformOrigin.split(' ');
            let origin_left = parseInt(origin_data[0]);
            let origin_top = parseInt(origin_data[1]);

            // Get the viewports current x offset
            let left = parseInt(viewport.style.left);
            // Compute the new left position
            let new_left = left + ((scale - 1) * (anchor.left - origin_left));

            let top = parseInt(viewport.style.top);
            let new_top = top + ((scale - 1) * (anchor.top - origin_top));
            viewport.style.left = new_left + "px";
            viewport.style.top = new_top + "px";
        }

        // Update the anchor position
        viewport.style.transformOrigin = anchor.left + "px " + anchor.top + "px";
    },

    _getSandboxPosition: function () {
        let sandbox = document.getElementById('sandbox');
        return {
            left: parseFloat(sandbox.style.left),
            top: parseFloat(sandbox.style.top)
        };
    },

    /**
     * Gets the current transform scale
     */
    _getCurrentScale: function () {
        let container = document.getElementById('moving-container');
        if (container.style.transform != "") {
            return parseFloat(container.style.transform.match(/scale\(([1-9\.]+)\)/)[1]);
        } else {
            return 1;
        }
    },

    /**
     * Computes the target transform origin for the given scale based on
     * knowning the current and apparent position of the viewport
     */
    _getTargetOrigin: function (viewport, target_scale, original_scale) {
        let left = parseFloat(viewport.style.left);
        let top = parseFloat(viewport.style.top);
        let apparent_x = left - (original_scale - 1) * this._anchor.left;
        let apparent_y = top - (original_scale - 1) * this._anchor.top;

        let new_x = - ((left - apparent_x) / (target_scale - 1))
        let new_y = - ((top - apparent_y) / (target_scale - 1))
        return {
            left: new_x,
            top: new_y
        };
    },

    /**
     * Gets the target viewport position after zooming
     */
    _getTargetPosition(viewport, original_scale) {
        let left = parseFloat(viewport.style.left);
        let top = parseFloat(viewport.style.top);
        // position which accounts for css scaling
        let apparent_x = left - (original_scale - 1) * this._anchor.left;
        let apparent_y = top - (original_scale - 1) * this._anchor.top;
        let new_x = (2 * apparent_x) - left;
        let new_y = (2 * apparent_y) - top;
        return {
            left: new_x,
            top: new_y
        };
    },

    /**
     * Updates the viewport's position for zoom, needs to account for
     * the shifting sandbox
     */
    _updateViewportPosition: function (viewport, pos, anchor) {
        let new_sandbox_pos = this._getSandboxPosition();
        let shift_x = new_sandbox_pos.left - this._sandboxPos.left;
        let shift_y = new_sandbox_pos.top - this._sandboxPos.top;
        viewport.style.left = (pos.left - shift_x) + "px";
        viewport.style.top = (pos.top - shift_y) + "px";
        viewport.style.transformOrigin = anchor.left + "px " + anchor.top + "px";
    },

    /**
     * When the zoom level changes, we need to shift the viewport to make sure
     * it's in the right place when the new image loads
     */
    _updateViewportForNewScale: function (viewport, target_scale, starting_scale) {
        // Compute new transform origin
        let new_anchor = this._getTargetOrigin(viewport, target_scale, starting_scale);
        // Get the new top/left position
        let new_pos = this._getTargetPosition(viewport, starting_scale)
        // Shift the viewport now.
        this._onZoomInBtnClick();
        this._updateViewportPosition(viewport, new_pos, new_anchor);
        this._anchor = new_anchor;
    },

    /**
     * Enables pinch zoom handling
     * @author Daniel Garcia-Briseno
     */
    _enablePinchZoom: function () {
        this.zoomer = new PinchDetector("helioviewer-viewport");
        // TODO: for debug only
        zoomer = this.zoomer
        let viewport = document.getElementById("moving-container");
        let instance = this;

        // Reference scale is used when the user starts pinching, we'll use this to figure out what
        // the scale should be as they're pinching/stretching
        let reference_scale = 1;

        // Get the screen size which we'll use to figure out how much the user has pinched
        // as a percentage of the screen size.
        let screen_size = Math.hypot(screen.width, screen.height);

        this.zoomer.addPinchStartListener((center) => {
            let current_scale = this._getCurrentScale();
            // When pinch starts, set the reference scale to whatever it the current scale is
            reference_scale = current_scale;
            // Get the sandbox position, since the viewport shifts, we need to account
            // for that
            this._sandboxPos = this._getSandboxPosition();

            // Get the anchor point for the scale
            this._anchor = this._getMovingContainerAnchor(center, current_scale);
            // Set this as the anchor point on the image.
            this._setViewportAnchor(viewport, this._anchor, current_scale);
        });

        this.zoomer.addPinchUpdateListener((pinch_size) => {
            // When the user pinches, get the pinch size as a proportion of the screen size.
            let pinch_power = Math.abs(pinch_size) / screen_size;
            // This factor translates to how much we should scale. If the user's pinch size is half the screen (0.5)
            // then this results in scaling the image by 2x. That 2x is either up or down all depending on if it's a
            // pinch or a stretch
            let scale_factor = 1 + (pinch_power * 3);
            
            // Forward declaration for the scale we're about to calculate
            let css_scale = 1;
            // If the pinch size is below 0, it's a pinch. Otherwise it's a stretch
            if (pinch_size < 0) {
                // Pinches shrink the scale
                css_scale = reference_scale / scale_factor;
            } else {
                // Stretches enlarge the scale
                css_scale = reference_scale * scale_factor;
            }

            // If the image scale is greater than 2x, then we need to trigger an update to load
            // a higher resolution image. For lower scales, don't care since the image is already
            // HD and zooming out doesn't change anything.
            let zoom_in_threshold = 1.5;
            if (css_scale > zoom_in_threshold) {
                // If we can zoom in more, then do it.
                if (this._canZoomIn()) {
                    // White board math shows that to get the appropriate scale for the next image
                    // at the current zoom level, we use this formula.
                    css_scale = css_scale / 2;
                    // Change the new pinch reference to this new zoom.
                    reference_scale = css_scale;
                    // Update the pinch detector to use whatever the current finger distance is as the
                    // new reference point
                    this.zoomer.resetReference();
                    this._updateViewportForNewScale(viewport, css_scale, css_scale * 2);
                } else {
                    // If we can't zoom in any more, cap the zoom at 2.5.
                    // This was chosen experimentally and is an arbitrary value. In theory we could
                    // let the user zoom forever down to the individual pixel, but that's not helpful.
                    if (css_scale > 2.5) {
                        css_scale = 2.5;
                    }
                }
            }

/*
            // Similar logic here for when the user is zooming out
            let zoom_out_threshold = 0.25;
            if (css_scale < zoom_out_threshold) {
                // If we can zoom out, then go ahead and update the zoom out scale
                if (this._canZoomOut()) {
                    this.zoomOutBtn.click();
                    // White board math shows that to get the appropriate scale for the next image
                    // at the current zoom level, we use this formula.
                    css_scale = zoom_out_threshold * 2;
                    // Change the new pinch reference to this new zoom.
                    reference_scale = css_scale;
                    // Update the pinch detector to use whatever the current finger distance is as the
                    // new reference point
                    this.zoomer.resetReference();
                } else {
                    // Limit minimum zoom
                    if (css_scale < 0.25) {
                        css_scale = 0.25;
                    }
                }
            }
            */
            
            // Apply the new css scale on the anchor point
            viewport.style.transform = "scale(" + css_scale + ")";
        });
    }
});
