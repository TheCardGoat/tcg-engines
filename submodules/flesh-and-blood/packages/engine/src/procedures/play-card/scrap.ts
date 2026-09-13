import type { FabMatchState } from "../../state.ts";
import { appendFabEventGroup } from "../../kernel/event-journal.ts";
import type { FabRulesProcess } from "../../rules/process.ts";
import { nextFabDestinationRef, snapshotObject } from "../../rules/snapshots.ts";
import { buildFabRulesView } from "../../rules/state-rules-view.ts";
import type { FabEvaluatedObject } from "../../rules/rules-view.ts";

export function appendScrapEventGroups(
  process: FabRulesProcess,
  procedure: Extract<FabRulesProcess["procedure"], { readonly kind: "play-card" }>,
  preview: FabMatchState,
  currentObject: FabEvaluatedObject | null,
): { readonly message: string; readonly errorCode: string } | null {
  if (!procedure.scrap) return null;
  const hasScrapKeyword =
    currentObject?.current.keywords.some((keyword) => keyword.name === "scrap") ?? false;
  if (!hasScrapKeyword)
    return { message: "This card does not have scrap.", errorCode: "illegal_additional_cost" };
  // CR 8.3.32: "banish an item or equipment from your graveyard" — one chosen card.
  const chosenId = procedure.scrapInstanceId;
  const graveyard = preview.containers.zonesByPlayerId[procedure.actorId]!.graveyard ?? [];
  if (!chosenId || !graveyard.includes(chosenId))
    return {
      message: "Scrap requires banishing an item or equipment from your graveyard.",
      errorCode: "additional_cost_failed",
    };
  const chosen = preview.objects[chosenId]
    ? buildFabRulesView(preview).object({
        instanceId: chosenId,
        incarnation: preview.objects[chosenId]!.incarnation,
      })
    : null;
  // "Equipment" is a type (FAB_TYPES); "Item" is a subtype (FAB_SUBTYPES) — the
  // engine normalizes the flat catalog token list into typeBox buckets, so scrap
  // must consult both to honour CR 8.3.32's "an item or equipment".
  const types = chosen?.current.typeBox.types ?? [];
  const subtypes = chosen?.current.typeBox.subtypes ?? [];
  const isItemOrEquipment = types.includes("Equipment") || subtypes.includes("Item");
  if (!isItemOrEquipment)
    return {
      message: "Scrap requires banishing an item or equipment from your graveyard.",
      errorCode: "additional_cost_failed",
    };
  const scrappedCard = snapshotObject(preview, chosenId, procedure.actorId, "graveyard");
  appendFabEventGroup(process, [
    {
      name: "banish",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [scrappedCard],
      bindings: { scrappedCard, "cards-scrapped-by-this": 1 },
      data: {
        object: scrappedCard,
        destinationRef: nextFabDestinationRef(preview, scrappedCard),
        from: "graveyard",
        to: "banished",
        reason: "banish",
      },
    },
  ]);
  return null;
}
