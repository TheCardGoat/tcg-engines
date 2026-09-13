import type { FabMatchState } from "../../state.ts";
import { appendFabEventGroup } from "../../kernel/event-journal.ts";
import type { FabRulesProcess } from "../../rules/process.ts";
import { nextFabDestinationRef, snapshotObject } from "../../rules/snapshots.ts";
import { matchesFabSnapshotFilter } from "../../rules/state-rules-view.ts";
import type { FabEvaluatedObject } from "../../rules/rules-view.ts";

type PlayCardProcedure = Extract<FabRulesProcess["procedure"], { readonly kind: "play-card" }>;

/** The optional "banish a card from your graveyard" effect additional-cost, if printed. */
function optionalBanishGraveyardCost(currentObject: FabEvaluatedObject | null): {
  readonly filter: Parameters<typeof matchesFabSnapshotFilter>[2] | undefined;
} | null {
  for (const ability of currentObject?.current.abilities ?? []) {
    if (ability.kind !== "static") continue;
    const playEffect = ability.playEffect;
    if (!playEffect || playEffect.role !== "additional-cost" || !playEffect.optional) continue;
    const cost = playEffect.cost;
    if (
      !cost ||
      cost.class !== "effect" ||
      cost.type !== "banish" ||
      cost.from !== "graveyard" ||
      cost.count !== 1
    )
      continue;
    return { filter: cost.filter };
  }
  return null;
}

/**
 * Optional graveyard-banish additional cost (Nimble Strike / Hurl). Pays only
 * the banish. The printed "If you do" benefit is applied once by
 * applyDeclaredPlayCostThenEffects after this cost is declared.
 */
export function appendBanishCostEventGroups(
  process: FabRulesProcess,
  procedure: PlayCardProcedure,
  preview: FabMatchState,
  currentObject: FabEvaluatedObject | null,
  resetOffset: number,
): string | null {
  const banishId = procedure.banishCostInstanceId;
  if (!banishId) return null;
  const cost = optionalBanishGraveyardCost(currentObject);
  if (!cost) return "This card does not print an optional banish additional-cost.";
  const graveyard = preview.containers.zonesByPlayerId[procedure.actorId]!.graveyard ?? [];
  if (!graveyard.includes(banishId)) {
    return "The optional banish cost requires a card in your graveyard.";
  }
  const banished = snapshotObject(preview, banishId, procedure.actorId, "graveyard");
  if (cost.filter && !matchesFabSnapshotFilter(preview, banished, cost.filter)) {
    return "The chosen card does not match the optional banish cost.";
  }
  appendFabEventGroup(process, [
    {
      name: "banish",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [banished],
      bindings: { banishCostCard: banished },
      data: {
        object: banished,
        destinationRef: nextFabDestinationRef(preview, banished, resetOffset),
        from: "graveyard",
        to: "banished",
        reason: "banish",
      },
    },
  ]);
  // "If you do" is applied once by applyDeclaredPlayCostThenEffects after this
  // cost is marked declared. Do not generate a second copy of the same atoms.
  return null;
}
