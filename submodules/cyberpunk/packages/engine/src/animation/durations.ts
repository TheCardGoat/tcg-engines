export const ANIMATION_DURATIONS_MS = {
  cardMove: 240,
  cardExit: 280,
  cardEnter: 280,
  cardAttach: 320,
  cardLand: 280,
  legendReveal: 460,
  effectTarget: 380,
  resourceFloat: 700,
  combatDeclare: 360,
  combatResolve: 280,
  gigMove: 360,
  phaseChange: 1500,
  /** Per-card stagger when multiple cards are drawn in one event. */
  drawStaggerMs: 70,
} as const;

export type AnimationDurationKey = keyof typeof ANIMATION_DURATIONS_MS;
