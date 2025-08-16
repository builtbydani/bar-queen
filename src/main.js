import { initState } from './core/state.js';
import { initInput } from './core/input.js';
import { createEngine } from './core/engine.js';
import { drawFrame } from './render/draw.js';
import { updateHud } from './render/hud.js';
import { beginRound } from './systems/rounds.js';
import { loadSprites } from './render/sprites.js';

import Player from './entities/Player.js';

// Boot
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const state = initState(canvas, ctx);
// Sprite manifest (add/rename as you add files)
const manifest = {
  player: 'assets/images/player.svg',
  patron_reg: 'assets/images/patron_reg.svg',
  patron_vip: 'assets/images/patron_vip.svg',
  drink: 'assets/images/drink.svg',
  empty: 'assets/images/empty.svg',
  power_speed: 'assets/images/power_speed.svg',
  power_charm: 'assets/images/power_charm.svg',
  power_auto: 'assets/images/power_auto.svg',
};
state.sprites = await loadSprites(manifest);
state.entities.player = new Player();

initInput(state);
updateHud(state);

beginRound(state, 1);

import { updateSystems } from './systems/collisions.js';
import { spawnTick }     from './systems/spawn.js';
import { tickEffects }   from './systems/effects.js';
import { miniTick }      from './systems/miniGame.js';

function update(dt, dtMs){
  // Mini-game step (peek → shuffle → guess → reveal → schedule next round)
  miniTick(state, dtMs);

  if (!state.inIntermission && !(state.mini && state.mini.active)){
    spawnTick(state);
  }

  tickEffects(state);
  updateSystems(state, dt);
}

function render(){ drawFrame(state); }

const engine = createEngine(state, update, render);
engine.start();
