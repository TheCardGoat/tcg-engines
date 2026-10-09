import type { Effect } from "@tcg/cyberpunk-types";
import type {
  ActionLogEvent,
  EffectTarget,
  GameEvent,
  GigDieRolledEvent,
} from "../types/game-events.ts";
import type { CardInstanceId, GigDieId, PlayerId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import { defOf } from "../state/lookups.ts";
import { privateField } from "./private-field.ts";

export interface EffectTargetActionLogDetails {
  params: ActionLogEvent["params"];
  cardIds: string[];
}

/**
 * Build the shared player-facing summary for resolving an effect target choice.
 * Keeping this in logging avoids every card/effect handler inventing its own
 * "selected X for Y" copy and keeps private face-down targets masked.
 */
export function buildEffectTargetActionLogDetails(
  state: MatchState,
  sourceCardId: CardInstanceId,
  targetIds: readonly string[],
  chooserId: PlayerId,
): EffectTargetActionLogDetails {
  const sourceCard = state.G.cardIndex[sourceCardId as string];
  const sourceCardName = sourceCard ? defOf(sourceCard).displayName : "that effect";
  const selectedTargets = targetIds.map((id) => targetSummary(state, id));
  const targetNames = selectedTargets.map((target) => target.name).join(", ");
  const privateTargetNames = selectedTargets.some((target) => target.privateToChooser)
    ? privateField(targetNames, [chooserId])
    : targetNames;

  const params: ActionLogEvent["params"] = {
    count: targetIds.length,
    sourceCardName,
    targetNames: privateTargetNames,
    ...(targetIds.length === 1
      ? selectedTargets[0]!.privateToChooser
        ? { targetId: privateField(targetIds[0]!, [chooserId]) }
        : { targetId: targetIds[0]! }
      : {}),
    ...(selectedTargets.length === 1 ? selectedTargets[0]!.publicLocation : {}),
  };

  return {
    params,
    cardIds: [sourceCardId as string, ...targetIds.filter((id) => state.G.cardIndex[id])],
  };
}

export function targetResolvedMessageKey(
  effect: Effect | undefined,
):
  | "trigger.targetResolved"
  | "trigger.targetResolved.deckBottom"
  | "trigger.targetResolved.rerollGig" {
  if (effect?.effect === "moveCard" && effect.destination === "deckBottom") {
    return "trigger.targetResolved.deckBottom";
  }
  if (effect?.effect === "rerollGig") return "trigger.targetResolved.rerollGig";
  return "trigger.targetResolved";
}

export function buildTargetResolvedActionLog(
  effect: Effect | undefined,
  actionLog: EffectTargetActionLogDetails,
  emittedEvents: readonly GameEvent[],
  targetIds: readonly string[],
): { messageKey: ReturnType<typeof targetResolvedMessageKey>; params: ActionLogEvent["params"] } {
  const messageKey = targetResolvedMessageKey(effect);
  if (messageKey !== "trigger.targetResolved.rerollGig") {
    return { messageKey, params: actionLog.params };
  }
  const targetId = targetIds[0];
  const rollEvent = emittedEvents.find(
    (event): event is GigDieRolledEvent =>
      event.type === "gigDieRolled" &&
      (event.dieId as string) === targetId &&
      event.origin === "reroll",
  );
  if (!rollEvent || rollEvent.previousValue === undefined) {
    return { messageKey: "trigger.targetResolved", params: actionLog.params };
  }
  return {
    messageKey,
    params: {
      ...actionLog.params,
      dieId: rollEvent.dieId,
      previousValue: rollEvent.previousValue,
      newValue: rollEvent.result,
    },
  };
}

export function classifyEffectTargets(
  state: MatchState,
  targetIds: ReadonlyArray<string>,
): EffectTarget[] {
  const out: EffectTarget[] = [];
  const playerIdSet = new Set<string>(state.ctx.playerIds.map((pid) => pid as string));
  for (const id of targetIds) {
    if (state.G.cardIndex[id]) out.push({ kind: "card", cardId: id as CardInstanceId });
    else if (state.G.gigDice[id]) out.push({ kind: "gig", dieId: id as GigDieId });
    else if (playerIdSet.has(id)) out.push({ kind: "player", playerId: id as PlayerId });
  }
  return out;
}

interface TargetSummary {
  name: string;
  privateToChooser: boolean;
  publicLocation: Record<string, string | number>;
}

function targetSummary(state: MatchState, targetId: string): TargetSummary {
  const card = state.G.cardIndex[targetId];
  if (card) {
    const def = defOf(card);
    const location = findCardLocation(state, targetId);
    const privateToChooser = def.type === "legend" && card.meta.faceDown === true;
    return {
      name: def.displayName,
      privateToChooser,
      publicLocation: {
        targetKind: def.type,
        ...(location
          ? {
              targetOwnerId: location.playerId,
              targetZone: location.zone,
              targetIndex: location.index,
            }
          : {}),
      },
    };
  }

  const die = state.G.gigDice[targetId];
  if (die) {
    return {
      name: die.dieType.toUpperCase(),
      privateToChooser: false,
      publicLocation: { targetKind: "gig" },
    };
  }

  return { name: "target", privateToChooser: false, publicLocation: {} };
}

function findCardLocation(
  state: MatchState,
  targetId: string,
): { playerId: string; zone: string; index: number } | null {
  for (const [playerId, player] of Object.entries(state.G.players)) {
    for (const [zone, ids] of Object.entries(player.zones)) {
      const index = (ids as readonly unknown[]).findIndex((id) => String(id) === targetId);
      if (index >= 0) {
        return { playerId, zone, index };
      }
    }
  }
  return null;
}
