/**
 * Amounts (CR 1.12).
 *
 * Target contract: docs/architecture/foundation-types.md
 */

import type { FabCardFilter } from "./filter.ts";
import type { FabCondition } from "./condition.ts";
import type {
  FabCounter,
  FabDamageType,
  FabNumericProperty,
  FabPlayer,
  FabZone,
} from "./primitives.ts";

// ---------------------------------------------------------------------------
// Amounts (1.12)
// ---------------------------------------------------------------------------

export type FabCountable =
  | "cards-in-hand"
  | "cards-in-zone"
  | "chain-links"
  | "distinct-costs"
  | "cards-pitched-this-turn"
  | "cards-played-this-turn"
  /** Boost declarations this turn (EVO "if you've boosted 2 or more times"). */
  | "boosts-this-turn"
  /** Intimidate effects this turn (CR 8.5.10a). */
  | "intimidates-this-turn"
  /** Runechant tokens created this turn. */
  | "runechants-created-this-turn"
  /** Hits this combat chain by the scoped player(s). */
  | "combat-chain-hits"
  /** Trailing run of chain links that hit on the open combat chain
   * ("the Nth or higher chain link in a row to hit"). */
  | "consecutive-chain-links-that-hit"
  /** Declared weapon attacks this turn. */
  | "weapon-attacks-this-turn"
  /** Attacks declared with the exact weapon currently bound as the subject. */
  | "attacks-with-subject-this-turn"
  /** Attack declarations that targeted the scoped hero this turn. */
  | "times-attacked-this-turn"
  /** Attack reactions played or activated this chain link. */
  | "attack-reactions-this-chain-link"
  /** Cards hosted under the condition's subject/source (Hyper Drivers). */
  | "objects-under-source"
  /** Attacks declared this turn by the scoped player(s). */
  | "attacks-this-turn"

  /** Cards a hero has drawn this turn ("if the attacking hero has drawn 2 or
   * more cards this turn" — DTD Hold the Line). */
  | "cards-drawn-this-turn"
  /** Counters removed as an additional cost ("Choose that many modes plus 1"). */
  | "counters-removed-for-cost"
  /** Cards banished as an additional cost ("As an additional cost to play
   * this, banish up to 3 cards from your hero's soul. Choose that many
   * modes;" — DTD Lumina Lance). */
  | "banished-for-cost"
  /** Counters removed by an effect earlier in the same resolution ("Remove
   * all energy counters …. Create that many Gold tokens."). */
  | "counters-removed"
  | "equipped-objects"
  | "counters-on-source"
  /** Counters (of `counter` kind) across all objects matching `filter`
   * ("for each +1{p} counter on swords you control"). */
  | "counters-on-objects"
  | "damage-dealt"
  | "heroes"
  /** Cards turned face-down by an effect earlier in the same resolution
   * ("Turn up to 3 ally cards … face-down, then create that many Gold
   * tokens."). */
  | "turned-face-down-this-way"
  /** Cards defending on the active chain link ("for each card defending"). */
  | "cards-defending"
  /** Cards discarded by an effect earlier in the same resolution ("they draw
   * that many cards" after discarding). */
  | "discarded-this-way"
  /** Tokens that left the arena this turn ("for each Toughness token that has
   * left the arena this turn" — filter narrows the token). */
  | "left-arena-this-turn"
  /** Resources paid by an optional pay effect earlier in the same resolution
   * ("You may pay up to {r}{r}{r}. Create that many Seismic Surge tokens."). */
  | "resources-paid-this-way"
  /** Weapon attacks that hit this turn ("create a Copper token for each
   * weapon attack that hit" — Kassai). */
  | "weapon-attacks-that-hit-this-turn"
  /** Times the controller has boosted this combat chain ("the number of times
   * you've boosted this combat chain" — DYN Pulsewave Harpoon). */
  | "boosts-this-combat-chain"
  /** Attacks that have hit this combat chain ("+1{p} for each attack that has
   * hit this combat chain" — TCC Salt the Wound, KAT Fluster Fist). */
  | "attacks-hit-this-combat-chain"
  /** Life gained this turn ("cost less than the {h} you've gained this
   * turn" — Sowing Thorns). */
  | "life-gained-this-turn"
  /** Tokens destroyed by an effect earlier in the same resolution ("Create a
   * Toughness token for each token destroyed this way"). */
  | "destroyed-this-way"
  /** Distinct names among aura tokens in the arena ("+1{p} +1{d} for each
   * different name among aura tokens in the arena" — Overcrowded). */
  | "different-names-among-aura-tokens"
  /** Clashes won this turn ("twice the number of clashes you've won this
   * turn" — HVY Boast). */
  | "clashes-won-this-turn"
  /** Heroes who started this game ("Gold tokens equal to the number of
   * heroes who started this game" — HVY Deathmatch Arena). */
  | "heroes-started-game"
  /** Heroes dealt damage by an effect earlier in the same resolution
   * ("Create a Ponder token for each hero dealt damage this way" — HVY
   * Aether Arc). */
  | "heroes-dealt-damage-this-way"
  /** Times the modified attack has wagered ("+Y{p}, where Y is the number of
   * times it has wagered" — HVY Up the Ante). */
  | "times-it-has-wagered"
  /** Wagers the controller has made on the open chain link ("if you've
   * wagered this chain link" — HVY Take the Upper Hand). */
  | "wagers-this-chain-link"
  /** Attack reactions played or activated on the open chain link ("if you've
   * played or activated an attack reaction this chain link" — OUT Sneak
   * Attack). */

  /** Cards banished as a cost to play the resolving card ("X is 2 plus the
   * number of cards banished to play this" — HVY No Fear). */
  | "banished-to-play-this"
  /** Cards revealed by an effect earlier in the same resolution ("Create a
   * Might token for each card with 6 or more {p} revealed this way" — HVY
   * Cast Bones). */
  | "revealed-this-way"
  /** Evos the controller has equipped ("X is the number of Evos you have
   * equipped" — EVO Evo Upgrade family). */
  | "evos-equipped"
  /** Cards scrapped by this permanent's crank effects ("Gain {r}{r} for
   * each card this scrapped" — EVO Scrap Trader). */
  | "cards-scrapped-by-this"
  /** Cards banished from your soul this combat chain ("choose 1 for each
   * card you've banished from your soul this combat chain" — Battlefield
   * Beacon). */
  | "cards-banished-from-soul-this-combat-chain"
  /** Defending cards an opponent controls on the combat chain ("create a
   * Might token for each defending card controlled by an opponent" —
   * Arrogant Showboating). */
  | "defending-cards-controlled-by-opponent"
  /** Cards revealed by an effect earlier in the same resolution ("+X{p},
   * where X is the number of cards with 6 or more {p} revealed this way" —
   * Song of Sinew). */
  | "cards-revealed-this-way"
  /** Cards put on the bottom of a deck by an effect earlier in the same
   * resolution ("they draw a card for each card they put on the bottom this
   * way" — The Moat Exchange). */
  | "put-on-bottom-this-way"
  /** Cards drawn by an effect earlier in the same resolution ("Create
   * Seismic Surge tokens equal to the number of cards drawn this way" —
   * Tectonic Instability). */
  | "drawn-this-way"
  /** Cards put into a graveyard by an effect earlier in the same resolution
   * ("Create a Gold token for each yellow card put into your graveyard this
   * way" — SEA). */
  | "put-into-graveyard-this-way"
  /** Cards put into a hand by an effect earlier in the same resolution
   * ("deal arcane damage equal to the number of cards put into your hand
   * this way" — MON Sonata Arcanix). Not draw (CR putting into hand). */
  | "put-into-hand-this-way"
  /** Tokens created by an effect earlier in the same resolution ("If 3 or
   * more Runechants are created this way" — HNT Douse in Runeblood). */
  | "created-this-way"
  /** Cards put into the arena by an effect earlier in the same resolution
   * ("If two or more heroes put a card into the arena this way" — LSS
   * Drinking Buddy). */
  | "put-into-arena-this-way"
  /** Cards banished by an effect earlier in the same resolution ("Gain 1
   * action point for each Mechanologist card banished this way" — AIO Heavy
   * Industry Gear Shift). */
  | "banished-this-way"
  /** Cards charged to your hero's soul by an effect earlier in the same
   * resolution ("+1{p} for each Light card charged this way" — ASB V of the
   * Vanguard). */
  | "charged-this-way"
  /** Heroes who have lost {h} this turn ("create Runechant tokens equal to
   * the number of heroes who have lost {h} this turn" — DTD Deathly Wail). */
  | "heroes-lost-life-this-turn"
  /** Cards shuffled into a deck by an effect earlier in the same resolution
   * ("Shuffle all … chosen this way into your deck, then gain that much
   * {h}" — DTD Dig Up Dinner). */
  | "shuffled-this-way"
  /** Cards looked at by an effect earlier in the same resolution ("create a
   * Ponder token for each card looked at this way" — Blaze). */
  | "looked-at-this-way"
  /** Absolute life difference vs the opponent ("create that many tokens"
   * when you have less life — Awakening). */
  | "life-difference-vs-opponent"
  /** Greatest base value of a numeric property among matching objects on the
   * combat chain (Fractal Replication power/defense). The property is the
   * ability's `property` field when used on a static property ability. */
  | "greatest-base-stat-among"
  /** Base power of the source card ("+X{p} equal to its base {p}" — Tear
   * Limb From Limb). */
  | "base-power-of-source"
  /** Remaining combat damage that would be dealt to a hero ("while your
   * hero is the target of a source that would deal damage ≥ your {h}"). */
  | "pending-damage-to-hero"
  /** Highest printed power revealed this turn (Even Bigger Than That). */
  | "highest-power-revealed-this-turn";

export type FabAmount =
  | number
  | {
      type: "x";
      /** "{x}{x}" pays X twice; `plus` covers trailing "{r}"s. */ count?: number;
      plus?: number;
    }
  | { type: "y" }
  | { type: "z" }
  | {
      type: "count";
      what: FabCountable;
      zone?: FabZone;
      player?: FabPlayer;
      filter?: FabCardFilter;
      /** Counter kind being counted ("for each +1{p} counter on swords you
       * control" with what "counters-on-objects"). */
      counter?: FabCounter;
      /** Window the count is evaluated over (default: unbounded/current). */
      per?: "turn" | "chain-link";
      /** Fraction of the count ("remove half the Gold counters …, rounded
       * up" — SEA Treasure Island). */
      divisor?: number;
      rounding?: "up" | "down";
      /** Constant multiplication after counting ("+2 for each"). */
      multiplier?: number;
      /** Damage type counted ("the amount of arcane damage you've dealt this
       * turn" — SEA). */
      damageType?: FabDamageType;
      /** Constant added to the count ("X is 3 plus the number of Count Your
       * Blessings in your graveyard" — ROS). */
      plus?: number;
      /** Group matching plays and return the size of the largest name bucket
       * ("played 2 or more cards with the same name this turn"). */
      groupBy?: "name";
      /** Base numeric property read by `greatest-base-stat-among` (maximum)
       * or `discarded-this-way` (sum). Required for those countables. */
      property?: FabNumericProperty;
    }
  | {
      type: "reference";
      binding: string;
      /** Omitted when the binding is a bare number ("Choose a number" →
       * "that much"/"that many" — HVY Talk a Big Game). */
      property?: FabNumericProperty;
      /** Value to use when the numeric binding or referenced property is absent. */
      missing?: "zero";
    }
  | { type: "roll"; sides: number; count?: number }
  /** The amount of the event being replaced/modified ("you lose that much",
   * "create that many Vigor tokens" inside a replacement). */
  | { type: "event-amount" }
  /** Damage carried by the exact event that caused the resolving triggered
   * layer. Unlike a turn/chain-link count or batch `event-amount`, this keeps
   * "that much damage" scoped to one finalized hit/damage event. */
  | { type: "trigger-event-damage" }
  /** Highest (base) value of a numeric property among matching objects
   * ("This card's {p} is equal to the highest base {p} of weapons you
   * control"). */
  | {
      type: "max";
      property: FabNumericProperty;
      filter?: FabCardFilter;
      player?: FabPlayer;
      zones?: readonly FabZone[];
    }
  /** A numeric property of the object currently receiving a continuous
   * atom. This is distinct from the effect source (for example, Tear Limb
   * from Limb reads the future attack's base power). */
  | {
      type: "subject-property";
      property: FabNumericProperty;
      basis: "base" | "current";
      missing?: "zero";
    }
  /** Result of the die rolled earlier in this resolution ("This gets +X{p},
   * where X is the number rolled."). `divisor`/`rounding` cover "half the
   * number rolled, rounded down" (HVY Reckless Charge). */
  | { type: "roll-result"; divisor?: number; rounding?: "up" | "down" }
  | { type: "up-to"; amount: FabAmount }
  /** A hero's current numeric property ("draw up to their {i}" — Standing
   * Ovation). */
  | { type: "hero-property"; property: FabNumericProperty; player: FabPlayer }
  | { type: "sum" | "difference" | "negate" | "double"; operands: readonly FabAmount[] }
  /** The numeric value of the modified target's own keyword ("base {p} equal
   * to their ward" — MST Cosmo). */
  | { type: "keyword-value"; keyword: string }
  /** Conditional amount: "Ward X, where X is 3 if …. Otherwise, X is 1." */
  | { type: "conditional"; condition: FabCondition; then: FabAmount; else?: FabAmount };

/** Set quantifiers. Not numeric amounts — illegal as damage/life/stat. */
export type FabQuantifier = { type: "all" } | { type: "any-number" } | { type: "one-or-more" };

export type FabSelectionCount =
  | FabAmount
  | FabQuantifier
  | {
      type: "conditional";
      condition: FabCondition;
      then: FabSelectionCount;
      else?: FabSelectionCount;
    };

export function isQuantifier(count: FabSelectionCount): count is FabQuantifier {
  return (
    typeof count === "object" &&
    (count.type === "all" || count.type === "any-number" || count.type === "one-or-more")
  );
}

/** True when a selection count is a numeric amount (never a set quantifier). */
export function isFabAmount(count: FabSelectionCount): count is FabAmount {
  if (typeof count === "number") return true;
  if (count.type === "all" || count.type === "any-number" || count.type === "one-or-more") {
    return false;
  }
  if (count.type === "conditional") {
    return isFabAmount(count.then) && (count.else === undefined || isFabAmount(count.else));
  }
  return true;
}

/** Printed "up to N" — a player-chosen 0..N bound, not a mandatory count. */
export function isUpToCount(
  count: FabSelectionCount,
): count is Extract<FabAmount, { type: "up-to" }> {
  return typeof count === "object" && count.type === "up-to";
}
