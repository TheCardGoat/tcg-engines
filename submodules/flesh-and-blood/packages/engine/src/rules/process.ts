import type { FabCondition, FabCost, FabEffect, FabTrigger } from "@tcg/flesh-and-blood-types";
import type {
  CommittedEvent,
  FabDecisionId,
  FabEventBindings,
  FabEventId,
  FabObjectSnapshot,
  FabProcessId,
  FabProposedEventGroup,
  ProposedEvent,
} from "./events.ts";
import type { FabAttackTarget } from "../state.ts";
import type { FabSplitPlayMethod } from "../cards.ts";
import type {
  FabObjectRef,
  FabObjectSubstage,
  FabRulesStage,
  FabRulesSubjectRef,
  FabRulesTimestamp,
} from "./continuous/ir.ts";
import type { FabTriggeredResolution } from "./layers.ts";
import type { FabTargetMap, MutableFabTargetMap } from "./targets.ts";
import type {
  FabActivationCreateTokenCost,
  FabActivationSelfMoveToDeckCost,
} from "../procedures/activate-ability/costs/types.ts";

export interface FabDeterministicCounters {
  process: number;
  event: number;
  batch: number;
  layer: number;
  decision: number;
  effect: number;
  timestamp: number;
  checkpoint: number;
  objectIncarnation: number;
}

export interface FabPendingTrigger {
  readonly pendingTriggerId: string;
  readonly abilityId: string;
  readonly controllerId: string;
  readonly source: FabObjectSnapshot;
  readonly trigger: FabTrigger;
  readonly abilityCondition?: FabCondition;
  readonly resolution: FabTriggeredResolution;
  readonly layerKeywords: readonly string[];
  readonly triggeringEvent: CommittedEvent | null;
  readonly bindings: FabEventBindings;
  readonly simultaneousGroupId: string;
  readonly declaredModes: readonly string[];
  readonly modesDeclared: boolean;
  readonly declaredTargets: FabTargetMap;
  readonly optionalTriggerAutomation?: FabOptionalTriggerAutomation;
  /** True after a triggered `additionalCost` has been paid or skipped. */
  readonly additionalCostResolved?: boolean;
}

export interface FabOptionalTriggerAutomation {
  readonly ownerId: string;
  readonly ownerChoice: "accept" | "decline";
  readonly autoPassWhileTop: true;
}

export interface FabDelayedTrigger {
  readonly delayedTriggerId: string;
  readonly controllerId: string;
  readonly source: FabObjectSnapshot;
  readonly trigger: FabTrigger;
  readonly resolution: FabTriggeredResolution;
  /** One legal lifetime/consumption policy; contradictory combinations are unrepresentable. */
  readonly policy: FabDelayedTriggerPolicy;
  /** Bindings captured while arming the delayed clause. */
  readonly bindings?: FabEventBindings;
  readonly createdByEventId: FabEventId | null;
}

export type FabDelayedTriggerExpiry =
  | { readonly kind: "turn"; readonly turnNumber: number }
  | { readonly kind: "phase"; readonly turnNumber: number; readonly phase: string }
  | { readonly kind: "combat-chain"; readonly combatNumber: number }
  | {
      readonly kind: "player-turn-start";
      readonly playerId: string;
      readonly afterTurnNumber: number;
    }
  | {
      readonly kind: "player-turn-end";
      readonly playerId: string;
      readonly turnNumber: number;
    }
  | {
      readonly kind: "player-action-phase-window";
      readonly playerId: string;
      readonly windowTurnNumber: number;
    }
  | {
      readonly kind: "player-end-phase-window";
      readonly playerId: string;
      readonly windowTurnNumber: number;
    }
  | {
      readonly kind: "player-next-clash";
      readonly playerId: string;
      /** "Their next clash this turn" also expires if no clash occurs. */
      readonly turnNumber: number;
    }
  | { readonly kind: "source"; readonly ref: FabObjectRef };

export type FabDelayedTriggerPolicy = {
  readonly kind: "windowed";
  readonly expiresAt: FabDelayedTriggerExpiry;
  readonly matching: "first" | "every";
};

export type FabCanonicalReplacementEffect = Extract<
  FabEffect,
  { readonly type: "replacement" | "prevention" }
>;

export type FabPersistedPreventionCost =
  | {
      readonly kind: "discard-hand-card";
      readonly filter?: import("@tcg/flesh-and-blood-types").FabCardFilter;
    }
  | { readonly kind: "banish-soul-card" }
  | {
      readonly kind: "remove-named-counter";
      readonly counter: string;
      readonly amount: number;
      readonly filter?: import("@tcg/flesh-and-blood-types").FabCardFilter;
    }
  | {
      readonly kind: "destroy-arena-object";
      readonly filter: import("@tcg/flesh-and-blood-types").FabCardFilter;
    }
  | { readonly kind: "banish-source" };

export type FabPersistedPreventionFollowUp =
  | { readonly kind: "draw"; readonly count: number }
  | { readonly kind: "destroy-source-at-end-phase" };

/** Application semantics fixed when a floating replacement is registered. */
export type FabPersistedReplacementApplicationPolicy =
  | { readonly kind: "mandatory" }
  | {
      readonly kind: "may-apply";
      readonly cost?: FabPersistedPreventionCost;
      readonly followUps: readonly FabPersistedPreventionFollowUp[];
      readonly consequence?: { readonly kind: "reclash-original-reveal" };
    };

/**
 * The rules moment that exhausts a bounded replacement effect.
 * Optional "next/first time" effects consume their matching opportunity even
 * when their controller declines the modification.
 */
export type FabReplacementConsumptionPolicy =
  | { readonly kind: "never" }
  | { readonly kind: "on-application" }
  | { readonly kind: "on-opportunity" };

/** Auditable reducer input: why and where a replacement was exhausted. */
export interface FabReplacementConsumption {
  readonly replacementId: string;
  readonly controllerId: string;
  readonly origin: "static" | "persisted";
  readonly reason: "application" | "opportunity";
  /**
   * CR 6.4.10j: points actually prevented by this application of a shielding
   * prevention, derived from the boundary batch's `prevent` events. The
   * consume-replacement-effects reducer decrements the effect's budget by this
   * instead of removing it; while budget remains the effect stays active.
   * Shielding applications that prevented nothing (CR 6.4.10h unpreventable
   * damage) emit no consumption at all, so the budget is left untouched.
   */
  readonly preventedAmount?: number;
}

/** Serializable floating replacement/prevention context created by a resolving layer. */
export interface FabPersistedReplacement {
  readonly replacementId: string;
  readonly controllerId: string;
  readonly source: FabObjectSnapshot;
  readonly effect: FabCanonicalReplacementEffect;
  readonly createdByEventId: FabEventId | null;
  readonly expiresAt:
    | { readonly kind: "turn"; readonly turnNumber: number }
    | { readonly kind: "phase"; readonly turnNumber: number; readonly phase: string }
    | { readonly kind: "combat-chain"; readonly combatNumber: number }
    | { readonly kind: "source"; readonly instanceId: string }
    | { readonly kind: "permanent" };
  readonly consumptionPolicy: FabReplacementConsumptionPolicy;
  readonly applicationPolicy: FabPersistedReplacementApplicationPolicy;
  /**
   * Player id of the hero the prevention is shielding (damage would be dealt
   * to them). Defaults to controller when omitted (self-shield / "to you").
   * Yoji: another target hero chosen on activation.
   */
  readonly shieldedPlayerId?: string;
  /** Chosen damage source for a prevention that names one source. */
  readonly preventedSourceInstanceId?: string;
  /**
   * Class-shield filter (Sawbones: "you or a Pirate you control"). Evaluated
   * against the damaged living object at application time.
   */
  readonly shieldedFilter?: import("@tcg/flesh-and-blood-types").FabCardFilter;
  /**
   * When set, damage is retargeted to this player before the fixed prevention
   * amount is applied (Yoji redirectTo self).
   */
  readonly redirectPlayerId?: string;
}

export type FabRulesProcessStage =
  | "procedure"
  | "replacement-collection"
  | "replacement-ordering"
  | "continuous-ordering"
  | "event-commit"
  | "trigger-collection"
  | "state-trigger-scan"
  | "simultaneous-player-selection"
  | "trigger-ordering"
  | "layer-declaration"
  | "layer-resolution"
  | "settled";

export interface FabRulesProcess {
  readonly processId: FabProcessId;
  /**
   * Written only through `transitionFabRulesProcessStage` (kernel/process-state.ts);
   * readonly so any other assignment fails compilation. The door performs its
   * single auditable internal write.
   */
  readonly stage: FabRulesProcessStage;
  pendingEvents: ProposedEvent[];
  /** Only active-process subjects needed by future-applicability reconciliation. */
  futureSubjectEvents: FabFutureSubjectEvent[];
  replacementCandidates: FabReplacementCandidate[];
  /** Whether every controller has selected their optional replacements for the direct event batch. */
  replacementChoiceResolved: boolean;
  /** Players who have answered their optional replacement selection for the direct event batch. */
  replacementChoicePlayerIds: string[];
  /** Selected optional replacements for the direct event batch. */
  selectedOptionalReplacementIds: string[];
  /** Optional candidates explicitly declined after becoming active. */
  declinedOptionalReplacementIds?: string[];
  /** Explicit object-cost target chosen for an accepted persisted replacement. */
  replacementCostTargetBindings?: Record<
    string,
    { readonly instanceId: string; readonly incarnation: number }
  >;
  /**
   * Hand cards bound as pitch payment for a static-keyword pay-resources
   * prevention cost (CR 1.14.2d), keyed `${bindingScope}:${replacementId}`.
   * Each entry pitches for its evaluated resource value when the prevention
   * applies; the cards stay in hand until that application commits.
   */
  replacementPitchBindings?: Record<
    string,
    readonly { readonly instanceId: string; readonly incarnation: number }[]
  >;
  /** Exact original clash reveal selected for an accepted re-clash replacement. */
  replacementConsequenceTargetBindings?: Record<
    string,
    { readonly instanceId: string; readonly incarnation: number }
  >;
  /** Namespace of cost bindings for the transaction currently being resumed. */
  replacementCostBindingScope?: string;
  /**
   * Persisted proof for an "if you do" replacement cost. The consequence may
   * inspect only this exact receipt; choosing a target is not payment.
   */
  replacementCostCommitReceipts?: Record<
    string,
    | {
        readonly status: "committed";
        readonly eventId: CommittedEvent["eventId"];
        readonly object: FabObjectRef;
      }
    | { readonly status: "failed"; readonly object: FabObjectRef }
  >;
  /** Persisted proof that the selected original clash reveal moved before re-clashing. */
  replacementConsequenceCommitReceipts?: Record<
    string,
    | {
        readonly status: "committed";
        readonly eventId: CommittedEvent["eventId"];
        readonly object: FabObjectRef;
      }
    | { readonly status: "failed"; readonly object: FabObjectRef }
  >;
  orderedReplacementIds: string[];
  /** CR 6.5.2 starting player selected by the turn-player for the direct event. */
  replacementFirstPlayerId?: string;
  appliedReplacementIds: string[];
  /** Exact application fingerprints canceled during this event-boundary reconciliation. */
  cancelledContinuousApplicationKeys: string[];
  pendingTriggers: FabPendingTrigger[];
  orderedTriggerIds: string[];
  triggerPlayerOrder: string[];
  orderedTriggerControllers: string[];
  stateTriggersOnStack: string[];
  resolvingLayerId: string | null;
  effectChoices: Record<string, boolean>;
  effectPartitions: Record<string, Readonly<Record<string, readonly string[]>>>;
  effectOptions: Record<string, string>;
  effectTargets: MutableFabTargetMap;
  /** Explicit player declarations for variable resolving-effect payments. */
  effectPaymentAmounts?: Record<string, number>;
  /** Hand cards selected one-at-a-time to pay a resolving effect's resource cost. */
  effectPaymentPitches?: Record<string, readonly FabObjectRef[]>;
  /** Payment journal awaiting committed-event verification before its enclosing effect continues. */
  effectPaymentContinuation?: {
    readonly eventGroupId: string;
    readonly layerId: string;
    readonly effectPath: readonly number[];
    readonly optionalPath: readonly number[] | null;
    readonly playerId: string;
    readonly costType: "resources" | "life";
    readonly amount: number;
    readonly pitches: readonly FabObjectRef[];
    readonly events: readonly ProposedEvent[];
    readonly effectChoices: Readonly<Record<string, boolean>>;
    readonly effectPartitions: Readonly<
      Record<string, Readonly<Record<string, readonly string[]>>>
    >;
    readonly effectOptions: Readonly<Record<string, string>>;
    readonly effectTargets: FabTargetMap;
    readonly effectPaymentAmounts: Readonly<Record<string, number>>;
  };
  iterationCount: number;
  journalReplacementOrders: Record<string, readonly string[]>;
  /** CR 6.5.2 starting player selected for each atomic journal event group. */
  journalReplacementFirstPlayerIds?: Record<string, string>;
  /** Selected optional replacements for an atomic journal child group. */
  journalReplacementChoices: Record<string, readonly string[]>;
  /** Optional candidates explicitly declined per atomic journal group. */
  journalDeclinedReplacementChoices?: Record<string, readonly string[]>;
  /** Players who have answered optional replacement selection for each journal child group. */
  journalReplacementChoicePlayerIds: Record<string, readonly string[]>;
  /** Layer suffix to resume after a sequence-prefix journal commits through a replacement prompt. */
  sequencePrefixContinuation?: {
    /** Conditions captured per loop subject before committing a prefix. */
    readonly frozenConditions?: Readonly<Record<string, FabCondition>>;
    readonly repeatIndex?: number;
    readonly eventGroupId: string;
    readonly layerId: string;
    /** Effect-tree path to the sequence whose committed prefix is removed. */
    readonly sequencePath: readonly number[];
    /** Stable proposal target-path prefix for that sequence. */
    readonly targetPath: string;
    readonly fromStep: number;
    /** Answered structural decisions above the rewritten sequence remain authoritative. */
    readonly ancestorEffectChoices: Readonly<Record<string, boolean>>;
    readonly ancestorEffectPartitions: Readonly<
      Record<string, Readonly<Record<string, readonly string[]>>>
    >;
    readonly ancestorEffectTargets: FabTargetMap;
    readonly effectOptions: Readonly<Record<string, string>>;
    readonly events: readonly ProposedEvent[];
  };
  /** Same-face printed ability step to resume after this journal fully settles. */
  abilityStepContinuation?: {
    readonly layerId: string;
    readonly fromCursor: number;
    readonly faceId: import("@tcg/flesh-and-blood-types").FabFaceId;
    /** Proposed events from the prior ability step; carried as LKI bindings (CR 1.7.6). */
    readonly events: readonly ProposedEvent[];
  };
  resolutionEventGroups: FabProposedEventGroup[];
  procedure: FabRulesProcedure | null;
}

export interface FabFutureSubjectEvent {
  readonly eventId: CommittedEvent["eventId"];
  readonly kind: "announce-card" | "attack" | "activate" | "defend";
  readonly actorId: string;
  readonly object: FabObjectRef;
  /** The committed event, so a source that becomes functional mid-window can still observe it. */
  readonly event: Extract<
    CommittedEvent,
    { readonly name: "announce-card" | "attack" | "activate" | "defend" }
  >;
}

export function appendFabFutureSubjectEvents(
  process: FabRulesProcess,
  events: readonly CommittedEvent[],
): void {
  for (const event of events) {
    if (
      event.name === "announce-card" ||
      event.name === "attack" ||
      event.name === "activate" ||
      event.name === "defend"
    ) {
      process.futureSubjectEvents.push({
        eventId: event.eventId,
        kind: event.name,
        actorId: event.data.actorId,
        object: event.data.object.ref,
        event,
      });
    }
  }
}

export type FabRulesProcedure =
  | FabPlayCardProcedure
  | FabActivateProcedure
  | FabCombatCloseProcedure
  | FabStartTurnProcedure
  | FabEndTurnProcedure;

export interface FabStartTurnProcedure {
  readonly kind: "start-turn";
  readonly actorId: string;
  stage: "start-phase" | "action-phase" | "complete";
  readonly eventGroups: FabProposedEventGroup[];
}

export interface FabEndTurnProcedure {
  readonly kind: "end-turn";
  readonly actorId: string;
  readonly nextPlayerId: string;
  stage:
    | "end-phase"
    | "decay"
    | "blood-debt"
    | "heave"
    | "traverse"
    | "return-intimidated"
    | "arsenal"
    | "pitch-order"
    | "return-pitch"
    | "reset-assets"
    | "draw"
    | "advance-turn"
    | "start-phase"
    | "action-phase"
    | "complete";
  readonly eventGroups: FabProposedEventGroup[];
  readonly pitchOrders: Record<string, readonly string[]>;
  /** Blood Debt cards eligible when the beginning-of-end-phase event occurs.
   * Cards created later in that end phase were not present to trigger. */
  bloodDebtCandidateRefs: readonly FabObjectRef[];
  /** CR 4.4.3b choice, retained only while this procedure is in flight. */
  arsenalDecisionResolved: boolean;
  arsenalCardId: string | null;
  /** Heave is an optional end-phase selection, retained only while this procedure is in flight. */
  heaveDecisionResolved: boolean;
  heaveInstanceId: string | null;
  /** IAR Traverse: player chose to flip their double-faced hero this end phase. */
  readonly traverse: boolean;
}

export interface FabCombatCloseProcedure {
  readonly kind: "combat-close";
  readonly actorId: string;
  readonly attack: FabObjectSnapshot;
  stage: "resolve-link" | "complete";
  readonly eventGroups: FabProposedEventGroup[];
}

export interface FabActivateProcedure {
  readonly kind: "activate";
  readonly actorId: string;
  readonly object: FabObjectSnapshot;
  readonly abilityId: string;
  /** The exact cost arm declared when the activation was announced. */
  readonly cost: FabCost;
  readonly attackTarget: FabAttackTarget | null;
  /** Non-entity modular equipment destination declared as an option. */
  equipDestination: "head" | "chest" | "arms" | "legs" | null;
  stage: "targets" | "costs" | "complete";
  readonly eventGroups: FabProposedEventGroup[];
  readonly declaredTargets: MutableFabTargetMap;
  readonly pitchedInstanceIds: string[];
  resourceCost: number;
  readonly chiCost: number;
  readonly lifeCost: number;
  readonly actionPointCost: number;
  readonly destroySelf: boolean;
  /** "Banish this" activation cost (Radiant View family) — source → banished. */
  readonly banishSelf: boolean;
  readonly tapSelf: boolean;
  readonly tapHero: boolean;
  readonly discardSelf: boolean;
  readonly turnFaceUpSelf: boolean;
  readonly turnFaceUpTargets: boolean;
  readonly turnFaceDownTargets: boolean;
  readonly discardTargets: boolean;
  readonly banishTargets: boolean;
  readonly destroyTargets: boolean;
  /** "{t} a cog you control" — tap a declared filtered permanent as a cost. */
  readonly tapTargets: boolean;
  /** "{u} a cog you control" — untap a declared filtered permanent as a cost. */
  readonly untapTargets: boolean;
  /** Charge a declared hand card into soul. */
  readonly chargeTargets: boolean;
  /** Put a declared hand/arsenal card onto the deck as a cost (ARA003, …). */
  readonly moveToDeckTargets: boolean;
  /** Move this activation's source into its owner's deck without a target prompt. */
  readonly selfMoveToDeck: FabActivationSelfMoveToDeckCost | null;
  /** Reveal a declared card from inventory/hand as a cost (Librarian JDG062). */
  readonly revealTargets: boolean;
  /** Remove counters from a declared filtered permanent (not the source). */
  readonly removeCounterTargets: boolean;
  /**
   * Variable (X) self counter cost. When set, {@link chosenX} is filled by a
   * numeric decision before payment; counterCosts is then derived.
   */
  readonly xCounterCost: { readonly operation: "add" | "remove"; readonly counter: string } | null;
  /** Variable (X) resource cost, chosen before pitching/payment. */
  readonly xResourceCost: { readonly multiplier: number; readonly plus: number } | null;
  /** Variable (X) object-banish cost, chosen before cost/effect targets. */
  readonly xBanishCost: boolean;
  /** Chosen X for a variable cost; null until the numeric decision resolves. */
  chosenX: number | null;
  counterCosts: FabActivationCounterCost[];
  /** Token-creation effect costs (Chane Soul Shackle, etc.). */
  readonly createTokenCosts: readonly FabActivationCreateTokenCost[];
  costBindings: FabEventBindings;
}

export interface FabActivationCounterCost {
  readonly operation: "add" | "remove";
  readonly counter: string;
  readonly amount: number;
}

export interface FabPlayCardProcedure {
  readonly kind: "play-card";
  readonly actorId: string;
  readonly object: FabObjectSnapshot;
  readonly from: "hand" | "arsenal" | "banished" | "deck" | "graveyard";
  /** Exact CR 5.1.3d play permission declared by the player. */
  readonly playPermissionId: string;
  stage:
    | "announce"
    | "method-and-costs"
    | "modes-and-targets"
    | "legality"
    | "asset-payment"
    | "effect-payment"
    | "play"
    | "complete";
  readonly eventGroups: FabProposedEventGroup[];
  readonly declaredModes: string[];
  modesDeclared: boolean;
  readonly declaredTargets: MutableFabTargetMap;
  /** CR 5.1.3a: chosen value for a variable additional play cost. */
  chosenX: number | null;
  /** Exact objects declared for a variable destroy additional cost. */
  effectCostTargetIds: string[];
  /** Connected cost parameters and paid objects retained for resolution. */
  costBindings: FabEventBindings;
  readonly attackTarget: FabAttackTarget | null;
  /** Optional extra hero targets when an additional-hero rule is active. */
  readonly additionalAttackTargets?: readonly FabAttackTarget[];
  readonly pitchedInstanceIds: string[];
  effectCostPaid: boolean;
  resourceCost: number;
  actionPointCost: number;
  /** Authoritative declaration timing; never re-inferred from a merged typebox. */
  readonly playTiming: import("./legality-quotes.ts").FabPlayTiming;
  /** CR 8.3.9 Boost: player opted to banish the top deck card for go again. */
  readonly boost: boolean;
  /** CR 8.3.32 Scrap: player opted to banish equipment/items from graveyard. */
  readonly scrap: boolean;
  /** Instance id of the graveyard item/equipment chosen for the scrap additional cost. */
  readonly scrapInstanceId: string | null;
  /** CR 8.3.33 Beat Chest: player opted to discard a 6+ power card from hand. */
  readonly beatChest: boolean;
  /** Instance id of the hand card chosen for the beat chest additional cost. */
  readonly beatChestInstanceId: string | null;
  /** CR 8.3.29 Crank: player chose to crank the permanent as it enters the arena. */
  readonly crank: boolean;
  /** CR 5.1.2c / 8.3.38: exact face-or-meld method, retained across payment and restore. */
  readonly splitPlayMethod: FabSplitPlayMethod | null;
  /**
   * CR 8.3.17 Fusion: player opted to reveal element cards from hand as the
   * optional fuse additional cost. Instance ids of the revealed hand cards.
   */
  readonly fuseInstanceIds: readonly string[];
  /**
   * MON Charge (CR 8.5.29): optional additional cost — put a hand card into
   * the hero's soul. Instance id of the charged hand card, or null when not
   * charging.
   */
  readonly chargeInstanceId: string | null;
  /**
   * Optional effect additional-cost (Nimble Strike / Hurl family): instance id
   * of the graveyard card banished to pay the cost, or null when declined.
   */
  readonly banishCostInstanceId: string | null;
}

/**
 * Immutable application semantics for a prevention candidate synthesized from
 * a static keyword. Persisted replacements intentionally do not use this
 * bridge until their application policy is serialized separately.
 */
export type FabStaticPreventionApplicationPolicy =
  | {
      readonly kind: "static-keyword";
      readonly keyword: "spellvoid" | "arcane-shelter" | "ward" | "shadow-resist";
      readonly cost: "destroy-source";
    }
  | {
      readonly kind: "static-keyword";
      readonly keyword: "arcane-barrier";
      readonly cost: "pay-resources";
      readonly scheduleSourceDestroyAtEndPhase: false;
    }
  | {
      readonly kind: "static-keyword";
      readonly keyword: "quell";
      readonly cost: "pay-resources";
      readonly scheduleSourceDestroyAtEndPhase: true;
    };

export interface FabReplacementCandidate {
  readonly replacementId: string;
  /** Stable persisted/static replacement identity used for consumption. */
  readonly originReplacementId?: string;
  /** Exact created token identity for a create-extra multi-event candidate. */
  readonly createTokenKey?: string;
  readonly controllerId: string;
  readonly source: FabObjectSnapshot;
  readonly replacementKind: "self-or-identity" | "standard" | "prevention" | "outcome";
  /** CR 6.4.5 per-original-event use, the CR 1.9.2b multi-event exception, or
   * CR 8.5.33b unlimited (ignore applies to every matching sibling event). */
  readonly applicationScope:
    | { readonly kind: "original-event" }
    | { readonly kind: "multi-event"; readonly scopeId: string }
    | { readonly kind: "unlimited" };
  readonly effect: FabCanonicalReplacementEffect;
  readonly origin: "static" | "persisted";
  readonly consumptionPolicy: FabReplacementConsumptionPolicy;
  /** CR "may" replacement; its controller chooses whether to apply it. */
  readonly optional: boolean;
  /**
   * Static-keyword application semantics captured at candidate collection.
   * Never infer this from a replacement id or a later-mutated source snapshot.
   */
  readonly staticPreventionApplication?: FabStaticPreventionApplicationPolicy;
  /** Serialized policy for a persisted replacement; never reconstruct from card text at application. */
  readonly persistedApplicationPolicy?: FabPersistedReplacementApplicationPolicy;
  readonly persistedCostTarget?: { readonly instanceId: string; readonly incarnation: number };
  /** Hand cards bound as pitch payment for a static-keyword pay-resources cost. */
  readonly persistedPitchedInstanceIds?: readonly {
    readonly instanceId: string;
    readonly incarnation: number;
  }[];
  readonly persistedConsequenceTarget?: {
    readonly instanceId: string;
    readonly incarnation: number;
  };
  /** See {@link FabPersistedReplacement.shieldedPlayerId}. */
  readonly shieldedPlayerId?: string;
  /** See {@link FabPersistedReplacement.shieldedFilter}. */
  readonly shieldedFilter?: import("@tcg/flesh-and-blood-types").FabCardFilter;
  /** See {@link FabPersistedReplacement.preventedSourceInstanceId}. */
  readonly preventedSourceInstanceId?: string;
  /** See {@link FabPersistedReplacement.redirectPlayerId}. */
  readonly redirectPlayerId?: string;
}

export type FabDecisionContinuation =
  | {
      readonly kind: "replacement-player";
      readonly processId: FabProcessId;
      /** Affected player who owns the optional replacement choices in this prompt. */
      readonly playerId: string;
      readonly eventGroupId?: string;
      readonly sequencePrefix?: FabRulesProcess["sequencePrefixContinuation"];
      readonly effectPayment?: FabRulesProcess["effectPaymentContinuation"];
    }
  | {
      readonly kind: "replacement-cost-target";
      readonly processId: FabProcessId;
      readonly playerId: string;
      readonly replacementId: string;
      readonly eventGroupId?: string;
      readonly sequencePrefix?: FabRulesProcess["sequencePrefixContinuation"];
      readonly effectPayment?: FabRulesProcess["effectPaymentContinuation"];
    }
  | {
      readonly kind: "replacement-cost-payment";
      readonly processId: FabProcessId;
      readonly playerId: string;
      readonly replacementId: string;
      /** Remaining shortfall this payment round still has to cover. */
      readonly amount: number;
      readonly eventGroupId?: string;
      readonly sequencePrefix?: FabRulesProcess["sequencePrefixContinuation"];
    }
  | {
      readonly kind: "replacement-consequence-target";
      readonly processId: FabProcessId;
      readonly playerId: string;
      readonly replacementId: string;
      readonly eventGroupId?: string;
      readonly sequencePrefix?: FabRulesProcess["sequencePrefixContinuation"];
      readonly effectPayment?: FabRulesProcess["effectPaymentContinuation"];
    }
  | {
      readonly kind: "replacement-first-player";
      readonly processId: FabProcessId;
      readonly eventGroupId?: string;
      readonly sequencePrefix?: FabRulesProcess["sequencePrefixContinuation"];
      readonly effectPayment?: FabRulesProcess["effectPaymentContinuation"];
    }
  | {
      readonly kind: "replacement-order";
      readonly processId: FabProcessId;
      readonly controllerId: string;
      readonly replacementKind: FabReplacementCandidate["replacementKind"];
    }
  | {
      readonly kind: "journal-replacement-order";
      readonly processId: FabProcessId;
      readonly eventGroupId: string;
      readonly controllerId: string;
      readonly replacementKind: FabReplacementCandidate["replacementKind"];
      readonly sequencePrefix?: FabRulesProcess["sequencePrefixContinuation"];
      readonly effectPayment?: FabRulesProcess["effectPaymentContinuation"];
    }
  | {
      readonly kind: "continuous-replacement-order";
      readonly processId: FabProcessId;
      readonly journalCursor: number | null;
    }
  | {
      readonly kind: "continuous-order";
      readonly processId: FabProcessId;
      readonly orderingId: string;
      readonly timestamp: FabRulesTimestamp;
      readonly subject: Extract<FabRulesSubjectRef, { readonly kind: "object" }>;
      readonly stage: FabRulesStage;
      readonly substage: FabObjectSubstage | null;
      readonly atomIds: readonly string[];
      readonly playerId: string;
      readonly journalCursor: number | null;
    }
  | { readonly kind: "trigger-first-player"; readonly processId: FabProcessId }
  | {
      readonly kind: "trigger-order";
      readonly processId: FabProcessId;
      readonly controllerId: string;
    }
  | {
      readonly kind: "layer-mode";
      readonly processId: FabProcessId;
      readonly pendingTriggerId: string;
    }
  | {
      readonly kind: "trigger-additional-cost";
      readonly processId: FabProcessId;
      readonly pendingTriggerId: string;
    }
  | {
      readonly kind: "layer-target";
      readonly processId: FabProcessId;
      readonly pendingTriggerId: string;
      readonly targetKey: string;
    }
  | { readonly kind: "play-mode"; readonly processId: FabProcessId }
  | {
      readonly kind: "play-target";
      readonly processId: FabProcessId;
      readonly targetKey: string;
    }
  | { readonly kind: "play-x"; readonly processId: FabProcessId }
  | { readonly kind: "play-cost-target"; readonly processId: FabProcessId }
  | {
      readonly kind: "activation-target";
      readonly processId: FabProcessId;
      readonly targetKey: string;
    }
  | {
      readonly kind: "activation-equip-destination";
      readonly processId: FabProcessId;
    }
  | {
      /** Choose X for variable counter activation costs (Blaze energy X). */
      readonly kind: "activation-x";
      readonly processId: FabProcessId;
    }
  | {
      readonly kind: "optional-effect";
      readonly processId: FabProcessId;
      readonly effectPath: readonly number[];
    }
  | {
      /** Declares the exact amount for a resolving "pay up to N" effect. */
      readonly kind: "effect-payment-amount";
      readonly processId: FabProcessId;
      readonly layerId: string;
      readonly effectPath: readonly number[];
    }
  | {
      readonly kind: "payment";
      readonly processId: FabProcessId;
      readonly cost: "asset" | "effect";
      readonly procedure: "play" | "activate" | "effect";
      readonly layerId?: string;
      readonly effectPath?: readonly number[];
    }
  | {
      readonly kind: "effect-resolution";
      readonly processId: FabProcessId;
      readonly layerId: string;
      readonly effectPath: readonly number[];
    }
  | {
      readonly kind: "turn-pitch-order";
      readonly processId: FabProcessId;
      readonly playerId: string;
    }
  | {
      readonly kind: "turn-heave";
      readonly processId: FabProcessId;
      readonly playerId: string;
    }
  | {
      readonly kind: "turn-arsenal";
      readonly processId: FabProcessId;
      readonly playerId: string;
    };

interface FabDecisionBase {
  readonly decisionId: FabDecisionId;
  readonly stateVersion: number;
  readonly actorId: string;
  readonly label: string;
  /** Public source card whose layer opened this decision. */
  readonly source?: {
    readonly instanceId: string;
    readonly canonicalId?: string;
    readonly ownerId: string;
  };
  readonly continuation: FabDecisionContinuation;
}

export interface FabOrderingEntry {
  readonly id: string;
  readonly label: string;
  /**
   * Authoritative public presentation identity for an effect-ordering entry.
   * The entry id remains the opaque value submitted back to the engine; this
   * source metadata exists so adapters never have to parse labels or ids to
   * recover the card that generated the effect.
   */
  readonly source?: {
    readonly instanceId: string;
    readonly canonicalId?: string;
    readonly ownerId: string;
  };
}

export type FabDecision =
  | (FabDecisionBase & {
      readonly kind: "boolean";
      readonly acceptLabel: string;
      readonly declineLabel: string;
    })
  | (FabDecisionBase & {
      readonly kind: "option";
      readonly min: number;
      readonly max: number;
      readonly options: readonly { readonly id: string; readonly label: string }[];
      /** Player-facing direct outcomes for a small, immediately resolvable choice. */
      readonly presentation?: {
        readonly kind: "direct";
        readonly description: string;
        readonly emptyLabel: string;
      };
    })
  | (FabDecisionBase & {
      readonly kind: "entity-target";
      readonly min: number;
      readonly max: number;
      readonly candidates: readonly import("../kernel/trigger-declaration.ts").FabTargetCandidate[];
      /** Printed "with different names" — chosen cards must not share a name. */
      readonly differentNames?: boolean;
    })
  | (FabDecisionBase & {
      readonly kind: "ordering";
      readonly entries: readonly FabOrderingEntry[];
    })
  | (FabDecisionBase & {
      readonly kind: "group-choice";
      readonly entries: readonly {
        readonly id: string;
        readonly label: string;
        /** Identity explicitly available to the player making this choice. */
        readonly source?: {
          readonly instanceId: string;
          readonly canonicalId?: string;
          readonly ownerId: string;
        };
      }[];
      readonly cohorts: readonly {
        readonly id: string;
        readonly label: string;
        readonly entryIds: readonly string[];
      }[];
    })
  | (FabDecisionBase & {
      readonly kind: "numeric";
      readonly min: number;
      readonly max: number;
      /** The player must acknowledge this choice even when min === max. */
      readonly requiresExplicitAnswer?: boolean;
    })
  | (FabDecisionBase & {
      readonly kind: "partition";
      readonly entries: readonly {
        readonly id: string;
        readonly label: string;
        readonly source?: {
          readonly instanceId: string;
          readonly canonicalId?: string;
          readonly ownerId: string;
        };
      }[];
      readonly groups: readonly (
        | {
            readonly id: string;
            readonly label: string;
            readonly ordered?: false;
            readonly orderDirection?: never;
          }
        | {
            readonly id: string;
            readonly label: string;
            readonly ordered: true;
            readonly orderDirection: "top-first" | "bottom-first";
          }
      )[];
    })
  | (FabDecisionBase & {
      readonly kind: "payment";
      readonly amount: number;
      readonly oneAtATime: boolean;
      readonly cancellable: boolean;
      readonly candidates: readonly { readonly instanceId: string; readonly value: number }[];
    })
  | (FabDecisionBase & {
      readonly kind: "effect-resolution";
      readonly options: readonly { readonly id: string; readonly label: string }[];
      readonly presentation?: {
        readonly kind: "card-name";
        readonly label: string;
        readonly placeholder: string;
        readonly confirmLabel: string;
        readonly description: string;
        readonly resultLimit: number;
        readonly suggestionGroups: readonly {
          readonly id: string;
          readonly label: string;
          readonly optionIds: readonly string[];
        }[];
      };
    });

export type FabDecisionAnswer =
  | { readonly kind: "cancel" }
  | { readonly kind: "boolean"; readonly value: boolean }
  | { readonly kind: "option"; readonly optionIds: readonly string[] }
  | { readonly kind: "entity-target"; readonly instanceIds: readonly string[] }
  | { readonly kind: "ordering"; readonly orderedIds: readonly string[] }
  | {
      readonly kind: "group-choice";
      readonly selectedIds: readonly string[];
      readonly orderedRemainderIds: readonly string[];
    }
  | { readonly kind: "numeric"; readonly value: number }
  | { readonly kind: "partition"; readonly groups: Readonly<Record<string, readonly string[]>> }
  | { readonly kind: "payment"; readonly instanceIds: readonly string[] }
  | { readonly kind: "effect-resolution"; readonly optionId: string };
