import type { FabAttackTarget, FabMatchState } from "../../state.ts";
import type { FabSplitPlayMethod } from "../../cards.ts";
import { createPlayProcedure } from "../../kernel/event-journal.ts";
import type { FabObjectSnapshot, FabProcessId } from "../../rules/events.ts";
import type { FabRulesProcess } from "../../rules/process.ts";
import { snapshotObject } from "../../rules/snapshots.ts";
import { buildFabRulesView } from "../../rules/state-rules-view.ts";
import type { FabPlayTiming } from "../../rules/legality-quotes.ts";

export function createProcedureProcess(
  processId: FabProcessId,
  actorId: string,
  object: FabObjectSnapshot,
  from: "hand" | "arsenal" | "banished" | "deck" | "graveyard",
  resourceCost: number,
  actionPointCost: number,
  playTiming: FabPlayTiming,
  attackTarget: FabAttackTarget | null,
  boost: boolean,
  scrap: boolean,
  scrapInstanceId: string | null,
  beatChest: boolean,
  beatChestInstanceId: string | null,
  crank: boolean,
  splitPlayMethod: FabSplitPlayMethod | null,
  fuseInstanceIds: readonly string[] = [],
  chargeInstanceId: string | null = null,
  additionalAttackTargets: readonly FabAttackTarget[] = [],
  banishCostInstanceId: string | null = null,
  playPermissionId = "base",
): FabRulesProcess {
  return {
    processId,
    stage: "procedure",
    pendingEvents: [],
    futureSubjectEvents: [],
    replacementCandidates: [],
    replacementChoiceResolved: false,
    replacementChoicePlayerIds: [],
    selectedOptionalReplacementIds: [],
    orderedReplacementIds: [],
    appliedReplacementIds: [],
    cancelledContinuousApplicationKeys: [],
    pendingTriggers: [],
    orderedTriggerIds: [],
    triggerPlayerOrder: [],
    orderedTriggerControllers: [],
    stateTriggersOnStack: [],
    resolvingLayerId: null,
    effectChoices: {},
    effectPartitions: {},
    effectOptions: {},
    effectTargets: {},
    iterationCount: 0,
    journalReplacementOrders: {},
    journalReplacementChoices: {},
    journalReplacementChoicePlayerIds: {},
    resolutionEventGroups: [],
    procedure: createPlayProcedure({
      kind: "play-card",
      actorId,
      object,
      from,
      playPermissionId,
      stage: "announce",
      declaredModes: [],
      modesDeclared: false,
      declaredTargets: {},
      chosenX: null,
      effectCostTargetIds: [],
      costBindings: {},
      attackTarget,
      additionalAttackTargets,
      pitchedInstanceIds: [],
      effectCostPaid: false,
      resourceCost,
      actionPointCost,
      playTiming,
      boost,
      scrap,
      scrapInstanceId,
      beatChest,
      beatChestInstanceId,
      crank,
      splitPlayMethod,
      fuseInstanceIds,
      chargeInstanceId,
      banishCostInstanceId,
    }),
  };
}

/**
 * CR 8.3.30 Transcend: when a card with transcend is played, emit a
 * `transcend` observation so equipment like Twelve-Petal K-Ya can grant { r }.
 */

/**
 * CR 8.3.17 Fusion: optional additional cost — reveal one or more cards from
 * hand matching the fusion element. Emits a `fuse` observation event with the
 * revealed snapshots so Ice-fuse subscribers (Insidious Chill) can match.
 */

/**
 * CR 8.3.9 Boost: optional additional cost — banish the top card of the deck.
 * If the banished card is a Mechanologist card and the played card is an
 * attack, grant go again via a continuous effect for this combat chain.
 */

export function attackTargetSnapshot(
  state: FabMatchState,
  target: FabAttackTarget,
): FabObjectSnapshot | { readonly kind: "hero"; readonly playerId: string } | null {
  if (target.kind === "hero") return target;
  const zone = state.containers.zonesByPlayerId[target.controllerId]?.arena.includes(
    target.ref.instanceId,
  )
    ? "arena"
    : null;
  const object = state.objects[target.ref.instanceId];
  return zone && object?.incarnation === target.ref.incarnation
    ? snapshotObject(state, target.ref.instanceId, target.controllerId, zone)
    : null;
}

export function paymentCandidates(
  state: FabMatchState,
  actorId: string,
  playedInstanceId: string,
  alreadyPitched: readonly string[],
): { instanceId: string; value: number }[] {
  const view = buildFabRulesView(state);
  return state.containers.zonesByPlayerId[actorId]!.hand.flatMap((instanceId) => {
    const object = state.objects[instanceId];
    const evaluated = object
      ? view.object({ instanceId: object.instanceId, incarnation: object.incarnation })
      : null;
    const value = evaluated?.current.numeric.pitch ?? 0;
    return instanceId !== playedInstanceId && !alreadyPitched.includes(instanceId) && value > 0
      ? [{ instanceId, value }]
      : [];
  });
}
