import { cssVar } from '../utils/css.js';
export default class PowerToken{
  constructor(lane, startX){
    this.lane=lane; this.x=startX; this.w=18; this.h=18; this.speed=5.5;
    this.kind = ['speed','charm','auto'][Math.floor(Math.random()*3)];
  }
  y(s){ return s.lanesY[this.lane] - this.h/2 - 24; }
  update(dt){ this.x -= this.speed * dt; }
  draw(ctx,s){
    ctx.fillStyle = cssVar('--pow','#a78bfa');
    ctx.fillRect(this.x, this.y(s), this.w, this.h);
    ctx.fillStyle = '#000';
    ctx.font = '10px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(this.kind[0].toUpperCase(), this.x+this.w/2, this.y(s)+this.h/2);
  }
  reachedBar(barX){ return this.x <= barX - 6; }
  offLeft(){ return this.x < -40; }
}
