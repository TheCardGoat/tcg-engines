import {
  resolveCardTransferPose,
  type CardTransferMotionInput,
  type CardTransferPose,
} from "@tcg/simulator-presentation/motion";

export const UNIT_ENTRY_DURATION_MS = 760;
export const UNIT_ENTRY_CONTACT_PROGRESS = 0.79;

/** A late clone still starts in hand, but contact and fade keep the shared clock. */
export function unitEntryElapsedMs(
  elapsedMs: number,
  lateByMs: number,
  startAtMs: number,
  durationMs: number,
): number {
  const contactMs = durationMs * UNIT_ENTRY_CONTACT_PROGRESS;
  const elapsed = elapsedMs - startAtMs;
  if (elapsed >= contactMs || lateByMs >= contactMs || lateByMs <= 0) return elapsedMs;
  return startAtMs + (Math.max(0, elapsed - lateByMs) * contactMs) / (contactMs - lateByMs);
}

export function resolveCyberpunkCardTransferPose(
  input: CardTransferMotionInput,
  unitEntry: boolean,
  sourceRotationDeg = 0,
): CardTransferPose & { readonly rotationX: number } {
  if (unitEntry) return resolveUnitEntryPose(input, sourceRotationDeg);
  const pose = resolveCardTransferPose(input);
  return {
    ...pose,
    rotationX: -(pose.clipTop > 0 ? 0 : Math.sin(Math.PI * pose.progress) * 0.055),
  };
}

function mix(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

/** Evaluate the reference's CSS timing curves on the shared playback clock. */
function bezier(progress: number, x1: number, y1: number, x2: number, y2: number): number {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  const curve = (t: number, a: number, b: number) =>
    3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  let low = 0;
  let high = 1;
  for (let i = 0; i < 16; i++) {
    const t = (low + high) / 2;
    if (curve(t, x1, x2) < progress) low = t;
    else high = t;
  }
  return curve((low + high) / 2, y1, y2);
}

export function resolveUnitEntryPose(
  input: CardTransferMotionInput,
  sourceRotationDeg = 0,
): CardTransferPose & { readonly rotationX: number } {
  const base = resolveCardTransferPose(input);
  const p = base.progress;
  const sourceX = input.source.left + input.source.width / 2;
  const sourceY = input.source.top + input.source.height / 2;
  const targetX = input.destination.left + input.destination.width / 2;
  const targetY = input.destination.top + input.destination.height / 2;
  const rise = Math.min(100, Math.max(48, input.destination.height * 0.45));
  let travel = 1;
  let lift = 0;
  let scale = 1;
  if (p < 0.5) {
    travel = bezier(p / 0.5, 0.2, 0.8, 0.3, 1);
    lift = rise * travel;
    scale = mix(1, 1.2, travel);
  } else if (p < 0.62) {
    const anticipation = bezier((p - 0.5) / 0.12, 0.42, 0, 0.58, 1);
    lift = mix(rise, rise * 1.14, anticipation);
    scale = mix(1.2, 1.2 * 1.03, anticipation);
  } else if (p < UNIT_ENTRY_CONTACT_PROGRESS) {
    const drop = bezier((p - 0.62) / 0.17, 0.6, 0, 0.95, 0.45);
    lift = mix(rise * 1.14, 0, drop);
    scale = mix(1.2 * 1.03, 1, drop);
  }
  // Contact is the final pose. Blend into the already loaded field mesh without
  // a second compression/expansion or a later DOM-to-WebGL handoff.
  const handoff = Math.max(
    0,
    Math.min(1, (p - UNIT_ENTRY_CONTACT_PROGRESS) / (1 - UNIT_ENTRY_CONTACT_PROGRESS)),
  );
  const opacity = base.opacity * (1 - handoff * handoff * (3 - 2 * handoff));
  return {
    ...base,
    centerX: mix(sourceX, targetX, travel),
    centerY: mix(sourceY, targetY, travel) - lift,
    width: mix(input.source.width, input.destination.width, travel) * scale,
    height: mix(input.source.height, input.destination.height, travel) * scale,
    rotationZ: ((sourceRotationDeg * Math.PI) / 180) * (1 - travel),
    rotationX: -(lift / rise) * 0.04,
    depth: (lift / rise) * 48,
    opacity,
    shadowOpacity: mix(0.28, 0.12, Math.min(1, lift / rise)) * opacity,
  };
}
