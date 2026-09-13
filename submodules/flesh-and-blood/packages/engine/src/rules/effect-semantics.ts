import type { FabEffect } from "@tcg/flesh-and-blood-types";

/**
 * The evaluator's ownership boundary for every serializable effect node.
 *
 * This is deliberately a total map over the card DSL rather than a list of
 * effects that happen to be supported by the current event interpreter. A
 * newly-added DSL variant therefore fails type checking here until its rules
 * ownership has been decided. Production support remains separately audited
 * in `effect-production-support.ts`.
 */
export type FabEffectSemanticKind =
  | "structural-interpreter-node"
  | "discrete-event-producer"
  | "continuous-effect-producer"
  | "replacement-or-prevention-producer"
  | "delayed-trigger-producer"
  | "explicit-unsupported-mechanic";

export type FabEffectSemanticsByType = Readonly<{
  [Type in FabEffect["type"]]: FabEffectSemanticKind;
}>;

/**
 * Exhaustive semantic classification for the rules evaluator foundation.
 *
 * `copy`, `gain-control`, `freeze`, and `become` intentionally belong to the
 * continuous bucket. Their current reducer implementations may still be
 * direct mutations, but that implementation detail is not allowed to erase
 * their duration-bearing rules semantics during the evaluator migration.
 */
export const FAB_EFFECT_SEMANTICS_BY_TYPE = {
  sequence: "structural-interpreter-node",
  "if-you-do": "structural-interpreter-node",
  choice: "structural-interpreter-node",
  conditional: "structural-interpreter-node",
  optional: "structural-interpreter-node",
  "for-each": "structural-interpreter-node",
  repeat: "structural-interpreter-node",
  unless: "structural-interpreter-node",

  "delayed-trigger": "delayed-trigger-producer",
  replacement: "replacement-or-prevention-producer",
  prevention: "replacement-or-prevention-producer",
  "cancel-event": "replacement-or-prevention-producer",
  ignore: "replacement-or-prevention-producer",

  copy: "continuous-effect-producer",
  "return-to-brood": "continuous-effect-producer",
  "gain-control": "continuous-effect-producer",
  give: "continuous-effect-producer",
  steal: "continuous-effect-producer",
  become: "continuous-effect-producer",
  freeze: "continuous-effect-producer",
  "modify-numeric": "continuous-effect-producer",
  "modify-activation-cost": "continuous-effect-producer",
  "modify-activation-limit": "discrete-event-producer",
  "grant-property": "continuous-effect-producer",
  "remove-property": "continuous-effect-producer",
  "can-be-attacked": "continuous-effect-producer",
  "play-card": "continuous-effect-producer",
  "rule-modification": "continuous-effect-producer",

  "remove-counters": "discrete-event-producer",
  "deal-damage": "discrete-event-producer",
  "gain-life": "discrete-event-producer",
  "lose-life": "discrete-event-producer",
  "gain-action-points": "discrete-event-producer",
  "gain-resources": "discrete-event-producer",
  "gain-chi": "discrete-event-producer",
  draw: "discrete-event-producer",
  "take-extra-turn": "discrete-event-producer",
  "lose-game": "discrete-event-producer",
  discard: "discrete-event-producer",
  banish: "discrete-event-producer",
  destroy: "discrete-event-producer",
  negate: "discrete-event-producer",
  "turn-face-down": "discrete-event-producer",
  "turn-face-up": "discrete-event-producer",
  "move-card": "discrete-event-producer",
  "bind-aura": "discrete-event-producer",
  "reorder-deck": "discrete-event-producer",
  search: "discrete-event-producer",
  shuffle: "discrete-event-producer",
  reveal: "discrete-event-producer",
  look: "discrete-event-producer",
  opt: "discrete-event-producer",
  amp: "discrete-event-producer",
  sharpen: "discrete-event-producer",
  "crowd-boos": "discrete-event-producer",
  "crowd-cheers": "discrete-event-producer",
  awaken: "discrete-event-producer",
  "win-clash": "discrete-event-producer",
  guess: "discrete-event-producer",
  "choose-color": "discrete-event-producer",
  "choose-option": "discrete-event-producer",
  "choose-and-create-token": "discrete-event-producer",
  "choose-number": "discrete-event-producer",
  "choose-card": "discrete-event-producer",
  "choose-new-targets": "discrete-event-producer",
  "choose-same-name-group": "discrete-event-producer",
  "contract-task": "discrete-event-producer",
  "contract-watch": "discrete-event-producer",
  "start-game": "discrete-event-producer",
  "remove-all-counters": "discrete-event-producer",
  "choose-opponent": "discrete-event-producer",
  "create-token": "discrete-event-producer",
  "create-card": "discrete-event-producer",
  "create-extra": "discrete-event-producer",
  "add-counter": "discrete-event-producer",
  "move-counter": "discrete-event-producer",
  "distribute-counters": "discrete-event-producer",
  roll: "discrete-event-producer",
  clash: "discrete-event-producer",
  reclash: "replacement-or-prevention-producer",
  "swap-clash-reveals": "replacement-or-prevention-producer",
  "name-card": "discrete-event-producer",
  intimidate: "discrete-event-producer",
  charge: "discrete-event-producer",
  "pitch-card": "discrete-event-producer",
  equip: "discrete-event-producer",
  retrieve: "discrete-event-producer",
  transform: "discrete-event-producer",
  transcend: "discrete-event-producer",
  "transform-into-resolving-card": "discrete-event-producer",
  exchange: "discrete-event-producer",
  mark: "discrete-event-producer",
  "set-status": "discrete-event-producer",
  unfreeze: "discrete-event-producer",
  tap: "discrete-event-producer",
  untap: "discrete-event-producer",
  "add-defending": "discrete-event-producer",
  "attack-with": "discrete-event-producer",
  pay: "discrete-event-producer",
  wager: "discrete-event-producer",
  "win-wager": "discrete-event-producer",
  "self-replacement": "structural-interpreter-node",
  "inline-trigger": "delayed-trigger-producer",
} as const satisfies FabEffectSemanticsByType;

export function effectSemanticKind(effect: FabEffect): FabEffectSemanticKind {
  return FAB_EFFECT_SEMANTICS_BY_TYPE[effect.type];
}
