import { cssVar } from '../utils/css.js';
import { beginRound } from './rounds.js';

export class MiniGame{
  constructor(s){
    this.s = s;
    this.active = true;
    this.phase = 'setup';         // setup -> shuffling -> guess -> reveal -> done
    this.cups = [0,1,2];
    this.ballIndex = Math.floor(Math.random()*3);
    this.timer = 0;
    this.shuffleTime = 2000;
    this.swapInterval = 220;
    this.nextSwap = 0;
    this.result = null;

    // centered positions
    const cx = s.canvas.width/2, cy = s.canvas.height/2, d = 140;
    this.pos = [{x:cx-d,y:cy},{x:cx,y:cy},{x:cx+d,y:cy}];

    this.bannerShown = false;
  }

  update(dtMs){
    if (!this.active) return;
    if (this.phase==='setup'){
      if (!this.bannerShown){ document.getElementById('banner').classList.add('show'); document.getElementById('banner').textContent='Bonus Mini-Game!\nWatch the cups…'; this.bannerShown=true; }
      this.timer += dtMs;
      if (this.timer > 600){ this.timer=0; this.phase='shuffling'; this.nextSwap=0; }
    } else if (this.phase==='shuffling'){
      this.timer += dtMs;
      if (this.timer >= this.nextSwap){
        this.swapRandom(); this.nextSwap += this.swapInterval;
      }
      if (this.timer >= this.shuffleTime){
        this.phase = 'guess';
        const b = document.getElementById('banner'); b.textContent='Pick a cup! (1/2/3 or click)';
        b.classList.add('show');
        setTimeout(()=> b.classList.remove('show'), 1100);
      }
    } else if (this.phase==='reveal'){
      this.timer += dtMs;
      if (this.timer >= 900){ this.phase='done'; }
    }
  }

  draw(ctx,s){
    // solid centered panel
    ctx.fillStyle = '#000';
    const w=s.canvas.width*.5,h=s.canvas.height*.5,x=s.canvas.width*.25,y=s.canvas.height*.25;
    ctx.fillRect(x,y,w,h);

    // cups
    for (let i=0;i<3;i++){ const {x:cx,y:cy}=this.pos[i]; this.drawCup(ctx,cx,cy,i); }
  }

  drawCup(ctx,x,y,i){
    // base cup
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--cup') || '#ffdca8';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x-40, y-60, 80, 100, 12);
    ctx.fill(); ctx.stroke();

    // number
    ctx.fillStyle = '#000';
    ctx.font='bold 20px system-ui';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(String(i+1), x, y+4);

    // show ball during setup (peek) and reveal
    if ((this.phase==='setup' || this.phase==='reveal') && i===this.ballIndex){
      ctx.fillStyle = cssVar('--ball', '#ff0000');
      ctx.beginPath(); ctx.arc(x, y+40, 14, 0, Math.PI*2); ctx.fill();
    }
  }

  swapRandom(){
    const a = Math.floor(Math.random()*3);
    let b = Math.floor(Math.random()*3); if (b===a) b=(b+1)%3;
    const tmp = this.pos[a]; this.pos[a]=this.pos[b]; this.pos[b]=tmp;
    if (this.ballIndex===a) this.ballIndex=b; else if (this.ballIndex===b) this.ballIndex=a;
  }

  handlePick(index){
    if (!this.active || this.phase!=='guess') return;
    this.phase='reveal';
    this.result = (index===this.ballIndex);
    const b = document.getElementById('banner');
    b.textContent = this.result ? '+300 Bonus!' : '+50 Consolation';
    b.classList.add('show'); setTimeout(()=> b.classList.remove('show'),1100);
    this.s.score += this.result ? 300 : 50;
  }

  hitTest(x,y){
    for (let i=0;i<3;i++){
      const r=this.pos[i];
      if (x>=r.x-40 && x<=r.x+40 && y>=r.y-60 && y<=r.y+40) return i;
    }
    return -1;
  }
}

// tick + schedule next round when done
export function miniTick(s, dtMs){
  if (!(s.mini && s.mini.active)) return;
  s.mini.update(dtMs);
  if (s.mini.phase==='done'){
    s.mini.active=false;
    s.intermissionTimeout = setTimeout(()=>{
      if (s.over) return;
      s.inIntermission=false;
      s.mini=null;
      beginRound(s, s.round+1);
    }, s.intermissionTime);
  }
}
