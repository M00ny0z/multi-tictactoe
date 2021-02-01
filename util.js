// returns a random integer between 0 and n-1
function randomInt(n) {
    return Math.floor(Math.random() * n);
};

// returns a string that can be used as a rgb web color
function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
};

// const drawHealthbar = (ctx, percent) => {
//     ctx.save();

//     ctx.strokeStyle = 'gray';
//     ctx.strokeRect(4, 4, 100, 15);
//     ctx.fillStyle = percent > 50 ? 'green' : 'red';
//     ctx.fillRect(this.x - 10, this.y - 20, 98 * (percent / 100), 13);

//     ctx.restore();
//  };

// returns a string that can be used as a hsl web color
function hsl(h, s, l) {
    return "hsl(" + h + "," + s + "%," + l + "%)";
};

// creates an alias for requestAnimationFrame for backwards compatibility
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// add global parameters here

var PARAMS = {
    DEBUG: true
};