export const coinImpactMs = 760;
export const coinSettleMs = 1420;
/** Deterministic toss, two short rebounds, then a damped rim wobble. */
export function sampleCoinMotion(elapsed: number, reduced = false) {
  const t = Math.max(0, elapsed);
  if (reduced || t >= coinSettleMs) return { height: 0, tilt: 0.18, roll: -0.12 };
  if (t < coinImpactMs) {
    const p = t / coinImpactMs;
    return {
      height: 108 * 4 * p * (1 - p),
      tilt: 0.18 - Math.PI * 6 * (1 - p),
      roll: -0.12 + Math.sin(p * Math.PI) * 0.2,
    };
  }
  const after = t - coinImpactMs;
  const height =
    after < 200
      ? 17 * Math.sin((Math.PI * after) / 200)
      : after < 340
        ? 4 * Math.sin((Math.PI * (after - 200)) / 140)
        : 0;
  const envelope = (1 - after / (coinSettleMs - coinImpactMs)) ** 2;
  return {
    height,
    tilt: 0.18 + Math.sin(after / 37) * 0.24 * envelope,
    roll: -0.12 + Math.sin(after / 51) * 0.12 * envelope,
  };
}
