/**
 * Targets (CR 1.8.5 / 1.8.6).
 *
 * Target contract: docs/architecture/foundation-types.md
 */

import type { FabSelectionCount } from "./amount.ts";
import type { FabCardFilter } from "./filter.ts";
import type { FabPlayer, FabZone } from "./primitives.ts";

// ---------------------------------------------------------------------------
// Targets (1.8.5 / 1.8.6)
// ---------------------------------------------------------------------------

export type FabTarget =
  | { selector: "self" }
  | {
      selector: "this-attack";
      /** Optional printed restriction on the active attack's physical source
       * (for example, "target weapon attack you control"). */
      filter?: FabCardFilter;
    }
  /**
   * The active attack-proxy represented by this effect's source.
   *
   * Unlike `this-attack`, this selector is empty when another object is the
   * active attack-source. It models printed text such as "this card's
   * attacks" without coupling authored behavior to a canonical card id.
   */
  | { selector: "attack-from-source" }
  | { selector: "attacking-hero" | "defending-hero" }
  | { selector: "attack-target" }
  | { selector: "controller" | "opponent" | "any-hero" }
  /** Unified hero vocabulary. Prefer this over duplicated hero selectors. */
  | { selector: "hero"; who: FabPlayer }
  /** The winner of a wager ("The winner loses 1{h}."). */
  | { selector: "winner" }
  /** Iteration over every hero ("each hero …"). */
  | { selector: "each-hero" }
  /** Iteration over every hero other than the controller ("each other hero
   * …" — TCC multiplayer cards). */
  | { selector: "each-other-hero" }
  /**
   * Strict unique life maximum / minimum among all heroes. Empty set when the
   * rank is tied (CR-facing "more/less {h} than all other heroes").
   */
  | { selector: "highest-life-hero" | "lowest-life-hero" }
  /** Current `for-each` hero subject (see FabPlayer `"iteration-subject"`). */
  | { selector: "iteration-subject" }
  | { selector: "host" | "sub-cards" }
  /** Reference to cards bound by an earlier step; `exclude` names another
   * binding whose cards are removed from the set ("put the other on top of
   * your deck" — Call for Backup). */
  | {
      selector: "binding";
      binding: string;
      exclude?: string;
      /** Restrict the bound set ("pitch a blue card from among them"). */
      filter?: FabCardFilter;
      /** How many of the bound cards to choose ("choose 1 of them"). */
      count?: FabSelectionCount;
    }
  | {
      selector: "object";
      /** "on-stack": targeted effect, declared when the layer is put on the
       * stack (1.8.5, 5.1.4). "at-resolution": non-target subject, determined
       * when the effect is generated (1.8.5c, 1.8.6). */
      declared: "on-stack" | "at-resolution";
      player?: FabPlayer;
      /** Which relationship `player` describes. Defaults to current control
       * (or the owning zone for cards outside the arena/stack). Printed
       * "cards they own" must use `owner`, because control can change. */
      playerRelation?: "controller" | "owner";
      zones: readonly FabZone[];
      /** Deck position selector ("the top card of your deck"). */
      position?: "top" | "bottom";
      filter?: FabCardFilter;
      /** A relation to the immutable event that caused a triggered layer.
       * This is intentionally structural rather than a fabricated status or
       * card-specific predicate. */
      relation?: { kind: "other-ally-controlled-by-hit-target" };
      count: FabSelectionCount;
      /** @deprecated Prefer `count: { type: "up-to" | "any-number" }`. */
      upTo?: boolean;
      /** Random selection ("reveals a random card from their hand"). */
      random?: boolean;
      /** Discard-all-but / selection floor ("they discard all but 1 card
       * from their hand" — HVY Judge, Jury, Executioner). */
      keep?: number;
      /**
       * Who answers the at-resolution selection when not the layer controller.
       * Distinct from `player` (which zones/seats are scanned). Printed
       * "they destroy a permanent they control" uses player+chooser opponent;
       * "deal damage to any opposing target" leaves chooser unset so the
       * controller picks among opponent-zone candidates.
       */
      chooser?: FabPlayer;
      /** A hero declared as the target of an effect that observes cards in
       * that hero's zones. The cards are non-target subjects determined at
       * resolution; only the hero is declared under CR 1.8.5. */
      playerTarget?: Exclude<FabTarget, { selector: "object" | "binding" }>;
      /** Stable authored name for reusing one declared hero across later
       * private-zone leaves in the same layer. The declaration is persisted
       * in the layer target map, not reconstructed from live state. */
      playerTargetBinding?: string;
    };
