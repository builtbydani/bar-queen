import { BAR_X } from '../core/constants.js';

export function drawFrame(s){
  const { ctx, canvas, lanesY, entities } = s;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // bar strip
  ctx.fillStyle = '#ffffff22';
  ctx.fillRect(0,0,BAR_X,canvas.height);

  // lanes
  ctx.strokeStyle = 'rgba(255,255,255,.13)';
  ctx.lineWidth = 2;
  for (const y of lanesY){
    ctx.beginPath(); ctx.moveTo(0, y + 28); ctx.lineTo(canvas.width, y + 28); ctx.stroke();
  }

  // entities
  for (const p of entities.patrons) p.draw(ctx,s);
  for (const d of entities.drinks)  d.draw(ctx,s);
  for (const e of entities.empties) e.draw(ctx,s);
  for (const t of entities.tokens)  t.draw(ctx,s);
  entities.player?.draw(ctx,s);

  // serve line
  ctx.strokeStyle = '#ffd166';
  ctx.beginPath(); ctx.moveTo(BAR_X,0); ctx.lineTo(BAR_X,canvas.height); ctx.stroke();

  // mini overlay
  if (s.mini && s.mini.active){
    ctx.fillStyle = '#00000055';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    s.mini.draw(ctx,s);
  }
}
