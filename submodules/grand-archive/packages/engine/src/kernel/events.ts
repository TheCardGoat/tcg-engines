import type {
  GrandArchiveActivationState,
  GrandArchiveObjectState,
  GrandArchivePhase,
  GrandArchiveZone,
} from "@tcg/grand-archive-types";
import type {
  GrandArchiveDecisionId,
  GrandArchiveEventId,
  GrandArchiveGameEventId,
  GrandArchiveObjectId,
  GrandArchivePlayerId,
  GrandArchiveStackItemId,
} from "../game/identity.ts";
import type {
  GrandArchiveCardInstance,
  GrandArchiveDecision,
  GrandArchiveOpportunityWindow,
  GrandArchiveStackItem,
} from "../game/model.ts";

export interface GrandArchiveEventMeta {
  readonly actorId?: GrandArchivePlayerId;
  /** Primary object as it existed when this event committed, for stable historical projection. */
  readonly objectSnapshot?: GrandArchiveCardInstance;
  /**
   * Rules-defined action category. Special game actions cannot be responded to
   * or modified by card rules/effects; turn-based actions remain identifiable
   * while still allowing the modifications their own rules permit.
   */
  readonly gameActionKind?: "special-game-action" | "turn-based-action";
  /** Shared only by committed records that constitute one rules-defined game event. */
  readonly gameEventId?: GrandArchiveGameEventId;
  readonly cause?:
    | { readonly kind: "command"; readonly move: string }
    | { readonly kind: "rule"; readonly rule: string }
    | {
        readonly kind: "stack-item";
        readonly stackItemId: GrandArchiveStackItemId;
        /** Durable origin retained after the resolving item leaves the Effects Stack. */
        readonly stackItemKind?: GrandArchiveStackItem["kind"];
        readonly controllerId?: GrandArchivePlayerId;
        /** Printed identity for activated and triggered ability stack items. */
        readonly abilityId?: string;
      };
}

export type GrandArchiveStackItemFizzleReason =
  | "required-target-invalid"
  | "champion-materialization-illegal"
  | "source-card-missing";

/**
 * Who may learn the identity-to-position mapping produced when two or more
 * cards are placed simultaneously into an ordered private zone.
 *
 * Ordering and Tracking 2 lets the owner retain the order they chose while
 * hiding it from every opponent. Rule 3 hides a random placement from every
 * player, including the owner.
 */
export type GrandArchiveOrderedPrivatePlacementKnowledge = "owner-only" | "none";

export type GrandArchiveProposedEvent = GrandArchiveEventMeta &
  (
    | {
        readonly type: "object-created";
        readonly object: GrandArchiveCardInstance;
        /** Position within an ordered destination zone. */
        readonly placement?: "top" | "bottom" | "unordered";
      }
    | {
        /** One simultaneous Summon action; replacement effects inspect and replace this batch. */
        readonly type: "tokens-summoned";
        readonly playerId: GrandArchivePlayerId;
        readonly objects: readonly [GrandArchiveCardInstance, ...GrandArchiveCardInstance[]];
      }
    | {
        readonly type: "object-ceased";
        readonly objectId: GrandArchiveObjectId;
        readonly from: Exclude<GrandArchiveZone, "field">;
      }
    | {
        /** Unreplaceable match departure caused by a player losing the game. */
        readonly type: "object-removed-from-game";
        readonly object: GrandArchiveCardInstance;
        readonly losingPlayerId: GrandArchivePlayerId;
        /** Last-known Champion classification; Champions do not "leave" in glossary terms. */
        readonly leftFieldAsChampion?: true;
      }
    | {
        readonly type: "object-moved";
        readonly objectId: GrandArchiveObjectId;
        readonly from: GrandArchiveZone;
        readonly to: GrandArchiveZone;
        /** The move performs the rules-defined Discard action, not merely the same zone change. */
        readonly discarded?: true;
        readonly newControllerId?: GrandArchivePlayerId;
        readonly hostId?: GrandArchiveObjectId;
        /** True when a resolving effect explicitly instructed this zone change. */
        readonly effectSpecified?: true;
        /** Source whose effect or explicit additional cost is responsible for this banishment. */
        readonly banishedBySourceId?: GrandArchiveObjectId;
        readonly placement?: "top" | "bottom" | "unordered";
        /** Visibility of this card's position within one simultaneous private placement. */
        readonly orderedPrivatePlacementKnowledge?: GrandArchiveOrderedPrivatePlacementKnowledge;
        readonly entryStates?: readonly GrandArchiveObjectState[];
        readonly entryActivationStates?: readonly GrandArchiveActivationState[];
        /** Activation/materialization payment provenance carried into the entered object. */
        readonly entryActivationPayment?: readonly import("../game/model.ts").GrandArchiveActivationPaymentRecord[];
        /** Named announcement/cost bindings carried into the entered object and its triggers. */
        readonly entryActivationBindings?: Readonly<
          Record<string, import("../procedures/effects/evaluation.ts").GrandArchiveExecutionBinding>
        >;
        /** Announced variables carried into the entered object and its resulting triggers. */
        readonly entryActivationVariables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
        /** Explicit facing after entry; otherwise normal public/private-zone defaults apply. */
        readonly entryFacing?: "face-up" | "face-down";
        /** Explicit active face for a double-faced card entering the field. */
        readonly entryFace?: "default" | "transformed";
        /** The effect selected this private card by specified information; disclose it at game end. */
        readonly revealAtEndOfGame?: true;
        /** Kernel-populated last-known controller before the move commits. */
        readonly previousControllerId?: GrandArchivePlayerId;
        /**
         * Complete kernel-populated object information immediately before the
         * zone change. This is the authoritative LKI checkpoint for effects
         * that explicitly request a last-known basis.
         */
        readonly previousObject?: import("../game/model.ts").GrandArchiveCardInstance;
        /** Layer-derived characteristics fixed at the same LKI checkpoint. */
        readonly previousCharacteristics?: import("../rules/state/continuous.ts").GrandArchiveDerivedCharacteristics;
        /** Derived abilities at the field-departure checkpoint, including grants from other objects. */
        readonly previousAbilities?: ReturnType<
          typeof import("../game/card-runtime.ts").flattenGrandArchiveAbilities
        >;
        /** Fully derived stats/costs fixed before continuous effects can expire. */
        readonly previousNumericProperties?: Readonly<
          Partial<Record<import("@tcg/grand-archive-types").GrandArchiveNumericProperty, number>>
        >;
        /** Kernel-populated last-known active definition before the move commits. */
        readonly previousActiveDefinitionId?: string;
        /** Kernel-populated Cascade progress of the object instance that left the zone. */
        readonly previousCascadeCounts?: Readonly<Record<string, number>>;
        /** Kernel-populated activation payment information before the zone change. */
        readonly previousActivationPayment?: readonly import("../game/model.ts").GrandArchiveActivationPaymentRecord[];
        /** Kernel-populated activation bindings before the zone change. */
        readonly previousActivationBindings?: Readonly<
          Record<string, import("../procedures/effects/evaluation.ts").GrandArchiveExecutionBinding>
        >;
        /** Kernel-populated announced variables before the zone change. */
        readonly previousActivationVariables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
        /** Last-known field classification used to distinguish unit deaths from non-unit departures. */
        readonly leftFieldAsUnit?: true;
        /** Last-known field classification used to exclude Champions from "leave" observations. */
        readonly leftFieldAsChampion?: true;
        readonly initialCounters?: Readonly<Record<string, number>>;
        /** Combat participants credited when this move is the lethal-damage state check. */
        readonly killedByIds?: readonly GrandArchiveObjectId[];
      }
    | {
        /** Rule bookkeeping for later references after an object substitutes for another. */
        readonly type: "object-reference-substituted";
        readonly originalObjectId: GrandArchiveObjectId;
        readonly substituteObjectId: GrandArchiveObjectId;
      }
    | {
        readonly type: "object-state-changed";
        readonly objectId: GrandArchiveObjectId;
        readonly state: GrandArchiveObjectState;
        readonly value: boolean;
        /** Kernel-populated value before this state change. */
        readonly previousValue?: boolean;
      }
    | {
        readonly type: "object-activation-state-changed";
        readonly objectId: GrandArchiveObjectId;
        readonly state: import("@tcg/grand-archive-types").GrandArchiveActivationState;
        readonly value: boolean;
      }
    | {
        readonly type: "object-facing-changed";
        readonly objectId: GrandArchiveObjectId;
        readonly facing: "face-up" | "face-down";
        /** The effect selected this private card by specified information; disclose it at game end. */
        readonly revealAtEndOfGame?: true;
      }
    | {
        readonly type: "object-characteristic-tracked";
        readonly objectId: GrandArchiveObjectId;
        readonly key: string;
        readonly values: readonly string[];
      }
    | {
        readonly type: "card-revealed";
        readonly objectId: GrandArchiveObjectId;
        readonly playerId: GrandArchivePlayerId;
        /**
         * The card was revealed by specified identity immediately before it
         * entered a private zone. Internal creation bookkeeping makes the id
         * addressable first, but the reveal did not occur from that zone.
         */
        readonly revealedBeforePrivateEntry?: true;
        /** Kernel-populated zone from which the card was revealed. */
        readonly from?: GrandArchiveZone;
      }
    | {
        readonly type: "cards-looked-at" | "cards-searched";
        readonly objectIds: readonly GrandArchiveObjectId[];
        readonly playerId: GrandArchivePlayerId;
      }
    | {
        readonly type: "zone-reordered";
        readonly playerId: GrandArchivePlayerId;
        readonly zone: "main-deck" | "material-deck";
        readonly objectIds: readonly GrandArchiveObjectId[];
      }
    | {
        readonly type: "player-state-changed";
        readonly playerId: GrandArchivePlayerId;
        readonly state: string;
        readonly value: string | number | boolean;
        /** Kernel-populated value before this state change, when one existed. */
        readonly previousValue?: string | number | boolean;
      }
    | {
        readonly type: "mastery-changed";
        readonly playerId: GrandArchivePlayerId;
        readonly mastery: string;
      }
    | {
        readonly type: "mastery-counter-changed";
        readonly playerId: GrandArchivePlayerId;
        readonly mastery: string;
        readonly counter: string;
        readonly delta: number;
      }
    | {
        readonly type: "game-state-changed";
        readonly state: string;
        readonly value: boolean;
        /** Kernel-populated value before this state change, when one existed. */
        readonly previousValue?: boolean;
      }
    | {
        readonly type: "keyword-action-performed";
        readonly action: "brew" | "empower" | "gather" | "glimpse" | "scavenge" | "suppress";
        readonly playerId: GrandArchivePlayerId;
        readonly objectIds: readonly GrandArchiveObjectId[];
        readonly amount?: number;
      }
    | {
        readonly type: "cascade-advanced";
        readonly objectId: GrandArchiveObjectId;
        readonly abilityId: string;
        readonly count: number;
      }
    | {
        readonly type: "counter-changed";
        readonly objectId: GrandArchiveObjectId;
        readonly counter: string;
        readonly delta: number;
      }
    | {
        readonly type: "damage-marked";
        readonly objectId: GrandArchiveObjectId;
        readonly amount: number;
        readonly sourceId?: GrandArchiveObjectId;
        readonly combatDamage?: boolean;
        readonly combatParticipantIds?: readonly GrandArchiveObjectId[];
        readonly preventable?: false;
        /** Damage to a Siegeable object is applied by removing durability instead of marking damage. */
        readonly asDurabilityLoss?: true;
        /** Kernel-populated number of durability counters actually removed by this damage. */
        readonly durabilityRemoved?: number;
        /** Private Critical payments held until every replacement for this damage is settled. */
        readonly criticalDiscardIds?: readonly GrandArchiveObjectId[];
        /** Prevents redundant Critical applications after any instance doubled this damage. */
        readonly criticalDoubled?: true;
      }
    | { readonly type: "damage-cleared"; readonly objectId: GrandArchiveObjectId }
    | {
        readonly type: "damage-removed";
        readonly objectId: GrandArchiveObjectId;
        readonly amount: number;
      }
    | {
        readonly type: "damage-prevented";
        readonly objectId: GrandArchiveObjectId;
        readonly amount: number;
        readonly sourceId?: GrandArchiveObjectId;
        readonly combatDamage?: boolean;
      }
    | {
        readonly type: "object-controller-changed";
        readonly objectId: GrandArchiveObjectId;
        readonly controllerId: GrandArchivePlayerId;
        /** Kernel-populated base controller before a non-continuous control change. */
        readonly previousBaseControllerId?: GrandArchivePlayerId;
        /** Present when state-based derivation changed only effective, not base, control. */
        readonly continuousDerivation?: { readonly effectId?: string };
      }
    | { readonly type: "object-transformed"; readonly objectId: GrandArchiveObjectId }
    | {
        readonly type: "object-became-copy";
        readonly objectId: GrandArchiveObjectId;
        readonly copiedDefinitionId: string;
        readonly copiedFace: "default" | "transformed";
        readonly nameOverride?: string;
      }
    | {
        readonly type: "champion-leveled-up";
        readonly championId: GrandArchiveObjectId;
        readonly cardId: GrandArchiveObjectId;
        /** Kernel-populated active definition of the champion before leveling. */
        readonly previousActiveDefinitionId?: string;
      }
    | {
        readonly type: "champion-deleveled";
        readonly championId: GrandArchiveObjectId;
        readonly cardId: GrandArchiveObjectId;
      }
    | {
        readonly type: "random-state-changed";
        readonly random: import("../game/model.ts").GrandArchiveRandomState;
        readonly result?: {
          readonly kind: "die-roll";
          readonly sides: number;
          readonly results: readonly number[];
          readonly total: number;
        };
      }
    | {
        readonly type: "combat-started";
        readonly combat: import("../game/model.ts").GrandArchiveCombatState;
      }
    | {
        readonly type: "combat-step-changed";
        readonly step: import("../game/model.ts").GrandArchiveCombatState["step"];
        readonly retaliatorIds?: readonly GrandArchiveObjectId[];
      }
    | {
        readonly type: "combat-retaliators-ordered";
        readonly retaliatorIds: readonly GrandArchiveObjectId[];
      }
    | {
        readonly type: "combat-defender-redirected";
        readonly previousDefenderId: GrandArchiveObjectId;
        readonly newDefenderId: GrandArchiveObjectId;
      }
    | { readonly type: "combat-ended" }
    | { readonly type: "phase-end-requested"; readonly phase: GrandArchivePhase }
    | { readonly type: "turn-end-requested" }
    | { readonly type: "termination-cleared" }
    | {
        readonly type: "continuous-effect-created";
        readonly effect: import("../game/model.ts").GrandArchiveContinuousEffectInstance;
      }
    | { readonly type: "continuous-effect-expired"; readonly effectId: string }
    | {
        readonly type: "replacement-effect-created";
        readonly replacement: import("../game/model.ts").GrandArchiveReplacementEffectInstance;
      }
    | {
        readonly type: "replacement-follow-up-created";
        readonly followUp: import("../game/model.ts").GrandArchiveReplacementFollowUp;
      }
    | { readonly type: "replacement-follow-up-consumed" }
    | {
        readonly type: "replacement-pre-commit-created";
        readonly pending: import("../game/model.ts").GrandArchiveReplacementPreCommit;
      }
    | { readonly type: "replacement-pre-commit-started" }
    | { readonly type: "replacement-pre-commit-cleared" }
    | {
        readonly type: "replacement-pre-commit-critical-declined";
        readonly playerId: GrandArchivePlayerId;
      }
    | {
        readonly type: "replacement-pre-commit-critical-paid";
        readonly objectIds: readonly GrandArchiveObjectId[];
      }
    | { readonly type: "replacement-pre-commit-critical-doubled" }
    | ({
        readonly type: "replacement-capacity-consumed";
        readonly replacementId: string;
        readonly amount: number;
      } & (
        | { readonly scope: "replacement-instance" }
        | {
            readonly scope: "per-object";
            readonly objectId: GrandArchiveObjectId;
            readonly objectIncarnation: number;
          }
      ))
    | { readonly type: "replacement-effect-consumed"; readonly replacementId: string }
    | { readonly type: "replacement-effect-expired"; readonly replacementId: string }
    | { readonly type: "replacement-limit-used"; readonly usageKey: string }
    | {
        readonly type: "rule-modification-created";
        readonly modification: import("../game/model.ts").GrandArchiveRuleModificationInstance;
      }
    | { readonly type: "rule-modification-expired"; readonly modificationId: string }
    | {
        readonly type: "pending-trigger-added";
        readonly trigger: import("../game/model.ts").GrandArchivePendingTrigger;
      }
    | { readonly type: "pending-trigger-removed"; readonly triggerId: string }
    | {
        readonly type: "pending-trigger-batch-ordered";
        readonly batchId: string;
        readonly controllerId: GrandArchivePlayerId;
        readonly triggerIds: readonly string[];
      }
    | {
        readonly type: "reflexive-trigger-generated";
        readonly trigger: import("../game/model.ts").GrandArchiveGeneratedTrigger;
      }
    | { readonly type: "reflexive-trigger-consumed"; readonly triggerId: string }
    | {
        readonly type: "delayed-trigger-created";
        readonly trigger: import("../game/model.ts").GrandArchiveDelayedTriggerInstance;
      }
    | { readonly type: "delayed-trigger-consumed"; readonly triggerId: string }
    | { readonly type: "delayed-trigger-removed"; readonly triggerId: string }
    | {
        readonly type: "stack-item-added";
        readonly item: GrandArchiveStackItem;
        /** Characteristics when the card was activated/materialized, retained for history queries. */
        readonly sourceCharacteristics?: import("../rules/state/continuous.ts").GrandArchiveDerivedCharacteristics;
      }
    | {
        readonly type: "stack-item-deferred";
        readonly item: GrandArchiveStackItem;
        readonly sourceCharacteristics?: import("../rules/state/continuous.ts").GrandArchiveDerivedCharacteristics;
      }
    | {
        readonly type: "stack-item-after-resolution-scheduled";
        readonly targetStackItemId: GrandArchiveStackItemId;
        readonly item: GrandArchiveStackItem;
      }
    | { readonly type: "deferred-stack-item-promoted"; readonly item: GrandArchiveStackItem }
    | { readonly type: "stack-item-retargeted"; readonly item: GrandArchiveStackItem }
    | { readonly type: "stack-item-targets-invalidated"; readonly item: GrandArchiveStackItem }
    | {
        readonly type: "stack-item-fizzled";
        readonly item: GrandArchiveStackItem;
        readonly reason: GrandArchiveStackItemFizzleReason;
      }
    | { readonly type: "stack-item-negated"; readonly item: GrandArchiveStackItem }
    | {
        readonly type: "stack-item-removed";
        readonly itemId: GrandArchiveStackItemId;
        /** Why the item left the stack; only `resolved` emits an effect-resolved observation. */
        readonly outcome: "resolved" | "fizzled" | "abandoned";
        /** Suppresses ordinary effect-resolved observations for rule-internal resolvers. */
        readonly internal?: boolean;
      }
    | {
        readonly type: "effect-resolution-suspended";
        readonly resolution: import("../game/model.ts").GrandArchiveEffectResolution;
      }
    | { readonly type: "effect-resolution-cleared"; readonly stackItemId: GrandArchiveStackItemId }
    | { readonly type: "opportunity-opened"; readonly window: GrandArchiveOpportunityWindow }
    | {
        readonly type: "opportunity-passed";
        readonly playerId: GrandArchivePlayerId;
        readonly nextPlayerId?: GrandArchivePlayerId;
      }
    | { readonly type: "opportunity-closed" }
    | {
        readonly type: "pregame-player-advanced";
        readonly playerId: GrandArchivePlayerId;
        readonly playerIndex: number;
      }
    | { readonly type: "pregame-starting-cards-entered" }
    | { readonly type: "pregame-completed" }
    | {
        readonly type: "boon-gained";
        readonly objectId: GrandArchiveObjectId;
        readonly playerId: GrandArchivePlayerId;
      }
    | {
        readonly type: "phase-changed";
        readonly phase: GrandArchivePhase;
        readonly materializeKind?: "regular" | "additional";
      }
    | {
        /** One unrespondable recollection turn-based action, including a zero-card recollection. */
        readonly type: "cards-recollected";
        readonly playerId: GrandArchivePlayerId;
        readonly objectIds: readonly GrandArchiveObjectId[];
      }
    | {
        readonly type: "phase-skip-added" | "phase-skip-consumed";
        readonly playerId: GrandArchivePlayerId;
        readonly phase: GrandArchivePhase;
      }
    | { readonly type: "materialization-choice-consumed" }
    | {
        readonly type: "turn-started";
        readonly playerId: GrandArchivePlayerId;
        readonly turnNumber: number;
      }
    | { readonly type: "turn-cleanup-pending-changed"; readonly value: boolean }
    | {
        readonly type: "attack-declaration-attempted";
        readonly attackerId: GrandArchiveObjectId;
        readonly targetIds: readonly GrandArchiveObjectId[];
        readonly declared: boolean;
        readonly failureReason?: string;
      }
    | { readonly type: "player-first-turn-completed"; readonly playerId: GrandArchivePlayerId }
    | {
        readonly type: "player-lost";
        readonly playerId: GrandArchivePlayerId;
        readonly reason: "concession" | "champion-died" | "champion-absent" | "deck-out" | "effect";
      }
    | {
        readonly type: "game-outcome-declared";
        readonly outcome: import("../game/model.ts").GrandArchivePendingGameOutcome;
      }
    | { readonly type: "game-outcome-cleared" }
    | { readonly type: "match-finished"; readonly winnerIds: readonly GrandArchivePlayerId[] }
    | { readonly type: "decision-created"; readonly decision: GrandArchiveDecision }
    | { readonly type: "decision-cleared"; readonly decisionId: GrandArchiveDecisionId }
  );

export type GrandArchiveCommittedEvent = GrandArchiveProposedEvent & {
  readonly eventId: GrandArchiveEventId;
  readonly stateVersion: number;
};

export type GrandArchiveReplacementResult =
  | { readonly kind: "unchanged" }
  | { readonly kind: "prevented"; readonly reason: string }
  | {
      readonly kind: "replaced";
      readonly events: readonly [GrandArchiveProposedEvent, ...GrandArchiveProposedEvent[]];
    }
  | {
      /** Resolve this effect before either resuming or discarding the still-proposed event. */
      readonly kind: "resolve-before-commit";
      readonly followUp: import("../game/model.ts").GrandArchiveReplacementPreCommitFollowUp;
      readonly resumeEvent: boolean;
    };

export interface GrandArchiveReplacementCandidate {
  readonly id: string;
  /** Player whose affected object, card, or zone determines replacement ordering. */
  readonly affectedPlayerId: GrandArchivePlayerId;
  /** When present, this player may decline this replacement after it is selected. */
  readonly optionalPlayerId?: GrandArchivePlayerId;
  readonly apply: (event: GrandArchiveProposedEvent) => GrandArchiveReplacementResult;
}

export interface GrandArchiveTransactionResult {
  readonly stateVersion: number;
  readonly events: readonly GrandArchiveCommittedEvent[];
}
