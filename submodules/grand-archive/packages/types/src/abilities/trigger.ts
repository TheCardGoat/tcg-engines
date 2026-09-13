import type { GrandArchiveCondition } from "./condition.ts";
import type { GrandArchiveCardFilter } from "./filter.ts";
import type {
  GrandArchiveBinding,
  GrandArchiveCounterKind,
  GrandArchiveObservableEventName,
  GrandArchivePhase,
  GrandArchiveRelativePlayer,
  GrandArchiveZone,
} from "./primitives.ts";

export type GrandArchiveEventSubject =
  | { readonly kind: "any" }
  | {
      readonly kind: "any-of";
      readonly subjects: readonly [
        GrandArchiveEventSubject,
        GrandArchiveEventSubject,
        ...GrandArchiveEventSubject[],
      ];
    }
  | { readonly kind: "source" }
  | { readonly kind: "ability-bearer" }
  | {
      readonly kind: "event-object";
      readonly controller?: GrandArchiveRelativePlayer;
      readonly owner?: GrandArchiveRelativePlayer;
      readonly filter?: GrandArchiveCardFilter;
      readonly bindAs?: GrandArchiveBinding;
    }
  | {
      readonly kind: "bound-object";
      readonly binding: GrandArchiveBinding;
      readonly filter?: GrandArchiveCardFilter;
    }
  | { readonly kind: "linked-object" };

interface GrandArchiveEventPatternBase<Name extends GrandArchiveObservableEventName> {
  readonly name: Name;
  readonly actor?: GrandArchiveRelativePlayer;
  readonly subject?: GrandArchiveEventSubject;
  readonly occurrence?: {
    readonly count: number;
    readonly window: "this-turn" | "game";
    readonly actorScope?: "same-player";
  };
  readonly condition?: GrandArchiveCondition;
}

export type GrandArchiveEventPattern =
  | (GrandArchiveEventPatternBase<"phase-begins"> & { readonly phase: GrandArchivePhase })
  | GrandArchiveEventPatternBase<"turn-begins">
  | (GrandArchiveEventPatternBase<"damage-dealt" | "damage-prevented"> & {
      readonly recipient?: GrandArchiveEventSubject;
      readonly using?: GrandArchiveEventSubject;
      readonly combatDamage?: boolean;
      readonly amountComparison?: import("./amount.ts").GrandArchiveComparison;
    })
  | (GrandArchiveEventPatternBase<"attack-declared"> & {
      readonly recipient?: GrandArchiveEventSubject;
      readonly using?: GrandArchiveEventSubject;
      readonly usingAbsent?: GrandArchiveEventSubject;
    })
  | (GrandArchiveEventPatternBase<"attack-hit" | "object-killed"> & {
      readonly recipient?: GrandArchiveEventSubject;
      readonly using?: GrandArchiveEventSubject;
    })
  | (GrandArchiveEventPatternBase<"counter-added" | "counter-removed"> & {
      readonly counter?: GrandArchiveCounterKind;
    })
  | (GrandArchiveEventPatternBase<"cards-recollected"> & {
      readonly amountComparison?: import("./amount.ts").GrandArchiveComparison;
    })
  | (GrandArchiveEventPatternBase<"card-activated"> & {
      /** Targets declared for this activation, excluding later retargeting events. */
      readonly recipient?: GrandArchiveEventSubject;
      readonly from?: GrandArchiveZone;
      readonly to?: GrandArchiveZone;
      readonly activationState?: import("./primitives.ts").GrandArchiveActivationState;
      /** Whether the activation was created by a copy effect rather than announced by a player. */
      readonly isCopy?: boolean;
      readonly payment?: { readonly costKind: "memory" | "reserve" };
    })
  | (GrandArchiveEventPatternBase<
      | "card-banished"
      | "card-discarded"
      | "card-drawn"
      | "card-reserved"
      | "card-recovered"
      | "card-revealed"
    > & {
      readonly from?: GrandArchiveZone;
      readonly to?: GrandArchiveZone;
      readonly payment?: { readonly costKind: "memory" | "reserve" };
    })
  | (GrandArchiveEventPatternBase<"card-moved"> & {
      readonly from?: GrandArchiveZone;
      readonly fromNot?: readonly [GrandArchiveZone, ...GrandArchiveZone[]];
      readonly to: GrandArchiveZone;
      readonly host?: GrandArchiveEventSubject;
      readonly cause?: {
        readonly kind: "card-activation";
        readonly controller?: GrandArchiveRelativePlayer;
      };
    })
  | (GrandArchiveEventPatternBase<"object-linked"> & {
      readonly host?: GrandArchiveEventSubject;
    })
  | (GrandArchiveEventPatternBase<"object-entered-field"> & {
      readonly from?: GrandArchiveZone;
      readonly fromNot?: readonly [GrandArchiveZone, ...GrandArchiveZone[]];
      /** The entry was the committed result of activating this card. */
      readonly cause?:
        | { readonly kind: "card-activation"; readonly controller?: GrandArchiveRelativePlayer }
        | { readonly kind: "ability"; readonly ability: "this" | GrandArchiveBinding };
      readonly causeNot?: {
        readonly kind: "ability";
        readonly ability: "this" | GrandArchiveBinding;
      };
    })
  | (GrandArchiveEventPatternBase<"ability-triggered"> & {
      readonly triggerName?: "on-enter" | "on-attack" | "on-hit" | "on-death";
      readonly sourceObject?: GrandArchiveEventSubject;
    })
  | (GrandArchiveEventPatternBase<"champion-leveled-up"> & {
      /** Champion object that performed the level-up before the transition. */
      readonly previousObject?: GrandArchiveEventSubject;
    })
  | (GrandArchiveEventPatternBase<"stack-item-negated"> & {
      readonly itemTypes?: readonly ("ability" | "card-activation" | "materialization")[];
      readonly controller?: GrandArchiveRelativePlayer;
    })
  | (GrandArchiveEventPatternBase<"stack-item-targets-declared"> & {
      readonly itemTypes?: readonly ("ability" | "card-activation" | "materialization")[];
      readonly abilityKinds?: readonly ("activated" | "triggered")[];
      readonly recipient?: GrandArchiveEventSubject;
    })
  | (GrandArchiveEventPatternBase<"keyword-action-performed"> & {
      readonly action: "brew" | "empower" | "gather" | "glimpse" | "scavenge" | "suppress";
    })
  | (GrandArchiveEventPatternBase<"player-state-changed"> & {
      readonly state: string;
      readonly from?: string | number | boolean;
      readonly to?: string | number | boolean;
      readonly directionTransition?: {
        readonly from?: "north" | "east" | "south" | "west";
        readonly to?: "north" | "east" | "south" | "west";
        readonly relation?: "opposite" | "next-clockwise";
      };
    })
  | (GrandArchiveEventPatternBase<"object-state-changed"> & {
      readonly state: import("./primitives.ts").GrandArchiveObjectState;
      readonly from?: boolean;
      readonly to: boolean;
      readonly cause?: {
        readonly kind: "cost-payment";
        readonly costKind: "memory" | "reserve";
        readonly forCardFilter?: GrandArchiveCardFilter;
      };
    })
  | GrandArchiveEventPatternBase<
      Exclude<
        GrandArchiveObservableEventName,
        | "phase-begins"
        | "turn-begins"
        | "damage-dealt"
        | "damage-prevented"
        | "attack-declared"
        | "attack-hit"
        | "object-killed"
        | "counter-added"
        | "counter-removed"
        | "cards-recollected"
        | "card-activated"
        | "card-banished"
        | "card-discarded"
        | "card-drawn"
        | "card-reserved"
        | "card-recovered"
        | "card-revealed"
        | "card-moved"
        | "object-linked"
        | "object-entered-field"
        | "ability-triggered"
        | "champion-leveled-up"
        | "stack-item-negated"
        | "stack-item-targets-declared"
        | "keyword-action-performed"
        | "player-state-changed"
        | "object-state-changed"
      >
    >;

export type GrandArchiveTrigger =
  | {
      readonly kind: "event";
      readonly event:
        | GrandArchiveEventPattern
        | {
            readonly anyOf: readonly [
              GrandArchiveEventPattern,
              GrandArchiveEventPattern,
              ...GrandArchiveEventPattern[],
            ];
          };
      /** “one or more” batches once; “each” creates one trigger per matching event. */
      readonly cardinality?: "each-event" | "one-or-more";
      readonly condition?: GrandArchiveCondition;
    }
  | { readonly kind: "state"; readonly condition: GrandArchiveCondition };
