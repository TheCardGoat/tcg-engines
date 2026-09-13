import type { FabActivatedAbility } from "@tcg/flesh-and-blood-types";
import { type FabMatchState } from "../../../state.ts";
import type { FabProcessId } from "../../../rules/events.ts";
import type { FabActivateProcedure } from "../../../rules/process.ts";
import { type FabEventTransactionOptions } from "../../../kernel/process-runner/index.ts";
import { snapshotObject } from "../../../rules/snapshots.ts";
import { evaluateCanonicalCondition } from "../../../rules/condition-evaluator.ts";
import { buildFabRulesView } from "../../../rules/state-rules-view.ts";
import { mutateInPlace } from "../../../copy-on-write.ts";
import { activationCosts, declaredActivationCost } from "../costs/parse.ts";
import {
  sourceZone,
  process,
  rejected,
  activationPaymentCandidates,
  asInstantActivationWaiver,
  effectiveActivationLimit,
  activationLimitUsageKey,
  activationLimitUsageCount,
  isEquipmentSeatName,
  activationSelfMoveZones,
  actorMayActivateAbility,
} from "../helpers.ts";
import type { FabActivationProcedureResult } from "../types.ts";
import { startFabRulesProcess } from "../../../kernel/process-state.ts";

import {
  evaluateActivationCostReduction,
  evaluateActivationCostIncrease,
  activationCostDelta,
  activationAlternativeArmPayable,
  selectActivatedAbility,
  applyActivationTargetScope,
} from "./quote.ts";
import { advanceFabActivationDeclarations } from "./declarations.ts";

export function beginFabActivationProcedure(
  current: FabMatchState,
  actorId: string,
  instanceId: string,
  abilityId: string | null,
  options: FabEventTransactionOptions,
  requestedAttackTargetId: string | null = null,
  alternativeCostIndex: number | null = null,
): FabActivationProcedureResult {
  const quote = buildFabRulesView(current).quoteActivation({
    actorId,
    instanceId,
    abilityId,
    attackTargetId: isEquipmentSeatName(requestedAttackTargetId) ? null : requestedAttackTargetId,
    equipToZone: isEquipmentSeatName(requestedAttackTargetId) ? requestedAttackTargetId : null,
    alternativeCostIndex,
  });
  if (!quote.handled) {
    return rejected(
      current,
      "This activated ability has not been migrated to the rules-event process.",
      "unsupported_rules_activation",
    );
  }
  if (!quote.allowed) {
    if (quote.reason === null || quote.reasonCode === null)
      throw new Error("A denied FAB activation quote must include a reason.");
    return rejected(current, quote.reason, quote.reasonCode);
  }
  if (current.rulesProcess || current.decision)
    return rejected(current, "Finish the current rules process first.", "rules_process_pending");
  const player = current.players[actorId];
  if (!player || current.priority?.holderPlayerId !== actorId)
    return rejected(
      current,
      "Only the player with priority may activate an ability.",
      "not_priority_player",
    );
  const zone = sourceZone(current, actorId, instanceId);
  if (!zone)
    return rejected(
      current,
      "The activation source is not in a legal zone.",
      "invalid_activation_source",
    );
  const objectRecord = current.objects[instanceId];
  if (!objectRecord)
    return rejected(current, "The activation source does not exist.", "invalid_activation_source");
  const executionView = buildFabRulesView(current);
  const abilities = executionView
    .functionalAbilities({
      instanceId: objectRecord.instanceId,
      incarnation: objectRecord.incarnation,
    })
    .filter((candidate): candidate is FabActivatedAbility => candidate.kind === "activated");
  const ability = applyActivationTargetScope(
    current,
    executionView,
    { instanceId: objectRecord.instanceId, incarnation: objectRecord.incarnation },
    actorId,
    selectActivatedAbility(abilities, abilityId),
  );
  if (!ability)
    return rejected(current, "This object has no activated ability.", "no_activated_ability");
  const evaluatedSource = executionView.object({
    instanceId: objectRecord.instanceId,
    incarnation: objectRecord.incarnation,
  });
  if (!actorMayActivateAbility(ability, actorId, evaluatedSource?.controllerId))
    return rejected(current, "Only the controller may activate this ability.", "not_controller");
  const selectedCost = declaredActivationCost(ability.cost, alternativeCostIndex, (arm) =>
    activationAlternativeArmPayable(
      current,
      { actorId, instanceId },
      executionView,
      evaluatedSource,
      arm,
    ),
  );
  const costs = selectedCost ? activationCosts(selectedCost) : null;
  if (!selectedCost || !costs)
    return rejected(
      current,
      "This activation cost is not supported by the rules-event process.",
      "unsupported_activation_cost",
    );
  // Apply dynamic cost reduction (e.g. Fai's chain-link discount).
  if (ability.costReduction) {
    costs.resources = Math.max(
      0,
      costs.resources -
        evaluateActivationCostReduction(
          executionView,
          actorId,
          { instanceId: objectRecord.instanceId, incarnation: objectRecord.incarnation },
          ability,
        ),
    );
  }
  // Apply dynamic cost increase (e.g. Grasp of the Arknight Runechant tax).
  if (ability.costIncrease) {
    costs.resources = Math.max(
      0,
      costs.resources +
        evaluateActivationCostIncrease(
          executionView,
          actorId,
          { instanceId: objectRecord.instanceId, incarnation: objectRecord.incarnation },
          ability,
        ),
    );
  }
  // Apply continuous-effect-driven cost modifications, matching quoteFabActivation.
  costs.resources = Math.max(
    0,
    costs.resources +
      activationCostDelta(
        current,
        executionView,
        {
          instanceId: objectRecord.instanceId,
          incarnation: objectRecord.incarnation,
        },
        actorId,
      ),
  );
  if ((costs.destroySelf || costs.banishSelf) && !activationSelfMoveZones(ability).includes(zone))
    return rejected(
      current,
      "The activation source cannot pay its self-move cost from this zone.",
      "unsupported_activation_source_zone",
    );
  if (costs.tapSelf) {
    if (!current.objects[instanceId])
      return rejected(
        current,
        "The activation source ceased to exist before its cost could be declared.",
        "invalid_activation_source",
      );
    if (current.objects[instanceId]?.markers.some((marker) => marker.kind === "tapped")) {
      return rejected(current, "The activation source is already tapped.", "already_tapped");
    }
  }
  const heroId = player.heroCardId;
  if (
    costs.tapHero &&
    (!heroId || current.objects[heroId]?.markers.some((marker) => marker.kind === "tapped"))
  ) {
    return rejected(
      current,
      heroId ? "The hero is already tapped." : "The activation requires a hero.",
      heroId ? "already_tapped" : "missing_hero",
    );
  }
  if (costs.discardSelf && zone !== "hand")
    return rejected(
      current,
      "The activation source cannot pay its discard cost from this zone.",
      "unsupported_activation_source_zone",
    );
  if (costs.selfMoveToDeck && (zone === "deck" || !current.players[objectRecord.ownerId])) {
    return rejected(
      current,
      "The activation source cannot be moved into its owner's deck from this zone.",
      "unpayable_self_move_to_deck",
    );
  }
  if (
    costs.turnFaceUpSelf &&
    !current.objects[instanceId]?.markers.some((marker) => marker.kind === "face-down")
  ) {
    return rejected(current, "The activation source is already face up.", "already_face_up");
  }
  for (const counterCost of costs.counterCosts) {
    if (
      counterCost.operation === "remove" &&
      (current.objects[instanceId]?.counters.find(
        (counter) => counter.kind === "named" && counter.name === counterCost.counter,
      )?.count ?? 0) < counterCost.amount
    ) {
      return rejected(
        current,
        "The activation source lacks the required counters.",
        "insufficient_counters",
      );
    }
  }
  // Variable X: need at least 1 of the named counter to choose a positive X.
  if (costs.xCounterCost?.operation === "remove") {
    const available =
      current.objects[instanceId]?.counters.find(
        (counter) => counter.kind === "named" && counter.name === costs.xCounterCost!.counter,
      )?.count ?? 0;
    if (available < 1) {
      return rejected(
        current,
        "The activation source lacks counters for a variable X cost.",
        "insufficient_counters",
      );
    }
  }
  const isAttack = ability.abilityType === "attack" || ability.effect.type === "attack-with";
  // CR 8.1.1d as-though-instant waiver (Snap Shot ELE041-043, fused): while an
  // allow/activate rule carrying the activate-additional-as-instant marker is
  // live for this object, its action/attack abilities may be activated any
  // time the player has priority — stack open, combat steps, off-turn — and
  // "does not cost an action point" (mirrors the quoteFabActivation gate).
  const instantWaiver = asInstantActivationWaiver(
    executionView,
    actorId,
    executionView.object({
      instanceId: objectRecord.instanceId,
      incarnation: objectRecord.incarnation,
    }),
  );
  const actionPoints =
    ((ability.abilityType === "action" || isAttack) && !instantWaiver ? 1 : 0) + costs.actionPoints;
  if (
    (ability.abilityType === "action" || isAttack) &&
    !instantWaiver &&
    (current.phase !== "action" ||
      current.activePlayerId !== actorId ||
      current.rulesStack.length > 0 ||
      // CR 7.0.1a / 7.6.3a: Resolution permits attacks and attack-layers,
      // not arbitrary action abilities. Keep execution aligned with the
      // legality quote so a stale or forged activation is rejected too.
      (current.combat?.open && (current.combat.step !== "resolution" || !isAttack)))
  )
    return rejected(
      current,
      "The action ability is not legal in the current layer position.",
      "illegal_activation_timing",
    );
  if (
    ability.abilityType === "attack-reaction" &&
    (current.phase !== "action" ||
      current.combat?.step !== "reaction" ||
      current.combat.activeLink?.attackingPlayerId !== actorId)
  )
    return rejected(
      current,
      "The attack-reaction ability is not legal now.",
      "illegal_activation_timing",
    );
  if (
    ability.abilityType === "defense-reaction" &&
    (current.phase !== "action" ||
      current.combat?.step !== "reaction" ||
      current.combat.activeLink?.defendingPlayerId !== actorId)
  )
    return rejected(
      current,
      "The defense-reaction ability is not legal now.",
      "illegal_activation_timing",
    );
  if (player.actionPoints < actionPoints)
    return rejected(
      current,
      "The activation action-point cost cannot be paid.",
      "insufficient_action_points",
    );
  if (player.life <= costs.life)
    return rejected(
      current,
      "The activation asset cost cannot be paid.",
      "insufficient_activation_assets",
    );
  const maximumResources =
    player.resourcePoints +
    activationPaymentCandidates(
      current,
      actorId,
      costs.selfMoveToDeck || costs.discardSelf ? [instanceId] : [],
      "resources",
    ).reduce((total, candidate) => total + candidate.value, 0);
  if (maximumResources < costs.resources) {
    return rejected(
      current,
      "The activation resource cost cannot be paid.",
      "insufficient_activation_assets",
    );
  }
  const maximumChi =
    player.chiPoints +
    activationPaymentCandidates(
      current,
      actorId,
      costs.selfMoveToDeck || costs.discardSelf ? [instanceId] : [],
      "chi",
    ).reduce((total, candidate) => total + candidate.value, 0);
  if (maximumChi < costs.chi) {
    return rejected(
      current,
      "The activation chi cost cannot be paid.",
      "insufficient_activation_assets",
    );
  }

  const state = mutateInPlace(current, (draft) => {
    draft.stateID += 1;
    draft.counters.process += 1;
  });
  const processId: FabProcessId = `process-${state.counters.process}`;
  const object = snapshotObject(state, instanceId, actorId, zone);
  if (
    ability.condition &&
    !evaluateCanonicalCondition(
      state,
      ability.condition,
      { controllerId: actorId, source: object },
      null,
    )
  ) {
    return rejected(
      current,
      "The activation condition is not satisfied.",
      "activation_condition_failed",
    );
  }
  const effectiveLimit = effectiveActivationLimit({
    state,
    actorId,
    instanceId,
    incarnation: objectRecord.incarnation,
    ability,
  });
  if (effectiveLimit !== null) {
    const limitKey = activationLimitUsageKey({
      state,
      actorId,
      instanceId,
      incarnation: objectRecord.incarnation,
      ability,
    });
    if (limitKey === null)
      return rejected(current, "The activation limit has no usage scope.", "activation_limit");
    if (
      activationLimitUsageCount({
        state,
        actorId,
        instanceId,
        incarnation: objectRecord.incarnation,
        ability,
      }) >= effectiveLimit
    ) {
      return rejected(
        current,
        "The activated ability limit has already been reached.",
        "activation_limit",
      );
    }
  }
  const attackTarget = isAttack ? quote.attackTarget : null;
  if (isAttack && !attackTarget)
    return rejected(
      current,
      "The attack ability requires a legal attack target.",
      "illegal_target",
    );
  const procedure: FabActivateProcedure = {
    kind: "activate",
    actorId,
    object,
    abilityId: ability.id,
    cost: selectedCost,
    attackTarget,
    stage: "targets",
    eventGroups: [],
    declaredTargets: {},
    equipDestination: isEquipmentSeatName(requestedAttackTargetId) ? requestedAttackTargetId : null,
    pitchedInstanceIds: [],
    resourceCost: costs.resources,
    chiCost: costs.chi,
    lifeCost: costs.life,
    actionPointCost: actionPoints,
    destroySelf: costs.destroySelf,
    banishSelf: costs.banishSelf,
    tapSelf: costs.tapSelf,
    tapHero: costs.tapHero === true,
    discardSelf: costs.discardSelf,
    turnFaceUpSelf: costs.turnFaceUpSelf,
    turnFaceUpTargets: costs.turnFaceUpTargets,
    turnFaceDownTargets: costs.turnFaceDownTargets,
    discardTargets: costs.discardTargets,
    banishTargets: costs.banishTargets,
    destroyTargets: costs.destroyTargets,
    tapTargets: costs.tapTargets,
    untapTargets: costs.untapTargets,
    chargeTargets: costs.chargeTargets,
    moveToDeckTargets: costs.moveToDeckTargets,
    selfMoveToDeck: costs.selfMoveToDeck,
    revealTargets: costs.revealTargets,
    removeCounterTargets: costs.removeCounterTargets,
    xCounterCost: costs.xCounterCost,
    xResourceCost: costs.xResourceCost,
    xBanishCost: costs.xBanishCost,
    chosenX: null,
    counterCosts: [...costs.counterCosts],
    createTokenCosts: costs.createTokenCosts,
    costBindings: costs.turnFaceUpSelfBinding ? { [costs.turnFaceUpSelfBinding]: object } : {},
  };
  startFabRulesProcess(state, process(processId, procedure));
  return advanceFabActivationDeclarations(state, options);
}
