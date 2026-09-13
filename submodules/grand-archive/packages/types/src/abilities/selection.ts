import type { GrandArchiveSelectionCount } from "./amount.ts";
import type { GrandArchiveCardFilter } from "./filter.ts";
import type {
  GrandArchiveBinding,
  GrandArchiveRelativePlayer,
  GrandArchiveZone,
} from "./primitives.ts";

export type GrandArchiveSubject =
  | { readonly kind: "source" }
  /** Object currently carrying the ability; differs from `source` for inherited/granted abilities. */
  | { readonly kind: "ability-bearer" }
  | { readonly kind: "candidate" }
  | { readonly kind: "controller" }
  | { readonly kind: "champion"; readonly player: GrandArchiveRelativePlayer }
  | { readonly kind: "mastery"; readonly player: GrandArchiveRelativePlayer; readonly name: string }
  | { readonly kind: "player"; readonly player: import("./primitives.ts").GrandArchivePlayerSet }
  | { readonly kind: "event-source" | "event-subject" | "event-recipient" | "event-attacker" }
  | { readonly kind: "current-attack" }
  | { readonly kind: "attacks-by"; readonly attacker: GrandArchiveSubject }
  | { readonly kind: "linked-object" }
  | { readonly kind: "tracked"; readonly key: string }
  | {
      readonly kind: "binding-remainder";
      readonly binding: GrandArchiveBinding;
      readonly excluding:
        | GrandArchiveBinding
        | readonly [GrandArchiveBinding, ...GrandArchiveBinding[]];
    }
  | { readonly kind: "stack-source"; readonly binding: GrandArchiveBinding }
  | {
      readonly kind: "related";
      readonly subject: GrandArchiveSubject;
      readonly relation: "attacker" | "controller" | "host" | "owner";
    }
  | { readonly kind: "bound"; readonly binding: GrandArchiveBinding }
  | { readonly kind: "each"; readonly collection: import("./amount.ts").GrandArchiveCollection };

interface GrandArchiveSelectionCore {
  readonly id: GrandArchiveBinding;
  readonly chooser: import("./primitives.ts").GrandArchivePlayerSet;
  readonly count: GrandArchiveSelectionCount;
  /** Require the chooser to submit the complete selection in the desired order. */
  readonly ordered?: true;
  /** Omitted means the chooser selects; random selections are performed by the engine. */
  readonly method?: "random";
  readonly aggregateConstraint?: {
    readonly property: "reserve-cost" | "memory-cost" | "power" | "life" | "level";
    readonly operation: "sum";
    readonly operator: import("./primitives.ts").GrandArchiveComparisonOperator;
    readonly value: import("./amount.ts").GrandArchiveAmount;
    readonly basis: "base" | "current";
  };
  readonly extreme?: {
    readonly property: "reserve-cost" | "memory-cost" | "power" | "life" | "level";
    readonly operation: "minimum" | "maximum";
    readonly basis: "base" | "current";
  };
  readonly allShareCharacteristic?:
    | "name"
    | "type"
    | "subtype"
    | "element"
    | "class"
    | "reserve-cost";
  /** All selected cards must come from zones owned by one player. */
  readonly singleZoneOwner?: true;
}

type GrandArchiveSelectionBase = GrandArchiveSelectionCore &
  (
    | {
        /** Optional authoring assertion; distinct identities are the rules default. */
        readonly unique?: true;
        readonly allowRepeated?: never;
      }
    | {
        readonly unique?: never;
        /** Printed permission to choose the same identity more than once. */
        readonly allowRepeated: true;
      }
  );

type GrandArchiveCardZone = Exclude<GrandArchiveZone, "field" | "effects-stack" | "pantheon">;

type GrandArchiveOrderedZoneSlice =
  | { readonly fromTop?: never; readonly fromBottom?: never }
  | { readonly fromTop: true; readonly fromBottom?: never }
  | { readonly fromBottom: true; readonly fromTop?: never };

export type GrandArchiveCardSelectionCandidates =
  | ({
      readonly kind: "card";
      readonly zones: readonly GrandArchiveCardZone[];
      readonly host?: GrandArchiveSubject;
      readonly relationship?:
        | "controlled-by"
        | "owned-by"
        | "zone-of"
        | "lineage-of"
        | "banished-by";
      readonly player?: import("./primitives.ts").GrandArchivePlayerSet;
      readonly filter?: GrandArchiveCardFilter;
    } & GrandArchiveOrderedZoneSlice)
  | {
      readonly kind: "card";
      readonly binding: GrandArchiveBinding;
      readonly excluding?: readonly [GrandArchiveBinding, ...GrandArchiveBinding[]];
      readonly zones?: never;
      readonly filter?: GrandArchiveCardFilter;
    };

export type GrandArchiveSelectionCandidates =
  | GrandArchiveCardSelectionCandidates
  | { readonly kind: "catalog-card"; readonly filter: GrandArchiveCardFilter }
  | {
      readonly kind: "union";
      readonly sources: readonly [
        GrandArchiveCardSelectionCandidates,
        GrandArchiveCardSelectionCandidates,
        ...GrandArchiveCardSelectionCandidates[],
      ];
    }
  | {
      readonly kind: "object";
      readonly zones: readonly "field"[];
      readonly host?: GrandArchiveSubject;
      readonly relationship?:
        | "controlled-by"
        | "owned-by"
        | "zone-of"
        | "lineage-of"
        | "banished-by";
      readonly player?: import("./primitives.ts").GrandArchivePlayerSet;
      readonly filter?: GrandArchiveCardFilter;
    }
  | {
      readonly kind: "player";
      readonly players:
        | readonly GrandArchiveRelativePlayer[]
        | import("./primitives.ts").GrandArchivePlayerSet;
      /** Announcement-time eligibility evaluated for each candidate player. */
      readonly zoneCount?: {
        readonly zone: GrandArchiveZone;
        readonly filter?: GrandArchiveCardFilter;
        readonly operator: import("./primitives.ts").GrandArchiveComparisonOperator;
        readonly value: import("./amount.ts").GrandArchiveAmount;
      };
      readonly property?: {
        readonly name: "influence" | "omens";
        readonly operator: import("./primitives.ts").GrandArchiveComparisonOperator;
        readonly value: import("./amount.ts").GrandArchiveAmount;
      };
    }
  | {
      readonly kind: "stack-item";
      readonly itemTypes?: readonly ("ability" | "card-activation" | "materialization")[];
      readonly abilityKinds?: readonly ("activated" | "triggered")[];
      /** Match one of several stack-source classifications while sharing the remaining constraints. */
      readonly anyOf?: readonly [
        {
          readonly itemTypes?: readonly ("ability" | "card-activation" | "materialization")[];
          readonly abilityKinds?: readonly ("activated" | "triggered")[];
          readonly sourceFilter?: GrandArchiveCardFilter;
        },
        {
          readonly itemTypes?: readonly ("ability" | "card-activation" | "materialization")[];
          readonly abilityKinds?: readonly ("activated" | "triggered")[];
          readonly sourceFilter?: GrandArchiveCardFilter;
        },
        ...{
          readonly itemTypes?: readonly ("ability" | "card-activation" | "materialization")[];
          readonly abilityKinds?: readonly ("activated" | "triggered")[];
          readonly sourceFilter?: GrandArchiveCardFilter;
        }[],
      ];
      readonly controller?: GrandArchiveRelativePlayer;
      readonly sourceFilter?: GrandArchiveCardFilter;
      readonly targeting?: {
        readonly player?: import("./primitives.ts").GrandArchivePlayerSet;
        readonly filter?: GrandArchiveCardFilter;
        readonly subject?: GrandArchiveSubject;
      };
      readonly activationFrom?: readonly GrandArchiveZone[];
    }
  | {
      readonly kind: "number";
      readonly minimum: import("./amount.ts").GrandArchiveAmount;
      /** Omitted for an unbounded non-negative integer choice. */
      readonly maximum?: import("./amount.ts").GrandArchiveAmount;
    }
  | {
      readonly kind: "option";
      readonly options: readonly [string, string, ...string[]];
    }
  | {
      readonly kind: "characteristic";
      readonly characteristic: "card-name" | "type" | "class" | "element" | "subtype";
      readonly optionsFrom?: GrandArchiveCardFilter;
    };

/** Targets are locked during announcement and rechecked during resolution. */
export type GrandArchiveTargetDeclaration = GrandArchiveSelectionBase & {
  readonly kind: "target";
  readonly declared: "announcement";
  readonly candidates: GrandArchiveSelectionCandidates;
};

/** A choice is made only when its instruction resolves and does not cause a fizzle. */
export type GrandArchiveResolutionChoice = GrandArchiveSelectionBase & {
  readonly kind: "choice";
  readonly declared: "resolution" | "event-processing";
  readonly candidates: GrandArchiveSelectionCandidates;
  readonly random?: boolean;
};

export type GrandArchiveSelection = GrandArchiveTargetDeclaration | GrandArchiveResolutionChoice;
