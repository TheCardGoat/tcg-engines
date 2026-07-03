const DEFAULT_PLAYER_ZONE_WIDTH = 960;
const HAND_TARGET_WIDTH_RATIO = 0.52;
const MIN_CENTER_STEP_RATIO = 0.34;
const MAX_CENTER_STEP_RATIO = 0.96;
const MIN_PLAYER_CARD_WIDTH = 78;
const MAX_PLAYER_CARD_WIDTH = 96;
const PLAYER_CARD_WIDTH_RATIO = 0.054;

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

  const targetWidth = safeZoneWidth * HAND_TARGET_WIDTH_RATIO;
  const preferredStep = (targetWidth - cardWidth) / (n - 1);
  const step = clamp(
    preferredStep,
    cardWidth * MIN_CENTER_STEP_RATIO,
    cardWidth * MAX_CENTER_STEP_RATIO,
  );
  const span = step * (n - 1);
  const halfSpan = span / 2;

  return {
    cardWidth,
    cards: Array.from({ length: n }, (_, i) => {
      const x = i * step - halfSpan;
      const normalized = halfSpan > 0 ? x / halfSpan : 0;
      return {
        angle: normalized * 12,
        x,
        y: Math.abs(normalized) ** 2 * 22,
      };
    }),
  };
}

export { DEFAULT_PLAYER_ZONE_WIDTH };
