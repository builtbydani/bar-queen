export async function loadSprites(manifest) {
  const entries = Object.entries(manifest);
  const out = {};
  await Promise.all(entries.map(([key, url]) => new Promise(res => {
    const img = new Image();
    img.onload = () => { out[key] = img; res(); };
    img.onerror = () => { console.warn('Sprite failed:', url); res(); };
    img.src = url;
  })));
  return out;
}

export function drawSprite(ctx, img, x, y, w, h) {
  if (!img) return false;
  ctx.drawImage(img, x, y, w, h);
  return true;
}
