function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

export function getEdgeFadeOpacity(distanceFromEdge: number, fadeRange: number) {
  if (fadeRange <= 0) {
    return 0;
  }

  return smoothstep(distanceFromEdge / fadeRange);
}
