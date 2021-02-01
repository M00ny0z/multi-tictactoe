/*
A class that will programmatically find and select the correct frame of an animation to paint to the screen so that we can animate mario.
    (frames are individual pictures in a sequence of images - e.g., 12 frames per second)
This is a class that work for all of the animations - walking, swimming, idle, etc.
    Each animation have different frameCount, frameDuration, etc.
There is only 2 things that we need to do in this class.
    1. Determine what frame are we one
    2. Paint (draw) that frame
*/
class Animator {
    // xStart & yStart - where in the spritesheet does our animation start (what the first frame of the animation is going to be) (top-left corner)
    // width & height - width and height of the particular frame
    // frameCount - how many frames are there (e.g. simple walk animation for mario is 3)
    // frameDuration - how long should each frame be painted on the canvas before we switch to the next frame (it will help us speed up or slow down of our animation)
    // framePadding - how much padding (empty white space) are there between each frame on the spritesheet
    // reverse - boolean type. make the animation run in reverse order 
    //              way this animator class is going to work is it will pick first frame to be the the leftmost one and then go right side.
    //              (for left walking animation, it might make it doing moonwalking, so reverse is necessary)
    // loop - boolean type. for example, once I've done 3 animations of my walk, I want to start back at the beginning again.
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop) {
        Object.assign(this, { spritesheet, xStart, yStart, height, width, frameCount, frameDuration, framePadding, reverse, loop });

        // the interplay between elapsedTime, totalTime, and frameDuration is how we're going to determine what frame we are on.
        this.elapsedTime = 0;   // keep track of how much time it's been that this animation has been running
        this.totalTime = this.frameCount * this.frameDuration;

    };

    // x & y- top left position on the Canvas (not spritesheet) where we want to draw the image
    // scale - make it draw bigger or smaller
    drawFrame(tick, ctx, x, y, scale) {
        // first thing we do in drawframe when we call it is we advance our elapsedTime by one tick.
        // there is class called Timer. 
        // tick is one tick of this Timer.
        this.elapsedTime += tick;

        // take care of looping.
        // if my loop is done (meaning we've gone past the totalTime), then we will loop back to the beginning (by subtracting the totalTime from elapsedTime).
        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return; // watch video 9 - 13:50
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1; // all I do in the case of reverse is just calculating a new frame
       
        // draw image on the proper location on the canvas
        ctx.drawImage(this.spritesheet,
            // we use frame in the calculation of x pixel in the spritesheet
            this.xStart + frame * (this.width + this.framePadding), this.yStart, //source from sheet
            this.width, this.height,
            x, y,
            this.width * scale, this.height * scale);
        
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Green';
            ctx.strokeRect(x, y, this.width * scale, this.height * scale);
        }
    };

    // Tell us the current frame.
    // (zero-based indexing)
    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};