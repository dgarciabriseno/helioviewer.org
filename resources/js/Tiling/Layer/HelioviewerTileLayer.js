/**
 * @fileOverview Contains the class definition for a HelioviewerTileLayer class.
 * @author <a href="mailto:jeff.stys@nasa.gov">Jeff Stys</a>
 * @author <a href="mailto:keith.hughitt@nasa.gov">Keith Hughitt</a>
 * @author <a href="mailto:patrick.schmiedel@gmx.net">Patrick Schmiedel</a>
 * @see TileLayerAccordion, Layer
 * @requires Layer
 *
 */
/*jslint browser: true, white: true, onevar: true, undef: true, nomen: false, eqeqeq: true, plusplus: true,
bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxlen: 120, sub: true */
/*global Class, Layer, $, JP2Image, Image, console, getUTCTimestamp, TileLayer,
    TileLoader, tileCoordinatesToArcseconds, Helioviewer */
"use strict";
var HelioviewerTileLayer = TileLayer.extend(
    /** @lends HelioviewerTileLayer.prototype */
    {
    /**
     * @constructs
     * @description Creates a new TileLayer
     * @param {Object} viewport Viewport to place the tiles in
     * <br>
     * <br><div style='font-size:16px'>Options:</div><br>
     * <div style='margin-left:15px'>
     *      <b>type</b>        - The type of the layer (used by layer manager to differentiate event vs.
     *                           tile layers)<br>
     *      <b>tileSize</b>    - Tilesize to use<br>
     *      <b>source</b>      - Tile source ["database" | "filesystem"]<br>
     *      <b>opacity</b>     - Default opacity<br>
     * </div>
     */
    init: function (index, date, tileSize, viewportScale, tileVisibilityRange,
        hierarchy, sourceId, name, visible, opacity, difference, diffCount, diffTime, baseDiffTime, layeringOrder, order, viewer) {

        this.sourceId = sourceId;

        /** @type {OpenSeadragon.Viewer} */
        this.viewer = viewer;

		// Create a random id which can be used to link tile layer with its corresponding tile layer accordion entry
        var id = "tile-layer-" + new Date().getTime();

        this._super(index, date, tileSize, viewportScale, tileVisibilityRange,
            name, visible, opacity, difference, diffCount, diffTime, baseDiffTime, id);

        this.id = id;
        this.order = order;
        this.opacity = opacity;

        this._setupEventHandlers();

        $(document).trigger("create-tile-layer-accordion-entry",
            [index, this.id, name, sourceId, hierarchy, date, true, opacity, visible,
             $.proxy(this.setOpacity, this),
             this.difference, this.diffCount, this.diffTime, this.baseDiffTime,
             $.proxy(this.setDifference, this), $.proxy(this.setDiffCount, this), $.proxy(this.setDiffTime, this), $.proxy(this.setDiffDate, this)
            ]
        );

        this.tileLoader = new TileLoader(this.domNode, tileSize, tileVisibilityRange);

        this.image = new JP2Image(hierarchy, sourceId, date, difference, $.proxy(this.onLoadImage, this));
    },

    getImageUrl: function() {
        return helioviewer.serverSettings.imageServer + this.image.file + "/info.json";
    },

    /**
     * Removes the tile from the DOM and Image Viewer
     * TODO(Dragon): The DOM version should be removed so only the viewer is done here.
     */
    remove: function() {
        this.domNode.remove();
        this.removeFromViewer();
    },

    removeFromViewer: function () {
        if (this.layer) {
            this.viewer.world.removeItem(this.layer);
        }
    },

    /**
     * onLoadImage
     */
    onLoadImage: async function () {
        this.loaded = true;
        this.layeringOrder = this.image.layeringOrder;
        this.sourceId = this.image.sourceId;

        this._loadStaticProperties();
        this._updateDimensions();

        // Add this image to the openseadragon viewport
        let imageUrl = this.getImageUrl();
        let iiifData = (await (await fetch(imageUrl)).json());
        iiifData["preferredFormats"] = ["png"];

        // Remove the old item from the viewer
        // Note, addTiledImage has a replace option, but this only works if
        // if the image has already been added and is being replaced. It
        // asserts when used for adding a layer that isn't already there.
        this.removeFromViewer();
        // Add the new tile to the viewer.
        this.viewer.addTiledImage({
            tileSource: iiifData,
            url: imageUrl,
            index: -this.order,
            x: this.image.coordinate.x,
            y: this.image.coordinate.y,
            width: this.image.coordinate.width,
            opacity: this.opacity / 100,
            success: (e) => {
                this.layer = e.item;
                this._applyColorTable();
            }
        });

        if (this.visible) {
            this.tileLoader.reloadTiles(false);

            // Update viewport sandbox if necessary
            $(document).trigger("tile-layer-finished-loading", [this.getDimensions()]);
        }

        $(document).trigger("update-tile-layer-accordion-entry",
                            [this.id, this.name, this.image.getSourceId(),
                             this.opacity,
                             new Date(getUTCTimestamp(this.image.date)),
                             this.image.id, this.image.hierarchy, this.image.name,
                             this.difference, this.diffCount, this.diffTime, this.baseDiffTime]);
    },

    /**
     * Preloads a tile for the next zoom level
     * @param {Event} event The event that was dispatched to execute this function
     * @param {bool} zoom If true, then uses the next zoom image scale, if false uses the next zoom-out image scale
     * @param {number} x X tile
     * @param {number} y Y tile
     */
    preloadTile: function (event, zoom, x, y) {
        let scale = zoom ? this.viewportScale / 2 : this.viewportScale * 2;
        let url = this.getTileURL(x, y, scale);
        // Only preload if the image isn't already cached/preloaded
        let preloaded = document.querySelectorAll("[href='"+url+"']");
        if (preloaded.length == 0) {
            // Create preload <link> element to tell the browser to cache the image
            let preloader = document.createElement("link");
            preloader.rel = "preload";
            preloader.as = "image";
            preloader.href = url;
            document.body.appendChild(preloader);
        }
    },

    _applyColorTable: function () {
        if (this.sourceId in ColorMaps) {
            let processors = [
                OpenSeadragon.Filters.COLORMAP(ColorMaps[this.sourceId], 128)
            ];
            if (ApplyTransparency.indexOf(this.sourceId) != -1) {
                processors.push(TransparentBlackPixels);
            }
            // Get existing filters
            let filters = this.viewer.getFilters();
            // Add new filter for this layer
            filters.unshift({
                items: [this.layer],
                processors: processors
            });
            // Re-apply filters
            this.viewer.setFilterOptions({
                filters: filters
            });
        }
    },

    /**
     * Returns a formatted string representing a query for a single tile
     */
    getTileURL: function (x, y, scale) {
        var baseDiffTimeStr = this.baseDiffTime;
        if(typeof baseDiffTimeStr == 'number' || baseDiffTimeStr == null){
			baseDiffTimeStr = $('#date').val()+' '+$('#time').val();
		}

        baseDiffTimeStr = formatLyrDateString(baseDiffTimeStr);

		// If scale is given via input, then let it override the global viewport scale
        let imageScale = (scale == undefined) ? this.viewportScale : scale;
        // Limit the scale to 6 decimal places so that the excess precision digits don't break caching
        imageScale = imageScale.toFixed(6);

        var params = {
            "action"      : "getTile",
            "id"          : this.image.id,
            "imageScale"  : imageScale,
            "x"           : x,
            "y"           : y,
            "difference"  : this.difference,
            "diffCount"   : this.diffCount,
            "diffTime"    : this.diffTime,
            "baseDiffTime": baseDiffTimeStr
        };

        return Helioviewer.api + "?" + $.param(params);
    },

    /**
     * @description Returns a JSON representation of the tile layer for use by the UserSettings manager
     * @return JSON A JSON representation of the tile layer
     */
    toJSON: function () {
        var return_array = {};

        return_array['uiLabels'] = Array();
        $.each( this.image.hierarchy, function(uiOrder, obj) {
            return_array['uiLabels'][uiOrder] = { 'label': obj['label'],
                                                  'name' : obj['name'] };
            return_array[obj['label']] = obj['name'];
        });

		if(typeof this.baseDiffTime == 'number' || this.baseDiffTime == null){
			this.baseDiffTime = $('#date').val()+' '+$('#time').val();
		}

        return_array['visible']  = this.visible;
        return_array['opacity']  = this.opacity;
        return_array['difference'] = this.difference;
        return_array['diffCount'] = this.diffCount;
        return_array['diffTime']  = this.diffTime;
        return_array['baseDiffTime']  = this.baseDiffTime;

        return return_array;
    },

    /**
     * @description Sets up event-handlers to deal with viewport motion
     */
    _setupEventHandlers: function () {
        $(this.domNode).bind('get-tile', $.proxy(this.getTile, this));
        $(this.domNode).bind('preload-tile', $.proxy(this.preloadTile, this));
        $(document).bind('toggle-layer-visibility', $.proxy(this.toggleVisibility, this));
    },

    setLayerOrder: function (order) {
        this.order = order;
        if (this.layer) {
            this.viewer.world.setItemIndex(this.layer, this.viewer.world.getItemCount() - order);
        }
    },

    /**
     * Sets this layer opacity.
     * @param {number} opacity Value between 0 and 100.
     */
    setOpacity: function (opacity) {
        if (this.layer) {
            this.opacity = opacity;
            if (this.visible) {
                this.layer.setOpacity(opacity / 100);
            }
        }
    },

    setVisibility: function (visible) {
        this.visible = visible;
        if (!visible) {
            this.layer.setOpacity(0);
        } else {
            this.layer.setOpacity(this.opacity / 100);
        }
    },
});
