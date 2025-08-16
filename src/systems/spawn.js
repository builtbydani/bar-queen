import { chance, rand } from '../utils/math.js';
import Patron from '../entities/Patron.js';

export function spawnTick(s){
  const now = performance.now();
  if (s.roundConfig.spawned >= s.roundConfig.total) return;
  if (now < s.nextSpawnAt) return;

  // balance lanes: fewer approaching patrons get priority
  const counts = s.lanesY.map((_,i)=> s.entities.patrons.filter(p=>p.lane===i && p.dir===+1).length);
  let lane = counts.indexOf(Math.min(...counts));
  if (Math.random() < 0.35) lane = Math.floor(Math.random()*s.lanesY.length);

  const vip = s.vipUnlocked && chance(0.18);
  const drinksNeeded = vip ? (Math.random()<0.5 ? 2 : 3) : 1;

  const speed = s.roundConfig.baseSpeed + rand(-0.1, 0.3) + 0.03*(s.round-1);
  s.entities.patrons.push(new Patron(lane, speed, s.canvas.width, vip, drinksNeeded));

  s.roundConfig.spawned++;
  s.nextSpawnAt = now + s.roundConfig.cadence + rand(-120,160);
}
