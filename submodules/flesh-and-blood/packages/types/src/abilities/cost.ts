/**
 * Costs (CR 1.14).
 *
 * Target contract: docs/architecture/foundation-types.md
 */

import type { FabAmount, FabSelectionCount } from "./amount.ts";
import type { FabCardFilter } from "./filter.ts";
import type { FabCounter, FabPlayer, FabZone } from "./primitives.ts";
import type { FabTarget } from "./target.ts";

// ---------------------------------------------------------------------------
// Costs (1.14)
// ---------------------------------------------------------------------------

interface FabCostBase {
  /** Optional additional cost (5.1.3b). */
  optional?: boolean;
  /** Captures paid-cost output for connected ability pairs (1.7.6). */
  outputBinding?: string;
}

export type FabCost = FabCostBase &
  (
    | { class: "asset"; type: "resources"; amount: FabAmount }
    | { class: "asset"; type: "chi"; amount: FabAmount }
    | { class: "asset"; type: "life"; amount: FabAmount }
    | { class: "asset"; type: "action-points"; amount: 1 }
    /** "{p}{p}" — power paid by the attacking object (DYN Suraya). */
    | { class: "asset"; type: "power"; amount: FabAmount }
    | {
        class: "effect";
        type: "discard";
        count: FabSelectionCount;
        filter?: FabCardFilter;
        random?: boolean;
        from?: FabZone;
      }
    | {
        class: "effect";
        type: "banish";
        /** "hand-or-arsenal": the payer chooses one card from either zone
         * ("banish Minerva Themis from your hand or arsenal" — DTD Morlock
         * Hill). "under-this": a card under the activating permanent
         * ("Banish a card from under Nitro Mechanoid" — DYN). */
        from:
          | "graveyard"
          | "hand"
          | "deck-top"
          | "arena"
          | "soul"
          | "hand-or-arsenal"
          | "under-this";
        count: FabSelectionCount;
        filter?: FabCardFilter;
        random?: boolean;
        /** Lower bound for "banish 1 or more …" optional costs. */
        min?: FabAmount;
        /** Banished face-down ("banish a card from your hand face down" —
         * UZU Uzuri). */
        faceDown?: boolean;
      }
    | {
        class: "effect";
        type: "destroy-self";
        /** Delayed cost: "destroy this when the combat chain closes" /
         * "destroy this when the chain link resolves" (Bait). */
        delayed?: "combat-chain-close" | "chain-link-resolve";
      }
    /** "Banish this" as an activation cost (Radiant View / Radiant family). */
    | { class: "effect"; type: "banish-self" }
    /** "destroy a Gold you control" (as a cost). */
    | {
        class: "effect";
        type: "destroy";
        filter?: FabCardFilter;
        count?: FabSelectionCount;
        /** "Destroy a card under this" (Evo Instant). Hosted sub-cards, CR 3.0.14. */
        from?: "under-this";
      }
    | { class: "effect"; type: "tap-self" }
    /** "{t} your hero". */
    | { class: "effect"; type: "tap-hero" }
    /** "{t} a cog you control" — tap another object as a cost. */
    | { class: "effect"; type: "tap"; filter: FabCardFilter; count?: FabSelectionCount }
    /** "{u} a cog you control" — untap another object as a cost (Backspin
     * Thrust). */
    | { class: "effect"; type: "untap"; filter: FabCardFilter; count?: FabSelectionCount }
    /** "discard this" (from hand, as an activation cost). */
    | { class: "effect"; type: "discard-self" }
    | {
        class: "effect";
        type: "remove-counters";
        counter: FabCounter;
        count: FabSelectionCount;
        /** Lower bound for "remove 1 or more … counters" (player chooses). */
        min?: FabAmount;
        /** Object the counters are removed from ("an attacking sword you control"). */
        filter?: FabCardFilter;
        /** Zone of the source object ("on the active chain link"). */
        zone?: FabZone;
      }
    /** "put a rust counter on this" as an activation cost (Talishar). */
    | {
        class: "effect";
        type: "add-counter";
        counter: FabCounter;
        count: FabSelectionCount;
        target?: FabTarget;
      }
    | {
        class: "effect";
        type: "reveal";
        from: "hand" | "inventory";
        filter: FabCardFilter;
        count?: FabSelectionCount;
      }
    /** "put a card from your hand on the bottom of your deck" (additional
     * cost, e.g. Enlightened Strike). */
    | {
        class: "effect";
        type: "move-to-deck";
        /** "self": the card moves itself ("put this on the bottom of your
         * deck" — Never Give Up). "arsenal": "put a card from your arsenal
         * on the bottom of your deck" (ROS Seeds of Tomorrow).
         * "hand-and-arsenal": "put 2 cards from your hand and/or arsenal on
         * the bottom of your deck" (MST Longdraw Half-glove). */
        from: "hand" | "self" | "arsenal" | "hand-and-arsenal";
        /** "shuffle": shuffled into the deck, no fixed position ("shuffle
         * this into its owner's deck" — DYN Imperial Ledger). */
        position: "top" | "bottom" | "shuffle" | { index: number };
        count: FabSelectionCount;
        filter?: FabCardFilter;
      }
    | {
        class: "effect";
        type: "turn-face-down" | "turn-face-up";
        target: FabTarget;
        /** Binds the turned card for "If it's …" follow-ups (Lexi's
         * turn-face-up arsenal cost). */
        outputBinding?: string;
      }
    /** "create a Soul Shackle token" (Chane) — token creation as a cost. */
    | {
        class: "effect";
        type: "create-token";
        token: string;
        controller: FabPlayer;
      }
    /** "charge your hero's soul" (ASB optional additional cost); `repeat`
     * covers "any number of times" (V of the Vanguard). */
    | { class: "effect"; type: "charge"; repeat?: boolean }
    | { class: "mixed"; type: "all"; costs: readonly FabCost[] }
    | { class: "mixed"; type: "alternative"; costs: readonly FabCost[] }
  );
