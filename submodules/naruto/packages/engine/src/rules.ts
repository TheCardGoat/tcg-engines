/**
 * Rules constants.
 *
 * The Naruto Card Game is unreleased; these encode the author's provisional
 * interpretation of publicly revealed rules and will be corrected when the
 * official rulebook is published. The split between OFFICIAL_RULES (structure
 * taken from official marketing material) and PROVISIONAL_RULES (interpreted
 * play rules) exists so values can be flipped when Bandai publishes the real
 * rulebook.
 */

import type { Phase } from "./types";

export interface OfficialRules {
  readonly deckSize: number;
  readonly chakraCount: number;
  readonly summonCount: number;
  readonly leaderLife: number;
  readonly supportSlots: number;
  readonly phases: readonly Phase[];
}

export interface ProvisionalRules {
  readonly openingHand: number;
  /** Only the 2nd player gets a mulligan window. */
  readonly mulliganForSecondPlayer: boolean;
  readonly firstTurnDraw: number;
  readonly normalDraw: number;
  /** No attacks while turn <= 2. */
  readonly noAttackOnFirstTurn: boolean;
  readonly normalSummonsPerTurn: number;
  readonly attacksPerCharacter: number;
  readonly attackingRestsAttacker: boolean;
  /** Only rested characters can be attacked. */
  readonly canAttackStandingCharacter: boolean;
  /** No blockers. */
  readonly blocking: boolean;
  /** Damage/bonuses reset at END_TURN. */
  readonly damageWipesAtEndOfTurn: boolean;
  /** No counter-damage to the attacker. */
  readonly attackerTakesNoDamage: boolean;
  /** Leader loses life equal to the attacker's DAMAGE stat. */
  readonly damageToLeaderUses: "damage" | "power";
  /** Character takes the attacker's POWER as damage. */
  readonly damageToCharacterUses: "damage" | "power";
  readonly recoveryFromTurn: number;
  readonly deckOutLoses: boolean;
  readonly leaderCanAttack: boolean;
  readonly leaderAttacksPerTurn: number;
  readonly leaderEffectRestsLeader: boolean;
  readonly interruptedAttackUsesAttacker: boolean;
  readonly maxCopiesPerCard: number | null;
  readonly characterLimit: number | null;
  readonly characterSlotsShown: number;
  readonly supportFromHandOnYourTurn: boolean;
}

export const OFFICIAL_RULES: OfficialRules = {
  deckSize: 50,
  chakraCount: 5,
  summonCount: 1,
  leaderLife: 15,
  supportSlots: 5,
  phases: ["refresh", "draw", "main", "end"],
} as const;

export const PROVISIONAL_RULES: ProvisionalRules = {
  openingHand: 5,
  mulliganForSecondPlayer: true,
  firstTurnDraw: 1,
  normalDraw: 2,
  noAttackOnFirstTurn: true,
  normalSummonsPerTurn: 1,
  attacksPerCharacter: 1,
  attackingRestsAttacker: true,
  canAttackStandingCharacter: false,
  blocking: false,
  damageWipesAtEndOfTurn: true,
  attackerTakesNoDamage: true,
  damageToLeaderUses: "damage",
  damageToCharacterUses: "power",
  recoveryFromTurn: 2,
  deckOutLoses: true,
  leaderCanAttack: true,
  leaderEffectRestsLeader: false,
  leaderAttacksPerTurn: 1,
  interruptedAttackUsesAttacker: true,
  maxCopiesPerCard: 4,
  characterLimit: null,
  characterSlotsShown: 5,
  supportFromHandOnYourTurn: true,
} as const;

/** Full rules configuration: the two constant presets bundled together. */
export interface GameRules {
  readonly official: OfficialRules;
  readonly provisional: ProvisionalRules;
}

export const DEFAULT_RULES: GameRules = {
  official: OFFICIAL_RULES,
  provisional: PROVISIONAL_RULES,
} as const;
