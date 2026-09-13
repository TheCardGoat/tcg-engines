/**
 * Card filters (CR 2.14 type-box + numeric comparisons).
 *
 * Target contract: docs/architecture/foundation-types.md
 */

import type {
  FabMetatype,
  FabSubtype,
  FabSupertype,
  FabTrait,
  FabType,
} from "../base-object-properties.ts";
import type { FabKeyword, FabLabelName } from "./keyword.ts";
import type {
  FabComparison,
  FabNumericProperty,
  FabTurnHistoryEvent,
  FabZone,
} from "./primitives.ts";
import type { FabAuthorableStatusMarker } from "../status-markers.ts";

// ---------------------------------------------------------------------------
// Card filter (2.14 typebox parts + numeric comparisons)
// ---------------------------------------------------------------------------

export interface FabNumericFilter {
  readonly property: FabNumericProperty;
  readonly basis: "base" | "current";
  readonly comparison: FabComparison;
}

/** Category-preserving CR 2.14 type-box predicate. */
export interface FabExactTypeBoxFilter {
  readonly metatypes?: readonly FabMetatype[];
  readonly supertypes?: readonly FabSupertype[];
  readonly types?: readonly FabType[];
  readonly subtypes?: readonly FabSubtype[];
  readonly traits?: readonly FabTrait[];
  readonly excludeMetatypes?: readonly FabMetatype[];
  readonly excludeSupertypes?: readonly FabSupertype[];
  readonly excludeTypes?: readonly FabType[];
  readonly excludeSubtypes?: readonly FabSubtype[];
  readonly excludeTraits?: readonly FabTrait[];
}

export interface FabCardFilter {
  /**
   * Explicit fail-closed authoring debt. A filter carrying this marker never
   * matches. It preserves source provenance without pretending prose tokens
   * are CR 2.14 type-box values.
   */
  unsupported?: {
    readonly kind: "unparsed-filter";
    readonly fragments: readonly string[];
  };
  name?: string;
  /** Share a name with the exact object captured in this binding. */
  sameNameAs?: { readonly binding: string };
  /** Exact type-box matching. This is the canonical authoring surface. */
  typeBox?: FabExactTypeBoxFilter;
  /**
   * Compare category values with an exact object captured by an earlier
   * effect. "a card of the same subtype" means the two subtype sets overlap;
   * no synthetic subtype token is introduced.
   */
  sameTypeBoxAs?: {
    readonly binding: string;
    readonly categories: readonly ("metatypes" | "supertypes" | "types" | "subtypes" | "traits")[];
    readonly comparison: "overlap";
  };
  /** Substring match on the object's name ("with Sigil in its name"). */
  nameContains?: string;
  /** Moniker (2.7.3) — e.g. "Arakni" matching any Arakni-named object. */
  moniker?: string;
  pitch?: readonly (1 | 2 | 3 | 4)[];
  pitchAsset?: "resource" | "chi";
  /** Card color; "chosen" refers to a color chosen by an earlier effect
   * ("cards of the chosen color" — AAZ Barbed Undertow); "same-as-banished"
   * matches the color of the card banished earlier in the same resolution
   * (MST Persuasive Prognosis); "same-as-revealed" matches the color of the
   * card revealed earlier in the same resolution (EVO Prismatic Lens). */
  color?: readonly (
    | "red"
    | "yellow"
    | "blue"
    | "purple"
    | "chosen"
    | "same-as-banished"
    | "same-as-revealed"
  )[];
  cost?: FabComparison;
  power?: FabComparison;
  defense?: FabComparison;
  /** Unambiguous numeric-property comparison for rules evaluation. */
  numeric?: readonly FabNumericFilter[];
  hasKeyword?: FabKeyword["name"];
  /** Label keyword grouping (8.4) — "a card with combo". */
  hasLabel?: FabLabelName;
  /** Property-existence inference (1.8.7). */
  hasProperty?: FabNumericProperty;
  /** Property absence (e.g. "cards with no {d}"). NOTE: do NOT confuse this with
   *  "non-block cards" — Block is a card TYPE (CR 8.1.12), so a "non-block card"
   *  is one NOT of type Block (use `typeBox.excludeTypes: ["Block"]`), not a card
   *  lacking {d}. Action cards have {d} yet are non-block. */
  lacksProperty?: FabNumericProperty;
  /** Restricts to cards played from the given zones ("played from your
   * banished zone"). */
  playedFromZones?: readonly FabZone[];
  /** True CR object status ("sharpened", "frozen"). Derived this-turn facts are not statuses. */
  hasStatus?: FabAuthorableStatusMarker;
  /** The object's controller performed this turn-history event. */
  controllerPerformedThisTurn?: FabTurnHistoryEvent;
  /** The object's controller currently controls an arena object matching this filter. */
  controllerControls?: FabCardFilter;
  /** The object was banished face-down by intimidate during this turn. */
  banishedByIntimidateThisTurn?: true;
  /** The object's controller destroyed a token with this printed name this turn. */
  controllerDestroyedTokenThisTurn?: string;
  /** This object dealt damage to the ability controller this turn. */
  dealtDamageToControllerThisTurn?: true;
  /** This play is the first card of its attack / non-attack type this turn. */
  firstOfTypeThisTurn?: true;
  /** Restricts the object to the exact LKI cohort exported by an earlier
   * effect in this execution (for example, cards "revealed this way"). */
  inObjectBinding?: string;
  /** Object is currently defending ("a card defending a sword attack"). */
  defending?: boolean;
  /** The exact object incarnation paid the optional boost cost when played. */
  wasBoosted?: true;
  /** The attack being defended ("a card defending an Assassin attack"). */
  defendingAgainst?: FabCardFilter;
  /** Object must not have the named counter ("with no holo counters"). */
  lacksCounter?: string;
  /** Object must have a counter of the named kind ("equipment they control
   * with -1{d} counters" — Smelting of the Old Ones). */
  hasCounter?: string;
  /** Chosen cards must all have different names ("choose 2 attack action
   * cards with different names" — Call for Backup). */
  differentNames?: boolean;
  and?: readonly FabCardFilter[];
  or?: readonly FabCardFilter[];
}
