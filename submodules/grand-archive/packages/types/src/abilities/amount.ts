import type { GrandArchiveCardFilter } from "./filter.ts";
import type {
  GrandArchiveBinding,
  GrandArchiveComparisonOperator,
  GrandArchiveCounterKind,
  GrandArchiveNumericProperty,
  GrandArchivePlayerSet,
  GrandArchiveRelativePlayer,
  GrandArchiveZone,
} from "./primitives.ts";

export type GrandArchiveAmount =
  | number
  | { readonly kind: "all" }
  | { readonly kind: "variable"; readonly symbol: "X" | "Y" | "Z" }
  | {
      readonly kind: "property";
      readonly subject: GrandArchiveValueSubject;
      readonly property: GrandArchiveNumericProperty;
      readonly basis: "base" | "current" | "last-known";
      readonly missing?: "zero";
    }
  | {
      readonly kind: "count";
      readonly collection: GrandArchiveCollection;
      readonly distinctBy?: "name" | "type" | "element" | "class" | "reserve-cost";
    }
  | {
      readonly kind: "counter-count";
      readonly subject: GrandArchiveValueSubject;
      readonly counter: GrandArchiveCounterKind;
      readonly basis?: "current" | "last-known";
      readonly missing?: "zero";
    }
  | {
      readonly kind: "sum-counters";
      readonly collection: GrandArchiveCollection;
      readonly counter: GrandArchiveCounterKind;
    }
  | {
      readonly kind: "aggregate-counter-count";
      readonly operation: "minimum" | "maximum" | "sum";
      readonly collection: GrandArchiveCollection;
      readonly counter: GrandArchiveCounterKind;
      readonly emptyValue?: number;
    }
  | {
      readonly kind: "aggregate-property";
      readonly operation: "minimum" | "maximum" | "sum";
      readonly collection: GrandArchiveCollection;
      readonly property: GrandArchiveNumericProperty;
      readonly basis: "base" | "current";
      readonly emptyValue?: number;
    }
  | {
      readonly kind: "longest-consecutive-property-run";
      readonly collections: readonly [
        GrandArchiveCollection,
        GrandArchiveCollection,
        ...GrandArchiveCollection[],
      ];
      readonly property: "reserve-cost";
      readonly basis: "base" | "current";
    }
  | { readonly kind: "binding"; readonly binding: GrandArchiveBinding }
  | {
      /** Cardinality of an identity collection captured by an earlier instruction. */
      readonly kind: "binding-count";
      readonly binding: GrandArchiveBinding;
    }
  | { readonly kind: "event-amount" }
  | {
      readonly kind: "event-total";
      readonly event: import("./trigger.ts").GrandArchiveEventPattern;
      readonly window: "this-turn" | "this-phase" | "this-attack" | "game";
      readonly metric: "event-amount" | "event-count";
    }
  | {
      readonly kind: "modified-ability-result-amount";
      readonly metric:
        | "cards-moved"
        | "counters-removed"
        | "damage-dealt"
        | "damage-prevented"
        | "objects-sacrificed";
    }
  | { readonly kind: "target-count"; readonly ability: "this" | "event-stack-item" }
  | {
      readonly kind: "activation-payment-card-count";
      readonly from?: GrandArchiveZone;
      readonly to?: GrandArchiveZone;
    }
  | { readonly kind: "die"; readonly sides: number; readonly count?: number }
  | {
      readonly kind: "player-property";
      readonly player: GrandArchiveRelativePlayer;
      readonly property: "influence" | "omens";
    }
  | {
      readonly kind: "aggregate-player-property";
      readonly operation: "minimum" | "maximum" | "sum";
      readonly players: GrandArchivePlayerSet;
      readonly property: "influence" | "omens";
      readonly emptyValue?: number;
    }
  | {
      /** Counts players whose specified zone satisfies the card-count comparison. */
      readonly kind: "player-zone-count";
      readonly players: GrandArchivePlayerSet;
      readonly zone: GrandArchiveZone;
      readonly filter?: GrandArchiveCardFilter;
      readonly comparison: {
        readonly operator: GrandArchiveComparisonOperator;
        readonly value: GrandArchiveAmount;
      };
    }
  | ({
      readonly kind: "calculate";
      readonly operands: readonly [GrandArchiveAmount, GrandArchiveAmount, ...GrandArchiveAmount[]];
    } & (
      | {
          readonly operator: "divide";
          /** Grand Archive rounds division down unless an effect explicitly says otherwise. */
          readonly rounding?: "up" | "down";
        }
      | {
          readonly operator: "add" | "subtract" | "multiply" | "minimum" | "maximum";
          readonly rounding?: never;
        }
    ))
  | {
      readonly kind: "conditional";
      readonly condition: import("./condition.ts").GrandArchiveCondition;
      readonly then: GrandArchiveAmount;
      readonly else: GrandArchiveAmount;
    };

export type GrandArchiveValueSubject =
  | { readonly kind: "source" }
  | { readonly kind: "ability-bearer" }
  | { readonly kind: "candidate" }
  | { readonly kind: "champion"; readonly player: GrandArchiveRelativePlayer }
  | { readonly kind: "mastery"; readonly player: GrandArchiveRelativePlayer; readonly name: string }
  | { readonly kind: "event-source" }
  | { readonly kind: "event-subject" }
  | { readonly kind: "stack-source"; readonly binding: GrandArchiveBinding }
  | { readonly kind: "event-recipient" | "event-attacker" }
  | { readonly kind: "linked-object" }
  | { readonly kind: "bound"; readonly binding: GrandArchiveBinding }
  | { readonly kind: "tracked"; readonly key: string }
  | { readonly kind: "player"; readonly player: GrandArchiveRelativePlayer };

export interface GrandArchiveCollection {
  readonly zones?: readonly GrandArchiveZone[];
  readonly player?: GrandArchivePlayerSet;
  /** Restrict a collection to cards/objects related to this host. */
  readonly host?: import("./selection.ts").GrandArchiveSubject;
  readonly relationship?:
    | "linked-to"
    | "loaded-into"
    | "lineage-of"
    | "banished-by"
    | "intent-of"
    | "activation-payment-of";
  readonly filter?: GrandArchiveCardFilter;
  readonly binding?: GrandArchiveBinding;
  /** Exclude the resolving/evaluated source from this collection (“each other card”). */
  readonly excludingSource?: true;
  readonly history?: {
    readonly event: import("./primitives.ts").GrandArchiveObservableEventName;
    readonly window: "this-turn" | "this-phase" | "this-attack" | "this-resolution";
    readonly keywordAction?: "brew" | "empower" | "gather" | "glimpse" | "scavenge" | "suppress";
    readonly from?: GrandArchiveZone;
  };
}

export type GrandArchiveSelectionCount =
  | { readonly kind: "exactly"; readonly amount: GrandArchiveAmount }
  | { readonly kind: "up-to"; readonly amount: GrandArchiveAmount }
  | { readonly kind: "at-least"; readonly amount: GrandArchiveAmount }
  | {
      readonly kind: "between";
      readonly minimum: GrandArchiveAmount;
      readonly maximum: GrandArchiveAmount;
    }
  | { readonly kind: "all" }
  | { readonly kind: "any-number" }
  | {
      /** The number selected is determined from game state before selection begins. */
      readonly kind: "conditional";
      readonly condition: import("./condition.ts").GrandArchiveCondition;
      readonly then: GrandArchiveSelectionCount;
      readonly else: GrandArchiveSelectionCount;
    };

export interface GrandArchiveComparison {
  readonly left: GrandArchiveAmount;
  readonly operator: GrandArchiveComparisonOperator;
  readonly right: GrandArchiveAmount;
}
