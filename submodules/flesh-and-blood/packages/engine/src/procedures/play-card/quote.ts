import type { FabMatchState } from "../../state.ts";
import { appendFabEventGroup } from "../../kernel/event-journal.ts";
import type { FabProcessId } from "../../rules/events.ts";
import { type FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { snapshotObject } from "../../rules/snapshots.ts";
import { buildFabRulesView } from "../../rules/state-rules-view.ts";
import type { FabPlayQuote } from "../../rules/legality-quotes.ts";
import type { FabPlayDeclaration, FabPlayProcedureResult } from "./types.ts";
import { failure } from "./types.ts";

import { advanceFabPlayDeclarations } from "./declarations.ts";
import { createProcedureProcess } from "./helpers.ts";
import { mutateInPlace } from "../../copy-on-write.ts";
import { startFabRulesProcess } from "../../kernel/process-state.ts";
import { validateFusionDeclaration } from "./fuse.ts";
import { playCostDeclaredKey, playCostSpecs } from "./effect-costs.ts";

export function beginFabPlayProcedure(
  current: FabMatchState,
  declaration: FabPlayDeclaration,
  options: FabEventTransactionOptions,
): FabPlayProcedureResult {
  const quote = buildFabRulesView(current).quotePlay({
    actorId: declaration.actorId,
    instanceId: declaration.instanceId,
    from: declaration.from,
    attackTargetId: declaration.requestedAttackTargetId ?? null,
    additionalAttackTargetId: declaration.additionalAttackTargetId ?? null,
    playMethod: declaration.playMethod,
    playPermissionId: declaration.playPermissionId,
  });
  return executeFabPlayQuote(current, quote, declaration, options);
}

/** Execute only the exact play quote produced for this authoritative state version. */

export function executeFabPlayQuote(
  current: FabMatchState,
  quote: FabPlayQuote,
  declaration: FabPlayDeclaration,
  options: FabEventTransactionOptions,
): FabPlayProcedureResult {
  const {
    boost = false,
    scrap = false,
    scrapInstanceId = null,
    beatChest = false,
    beatChestInstanceId = null,
    crank = true,
    fuseInstanceIds = [],
    chargeInstanceId = null,
    banishCostInstanceId = null,
    declaredOptionalCostAbilityIds = [],
    paidOptionalCostAbilityIds = [],
  } = declaration;
  if (quote.stateID !== current.stateID)
    return failure(current, "The play quote is stale.", "stale_play_quote");
  if (!quote.allowed) return failure(current, quote.reason, quote.reasonCode);
  const { actorId, instanceId, from } = quote.request;
  const resourceCost = quote.resourceCost;
  const actionPointCost = quote.actionPointCost;
  const playTiming = quote.timing;
  if (
    resourceCost === null ||
    actionPointCost === null ||
    quote.object === null ||
    playTiming === null
  )
    return failure(current, "The play quote is incomplete.", "invalid_play_quote");
  if (quote.selectedPlayPermissionId === null)
    return failure(current, "The play permission is missing.", "invalid_play_quote");
  const selectedPlayPermissionId = quote.selectedPlayPermissionId;
  const fusion = validateFusionDeclaration(current, actorId, quote.object, fuseInstanceIds);
  if (!fusion.valid) return failure(current, fusion.reason, "invalid_fusion_cost");
  const specialCostFailure = validateSpecialAdditionalCosts(
    current,
    quote.object,
    actorId,
    from,
    scrap,
    scrapInstanceId,
    beatChest,
    beatChestInstanceId,
  );
  if (specialCostFailure) return failure(current, specialCostFailure, "additional_cost_failed");
  const state = mutateInPlace(current, (draft) => {
    draft.stateID += 1;
    draft.counters.process += 1;
    const processId: FabProcessId = `process-${draft.counters.process}`;
    const announced = snapshotObject(draft, instanceId, actorId, from);
    // CR 5.1.2c / 9.2.3: a split declaration defines the exact properties
    // from announcement through the layer's full stack existence. Keep that
    // typed LKI in the persisted procedure; never rediscover it from text.
    const object = quote.splitBase
      ? {
          ...announced,
          base: quote.splitBase,
          baseNumeric: quote.splitBase.numeric,
          current: quote.splitBase,
        }
      : announced;
    const process = createProcedureProcess(
      processId,
      actorId,
      object,
      from,
      resourceCost,
      actionPointCost,
      playTiming,
      quote.attackTarget,
      boost,
      scrap,
      scrapInstanceId,
      beatChest,
      beatChestInstanceId,
      crank,
      quote.splitPlayMethod,
      fuseInstanceIds,
      chargeInstanceId,
      quote.additionalAttackTargets,
      banishCostInstanceId,
      selectedPlayPermissionId,
    );
    if (declaredOptionalCostAbilityIds.length > 0 && process.procedure?.kind === "play-card") {
      const declared = new Set(declaredOptionalCostAbilityIds);
      const paid = new Set(paidOptionalCostAbilityIds);
      process.procedure.costBindings = Object.fromEntries(
        playCostSpecs(object)
          .filter(
            (spec) =>
              (spec.role === "additional-cost" || spec.role === "alternative-cost") &&
              spec.optional &&
              declared.has(spec.abilityId),
          )
          .map((spec) => [playCostDeclaredKey(spec.abilityId), paid.has(spec.abilityId)]),
      );
    }
    startFabRulesProcess(draft, process);
    appendFabEventGroup(process, [
      {
        name: "announce-card",
        processId,
        cause: { kind: "player-command", actorId, command: "begin-play" },
        controllerId: actorId,
        source: object,
        affected: [object],
        bindings: {},
        data: {
          actorId,
          object,
          from,
          destinationRef: null,
          splitPlayMethod: quote.splitPlayMethod,
        },
      },
    ]);
    process.procedure!.stage = "modes-and-targets";
  });
  return advanceFabPlayDeclarations(state, options);
}

/** Validate required and declared keyword costs before announcing a card (CR 5.1.2e). */
function validateSpecialAdditionalCosts(
  state: FabMatchState,
  object: NonNullable<FabPlayQuote["object"]>,
  actorId: string,
  from: FabPlayQuote["request"]["from"],
  scrap: boolean,
  scrapInstanceId: string | null,
  beatChest: boolean,
  beatChestInstanceId: string | null,
): string | null {
  const view = buildFabRulesView(state);
  const announced = view.object(object);
  if (!announced) return "The announced card is no longer available.";
  const keywords = announced.current.keywords.map((keyword) => keyword.name);
  if (scrap) {
    if (!keywords.includes("scrap")) return "This card does not have scrap.";
    if (
      !scrapInstanceId ||
      !state.containers.zonesByPlayerId[actorId]!.graveyard.includes(scrapInstanceId)
    ) {
      return "Scrap requires banishing an item or equipment from your graveyard.";
    }
    const record = state.objects[scrapInstanceId];
    const chosen = record
      ? view.object({ instanceId: record.instanceId, incarnation: record.incarnation })
      : null;
    const types = chosen?.current.typeBox.types ?? [];
    const subtypes = chosen?.current.typeBox.subtypes ?? [];
    if (!types.includes("Equipment") && !subtypes.includes("Item")) {
      return "Scrap requires banishing an item or equipment from your graveyard.";
    }
  }
  if (beatChest) {
    if (!keywords.includes("beat-chest")) return "This card does not have beat chest.";
    if (
      !beatChestInstanceId ||
      beatChestInstanceId === object.instanceId ||
      !state.containers.zonesByPlayerId[actorId]!.hand.includes(beatChestInstanceId)
    ) {
      return "Beat chest requires discarding a card from hand.";
    }
    const record = state.objects[beatChestInstanceId];
    const chosen = record
      ? view.object({ instanceId: record.instanceId, incarnation: record.incarnation })
      : null;
    if ((chosen?.current.numeric.power ?? 0) < 6) {
      return "Beat chest requires discarding a card with 6 or more power.";
    }
  }
  return null;
}
