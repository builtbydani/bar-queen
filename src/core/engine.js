import { DT_NORM } from './constants.js';
export function createEngine(state, onUpdate, onRender){
  function loop(now){
    const dtMs = Math.min(32, now - state.lastNow);
    const dt = dtMs / DT_NORM;
    state.lastNow = now;
    if (!state.paused && !state.over){ onUpdate(dt, dtMs); onRender(); }
    else { onRender(); }
    requestAnimationFrame(loop);
  }
  return { start(){ requestAnimationFrame(loop); } };
}
