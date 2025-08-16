export function updateHud(s){
  document.getElementById('score').textContent  = `Score: ${s.score}`;
  document.getElementById('lives').textContent  = `Lives: ${s.lives}`;
  document.getElementById('round').textContent  = `Round: ${s.round}`;
  document.getElementById('streak').textContent = `Streak: ${s.combo} (x${s.multiplier})`;
  const active = [];
  if (s.effects.speedPour>0) active.push('Speed');
  if (s.effects.charm>0)     active.push('Charm');
  if (s.effects.autoCatch>0) active.push('Auto');
  document.getElementById('effects').textContent = active.length ? `Buffs: ${active.join(', ')}` : '';
}

export function setBannerLocked(s, v){ s.bannerLocked = v; }

export function flashBannerEl(s, text){
  if (s.bannerLocked && (!text || !/GAME OVER/.test(text))) return;
  const el = document.getElementById('banner');
  el.textContent = text || '';
  el.classList.add('show');
  if (text && !/PAUSED|GAME OVER/.test(text)){
    setTimeout(()=> { if (!s.bannerLocked) el.classList.remove('show'); }, 1100);
  }
}
