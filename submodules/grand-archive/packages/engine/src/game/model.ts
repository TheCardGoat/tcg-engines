import type {
  GrandArchiveExecutableAbility,
  GrandArchiveObjectState,
  GrandArchivePhase,
  GrandArchiveZone,
} from "@tcg/grand-archive-types";
import type {
  GrandArchiveDecisionId,
  GrandArchiveEventId,
  GrandArchiveObjectId,
  GrandArchivePlayerId,
  GrandArchiveStackItemId,
  GrandArchiveTargetId,
} from "./identity.ts";

export type GrandArchiveGameMode = "standard" | "draft" | "pantheon";
export type GrandArchiveMatchStatus = "pregame" | "playing" | "finished";

export interface GrandArchivePregameState {
  readonly stage: "player-actions" | "starting-champions";
  readonly currentPlayerIndex: number;
  readonly startingChampionIds: Readonly<Record<GrandArchivePlayerId, GrandArchiveObjectId>>;
  readonly pantheonBarrierDefinitionIds: Readonly<Partial<Record<GrandArchivePlayerId, string>>>;
}

export interface GrandArchiveCardInstance {
  readonly id: GrandArchiveObjectId;
  readonly definitionId: string;
  /** Immutable object classification; summoned objects and object copies are tokens. */
  readonly isToken: boolean;
  /**
   * Copy provenance and, outside the field, its lifetime. Field object copies
   * retain this marker so rules that distinguish copies from represented
   * double-faced cards remain enforceable.
   */
  readonly copy?: {
    readonly sourceObjectId: GrandArchiveObjectId;
    readonly expires: "end-of-combat" | "when-unassociated";
  };
  /** Printed definition currently supplying this object's characteristics (champion lineage top). */
  readonly activeDefinitionId?: string;
  /** Name retained or assigned by an “except its name is …” copy instruction. */
  readonly nameOverride?: string;
  readonly ownerId: GrandArchivePlayerId;
  /** Controller established by entry or a non-continuous control change. */
  readonly baseControllerId: GrandArchivePlayerId;
  /** Controller after applying active continuous control effects in timestamp order. */
  readonly controllerId: GrandArchivePlayerId;
  readonly zone: GrandArchiveZone;
  readonly hostId?: GrandArchiveObjectId;
  /** Source card/object whose effect or explicit additional cost put this card in banishment. */
  readonly banishedBySourceId?: GrandArchiveObjectId;
  readonly face: "default" | "transformed";
  readonly facing: "face-up" | "face-down";
  /** A characteristic-selected private card that must be disclosed when the game ends. */
  readonly revealAtEndOfGame?: true;
  readonly states: ReadonlySet<GrandArchiveObjectState>;
  readonly activationStates: ReadonlySet<
    import("@tcg/grand-archive-types").GrandArchiveActivationState
  >;
  /** Exact objects used to pay for the activation/materialization that created this object. */
  readonly activationPayment: readonly GrandArchiveActivationPaymentRecord[];
  /** Named announcement and payment references retained by the resulting object. */
  readonly activationBindings: Readonly<
    Record<string, import("../procedures/effects/evaluation.ts").GrandArchiveExecutionBinding>
  >;
  /** Values announced for the activation/materialization that created this object. */
  readonly activationVariables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
  /** Per-ability Cascade progress for this object instance; reset by every zone change. */
  readonly cascadeCounts: Readonly<Record<string, number>>;
  readonly counters: Readonly<Record<string, number>>;
  readonly damage: number;
  /** Changes only when this card changes zones and becomes a new rules object. */
  readonly incarnation: number;
  /** Changes when this object's represented characteristics or facing changes. */
  readonly objectVersion: number;
}

export interface GrandArchiveActivationPaymentRecord {
  readonly objectId: GrandArchiveObjectId;
  readonly from?: GrandArchiveZone;
  readonly to?: GrandArchiveZone;
}

export interface GrandArchivePlayerState {
  readonly id: GrandArchivePlayerId;
  readonly name: string;
  readonly turnOrder: number;
  readonly startingDeckDefinitionIds: Readonly<
    Record<"main-deck" | "material-deck", readonly string[]>
  >;
  readonly hasTakenFirstTurn: boolean;
  readonly hasControlledChampion: boolean;
  readonly lost: boolean;
  readonly conceded: boolean;
  /** One entry is consumed each time this player's matching phase would begin. */
  readonly phaseSkips: Readonly<Partial<Record<GrandArchivePhase, number>>>;
  /** The player's single non-object mastery function and its persistent counters. */
  readonly mastery?: GrandArchiveMasteryState;
  readonly states: Readonly<Record<string, string | number | boolean>>;
}

export interface GrandArchiveMasteryState {
  readonly name: string;
  /** State version at which this mastery was gained. */
  readonly timestamp: number;
  readonly counters: Readonly<Record<string, number>>;
}

/** Rules-defined abilities whose source is the game itself rather than an object or player function. */
export interface GrandArchiveGameAbilitySource {
  readonly name: "wither";
}

export type GrandArchiveShiftingCurrentsDirection = "north" | "east" | "south" | "west";

export interface GrandArchiveDeclaredTarget {
  readonly binding: string;
  readonly targetIds: readonly GrandArchiveTargetId[];
  /** Announcement-time object incarnations; a zone change creates a different target object. */
  readonly targetObjectIncarnations: Readonly<Partial<Record<GrandArchiveObjectId, number>>>;
  readonly required: boolean;
}

interface GrandArchiveStackItemBase {
  readonly id: GrandArchiveStackItemId;
  readonly controllerId: GrandArchivePlayerId;
  readonly sourceId?: GrandArchiveObjectId;
  /** Object incarnation in which this ability was activated or triggered. */
  readonly sourceIncarnation?: number;
  /** Exact departure checkpoint used by an ability that triggered from LKI. */
  readonly sourceLkiEventId?: GrandArchiveEventId;
  /** Public identity when this stack item is sourced by a non-object mastery function. */
  readonly masterySource?: {
    readonly playerId: GrandArchivePlayerId;
    readonly name: string;
  };
  /** Public identity for a triggered ability sourced by the game rules. */
  readonly gameSource?: GrandArchiveGameAbilitySource;
  /** Unit selected while paying an Attack card's intrinsic additional cost. */
  readonly attackAttackerId?: GrandArchiveObjectId;
  readonly selectedModeIds: readonly string[];
  /** Exact declarations fixed when this stack item was announced, including intrinsic targets. */
  readonly targetDeclarations?: readonly import("@tcg/grand-archive-types").GrandArchiveTargetDeclaration[];
  readonly targets: readonly GrandArchiveDeclaredTarget[];
  readonly createdAtVersion: number;
  /** Phase in which this activation, materialization, or trigger entered the stack. */
  readonly activationPhase: GrandArchivePhase;
  readonly isCopy: boolean;
  readonly negated: boolean;
  /** Timing policy fixed when this stack item is created. */
  readonly opportunityPolicy: "normal" | "interdiction" | "bestowment";
  /** Properties fixed on this activation when it entered the Effects Stack. */
  readonly activationStates: readonly import("@tcg/grand-archive-types").GrandArchiveActivationState[];
  /** Exact payment objects and their payment-time zone transition, when any. */
  readonly activationPayment: readonly GrandArchiveActivationPaymentRecord[];
  /** Level adjustment used while announcing and resolving this activation. */
  readonly championLevelModifier: number;
  readonly variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
  readonly bindings: Readonly<
    Record<string, import("../procedures/effects/evaluation.ts").GrandArchiveExecutionBinding>
  >;
  /** Rule-internal consequences promoted only after this item leaves the Effects Stack. */
  readonly scheduledAfterResolutionItems?: readonly GrandArchiveStackItem[];
}

interface GrandArchiveCardStackItemBase extends GrandArchiveStackItemBase {
  readonly cardId: GrandArchiveObjectId;
  readonly originZone: GrandArchiveZone;
  readonly paidCostKind: "reserve" | "memory" | "none";
  /** Elysian Aura status used for level-dependent announcement information. */
  readonly elysianAuraActiveAtAnnouncement: boolean;
  /**
   * Card-resolution paragraphs present before static restrictions were
   * evaluated at announcement. Occurrence order distinguishes duplicates.
   */
  readonly announcedCardResolutionAbilities: readonly {
    readonly ability: Extract<GrandArchiveExecutableAbility, { readonly kind: "card-resolution" }>;
    readonly enabled: boolean;
  }[];
  /** Consequences fixed by the permission or alternate payment rule chosen at announcement. */
  readonly activationResult?: {
    readonly entryStateChanges: readonly {
      readonly state: import("@tcg/grand-archive-types").GrandArchiveObjectState;
      readonly value: boolean;
    }[];
    readonly afterResolutionEffects: readonly import("@tcg/grand-archive-types").GrandArchiveEffect[];
  };
  readonly ability?: Extract<GrandArchiveExecutableAbility, { readonly kind: "card-resolution" }>;
}

export type GrandArchiveStackItem =
  | (GrandArchiveCardStackItemBase & {
      readonly kind: "card-activation";
    })
  | (GrandArchiveCardStackItemBase & {
      readonly kind: "materialization";
      /** Whether this is the phase's turn-based action or an effect instruction. */
      readonly materializationContext: "turn-based-action" | "effect-instruction";
    })
  | (GrandArchiveCardStackItemBase & {
      readonly kind: "bestowment";
    })
  | (GrandArchiveStackItemBase & {
      readonly kind: "activated-ability";
      readonly ability: Extract<GrandArchiveExecutableAbility, { readonly kind: "activated" }>;
      /** Serializable receipt key for this completed activation's printed usage limit. */
      readonly activationLimitUsageKey?: string;
    })
  | (GrandArchiveStackItemBase & {
      readonly kind: "triggered-ability";
      readonly ability: Extract<GrandArchiveExecutableAbility, { readonly kind: "triggered" }>;
    })
  | (GrandArchiveStackItemBase & {
      /** Rule-internal resolver for linked replacement text; never grants Opportunity. */
      readonly kind: "replacement-follow-up";
      readonly effect: import("@tcg/grand-archive-types").GrandArchiveEffect;
      readonly resumeReplacementPreCommit?: true;
      readonly internalAfterResolutionEvents?: readonly import("../kernel/events.ts").GrandArchiveProposedEvent[];
    });

export interface GrandArchiveReplacementFollowUp {
  readonly kind: "effect";
  readonly effect: import("@tcg/grand-archive-types").GrandArchiveEffect;
  readonly controllerId: GrandArchivePlayerId;
  readonly sourceId?: GrandArchiveObjectId;
  readonly sourceIncarnation?: number;
  readonly sourceLkiEventId?: GrandArchiveEventId;
  readonly bindings: Readonly<
    Record<string, import("../procedures/effects/evaluation.ts").GrandArchiveExecutionBinding>
  >;
  readonly variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
}

/** Intrinsic Critical resolution held ahead of the still-proposed damage event. */
export interface GrandArchiveCriticalReplacementFollowUp {
  readonly kind: "critical";
  readonly amount: number;
  readonly actorId: GrandArchivePlayerId;
  readonly sourceId: GrandArchiveObjectId;
  readonly recipientId: GrandArchiveObjectId;
  readonly declinedOpponentIds: readonly GrandArchivePlayerId[];
}

export type GrandArchiveReplacementPreCommitFollowUp =
  | GrandArchiveReplacementFollowUp
  | GrandArchiveCriticalReplacementFollowUp;

export interface GrandArchiveReplacementPreCommit {
  readonly followUp: GrandArchiveReplacementPreCommitFollowUp;
  readonly continuation: GrandArchiveReplacementContinuation;
  readonly afterResolutionEvents: readonly import("../kernel/events.ts").GrandArchiveProposedEvent[];
  readonly status: "pending" | "resolving";
}

export interface GrandArchiveTrackedCharacteristics {
  readonly incarnation: number;
  readonly values: Readonly<Record<string, readonly string[]>>;
}

export interface GrandArchiveOpportunityWindow {
  readonly holderId: GrandArchivePlayerId;
  readonly startedById: GrandArchivePlayerId;
  readonly passedPlayerIds: readonly GrandArchivePlayerId[];
  readonly reason:
    | "phase-begin"
    | "stack-item-added"
    | "stack-item-resolved"
    | "state-based-stack-change"
    | "turn-based-action"
    | "end-turn-request";
}

export interface GrandArchivePendingCombatDamageEvent {
  readonly recipientId: GrandArchiveObjectId;
  readonly amount: number;
  readonly sourceId: GrandArchiveObjectId;
  readonly combatParticipantIds: readonly GrandArchiveObjectId[];
  readonly actorId: GrandArchivePlayerId;
  readonly causeRule: "combat-damage" | "retaliation-combat-damage";
}

export interface GrandArchiveQueuedReplacementEvent {
  readonly event: import("../kernel/events.ts").GrandArchiveProposedEvent;
  readonly depth: number;
  readonly appliedReplacementIds: readonly string[];
}

/** Serializable transaction queue retained while a replacement choice is pending. */
export interface GrandArchiveReplacementContinuation {
  readonly queue: readonly GrandArchiveQueuedReplacementEvent[];
  readonly startedEventHistoryIndex: number;
  /** Set after an ordering choice when the selected replacement is itself optional. */
  readonly selectedCandidateId?: string;
}

export type GrandArchiveDecision =
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "choose-replacement";
      readonly playerId: GrandArchivePlayerId;
      readonly mode: "order" | "optional";
      readonly candidateIds: readonly [string, ...string[]];
      readonly continuation: GrandArchiveReplacementContinuation;
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "choose-unique-object";
      readonly playerId: GrandArchivePlayerId;
      readonly name: string;
      readonly candidates: readonly GrandArchiveObjectId[];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "choose-preserve-destination";
      readonly playerId: GrandArchivePlayerId;
      readonly cardId: GrandArchiveObjectId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "choose-retaliators";
      readonly playerId: GrandArchivePlayerId;
      readonly candidates: readonly GrandArchiveObjectId[];
      readonly selectedRetaliatorIds: readonly GrandArchiveObjectId[];
      readonly remainingControllerIds: readonly GrandArchivePlayerId[];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "order-retaliation-damage";
      readonly playerId: GrandArchivePlayerId;
      readonly retaliatorIds: readonly GrandArchiveObjectId[];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "resolve-critical";
      readonly playerId: GrandArchivePlayerId;
      readonly amount: number;
      readonly candidates: readonly GrandArchiveObjectId[];
      readonly sourceId: GrandArchiveObjectId;
      readonly recipientId: GrandArchiveObjectId;
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "declare-resolved-attack";
      readonly playerId: GrandArchivePlayerId;
      readonly intentId: GrandArchiveObjectId;
      readonly attackerCandidates: readonly GrandArchiveObjectId[];
      readonly targetCandidates: readonly GrandArchiveObjectId[];
      readonly weaponCandidates: readonly GrandArchiveObjectId[];
      readonly cleavePlayerCandidates: readonly GrandArchivePlayerId[];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "choose-delegated-defender";
      /** The chosen opponent who must select one of their legal defenders. */
      readonly playerId: GrandArchivePlayerId;
      readonly attackingPlayerId: GrandArchivePlayerId;
      readonly attackerId: GrandArchiveObjectId;
      readonly candidateIds: readonly GrandArchiveObjectId[];
      readonly additionalTargetIds: readonly GrandArchiveObjectId[];
      readonly attackCardId?: GrandArchiveObjectId;
      readonly weaponIds: readonly GrandArchiveObjectId[];
      readonly reservePayment?: readonly import("../commands/commands.ts").GrandArchiveReservePaymentSource[];
      readonly costSelections?: readonly (readonly GrandArchiveObjectId[])[];
      readonly costPaymentOrders?: readonly import("../commands/commands.ts").GrandArchiveCostPaymentOrder[];
      readonly costOptionIndex?: number;
      readonly payOptionalCost?: boolean;
      readonly resolvedAttack: boolean;
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "discard-to-influence-limit";
      readonly playerId: GrandArchivePlayerId;
      readonly maximum: number;
      readonly amount: number;
      readonly candidateIds: readonly GrandArchiveObjectId[];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "choose-recollection";
      readonly playerId: GrandArchivePlayerId;
      readonly amount: number;
      readonly candidateIds: readonly GrandArchiveObjectId[];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "announce-triggered-ability";
      readonly playerId: GrandArchivePlayerId;
      readonly pendingTriggerId: string;
      readonly modes?: {
        readonly choose: import("@tcg/grand-archive-types").GrandArchiveSelectionCount;
        readonly allowRepeat?: boolean;
        readonly modes: readonly import("@tcg/grand-archive-types").GrandArchiveModeEffect[];
      };
      readonly baseTargets: readonly import("@tcg/grand-archive-types").GrandArchiveTargetDeclaration[];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "order-triggered-abilities";
      readonly playerId: GrandArchivePlayerId;
      readonly batchId: string;
      readonly pendingTriggerIds: readonly string[];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "resolve-optional-effect";
      readonly playerId: GrandArchivePlayerId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "resolve-effect-choice";
      readonly playerId: GrandArchivePlayerId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly selection: import("@tcg/grand-archive-types").GrandArchiveResolutionChoice;
      /** CR Searching and Finding 1.1: a filtered private-zone search may select nothing. */
      readonly mayFailToFind?: true;
      /** Earlier public simultaneous choices, disclosed in turn order under CR Simultaneous Selections 1. */
      readonly publicSelections?: readonly import("../projection/simultaneous-selection-visibility.ts").GrandArchivePublicSimultaneousSelection[];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "retarget-stack-item";
      readonly playerId: GrandArchivePlayerId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly targetStackItemId: GrandArchiveStackItemId;
      readonly declarations: readonly import("@tcg/grand-archive-types").GrandArchiveTargetDeclaration[];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "remode-stack-item";
      readonly playerId: GrandArchivePlayerId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly targetStackItemId: GrandArchiveStackItemId;
      readonly choices: readonly (readonly string[])[];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "resolve-effect-payment";
      readonly playerId: GrandArchivePlayerId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly cost: import("@tcg/grand-archive-types").GrandArchiveAbilityCost;
      readonly mayDecline: boolean;
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "resolve-level-up";
      readonly playerId: GrandArchivePlayerId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly championId: GrandArchiveObjectId;
      readonly candidateCardIds: readonly [
        GrandArchiveObjectId,
        GrandArchiveObjectId,
        ...GrandArchiveObjectId[],
      ];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "resolve-direction-choice";
      readonly playerId: GrandArchivePlayerId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly state: "shifting-currents";
      readonly from: GrandArchiveShiftingCurrentsDirection;
      readonly directions: readonly [
        GrandArchiveShiftingCurrentsDirection,
        ...GrandArchiveShiftingCurrentsDirection[],
      ];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "resolve-distribution";
      readonly playerId: GrandArchivePlayerId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly amount: number;
      readonly among: import("@tcg/grand-archive-types").GrandArchiveResolutionChoice;
      readonly payload: Extract<
        import("@tcg/grand-archive-types").GrandArchiveEffect,
        { readonly kind: "distribute" }
      >["payload"];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "resolve-move-partition";
      readonly playerId: GrandArchivePlayerId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly objectIds: readonly GrandArchiveObjectId[];
      readonly destinations: Extract<
        import("@tcg/grand-archive-types").GrandArchiveEffect,
        { readonly kind: "move-partition" }
      >["destinations"];
      readonly stateVersion: number;
    }
  | ({
      readonly id: GrandArchiveDecisionId;
      readonly kind: "resolve-counter-allocation";
      readonly playerId: GrandArchivePlayerId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly counter: string;
      readonly candidates: readonly {
        readonly objectId: GrandArchiveObjectId;
        readonly available: number;
      }[];
      readonly minimum: number;
      readonly maximum: number;
      readonly stateVersion: number;
    } & (
      | { readonly operation: "remove" }
      | { readonly operation: "move"; readonly destinationId: GrandArchiveObjectId }
    ))
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "announce-effect-attack";
      readonly playerId: GrandArchivePlayerId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly attackerId: GrandArchiveObjectId;
      readonly additional: boolean;
      readonly targetCandidates: readonly GrandArchiveObjectId[];
      readonly weaponCandidates: readonly GrandArchiveObjectId[];
      readonly cleavePlayerCandidates: readonly GrandArchivePlayerId[];
      readonly cost?: import("@tcg/grand-archive-types").GrandArchiveAbilityCost;
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "announce-effect-materialization";
      readonly playerId: GrandArchivePlayerId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly cardId: GrandArchiveObjectId;
      readonly payCosts: boolean;
      readonly ignoreElementRequirements: boolean;
      readonly costModifiers: readonly {
        readonly operation: "add" | "subtract" | "set";
        readonly amount: import("@tcg/grand-archive-types").GrandArchiveAmount;
      }[];
      /** Present when the surrounding effect explicitly tracks whether the attempt succeeded. */
      readonly attemptBinding?: string;
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "announce-effect-activation";
      readonly playerId: GrandArchivePlayerId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly cardId: GrandArchiveObjectId;
      readonly payCosts: boolean;
      readonly ignoreElementRequirements: boolean;
      readonly speed?: "fast" | "slow";
      readonly costModifiers: readonly {
        readonly operation: "add" | "subtract" | "set";
        readonly amount: import("@tcg/grand-archive-types").GrandArchiveAmount;
      }[];
      readonly stateVersion: number;
    }
  | {
      readonly id: GrandArchiveDecisionId;
      readonly kind: "resolve-glimpse";
      readonly playerId: GrandArchivePlayerId;
      readonly stackItemId: GrandArchiveStackItemId;
      readonly cardIds: readonly GrandArchiveObjectId[];
      readonly stateVersion: number;
    };

/** Runtime counterpart of the decision discriminant union for untrusted persistence admission. */
export const GRAND_ARCHIVE_DECISION_KINDS = {
  "choose-replacement": true,
  "choose-unique-object": true,
  "choose-preserve-destination": true,
  "choose-retaliators": true,
  "order-retaliation-damage": true,
  "resolve-critical": true,
  "declare-resolved-attack": true,
  "choose-delegated-defender": true,
  "discard-to-influence-limit": true,
  "choose-recollection": true,
  "announce-triggered-ability": true,
  "order-triggered-abilities": true,
  "resolve-optional-effect": true,
  "resolve-effect-choice": true,
  "retarget-stack-item": true,
  "remode-stack-item": true,
  "resolve-effect-payment": true,
  "resolve-level-up": true,
  "resolve-direction-choice": true,
  "resolve-distribution": true,
  "resolve-move-partition": true,
  "resolve-counter-allocation": true,
  "announce-effect-attack": true,
  "announce-effect-materialization": true,
  "announce-effect-activation": true,
  "resolve-glimpse": true,
} as const satisfies Record<GrandArchiveDecision["kind"], true>;

export type GrandArchiveResolutionFrame =
  | {
      readonly kind: "effect";
      readonly effect: import("@tcg/grand-archive-types").GrandArchiveEffect;
      /** Rule-internal Link choices applied while preserving one simultaneous field entry. */
      readonly entryLinkHostBindings?: Readonly<Record<GrandArchiveObjectId, string>>;
      /** Privacy carried across a suspended simultaneous ordered-zone placement. */
      readonly orderedPrivatePlacementKnowledge?: import("../kernel/events.ts").GrandArchiveOrderedPrivatePlacementKnowledge;
    }
  | {
      /** Copy rule 5: optionally replace only the copied instance's fixed modes. */
      readonly kind: "remode-copied-stack-item";
      readonly targetStackItemId: GrandArchiveStackItemId;
      readonly mayRetarget: boolean;
    }
  | {
      readonly kind: "set-binding";
      readonly binding: string;
      readonly value: import("../procedures/effects/evaluation.ts").GrandArchiveExecutionBinding;
    }
  | {
      readonly kind: "set-derived-variable";
      readonly symbol: "X" | "Y" | "Z";
      readonly amount: import("@tcg/grand-archive-types").GrandArchiveAmount;
    }
  | {
      readonly kind: "apply-selection";
      readonly selectionId: string;
      readonly operation: "reserve" | "discard" | "banish" | "reveal" | "look-at" | "search";
      readonly playerIds: readonly [GrandArchivePlayerId, ...GrandArchivePlayerId[]];
      readonly revealSearch?: boolean;
      readonly faceDown?: boolean;
      readonly bindResultAs?: string;
    }
  | {
      readonly kind: "summon-selected-token";
      readonly selectionId: string;
      readonly controller: import("@tcg/grand-archive-types").GrandArchivePlayerSet;
      readonly bindResultAs?: string;
    }
  | {
      readonly kind: "generate-selected-cards";
      readonly selectionId: string;
      readonly player: import("@tcg/grand-archive-types").GrandArchiveRelativePlayer;
      readonly destination: import("@tcg/grand-archive-types").GrandArchiveMoveDestination;
    }
  | {
      readonly kind: "announce-materialization";
      readonly playerId: GrandArchivePlayerId;
      readonly cardId: GrandArchiveObjectId;
      readonly payCosts: boolean;
      readonly ignoreElementRequirements: boolean;
      readonly costModifiers: readonly {
        readonly operation: "add" | "subtract" | "set";
        readonly amount: import("@tcg/grand-archive-types").GrandArchiveAmount;
      }[];
      readonly attemptBinding?: string;
    }
  | {
      readonly kind: "announce-activation";
      readonly playerId: GrandArchivePlayerId;
      readonly cardId: GrandArchiveObjectId;
      readonly payCosts: boolean;
      readonly ignoreElementRequirements: boolean;
      readonly speed?: "fast" | "slow";
      readonly costModifiers: readonly {
        readonly operation: "add" | "subtract" | "set";
        readonly amount: import("@tcg/grand-archive-types").GrandArchiveAmount;
      }[];
    }
  | {
      readonly kind: "finish-reflexive";
      readonly startedEventHistoryIndex: number;
      readonly targets?: readonly import("@tcg/grand-archive-types").GrandArchiveTargetDeclaration[];
      readonly cardinality?: "each-result-object";
      readonly consequence: import("@tcg/grand-archive-types").GrandArchiveEffect;
    }
  | {
      /** Completes an `attempt` after all nested choices and replacements have resolved. */
      readonly kind: "finish-attempt";
      readonly startedEventHistoryIndex: number;
      readonly bindSucceededAs: string;
    }
  | {
      /** Executes linked replacement text in its own source/controller evaluation context. */
      readonly kind: "replacement-follow-up";
      readonly followUp: GrandArchiveReplacementFollowUp;
    }
  | {
      readonly kind: "restore-resolution-context";
      readonly context: {
        readonly controllerId: GrandArchivePlayerId;
        readonly sourceId?: GrandArchiveObjectId;
        readonly sourceIncarnation?: number;
        readonly sourceLkiEventId?: GrandArchiveEventId;
        readonly championLevelModifier: number;
        readonly elysianAuraActive: boolean;
        readonly elysianAuraEligible: boolean;
        readonly selectedModeIds: readonly string[];
        readonly bindings: Readonly<
          Record<string, import("../procedures/effects/evaluation.ts").GrandArchiveExecutionBinding>
        >;
        readonly variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
      };
    }
  | {
      readonly kind: "track-selected-characteristic";
      readonly selectionId: string;
      readonly trackAs: string;
    }
  | {
      /** Resumes the held replacement transaction after its event-processing effect resolves. */
      readonly kind: "resume-replacement-pre-commit";
    };

export interface GrandArchiveEffectResolution {
  readonly stackItemId: GrandArchiveStackItemId;
  /** Target, negation, source, and intervening-condition legality is checked once on entry. */
  readonly legalityChecked: boolean;
  readonly controllerId: GrandArchivePlayerId;
  readonly sourceId?: GrandArchiveObjectId;
  readonly sourceIncarnation?: number;
  readonly sourceLkiEventId?: GrandArchiveEventId;
  readonly championLevelModifier: number;
  /** Whether the currently evaluated resolution context has an active Elysian Aura. */
  readonly elysianAuraActive: boolean;
  /** Whether this context is an Aenean Spell card activation affected by Elysian Aura. */
  readonly elysianAuraEligible: boolean;
  readonly selectedModeIds: readonly string[];
  readonly frames: readonly GrandArchiveResolutionFrame[];
  readonly bindings: Readonly<
    Record<string, import("../procedures/effects/evaluation.ts").GrandArchiveExecutionBinding>
  >;
  readonly variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
  readonly startedEventHistoryIndex: number;
  readonly pendingOptional?: {
    readonly effect: import("@tcg/grand-archive-types").GrandArchiveEffect;
    readonly otherwise?: import("@tcg/grand-archive-types").GrandArchiveEffect;
  };
  readonly pendingChoice?: {
    readonly selection: import("@tcg/grand-archive-types").GrandArchiveResolutionChoice;
    readonly framesAfterChoice: readonly GrandArchiveResolutionFrame[];
    readonly bindResultAs?: string;
    /** Runtime permission derived from the search instruction, never authored as a generic choice. */
    readonly mayFailToFind?: true;
    /** Overrides source controller while validating a choice made by another player. */
    readonly controllerId?: GrandArchivePlayerId;
    /** Simultaneous multi-player choices are collected before their effects are applied. */
    readonly simultaneous?: {
      readonly selected: readonly GrandArchiveTargetId[];
      readonly publicSelections?: readonly import("../projection/simultaneous-selection-visibility.ts").GrandArchivePublicSimultaneousSelection[];
      readonly remaining: readonly {
        readonly playerId: GrandArchivePlayerId;
        readonly selection: import("@tcg/grand-archive-types").GrandArchiveResolutionChoice;
      }[];
    };
  };
  readonly pendingRetarget?: {
    readonly targetStackItemId: GrandArchiveStackItemId;
    readonly declarations: readonly import("@tcg/grand-archive-types").GrandArchiveTargetDeclaration[];
  };
  readonly pendingRemode?: {
    readonly targetStackItemId: GrandArchiveStackItemId;
    readonly choices: readonly (readonly string[])[];
    readonly mayRetarget: boolean;
  };
  readonly pendingPayment?: {
    readonly playerId: GrandArchivePlayerId;
    /** Further eligible payers asked in turn order after this player declines. */
    readonly remainingPlayerIds?: readonly GrandArchivePlayerId[];
    readonly cost: import("@tcg/grand-archive-types").GrandArchiveAbilityCost;
    readonly mayDecline: boolean;
    readonly afterPaid?: import("@tcg/grand-archive-types").GrandArchiveEffect;
    readonly afterDeclined?: import("@tcg/grand-archive-types").GrandArchiveEffect;
  };
  readonly pendingLevelUp?: {
    readonly championId: GrandArchiveObjectId;
    readonly candidateCardIds: readonly [
      GrandArchiveObjectId,
      GrandArchiveObjectId,
      ...GrandArchiveObjectId[],
    ];
  };
  readonly pendingDirectionChoice?: {
    readonly playerId: GrandArchivePlayerId;
    readonly state: "shifting-currents";
    readonly from: GrandArchiveShiftingCurrentsDirection;
    readonly directions: readonly [
      GrandArchiveShiftingCurrentsDirection,
      ...GrandArchiveShiftingCurrentsDirection[],
    ];
  };
  readonly pendingDistribution?: {
    readonly playerId: GrandArchivePlayerId;
    readonly amount: number;
    readonly among: import("@tcg/grand-archive-types").GrandArchiveResolutionChoice;
    readonly payload: Extract<
      import("@tcg/grand-archive-types").GrandArchiveEffect,
      { readonly kind: "distribute" }
    >["payload"];
  };
  readonly pendingMovePartition?: {
    readonly playerId: GrandArchivePlayerId;
    readonly objectIds: readonly GrandArchiveObjectId[];
    readonly destinations: Extract<
      import("@tcg/grand-archive-types").GrandArchiveEffect,
      { readonly kind: "move-partition" }
    >["destinations"];
  };
  readonly pendingCounterAllocation?: {
    readonly playerId: GrandArchivePlayerId;
    readonly counter: string;
    readonly candidates: readonly {
      readonly objectId: GrandArchiveObjectId;
      readonly available: number;
    }[];
    readonly minimum: number;
    readonly maximum: number;
    readonly bindResultAs?: string;
    readonly operation:
      | { readonly kind: "remove" }
      | { readonly kind: "move"; readonly destinationId: GrandArchiveObjectId };
  };
  readonly pendingEffectAttack?: {
    readonly playerId: GrandArchivePlayerId;
    readonly attackerId: GrandArchiveObjectId;
    readonly additional: boolean;
    readonly cost?: import("@tcg/grand-archive-types").GrandArchiveAbilityCost;
    readonly ifDeclared?: import("@tcg/grand-archive-types").GrandArchiveEffect;
  };
  readonly pendingGlimpse?: {
    readonly cardIds: readonly GrandArchiveObjectId[];
    readonly bindResultAs?: string;
  };
  readonly pendingMaterialization?: {
    readonly playerId: GrandArchivePlayerId;
    readonly cardId: GrandArchiveObjectId;
    readonly payCosts: boolean;
    readonly ignoreElementRequirements: boolean;
    readonly costModifiers: readonly {
      readonly operation: "add" | "subtract" | "set";
      readonly amount: import("@tcg/grand-archive-types").GrandArchiveAmount;
    }[];
    readonly attemptBinding?: string;
  };
  readonly pendingActivation?: {
    readonly playerId: GrandArchivePlayerId;
    readonly cardId: GrandArchiveObjectId;
    readonly payCosts: boolean;
    readonly ignoreElementRequirements: boolean;
    readonly speed?: "fast" | "slow";
    readonly costModifiers: readonly {
      readonly operation: "add" | "subtract" | "set";
      readonly amount: import("@tcg/grand-archive-types").GrandArchiveAmount;
    }[];
  };
  /** Atomic effect whose proposed events are waiting on a replacement decision. */
  readonly pendingReplacement?: {
    readonly resultEventHistoryIndex: number;
    readonly bindResultAs?: string;
    readonly counterRemovalBinding?: string;
    readonly resultMetric?: import("../kernel/modified-results.ts").GrandArchiveModifiedResultMetric;
  };
  /** Items activated during this resolution that cannot become resolvable until it finishes. */
  readonly deferredStackItems: readonly GrandArchiveStackItem[];
}

interface GrandArchivePendingTriggerBase {
  readonly id: string;
  readonly batchId: string;
  readonly orderingConfirmed: boolean;
  readonly controllerId: GrandArchivePlayerId;
  readonly ability: Extract<GrandArchiveExecutableAbility, { readonly kind: "triggered" }>;
  /** Automatic mode fixed when a Cascade ability triggers, before stack entry. */
  readonly selectedModeIds: readonly string[];
  readonly bindings: Readonly<
    Record<string, import("../procedures/effects/evaluation.ts").GrandArchiveExecutionBinding>
  >;
  readonly variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
  readonly activationPayment: readonly GrandArchiveActivationPaymentRecord[];
  readonly createdAtVersion: number;
  /**
   * Stable receipt for one admitted occurrence of a printed trigger limit.
   * Trigger multipliers copy the pending ability without duplicating this receipt.
   */
  readonly triggerLimitUsageKey?: string;
}

/** A pending trigger always retains exactly one source identity. */
export type GrandArchivePendingTrigger = GrandArchivePendingTriggerBase &
  (
    | {
        readonly sourceId: GrandArchiveObjectId;
        readonly sourceIncarnation: number;
        /** Exact departure checkpoint when this trigger uses source LKI. */
        readonly sourceLkiEventId?: GrandArchiveEventId;
        readonly masterySource?: never;
        readonly gameSource?: never;
      }
    | {
        readonly sourceId?: never;
        readonly sourceIncarnation?: never;
        readonly sourceLkiEventId?: never;
        readonly masterySource: {
          readonly playerId: GrandArchivePlayerId;
          readonly name: string;
        };
        readonly gameSource?: never;
      }
    | {
        readonly sourceId?: never;
        readonly sourceIncarnation?: never;
        readonly sourceLkiEventId?: never;
        readonly masterySource?: never;
        readonly gameSource: GrandArchiveGameAbilitySource;
      }
  );

export interface GrandArchiveGeneratedTrigger {
  readonly id: string;
  readonly sourceId: GrandArchiveObjectId;
  readonly controllerId: GrandArchivePlayerId;
  readonly ability: Extract<GrandArchiveExecutableAbility, { readonly kind: "triggered" }>;
  readonly bindings: Readonly<
    Record<string, import("../procedures/effects/evaluation.ts").GrandArchiveExecutionBinding>
  >;
  readonly variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
  readonly createdAtVersion: number;
}

export interface GrandArchiveDelayedTriggerInstance {
  readonly id: string;
  readonly sourceId: GrandArchiveObjectId;
  readonly controllerId: GrandArchivePlayerId;
  readonly ability: Extract<GrandArchiveExecutableAbility, { readonly kind: "triggered" }>;
  readonly bindings: Readonly<
    Record<string, import("../procedures/effects/evaluation.ts").GrandArchiveExecutionBinding>
  >;
  /**
   * Object incarnations captured for object IDs present in `bindings` when the
   * delayed trigger was created. A later zone change makes that card a new
   * rules object, so the stale binding must not capture a later incarnation.
   */
  readonly bindingObjectIncarnations: Readonly<
    Record<string, Readonly<Partial<Record<GrandArchiveObjectId, number>>>>
  >;
  readonly variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
  readonly duration?: import("@tcg/grand-archive-types").GrandArchiveDuration;
  readonly durationAnchors: GrandArchiveDurationAnchors;
  readonly createdAtVersion: number;
  readonly createdTurnNumber: number;
  readonly createdPhase: GrandArchivePhase;
  readonly notBeforeTurnNumber: number;
  readonly remainingUses?: number;
}

export interface GrandArchiveCombatState {
  readonly attackerId: GrandArchiveObjectId;
  readonly attackingPlayerId: GrandArchivePlayerId;
  readonly defendingPlayerIds: readonly GrandArchivePlayerId[];
  readonly targetIds: readonly GrandArchiveObjectId[];
  readonly cleavePlayerId?: GrandArchivePlayerId;
  readonly retaliatorIds: readonly GrandArchiveObjectId[];
  readonly retaliationOrderConfirmed: boolean;
  readonly weaponIds: readonly GrandArchiveObjectId[];
  readonly intentIds: readonly GrandArchiveObjectId[];
  readonly step: "declaration" | "retaliation" | "damage" | "end";
}

/** A resolving effect finishes before this requested rules procedure is applied. */
export type GrandArchivePendingTermination =
  | { readonly kind: "phase"; readonly phase: GrandArchivePhase }
  | { readonly kind: "turn" };

/** Effect-declared outcomes wait until the rules finish their state-based checks. */
export type GrandArchivePendingGameOutcome =
  | { readonly kind: "draw" }
  | { readonly kind: "wins"; readonly playerIds: readonly GrandArchivePlayerId[] };

export interface GrandArchiveTurnState {
  readonly number: number;
  readonly playerId: GrandArchivePlayerId;
  readonly phase: GrandArchivePhase;
  /** Distinguishes the normal pre-recollection phase from an effect-created extra phase. */
  readonly materializeKind: "regular" | "additional" | null;
  readonly materializeChoicePending: boolean;
  readonly recollectionPending: boolean;
  readonly drawPending: boolean;
  readonly cleanupPending: boolean;
  /** Attack declarations attempted this turn, including attempts later found illegal. */
  readonly attackAttempts: readonly {
    readonly attackerId: GrandArchiveObjectId;
    readonly targetIds: readonly GrandArchiveObjectId[];
    readonly declared: boolean;
  }[];
}

export interface GrandArchiveRandomState {
  readonly seed: number;
  readonly cursor: number;
}

export interface GrandArchiveContinuousEffectInstance {
  readonly id: string;
  readonly sourceId?: GrandArchiveObjectId;
  /** Source identity and exact departure checkpoint retained from the resolving ability. */
  readonly sourceIncarnation?: number;
  readonly sourceLkiEventId?: GrandArchiveEventId;
  readonly controllerId: GrandArchivePlayerId;
  /** A duration-bearing modifier created by a resolving effect. */
  readonly effect:
    | import("@tcg/grand-archive-types").GrandArchiveContinuousEffect
    | import("@tcg/grand-archive-types").GrandArchiveContinuousPlayerPropertyEffect
    | import("@tcg/grand-archive-types").GrandArchiveContinuousPlayerStateEffect
    | import("@tcg/grand-archive-types").GrandArchiveTriggerMultiplierEffect;
  readonly affectedObjectIds: readonly GrandArchiveObjectId[];
  /** Object incarnation captured for each locked subject; zone changes create a new incarnation. */
  readonly affectedObjectIncarnations: Readonly<Record<GrandArchiveObjectId, number>>;
  /** Resolution bindings captured when this effect was created. */
  readonly bindings: Readonly<
    Record<string, import("../procedures/effects/evaluation.ts").GrandArchiveExecutionBinding>
  >;
  /** Resolution variables captured when this effect was created. */
  readonly variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
  /** Relative players in the duration are fixed when the effect begins. */
  readonly durationAnchors: GrandArchiveDurationAnchors;
  readonly createdAtVersion: number;
  readonly createdTurnNumber: number;
  readonly createdPhase: GrandArchivePhase;
}

/** Replacement effect created by a resolving card or ability rather than a static source. */
export interface GrandArchiveReplacementEffectInstance {
  readonly id: string;
  readonly sourceId?: GrandArchiveObjectId;
  readonly controllerId: GrandArchivePlayerId;
  /** Printed ability that created this replacement, used by event-cause references to “this”. */
  readonly abilityId?: string;
  readonly effect: import("@tcg/grand-archive-types").GrandArchiveReplacementEffect;
  readonly bindings: Readonly<
    Record<string, import("../procedures/effects/evaluation.ts").GrandArchiveExecutionBinding>
  >;
  readonly variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
  readonly resultVariables?: readonly Extract<
    import("@tcg/grand-archive-types").GrandArchiveVariableDeclaration,
    { readonly kind: "derived" }
  >[];
  /** Relative players in the duration are fixed when the effect begins. */
  readonly durationAnchors: GrandArchiveDurationAnchors;
  /** Shielding capacity is fixed when the replacement is created. */
  readonly capacity:
    | {
        readonly scope: "replacement-instance";
        readonly initial: number;
        readonly remaining: number;
      }
    | {
        readonly scope: "per-object";
        readonly initial: number;
        /** Missing entries retain the full initial capacity. */
        readonly remainingByObject: Readonly<
          Record<GrandArchiveObjectId, { readonly incarnation: number; readonly remaining: number }>
        >;
      }
    | null;
  readonly createdAtVersion: number;
  readonly createdTurnNumber: number;
  readonly createdPhase: GrandArchivePhase;
}

export interface GrandArchiveRuleModificationInstance {
  readonly id: string;
  readonly sourceId?: GrandArchiveObjectId;
  readonly controllerId: GrandArchivePlayerId;
  readonly effect: import("@tcg/grand-archive-types").GrandArchiveRuleModification;
  /** Resolution-time object set for instanced rule text such as “allies you control get”. */
  readonly affectedObjectIds: readonly GrandArchiveObjectId[];
  readonly affectedObjectIncarnations: Readonly<Record<GrandArchiveObjectId, number>>;
  /** Resolution/event bindings captured when the modifying rule was created. */
  readonly bindings: Readonly<
    Record<string, import("../procedures/effects/evaluation.ts").GrandArchiveExecutionBinding>
  >;
  /** Resolution variables captured when this modifying rule was created. */
  readonly variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
  /** Relative players in the duration are fixed when the effect begins. */
  readonly durationAnchors: GrandArchiveDurationAnchors;
  readonly createdAtVersion: number;
  readonly createdTurnNumber: number;
  readonly createdPhase: GrandArchivePhase;
}

/** Resolution-time player identities used by temporal duration boundaries. */
export interface GrandArchiveDurationAnchors {
  readonly whosePlayerIds?: readonly GrandArchivePlayerId[];
  readonly startsPlayerIds?: readonly GrandArchivePlayerId[];
  readonly expires?: GrandArchiveDurationAnchors;
}

export interface GrandArchiveMatchState {
  readonly schemaVersion: 1;
  readonly programFingerprint: string;
  readonly mode: GrandArchiveGameMode;
  readonly status: GrandArchiveMatchStatus;
  readonly winnerIds: readonly GrandArchivePlayerId[];
  readonly gameStates: Readonly<Record<string, boolean>>;
  readonly stateVersion: number;
  readonly players: Readonly<Record<GrandArchivePlayerId, GrandArchivePlayerState>>;
  readonly turnOrder: readonly GrandArchivePlayerId[];
  readonly objects: Readonly<Record<GrandArchiveObjectId, GrandArchiveCardInstance>>;
  readonly zones: Readonly<
    Record<
      GrandArchivePlayerId,
      Readonly<Record<GrandArchiveZone, readonly GrandArchiveObjectId[]>>
    >
  >;
  readonly sharedZones: Readonly<Record<"effects-stack", readonly GrandArchiveObjectId[]>>;
  readonly stack: readonly GrandArchiveStackItem[];
  readonly turn: GrandArchiveTurnState;
  readonly pregame: GrandArchivePregameState | null;
  readonly opportunity: GrandArchiveOpportunityWindow | null;
  readonly decision: GrandArchiveDecision | null;
  readonly resolution: GrandArchiveEffectResolution | null;
  /** Linked replacement instructions waiting to resolve before triggers and state checks. */
  readonly replacementFollowUps: readonly GrandArchiveReplacementFollowUp[];
  readonly replacementPreCommit: GrandArchiveReplacementPreCommit | null;
  /** Chosen characteristics keyed by object identity and guarded by object incarnation. */
  readonly trackedCharacteristics: Readonly<
    Partial<Record<GrandArchiveObjectId, GrandArchiveTrackedCharacteristics>>
  >;
  readonly combat: GrandArchiveCombatState | null;
  readonly pendingGameOutcome: GrandArchivePendingGameOutcome | null;
  /** Phase/turn termination requested by the resolving effect and applied after it resolves. */
  readonly pendingTermination: GrandArchivePendingTermination | null;
  readonly random: GrandArchiveRandomState;
  readonly nextObjectOrdinal: number;
  readonly nextStackOrdinal: number;
  readonly nextDecisionOrdinal: number;
  readonly nextEventOrdinal: number;
  readonly eventHistory: readonly import("../kernel/events.ts").GrandArchiveCommittedEvent[];
  readonly continuousEffects: readonly GrandArchiveContinuousEffectInstance[];
  readonly nextContinuousOrdinal: number;
  readonly replacementEffects: readonly GrandArchiveReplacementEffectInstance[];
  readonly nextReplacementOrdinal: number;
  /** Applied replacement counts keyed by their rules-defined tracking scope. */
  readonly replacementLimitUsages: Readonly<Record<string, number>>;
  readonly ruleModifications: readonly GrandArchiveRuleModificationInstance[];
  readonly nextRuleModificationOrdinal: number;
  readonly pendingTriggers: readonly GrandArchivePendingTrigger[];
  readonly nextPendingTriggerOrdinal: number;
  readonly generatedTriggers: readonly GrandArchiveGeneratedTrigger[];
  readonly nextGeneratedTriggerOrdinal: number;
  readonly delayedTriggers: readonly GrandArchiveDelayedTriggerInstance[];
  readonly nextDelayedTriggerOrdinal: number;
}
