export interface CardTransferRect {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface CardTransferMotionInput {
  readonly source: CardTransferRect;
  readonly destination: CardTransferRect;
  readonly elapsedMs: number;
  readonly startAtMs: number;
  readonly durationMs: number;
  readonly faceChanges: boolean;
  readonly sourceVisible: boolean;
  readonly destinationVisible: boolean;
}

export interface CardTransferPose {
  readonly progress: number;
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
  readonly landingHaloOpacity: number;
  readonly landingHaloScale: number;
}

export function resolveCardTransferPose(input: CardTransferMotionInput): CardTransferPose {
  const duration = Math.max(1, input.durationMs);
  const progress = clamp01((input.elapsedMs - input.startAtMs) / duration);
  // Match the prototype choreography: movement settles slightly before the
  // timeline ends so the final tenth reads as a deliberate landing.
  const travelProgress = clamp01(progress / 0.9);
  const eased = smoothStep(travelProgress);
  const sourceCenterX = input.source.left + input.source.width / 2;
  const sourceCenterY = input.source.top + input.source.height / 2;
  const destinationCenterX = input.destination.left + input.destination.width / 2;
  const destinationCenterY = input.destination.top + input.destination.height / 2;
  const deltaX = destinationCenterX - sourceCenterX;
  const deltaY = destinationCenterY - sourceCenterY;
  const distance = Math.hypot(deltaX, deltaY);
  const arc = Math.sin(Math.PI * travelProgress);
  const lift = arc * Math.min(118, Math.max(38, 50 + distance * 0.065));
  const landingProgress = clamp01((progress - 0.7) / 0.3);
  const sourceOpacity = input.sourceVisible ? 1 : 0;
  const destinationOpacity = input.destinationVisible ? 1 : 0;
  const faceProgress = input.faceChanges ? clamp01((progress - 0.04) / 0.3) : 0;
  const footprint = smallerFootprint(input.source, input.destination);

  return {
    progress,
    centerX: lerp(sourceCenterX, destinationCenterX, eased),
    centerY: lerp(sourceCenterY, destinationCenterY, eased) - lift,
    // Board zones intentionally render cards at different densities. The
    // travelling card uses one stable, smaller footprint so it cannot swell
    // above either real endpoint or visibly resize while crossing the board.
    width: footprint.width,
    height: footprint.height,
    depth: arc * 72,
    // Reveal hidden cards near takeoff so their public artwork remains readable
    // for most of a deck-to-public-zone flight (mills, reveals, opponent plays).
    // Turn edge-on, exchange the image at the thinnest point, then turn the
    // public face back toward the viewer. This avoids browser-dependent
    // backface compositing while preserving a continuous 3D flip.
    rotationY: input.faceChanges ? Math.sin(Math.PI * faceProgress) * (Math.PI / 2) : 0,
    faceRevealed: input.faceChanges && faceProgress >= 0.5,
    rotationZ: arc * clamp(deltaX / Math.max(600, distance * 5), -0.075, 0.075),
    opacity: lerp(sourceOpacity, destinationOpacity, eased),
    shadowOpacity: arc * 0.24,
    landingHaloOpacity: Math.sin(Math.PI * landingProgress) * 0.34,
    landingHaloScale: 0.62 + landingProgress * 0.62,
  };
}

function smallerFootprint(
  source: Pick<CardTransferRect, "width" | "height">,
  destination: Pick<CardTransferRect, "width" | "height">,
): Pick<CardTransferRect, "width" | "height"> {
  return source.width * source.height <= destination.width * destination.height
    ? { width: source.width, height: source.height }
    : { width: destination.width, height: destination.height };
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
