import type {
  GrandArchiveObservableEventName,
  GrandArchivePhase,
  GrandArchiveZone,
} from "@tcg/grand-archive-types";
import type { GrandArchiveCommittedEvent, GrandArchiveProposedEvent } from "./events.ts";
import type {
  GrandArchiveObjectId,
  GrandArchivePlayerId,
  GrandArchiveStackItemId,
  GrandArchiveTargetId,
} from "../game/identity.ts";

export interface GrandArchiveObservedEvent {
  readonly name: GrandArchiveObservableEventName;
  readonly committedEvent: GrandArchiveCommittedEvent | GrandArchiveProposedEvent;
  readonly actorId?: GrandArchivePlayerId;
  readonly subjectId?: GrandArchiveObjectId;
  /** Simultaneous subjects represented by one game event, such as a Summon batch. */
  readonly subjectIds?: readonly GrandArchiveObjectId[];
  readonly recipientId?: GrandArchiveObjectId;
  readonly recipientIds?: readonly GrandArchiveTargetId[];
  readonly recipientIncarnations?: Readonly<Partial<Record<GrandArchiveObjectId, number>>>;
  readonly previousObjectId?: GrandArchiveObjectId;
  readonly amount?: number;
  readonly from?: GrandArchiveZone;
  readonly to?: GrandArchiveZone;
  readonly phase?: GrandArchivePhase;
  readonly counter?: string;
  readonly stackItemId?: GrandArchiveStackItemId;
  readonly stackItemType?: "ability" | "card-activation" | "materialization";
  readonly abilityKind?: "activated" | "triggered";
  readonly abilityId?: string;
  readonly activationStates?: readonly import("@tcg/grand-archive-types").GrandArchiveActivationState[];
  /** Cost kind this event paid, when the rules-defined payment action records one. */
  readonly paymentCostKind?: "memory" | "reserve";
  /** True when the observed stack instance was created by a copy effect. */
  readonly isCopy?: boolean;
  readonly keywordAction?: "brew" | "empower" | "gather" | "glimpse" | "scavenge" | "suppress";
  readonly combatDamage?: boolean;
  readonly sourceId?: GrandArchiveObjectId;
  /** Objects used as part of the attack that produced this event. */
  readonly usingIds?: readonly GrandArchiveObjectId[];
  readonly state?: string;
  readonly stateFrom?: string | number | boolean;
  readonly stateTo?: string | number | boolean;
}

export function observeGrandArchiveCommittedEvent(
  event: GrandArchiveCommittedEvent,
): readonly GrandArchiveObservedEvent[] {
  if (
    event.type === "keyword-action-performed" &&
    ((event.action === "glimpse" && event.glimpseStage === "start") ||
      (event.action === "suppress" && event.suppressStage === "start"))
  )
    return [];
  return observeGrandArchiveEvent(event);
}

export function observeGrandArchiveProposedEvent(
  event: GrandArchiveProposedEvent,
): readonly GrandArchiveObservedEvent[] {
  return observeGrandArchiveEvent(event);
}

function paymentCostKindForEvent(
  event: GrandArchiveCommittedEvent | GrandArchiveProposedEvent,
): "memory" | "reserve" | undefined {
  if (event.type !== "object-moved" || event.cause?.kind !== "rule") return undefined;
  switch (event.cause.rule) {
    case "pay-reserve-cost":
    case "pay-reserve-cost-with-kindle":
      return "reserve";
    case "pay-floating-memory":
    case "pay-card-memory-cost":
    case "pay-ability-memory-cost":
      return "memory";
    default:
      return undefined;
  }
}

function observeGrandArchiveEvent(
  event: GrandArchiveCommittedEvent | GrandArchiveProposedEvent,
): readonly GrandArchiveObservedEvent[] {
  const base = {
    committedEvent: event,
    ...(event.actorId ? { actorId: event.actorId } : {}),
  };
  switch (event.type) {
    case "phase-changed":
      return [{ ...base, name: "phase-begins", phase: event.phase }];
    case "cards-recollected":
      return [
        {
          ...base,
          name: "cards-recollected",
          actorId: event.playerId,
          subjectIds: event.objectIds,
          amount: event.objectIds.length,
        },
      ];
    case "turn-started":
      return [{ ...base, name: "turn-begins", actorId: event.playerId }];
    case "turn-cleanup-pending-changed":
      return event.value &&
        event.cause?.kind === "rule" &&
        event.cause.rule === "end-cleanup-started"
        ? [{ ...base, name: "turn-ends" }]
        : [];
    case "attack-declaration-attempted":
      return [];
    case "object-moved": {
      const paymentCostKind = paymentCostKindForEvent(event);
      const observed: GrandArchiveObservedEvent[] = [
        { ...base, name: "card-moved", subjectId: event.objectId, from: event.from, to: event.to },
      ];
      if (event.to === "field")
        observed.push({
          ...base,
          name: "object-entered-field",
          subjectId: event.objectId,
          from: event.from,
          to: event.to,
        });
      if (event.from === "field") {
        if (!event.leftFieldAsChampion) {
          observed.push({
            ...base,
            name: "object-left-field",
            subjectId: event.objectId,
            from: event.from,
            to: event.to,
          });
        }
        const rule = event.cause?.kind === "rule" ? event.cause.rule : "";
        const sacrificed = rule.includes("sacrifice");
        const destroyed =
          sacrificed ||
          rule.includes("destroy") ||
          rule === "lethal-damage-state-check" ||
          rule === "zero-durability-state-check";
        if (destroyed) {
          observed.push({
            ...base,
            name: "object-destroyed",
            subjectId: event.objectId,
            from: event.from,
            to: event.to,
          });
        }
        if (sacrificed) {
          observed.push({
            ...base,
            name: "object-sacrificed",
            subjectId: event.objectId,
            from: event.from,
            to: event.to,
          });
        }
        if (event.to === "graveyard") {
          if (event.leftFieldAsUnit) {
            observed.push({
              ...base,
              name: "object-died",
              subjectId: event.objectId,
              from: event.from,
              to: event.to,
            });
          }
          for (const sourceId of event.killedByIds ?? []) {
            observed.push({
              ...base,
              name: "object-killed",
              subjectId: sourceId,
              recipientId: event.objectId,
              sourceId,
              combatDamage: true,
            });
          }
        }
      }
      if (
        event.from === "main-deck" &&
        (event.to === "hand" || event.to === "memory") &&
        event.cause?.kind === "rule" &&
        (event.cause.rule === "draw-effect" || event.cause.rule === "draw-turn-based-action")
      ) {
        observed.push({
          ...base,
          name: "card-drawn",
          subjectId: event.objectId,
          from: event.from,
          to: event.to,
        });
      }
      if (event.from === "hand" && event.to === "memory")
        observed.push({
          ...base,
          name: "card-reserved",
          subjectId: event.objectId,
          from: event.from,
          to: event.to,
        });
      if (event.from === "memory" && event.to === "hand")
        observed.push({
          ...base,
          name: "card-recovered",
          subjectId: event.objectId,
          from: event.from,
          to: event.to,
        });
      if (event.discarded)
        observed.push({
          ...base,
          name: "card-discarded",
          subjectId: event.objectId,
          from: event.from,
          to: event.to,
        });
      if (event.to === "banishment")
        observed.push({
          ...base,
          name: "card-banished",
          subjectId: event.objectId,
          from: event.from,
          to: event.to,
          ...(paymentCostKind ? { paymentCostKind } : {}),
        });
      return observed;
    }
    case "damage-marked":
      if (event.amount <= 0) return [];
      return [
        {
          ...base,
          name: "damage-dealt",
          ...(event.sourceId ? { subjectId: event.sourceId } : {}),
          recipientId: event.objectId,
          amount: event.amount,
          ...(event.sourceId ? { sourceId: event.sourceId } : {}),
          ...(event.combatParticipantIds ? { usingIds: event.combatParticipantIds } : {}),
          ...(event.combatDamage !== undefined ? { combatDamage: event.combatDamage } : {}),
        },
        ...(event.combatDamage && event.amount > 0
          ? [
              {
                ...base,
                name: "attack-hit" as const,
                subjectId: event.sourceId,
                recipientId: event.objectId,
                amount: event.amount,
                sourceId: event.sourceId,
                ...(event.combatParticipantIds ? { usingIds: event.combatParticipantIds } : {}),
                combatDamage: true,
              },
            ]
          : []),
        ...(event.asDurabilityLoss && (event.durabilityRemoved ?? 0) > 0
          ? [
              {
                ...base,
                name: "counter-removed" as const,
                subjectId: event.objectId,
                amount: event.durabilityRemoved,
                counter: "durability",
              },
            ]
          : []),
      ];
    case "damage-removed":
      return [
        { ...base, name: "player-recovered", subjectId: event.objectId, amount: event.amount },
      ];
    case "damage-prevented":
      return [
        {
          ...base,
          name: "damage-prevented",
          recipientId: event.objectId,
          amount: event.amount,
          ...(event.sourceId ? { sourceId: event.sourceId } : {}),
          ...(event.combatDamage !== undefined ? { combatDamage: event.combatDamage } : {}),
        },
      ];
    case "counter-changed":
      return [
        {
          ...base,
          name: event.delta >= 0 ? "counter-added" : "counter-removed",
          subjectId: event.objectId,
          amount: Math.abs(event.delta),
          counter: event.counter,
        },
      ];
    case "boon-gained":
      return [
        {
          ...base,
          name: "boon-gained",
          subjectId: event.objectId,
          actorId: event.playerId,
        },
      ];
    case "object-state-changed":
      return [
        {
          ...base,
          name: "object-state-changed",
          subjectId: event.objectId,
          state: event.state,
          stateFrom: event.previousValue ?? !event.value,
          stateTo: event.value,
        },
        ...(event.state === "fostered" && event.value
          ? [{ ...base, name: "object-fostered" as const, subjectId: event.objectId }]
          : []),
      ];
    case "object-activation-state-changed":
      return [{ ...base, name: "object-state-changed", subjectId: event.objectId }];
    case "card-revealed":
      return [
        {
          ...base,
          name: "card-revealed",
          actorId: event.playerId,
          subjectId: event.objectId,
          ...(event.from ? { from: event.from } : {}),
        },
      ];
    case "keyword-action-performed":
      return [
        {
          ...base,
          name: "keyword-action-performed",
          actorId: event.playerId,
          ...(event.objectIds[0] !== undefined ? { subjectId: event.objectIds[0] } : {}),
          keywordAction: event.action,
          ...(event.amount !== undefined ? { amount: event.amount } : {}),
        },
      ];
    case "object-transformed":
      return [{ ...base, name: "object-transformed", subjectId: event.objectId }];
    case "object-became-copy":
      return [];
    case "champion-leveled-up":
      return [
        {
          ...base,
          name: "champion-leveled-up",
          subjectId: event.cardId,
          previousObjectId: event.championId,
        },
        { ...base, name: "object-entered-field", subjectId: event.championId, to: "field" },
      ];
    case "combat-started":
      return [event.combat.attackerId, ...event.combat.intentIds, ...event.combat.weaponIds].map(
        (subjectId) => ({
          ...base,
          name: "attack-declared",
          actorId: event.combat.attackingPlayerId,
          subjectId,
          recipientId: event.combat.targetIds[0],
          usingIds: [...event.combat.intentIds, ...event.combat.weaponIds],
        }),
      );
    case "stack-item-added":
    case "stack-item-deferred": {
      const item = event.item;
      const targetIds = [...new Set(item.targets.flatMap((target) => target.targetIds))];
      const recipientIncarnations: Readonly<Partial<Record<GrandArchiveObjectId, number>>> =
        Object.fromEntries(
          item.targets.flatMap((target) => Object.entries(target.targetObjectIncarnations)),
        );
      const targetEvents: readonly GrandArchiveObservedEvent[] =
        targetIds.length === 0
          ? []
          : [
              {
                ...base,
                name: "stack-item-targets-declared",
                actorId: item.controllerId,
                subjectId:
                  item.kind === "card-activation" || item.kind === "materialization"
                    ? item.cardId
                    : item.sourceId,
                ...(item.sourceId ? { sourceId: item.sourceId } : {}),
                stackItemId: item.id,
                stackItemType:
                  item.kind === "activated-ability" || item.kind === "triggered-ability"
                    ? "ability"
                    : item.kind === "materialization"
                      ? "materialization"
                      : "card-activation",
                ...(item.kind === "activated-ability"
                  ? { abilityKind: "activated" as const }
                  : item.kind === "triggered-ability"
                    ? { abilityKind: "triggered" as const }
                    : {}),
                recipientIds: targetIds,
                recipientIncarnations,
              },
            ];
      if (item.kind === "card-activation")
        return [
          {
            ...base,
            name: "card-activated",
            recipientIds: targetIds,
            recipientIncarnations,
            subjectId: item.cardId,
            stackItemId: item.id,
            stackItemType: "card-activation",
            activationStates: item.activationStates,
            isCopy: item.isCopy,
            from: item.originZone,
            ...(item.paidCostKind === "memory" || item.paidCostKind === "reserve"
              ? { paymentCostKind: item.paidCostKind }
              : {}),
            ...(item.sourceId ? { sourceId: item.sourceId } : {}),
          },
          ...targetEvents,
        ];
      if (item.kind === "materialization")
        return [
          {
            ...base,
            name: "card-materialized",
            subjectId: item.cardId,
            stackItemId: item.id,
            stackItemType: "materialization",
            from: item.originZone,
            ...(item.sourceId ? { sourceId: item.sourceId } : {}),
          },
          ...targetEvents,
        ];
      if (item.kind === "activated-ability")
        return [
          {
            ...base,
            name: "ability-activated",
            subjectId: item.sourceId,
            stackItemId: item.id,
            stackItemType: "ability",
            abilityKind: "activated",
            abilityId: item.ability.id,
            ...(item.sourceId ? { sourceId: item.sourceId } : {}),
          },
          ...targetEvents,
        ];
      if (item.kind === "triggered-ability")
        return [
          {
            ...base,
            name: "ability-triggered",
            subjectId: item.sourceId,
            stackItemId: item.id,
            stackItemType: "ability",
            abilityKind: "triggered",
            abilityId: item.ability.id,
            ...(item.sourceId ? { sourceId: item.sourceId } : {}),
          },
          ...targetEvents,
        ];
      return targetEvents;
    }
    case "stack-item-removed":
      return event.internal || event.outcome !== "resolved"
        ? []
        : [{ ...base, name: "effect-resolved", stackItemId: event.itemId }];
    case "stack-item-retargeted": {
      const item = event.item;
      const targetIds = [...new Set(item.targets.flatMap((target) => target.targetIds))];
      const recipientIncarnations: Readonly<Partial<Record<GrandArchiveObjectId, number>>> =
        Object.fromEntries(
          item.targets.flatMap((target) => Object.entries(target.targetObjectIncarnations)),
        );
      return [
        {
          ...base,
          name: "stack-item-targets-declared",
          stackItemId: item.id,
          stackItemType:
            item.kind === "activated-ability" || item.kind === "triggered-ability"
              ? "ability"
              : item.kind === "materialization"
                ? "materialization"
                : "card-activation",
          ...(item.kind === "activated-ability"
            ? { abilityKind: "activated" as const }
            : item.kind === "triggered-ability"
              ? { abilityKind: "triggered" as const }
              : {}),
          ...(item.sourceId ? { sourceId: item.sourceId, subjectId: item.sourceId } : {}),
          recipientIds: targetIds,
          recipientIncarnations,
        },
      ];
    }
    case "stack-item-negated": {
      const item = event.item;
      return [
        {
          ...base,
          name: "stack-item-negated",
          stackItemId: item.id,
          stackItemType:
            item.kind === "activated-ability" || item.kind === "triggered-ability"
              ? "ability"
              : item.kind === "materialization"
                ? "materialization"
                : "card-activation",
          ...(item.kind === "activated-ability"
            ? { abilityKind: "activated" as const }
            : item.kind === "triggered-ability"
              ? { abilityKind: "triggered" as const }
              : {}),
          ...(item.sourceId ? { sourceId: item.sourceId, subjectId: item.sourceId } : {}),
        },
      ];
    }
    case "object-created":
      return event.object.zone === "field"
        ? [{ ...base, name: "object-entered-field", subjectId: event.object.id, to: "field" }]
        : [];
    case "tokens-summoned": {
      const subjectIds = event.objects.map((object) => object.id);
      return [
        {
          ...base,
          name: "tokens-summoned",
          actorId: event.playerId,
          subjectId: subjectIds[0],
          subjectIds,
          amount: subjectIds.length,
          to: "field",
        },
        ...event.objects.map((object) => ({
          ...base,
          name: "object-entered-field" as const,
          actorId: event.playerId,
          subjectId: object.id,
          from: undefined,
          to: "field" as const,
        })),
      ];
    }
    case "object-removed-from-game":
      return event.object.zone === "field" && !event.leftFieldAsChampion
        ? [
            {
              ...base,
              name: "object-left-field",
              actorId: event.losingPlayerId,
              subjectId: event.object.id,
              from: "field",
            },
          ]
        : [];
    case "player-state-changed":
      return [
        {
          ...base,
          name: "player-state-changed",
          actorId: event.playerId,
          state: event.state,
          ...(event.previousValue !== undefined ? { stateFrom: event.previousValue } : {}),
          stateTo: event.value,
        },
      ];
    case "game-state-changed":
      return [];
    case "damage-cleared":
    case "phase-skip-added":
    case "phase-skip-consumed":
    case "object-ceased":
    case "stack-item-fizzled":
    case "stack-item-targets-invalidated":
    case "champion-deleveled":
    case "object-controller-changed":
    case "object-facing-changed":
    case "object-characteristic-tracked":
    case "cards-looked-at":
    case "cards-searched":
    case "zone-reordered":
    case "mastery-changed":
    case "mastery-counter-changed":
    case "cascade-advanced":
    case "random-state-changed":
    case "combat-step-changed":
    case "combat-retaliators-ordered":
    case "combat-defender-redirected":
    case "combat-ended":
    case "phase-end-requested":
    case "turn-end-requested":
    case "termination-cleared":
    case "continuous-effect-created":
    case "continuous-effect-expired":
    case "replacement-effect-created":
    case "replacement-follow-up-created":
    case "replacement-follow-up-consumed":
    case "replacement-pre-commit-created":
    case "replacement-pre-commit-started":
    case "replacement-pre-commit-cleared":
    case "replacement-capacity-consumed":
    case "replacement-effect-consumed":
    case "replacement-effect-expired":
    case "replacement-limit-used":
    case "rule-modification-created":
    case "rule-modification-expired":
    case "pending-trigger-added":
    case "pending-trigger-removed":
    case "pending-trigger-batch-ordered":
    case "reflexive-trigger-generated":
    case "reflexive-trigger-consumed":
    case "delayed-trigger-created":
    case "delayed-trigger-consumed":
    case "delayed-trigger-removed":
    case "stack-item-after-resolution-scheduled":
    case "deferred-stack-item-promoted":
    case "effect-resolution-suspended":
    case "effect-resolution-cleared":
    case "opportunity-opened":
    case "opportunity-passed":
    case "opportunity-closed":
    case "pregame-player-advanced":
    case "pregame-starting-cards-entered":
    case "pregame-completed":
    case "materialization-choice-consumed":
    case "player-first-turn-completed":
    case "player-lost":
    case "game-outcome-declared":
    case "game-outcome-cleared":
    case "match-finished":
    case "decision-created":
    case "decision-cleared":
    case "replacement-pre-commit-critical-declined":
    case "replacement-pre-commit-critical-paid":
    case "replacement-pre-commit-critical-doubled":
    case "object-reference-substituted":
      return [];
    default:
      return assertNever(event);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled committed event observation: ${JSON.stringify(value)}`);
}

/** Preserve the identity selected at activation, including through zone changes. */
export function grandArchiveEventRecipientBinding(
  observed: GrandArchiveObservedEvent,
):
  | readonly GrandArchiveTargetId[]
  | import("../procedures/effects/evaluation.ts").GrandArchiveObjectIdentityBinding {
  const ids = observed.recipientIds ?? (observed.recipientId ? [observed.recipientId] : []);
  return observed.recipientIncarnations && Object.keys(observed.recipientIncarnations).length
    ? { kind: "object-identities", ids, incarnations: observed.recipientIncarnations }
    : ids;
}
