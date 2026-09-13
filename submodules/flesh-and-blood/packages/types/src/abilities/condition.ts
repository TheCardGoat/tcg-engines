/**
 * Conditions.
 *
 * Target contract: docs/architecture/foundation-types.md
 */

import type { FabAmount } from "./amount.ts";
import type { FabCardFilter } from "./filter.ts";
import type { FabKeyword } from "./keyword.ts";
import type {
  FabComparison,
  FabComparisonOp,
  FabCounter,
  FabDamageType,
  FabNumericProperty,
  FabPlayer,
  FabTurnHistoryEvent,
  FabZone,
} from "./primitives.ts";
import type { FabTarget } from "./target.ts";
import type { FabAuthorableStatusMarker, FabStatusMarker } from "../status-markers.ts";

// ---------------------------------------------------------------------------
// Conditions
// ---------------------------------------------------------------------------

export type FabCondition =
  | { type: "and" | "or"; conditions: readonly FabCondition[] }
  | { type: "not"; condition: FabCondition }
  | { type: "compare-amount"; amount: FabAmount; comparison: FabComparison }
  | {
      type: "zone-count";
      zone: FabZone;
      player: FabPlayer;
      filter?: FabCardFilter;
      comparison: FabComparison;
      /** Window the count is evaluated over ("… has been put into your
       * graveyard this turn"). */
      per?: "turn" | "chain-link";
    }
  | {
      type: "has-counter";
      counter: FabCounter;
      target?: FabTarget;
      comparison?: FabComparison;
    }
  | { type: "chain-link-count"; comparison: FabComparison }
  | {
      /** Count attacks on the open combat chain by their chain-link LKI. */
      type: "combat-chain-attack-count";
      player: FabPlayer;
      power: "greater-than-base";
      comparison: FabComparison;
    }
  /** Objects that left the arena within the window ("3 or more auras of
   * suspense have left the arena this turn" — Standing Ovation). */
  | {
      type: "left-arena-count";
      filter?: FabCardFilter;
      comparison: FabComparison;
      per?: "turn";
    }
  | { type: "chain-link-property"; property: "has-hit" | "link-number"; comparison?: FabComparison }
  | { type: "attack-power" | "attack-defense"; comparison: FabComparison }
  /** Compare two numeric views of the same object. This represents printed
   * conditions such as "its power is greater than its base power" without a
   * fabricated status marker. */
  | {
      type: "object-numeric-comparison";
      target?: FabTarget;
      property: FabNumericProperty;
      left: "base" | "current";
      op: FabComparisonOp;
      right: "base" | "current";
      multiplier?: number;
    }
  | {
      type: "life-comparison";
      player: "self" | "iteration-subject";
      /** "each-other-hero" / "each-hero": true when the comparison holds
       * against every other seated hero (Never Give Up: less {h} than each
       * hero). Self is never in the compared set — 1v1 "each hero" is the
       * opponent. "fixed": compare against a constant (MST Heirlooms). */
      vs: "controller" | "opponent" | "each-other-hero" | "each-hero" | "attacking-hero" | "fixed";
      op: FabComparisonOp;
      /** Constant for vs "fixed". */
      value?: number;
    }
  | {
      type: "damage-dealt";
      damageType?: FabDamageType;
      player: FabPlayer;
      per: "turn" | "chain-link";
      comparison: FabComparison;
    }
  | {
      /**
       * Damage dealt to a named player. This is intentionally turn-scoped:
       * unlike damage dealt, the engine does not maintain a chain-link
       * received-damage ledger, so that illegal semantic state is unrepresentable.
       */
      type: "damage-taken";
      damageType?: FabDamageType;
      player: FabPlayer;
      per: "turn";
      comparison: FabComparison;
    }
  /**
   * Per-SOURCE damage dealt ("If this deals more than N damage" — Surge, CR
   * 8.4.8). Distinct from `damage-dealt` which is player-total scoped. Reads
   * the source object's own realized damage from the rules-view fact layer.
   */
  | {
      type: "source-damage-dealt";
      per: "turn" | "chain-link";
      comparison: FabComparison;
      /**
       * Restrict to damage dealt to a hero ("...to a hero" Surge, CR 8.4.8 —
       * Pop the Bubble, Sap). When omitted, all damage by the source counts.
       */
      toHero?: boolean;
    }
  | {
      type: "played-this";
      per: "turn" | "chain-link";
      filter: FabCardFilter;
      comparison?: FabComparison;
      /**
       * Restrict to the condition's subject/source object: "this was played
       * from [zone]". Evaluated as the stamped played-from declaration fact,
       * with the still-seated zone as the play-quote fallback (CR 5.1.4
       * declaration). Raw move history is deliberately NOT consulted —
       * zone round-trips would wrongly satisfy the gate.
       */
      onlySource?: true;
    }
  | { type: "has-keyword"; keyword: FabKeyword["name"]; target?: FabTarget }
  /** Compares the result of a die rolled earlier in this resolution against
   * a constant ("On; 1 or 2 - … 3 or 4 - … 5 or 6 - …" — TCC Crazy Brew). */
  | { type: "die-result"; comparison: FabComparison }
  | {
      /** Whether the selected player performed a typed event this turn. */
      type: "performed-this-turn";
      event: FabTurnHistoryEvent;
      player:
        | "controller"
        | "self"
        | "opponent"
        | "another-hero"
        | "each-other-hero"
        | "iteration-subject"
        | "any"
        | "each";
    }
  /** Whether a sword controlled by the ability controller hit this turn. */
  | { type: "sword-hit-this-turn" }
  /** Whether another weapon controlled by the ability controller gained go again this turn. */
  | { type: "another-weapon-gained-go-again-this-turn" }
  /**
   * Evaluation may still see leftover catalog slugs until those modules
   * migrate. Authoring forbids derived-fact slugs via
   * {@link AuthoringHasStatusConstraint} on defineFleshAndBloodCard.
   */
  | {
      type: "has-status";
      status: FabAuthorableStatusMarker | FabStatusMarker;
      /** Object whose status is tested. Omitted means the ability source. */
      target?: FabTarget;
    }
  /** Exact topology predicate for Material: the ability source is a direct
   * subcard of one live host. This is not a derived status marker. */
  | {
      type: "source-is-subcard-of-host";
      /**
       * "While this is under a permanent other than <Name>" (DYN Ash
       * materials): only a host whose printed name differs from this value
       * qualifies. Omitted = any host (generic Ash token).
       */
      hostOtherThan?: string;
    }
  | { type: "is-marked"; target: FabTarget }
  | {
      type: "control-object";
      filter: FabCardFilter;
      player?: FabPlayer;
      /** Restrict controlled objects to exact catalog zones. */
      zones?: readonly FabZone[];
      /** "If you've controlled a Vigor this turn" — current control or this-turn history. */
      per?: "turn";
    }
  | {
      type: "equipped-count";
      filter?: FabCardFilter;
      comparison: FabComparison;
      player?: FabPlayer;
    }
  | { type: "pitch-zone-has"; filter: FabCardFilter }
  | { type: "binding-matches"; binding: string; filter: FabCardFilter }
  /**
   * Numeric binding comparison ("if you gain no Silver this way" — Genis).
   * Missing binding is treated as 0.
   */
  | {
      type: "binding-numeric";
      binding: string;
      comparison: FabComparison;
    }
  | { type: "target-exists"; target: FabTarget }
  | { type: "turn-player"; who: "self" | "opponent" }
  /** The current turn phase ("during an action phase" — SEA253 draw tax). */
  | { type: "phase-is"; phase: "start" | "action" | "end" }
  | {
      type: "defended-this-chain-link";
      filter?: FabCardFilter;
      /** Restrict the defending cohort by its declaration origin. */
      from?: "hand";
    }
  /**
   * Combo (CR 8.4.1): last attack on the current combat chain matches the
   * prerequisite. Any of names / nameIncludes / color / filter may be set;
   * all provided clauses must hold (AND). Multiple names = OR of exact names.
   */
  | {
      type: "last-attack-this-combat-chain";
      /** Exact printed name(s); last attack name must equal one of these. */
      names?: readonly string[];
      /** Substring match(es) on last attack name ("Gustwave", "Vengeance"). */
      nameIncludes?: readonly string[];
      /** Color of the last attack (AAC color strip). */
      color?: "Red" | "Yellow" | "Blue";
      /** Additional type/filter constraints (e.g. Action + Attack). */
      filter?: FabCardFilter;
    }
  /**
   * Last completed attack this turn matches printed name(s)
   * ("if the last attack this turn was Hatchet of Mind").
   */
  | { type: "last-attack-this-turn"; names: readonly string[] }
  /**
   * The last action card this player played this turn matches `filter`
   * ("if the last action card you played this turn is Lightning").
   */
  | {
      type: "last-action-this-turn";
      filter: FabCardFilter;
      /** Ignore this resolving action when its play is already the latest history entry. */
      excludeSource?: true;
    }
  /**
   * This object moved between zones this turn ("if this was banished from
   * your hand this turn" / "if this defended this turn").
   */
  | {
      type: "moved-this-turn";
      from?: FabZone;
      to?: FabZone;
      onlySource?: true;
    };
