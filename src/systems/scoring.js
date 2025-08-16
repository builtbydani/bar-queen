import { VIP_UNLOCK_SCORE, MAX_MULT } from '../core/constants.js';
import { updateHud } from '../render/hud.js';
import { gameOver } from './rounds.js';

export function addScore(s, base){
  const gain = base * s.multiplier;
  s.score += gain;
  if (!s.vipUnlocked && s.score >= VIP_UNLOCK_SCORE) s.vipUnlocked = true;
  updateHud(s);
}
export function addStreak(s){
  s.combo++;
  s.multiplier = Math.max(1, Math.min(MAX_MULT, 1 + Math.floor(s.combo/5)));
  updateHud(s);
}
export function resetStreak(s){
  s.combo = 0;
  s.multiplier = 1;
  updateHud(s);
}
export function loseLife(s, why=''){
  s.lives--;
  resetStreak(s);
  if (s.lives<=0) gameOver(s, why || 'You got 86’d');
  updateHud(s);
}
