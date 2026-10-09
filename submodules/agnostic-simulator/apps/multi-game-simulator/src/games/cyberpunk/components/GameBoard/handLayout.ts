const DEFAULT_PLAYER_ZONE_WIDTH = 960;
const OPPONENT_HAND_TARGET_WIDTH_RATIO = 0.48;
const MIN_CENTER_STEP_RATIO = 0.3;
const MAX_CENTER_STEP_RATIO = 0.96;
const MIN_PLAYER_CARD_WIDTH = 78;
const MAX_PLAYER_CARD_WIDTH = 96;
const PLAYER_CARD_WIDTH_RATIO = 0.054;
const HAND_SIZE_MULTIPLIERS = {
  opponent: 0.75,
  player: 1.05,
} as const;
const HAND_EDGE_GUTTER = 32;
const HAND_BOTTOM_BLEED = {
  opponent: 32,
  player: 0,
} as const;
const HAND_OFFSCREEN_RATIO = {
  opponent: 7 / 15,
  /* The lower card text is not useful at board scale. Hiding this portion
     keeps the hand tactile while returning vertical space to the play area. */
  player: 0.22,
} as const;
const OPPONENT_HAND_ARC_HEIGHT = 5;
const OPPONENT_HAND_MAX_ROTATION = 3;
const PLAYER_HAND_FULL_GAP = 8;

export type HandLayoutVariant = keyof typeof HAND_SIZE_MULTIPLIERS;
export type HandLayoutAlignment = "center" | "start";

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
  alignment: HandLayoutAlignment = "center",
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
    HAND_BOTTOM_BLEED[variant] + cardWidth * HAND_OFFSCREEN_RATIO[variant],
  );

  if (n <= 0) {
    return { cards: [], cardWidth };
  }

  if (n === 1) {
    return { cards: [{ angle: 0, x: 0, y: baselineOffset }], cardWidth };
  }

  const targetWidth =
    variant === "player"
      ? safeZoneWidth - HAND_EDGE_GUTTER
      : Math.round(safeZoneWidth * OPPONENT_HAND_TARGET_WIDTH_RATIO);
  const preferredStep = (targetWidth - cardWidth) / (n - 1);
  const fullSpreadStep = cardWidth + PLAYER_HAND_FULL_GAP;
  const fullSpreadWidth = cardWidth * n + PLAYER_HAND_FULL_GAP * (n - 1);
  const canUseFullSpread =
    variant === "player" && fullSpreadWidth <= safeZoneWidth - HAND_EDGE_GUTTER;
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
        // The player's drawn card flies as an upright rectangle. Keep its final
        // hand slot upright too, so revealing it cannot cause a second tilt or
        // position shift after the transfer lands.
        angle: variant === "player" ? 0 : normalized * OPPONENT_HAND_MAX_ROTATION,
        x: Math.round(alignment === "start" ? x + halfSpan + cardWidth / 2 : x),
        y:
          variant === "player"
            ? baselineOffset
            : Math.round(baselineOffset + Math.abs(normalized) ** 2 * OPPONENT_HAND_ARC_HEIGHT),
      };
    }),
  };
}

export { DEFAULT_PLAYER_ZONE_WIDTH, HAND_SIZE_MULTIPLIERS };
