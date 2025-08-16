import { drawSprite } from '../render/sprites.js';

export default class EmptyGlass{
  constructor(lane, startX){ this.lane=lane; this.w=18; this.h=18; this.x=startX; this.speed=6.0; }
  y(s){ return s.lanesY[this.lane] - this.h/2; }
  update(dt){ this.x -= this.speed * dt; }
  draw(ctx,s){
    const ok = drawSprite(ctx, s.sprites?.empty, this.x, this.y(s), this.w, this.h);
    if (!ok){ ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bad') || '#ff637d'; ctx.fillRect(this.x, this.y(s), this.w, this.h); }
  }
  reachedBar(barX){ return this.x <= barX - 6; }
  offLeft(){ return this.x < -40; }
}

