/**
 * Custom filter to make fully black pixels transparent.
 * This makes the occulter on LASCO images transparent.
 */
function TransparentBlackPixels(ctx, done) {
    let imgData = ctx.getImageData(
        0, 0, ctx.canvas.width, ctx.canvas.height);
    let pixels = imgData.data;
    for (var i = 0; i < pixels.length; i += 4) {
        if ((pixels[i] <= 1) && (pixels[i+1] <= 1) && (pixels[i+2] <= 1)) {
            pixels[i + 3] = 0;
        }
    }
    ctx.putImageData(imgData, 0, 0);
    done();
}