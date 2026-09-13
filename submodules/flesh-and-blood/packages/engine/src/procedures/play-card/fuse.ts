import type { FabMatchState } from "../../state.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import { basePropertiesOf } from "../../cards.ts";
import { appendFabEventGroup } from "../../kernel/event-journal.ts";
import type { FabObjectRef } from "../../rules/continuous/ir.ts";
import type { FabObjectSnapshot } from "../../rules/events.ts";
import type { FabRulesProcess } from "../../rules/process.ts";
import { snapshotObject } from "../../rules/snapshots.ts";
import type { FabEvaluatedObject } from "../../rules/rules-view.ts";

export type FabFusionDeclarationValidation =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

/**
 * CR 8.3.17: a fusion declaration reveals hand cards matching the printed
 * elemental requirement. It is an all-or-nothing additional cost, so reject
 * it before the play procedure creates any journal entries.
 */
export function validateFusionDeclaration(
  state: FabRulesSnapshot,
  actorId: string,
  object: FabObjectRef,
  fuseInstanceIds: readonly string[],
): FabFusionDeclarationValidation {
  if (fuseInstanceIds.length === 0) return { valid: true };
  const playedRecord = state.objects[object.instanceId];
  const playedDefinition = playedRecord
    ? state.cardDefinitions[playedRecord.canonicalId]
    : undefined;
  const fusion =
    playedRecord && playedDefinition
      ? basePropertiesOf(playedDefinition, playedRecord.cardPropertyState).keywords.find(
          (keyword): keyword is Extract<typeof keyword, { name: "fusion" }> =>
            keyword.name === "fusion",
        )
      : undefined;
  if (!fusion) return { valid: false, reason: "This card cannot be fused." };
  if (new Set(fuseInstanceIds).size !== fuseInstanceIds.length)
    return { valid: false, reason: "A card cannot be revealed more than once to fuse." };
  const hand = state.containers.zonesByPlayerId[actorId]?.hand ?? [];
  if (
    fuseInstanceIds.some(
      (instanceId) => instanceId === object.instanceId || !hand.includes(instanceId),
    )
  )
    return { valid: false, reason: "Fusion cards must be other cards from your hand." };

  const matchCounts = new Map(fusion.supertypes.map((supertype) => [supertype, 0]));
  for (const instanceId of fuseInstanceIds) {
    const record = state.objects[instanceId];
    const definition = record ? state.cardDefinitions[record.canonicalId] : undefined;
    if (!record || !definition) return { valid: false, reason: "A fusion card is unavailable." };
    const revealedSupertypes = new Set<string>(
      basePropertiesOf(definition, record.cardPropertyState).typeBox.supertypes,
    );
    const matches = fusion.supertypes.filter((supertype) => revealedSupertypes.has(supertype));
    if (matches.length === 0)
      return { valid: false, reason: "Each revealed card must match a fusion element." };
    for (const supertype of matches) {
      const count = (matchCounts.get(supertype) ?? 0) + 1;
      if (count > 1)
        return { valid: false, reason: "Only one revealed card may satisfy each fusion element." };
      matchCounts.set(supertype, count);
    }
  }
  const matchedElements = [...matchCounts.values()].filter((count) => count === 1).length;
  const required = fusion.mode === "and" ? fusion.supertypes.length : 1;
  if (matchedElements < required)
    return {
      valid: false,
      reason: "The revealed cards do not satisfy this card's fusion requirement.",
    };
  return { valid: true };
}

export function appendFuseEventGroups(
  process: FabRulesProcess,
  procedure: Extract<FabRulesProcess["procedure"], { readonly kind: "play-card" }>,
  preview: FabMatchState,
  currentObject: FabEvaluatedObject | null,
): void {
  if (procedure.fuseInstanceIds.length === 0) return;
  const hasFusionKeyword =
    currentObject?.current.keywords.some((keyword) => keyword.name === "fusion") ?? false;
  if (!hasFusionKeyword) return;
  const revealed: FabObjectSnapshot[] = [];
  for (const instanceId of procedure.fuseInstanceIds) {
    if (!preview.containers.zonesByPlayerId[procedure.actorId]!.hand.includes(instanceId)) continue;
    revealed.push(snapshotObject(preview, instanceId, procedure.actorId, "hand"));
  }
  if (revealed.length === 0) return;
  // Also emit reveal events so Korshem-style reveal subscribers observe the fuse reveal.
  for (const card of revealed) {
    appendFabEventGroup(process, [
      {
        name: "reveal",
        processId: process.processId,
        cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
        controllerId: procedure.actorId,
        source: procedure.object,
        affected: [card],
        bindings: { revealedCard: card },
        data: { playerId: procedure.actorId, object: card },
      },
    ]);
  }
  appendFabEventGroup(process, [
    {
      name: "fuse",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [procedure.object, ...revealed],
      bindings: {
        fused: procedure.object,
        "fused-this-way": revealed,
        ...fusedTalentBindings(revealed),
      },
      data: {
        actorId: procedure.actorId,
        object: procedure.object,
        revealed,
      },
    },
  ]);
}

/** Stamp which fusion elements the revealed cards satisfied (CR 8.3.17). */
export function fusedTalentBindings(
  revealed: readonly FabObjectSnapshot[],
): Record<string, string> {
  const bindings: Record<string, string> = {};
  for (const card of revealed) {
    const identity = [
      ...card.current.typeBox.supertypes,
      ...card.current.typeBox.types,
      ...card.current.typeBox.subtypes,
    ];
    if (identity.includes("Earth")) bindings["fused-with-earth-card"] = "true";
    if (identity.includes("Ice")) bindings["fused-with-ice-card"] = "true";
    if (identity.includes("Lightning")) bindings["fused-with-lightning-card"] = "true";
  }
  return bindings;
}
