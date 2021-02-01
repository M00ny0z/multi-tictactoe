class Map {
   constructor() {
      this.state = [[], [], []];
      this.turn = true;
   };

   update() {

   };

   draw(ctx) {
      const textDisplay = this.turn ? "Your turn!" : "Their turn!";
      const textColor = this.turn ? 'blue' : 'red';

      ctx.save();
      // BOARD START X IS 300, BOARD START Y IS 100
      // BOARD END   X IS 800, BOARD END   Y IS 600
      // BLOCKWIDTH IS 175

      ctx.fillRect(300, 250, 500, 25);

      ctx.fillRect(300, 425, 500, 25);

      ctx.fillRect(450, 100, 25, 500);

      ctx.fillRect(625, 100, 25, 500);

      ctx.fillStyle = textColor;
      ctx.font = "30px Arial";
      ctx.fillText(textDisplay, 480, 50);

      //ctx.fillRect(400, 130, 10, 500);
      // ctx.fillRect(800, 130, 10, 500);

      // ctx.fillRect(200, 250, 800, 10);
      // ctx.fillRect(200, 500, 800, 10);

      // ctx.fillStyle = textColor;
      // ctx.font = "30px Arial";
      // ctx.fillText(textDisplay, 550, 50);

      ctx.restore();
   };


}