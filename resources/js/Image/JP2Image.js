/**
 * @fileOverview JP2 Image class
 * @author <a href="mailto:keith.hughitt@nasa.gov">Keith Hughitt</a>
 */
/*jslint browser: true, white: true, onevar: true, undef: true, nomen: false, eqeqeq: true, plusplus: true,
bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxlen: 120, sub: true */
/*global Class, $ */
"use strict";
var JP2Image = Class.extend(
    /** @lends JP2Image.prototype */
    {

    /**
     * @constructs
     */
    init: function (hierarchy, sourceId, date, difference, onChange) {
        this.hierarchy   = hierarchy;
        this.sourceId    = sourceId;
        this.requestDate = date;
        this.difference  = difference;
        this._onChange   = onChange;

        this._requestImage();
    },

    /**
     * Loads the closest image in time to that requested
     */
    _requestImage: function () {
        var params, dataType, source_id;

        var switchSources = false;
		if(outputType == 'minimal'){
			switchSources = true;
		}

        params = {
            action:   'getClosestImage',
            sourceId: this.sourceId,
            date:     this.requestDate.toISOString(),
            difference:this.difference,
            switchSources:switchSources
        };
        $.get(Helioviewer.api, params, $.proxy(this._onImageLoad, this), Helioviewer.dataType);
    },

    /**
     * Changes image data source
     */
    updateDataSource: function (hierarchy, sourceId, difference) {
        this.hierarchy = hierarchy;
        this.sourceId  = sourceId;
        this.difference= difference;

        this._requestImage();
    },

    /**
     * Updates time and loads closest match
     */
    updateTime: function (requestDate) {
        this.requestDate = requestDate;
        this._requestImage();
    },

    /**
     * Checks to see if image has been changed and calls event-handler passed in during initialization
     * if a new image should be displayed.
     *
     * The values for offsetX and offsetY reflect the x and y coordinates with the origin
     * at the bottom-left corner of the image, not the top-left corner.
     */
    _onImageLoad: function (result) {
        $.extend(this, result);

        // Reference pixel offset at the original JP2 image scale (with respect to top-left origin)
        this.offsetX =   parseFloat((this.refPixelX - (this.width  / 2)).toPrecision(8));
        this.offsetY = - parseFloat((this.refPixelY - (this.height / 2)).toPrecision(8));

        // Image details in Helioprojective coordinates
        let arcWidth = this.width * this.scale;
        let arcHeight = this.height * this.scale;
        let arcOffset = { x: this.offsetX * this.scale, y: this.offsetY * this.scale };
        this.coordinate = {
            width: arcWidth,
            height: arcHeight,
            x: -(arcWidth / 2) - arcOffset.x,
            y: -(arcHeight / 2) - arcOffset.y,
        };

        this._onChange();
    },

    getLayerName: function () {
        var layerName = '';
        $.each( this.hierarchy, function (uiOrder, obj) {
            layerName += obj['name'] + ',';
        });
        return layerName.substring(0, layerName.length-1);
    },

    getSourceId: function () {
        return this.sourceId;
    }
});