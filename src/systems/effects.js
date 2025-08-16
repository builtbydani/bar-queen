export function tickEffects(s){
  for (const k of Object.keys(s.effects)){
    if (s.effects[k]>0) s.effects[k]--;
  }
}
export function applyPower(s, kind){
  if (kind==='speed') s.effects.speedPour = 10*60;
  if (kind==='charm') s.effects.charm     = 8*60;
  if (kind==='auto')  s.effects.autoCatch = 6*60;
}
