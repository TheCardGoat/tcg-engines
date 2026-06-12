const DEFAULT_PLAYER_ZONE_WIDTH = 960;
const HAND_TARGET_WIDTH_RATIO = 0.58;
const READABLE_HAND_TARGET_WIDTH_RATIO = 0.68;
const MIN_CENTER_STEP_RATIO = 0.42;
const READABLE_MIN_CENTER_STEP_RATIO = 0.58;
const MAX_CENTER_STEP_RATIO = 0.96;
const MIN_PLAYER_CARD_WIDTH = 78;
const MAX_PLAYER_CARD_WIDTH = 96;
const PLAYER_CARD_WIDTH_RATIO = 0.054;
const DEFAULT_MAX_ANGLE = 11;
const READABLE_MAX_ANGLE = 7;
const DEFAULT_EDGE_DROP = 18;
const READABLE_EDGE_DROP = 10;
const READABLE_HAND_MAX_SIZE = 6;

interface Layout {
  angle: number;
  x: number;
  y: number;
}

interface PlayerHandLayout {
  cards: Layout[];
  cardWidth: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function computePlayerHandLayout(
  n: number,
  zoneWidth = DEFAULT_PLAYER_ZONE_WIDTH,
): PlayerHandLayout {
  const safeZoneWidth =
    Number.isFinite(zoneWidth) && zoneWidth > 0 ? zoneWidth : DEFAULT_PLAYER_ZONE_WIDTH;
  const cardWidth = clamp(
    safeZoneWidth * PLAYER_CARD_WIDTH_RATIO,
    MIN_PLAYER_CARD_WIDTH,
    MAX_PLAYER_CARD_WIDTH,
  );

  if (n <= 0) {
    return { cards: [], cardWidth };
  }

  if (n === 1) {
    return { cards: [{ angle: 0, x: 0, y: 0 }], cardWidth };
  }

  const readableHand = n <= READABLE_HAND_MAX_SIZE;
  const targetWidth =
    safeZoneWidth * (readableHand ? READABLE_HAND_TARGET_WIDTH_RATIO : HAND_TARGET_WIDTH_RATIO);
  const preferredStep = (targetWidth - cardWidth) / (n - 1);
  const step = clamp(
    preferredStep,
    cardWidth * (readableHand ? READABLE_MIN_CENTER_STEP_RATIO : MIN_CENTER_STEP_RATIO),
    cardWidth * MAX_CENTER_STEP_RATIO,
  );
  const span = step * (n - 1);
  const halfSpan = span / 2;
  const maxAngle = readableHand ? READABLE_MAX_ANGLE : DEFAULT_MAX_ANGLE;
  const edgeDrop = readableHand ? READABLE_EDGE_DROP : DEFAULT_EDGE_DROP;

  return {
    cardWidth,
    cards: Array.from({ length: n }, (_, i) => {
      const x = i * step - halfSpan;
      const normalized = halfSpan > 0 ? x / halfSpan : 0;
      return {
        angle: normalized * maxAngle,
        x,
        y: Math.abs(normalized) ** 2 * edgeDrop,
      };
    }),
  };
}

export { DEFAULT_PLAYER_ZONE_WIDTH };
