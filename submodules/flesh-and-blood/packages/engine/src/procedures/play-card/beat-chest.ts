import type { FabMatchState } from "../../state.ts";
import { appendFabEventGroup } from "../../kernel/event-journal.ts";
import type { FabRulesProcess } from "../../rules/process.ts";
import { nextFabDestinationRef, snapshotObject } from "../../rules/snapshots.ts";
import { buildFabRulesView } from "../../rules/state-rules-view.ts";
import type { FabEvaluatedObject } from "../../rules/rules-view.ts";

export function appendBeatChestEventGroups(
  process: FabRulesProcess,
  procedure: Extract<FabRulesProcess["procedure"], { readonly kind: "play-card" }>,
  preview: FabMatchState,
  currentObject: FabEvaluatedObject | null,
): { readonly message: string; readonly errorCode: string } | null {
  if (!procedure.beatChest) return null;
  const hasBeatChestKeyword =
    currentObject?.current.keywords.some((keyword) => keyword.name === "beat-chest") ?? false;
  if (!hasBeatChestKeyword)
    return { message: "This card does not have beat chest.", errorCode: "illegal_additional_cost" };
  const chosenId = procedure.beatChestInstanceId;
  const hand = preview.containers.zonesByPlayerId[procedure.actorId]!.hand ?? [];
  if (!chosenId || !hand.includes(chosenId) || chosenId === procedure.object.instanceId)
    return {
      message: "Beat chest requires discarding a card from hand.",
      errorCode: "additional_cost_failed",
    };
  const chosen = preview.objects[chosenId]
    ? buildFabRulesView(preview).object({
        instanceId: chosenId,
        incarnation: preview.objects[chosenId]!.incarnation,
      })
    : null;
  const power = chosen?.current.numeric.power ?? 0;
  if (power < 6)
    return {
      message: "Beat chest requires discarding a card with 6 or more power.",
      errorCode: "additional_cost_failed",
    };
  const discardedCard = snapshotObject(preview, chosenId, procedure.actorId, "hand");
  appendFabEventGroup(process, [
    {
      name: "discard",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [discardedCard],
      bindings: { discardedCard },
      data: {
        playerId: procedure.actorId,
        object: discardedCard,
        destinationRef: nextFabDestinationRef(preview, discardedCard),
        random: false,
      },
    },
  ]);
  appendFabEventGroup(process, [
    {
      name: "beat-chest",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [procedure.object, discardedCard],
      bindings: {},
      data: {
        actorId: procedure.actorId,
        object: procedure.object,
        discarded: [discardedCard],
      },
    },
  ]);
  return null;
}
