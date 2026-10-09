export interface CardTransferRect {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

/** Plain flights reach their destination before the final settle beat. */
export const CARD_TRANSFER_LANDING_PROGRESS = 0.9;

export interface CardTransferMotionInput {
  readonly source: CardTransferRect;
  readonly destination: CardTransferRect;
  readonly via?: CardTransferRect;
  /**
   * Fraction of the flight spent parked at `via` between its two legs (staged
   * retrievals hold at the display spot so the card is readable before it
   * continues). Clamped so both legs always keep time.
   */
  readonly viaHold?: number;
  readonly elapsedMs: number;
  readonly startAtMs: number;
  readonly durationMs: number;
  readonly faceChanges: boolean;
  readonly underlay?: boolean;
  readonly sourceVisible: boolean;
  readonly destinationVisible: boolean;
  /**
   * The step declared `sourcePresentation: "hold"`: the presentation state has
   * already moved the entity out of its source zone, so the waiting transfer
   * parks visible at the source rect instead of leaving it invisible until
   * this step's beat starts.
   */
  readonly holdsAtSource?: boolean;
  /** Optional choreography for quiet opening sequences; legacy transfers keep their defaults. */
  readonly choreography?: {
    readonly liftPx: number;
    readonly revealStart: number;
    readonly revealDuration: number;
  };
}

export interface CardTransferPose {
  readonly progress: number;
  readonly clipTop: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly rotationY: number;
  readonly faceRevealed: boolean;
  readonly rotationZ: number;
  readonly opacity: number;
  readonly shadowOpacity: number;
}

/**
 * Clock correction for clones that mount after their step's window has already
 * partly elapsed (slow frames stall endpoint capture past `startAtMs`).
 * Without it the first pose tick computes a fully-elaped timeline and the
 * clone renders straight at its landed pose — a teleport. The late clone
 * instead plays its flight from the source across the remaining real time,
 * clamped to a minimum so it is always visible as movement.
 */
export function resolveLateMountClock(input: {
  readonly elapsedAtMountMs: number;
  readonly startAtMs: number;
  readonly durationMs: number;
  readonly minFlightMs?: number;
}): { readonly offsetMs: number; readonly durationMs: number } {
  const lateBy = Math.max(0, input.elapsedAtMountMs - input.startAtMs);
  if (lateBy <= 0) return { offsetMs: 0, durationMs: input.durationMs };
  const remaining = input.durationMs - lateBy;
  if (remaining <= 0) {
    return { offsetMs: lateBy, durationMs: Math.max(input.minFlightMs ?? 240, 0) };
  }
  return { offsetMs: lateBy, durationMs: Math.max(input.minFlightMs ?? 240, remaining) };
}

export function resolveCardTransferPose(input: CardTransferMotionInput): CardTransferPose {
  const duration = Math.max(1, input.durationMs);
  const hasStarted = input.elapsedMs >= input.startAtMs;
  const progress = clamp01((input.elapsedMs - input.startAtMs) / duration);
  // Match the prototype choreography: movement settles slightly before the
  // timeline ends so the final tenth reads as a deliberate landing.
  const travelProgress = clamp01(
    progress / (input.underlay ? 0.7 : input.choreography ? 1 : CARD_TRANSFER_LANDING_PROGRESS),
  );
  const insertion = input.underlay ? smoothStep(clamp01((progress - 0.7) / 0.3)) : 0;
  const eased = input.choreography
    ? travelProgress ** 3 * (travelProgress * (travelProgress * 6 - 15) + 10)
    : smoothStep(travelProgress);
  const sourceCenterX = input.source.left + input.source.width / 2;
  const sourceCenterY = input.source.top + input.source.height / 2;
  const destinationCenterX = input.destination.left + input.destination.width / 2;
  const destinationCenterY = input.destination.top + input.destination.height / 2;
  const deltaX = destinationCenterX - sourceCenterX;
  const deltaY = destinationCenterY - sourceCenterY;
  const distance = Math.hypot(deltaX, deltaY);
  const sourceOpacity = input.sourceVisible ? 1 : 0;
  const destinationOpacity = input.destinationVisible ? 1 : 0;
  const faceProgress = input.faceChanges
    ? clamp01(
        (progress - (input.choreography?.revealStart ?? 0.04)) /
          (input.choreography?.revealDuration ?? 0.3),
      )
    : 0;
  const waypoint = input.via;
  // The hold eats into the legs' shared timeline (previously 0.62/0.38) so a
  // held route still spends its remaining time between travel and landing.
  const viaHold = waypoint ? Math.min(0.6, clamp01(input.viaHold ?? 0)) : 0;
  const toViaEnd = waypoint ? 0.62 * (1 - viaHold) : 0;
  const holdEnd = toViaEnd + viaHold;
  const route = waypoint
    ? progress < toViaEnd
      ? {
          from: input.source,
          to: waypoint,
          amount: smoothStep(clamp01(progress / toViaEnd)),
        }
      : progress < holdEnd
        ? { from: waypoint, to: waypoint, amount: 1 }
        : {
            from: waypoint,
            to: input.destination,
            amount: smoothStep(clamp01((progress - holdEnd) / (1 - holdEnd))),
          }
    : null;
  const legProgress = waypoint
    ? progress < toViaEnd
      ? progress / toViaEnd
      : progress < holdEnd
        ? 1
        : (progress - holdEnd) / (1 - holdEnd)
    : travelProgress;
  const arc = Math.sin(Math.PI * clamp01(legProgress));
  // Squared envelope has zero lift velocity at both endpoints: no takeoff jerk
  // or abrupt stop at the table. The legacy profile remains unchanged.
  const lift = input.choreography
    ? arc * arc * input.choreography.liftPx
    : arc * Math.min(118, Math.max(38, 50 + distance * 0.065));

  return {
    progress,
    clipTop: insertion * 100,
    centerX: route
      ? lerp(
          route.from.left + route.from.width / 2,
          route.to.left + route.to.width / 2,
          route.amount,
        )
      : lerp(sourceCenterX, destinationCenterX, eased),
    centerY:
      (route
        ? lerp(
            route.from.top + route.from.height / 2,
            route.to.top + route.to.height / 2,
            route.amount,
          )
        : lerp(
            sourceCenterY,
            destinationCenterY + (input.underlay ? input.destination.height : 0),
            eased,
          )) -
      lift -
      insertion * input.destination.height,
    // Match the measured card at takeoff and landing. Size and position share
    // the same progress so neither endpoint pops to the other one's density.
    width: route
      ? lerp(route.from.width, route.to.width, route.amount)
      : lerp(input.source.width, input.destination.width, eased),
    height: route
      ? lerp(route.from.height, route.to.height, route.amount)
      : lerp(input.source.height, input.destination.height, eased),
    depth: (input.choreography ? arc * arc : arc) * 72,
    // Reveal hidden cards near takeoff so their public artwork remains readable
    // for most of a deck-to-public-zone flight (mills, reveals, opponent plays).
    // Turn edge-on, exchange the image at the thinnest point, then turn the
    // public face back toward the viewer. This avoids browser-dependent
    // backface compositing while preserving a continuous 3D flip.
    rotationY: input.faceChanges ? Math.sin(Math.PI * faceProgress) * (Math.PI / 2) : 0,
    faceRevealed: input.faceChanges && faceProgress >= 0.5,
    rotationZ:
      (input.choreography ? arc * arc : arc) *
      clamp(deltaX / Math.max(600, distance * 5), -0.075, 0.075),
    // The real source remains visible until its scheduled transfer begins.
    // Keep the portal copy hidden while it waits or a smaller destination-sized
    // duplicate appears on top of the board card during an earlier effect beat.
    // A held transfer is the exception: the presentation state has already
    // moved the entity out of its source zone, so the waiting copy is the only
    // thing keeping it visible on the board.
    opacity:
      hasStarted || (input.holdsAtSource && input.sourceVisible)
        ? hasStarted
          ? lerp(sourceOpacity, destinationOpacity, eased)
          : sourceOpacity
        : 0,
    shadowOpacity: arc * 0.24,
  };
}

function smoothStep(value: number): number {
  return value * value * (3 - 2 * value);
}

function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
