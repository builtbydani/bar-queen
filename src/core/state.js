import { LANES } from './constants.js';

export function initState(canvas, ctx){
  const laneH = canvas.height / (LANES + 1);
  const lanesY = Array.from({length: LANES}, (_,i)=> Math.round((i+1)*laneH));
  return {
    canvas, ctx, lanesY,
    paused:false, over:false,
    score:0, lives:3,
    round:1,
    inIntermission:false,
    intermissionTime:1600,
    intermissionTimeout:null,
    nextSpawnAt: 0,
    roundConfig:{ total:12, spawned:0, cadence:1100, baseSpeed:1.45 },
    combo:0, multiplier:1,
    vipUnlocked:false,
    lastNow: performance.now(),
    effects:{ speedPour:0, charm:0, autoCatch:0 },
    mini:null,
    bannerLocked:false,
    keys:{},
    entities:{ player:null, patrons:[], drinks:[], empties:[], tokens:[] }
  };
}
