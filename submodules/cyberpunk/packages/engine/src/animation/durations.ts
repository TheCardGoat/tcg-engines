export const ANIMATION_DURATIONS_MS = {
  cardMove: 800,
  /** Quick travel from hand into play; reveal holds are timed separately. */
  handPlay: 360,
  /** Hold the played Program at the resolving spot before showing its effect. */
  programRevealHoldMs: 1_000,
  cardExit: 800,
  cardEnter: 800,
  cardAttach: 800,
  cardLand: 280,
  cardReveal: 800,
  legendReveal: 460,
  effectTarget: 1240,
  effectTargetImpactDelayMs: 620,
  resourceFloat: 800,
  combatDeclare: 800,
  /** Keep both participants and the fight result visible before defeated cards exit. */
  combatResolve: 1_600,
  gigMove: 800,
  phaseChange: 1500,
  entityStateChange: 550,
  randomization: 720,
  actionEmphasis: 800,
  gameResult: 1200,
  /** Show each revealed card before the next one moves. */
  drawStaggerMs: 800,
} as const;

export type AnimationDurationKey = keyof typeof ANIMATION_DURATIONS_MS;
