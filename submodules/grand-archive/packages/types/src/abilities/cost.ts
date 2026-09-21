import type { GrandArchiveAmount, GrandArchiveSelectionCount } from "./amount.ts";
import type { GrandArchiveCardFilter } from "./filter.ts";
import type {
  GrandArchiveCounterKind,
  GrandArchiveRelativePlayer,
  GrandArchiveZone,
} from "./primitives.ts";
import type { GrandArchiveSubject, GrandArchiveTargetDeclaration } from "./selection.ts";

interface GrandArchiveCostBase {
  /** Captures what was paid for “that many” and “if you do” continuations. */
  readonly bindResultAs?: string;
}

export type GrandArchiveAtomicCost = GrandArchiveCostBase &
  (
    | { readonly kind: "pay-reserve"; readonly amount: GrandArchiveAmount }
    | { readonly kind: "pay-memory"; readonly amount: GrandArchiveAmount }
    | { readonly kind: "rest"; readonly subject: GrandArchiveSubject }
    | { readonly kind: "wake"; readonly subject: GrandArchiveSubject }
    | { readonly kind: "sacrifice"; readonly subject: GrandArchiveSubject }
    | { readonly kind: "banish-self" }
    | { readonly kind: "discard-self" }
    | { readonly kind: "move-self"; readonly from: GrandArchiveZone; readonly to: GrandArchiveZone }
    | { readonly kind: "delevel-champion" }
    | {
        readonly kind: "recover";
        readonly amount: GrandArchiveAmount;
        readonly requiresExact: true;
      }
    | {
        readonly kind: "take-damage";
        readonly subject: GrandArchiveSubject;
        readonly amount: GrandArchiveAmount;
        readonly preventable: false;
      }
    | {
        readonly kind: "select-and-sacrifice";
        readonly player: import("./primitives.ts").GrandArchivePlayerSet;
        readonly count: GrandArchiveSelectionCount;
        readonly filter?: GrandArchiveCardFilter;
      }
    | {
        readonly kind: "select-and-rest";
        readonly player: import("./primitives.ts").GrandArchivePlayerSet;
        readonly count: GrandArchiveSelectionCount;
        readonly filter?: GrandArchiveCardFilter;
      }
    | {
        readonly kind: "select-and-move";
        readonly player: import("./primitives.ts").GrandArchivePlayerSet;
        readonly from: GrandArchiveZone;
        readonly to: GrandArchiveZone;
        readonly count: GrandArchiveSelectionCount;
        readonly filter?: GrandArchiveCardFilter;
        readonly host?: GrandArchiveSubject;
        readonly relationship?: "controlled-by" | "owned-by" | "lineage-of";
        readonly random?: boolean;
        /** Every selected card must have a different value for this characteristic. */
        readonly distinctBy?: "name" | "type" | "class" | "element" | "subtype";
        readonly singleZoneOwner?: true;
        /** Constraint on the selected cards as a group, checked before paying. */
        readonly aggregateConstraint?: GrandArchiveTargetDeclaration["aggregateConstraint"];
      }
    | {
        readonly kind: "select-and-remove-counters";
        readonly player: import("./primitives.ts").GrandArchivePlayerSet;
        readonly subject?: GrandArchiveSubject;
        readonly objectFilter?: GrandArchiveCardFilter;
        readonly counter: GrandArchiveCounterKind;
        readonly count: GrandArchiveSelectionCount;
      }
    | {
        readonly kind: "add-counter" | "remove-counter";
        readonly subject: GrandArchiveSubject;
        readonly counter: GrandArchiveCounterKind;
        readonly amount: GrandArchiveAmount;
      }
    | {
        readonly kind: "reveal";
        readonly player: GrandArchiveRelativePlayer;
        readonly from: GrandArchiveZone;
        readonly count: GrandArchiveSelectionCount;
        readonly filter?: GrandArchiveCardFilter;
      }
    | {
        readonly kind: "select-and-reveal";
        readonly player: import("./primitives.ts").GrandArchivePlayerSet;
        readonly from: GrandArchiveZone;
        readonly count: GrandArchiveSelectionCount;
        readonly filter?: GrandArchiveCardFilter;
        readonly host?: GrandArchiveSubject;
        readonly relationship?: "banished-by" | "zone-of";
      }
  );

export type GrandArchiveAbilityCost =
  | GrandArchiveAtomicCost
  | {
      readonly kind: "all";
      readonly costs: readonly [GrandArchiveAbilityCost, ...GrandArchiveAbilityCost[]];
    }
  | {
      readonly kind: "one-of";
      readonly costs: readonly [
        GrandArchiveAbilityCost,
        GrandArchiveAbilityCost,
        ...GrandArchiveAbilityCost[],
      ];
    }
  | {
      readonly kind: "optional";
      readonly cost: GrandArchiveAbilityCost;
      readonly bindPaidAs: string;
    };
