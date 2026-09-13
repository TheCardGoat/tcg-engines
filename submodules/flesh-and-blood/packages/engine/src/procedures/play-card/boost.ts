import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabMatchState } from "../../state.ts";
import { appendFabEventGroup } from "../../kernel/event-journal.ts";
import type { FabRulesProcess } from "../../rules/process.ts";
import { compileFabContinuousEffect } from "../../rules/continuous/compiler.ts";
import { nextFabDestinationRef, snapshotObject } from "../../rules/snapshots.ts";
import type { FabEvaluatedObject } from "../../rules/rules-view.ts";

export function appendBoostEventGroups(
  process: FabRulesProcess,
  procedure: Extract<FabRulesProcess["procedure"], { readonly kind: "play-card" }>,
  preview: FabMatchState,
  currentObject: FabEvaluatedObject | null,
  currentSubtypes: readonly string[],
  resetOffset: number,
): void {
  if (!procedure.boost) return;
  const hasBoostKeyword =
    currentObject?.current.keywords.some((keyword) => keyword.name === "boost") ?? false;
  if (!hasBoostKeyword) return;
  const deck = preview.containers.zonesByPlayerId[procedure.actorId]!.deck ?? [];
  if (deck.length === 0) return;
  const topDeckId = deck[deck.length - 1]!;
  const banishedCard = snapshotObject(preview, topDeckId, procedure.actorId, "deck");
  // Mark the banished card as "from-boosting" so triggered abilities like
  // Fast and Furious (AIO009) can observe the boost banish (CR 8.3.9e).
  const boostBanished: typeof banishedCard = {
    ...banishedCard,
    markers: [...banishedCard.markers, { kind: "status", value: "from-boosting" }],
  };
  appendFabEventGroup(process, [
    {
      name: "banish",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [boostBanished],
      bindings: { boostBanished },
      data: {
        object: boostBanished,
        destinationRef: nextFabDestinationRef(preview, boostBanished, resetOffset),
        from: "deck",
        to: "banished",
        reason: "banish",
      },
    },
  ]);
  appendFabEventGroup(process, [
    {
      name: "boost",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [procedure.object],
      bindings: { boostBanished },
      data: {
        actorId: procedure.actorId,
        object: procedure.object,
        banished: banishedCard,
      },
    },
  ]);
  const isMechanologist = banishedCard.current.typeBox.supertypes.includes("Mechanologist");
  const isAttack = currentSubtypes.includes("Attack");
  if (!isMechanologist || !isAttack) return;
  const effect: FabEffect = {
    type: "grant-property",
    property: { kind: "keyword", keyword: { name: "go-again" } },
    target: { selector: "self" },
    duration: "this-combat-chain",
  };
  const effectId = `${process.processId}:boost:go-again`;
  const compiled = compileFabContinuousEffect({ effectId, effect });
  if (!compiled.ok) return;
  appendFabEventGroup(process, [
    {
      name: "continuous-effect-generated",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [procedure.object],
      bindings: {},
      data: {
        effectId,
        controllerId: procedure.actorId,
        source: procedure.object,
        origin: { kind: "layer" },
        effectPath: ["boost"],
        simultaneousGroupId: null,
        atoms: compiled.atoms,
        duration: "this-combat-chain",
        expiresAt: {
          kind: "combat-chain",
          combatNumber: (preview.combat?.chainLinkNumber ?? 0) + 1,
        },
        initialSubjects: [procedure.object.ref],
        futureApplicability: null,
      },
    },
  ]);
}
