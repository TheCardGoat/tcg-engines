import { isDeterministicDonAction } from "./loop-transition.ts";
import { effectBlocksForInstance, getCardForInstance } from "../shared.ts";
import type { MatchState, ResolutionItem, OptionalLoopBoundary } from "../types.ts";

function auditedDonBlock(
  state: MatchState,
  item: Extract<ResolutionItem, { kind: "effectBlock" }>,
  optionalSource?: string | string[],
): boolean {
  if (
    !Object.entries(item).every(
      ([key, value]) =>
        value === undefined ||
        [
          "id",
          "kind",
          "sourceInstanceId",
          "controller",
          "trigger",
          "blockIndex",
          "sourceZoneChangeCounter",
          "readyEffectSelected",
          "triggerEvent",
          ...(optionalSource ? ["confirmed", "activatedBlock"] : []),
        ].includes(key),
    )
  )
    return false;
  const block =
    item.activatedBlock ??
    effectBlocksForInstance(state, item.sourceInstanceId, item.trigger)[item.blockIndex];
  return Boolean(
    block &&
    ["activateMain", "whenDonReturned", "whenDonGiven"].includes(block.trigger) &&
    Object.keys(block).every(
      (key) =>
        key === "trigger" ||
        key === "actions" ||
        (key === "optional" &&
          sourceIds(optionalSource).includes(item.sourceInstanceId) &&
          block.trigger === "whenDonReturned"),
    ) &&
    block.actions.length > 0 &&
    block.actions.every((action) =>
      isDeterministicDonAction(state, item, action, false, sourceIds(optionalSource).length === 2),
    ),
  );
}

export function auditedDonTransition(
  state: MatchState,
  item: ResolutionItem,
  optionalSource?: string | string[],
): boolean {
  if (item.kind === "effectComplete") return true;
  if (item.kind === "effectAction")
    return isDeterministicDonAction(
      state,
      item,
      item.action,
      true,
      sourceIds(optionalSource).length === 2,
    );
  return item.kind === "effectBlock" && auditedDonBlock(state, item, optionalSource);
}

export function canAuditDon(state: MatchState, optionalSource?: string | string[]): boolean {
  if (
    state.battle ||
    state.donIdentities ||
    Object.keys(state.modifiers).length ||
    state.delayedEffectActions.length ||
    (!optionalSource &&
      (state.optionalLoopPlan ||
        state.optionalLoopEvidence?.length ||
        state.stoppedOptionalLoops?.length)) ||
    state.promptQueue.some((prompt) => prompt.status === "pending")
  )
    return false;
  // The fingerprint omits non-KO event history. No admitted condition or continuous effect may
  // read that history, and no replacement may execute instructions outside this queue audit.
  for (const card of Object.values(state.cards)) {
    if (!["leader", "character", "stage"].includes(card.zone)) continue;
    const effects = getCardForInstance(state, card.instanceId).effects;
    if (effects?.permanentEffects?.length || effects?.replacementEffects?.length) return false;
    for (const trigger of ["whenDonReturned", "whenDonGiven"] as const) {
      const blocks = effectBlocksForInstance(state, card.instanceId, trigger);
      if (optionalSource && !sourceIds(optionalSource).includes(card.instanceId) && blocks.length)
        return false;
      if (
        blocks.some(
          (_, blockIndex) =>
            !auditedDonBlock(
              state,
              {
                kind: "effectBlock",
                id: "don-audit",
                sourceInstanceId: card.instanceId,
                controller: card.controller,
                trigger,
                blockIndex,
              },
              optionalSource,
            ),
        )
      )
        return false;
    }
  }
  // Keep all queue payloads in the fingerprint, but do not cross a pending unaudited reaction.
  return [...(state.pendingAutoEffects ?? []), ...(state.readyEffectGroup?.effects ?? [])].every(
    (item) => auditedDonBlock(state, item, optionalSource),
  );
}

function sourceIds(value: string | string[] | undefined): string[] {
  return typeof value === "string" ? [value] : (value ?? []);
}

/** Preserve single-source saved boundaries from the earlier profile. */
export function donSourceIds(boundary: OptionalLoopBoundary | undefined): string[] {
  return boundary?.donSourceInstanceIds ?? sourceIds(boundary?.donSourceInstanceId);
}

export function optionalDonSources(state: MatchState, item: ResolutionItem): string[] | undefined {
  const sources = Object.values(state.cards).filter(
    (card) =>
      ["leader", "character", "stage"].includes(card.zone) &&
      effectBlocksForInstance(state, card.instanceId, "whenDonReturned").some(
        (block) => block.optional,
      ),
  );
  if (
    sources.length < 1 ||
    sources.length > 2 ||
    sources.some(
      (source) =>
        effectBlocksForInstance(state, source.instanceId, "whenDonReturned").filter(
          (block) => block.optional,
        ).length !== 1,
    )
  )
    return;
  if (
    sources.length === 2 &&
    (sources.some((source) => source.zone !== "leader") ||
      sources[0]!.controller === sources[1]!.controller)
  )
    return;
  const ids = sources
    .sort((a, b) => a.controller.localeCompare(b.controller))
    .map((source) => source.instanceId);
  if (canAuditDon(state, ids) && auditedDonTransition(state, item, ids)) return ids;
}
