import type {
  GrandArchiveAmount,
  GrandArchiveCollection,
  GrandArchiveSelectionCount,
} from "./amount.ts";
import type { GrandArchiveCondition } from "./condition.ts";
import type { GrandArchiveAbilityCost } from "./cost.ts";
import type { GrandArchiveCardFilter } from "./filter.ts";
import type {
  GrandArchiveActivationState,
  GrandArchiveCardCharacteristic,
  GrandArchiveContinuousLayer,
  GrandArchiveCounterKind,
  GrandArchiveDuration,
  GrandArchiveNumericProperty,
  GrandArchiveObjectState,
  GrandArchiveObservableEventName,
  GrandArchivePlayerSet,
  GrandArchivePlayerState,
  GrandArchiveRelativePlayer,
  GrandArchiveZone,
} from "./primitives.ts";
import type { GrandArchiveResolutionChoice, GrandArchiveSubject } from "./selection.ts";
import type { GrandArchiveEventPattern } from "./trigger.ts";

interface GrandArchiveEffectBase {
  /** Bind the committed result, not a speculative proposal, for later instructions. */
  readonly bindResultAs?: string;
}

export type GrandArchiveMovePlacement =
  | { readonly kind: "unordered" }
  | {
      readonly kind: "top" | "bottom";
      readonly orderChosenBy?: GrandArchiveRelativePlayer;
      readonly order?: { readonly kind: "random" };
    }
  | { readonly kind: "position-from-top"; readonly position: number }
  | { readonly kind: "random" };

export type GrandArchiveMoveDestination =
  | {
      readonly zone: Exclude<GrandArchiveZone, "loaded" | "inner-lineage" | "intent" | "field">;
      readonly placement?: GrandArchiveMovePlacement;
    }
  | {
      readonly zone: "field";
      /** If present, the object enters linked to this host. */
      readonly linkTo?: GrandArchiveSubject;
      /** Controller assigned as the object enters; omit to use the normal owner/controller rule. */
      readonly controller?: GrandArchiveRelativePlayer;
      /** Face used for a double-faced object as it enters. */
      readonly face?: "default" | "transformed";
      readonly placement?: GrandArchiveMovePlacement;
    }
  | {
      readonly zone: "loaded" | "inner-lineage" | "intent";
      readonly host: GrandArchiveSubject;
      readonly placement?: GrandArchiveMovePlacement;
    };

export type GrandArchiveCharacteristicChange =
  | {
      readonly kind: "numeric";
      readonly property: GrandArchiveNumericProperty;
      readonly operation: "set" | "add" | "subtract";
      readonly amount?: GrandArchiveAmount;
      readonly withProperty?: never;
    }
  | ({
      /** CR Layer E final sublayer: exchange the fully modified power and life values. */
      readonly kind: "numeric";
      readonly operation: "swap";
      readonly amount?: never;
    } & (
      | { readonly property: "power"; readonly withProperty: "life" }
      | { readonly property: "life"; readonly withProperty: "power" }
    ))
  | {
      readonly kind: "add-characteristic" | "remove-characteristic";
      readonly characteristic: GrandArchiveCardCharacteristic;
    }
  | {
      readonly kind: "add-tracked-characteristic";
      readonly characteristic: "class" | "element" | "subtype" | "type";
      readonly key: string;
    }
  | {
      readonly kind: "set-elements";
      readonly elements: readonly import("../index.ts").GrandArchiveElement[];
    }
  | {
      readonly kind: "set-types";
      readonly types: readonly import("../card.ts").GrandArchiveRulesType[];
    }
  | {
      readonly kind: "grant-ability";
      readonly ability: import("./ability.ts").GrandArchiveExecutableAbility;
    }
  | { readonly kind: "grant-keyword"; readonly keyword: import("./keyword.ts").GrandArchiveKeyword }
  | {
      readonly kind: "remove-keyword";
      readonly keyword:
        | import("./keyword.ts").GrandArchiveKeyword
        | {
            readonly name: import("./keyword.ts").GrandArchiveKeyword["name"];
            readonly anyValue: true;
          };
    }
  | {
      readonly kind: "remove-abilities";
      readonly filter?: {
        readonly keyword?: string;
        readonly label?: string;
        readonly abilityId?: string;
        readonly abilityKinds?: readonly ("activated" | "triggered" | "static")[];
      };
    }
  | {
      readonly kind: "copy-abilities";
      readonly from: GrandArchiveSubject;
      readonly abilityKinds?: readonly ("activated" | "triggered" | "static")[];
    }
  | {
      readonly kind: "copy-abilities-from-collection";
      readonly collection: GrandArchiveCollection;
      readonly excludingSelf: true;
    }
  | {
      readonly kind: "copy-characteristic";
      readonly from: GrandArchiveSubject;
      readonly characteristic: "class" | "element" | "subtype" | "type";
    }
  | {
      readonly kind: "transform-abilities";
      readonly from: { readonly kind: "activated" };
      readonly to: { readonly kind: "triggered"; readonly event: "object-died" };
      readonly preserveActivationCosts: false;
    }
  | { readonly kind: "control"; readonly controller: GrandArchiveRelativePlayer };

/**
 * Static wording (“have/are”) computes a dynamic affected set. Instanced
 * wording (“get/gain/become”) locks its subjects when the effect is created.
 */
export interface GrandArchiveContinuousEffect extends GrandArchiveEffectBase {
  readonly kind: "continuous";
  readonly subjects: GrandArchiveSubject;
  readonly affectedSet: "dynamic" | "locked";
  readonly condition?: GrandArchiveCondition;
  readonly duration: GrandArchiveDuration;
  readonly layer: GrandArchiveContinuousLayer;
  readonly change: GrandArchiveCharacteristicChange;
}

/** A player-facing state continuously supplied while its source remains functional. */
export interface GrandArchiveContinuousPlayerStateEffect extends GrandArchiveEffectBase {
  readonly kind: "continuous-player-state";
  readonly players: GrandArchivePlayerSet;
  readonly state: GrandArchivePlayerState;
  readonly value: boolean;
  readonly duration: GrandArchiveDuration;
}

export interface GrandArchiveContinuousPlayerPropertyEffect extends GrandArchiveEffectBase {
  readonly kind: "continuous-player-property";
  readonly players: GrandArchivePlayerSet;
  readonly property: "maximum-influence";
  readonly operation: "set" | "add" | "subtract";
  readonly amount: GrandArchiveAmount;
  readonly duration: GrandArchiveDuration;
}

export type GrandArchiveRuleAction =
  | "add-counter"
  | "activate"
  | "activate-fast"
  | "attack"
  | "assign-combat-damage"
  | "bestow"
  | "attack-as-ally"
  | "choose"
  | "deal-damage"
  | "declare-target"
  | "draw"
  | "generate"
  | "grant-keyword"
  | "glimpse"
  | "imbue"
  | "intercept"
  | "level-up"
  | "look-at"
  | "lose-game"
  | "ignore-element-requirement"
  | "materialize"
  | "move"
  | "negate"
  | "pay-cost"
  | "play"
  | "prevent-damage"
  | "recover"
  | "recollect"
  | "redirect"
  | "reserve"
  | "retaliate"
  | "rest"
  | "suppress"
  | "use-weapon-for-attack"
  | "use-for-attack"
  | "use-with-attack-card"
  | "wake";

export interface GrandArchiveRuleModification extends GrandArchiveEffectBase {
  readonly kind: "rule-modification";
  readonly mode:
    | "allow"
    | "forbid"
    | "require"
    | "add-cost"
    | "replace-cost"
    | "modify-cost"
    | "modify-limit"
    | "grant-keyword"
    | "payment-contribution"
    | "use-property";
  readonly action: GrandArchiveRuleAction;
  readonly subject?: GrandArchiveSubject;
  /** Instanced “get/gain” rules lock their affected objects when created; static rules remain dynamic. */
  readonly affectedSet?: "dynamic" | "locked";
  /** Player permitted or constrained by this rule modification. */
  readonly actor?: GrandArchivePlayerSet;
  readonly using?: GrandArchiveSubject;
  readonly against?: GrandArchiveSubject;
  readonly filter?: GrandArchiveCardFilter;
  /** Restrict the source responsible for the modified rule event (for example, the source dealing damage). */
  readonly sourceFilter?: GrandArchiveCardFilter;
  readonly destinationFilter?: GrandArchiveCardFilter;
  /** Specific elemental requirement ignored by this rule, when not all requirements are ignored. */
  readonly elementRequirement?: import("../index.ts").GrandArchiveElement;
  readonly fromZone?: GrandArchiveZone;
  /** Restrict this permission to the first card of its owner's main deck. */
  readonly fromTopOfDeck?: true;
  readonly paymentSourceFilter?: GrandArchiveCardFilter;
  readonly paymentOwner?: GrandArchivePlayerSet;
  readonly paymentMethod?:
    | {
        readonly kind: "remove-counter";
        readonly counter: GrandArchiveCounterKind;
        readonly from: GrandArchiveSubject;
      }
    | { readonly kind: "rest"; readonly subject: GrandArchiveSubject };
  readonly contributionBasis?: "per-paid-object" | "total";
  readonly occurrence?: {
    readonly count: number;
    readonly window: "this-turn" | "game";
    readonly actorScope?: "same-player";
  };
  /** Minimum number of required actions in a recurring window (“must attack each turn if able”). */
  readonly requiredCount?: { readonly minimum: GrandArchiveAmount; readonly per: "turn" };
  readonly activationKind?: "card" | "ability";
  /** Restrict an ability activation by the activated ability's own printed identity. */
  readonly abilityFilter?: {
    readonly keyword?: string;
    readonly label?: string;
  };
  readonly condition?: GrandArchiveCondition;
  readonly cost?: GrandArchiveAbilityCost;
  readonly costKind?: "memory" | "reserve";
  readonly costComponent?:
    | "starcalling"
    | "ephemerate"
    | "materialization"
    | "activation"
    | "rest-attacker";
  readonly costOperation?: "add" | "subtract" | "set";
  readonly amount?: GrandArchiveAmount;
  readonly counter?: GrandArchiveCounterKind;
  readonly damageKind?: "combat" | "non-combat";
  /** Numeric characteristic used by the modified rule calculation. */
  readonly valueProperty?: import("./primitives.ts").GrandArchiveNumericProperty;
  /** Keyword contributed to cards matching `filter` as they perform `action`. */
  readonly grantedKeyword?: import("./keyword.ts").GrandArchiveKeyword;
  /** A targeting restriction ignored only for this modified action. */
  readonly ignoredKeyword?: "taunt";
  /** Consequences tied specifically to choosing this alternate activation or payment rule. */
  readonly activationResult?: {
    readonly entryState?: { readonly state: GrandArchiveObjectState; readonly value: boolean };
    readonly afterResolution?: GrandArchiveEffect;
  };
  /** Consequence committed only when the modified rule action is successfully performed. */
  readonly actionResult?: GrandArchiveEffect;
  readonly duration: GrandArchiveDuration;
}

export type GrandArchiveReplacementOperation =
  | { readonly kind: "prevent"; readonly amount?: GrandArchiveAmount }
  | { readonly kind: "replace-with"; readonly effect: GrandArchiveEffect }
  | {
      readonly kind: "modify-amount";
      readonly operation: "add" | "subtract" | "multiply" | "set";
      readonly amount: GrandArchiveAmount;
      readonly minimumResult?: GrandArchiveAmount;
    }
  | {
      readonly kind: "modify-object-state";
      readonly state: GrandArchiveObjectState;
      readonly value: boolean;
    }
  | { readonly kind: "modify-characteristic"; readonly change: GrandArchiveCharacteristicChange }
  | {
      readonly kind: "add-object-counters";
      readonly counters: readonly [
        { readonly counter: GrandArchiveCounterKind; readonly amount: GrandArchiveAmount },
        ...{ readonly counter: GrandArchiveCounterKind; readonly amount: GrandArchiveAmount }[],
      ];
    }
  | { readonly kind: "perform-before-commit"; readonly effect: GrandArchiveEffect }
  | {
      readonly kind: "redirect";
      readonly recipient: GrandArchiveSubject | GrandArchiveResolutionChoice;
    }
  | {
      readonly kind: "sequence";
      readonly operations: readonly [
        GrandArchiveReplacementOperation,
        ...GrandArchiveReplacementOperation[],
      ];
    };

/** Replacement effects alter a proposed event before that event is committed. */
export interface GrandArchiveReplacementEffect extends GrandArchiveEffectBase {
  readonly kind: "replacement";
  readonly event: GrandArchiveEventPattern;
  readonly condition?: GrandArchiveCondition;
  readonly optionalFor?: GrandArchiveRelativePlayer;
  readonly limit?: {
    readonly count: number;
    readonly per: "turn" | "game" | "source-instance" | "object";
  };
  readonly operation: GrandArchiveReplacementOperation;
  /** A consumable quantity shared by this replacement or separately tracked for each matched object. */
  readonly capacity?: {
    readonly amount: GrandArchiveAmount;
    readonly scope: "replacement-instance" | "per-object";
  };
  /** Resolve only after this replacement is committed, with its result available to derived amounts and conditions. */
  readonly afterApply?: GrandArchiveEffect;
  readonly duration: GrandArchiveDuration;
}

/** Alters how many times matching intrinsic/named trigger families trigger. */
export interface GrandArchiveTriggerMultiplierEffect extends GrandArchiveEffectBase {
  readonly kind: "trigger-multiplier";
  readonly triggerName: "on-attack" | "on-hit" | "on-enter";
  readonly event: GrandArchiveEventPattern;
  readonly operation:
    | { readonly kind: "add"; readonly additionalTimes: GrandArchiveAmount }
    | { readonly kind: "set-total"; readonly totalTimes: GrandArchiveAmount };
  readonly duration: GrandArchiveDuration;
}

/** Duplicates matching labeled executable instructions on every affected source. */
export interface GrandArchiveAbilityMultiplierEffect extends GrandArchiveEffectBase {
  readonly kind: "ability-multiplier";
  readonly subjects: GrandArchiveSubject;
  readonly abilityFilter: { readonly label: string };
  readonly scope: "abilities-and-effects";
  readonly additionalInstances: GrandArchiveAmount;
  readonly duration: GrandArchiveDuration;
}

/** Replaces normal defender selection for attacks declared by one attacker. */
export interface GrandArchiveAttackTargetDelegationEffect extends GrandArchiveEffectBase {
  readonly kind: "attack-target-delegation";
  readonly attacker: GrandArchiveSubject;
  readonly delegate: {
    readonly chooser: GrandArchiveRelativePlayer;
    readonly players: GrandArchivePlayerSet;
    readonly bindAs: string;
  };
  readonly defenderCandidates: import("./selection.ts").GrandArchiveSelectionCandidates;
  readonly duration: GrandArchiveDuration;
}

export type GrandArchiveAtomicEffect = GrandArchiveEffectBase &
  (
    | { readonly kind: "no-op" }
    | {
        readonly kind: "draw";
        readonly player: GrandArchivePlayerSet;
        readonly amount: GrandArchiveAmount;
        readonly to?: "hand" | "memory";
      }
    | {
        readonly kind: "mill";
        readonly player: GrandArchivePlayerSet;
        readonly amount: GrandArchiveAmount;
      }
    | {
        readonly kind: "recover";
        readonly player: GrandArchivePlayerSet;
        readonly amount: GrandArchiveAmount;
      }
    | {
        readonly kind: "deal-damage";
        readonly source?: GrandArchiveSubject;
        readonly recipient: GrandArchiveSubject;
        readonly amount: GrandArchiveAmount;
        readonly preventable?: false;
      }
    | {
        readonly kind: "rest" | "wake" | "destroy" | "sacrifice" | "discard-object";
        readonly subject: GrandArchiveSubject;
      }
    | {
        readonly kind: "level-up" | "delevel";
        readonly subject: GrandArchiveSubject;
        readonly ignoreCosts?: boolean;
      }
    | {
        readonly kind: "reserve";
        readonly player: GrandArchivePlayerSet;
        readonly selection: GrandArchiveResolutionChoice;
      }
    | {
        readonly kind: "discard" | "banish";
        readonly player: GrandArchivePlayerSet;
        readonly selection: GrandArchiveResolutionChoice;
        readonly faceDown?: boolean;
      }
    | {
        readonly kind: "banish-object";
        readonly subject: GrandArchiveSubject;
        readonly faceDown?: boolean;
      }
    | {
        readonly kind: "move";
        readonly subject: GrandArchiveSubject;
        readonly from?: GrandArchiveZone;
        readonly destination: GrandArchiveMoveDestination;
        readonly facing?: "face-up" | "face-down";
      }
    | {
        readonly kind: "add-counter" | "remove-counter";
        readonly subject: GrandArchiveSubject;
        readonly counter: GrandArchiveCounterKind;
        readonly amount: GrandArchiveAmount;
        readonly counterScope?: "temporary";
      }
    | {
        readonly kind: "move-counter";
        readonly from: GrandArchiveSubject;
        readonly to: GrandArchiveSubject;
        readonly counter: GrandArchiveCounterKind;
        readonly amount: GrandArchiveAmount;
      }
    | {
        readonly kind: "move-counters-from-collection";
        readonly collection: GrandArchiveCollection;
        readonly to: GrandArchiveSubject;
        readonly counter: GrandArchiveCounterKind;
        readonly count: GrandArchiveSelectionCount;
        readonly chooser: GrandArchiveRelativePlayer;
      }
    | {
        readonly kind: "remove-counters-from-collection";
        readonly collection: GrandArchiveCollection;
        readonly counter: GrandArchiveCounterKind;
        readonly count: GrandArchiveSelectionCount;
        readonly chooser: GrandArchiveRelativePlayer;
      }
    | {
        readonly kind: "reveal" | "look-at";
        readonly player: GrandArchiveRelativePlayer;
        readonly selection: GrandArchiveResolutionChoice;
      }
    | {
        readonly kind: "reveal-until";
        readonly player: GrandArchiveRelativePlayer;
        readonly zone: "main-deck" | "material-deck";
        readonly stopWhen: GrandArchiveCardFilter;
        readonly bindMatchAs: string;
        readonly bindRemainderAs: string;
      }
    | {
        readonly kind: "search";
        readonly player: GrandArchiveRelativePlayer;
        readonly zone: GrandArchiveZone;
        readonly selection: GrandArchiveResolutionChoice;
        readonly reveal?: boolean;
      }
    | {
        readonly kind: "shuffle";
        readonly player: GrandArchiveRelativePlayer;
        readonly zone: "main-deck" | "material-deck";
      }
    | {
        readonly kind: "swap-zones";
        readonly player: GrandArchiveRelativePlayer;
        readonly zones: readonly [GrandArchiveZone, GrandArchiveZone];
      }
    | {
        readonly kind: "declare-attack";
        readonly attacker: GrandArchiveSubject;
        readonly additional?: true;
        readonly cost?: GrandArchiveAbilityCost;
        /** Performed only after the attack declaration is successfully committed. */
        readonly ifDeclared?: GrandArchiveEffect;
      }
    | {
        readonly kind: "activate-card";
        readonly subject: GrandArchiveSubject;
        readonly activator?: GrandArchivePlayerSet;
        /** Defaults to true because activation normally includes paying all declared costs. */
        readonly payCosts?: boolean;
        readonly ignoreElementRequirements?: boolean;
        readonly speed?: "fast" | "slow";
        readonly costModifiers?: readonly {
          readonly operation: "add" | "subtract" | "set";
          readonly amount: GrandArchiveAmount;
        }[];
      }
    | {
        readonly kind: "materialize-card";
        readonly subject: GrandArchiveSubject;
        /** Player who announces and controls the materialization; defaults to the effect controller. */
        readonly materializer?: GrandArchivePlayerSet;
        /** Defaults to true because materialization normally includes paying all declared costs. */
        readonly payCosts?: boolean;
        readonly ignoreElementRequirements?: boolean;
        readonly costModifiers?: readonly {
          readonly operation: "add" | "subtract" | "set";
          readonly amount: GrandArchiveAmount;
        }[];
      }
    | {
        readonly kind: "pay-cost";
        readonly player: GrandArchiveRelativePlayer;
        readonly cost: GrandArchiveAbilityCost;
      }
    | {
        readonly kind: "play-card";
        readonly subject: GrandArchiveSubject;
        readonly player?: GrandArchivePlayerSet;
        /** Defaults to true; the card's characteristics determine its concrete play method. */
        readonly payCosts?: boolean;
        readonly ignoreElementRequirements?: boolean;
        readonly speed?: "fast" | "slow";
        readonly costModifiers?: readonly {
          readonly operation: "add" | "subtract" | "set";
          readonly amount: GrandArchiveAmount;
        }[];
      }
    | ({
        readonly kind: "summon";
        readonly controller: GrandArchivePlayerSet;
        readonly amount?: GrandArchiveAmount;
        readonly entersWithStates?: readonly GrandArchiveObjectState[];
        readonly entersWithCounters?: readonly {
          readonly counter: GrandArchiveCounterKind;
          readonly amount: GrandArchiveAmount;
        }[];
      } & (
        | { readonly object: string; readonly copyOf?: never }
        | { readonly copyOf: GrandArchiveSubject; readonly object?: never }
      ))
    | {
        readonly kind: "summon-one-of";
        readonly chooser: GrandArchiveRelativePlayer;
        readonly controller: GrandArchivePlayerSet;
        readonly objects: readonly [string, string, ...string[]];
      }
    | {
        readonly kind: "summon-copies";
        readonly controller: GrandArchivePlayerSet;
        readonly subjects: GrandArchiveSubject;
        readonly token: true;
      }
    | {
        readonly kind: "generate";
        readonly card: string;
        readonly player: GrandArchiveRelativePlayer;
        readonly destination?: GrandArchiveMoveDestination;
        readonly amount?: GrandArchiveAmount;
      }
    | {
        readonly kind: "generate-selected";
        readonly player: GrandArchiveRelativePlayer;
        readonly selection: GrandArchiveResolutionChoice;
        readonly destination: GrandArchiveMoveDestination;
      }
    | {
        readonly kind: "move-partition";
        readonly subject: GrandArchiveSubject;
        readonly destinations: readonly [
          GrandArchiveMoveDestination & {
            readonly placement: Extract<
              GrandArchiveMovePlacement,
              { readonly kind: "top" | "bottom" }
            >;
          },
          GrandArchiveMoveDestination & {
            readonly placement: Extract<
              GrandArchiveMovePlacement,
              { readonly kind: "top" | "bottom" }
            >;
          },
        ];
        readonly chooser: GrandArchiveRelativePlayer;
      }
    | {
        readonly kind: "keyword-action";
        readonly action: "empower" | "gather" | "glimpse" | "scavenge" | "suppress";
        readonly player?: GrandArchiveRelativePlayer;
        readonly amount?: GrandArchiveAmount;
        readonly filter?: GrandArchiveCardFilter;
        readonly subject?: GrandArchiveSubject;
        /** Captures cards/objects produced by the keyword procedure for continuations. */
        readonly bindResultAs?: string;
        /** Overrides the keyword's normal result destination when printed text says “rather than.” */
        readonly resultDestination?: GrandArchiveMoveDestination;
      }
    | { readonly kind: "transform"; readonly subject: GrandArchiveSubject }
    | {
        readonly kind: "copy";
        readonly subject: GrandArchiveSubject;
        readonly copy: "object" | "ability" | "card-activation" | "materialization";
        readonly amount?: GrandArchiveAmount;
        readonly exceptName?: string;
        readonly mayChooseNewTargets?: true;
        readonly mayChooseNewModes?: true;
      }
    | {
        readonly kind: "become-copy";
        readonly subject: GrandArchiveSubject;
        readonly copyOf: GrandArchiveSubject;
        readonly exceptName?: string;
        readonly duration: GrandArchiveDuration;
      }
    | { readonly kind: "negate"; readonly subject: GrandArchiveSubject }
    | {
        readonly kind: "negate-matching-stack-items";
        readonly candidates: Extract<
          import("./selection.ts").GrandArchiveSelectionCandidates,
          { readonly kind: "stack-item" }
        >;
      }
    | {
        readonly kind: "retarget";
        readonly subject: GrandArchiveSubject;
        readonly chooser: GrandArchiveRelativePlayer;
        readonly oldTarget?: GrandArchiveSubject;
        readonly newTarget?: GrandArchiveSubject;
        /** Intrinsic Intercept rechecks obedience as its redirect resolves. */
        readonly requireNewTargetObedience?: true;
      }
    | {
        readonly kind: "negate-triggered-abilities";
        readonly source: GrandArchiveSubject;
        readonly triggerEvent?: GrandArchiveObservableEventName;
      }
    | {
        readonly kind: "trigger-abilities";
        readonly subject: GrandArchiveSubject;
        readonly triggerName: "on-attack" | "on-hit" | "on-enter";
        readonly count: "each";
      }
    | {
        readonly kind: "set-activation-state";
        readonly subject: GrandArchiveSubject;
        readonly state: GrandArchiveActivationState;
        readonly value: boolean;
      }
    | {
        readonly kind: "set-object-state";
        readonly subject: GrandArchiveSubject;
        readonly state: GrandArchiveObjectState;
        readonly value: boolean;
      }
    | {
        readonly kind: "set-card-facing";
        readonly subject: GrandArchiveSubject;
        readonly facing: "face-up" | "face-down";
      }
    | {
        readonly kind: "change-control";
        readonly subject: GrandArchiveSubject;
        readonly controller: GrandArchiveRelativePlayer;
      }
    | {
        readonly kind: "set-player-state";
        readonly player: GrandArchiveRelativePlayer;
        readonly state: GrandArchivePlayerState;
        readonly value: boolean;
        readonly amount?: GrandArchiveAmount;
        readonly duration?: GrandArchiveDuration;
      }
    | {
        readonly kind: "set-game-state";
        readonly state: string;
        readonly value: boolean;
        readonly duration?: GrandArchiveDuration;
      }
    | {
        readonly kind: "gain-mastery";
        readonly player: GrandArchiveRelativePlayer;
        readonly mastery: string;
      }
    | {
        readonly kind: "choose-value";
        readonly selection: GrandArchiveResolutionChoice;
        readonly trackAs: string;
      }
    | {
        readonly kind: "track-characteristic";
        readonly subject: GrandArchiveSubject;
        readonly characteristic: "card-name" | "class" | "element" | "subtype" | "type";
        readonly trackAs: string;
      }
    | {
        readonly kind: "bind-value";
        readonly value: GrandArchiveAmount;
        readonly bindAs: string;
        readonly effect: GrandArchiveEffect;
      }
    | {
        readonly kind: "choose-direction";
        readonly player: GrandArchiveRelativePlayer;
        readonly state: "shifting-currents";
        readonly directions: readonly ["north", "east", "south", "west"];
        readonly differentFromCurrent?: true;
        readonly relationToCurrent?: "adjacent" | "opposite";
      }
    | { readonly kind: "lose-game" | "win-game"; readonly player: GrandArchiveRelativePlayer }
    | { readonly kind: "draw-game" }
    | { readonly kind: "end-phase"; readonly phase: import("./primitives.ts").GrandArchivePhase }
    | { readonly kind: "end-turn" }
    | {
        readonly kind: "skip-next-phase";
        readonly player: GrandArchiveRelativePlayer;
        readonly phase: import("./primitives.ts").GrandArchivePhase;
      }
  );

export type GrandArchiveEffect =
  | GrandArchiveAtomicEffect
  | GrandArchiveContinuousEffect
  | GrandArchiveContinuousPlayerStateEffect
  | GrandArchiveContinuousPlayerPropertyEffect
  | GrandArchiveRuleModification
  | GrandArchiveReplacementEffect
  | GrandArchiveTriggerMultiplierEffect
  | GrandArchiveAbilityMultiplierEffect
  | GrandArchiveAttackTargetDelegationEffect
  | {
      readonly kind: "sequence";
      readonly effects: readonly [GrandArchiveEffect, ...GrandArchiveEffect[]];
    }
  | {
      readonly kind: "attempt";
      readonly effect: GrandArchiveEffect;
      readonly bindSucceededAs: string;
    }
  /** “When you do” creates a reflexive trigger after the action succeeds. */
  | {
      readonly kind: "reflexive";
      readonly action: GrandArchiveEffect;
      /** Targets are declared when the reflexive trigger is put on the Effects Stack. */
      readonly targets?: readonly import("./selection.ts").GrandArchiveTargetDeclaration[];
      /** One trigger is created for every object successfully affected by the action. */
      readonly cardinality?: "each-result-object";
      readonly consequence: GrandArchiveEffect;
    }
  | {
      readonly kind: "conditional";
      readonly condition: GrandArchiveCondition;
      readonly then: GrandArchiveEffect;
      readonly else?: GrandArchiveEffect;
    }
  | {
      readonly kind: "optional";
      readonly player: GrandArchiveRelativePlayer;
      readonly effect: GrandArchiveEffect;
      readonly otherwise?: GrandArchiveEffect;
      readonly allOrNothing: true;
    }
  | {
      readonly kind: "choose";
      readonly selection: GrandArchiveResolutionChoice;
      readonly effect?: GrandArchiveEffect;
    }
  | {
      readonly kind: "for-each";
      readonly collection: GrandArchiveCollection;
      readonly bindEachAs: string;
      readonly effect: GrandArchiveEffect;
    }
  | {
      readonly kind: "for-each-player";
      readonly players: GrandArchivePlayerSet;
      readonly bindEachAs: string;
      readonly order?: "turn-order-after-controller";
      readonly effect: GrandArchiveEffect;
    }
  | {
      readonly kind: "repeat";
      readonly count: GrandArchiveAmount;
      readonly effect: GrandArchiveEffect;
    }
  | {
      readonly kind: "branch-on-value";
      readonly value: GrandArchiveAmount;
      readonly branches: readonly [
        {
          readonly minimum: GrandArchiveAmount;
          readonly maximum?: GrandArchiveAmount;
          readonly effect: GrandArchiveEffect;
        },
        ...{
          readonly minimum: GrandArchiveAmount;
          readonly maximum?: GrandArchiveAmount;
          readonly effect: GrandArchiveEffect;
        }[],
      ];
    }
  | {
      readonly kind: "perform-as";
      readonly sourceKind: "spell";
      readonly effect: GrandArchiveEffect;
    }
  | {
      readonly kind: "pay";
      readonly player: GrandArchiveRelativePlayer;
      readonly cost: GrandArchiveAbilityCost;
      readonly then?: GrandArchiveEffect;
    }
  | {
      readonly kind: "unless-paid";
      readonly player: GrandArchiveRelativePlayer;
      readonly cost: GrandArchiveAbilityCost;
      readonly otherwise: GrandArchiveEffect;
    }
  | {
      readonly kind: "unless-performed";
      readonly player: GrandArchiveRelativePlayer;
      readonly alternative: GrandArchiveEffect;
      readonly otherwise: GrandArchiveEffect;
    }
  | {
      readonly kind: "create-delayed-trigger";
      readonly trigger: import("./trigger.ts").GrandArchiveTrigger;
      readonly effect: GrandArchiveEffect;
      readonly limit?: number;
      readonly starts?: { readonly kind: "next-turn"; readonly whose: GrandArchiveRelativePlayer };
      readonly expires?: GrandArchiveDuration;
    }
  | {
      readonly kind: "after-resolution";
      readonly stackItem: GrandArchiveSubject;
      readonly effect: GrandArchiveEffect;
    }
  | {
      readonly kind: "distribute";
      readonly amount: GrandArchiveAmount;
      readonly among: GrandArchiveResolutionChoice;
      readonly payload:
        | {
            readonly kind: "damage";
            readonly source?: GrandArchiveSubject;
            readonly preventable?: false;
          }
        | { readonly kind: "counter"; readonly counter: GrandArchiveCounterKind };
    }
  | {
      readonly kind: "random";
      readonly choices: readonly [GrandArchiveEffect, GrandArchiveEffect, ...GrandArchiveEffect[]];
    }
  | {
      readonly kind: "select-modes";
      readonly choose: GrandArchiveSelectionCount;
      readonly allowRepeat?: boolean;
      readonly random?: boolean;
      readonly excludePreviouslyChosen?: true;
      readonly trackChosenAs?: string;
      readonly modes: readonly [
        GrandArchiveModeEffect,
        GrandArchiveModeEffect,
        ...GrandArchiveModeEffect[],
      ];
    };

export interface GrandArchiveModeEffect {
  readonly id: string;
  readonly text: string;
  readonly condition?: GrandArchiveCondition;
  readonly targets?: readonly import("./selection.ts").GrandArchiveTargetDeclaration[];
  readonly variables?: readonly import("./ability.ts").GrandArchiveVariableDeclaration[];
  readonly effect: GrandArchiveEffect;
}
