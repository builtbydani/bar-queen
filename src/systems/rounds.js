import { updateHud, flashBannerEl, setBannerLocked } from '../render/hud.js';

export function beginRound(s, round){
  s.round = round;
  const total   = 10 + Math.min(20, round*4);
  const cadence = Math.max(650, 1200 - round*80);
  const baseSpeed = 1.4 + round*0.07;

  s.roundConfig = { total, spawned:0, cadence, baseSpeed };
  s.inIntermission = false;
  s.nextSpawnAt = performance.now() + 400;
  flashBannerEl(s, `Round ${round} — “Shifts changing!”`);
  updateHud(s);
}

export function endRound(s){
  s.inIntermission = true;
  const bonus = Math.min(500, 100 + s.round*50);
  s.score += bonus;
  updateHud(s);
  flashBannerEl(s, `Round ${s.round} complete! (+${bonus} bonus)`);

  // Start mini-game during intermission; scheduling of next round happens inside miniTick when done.
  import('./miniGame.js').then(mod=>{
    s.mini = new mod.MiniGame(s);
  });
}

export function gameOver(s, reason){
  s.over = true;
  if (s.intermissionTimeout){ clearTimeout(s.intermissionTimeout); s.intermissionTimeout = null; }
  setBannerLocked(s, true);
  flashBannerEl(s, `GAME OVER — ${reason}\nPress R to restart`);
}
