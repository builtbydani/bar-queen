import { BAR_X } from '../core/constants.js';
import { drawSprite } from '../render/sprites.js';

export default class Player{
  constructor(){ this.lane=0; this.w=36; this.h=36; this.x = BAR_X - this.w; }
  y(s){ return s.lanesY[this.lane] - this.h/2; }
  draw(ctx,s){
    const ok = drawSprite(ctx, s.sprites?.player, this.x, this.y(s), this.w, this.h);
    if (ok) return;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--p1') || '#ff68c6';
    ctx.fillRect(this.x, this.y(s), this.w, this.h);
  }
}

