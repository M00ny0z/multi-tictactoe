class Map {
   constructor(game) {
      this.game = game;
      this.state = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      this.turn = true;
      this.over = false;
      this.winner;

      this.placements = [[{ x: 375, y: 175 }, { x: 550, y: 175 }, { x: 725, y: 175 }],
                         [{ x: 375, y: 350 }, { x: 550, y: 350 }, { x: 725, y: 350 }],
                         [{ x: 375, y: 525 }, { x: 550, y: 525 }, { x: 725, y: 525 }]
                        ];
      // this.placements = [[{ x: 375, y: 175 }, { x: 375, y: 350 }, { x: 375, y: 525 }],
      //                    [{ x: 550, y: 175 }, { x: 550, y: 350 }, { x: 550, y: 525 }],
      //                    [{ x: 725, y: 175 }, { x: 725, y: 350 }, { x: 725, y: 525 }]];
   };

   getState() {
      return this.state;
   };

   update() {
      if (this.game.click) {
         const x = this.game.click.x;
         const y = this.game.click.y;

         if (this.state[y][x] === EMPTY && !this.winner && !this.over) {
            this.state[y][x] = this.turn ? CIRCLE : CROSS;
            this.turn = !this.turn;
            socket.send(JSON.stringify(this.state));
         }

         const winner = this.checkWinner();

         if (winner === 1 || winner === 2) {
            this.winner = winner;
            this.over = true;
         }
         
         if (this.tie() && !winner) {
            this.winner = 0;
            this.over = true;
            this.state = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
         }

      }
   };

   checkWinner() {
      for (let i = 0; i < this.state.length; i++) {
         const currentRow = this.state[i];
         const currentCol = [this.state[0][i], this.state[1][i], this.state[2][i]];
         if (currentRow[0] !== 0 && equals(currentRow)) {
            console.log(currentRow);
            return currentRow[0];
         }

         if (currentCol[0] !== 0 && equals(currentCol)) {
            return currentCol[0];
         }

         if (equals([this.state[2][0], this.state[1][1], this.state[0][2]]) && this.state[2][0] !== 0) {
            return this.state[2][0];
         }

         if (equals([this.state[0][0], this.state[1][1], this.state[2][2]]) && this.state[0][0] !== 0) {
            return this.state[0][0];
         }
      }

      return null;
   };

   tie() {
      let output = true;
      for (let i = 0; i < this.state.length; i++) {
         for (let j = 0; j < 3; j++) {
            output = output && (this.state[i][j] !== 0);
         }
      }
      return output && true;
   }

   draw(ctx) {
      this.drawHeader(ctx);
      if (!this.winner) {
         this.drawBoard(ctx);
         this.drawMarks(ctx);
         this.drawShadow(ctx);
      }
   };

   drawHeader(ctx) {
      ctx.save();

      let textDisplay = this.turn ? "Your turn!" : "Their turn!";
      let textColor = this.turn ? 'blue' : 'red';

      if (this.over) {
         textDisplay = this.winner === 1 ? "You won!" : "You lost :(";
         textColor = this.winner === 1 ? 'green' : 'red';
         if (this.winner === 0) {
            textDisplay = "Tie";
            textColor = 'blue';         
         }
      }

      ctx.fillStyle = textColor;
      ctx.font = "30px Arial";
      ctx.fillText(textDisplay, 480, 50);

      ctx.restore();
   };

   drawMarks(ctx) {
      for (let i = 0; i < this.state.length; i++) {
         for (let j = 0; j < 3; j++) {
            const currentMark = this.state[i][j];
            const x = this.placements[i][j].x;
            const y = this.placements[i][j].y;
            if (currentMark === CIRCLE) {
               this.drawCircle(ctx, x, y);
            } else if (currentMark === CROSS) {
               this.drawCross(ctx, x, y);
            }
         }
      }
   };

   drawShadow(ctx) {
      if (this.game.mouse && this.state[this.game.mouse.y][this.game.mouse.x] === 0) {
         const mouse = this.game.mouse;
         const x =  this.placements[mouse.y][mouse.x].x;
         const y = this.placements[mouse.y][mouse.x].y;

         ctx.save();

         ctx.globalAlpha = 0.2;
         if (this.turn) {
            this.drawCircle(ctx, x, y);
         } else {
            this.drawCross(ctx, x, y);
         }

         ctx.restore();
      }
   };

   drawCircle(ctx, x, y) {
      ctx.save();
      
      if (this.isFake) {
         ctx.globalAlpha = 0.2;
      }
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.restore();
   };

   drawCross(ctx, x, y) {
      ctx.save();

      if (this.isFake) {
         ctx.globalAlpha = 0.2;
      }

      ctx.lineWidth = 15;
      ctx.font = "125px Arial";
      ctx.fillText("X", x - 40, y + 40);

      ctx.restore();
   };

   drawBoard(ctx) {
      ctx.save();
      // BOARD START X IS 300, BOARD START Y IS 100
      // BOARD END   X IS 800, BOARD END   Y IS 600
      // BLOCKWIDTH IS 175

      ctx.fillRect(300, 250, 500, 25);

      ctx.fillRect(300, 425, 500, 25);

      ctx.fillRect(450, 100, 25, 500);

      ctx.fillRect(625, 100, 25, 500);

      ctx.restore();
   };


}