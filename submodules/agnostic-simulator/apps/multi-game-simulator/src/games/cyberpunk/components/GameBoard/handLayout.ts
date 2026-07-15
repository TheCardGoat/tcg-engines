const DEFAULT_PLAYER_ZONE_WIDTH = 960;
const HAND_TARGET_WIDTH_RATIO = 0.48;
const MIN_CENTER_STEP_RATIO = 0.3;
const MAX_CENTER_STEP_RATIO = 0.96;
const MIN_PLAYER_CARD_WIDTH = 78;
const MAX_PLAYER_CARD_WIDTH = 96;
const PLAYER_CARD_WIDTH_RATIO = 0.054;
const HAND_SIZE_MULTIPLIERS = {
  opponent: 0.75,
  player: 1.25,
} as const;
const PLAYER_HAND_SCREEN_BLEED = 32;
const PLAYER_HAND_OFFSCREEN_RATIO = 7 / 15;
const PLAYER_HAND_ARC_HEIGHT = 5;
const PLAYER_HAND_MAX_ROTATION = 3;
const PLAYER_HAND_FULL_GAP = 8;

export type HandLayoutVariant = keyof typeof HAND_SIZE_MULTIPLIERS;

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
  variant: HandLayoutVariant = "player",
): PlayerHandLayout {
  const safeZoneWidth =
    Number.isFinite(zoneWidth) && zoneWidth > 0 ? zoneWidth : DEFAULT_PLAYER_ZONE_WIDTH;
  const baseCardWidth = clamp(
    safeZoneWidth * PLAYER_CARD_WIDTH_RATIO,
    MIN_PLAYER_CARD_WIDTH,
    MAX_PLAYER_CARD_WIDTH,
  );
  const cardWidth = Math.round(baseCardWidth * HAND_SIZE_MULTIPLIERS[variant]);
  const baselineOffset = Math.round(
    PLAYER_HAND_SCREEN_BLEED + cardWidth * PLAYER_HAND_OFFSCREEN_RATIO,
  );

  if (n <= 0) {
    return { cards: [], cardWidth };
  }

  if (n === 1) {
    return { cards: [{ angle: 0, x: 0, y: baselineOffset }], cardWidth };
  }

  const targetWidth = Math.round(safeZoneWidth * HAND_TARGET_WIDTH_RATIO);
  const preferredStep = (targetWidth - cardWidth) / (n - 1);
  const fullSpreadStep = cardWidth + PLAYER_HAND_FULL_GAP;
  const fullSpreadWidth = cardWidth * n + PLAYER_HAND_FULL_GAP * (n - 1);
  const canUseFullSpread =
    variant === "player" && fullSpreadWidth <= safeZoneWidth - PLAYER_HAND_SCREEN_BLEED;
  const step = canUseFullSpread
    ? fullSpreadStep
    : Math.round(
        clamp(preferredStep, cardWidth * MIN_CENTER_STEP_RATIO, cardWidth * MAX_CENTER_STEP_RATIO),
      );
  const span = step * (n - 1);
  const halfSpan = span / 2;

  return {
    cardWidth,
    cards: Array.from({ length: n }, (_, i) => {
      const x = i * step - halfSpan;
      const normalized = halfSpan > 0 ? x / halfSpan : 0;
      return {
        angle: normalized * PLAYER_HAND_MAX_ROTATION,
        x: Math.round(x),
        y: Math.round(baselineOffset + Math.abs(normalized) ** 2 * PLAYER_HAND_ARC_HEIGHT),
      };
    }),
  };
}

export { DEFAULT_PLAYER_ZONE_WIDTH, HAND_SIZE_MULTIPLIERS };
