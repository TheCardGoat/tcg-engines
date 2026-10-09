export type ResolutionKind = "damage" | "remove" | "buff";
export interface CardReaction {
  x: number;
  y: number;
  scale: number;
  opacity: number;
}
export const resolutionTiming = {
  charge: 140,
  impact: 440,
  settle: 720,
  reducedImpact: 80,
} as const;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
/** Presentation only. The adapter supplies the resolved result; this does not apply damage. */
export function sampleCardReaction(
  kind: ResolutionKind,
  elapsed: number,
  reduced = false,
): CardReaction {
  const after = elapsed - (reduced ? resolutionTiming.reducedImpact : resolutionTiming.impact);
  const settle = kind === "remove" ? 320 : resolutionTiming.settle;
  if (reduced || after < 0 || after >= settle) return { x: 0, y: 0, scale: 1, opacity: 1 };
  // Finish removal feedback before the adapter starts the target-zone flight.
  const p = clamp(after / settle);
  const recoil =
    kind === "damage"
      ? Math.sin(Math.min(1, after / 320) * Math.PI * 3) * Math.exp(-after / 90)
      : 0;
  return {
    x: recoil * 8,
    y: -recoil * 3,
    scale: kind === "remove" ? 1 - 0.03 * Math.sin(p * Math.PI) : 1 - Math.abs(recoil) * 0.025,
    opacity: kind === "remove" ? 1 - 0.15 * Math.sin(p * Math.PI) : 1,
  };
}
