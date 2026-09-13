import type { GrandArchiveZone } from "@tcg/grand-archive-types";
import { grandArchiveObjectDisplayName } from "../game/card-runtime.ts";
import type { GrandArchiveCommittedEvent } from "../kernel/events.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../game/identity.ts";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type {
  GrandArchiveCardInstance,
  GrandArchiveMatchState,
  GrandArchiveStackItem,
} from "../game/model.ts";
import { GRAND_ARCHIVE_PRIVATE_ZONES } from "../game/zones.ts";
import { grandArchiveViewerKnowsMovedIdentity } from "../game/visibility.ts";
import {
  createGrandArchiveLogMessage,
  type GrandArchiveLogKey,
  type GrandArchiveLogMessage,
  type GrandArchiveLogMessageFor,
  type GrandArchiveLogValuesByKey,
} from "./messages.ts";

type GrandArchiveEventLogPolicy = "log" | "omit";

/**
 * Every committed event is deliberately classified. Adding an engine event
 * fails compilation here until its player-facing visibility is reviewed.
 */
export const GRAND_ARCHIVE_EVENT_LOG_POLICIES = {
  "object-created": "omit",
  "tokens-summoned": "log",
  "object-ceased": "omit",
  "object-removed-from-game": "omit",
  "object-moved": "log",
  "object-reference-substituted": "omit",
  "object-state-changed": "omit",
  "object-activation-state-changed": "omit",
  "object-facing-changed": "log",
  "object-characteristic-tracked": "omit",
  "card-revealed": "log",
  "cards-looked-at": "log",
  "cards-searched": "log",
  "zone-reordered": "log",
  "player-state-changed": "omit",
  "mastery-changed": "log",
  "mastery-counter-changed": "log",
  "game-state-changed": "omit",
  "keyword-action-performed": "log",
  "cascade-advanced": "omit",
  "counter-changed": "log",
  "damage-marked": "log",
  "damage-cleared": "omit",
  "damage-removed": "log",
  "damage-prevented": "log",
  "object-controller-changed": "log",
  "object-transformed": "log",
  "object-became-copy": "omit",
  "champion-leveled-up": "log",
  "champion-deleveled": "log",
  "random-state-changed": "log",
  "combat-started": "log",
  "combat-step-changed": "omit",
  "combat-retaliators-ordered": "omit",
  "combat-defender-redirected": "omit",
  "combat-ended": "log",
  "phase-end-requested": "omit",
  "turn-end-requested": "omit",
  "termination-cleared": "omit",
  "continuous-effect-created": "omit",
  "continuous-effect-expired": "omit",
  "replacement-effect-created": "omit",
  "replacement-follow-up-created": "omit",
  "replacement-follow-up-consumed": "omit",
  "replacement-pre-commit-created": "omit",
  "replacement-pre-commit-started": "omit",
  "replacement-pre-commit-cleared": "omit",
  "replacement-pre-commit-critical-declined": "omit",
  "replacement-pre-commit-critical-paid": "omit",
  "replacement-pre-commit-critical-doubled": "omit",
  "replacement-capacity-consumed": "omit",
  "replacement-effect-consumed": "omit",
  "replacement-effect-expired": "omit",
  "replacement-limit-used": "omit",
  "rule-modification-created": "omit",
  "rule-modification-expired": "omit",
  "pending-trigger-added": "omit",
  "pending-trigger-removed": "omit",
  "pending-trigger-batch-ordered": "omit",
  "reflexive-trigger-generated": "omit",
  "reflexive-trigger-consumed": "omit",
  "delayed-trigger-created": "omit",
  "delayed-trigger-consumed": "omit",
  "delayed-trigger-removed": "omit",
  "stack-item-added": "log",
  "stack-item-deferred": "omit",
  "stack-item-after-resolution-scheduled": "omit",
  "deferred-stack-item-promoted": "omit",
  "stack-item-retargeted": "omit",
  "stack-item-targets-invalidated": "omit",
  "stack-item-fizzled": "log",
  "stack-item-negated": "log",
  "stack-item-removed": "log",
  "effect-resolution-suspended": "omit",
  "effect-resolution-cleared": "omit",
  "opportunity-opened": "omit",
  "opportunity-passed": "log",
  "opportunity-closed": "omit",
  "pregame-player-advanced": "omit",
  "pregame-starting-cards-entered": "omit",
  "pregame-completed": "omit",
  "boon-gained": "log",
  "phase-changed": "log",
  "cards-recollected": "log",
  "phase-skip-added": "log",
  "phase-skip-consumed": "log",
  "materialization-choice-consumed": "omit",
  "turn-started": "log",
  "turn-cleanup-pending-changed": "omit",
  "attack-declaration-attempted": "omit",
  "player-first-turn-completed": "omit",
  "player-lost": "log",
  "game-outcome-declared": "omit",
  "game-outcome-cleared": "omit",
  "match-finished": "log",
  "decision-created": "log",
  "decision-cleared": "omit",
} as const satisfies Record<GrandArchiveCommittedEvent["type"], GrandArchiveEventLogPolicy>;

function message<TKey extends GrandArchiveLogKey>(
  event: GrandArchiveCommittedEvent,
  key: TKey,
  values: GrandArchiveLogValuesByKey[TKey],
): GrandArchiveLogMessageFor<TKey> {
  return createGrandArchiveLogMessage(event.eventId, event.stateVersion, key, values);
}

function definitionName(program: GrandArchiveMatchProgram, definitionId: string | undefined) {
  if (!definitionId) return "a card";
  const definition = program.cardsById[definitionId];
  if (!definition) return "a card";
  return definition.layout.kind === "single-faced"
    ? definition.layout.face.name
    : definition.layout.defaultFace.name;
}

function objectName(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  objectId: GrandArchiveObjectId,
  event?: GrandArchiveCommittedEvent,
): string {
  const object =
    event?.objectSnapshot?.id === objectId ? event.objectSnapshot : state.objects[objectId];
  return object ? grandArchiveObjectDisplayName(program, object) : "a card";
}

function embeddedObjectName(
  program: GrandArchiveMatchProgram,
  object: GrandArchiveCardInstance,
): string {
  return grandArchiveObjectDisplayName(program, object);
}

function objectNames(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  objectIds: readonly GrandArchiveObjectId[],
): string {
  if (objectIds.length === 0) return "nothing";
  return objectIds.map((objectId) => objectName(program, state, objectId)).join(", ");
}

function isPrivateZone(zone: GrandArchiveZone): boolean {
  return (GRAND_ARCHIVE_PRIVATE_ZONES as readonly GrandArchiveZone[]).includes(zone);
}

function movedCardName(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  event: Extract<GrandArchiveCommittedEvent, { readonly type: "object-moved" }>,
): string {
  const object = event.previousObject ?? state.objects[event.objectId];
  return object
    ? grandArchiveObjectDisplayName(program, object)
    : definitionName(program, event.previousActiveDefinitionId);
}

function movedCardController(
  state: GrandArchiveMatchState,
  event: Extract<GrandArchiveCommittedEvent, { readonly type: "object-moved" }>,
): GrandArchivePlayerId {
  const object = state.objects[event.objectId];
  return (
    event.newControllerId ??
    event.previousControllerId ??
    object?.controllerId ??
    object?.ownerId ??
    event.actorId ??
    state.turn.playerId
  );
}

function movedIdentityIsPublic(
  event: Extract<GrandArchiveCommittedEvent, { readonly type: "object-moved" }>,
): boolean {
  return !isPrivateZone(event.to) && event.entryFacing !== "face-down";
}

function stackItemName(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  item: GrandArchiveStackItem,
): string {
  if (item.masterySource) return item.masterySource.name;
  if (item.gameSource) return item.gameSource.name;
  if ("cardId" in item) return objectName(program, state, item.cardId);
  return item.sourceId ? objectName(program, state, item.sourceId) : "an ability";
}

function projectEvent(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  viewerId: GrandArchivePlayerId,
  event: GrandArchiveCommittedEvent,
): readonly GrandArchiveLogMessage[] {
  switch (event.type) {
    case "object-moved": {
      const playerId = movedCardController(state, event);
      if (
        movedIdentityIsPublic(event) ||
        grandArchiveViewerKnowsMovedIdentity(viewerId, playerId, event)
      ) {
        return [
          message(event, "grand-archive.card.moved", {
            playerId,
            cardName: movedCardName(program, state, event),
            from: event.from,
            to: event.to,
          }),
        ];
      }
      return [
        message(event, "grand-archive.card.moved.hidden", {
          playerId,
          from: event.from,
          to: event.to,
        }),
      ];
    }
    case "card-revealed":
      return [
        message(event, "grand-archive.card.revealed", {
          playerId: event.playerId,
          cardName: objectName(program, state, event.objectId, event),
        }),
      ];
    case "cards-looked-at":
    case "cards-searched": {
      const privateKey =
        event.type === "cards-looked-at"
          ? "grand-archive.cards.looked-at.private"
          : "grand-archive.cards.searched.private";
      const publicKey =
        event.type === "cards-looked-at"
          ? "grand-archive.cards.looked-at"
          : "grand-archive.cards.searched";
      return viewerId === event.playerId
        ? [
            message(event, privateKey, {
              playerId: event.playerId,
              cardNames: objectNames(program, state, event.objectIds),
            }),
          ]
        : [message(event, publicKey, { playerId: event.playerId, count: event.objectIds.length })];
    }
    case "cards-recollected":
      return viewerId === event.playerId
        ? [
            message(event, "grand-archive.cards.recollected.private", {
              playerId: event.playerId,
              cardNames: objectNames(program, state, event.objectIds),
            }),
          ]
        : [
            message(event, "grand-archive.cards.recollected", {
              playerId: event.playerId,
              count: event.objectIds.length,
            }),
          ];
    case "zone-reordered":
      return [
        message(event, "grand-archive.zone.reordered", {
          playerId: event.playerId,
          zone: event.zone,
          count: event.objectIds.length,
        }),
      ];
    case "tokens-summoned":
      return [
        message(event, "grand-archive.tokens.summoned", {
          playerId: event.playerId,
          cardNames: event.objects.map((object) => embeddedObjectName(program, object)).join(", "),
        }),
      ];
    case "object-facing-changed": {
      if (event.facing === "face-up") {
        return [
          message(event, "grand-archive.object.face-up", {
            cardName: objectName(program, state, event.objectId, event),
          }),
        ];
      }
      return [message(event, "grand-archive.object.face-down", {})];
    }
    case "object-transformed":
      return [
        message(event, "grand-archive.object.transformed", {
          cardName: objectName(program, state, event.objectId, event),
        }),
      ];
    case "object-controller-changed":
      return [
        message(event, "grand-archive.object.controller-changed", {
          cardName: objectName(program, state, event.objectId, event),
          playerId: event.controllerId,
        }),
      ];
    case "champion-leveled-up": {
      const champion = state.objects[event.championId];
      return [
        message(event, "grand-archive.champion.leveled-up", {
          playerId: champion?.controllerId ?? state.turn.playerId,
          cardName: objectName(program, state, event.cardId),
        }),
      ];
    }
    case "champion-deleveled": {
      const champion = state.objects[event.championId];
      return [
        message(event, "grand-archive.champion.deleveled", {
          playerId: champion?.controllerId ?? state.turn.playerId,
          cardName: objectName(program, state, event.cardId),
        }),
      ];
    }
    case "boon-gained":
      return [
        message(event, "grand-archive.boon.gained", {
          playerId: event.playerId,
          cardName: objectName(program, state, event.objectId, event),
        }),
      ];
    case "mastery-changed":
      return [
        message(event, "grand-archive.mastery.changed", {
          playerId: event.playerId,
          mastery: event.mastery,
        }),
      ];
    case "mastery-counter-changed":
      return [
        message(event, "grand-archive.mastery.counter-changed", {
          playerId: event.playerId,
          mastery: event.mastery,
          counter: event.counter,
          delta: event.delta,
        }),
      ];
    case "damage-marked":
      return [
        message(event, "grand-archive.damage.marked", {
          cardName: objectName(program, state, event.objectId, event),
          amount: event.amount,
        }),
      ];
    case "damage-prevented":
      return [
        message(event, "grand-archive.damage.prevented", {
          cardName: objectName(program, state, event.objectId, event),
          amount: event.amount,
        }),
      ];
    case "damage-removed":
      return [
        message(event, "grand-archive.damage.removed", {
          cardName: objectName(program, state, event.objectId, event),
          amount: event.amount,
        }),
      ];
    case "counter-changed":
      return [
        message(event, "grand-archive.counter.changed", {
          cardName: objectName(program, state, event.objectId, event),
          counter: event.counter,
          delta: event.delta,
        }),
      ];
    case "combat-started":
      return [
        message(event, "grand-archive.combat.started", {
          playerId: event.combat.attackingPlayerId,
          attackerName: objectName(program, state, event.combat.attackerId),
          targetNames: objectNames(program, state, event.combat.targetIds),
        }),
      ];
    case "combat-ended":
      return [message(event, "grand-archive.combat.ended", {})];
    case "stack-item-added":
      return event.item.kind === "replacement-follow-up"
        ? []
        : [
            message(event, "grand-archive.stack.added", {
              playerId: event.item.controllerId,
              sourceName: stackItemName(program, state, event.item),
            }),
          ];
    case "stack-item-fizzled":
      return [
        message(event, "grand-archive.stack.fizzled", {
          sourceName: stackItemName(program, state, event.item),
          reason: event.reason,
        }),
      ];
    case "stack-item-negated":
      return [
        message(event, "grand-archive.stack.negated", {
          sourceName: stackItemName(program, state, event.item),
        }),
      ];
    case "stack-item-removed":
      return event.internal ? [] : [message(event, "grand-archive.stack.resolved", {})];
    case "keyword-action-performed":
      return [
        message(event, "grand-archive.keyword-action", {
          playerId: event.playerId,
          action: event.action,
        }),
      ];
    case "random-state-changed":
      return event.result
        ? [
            message(event, "grand-archive.random.roll", {
              playerId: event.actorId ?? state.turn.playerId,
              sides: event.result.sides,
              results: event.result.results.join(", "),
              total: event.result.total,
            }),
          ]
        : [];
    case "opportunity-passed":
      return [message(event, "grand-archive.opportunity.passed", { playerId: event.playerId })];
    case "phase-changed":
      return [
        message(event, "grand-archive.phase.started", {
          playerId: event.actorId ?? state.turn.playerId,
          phase: event.phase,
        }),
      ];
    case "phase-skip-added":
    case "phase-skip-consumed":
      return [
        message(event, "grand-archive.phase.skip", {
          playerId: event.playerId,
          phase: event.phase,
          action: event.type === "phase-skip-added" ? "added" : "consumed",
        }),
      ];
    case "turn-started":
      return [
        message(event, "grand-archive.turn.started", {
          playerId: event.playerId,
          turnNumber: event.turnNumber,
        }),
      ];
    case "player-lost":
      return [
        message(event, "grand-archive.player.lost", {
          playerId: event.playerId,
          reason: event.reason,
        }),
      ];
    case "match-finished":
      return [
        message(event, "grand-archive.match.finished", {
          winnerIds: event.winnerIds.join(", ") || "none",
        }),
      ];
    case "decision-created":
      return viewerId === event.decision.playerId
        ? [
            message(event, "grand-archive.decision.private", {
              playerId: event.decision.playerId,
              label: event.decision.kind,
            }),
          ]
        : [
            message(event, "grand-archive.decision.awaiting", {
              playerId: event.decision.playerId,
            }),
          ];
    default:
      if (GRAND_ARCHIVE_EVENT_LOG_POLICIES[event.type] === "omit") return [];
      throw new Error(`Missing Grand Archive log projection for ${event.type}`);
  }
}

/** Projects committed engine history into one player's secrecy-safe log. */
export function projectGrandArchiveViewerLog(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  viewerId: GrandArchivePlayerId,
  events: readonly GrandArchiveCommittedEvent[] = state.eventHistory,
): readonly GrandArchiveLogMessage[] {
  if (!state.players[viewerId]) throw new Error("Log viewer is not a player in this match");
  const unresolvedTerminalItemIds = new Set(
    events.flatMap((event) =>
      event.type === "stack-item-fizzled" || event.type === "stack-item-negated"
        ? [event.item.id]
        : [],
    ),
  );
  return events.flatMap((event) =>
    event.type === "stack-item-removed" && unresolvedTerminalItemIds.has(event.itemId)
      ? []
      : projectEvent(program, state, viewerId, event),
  );
}
