import { BAR_X } from '../core/constants.js';
import { addScore, addStreak, loseLife } from './scoring.js';
import EmptyGlass from '../entities/EmptyGlass.js';
import Drink from '../entities/Drink.js';
import PowerToken from '../entities/PowerToken.js';
import { applyPower } from './effects.js';
import { endRound } from './rounds.js';

export function serveDrink(s){
  if (s.paused || s.over || s.inIntermission || (s.mini && s.mini.active)) return;
  const boost = s.effects.speedPour>0 ? 3.0 : 0.0;
  s.entities.drinks.push(new Drink(s.entities.player.lane, boost, BAR_X));
}

function frontMostInLane(s, lane){
  const list = s.entities.patrons.filter(p=>p.lane===lane && p.dir===+1);
  if (!list.length) return null;
  return list.reduce((a,b)=> (a.x<b.x ? a : b));
}

export function updateSystems(s, dt){
  // Allow movement/serve (input module set this)
  if (!(s.mini && s.mini.active)) s.handleInput?.();

  // movement
  const slow = s.effects.charm>0 ? 0.7 : 1.0;
  for (const p of s.entities.patrons) p.update(dt, slow);
  for (const d of s.entities.drinks)  d.update(dt);
  for (const e of s.entities.empties) e.update(dt);
  for (const t of s.entities.tokens)  t.update(dt);

  // ----- Drink → Patron -----
  for (let i=s.entities.drinks.length-1; i>=0; i--){
    const d = s.entities.drinks[i];
    const front = frontMostInLane(s, d.lane);
    if (!front){
      if (d.offRight(s.canvas.width)){ s.entities.drinks.splice(i,1); loseLife(s,'Spilled drink'); }
      continue;
    }
    if (d.x + d.w >= front.frontX()){
      // Serve!
      s.entities.drinks.splice(i,1);
      addStreak(s);

      if (front.type==='VIP'){
        addScore(s, 120);
        front.drinksNeeded--;
        s.entities.empties.push(new EmptyGlass(d.lane, Math.max(front.frontX(), d.x)));
        if (Math.random()< (s.vipUnlocked?0.04:0.03)) s.entities.tokens.push(new PowerToken(d.lane, front.frontX()));
        if (front.drinksNeeded<=0){
          front.served = true; front.dir = -1; addScore(s, 180);
        }
      } else {
        addScore(s, 100);
        front.served = true; front.dir = -1;
        s.entities.empties.push(new EmptyGlass(d.lane, Math.max(front.frontX(), d.x)));
        if (Math.random()< (s.vipUnlocked?0.04:0.03)) s.entities.tokens.push(new PowerToken(d.lane, front.frontX()));
      }
    }
  }

  // ----- Empties → catch/miss (Auto-catch magnet) -----
  for (let i=s.entities.empties.length-1; i>=0; i--){
    const e = s.entities.empties[i];
    const auto = s.effects.autoCatch>0;
    const autoCatchX = BAR_X + 24;

    if ((auto && e.x <= autoCatchX) || e.reachedBar(BAR_X)){
      if (auto || s.entities.player.lane === e.lane){ addScore(s, 25); }
      else { loseLife(s, 'Missed empty glass'); }
      s.entities.empties.splice(i,1);
      continue;
    }
    if (e.offLeft()) s.entities.empties.splice(i,1);
  }

  // ----- Power tokens -----
  for (let i=s.entities.tokens.length-1; i>=0; i--){
    const t = s.entities.tokens[i];
    if (t.reachedBar(BAR_X)){
      if (s.entities.player.lane === t.lane) applyPower(s, t.kind);
      s.entities.tokens.splice(i,1);
    } else if (t.offLeft()){
      s.entities.tokens.splice(i,1);
    }
  }

  // ----- Patrons reaching/exit -----
  for (let i=s.entities.patrons.length-1; i>=0; i--){
    const p = s.entities.patrons[i];
    if (p.dir===+1 && p.reachedBar(BAR_X)){ s.entities.patrons.splice(i,1); loseLife(s,'Thirsty patron'); }
    else if (p.dir===-1 && p.leftScreen(s.canvas.width)){ s.entities.patrons.splice(i,1); }
  }

  // cleanup stray drinks
  for (let i=s.entities.drinks.length-1; i>=0; i--){
    if (s.entities.drinks[i].offRight(s.canvas.width)) s.entities.drinks.splice(i,1);
  }

  // Round end?
  if (!s.inIntermission &&
      s.roundConfig.spawned >= s.roundConfig.total &&
      s.entities.patrons.filter(p=>p.dir===+1).length===0 &&
      s.entities.drinks.length===0 && s.entities.empties.length===0 && s.entities.tokens.length===0){
    endRound(s);
  }
}
