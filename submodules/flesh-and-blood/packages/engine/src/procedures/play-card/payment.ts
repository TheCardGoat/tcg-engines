import type { FabMatchState } from "../../state.ts";
import { appendFabEventGroup, reduceFabEventJournal } from "../../kernel/event-journal.ts";
import type { FabDecisionAnswer, FabDecisionContinuation } from "../../rules/process.ts";
import {
  reconcileFabContinuousEffectsForPreview,
  type FabEventTransactionOptions,
} from "../../kernel/process-runner/index.ts";
import { nextFabDestinationRef, snapshotObject } from "../../rules/snapshots.ts";
import { buildFabRulesView, matchesFabSnapshotFilter } from "../../rules/state-rules-view.ts";
import type { FabObjectSnapshot } from "../../rules/events.ts";
import type { FabPlayProcedureResult } from "./types.ts";
import { advanced, failure, reversePlay } from "./types.ts";

import { compileFabContinuousEffect } from "../../rules/continuous/compiler.ts";
import { resolveContinuousExpiry } from "../../rules/proposals/shared.ts";
import { finalizePlay } from "./finalize.ts";
import { paymentCandidates } from "./helpers.ts";
import { createFabPaymentDecision } from "../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../kernel/decision-state.ts";
import {
  USURP_COST_ID,
  boundedMixedPlayCostParts,
  boundedMixedCostCandidates,
  banishPlayCostCount,
  isAllBanishHandPlayCost,
  isAnyNumberBanishHandPlayCost,
  isChargePlayCost,
  isMixedAlternativePlayCost,
  isMoveToDeckPlayCost,
  moveToDeckPlayCostFrom,
  isNamedDiscardHandPlayCost,
  isOptionalBanishGraveyardPlayCost,
  isOptionalBanishHandPlayCost,
  isRequiredBanishHandPlayCost,
  isPlayCostDeclared,
  isRandomBanishHandPlayCost,
  isRandomDiscardHandPlayCost,
  isRemoveCountersPlayCost,
  isRequiredBanishGraveyardPlayCost,
  isRevealHandPlayCost,
  isSoulBanishPlayCost,
  moveToDeckCostCandidates,
  namedDiscardPlayCostCount,
  numericCounterCountOnObject,
  playCostFilter,
  playCostSpecs,
  playCostThenApplied,
  PLAY_COST_THEN_APPLIED_KEY,
  snapshotPlayCostObject,
  thenBenefitEffects,
  isVariableTapPlayCost,
  destroyPlayCostCandidates,
  variableTapCostCandidates,
  zonePlayCostCandidates,
} from "./effect-costs.ts";

export function resumeFabPlayPayment(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "payment" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "payment" }>,
  options: FabEventTransactionOptions,
): FabPlayProcedureResult {
  const process = state.rulesProcess;
  const procedure = process?.procedure;
  if (!process || process.processId !== continuation.processId || procedure?.kind !== "play-card") {
    return failure(
      state,
      "The persisted FAB play procedure no longer exists.",
      "stale_play_process",
    );
  }
  if (continuation.procedure !== "play")
    return failure(
      state,
      "The FAB payment does not belong to a play procedure.",
      "invalid_play_payment",
    );
  if (continuation.cost !== "asset" || answer.instanceIds.length !== 1) {
    return failure(
      state,
      "FAB resource payment must pitch exactly one card at a time.",
      "invalid_play_payment",
    );
  }
  const instanceId = answer.instanceIds[0]!;
  if (
    procedure.pitchedInstanceIds.includes(instanceId) ||
    instanceId === procedure.object.instanceId
  ) {
    return failure(state, "That FAB payment card has already been used.", "invalid_play_payment");
  }
  const preview = reduceFabEventJournal(state, procedure.eventGroups);
  if (!preview.committed)
    return failure(state, "The tentative play journal cannot be reduced.", "invalid_play_journal");
  const paymentState = preview.state;
  if (!paymentState.containers.zonesByPlayerId[procedure.actorId]!.hand.includes(instanceId))
    return failure(state, "The FAB payment card is no longer in hand.", "invalid_play_payment");
  const objectRecord = paymentState.objects[instanceId];
  const evaluated = objectRecord
    ? buildFabRulesView(paymentState).object({
        instanceId: objectRecord.instanceId,
        incarnation: objectRecord.incarnation,
      })
    : null;
  const generated = evaluated?.current.numeric.pitch ?? 0;
  if (generated <= 0) {
    return failure(
      state,
      "That card cannot generate resources for this payment.",
      "invalid_play_payment",
    );
  }
  const isChi = evaluated?.current.typeBox.subtypes.includes("Chi") ?? false;
  const object = snapshotObject(paymentState, instanceId, procedure.actorId, "hand");
  appendFabEventGroup(process, [
    {
      name: "pitch",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "payment-pitch" },
      controllerId: procedure.actorId,
      source: object,
      affected: [object],
      bindings: { pitchedCard: object },
      data: {
        playerId: procedure.actorId,
        object,
        destinationRef: nextFabDestinationRef(paymentState, object),
        resourcesGenerated: isChi ? 0 : generated,
        chiGenerated: isChi ? generated : 0,
      },
    },
  ]);
  procedure.pitchedInstanceIds.push(instanceId);
  return advancePlayAssetPayment(state, options);
}

export function advancePlayAssetPayment(
  state: FabMatchState,
  options: FabEventTransactionOptions,
): FabPlayProcedureResult {
  const process = state.rulesProcess;
  const procedure = process?.procedure;
  if (!process || procedure?.kind !== "play-card")
    return failure(state, "The play procedure is missing.", "stale_play_process");
  const preview = reduceFabEventJournal(state, procedure.eventGroups);
  if (!preview.committed)
    return failure(state, "The tentative play journal cannot be reduced.", "invalid_play_journal");
  const previewState = reconcileFabContinuousEffectsForPreview(
    preview.state,
    process.processId,
    options,
  );
  const previewView = buildFabRulesView(previewState);
  const announced = procedure.object;
  const playPermission = previewView
    .rules("play")
    .find(
      (rule) =>
        `${rule.effectId}#${rule.atomId}` === procedure.playPermissionId &&
        rule.mode === "allow" &&
        rule.scope.kind === "objects" &&
        rule.scope.subjects.some(
          (ref) =>
            ref.instanceId === announced.ref.instanceId &&
            ref.incarnation === announced.ref.incarnation,
        ),
    );
  const permissionCost =
    playPermission?.parameters.kind === "play-card"
      ? playPermission.parameters.costModification
      : null;
  const evaluatedCost = announced.current.numeric.cost ?? 0;
  // CR 8.3.38b is part of the declared method, not a transient quote-only
  // modifier. Reconciliation must retain the doubled starting asset-cost.
  const declaredAssetCost =
    procedure.splitPlayMethod?.kind === "meld" ? evaluatedCost * 2 : evaluatedCost;
  const selectedEffectId =
    procedure.playPermissionId === "base" || !procedure.playPermissionId.includes("#")
      ? null
      : procedure.playPermissionId.slice(0, procedure.playPermissionId.lastIndexOf("#"));
  const futureApplicatorLatched =
    selectedEffectId !== null &&
    preview.batches.some((batch) =>
      batch.events.some(
        (event) =>
          event.name === "continuous-effect-future-object-observed" &&
          event.data.effectId === selectedEffectId &&
          event.data.latched &&
          event.data.subject.instanceId === announced.ref.instanceId &&
          event.data.subject.incarnation === announced.ref.incarnation,
      ),
    );
  if (futureApplicatorLatched || playPermission) {
    procedure.resourceCost =
      permissionCost === "free"
        ? 0
        : permissionCost !== null &&
            "reduce" in permissionCost &&
            typeof permissionCost.reduce === "number"
          ? Math.max(0, declaredAssetCost - permissionCost.reduce)
          : permissionCost !== null &&
              "increase" in permissionCost &&
              typeof permissionCost.increase === "number"
            ? Math.max(0, declaredAssetCost + permissionCost.increase)
            : Math.max(0, declaredAssetCost);
  }
  const player = previewState.players[procedure.actorId]!;
  const maximumResources =
    player.chiPoints +
    player.resourcePoints +
    paymentCandidates(
      previewState,
      procedure.actorId,
      procedure.object.instanceId,
      procedure.pitchedInstanceIds,
    ).reduce((total, candidate) => total + candidate.value, 0);
  if (maximumResources < procedure.resourceCost) {
    return reversePlay(state, process.processId, procedure.actorId, {
      code: "required_cost_unpayable",
      message: "The resource cost cannot be paid.",
    });
  }
  if (player.actionPoints < procedure.actionPointCost)
    return reversePlay(state, process.processId, procedure.actorId, {
      code: "required_cost_unpayable",
      message: "The action-point cost cannot be paid.",
    });
  const remaining = Math.max(0, procedure.resourceCost - player.chiPoints - player.resourcePoints);
  if (remaining > 0) {
    const candidates = paymentCandidates(
      state,
      procedure.actorId,
      procedure.object.instanceId,
      procedure.pitchedInstanceIds,
    );
    if (candidates.length === 0)
      return reversePlay(state, process.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "The resource cost cannot be paid.",
      });
    publishFabDecision(
      state,
      createFabPaymentDecision(state, {
        actorId: procedure.actorId,
        label: `Pitch a card to pay ${remaining} remaining ${remaining === 1 ? "resource" : "resources"} for ${procedure.object.current.names.join(" // ") || procedure.object.instanceId}.`,
        amount: remaining,
        oneAtATime: true,
        cancellable: true,
        candidates,
        continuation: {
          kind: "payment",
          processId: process.processId,
          cost: "asset",
          procedure: "play",
        },
      }),
    );
    return advanced(state);
  }
  return advancePlayEffectPayment(state, previewState, options);
}

export function advancePlayEffectPayment(
  state: FabMatchState,
  preview: FabMatchState,
  options: FabEventTransactionOptions,
): FabPlayProcedureResult {
  const process = state.rulesProcess!;
  const procedure = process.procedure!;
  if (procedure.kind !== "play-card")
    return failure(state, "The play procedure changed kind.", "stale_play_process");
  if (procedure.effectCostPaid) return finalizePlay(state, preview, options);
  const payable = playCostSpecs(procedure.object).filter((spec) => {
    if (
      isChargePlayCost(spec.cost) ||
      isOptionalBanishGraveyardPlayCost(spec.cost, spec.optional)
    ) {
      return false;
    }
    if (spec.cost.class === "asset") return false;
    if (spec.optional || spec.role === "alternative-cost") {
      return isPlayCostDeclared(procedure.costBindings, spec.abilityId) === true;
    }
    return true;
  });
  let resetOffset = 0;
  for (const spec of payable) {
    const cost = spec.cost;
    const mixedParts = boundedMixedPlayCostParts(cost);
    if (mixedParts) {
      for (const [index, part] of mixedParts.entries()) {
        const selected = procedure.costBindings[`mixed-cost-part:${index}`];
        if (!Array.isArray(selected))
          return failure(state, "Mixed cost component is undeclared.", "invalid_play_cost_targets");
        const candidates = boundedMixedCostCandidates(
          preview,
          procedure.actorId,
          procedure.object.instanceId,
          part,
        );
        const paid = candidates.filter((candidate) =>
          selected.some(
            (entry) =>
              entry.instanceId === candidate.instanceId &&
              entry.ref.incarnation === candidate.ref.incarnation,
          ),
        );
        if (paid.length !== selected.length || paid.length > part.maximum)
          return reversePlay(state, process.processId, procedure.actorId, {
            code: "required_cost_unpayable",
            message: "The mixed additional cost can no longer be paid.",
          });
        for (const object of paid) {
          const base = {
            processId: process.processId,
            cause: {
              kind: "player-command" as const,
              actorId: procedure.actorId,
              command: "play-effect-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [object],
            bindings: procedure.costBindings,
          };
          appendFabEventGroup(process, [
            part.type === "discard"
              ? {
                  ...base,
                  name: "discard",
                  data: {
                    playerId: procedure.actorId,
                    object,
                    destinationRef: nextFabDestinationRef(preview, object, resetOffset++),
                    random: false,
                  },
                }
              : {
                  ...base,
                  name: "destroy",
                  data: {
                    object,
                    destinationRef:
                      object.objectKind === "created-token"
                        ? null
                        : nextFabDestinationRef(preview, object, resetOffset++),
                    from: object.zone,
                    to: "graveyard",
                    reason: "destroy",
                  },
                },
          ]);
        }
      }
      continue;
    }
    if (isMixedAlternativePlayCost(cost)) {
      const targetId = procedure.effectCostTargetIds[0];
      const object = targetId ? snapshotPlayCostObject(preview, procedure.actorId, targetId) : null;
      if (!object) {
        return reversePlay(state, process.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The alternative cost cannot be paid.",
        });
      }
      procedure.costBindings = {
        ...procedure.costBindings,
        paidCost: object,
        it: object,
        "alternative-cost-paid": true,
      };
      if (object.zone === "hand") {
        appendFabEventGroup(process, [
          {
            name: "discard",
            processId: process.processId,
            cause: {
              kind: "player-command",
              actorId: procedure.actorId,
              command: "play-effect-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [object],
            bindings: { ...procedure.costBindings, discardedCard: object },
            data: {
              playerId: procedure.actorId,
              object,
              destinationRef: nextFabDestinationRef(preview, object, resetOffset++),
              random: false,
            },
          },
        ]);
      } else {
        appendFabEventGroup(process, [
          {
            name: "destroy",
            processId: process.processId,
            cause: {
              kind: "player-command",
              actorId: procedure.actorId,
              command: "play-effect-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [object],
            bindings: procedure.costBindings,
            data: {
              object,
              destinationRef:
                object.objectKind === "created-token"
                  ? null
                  : nextFabDestinationRef(preview, object, resetOffset++),
              from: object.zone,
              to: "graveyard",
              reason: "destroy",
            },
          },
        ]);
      }
      continue;
    }
    if (cost.class !== "effect")
      return failure(state, "This effect cost is not yet canonical.", "unsupported_effect_cost");
    if (isVariableTapPlayCost(cost) || (cost.class === "effect" && cost.type === "tap")) {
      const filter = cost.filter;
      const candidates = new Map(
        variableTapCostCandidates(preview, procedure.actorId, filter).map(
          (object) => [object.instanceId, object] as const,
        ),
      );
      const targets = procedure.effectCostTargetIds.flatMap((instanceId) => {
        const target = candidates.get(instanceId);
        return target ? [target] : [];
      });
      if (targets.length !== procedure.effectCostTargetIds.length)
        return reversePlay(state, process.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "A declared tap-cost object is no longer legal.",
        });
      procedure.costBindings = {
        ...procedure.costBindings,
        x: targets.length,
        paidCost: targets,
      };
      if (targets.length > 0) {
        appendFabEventGroup(
          process,
          targets.map((target) => ({
            name: "set-tapped" as const,
            processId: process.processId,
            cause: {
              kind: "player-command" as const,
              actorId: procedure.actorId,
              command: "play-effect-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [target],
            bindings: procedure.costBindings,
            data: { object: target, tapped: true },
          })),
        );
      }
      continue;
    }
    if (cost.type === "destroy") {
      const candidates = new Map(
        destroyPlayCostCandidates(preview, procedure.actorId, spec).map(
          (object) => [object.instanceId, object] as const,
        ),
      );
      const targets = procedure.effectCostTargetIds.flatMap((instanceId) => {
        const target = candidates.get(instanceId);
        return target ? [target] : [];
      });
      if (targets.length !== procedure.effectCostTargetIds.length)
        return reversePlay(state, process.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "A declared destroy-cost object is no longer legal.",
        });
      procedure.costBindings = {
        ...procedure.costBindings,
        x: targets.length,
        "destroyed-this-way": targets,
        "destroyed-this-way-count": targets.length,
        paidCost: targets,
      };
      if (targets.length > 0 && spec.abilityId === USURP_COST_ID) {
        appendFabEventGroup(
          process,
          targets.map((target) => ({
            name: "usurp" as const,
            processId: process.processId,
            cause: {
              kind: "player-command" as const,
              actorId: procedure.actorId,
              command: "play-effect-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [target],
            bindings: { usurped: target, attack: procedure.object },
            data: { actorId: procedure.actorId, object: target, attack: procedure.object },
          })),
        );
      }
      if (targets.length > 0) {
        appendFabEventGroup(
          process,
          targets.map((target) => ({
            name: "destroy" as const,
            processId: process.processId,
            cause: {
              kind: "player-command" as const,
              actorId: procedure.actorId,
              command: "play-effect-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [target],
            bindings: {
              ...procedure.costBindings,
              ...(spec.abilityId === USURP_COST_ID ? { usurpCost: true } : {}),
            },
            data: {
              object: target,
              destinationRef:
                target.objectKind === "created-token"
                  ? null
                  : nextFabDestinationRef(preview, target, resetOffset++),
              from: target.zone,
              to: "graveyard" as const,
              reason: "destroy" as const,
            },
          })),
        );
      }
      continue;
    }
    if (isMoveToDeckPlayCost(cost)) {
      const filter = cost.filter;
      const candidates = new Map(
        moveToDeckCostCandidates(
          preview,
          procedure.actorId,
          procedure.object.instanceId,
          filter,
          moveToDeckPlayCostFrom(cost),
        ).map((object) => [object.instanceId, object] as const),
      );
      const targets = procedure.effectCostTargetIds.flatMap((instanceId) => {
        const target = candidates.get(instanceId);
        return target ? [target] : [];
      });
      if (targets.length !== 1)
        return reversePlay(state, process.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The move-to-deck additional cost was not fully declared.",
        });
      const [object] = targets;
      procedure.costBindings = { ...procedure.costBindings, paidCost: object };
      appendFabEventGroup(process, [
        {
          name: "move-zone",
          processId: process.processId,
          cause: {
            kind: "player-command",
            actorId: procedure.actorId,
            command: "play-effect-cost",
          },
          controllerId: procedure.actorId,
          source: procedure.object,
          affected: [object],
          bindings: procedure.costBindings,
          data: {
            object,
            destinationRef: nextFabDestinationRef(preview, object, resetOffset++),
            from: object.zone,
            to: "deck",
            reason: "move",
            destinationPlayerId: object.ownerId,
            position:
              cost.position === "top" || cost.position === "bottom" ? cost.position : "bottom",
          },
        },
      ]);
      continue;
    }
    if (
      isRandomBanishHandPlayCost(cost) ||
      isRequiredBanishGraveyardPlayCost(cost, spec.optional) ||
      isOptionalBanishHandPlayCost(cost, spec.optional) ||
      isRequiredBanishHandPlayCost(cost, spec.optional) ||
      isAnyNumberBanishHandPlayCost(cost) ||
      isAllBanishHandPlayCost(cost) ||
      isSoulBanishPlayCost(cost)
    ) {
      const from = cost.from === "graveyard" ? "graveyard" : cost.from === "soul" ? "soul" : "hand";
      const filter = playCostFilter(cost);
      let paid: FabObjectSnapshot[] = [];
      if (cost.random === true) {
        const needed = banishPlayCostCount(cost) ?? 1;
        const pool = [
          ...zonePlayCostCandidates(
            preview,
            procedure.actorId,
            procedure.object.instanceId,
            from,
            filter,
          ),
        ];
        if (pool.length < needed) {
          return reversePlay(state, process.processId, procedure.actorId, {
            code: "required_cost_unpayable",
            message: "The additional banish cost cannot be paid.",
          });
        }
        for (let remaining = needed; remaining > 0; remaining -= 1) {
          const index = options.randomIndex(preview, pool.length);
          const [picked] = pool.splice(index, 1);
          if (picked) paid.push(picked);
        }
      } else {
        paid = procedure.effectCostTargetIds.flatMap((instanceId) => {
          const object = snapshotPlayCostObject(preview, procedure.actorId, instanceId);
          return object ? [object] : [];
        });
      }
      const power6 = paid.filter((object) => {
        const power = object.current?.numeric.power;
        return typeof power === "number" && power >= 6;
      }).length;
      const shadowBanished = paid.some((object) =>
        object.current?.typeBox.supertypes.includes("Shadow"),
      );
      procedure.costBindings = {
        ...procedure.costBindings,
        "banished-this-way": paid,
        "banished-for-cost": paid.length,
        them: paid,
        ...(paid[0] ? { it: paid[0] } : {}),
        "1-or-more-cards-with-6-or-more-power-banished-this-way": power6 >= 1 ? "true" : "false",
        "2-or-more-cards-with-6-or-more-power-banished-this-way": power6 >= 2 ? "true" : "false",
        "3-or-more-cards-with-6-or-more-power-banished-this-way": power6 >= 3 ? "true" : "false",
        "card-with-6-or-more-power-banished-this-way": power6 >= 1 ? "true" : "false",
        "shadow-card-banished-this-way": shadowBanished ? "true" : "false",
      };
      for (const object of paid) {
        appendFabEventGroup(process, [
          {
            name: "banish",
            processId: process.processId,
            cause: {
              kind: "player-command",
              actorId: procedure.actorId,
              command: "play-effect-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [object],
            bindings: procedure.costBindings,
            data: {
              object,
              destinationRef: nextFabDestinationRef(preview, object, resetOffset++),
              from,
              to: "banished",
              reason: "banish",
              random: cost.random === true,
            },
          },
        ]);
      }
      continue;
    }
    if (isNamedDiscardHandPlayCost(cost)) {
      const needed = namedDiscardPlayCostCount(cost) ?? 1;
      const candidates = new Map(
        zonePlayCostCandidates(
          preview,
          procedure.actorId,
          procedure.object.instanceId,
          "hand",
          playCostFilter(cost),
        ).map((object) => [object.instanceId, object] as const),
      );
      const paid = procedure.effectCostTargetIds.flatMap((instanceId) => {
        const object = candidates.get(instanceId);
        return object ? [object] : [];
      });
      if (paid.length !== needed) {
        return reversePlay(state, process.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The named discard additional cost cannot be paid.",
        });
      }
      procedure.costBindings = {
        ...procedure.costBindings,
        "discarded-this-way": paid,
        discardedCard: paid[0],
        it: paid[0],
      };
      for (const object of paid) {
        appendFabEventGroup(process, [
          {
            name: "discard",
            processId: process.processId,
            cause: {
              kind: "player-command",
              actorId: procedure.actorId,
              command: "play-effect-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [object],
            bindings: procedure.costBindings,
            data: {
              playerId: procedure.actorId,
              object,
              destinationRef: nextFabDestinationRef(preview, object, resetOffset++),
              random: false,
            },
          },
        ]);
      }
      continue;
    }
    if (isRemoveCountersPlayCost(cost)) {
      const targetId = procedure.effectCostTargetIds[0];
      const object = targetId ? snapshotPlayCostObject(preview, procedure.actorId, targetId) : null;
      const amount = procedure.costBindings["counters-removed-for-cost"];
      if (!object || typeof amount !== "number" || amount < 1) {
        return reversePlay(state, process.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The remove-counters additional cost was not fully declared.",
        });
      }
      if (numericCounterCountOnObject(preview, object.instanceId, cost) < amount) {
        return reversePlay(state, process.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected object lacks the required counters.",
        });
      }
      if (cost.counter.kind !== "numeric" || typeof cost.counter.value !== "number") {
        return failure(state, "This effect cost is not yet canonical.", "unsupported_effect_cost");
      }
      procedure.costBindings = {
        ...procedure.costBindings,
        it: object,
        paidCost: object,
      };
      appendFabEventGroup(process, [
        {
          name: "numeric-counter-removed",
          processId: process.processId,
          cause: {
            kind: "player-command",
            actorId: procedure.actorId,
            command: "play-effect-cost",
          },
          controllerId: procedure.actorId,
          source: procedure.object,
          affected: [object],
          bindings: procedure.costBindings,
          data: {
            object,
            property: cost.counter.property,
            value: cost.counter.value,
            count: amount,
          },
        },
      ]);
      continue;
    }
    if (!isRevealHandPlayCost(cost) && !isRandomDiscardHandPlayCost(cost))
      return failure(state, "This effect cost is not yet canonical.", "unsupported_effect_cost");
    const candidates = preview.containers.zonesByPlayerId[procedure.actorId]!.hand.filter(
      (instanceId) => instanceId !== procedure.object.instanceId,
    ).filter((instanceId) => {
      const object = snapshotObject(preview, instanceId, procedure.actorId, "hand");
      return !cost.filter || matchesFabSnapshotFilter(state, object, cost.filter);
    });
    if (candidates.length === 0) {
      return reversePlay(state, process.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message:
          cost.type === "reveal"
            ? "The reveal additional cost cannot be paid."
            : "The random-discard additional cost cannot be paid.",
      });
    }
    // Reveal costs are a choice; star-count reveals every matching hand card
    // (Rouse the Ancients: any number of attack actions). A fixed reveal
    // picks the first match; random-discard consumes the random index.
    const starReveal =
      cost.type === "reveal" &&
      typeof cost.count === "object" &&
      (cost.count.type === "all" || cost.count.type === "any-number");
    const revealIds =
      cost.type === "reveal"
        ? starReveal
          ? candidates
          : [candidates[0]!]
        : [candidates[options.randomIndex(state, candidates.length)]!];
    const revealed = revealIds.map((paidId) =>
      snapshotObject(preview, paidId, procedure.actorId, "hand"),
    );
    if (cost.type === "reveal") {
      procedure.costBindings = {
        ...procedure.costBindings,
        "revealed-this-way": revealed,
        it: revealed[0],
      };
      for (const object of revealed) {
        appendFabEventGroup(process, [
          {
            name: "reveal",
            processId: process.processId,
            cause: {
              kind: "player-command",
              actorId: procedure.actorId,
              command: "play-effect-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [object],
            bindings: {
              revealedCard: object,
              "revealed-this-way": revealed,
            },
            data: { playerId: procedure.actorId, object },
          },
        ]);
      }
    } else {
      const object = revealed[0]!;
      appendFabEventGroup(process, [
        {
          name: "discard",
          processId: process.processId,
          cause: {
            kind: "player-command",
            actorId: procedure.actorId,
            command: "play-effect-cost",
          },
          controllerId: procedure.actorId,
          source: procedure.object,
          affected: [object],
          bindings: { discardedCard: object },
          data: {
            playerId: procedure.actorId,
            object,
            destinationRef: nextFabDestinationRef(preview, object, resetOffset++),
            random: true,
          },
        },
      ]);
    }
  }
  if (!playCostThenApplied(procedure.costBindings)) {
    applyDeclaredPlayCostThenEffects(process, procedure, preview);
    procedure.costBindings = { ...procedure.costBindings, [PLAY_COST_THEN_APPLIED_KEY]: true };
  }
  procedure.effectCostPaid = true;
  const paidPreview = reduceFabEventJournal(state, procedure.eventGroups);
  return paidPreview.committed
    ? finalizePlay(state, paidPreview.state, options)
    : failure(state, "The effect-cost journal cannot be reduced.", "invalid_play_journal");
}

function applyDeclaredPlayCostThenEffects(
  process: NonNullable<FabMatchState["rulesProcess"]>,
  procedure: Extract<
    NonNullable<FabMatchState["rulesProcess"]>["procedure"],
    { readonly kind: "play-card" }
  >,
  preview: FabMatchState,
): void {
  let thenLayerOffset = 0;
  for (const spec of playCostSpecs(procedure.object)) {
    if (!spec.then) continue;
    if (spec.optional || spec.role === "alternative-cost") {
      if (isPlayCostDeclared(procedure.costBindings, spec.abilityId) !== true) continue;
    }
    let benefit = spec.then;
    if (benefit.type === "conditional") {
      const view = buildFabRulesView(preview);
      const sourceRecord = preview.objects[procedure.object.instanceId];
      const revealed = procedure.costBindings["revealed-this-way"];
      const revealedRefs = (
        Array.isArray(revealed) ? revealed : revealed ? [revealed] : []
      ).flatMap((value) =>
        typeof value === "object" &&
        value !== null &&
        "instanceId" in value &&
        "incarnation" in value
          ? [
              {
                instanceId: String(value.instanceId),
                incarnation: Number(value.incarnation),
              },
            ]
          : [],
      );
      const holds = view.evaluateCondition(benefit.condition, {
        controllerId: procedure.actorId,
        source: sourceRecord
          ? { instanceId: sourceRecord.instanceId, incarnation: sourceRecord.incarnation }
          : null,
        bindings: {
          objects: { "revealed-this-way": revealedRefs },
          numbers: {},
          strings: {},
        },
      });
      if (!holds) continue;
      benefit = benefit.then;
    }
    const leaves = thenBenefitEffects(benefit);
    const compiledLeaves = leaves.map((effect, index) => {
      const effectId = `${process.processId}:play-cost:then-${spec.abilityId}-${index}`;
      return { effect, effectId, compiled: compileFabContinuousEffect({ effectId, effect }) };
    });
    if (compiledLeaves.every((leaf) => leaf.compiled.ok)) {
      for (const [index, leaf] of compiledLeaves.entries()) {
        if (!leaf.compiled.ok) continue;
        const duration =
          leaf.effect.type === "modify-numeric" || leaf.effect.type === "grant-property"
            ? (leaf.effect.duration ?? "this-turn")
            : "this-turn";
        const expiresAt = resolveContinuousExpiry(preview, procedure.object, duration);
        if (!expiresAt) continue;
        appendFabEventGroup(process, [
          {
            name: "continuous-effect-generated",
            processId: process.processId,
            cause: {
              kind: "player-command",
              actorId: procedure.actorId,
              command: "play-effect-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [procedure.object],
            bindings: {},
            data: {
              effectId: leaf.effectId,
              controllerId: procedure.actorId,
              source: procedure.object,
              origin: { kind: "layer" },
              effectPath: ["play-cost", spec.abilityId, `then-${index}`],
              simultaneousGroupId: null,
              atoms: leaf.compiled.atoms,
              duration,
              expiresAt,
              initialSubjects: [procedure.object.ref],
              futureApplicability: null,
            },
          },
        ]);
      }
      continue;
    }
    // Search/shuffle (and other non-continuous then-benefits) resolve as a
    // triggered layer generated when the additional cost is paid.
    thenLayerOffset += 1;
    const layerId = `layer-${preview.counters.layer + thenLayerOffset}` as const;
    appendFabEventGroup(process, [
      {
        name: "declare-triggered-layer",
        processId: process.processId,
        cause: {
          kind: "player-command",
          actorId: procedure.actorId,
          command: "play-effect-cost",
        },
        controllerId: procedure.actorId,
        source: procedure.object,
        affected: [procedure.object],
        bindings: procedure.costBindings,
        data: {
          layer: {
            kind: "triggered",
            layerId,
            controllerId: procedure.actorId,
            source: procedure.object,
            keywords: [],
            modes: [],
            targets: {},
            abilityId: spec.abilityId,
            trigger: {
              kind: "event",
              event: {
                name: "play",
                actor: { kind: "any" },
                observes: { kind: "none" },
              },
            },
            triggeringEvent: null,
            bindings: procedure.costBindings,
            resolution: { kind: "effect", effect: benefit },
          },
        },
      },
    ]);
    continue;
  }
}
