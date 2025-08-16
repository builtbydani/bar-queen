export function cssVar(name, fallback='#fff'){
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
