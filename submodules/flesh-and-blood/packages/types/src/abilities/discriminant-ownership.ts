/**
 * Exhaustive discriminant registries. Adding a union member without updating
 * the matching list fails `tsc` here (foundation-types.md principle 9).
 */

import type { FabAmount, FabQuantifier } from "./amount.ts";
import type { FabCondition } from "./condition.ts";
import type { FabEffect } from "./effect.ts";
import type { FabTarget } from "./target.ts";

type AmountType = Exclude<FabAmount, number>["type"];
type ConditionType = FabCondition["type"];
type EffectType = FabEffect["type"];
type TargetSelector = FabTarget["selector"];

type Missing<Actual extends string, Listed extends string> = Exclude<Actual, Listed>;
type Extra<Actual extends string, Listed extends string> = Exclude<Listed, Actual>;
type AssertExact<Actual extends string, Listed extends string> = [Missing<Actual, Listed>] extends [
  never,
]
  ? [Extra<Actual, Listed>] extends [never]
    ? true
    : { extra: Extra<Actual, Listed> }
  : { missing: Missing<Actual, Listed> };

export const FAB_AMOUNT_TYPES = [
  "x",
  "y",
  "z",
  "count",
  "reference",
  "roll",
  "event-amount",
  "trigger-event-damage",
  "max",
  "subject-property",
  "roll-result",
  "up-to",
  "hero-property",
  "sum",
  "difference",
  "negate",
  "double",
  "keyword-value",
  "conditional",
] as const satisfies readonly AmountType[];

export const FAB_CONDITION_TYPES = [
  "and",
  "or",
  "not",
  "compare-amount",
  "zone-count",
  "has-counter",
  "chain-link-count",
  "combat-chain-attack-count",
  "left-arena-count",
  "chain-link-property",
  "attack-power",
  "attack-defense",
  "object-numeric-comparison",
  "life-comparison",
  "damage-dealt",
  "damage-taken",
  "source-damage-dealt",
  "played-this",
  "has-keyword",
  "die-result",
  "performed-this-turn",
  "sword-hit-this-turn",
  "another-weapon-gained-go-again-this-turn",
  "has-status",
  "source-is-subcard-of-host",
  "is-marked",
  "control-object",
  "equipped-count",
  "pitch-zone-has",
  "binding-matches",
  "binding-numeric",
  "target-exists",
  "turn-player",
  "phase-is",
  "defended-this-chain-link",
  "last-attack-this-combat-chain",
  "last-attack-this-turn",
  "last-action-this-turn",
  "moved-this-turn",
] as const satisfies readonly ConditionType[];

export const FAB_TARGET_SELECTORS = [
  "self",
  "this-attack",
  "attack-from-source",
  "attacking-hero",
  "defending-hero",
  "attack-target",
  "controller",
  "opponent",
  "any-hero",
  "hero",
  "winner",
  "each-hero",
  "each-other-hero",
  "highest-life-hero",
  "lowest-life-hero",
  "iteration-subject",
  "host",
  "sub-cards",
  "binding",
  "object",
] as const satisfies readonly TargetSelector[];

export const FAB_EFFECT_TYPES = [
  "sequence",
  "if-you-do",
  "self-replacement",
  "choice",
  "conditional",
  "optional",
  "for-each",
  "remove-counters",
  "repeat",
  "delayed-trigger",
  "inline-trigger",
  "deal-damage",
  "gain-life",
  "lose-life",
  "gain-action-points",
  "gain-resources",
  "gain-chi",
  "draw",
  "take-extra-turn",
  "lose-game",
  "discard",
  "banish",
  "destroy",
  "negate",
  "turn-face-down",
  "turn-face-up",
  "unless",
  "move-card",
  "bind-aura",
  "reorder-deck",
  "search",
  "shuffle",
  "reveal",
  "look",
  "choose-same-name-group",
  "opt",
  "amp",
  "sharpen",
  "crowd-boos",
  "crowd-cheers",
  "awaken",
  "win-clash",
  "guess",
  "choose-color",
  "choose-option",
  "choose-and-create-token",
  "choose-number",
  "choose-card",
  "choose-new-targets",
  "contract-task",
  "contract-watch",
  "start-game",
  "remove-all-counters",
  "choose-opponent",
  "create-token",
  "create-card",
  "cancel-event",
  "ignore",
  "create-extra",
  "add-counter",
  "move-counter",
  "distribute-counters",
  "roll",
  "clash",
  "reclash",
  "swap-clash-reveals",
  "name-card",
  "intimidate",
  "charge",
  "pitch-card",
  "equip",
  "retrieve",
  "transform",
  "transcend",
  "transform-into-resolving-card",
  "copy",
  "return-to-brood",
  "exchange",
  "gain-control",
  "give",
  "steal",
  "mark",
  "set-status",
  "freeze",
  "unfreeze",
  "tap",
  "untap",
  "add-defending",
  "attack-with",
  "modify-activation-limit",
  "play-card",
  "pay",
  "wager",
  "win-wager",
  "become",
  "modify-numeric",
  "modify-activation-cost",
  "grant-property",
  "remove-property",
  "can-be-attacked",
  "replacement",
  "prevention",
  "rule-modification",
] as const satisfies readonly EffectType[];

const _amountOwnership: AssertExact<AmountType, (typeof FAB_AMOUNT_TYPES)[number]> = true;
const _conditionOwnership: AssertExact<ConditionType, (typeof FAB_CONDITION_TYPES)[number]> = true;
const _targetOwnership: AssertExact<TargetSelector, (typeof FAB_TARGET_SELECTORS)[number]> = true;
const _effectOwnership: AssertExact<EffectType, (typeof FAB_EFFECT_TYPES)[number]> = true;

void _amountOwnership;
void _conditionOwnership;
void _targetOwnership;
void _effectOwnership;

type QuantifierIsNotAmount = FabQuantifier extends FabAmount ? never : true;
const _quantifierIsNotAmount: QuantifierIsNotAmount = true;
void _quantifierIsNotAmount;
