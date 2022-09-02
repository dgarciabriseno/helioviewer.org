/**
 * @fileOverview Contains the class definition for the Sandbox class.
 * @author <a href="mailto:keith.hughitt@nasa.gov">Keith Hughitt</a>
 * @author <a href="mailto:jaclyn.r.beck@gmail.com">Jaclyn Beck</a>
 */
/*jslint browser: true, white: true, onevar: true, undef: true, nomen: false, eqeqeq: true, plusplus: true, 
bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxlen: 120, sub: true */
/*global Class, $, document, window */
"use strict";
var SandboxHelper = Class.extend(
    /** @lends Sandbox.prototype */
    {
    init: function (x, y) {
        this.domNode = $("#sandbox");
        this.movingContainer = $("#moving-container");
        this.domNode.css({"left": x, "top": y});
    },

    /**
     * Find the center of the sandbox and put the movingContainer there
     */
    center: function () {
        var top, left;
        
        //Get ViewPort size offset
        var heightOffset = $(window).height();
        var widthOffset = $(window).width();
        
        left = 0.5 * this.domNode.width();
        top  = 0.5 * this.domNode.height();

        this.moveContainerTo(left, top);
    },
        
    /**
     * Find the center of the sandbox
     */
    getCenter: function () {
        //Get ViewPort size offset
        var heightOffset = $(window).height();
        var widthOffset = $(window).width();
        
        return {
            x: 0.5 * this.domNode.width(), 
            y: 0.5 * this.domNode.height()
        };
    },
        
    /**
     * Called when the viewport has moved or resized. Calculates the difference 
     * between current sandbox's size and position and desired sandbox size,
     * and updates the css accordingly. Also repositions the movingContainer.
     */
    updateSandbox: function (viewportCenter, desiredSandboxSize, pinching) {
        var change, oldCenter, newCenter, newHCLeft, newHCTop, containerPos;

        oldCenter = this.getCenter();
        
        //Get ViewPort size offset
        var heightOffset = $(window).height();
        var widthOffset = $(window).width();
        
        
        // Update sandbox dimensions
        let oldLeft = this.domNode.css('left');
        let oldTop = this.domNode.css('top');
        let left = pinching ? oldLeft : (viewportCenter.x - ( widthOffset * 0.5 ) ) - (0.5 * desiredSandboxSize.width) + 'px';
        let top  = pinching ? oldTop : (viewportCenter.y - ( heightOffset * 0.5 ) ) - (0.5 * desiredSandboxSize.height) + 'px';
        this.domNode.css({
            width  : (desiredSandboxSize.width + widthOffset)  + 'px',
            height : (desiredSandboxSize.height + heightOffset) + 'px',
            left   : left,
            top    : top
        });

        if (!pinching) {
            newCenter = this.getCenter();

            // Difference
            change = {
                x: newCenter.x - oldCenter.x,
                y: newCenter.y - oldCenter.y
            };

            if (Math.abs(change.x) < 0.01 && Math.abs(change.y) < 0.01) {
                return;
            }
            containerPos = this.movingContainer.position();

            // Update moving container position
            newHCLeft = Math.max(0, Math.min(desiredSandboxSize.width,  containerPos.left + change.x));
            newHCTop  = Math.max(0, Math.min(desiredSandboxSize.height, containerPos.top  + change.y));
     
            this.moveContainerTo(newHCLeft, newHCTop);
        }
    },
        
    moveContainerTo: function (x, y) {
        this.movingContainer.css({left: x, top: y});
    }
});
