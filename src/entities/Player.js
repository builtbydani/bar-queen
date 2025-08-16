import { BAR_X } from '../core/constants.js';

export default class Player{
  constructor(){ this.lane=0; this.w=36; this.h=36; this.x = BAR_X - this.w; }
  y(s){ return s.lanesY[this.lane] - this.h/2; }
  draw(ctx,s){
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--p1') || '#ff68c6';
    ctx.fillRect(this.x, this.y(s), this.w, this.h);
  }
}
