import type {
  GrandArchiveAmount,
  GrandArchiveComparison,
  GrandArchiveCollection,
} from "./amount.ts";
import type { GrandArchiveCardFilter } from "./filter.ts";
import type {
  GrandArchiveActivationState,
  GrandArchiveCounterKind,
  GrandArchiveObjectState,
  GrandArchivePhase,
  GrandArchivePlayerSet,
  GrandArchiveRelativePlayer,
} from "./primitives.ts";
import type { GrandArchiveSubject } from "./selection.ts";

export type GrandArchiveCondition =
  | { readonly kind: "all"; readonly conditions: readonly GrandArchiveCondition[] }
  | { readonly kind: "any"; readonly conditions: readonly GrandArchiveCondition[] }
  | { readonly kind: "not"; readonly condition: GrandArchiveCondition }
  | { readonly kind: "compare"; readonly comparison: GrandArchiveComparison }
  | { readonly kind: "collection-exists"; readonly collection: GrandArchiveCollection }
  | {
      readonly kind: "subject-matches";
      readonly subject: GrandArchiveSubject;
      readonly filter: GrandArchiveCardFilter;
    }
  | {
      readonly kind: "shares-characteristic";
      readonly left: GrandArchiveSubject;
      readonly right: GrandArchiveSubject;
      readonly characteristic: "class" | "element" | "subtype" | "type";
      readonly exclude?: readonly string[];
    }
  | {
      readonly kind: "controls";
      readonly player: GrandArchivePlayerSet;
      readonly filter: GrandArchiveCardFilter;
    }
  | {
      readonly kind: "controls-subject";
      readonly player: GrandArchivePlayerSet;
      readonly subject: GrandArchiveSubject;
    }
  | {
      readonly kind: "owns-subject";
      readonly player: GrandArchivePlayerSet;
      readonly subject: GrandArchiveSubject;
    }
  | {
      readonly kind: "has-related-object";
      readonly subject: GrandArchiveSubject;
      readonly relation: "host" | "linked-object";
      readonly filter?: GrandArchiveCardFilter;
    }
  | {
      readonly kind: "combat-relation";
      readonly relation: "attacking" | "retaliating-against";
      readonly subject: GrandArchiveSubject;
      readonly other?: GrandArchiveSubject;
      readonly otherFilter?: GrandArchiveCardFilter;
      readonly using?: GrandArchiveSubject;
      readonly usingFilter?: GrandArchiveCardFilter;
    }
  | {
      readonly kind: "current-attack-target-matches";
      readonly controller?: GrandArchiveRelativePlayer;
      readonly filter?: GrandArchiveCardFilter;
    }
  | { readonly kind: "turn-player"; readonly player: GrandArchiveRelativePlayer }
  | {
      /** Number of turns this player has begun in the current game. */
      readonly kind: "player-turn-count";
      readonly player: GrandArchiveRelativePlayer;
      readonly operator: import("./primitives.ts").GrandArchiveComparisonOperator;
      readonly value: GrandArchiveAmount;
    }
  | { readonly kind: "phase"; readonly phase: GrandArchivePhase }
  | {
      readonly kind: "has-counter";
      readonly subject: GrandArchiveSubject;
      readonly counter: GrandArchiveCounterKind;
      readonly comparison?: GrandArchiveComparison;
    }
  | {
      readonly kind: "counter-count-parity";
      readonly subject: GrandArchiveSubject;
      readonly counter: GrandArchiveCounterKind;
      readonly value: "even" | "odd";
    }
  | {
      readonly kind: "numeric-property-parity";
      readonly subject: GrandArchiveSubject;
      readonly property: import("./primitives.ts").GrandArchiveNumericProperty;
      readonly basis: "base" | "current" | "last-known";
      readonly value: "even" | "odd";
    }
  | {
      readonly kind: "object-state";
      readonly subject: GrandArchiveSubject;
      readonly state: GrandArchiveObjectState;
      readonly basis?: "current" | "last-known";
    }
  | {
      readonly kind: "player-relation";
      readonly player: GrandArchiveRelativePlayer;
      readonly relation: "controller" | "opponent-of-controller";
    }
  | {
      readonly kind: "player-state";
      readonly player: GrandArchiveRelativePlayer;
      readonly state: import("./primitives.ts").GrandArchivePlayerState;
    }
  | {
      readonly kind: "player-property-compare";
      readonly players: GrandArchivePlayerSet;
      readonly quantifier: "any" | "all";
      readonly property: "influence" | "omens";
      readonly operator: import("./primitives.ts").GrandArchiveComparisonOperator;
      readonly value: GrandArchiveAmount;
    }
  | {
      readonly kind: "player-property-extreme";
      readonly player: GrandArchiveRelativePlayer;
      readonly property: "influence" | "omens";
      readonly extreme: "minimum" | "maximum";
      readonly ties: "qualify" | "disqualify";
    }
  | {
      readonly kind: "player-zone-count";
      readonly players: GrandArchivePlayerSet;
      readonly quantifier: "any" | "all";
      readonly zone: import("./primitives.ts").GrandArchiveZone;
      readonly filter?: GrandArchiveCardFilter;
      readonly operator: import("./primitives.ts").GrandArchiveComparisonOperator;
      readonly value: GrandArchiveAmount;
    }
  | { readonly kind: "activation-state"; readonly state: GrandArchiveActivationState }
  | {
      readonly kind: "source-activation-context";
      readonly phase?: GrandArchivePhase;
      readonly from?: import("./primitives.ts").GrandArchiveZone;
      readonly reservedCardsToMemory?: import("./amount.ts").GrandArchiveComparison;
    }
  | {
      readonly kind: "source-zone";
      readonly zone: import("./primitives.ts").GrandArchiveZone;
      readonly state?: GrandArchiveObjectState;
    }
  | {
      readonly kind: "subjects-in-zone";
      readonly subject: GrandArchiveSubject;
      readonly zone: import("./primitives.ts").GrandArchiveZone;
      readonly quantifier: "any" | "all";
    }
  | { readonly kind: "source-activation-zone"; readonly zone: "effects-stack" | "intent" }
  | {
      readonly kind: "collection-count-parity";
      readonly collection: GrandArchiveCollection;
      readonly value: "even" | "odd";
    }
  | {
      readonly kind: "collection-has-shared-characteristic";
      readonly collection: GrandArchiveCollection;
      readonly characteristic: "name" | "type" | "subtype" | "element" | "class" | "reserve-cost";
      readonly minimumMatching: GrandArchiveAmount;
    }
  | {
      readonly kind: "starting-deck-count";
      readonly zone: "main-deck" | "material-deck";
      readonly filter?: GrandArchiveCardFilter;
      readonly operator: import("./primitives.ts").GrandArchiveComparisonOperator;
      readonly value: GrandArchiveAmount;
    }
  | { readonly kind: "paid-cost"; readonly binding: string }
  | { readonly kind: "effect-succeeded"; readonly binding: string }
  | {
      readonly kind: "effect-result-origin";
      readonly binding: string;
      readonly zone: import("./primitives.ts").GrandArchiveZone;
    }
  | {
      readonly kind: "ability-activation-count";
      readonly ability: "this";
      readonly scope: "source-instance";
      readonly window: "this-turn" | "game";
      readonly operator: import("./primitives.ts").GrandArchiveComparisonOperator;
      readonly value: GrandArchiveAmount;
    }
  | {
      readonly kind: "ability-resolution-count";
      readonly ability: "this";
      readonly scope: "source-instance";
      readonly window: "this-turn" | "game";
      readonly operator: import("./primitives.ts").GrandArchiveComparisonOperator;
      readonly value: GrandArchiveAmount;
      readonly includesCurrent?: true;
    }
  | { readonly kind: "target-is-legal"; readonly binding: string }
  | {
      readonly kind: "ability-target-matches";
      readonly ability: "this";
      readonly filter: GrandArchiveCardFilter;
      readonly quantifier: "any" | "all";
    }
  | {
      readonly kind: "ability-target-characteristic-in-collection";
      readonly ability: "this";
      readonly characteristic: "card-name" | "type" | "subtype" | "element" | "class";
      readonly collection: GrandArchiveCollection;
      readonly quantifier: "any" | "all";
    }
  | {
      readonly kind: "ability-targets-subject";
      readonly ability: "current";
      readonly subject: GrandArchiveSubject;
      readonly quantifier: "any" | "all";
    }
  | {
      readonly kind: "champion-matches-source";
      readonly characteristic: "class" | "element" | "lineage-name";
    }
  | { readonly kind: "champion-lineage-is"; readonly name: string }
  | {
      readonly kind: "history";
      readonly event: import("./primitives.ts").GrandArchiveObservableEventName;
      readonly window: "this-turn" | "this-phase" | "this-attack" | "this-resolution" | "game";
      readonly actor?: GrandArchiveRelativePlayer;
      /** Relate the historical event to a current object under evaluation. */
      readonly subject?: GrandArchiveSubject;
      readonly recipient?: GrandArchiveSubject;
      /** Restrict the historical event to one originating source. */
      readonly source?: GrandArchiveSubject;
      readonly filter?: GrandArchiveCardFilter;
      readonly activationState?: GrandArchiveActivationState;
      readonly keywordAction?: "brew" | "empower" | "gather" | "glimpse" | "scavenge" | "suppress";
      readonly combatDamage?: boolean;
      readonly directionTransition?: {
        readonly from: "north" | "east" | "south" | "west";
        readonly to: "north" | "east" | "south" | "west";
      };
      readonly itemTypes?: readonly ("ability" | "card-activation" | "materialization")[];
      readonly stackItemController?: GrandArchiveRelativePlayer;
      readonly eventAmountMinimum?: GrandArchiveAmount;
      readonly minimum?: GrandArchiveAmount;
    }
  | {
      readonly kind: "mastery-has-counter";
      readonly mastery: string;
      readonly counter: GrandArchiveCounterKind;
      readonly minimum: GrandArchiveAmount;
    };
