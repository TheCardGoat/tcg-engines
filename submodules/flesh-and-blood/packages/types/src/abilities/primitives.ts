/**
 * Shared ability-AST primitives (CR 1.12–1.15, 2, 3, 6.2).
 *
 * Target contract: docs/architecture/foundation-types.md
 */

import type { FabAmount } from "./amount.ts";

/** Stable identity for one printed face of a physical card. */
export type FabFaceId = `${string}:face:${"front" | "back" | "left" | "right"}`;

/** (1.13.1) The four asset types. */
export type FabAssetType = "resources" | "chi" | "life" | "action-points";

/** (8.5.3b) Damage types. */
export type FabDamageType = "arcane" | "physical" | "generic";

/**
 * Player-scoped events retained by the authoritative turn history. Keeping
 * this a closed union makes every history projection exhaustive when a new
 * event is added.
 */
export type FabTurnHistoryEvent =
  | "transcend"
  | "create-fealty-token"
  | "play-draconic-card"
  | "create-card"
  | "activate-cannon"
  | "activate-weapon"
  | "phantasm-destroy-illusionist-attack-action"
  | "play-or-activate"
  | "destroy-item"
  | "charge"
  | "boost"
  | "crank"
  | "usurp"
  | "cheered"
  | "booed"
  | "intimidate-an-opponent"
  | "beat-chest"
  | "play-or-create-aura"
  | "put-card-into-soul"
  | "deal-damage"
  | "be-dealt-damage"
  | "banish-from-boost"
  | "evo-banish-from-boost"
  | "control-toughness"
  | "control-seismic-surge"
  | "put-blue-card-into-graveyard"
  | "draw"
  | "play-non-attack-action"
  | "play-another-blue-card"
  | "play-another-red-card"
  | "attack-with-weapon"
  | "deal-arcane-damage"
  | "hit"
  | "fuse"
  | "fuse-ice"
  | "fuse-lightning"
  | "fuse-earth"
  | "roll-4-or-higher"
  | "roll-5-or-higher"
  | "roll-6"
  | "pitch-power-6"
  | "discard-power-6"
  | "banish-power-6"
  | "discard-power-6-for-cost"
  | "complete-contract"
  | "create-crouching-tiger"
  | "attack-with-crouching-tiger"
  | "create-seismic-surge"
  | "create-or-activate-gate-to-iarathael"
  | "destroy-lightning-flow"
  | "destroy-aura"
  | "create-or-steal-gold"
  | "banish-earth-card"
  | "lose-life"
  | "attack-or-defend-attack-action"
  | "weapon-hit"
  | "fragment-attack"
  | "holo-aura-entered"
  | "herald-into-soul"
  | "yellow-into-soul"
  | "physical-damage";

/**
 * Public rules events that may cause a floating applicator to observe an
 * object. Keeping this separate from the engine's committed-event names lets
 * card definitions say "next card you play" without also consuming the grant
 * on an activation, attack declaration, or defense declaration.
 */
export type FabFutureApplicabilityEvent = "play" | "attack" | "activate" | "defend";

/** FabPlayer extension: "winner" is the winner of a wager/clash (8.5). */
export type FabPlayer =
  | "controller"
  | "opponent"
  | "self"
  | "any"
  | "each"
  | "winner"
  /** The loser of a clash/wager ("the other hero discards a card" — ROS
   * Drink 'Em Under the Table). */
  | "loser"
  /** The controller of the currently targeted object ("Its controller creates
   * Gold tokens equal to its cost."). */
  | "target-controller"
  /** The hero currently defending on the active chain link ("Banish a random
   * card from the defending hero's hand"). */
  | "defending-hero"
  /** The hero this card is attacking ("look at the top card of their deck"
   * on an attack). */
  | "attack-target"
  /** The hero currently attacking on the active chain link. */
  | "attacking-hero"
  /** Another hero — any hero other than the controller ("create a Quicken
   * token under another hero's control" — TCC Civic cycle). */
  | "another-hero"
  /** Every hero other than the controller ("Each other hero gains 1{h}." —
   * TCC songs). */
  | "each-other-hero"
  /**
   * Hero who has strictly more life than every other hero. Empty when no
   * unique maximum exists (ties). Used by Kavdaen-style life-extrema effects.
   */
  | "highest-life-hero"
  /**
   * Hero who has strictly less life than every other hero. Empty when no
   * unique minimum exists (ties).
   */
  | "lowest-life-hero"
  /**
   * Current subject of a `for-each` over heroes ("each other hero may… they
   * draw"). Distinct from `controller` (ability controller / "you").
   */
  | "iteration-subject"
  /** The current turn-player ("at the beginning of each hero's end phase, they…"). */
  | "turn-player"
  /** Player resolved from an earlier choose/reveal step ("that hero draws"). */
  | { binding: string };

export type FabComparisonOp = "eq" | "neq" | "lt" | "lte" | "gt" | "gte";

export interface FabComparison {
  op: FabComparisonOp;
  value: number | FabAmount;
}

/** Numeric object properties (2.0.1). */
export type FabNumericProperty =
  | "power"
  | "defense"
  | "life"
  | "intellect"
  | "pitch"
  | "cost"
  | "arcane";

/** (3) Zones, including soul (8.5.29) and inventory (4.1.6). */
export type FabZone =
  | "hand"
  | "deck"
  | "graveyard"
  | "banished"
  | "pitch"
  | "arsenal"
  | "soul"
  | "inventory"
  | "combat-chain"
  | "stack"
  | "permanent"
  | "hero"
  | "weapon"
  | "equipment-head"
  | "equipment-chest"
  | "equipment-arms"
  | "equipment-legs"
  /** Stacked under another object ("put it under this" — EVO Hyper-X3). */
  | "under";

/** Zones from which a card may be declared for play. Keep play permissions
 * narrower than the complete zone model so unreachable origins fail at authoring time. */
export type FabPlayOrigin = Extract<
  FabZone,
  "hand" | "arsenal" | "banished" | "deck" | "graveyard"
>;

/**
 * Every zone that can contain a card owned by one of the two seated players.
 * Shared multiplayer infrastructure is intentionally excluded.
 *
 * Global ownership effects should use this value instead of maintaining a
 * local zone list that can silently miss equipment, soul, inventory, or a
 * future player-owned zone.
 */
export const FAB_PLAYER_OWNED_CARD_ZONES = [
  "hand",
  "deck",
  "graveyard",
  "banished",
  "pitch",
  "arsenal",
  "soul",
  "inventory",
  "combat-chain",
  "stack",
  "permanent",
  "hero",
  "weapon",
  "equipment-head",
  "equipment-chest",
  "equipment-arms",
  "equipment-legs",
  "under",
] as const satisfies readonly FabZone[];

/** Effect durations (6.2.2a, 7.0.3d, 7.7.7, 6.6.3a). */
export type FabDuration =
  | "this-turn"
  | "until-end-of-next-turn"
  | "until-end-of-own-next-turn"
  /** "Until the start of your next turn". */
  | "until-start-of-own-next-turn"
  | "this-chain-link"
  | "this-combat-chain"
  /** "until the end of this action phase" (SEA steal effects). */
  | "until-end-of-action-phase"
  /** "during your next action phase" (AJV Unforgetting Unforgiving — play
   * window for the banished Mangle). */
  | "during-own-next-action-phase"
  /** "during their next action phase" (WTR Spinal / Cranial Crush). */
  | "during-their-next-action-phase"
  /** "during your next end phase" (ROS Ten Foot Tall and Bulletproof). */
  | "during-own-next-end-phase"
  /** "during their next end phase" (Stone Rain / Seek and Destroy). */
  | "during-their-next-end-phase"
  | "until-opponent-next-clash-resolves"
  | "while-condition"
  | "while-in-arena"
  | "until-triggered"
  | "permanent"
  /** "until the end of their next turn" (opponent-oriented duration). */
  | "until-end-of-their-next-turn";

/** (1.15) Counters: +/-N[property] numeric or named. */
export type FabCounter =
  | { kind: "numeric"; value: number; property: "power" | "defense" | "life" }
  | { kind: "named"; name: string };

/** Where a moved card ends up, with deck-position and visibility semantics. */
export interface FabDestination {
  zone: FabZone;
  /** Return the moved object to the zone belonging to its owner rather than
   * its current controller (System Reset). */
  player?: "owner";
  /** "top-or-bottom": the controller chooses per card ("put … on the top
   * and/or bottom of your deck" — OUT Visit the Floating Dojo). */
  position?: "top" | "bottom" | "top-or-bottom" | { index: number };
  visibility?: "face-up" | "face-down";
  /** The destination deck is shuffled after the move ("Shuffle all attack
   * action cards … into your deck" — DTD Dig Up Dinner). */
  shuffle?: true;
  /** The card enters the combat chain as the attacking card ("put the
   * banished card onto the active chain link as the attacking card" — UZU
   * Uzuri). */
  asAttacking?: true;
}
