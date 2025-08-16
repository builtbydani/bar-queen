import { drawSprite } from '../render/sprites.js';

export default class Drink{
  constructor(lane, speedBoost=0, barX){ this.lane=lane; this.w=20; this.h=20; this.x=barX; this.baseSpeed=7.0; this.speedBoost=speedBoost; }
  y(s){ return s.lanesY[this.lane] - this.h/2; }
  update(dt){ this.x += (this.baseSpeed + this.speedBoost) * dt; }
  draw(ctx,s){
    const ok = drawSprite(ctx, s.sprites?.drink, this.x, this.y(s), this.w, this.h);
    if (!ok){ ctx.fillStyle = '#ffe066'; ctx.fillRect(this.x, this.y(s), this.w, this.h); }
  }
  offRight(canvasW){ return this.x > canvasW + 20; }
}

