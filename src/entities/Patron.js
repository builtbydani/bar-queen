import { SIZE } from '../core/constants.js';
import { drawSprite } from '../render/sprites.js';

export default class Patron{
  constructor(lane, speed, canvasW, isVIP=false, drinksNeeded=1){
    this.type = isVIP ? 'VIP' : 'REG';
    this.lane = lane;
    this.w = SIZE.PATRON; this.h = SIZE.PATRON;
    this.x = canvasW - 70;
    this.dir = +1;
    this.baseSpeed = speed; this.speed = speed;
    this.served=false;
    this.drinksNeeded = drinksNeeded;
    if (isVIP) this.drinksNeededMax = drinksNeeded;
  }
  frontX(){ return this.x; }
  y(s){ return s.lanesY[this.lane] - this.h/2; }
  update(dt, slowMult=1){ this.x += (this.dir===+1 ? -this.speed*slowMult : (this.speed+0.4)) * dt; }
  draw(ctx,s){
    const key = this.type==='VIP' ? 'patron_vip' : 'patron_reg';
    const ok = drawSprite(ctx, s.sprites?.[key], this.x, this.y(s), this.w, this.h);
    if (!ok){
      ctx.fillStyle = this.type==='VIP' ? '#fca5a5' : (this.served ? '#7cfcc3' : '#4ad9ff');
      ctx.fillRect(this.x, this.y(s), this.w, this.h);
    }
    if (this.type==='VIP'){
      ctx.fillStyle = '#0009'; ctx.fillRect(this.x, this.y(s)-10, this.w, 6);
      ctx.fillStyle = '#ffd166';
      const pct = (this.drinksNeededMax - this.drinksNeeded) / this.drinksNeededMax;
      ctx.fillRect(this.x, this.y(s)-10, this.w*Math.max(0,pct), 6);
    }
  }
  reachedBar(barX){ return this.frontX() <= barX; }
  leftScreen(canvasW){ return this.x >= canvasW + 80; }
}

