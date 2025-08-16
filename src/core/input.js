import { clamp } from '../utils/math.js';
import { LANES } from './constants.js';
import { serveDrink } from '../systems/collisions.js';

export function initInput(state){
  const keys = state.keys;

  addEventListener('keydown', e=>{
    if (e.repeat) return;
    keys[e.code]=true;
    if (e.code==='Escape') state.paused = !state.paused;
    if (e.code==='KeyR' && state.over) location.reload();

    // mini-game keyboard picks
    if (state.mini && state.mini.active && state.mini.phase==='guess'){
      if (e.code==='Digit1') state.mini.handlePick(0);
      if (e.code==='Digit2') state.mini.handlePick(1);
      if (e.code==='Digit3') state.mini.handlePick(2);
    }
  });
  addEventListener('keyup', e=> keys[e.code]=false);

  // mini-game mouse pick
  state.canvas.addEventListener('click', (e)=>{
    if (!(state.mini && state.mini.active && state.mini.phase==='guess')) return;
    const r = state.canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * (state.canvas.width / r.width);
    const y = (e.clientY - r.top)  * (state.canvas.height / r.height);
    const i = state.mini.hitTest(x,y);
    if (i>=0) state.mini.handlePick(i);
  });

  // poll style controls in updateSystems via this helper:
  state.handleInput = ()=>{
    if (pop('ArrowUp')||pop('KeyW'))  state.entities.player.lane = clamp(state.entities.player.lane-1,0,LANES-1);
    if (pop('ArrowDown')||pop('KeyS'))state.entities.player.lane = clamp(state.entities.player.lane+1,0,LANES-1);
    if (pop('Space')) serveDrink(state);
  };

  function pop(code){ if (keys[code]){ keys[code]=false; return true; } return false; }
}
