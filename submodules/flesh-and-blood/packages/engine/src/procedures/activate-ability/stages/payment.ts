import { applyActivationTargetScope } from "./quote.ts";
import type { FabActivatedAbility } from "@tcg/flesh-and-blood-types";
import { type FabMatchState } from "../../../state.ts";
import { appendFabEventGroup, reduceFabEventJournal } from "../../../kernel/event-journal.ts";
import type { FabDecisionAnswer, FabDecisionContinuation } from "../../../rules/process.ts";
import { executeFabEventJournalTransaction } from "../../../kernel/transaction/index.ts";
import { type FabEventTransactionOptions } from "../../../kernel/process-runner/index.ts";
import { basePropertiesOf } from "../../../cards.ts";
import { fabPlayerId } from "../../../game/identity.ts";
import { createFabPaymentDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";
import {
  createSyntheticFabObjectSnapshot,
  nextFabDestinationRef,
  snapshotObject,
  snapshotPlayerId,
  syntheticTokenBaseProperties,
} from "../../../rules/snapshots.ts";
import { buildFabRulesView, buildFabRulesViewWithLki } from "../../../rules/state-rules-view.ts";
import {
  activationBanishRequirements,
  activationDiscardRequirements,
  activationDestroyRequirements,
  activationTapRequirements,
  activationUntapRequirements,
  activationChargeRequirements,
  activationMoveToDeckRequirements,
  activationRemoveCounterRequirements,
  activationRevealRequirements,
  activationTurnFaceUpRequirements,
  activationTurnFaceDownRequirements,
} from "../costs/requirements.ts";
import {
  snapshotKnownObject,
  snapshotDeclaredTargetObject,
  advanced,
  rejected,
  reverseActivation,
  activationPaymentCandidates,
  activationLimitUsageCount,
} from "../helpers.ts";
import type { FabActivationProcedureResult } from "../types.ts";
import { catalogZoneMatchesTargetZones } from "../../../rules/zones.ts";
import { isArenaZone } from "../../../rules/reducers/zone-moves/helpers.ts";
import { reanchorFabBindingsThroughCommittedMoves } from "../../../rules/binding-reanchor.ts";

export function resumeFabActivationPayment(
  state: FabMatchState,
  continuation: Extract<FabDecisionContinuation, { readonly kind: "payment" }>,
  answer: Extract<FabDecisionAnswer, { readonly kind: "payment" }>,
  options: FabEventTransactionOptions,
): FabActivationProcedureResult {
  const process = state.rulesProcess;
  const procedure = process?.procedure;
  if (
    !process ||
    process.processId !== continuation.processId ||
    continuation.procedure !== "activate" ||
    procedure?.kind !== "activate"
  )
    return rejected(
      state,
      "The persisted FAB activation payment no longer exists.",
      "stale_activation_process",
    );
  if (continuation.cost !== "asset" || answer.instanceIds.length !== 1) {
    return rejected(
      state,
      "FAB activation payment must pitch exactly one card at a time.",
      "invalid_activation_payment",
    );
  }
  const instanceId = answer.instanceIds[0]!;
  if (procedure.pitchedInstanceIds.includes(instanceId))
    return rejected(state, "That payment card was already pitched.", "invalid_activation_payment");
  if (
    instanceId === procedure.object.instanceId &&
    (procedure.selfMoveToDeck || procedure.discardSelf)
  ) {
    return rejected(
      state,
      "The activation source is reserved for its effect cost and cannot be pitched.",
      "invalid_activation_payment",
    );
  }
  if (!state.containers.zonesByPlayerId[procedure.actorId]!.hand.includes(instanceId))
    return rejected(
      state,
      "The activation payment card is no longer in hand.",
      "invalid_activation_payment",
    );
  const objectRecord = state.objects[instanceId];
  const evaluated = objectRecord
    ? buildFabRulesView(state).object({
        instanceId: objectRecord.instanceId,
        incarnation: objectRecord.incarnation,
      })
    : null;
  const generated = evaluated?.current.numeric.pitch ?? 0;
  if (generated <= 0)
    return rejected(
      state,
      "That card cannot generate resources for this activation.",
      "invalid_activation_payment",
    );
  const isChi = evaluated?.current.typeBox.subtypes.includes("Chi") ?? false;
  const preview = reduceFabEventJournal(state, procedure.eventGroups);
  if (!preview.committed)
    return rejected(
      state,
      "The activation payment journal is invalid.",
      "invalid_activation_journal",
    );
  const previewPlayer = preview.state.players[procedure.actorId]!;
  const needsChi = previewPlayer.chiPoints < procedure.chiCost;
  const needsResources = previewPlayer.resourcePoints < procedure.resourceCost;
  if ((isChi && !needsChi) || (!isChi && !needsResources)) {
    return rejected(
      state,
      "That card does not generate the asset still required by this activation.",
      "invalid_activation_payment",
    );
  }
  const object = snapshotObject(state, instanceId, procedure.actorId, "hand");
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
        destinationRef: nextFabDestinationRef(state, object),
        resourcesGenerated: isChi ? 0 : generated,
        chiGenerated: isChi ? generated : 0,
      },
    },
  ]);
  procedure.pitchedInstanceIds.push(instanceId);
  const result = advanceActivationPayment(state, options);
  return result;
}

export function advanceActivationPayment(
  state: FabMatchState,
  options: FabEventTransactionOptions,
): FabActivationProcedureResult {
  const processState = state.rulesProcess;
  const procedure = processState?.procedure;
  if (!processState || procedure?.kind !== "activate") {
    return rejected(
      state,
      "The activation payment procedure is missing.",
      "stale_activation_process",
    );
  }
  const preview = reduceFabEventJournal(state, procedure.eventGroups);
  if (!preview.committed)
    return rejected(
      state,
      "The activation payment journal is invalid.",
      "invalid_activation_journal",
    );
  const player = preview.state.players[procedure.actorId]!;
  const remainingResources = Math.max(0, procedure.resourceCost - player.resourcePoints);
  const remainingChi = Math.max(0, procedure.chiCost - player.chiPoints);
  if (remainingResources > 0 || remainingChi > 0) {
    const candidates = activationPaymentCandidates(
      state,
      procedure.actorId,
      [
        ...procedure.pitchedInstanceIds,
        ...(procedure.selfMoveToDeck || procedure.discardSelf ? [procedure.object.instanceId] : []),
      ],
      remainingChi > 0 ? "chi" : "resources",
    );
    if (candidates.length === 0) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "The activation resource cost cannot be paid.",
      });
    }
    publishFabDecision(
      state,
      createFabPaymentDecision(state, {
        actorId: procedure.actorId,
        label: `Pitch a card to pay for ${procedure.object.current.names.join(" // ") || procedure.object.instanceId}.`,
        amount: remainingChi > 0 ? remainingChi : remainingResources,
        oneAtATime: true,
        cancellable: true,
        candidates,
        continuation: {
          kind: "payment",
          processId: processState.processId,
          cost: "asset",
          procedure: "activate",
        },
      }),
    );
    return advanced(state);
  }

  appendFabEventGroup(processState, [
    {
      name: "spend-assets",
      processId: processState.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "activate" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [],
      bindings: {},
      data: {
        playerId: procedure.actorId,
        resources: procedure.resourceCost,
        chi: procedure.chiCost,
        life: procedure.lifeCost,
        actionPoints: procedure.actionPointCost,
      },
    },
  ]);
  if (procedure.tapSelf) {
    appendFabEventGroup(processState, [
      {
        name: "set-tapped",
        processId: processState.processId,
        cause: { kind: "player-command", actorId: procedure.actorId, command: "activation-cost" },
        controllerId: procedure.actorId,
        source: procedure.object,
        affected: [procedure.object],
        bindings: { paidCost: procedure.object },
        data: { object: procedure.object, tapped: true },
      },
    ]);
  }
  if (procedure.tapHero) {
    const heroId = state.players[procedure.actorId]?.heroCardId;
    if (!heroId)
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "The activation hero no longer exists.",
      });
    const hero = snapshotObject(state, heroId, procedure.actorId, "heroZone");
    appendFabEventGroup(processState, [
      {
        name: "set-tapped",
        processId: processState.processId,
        cause: { kind: "player-command", actorId: procedure.actorId, command: "activation-cost" },
        controllerId: procedure.actorId,
        source: procedure.object,
        affected: [hero],
        bindings: { paidCost: hero },
        data: { object: hero, tapped: true },
      },
    ]);
  }
  if (procedure.turnFaceUpSelf) {
    appendFabEventGroup(processState, [
      {
        name: "turn-face-up",
        processId: processState.processId,
        cause: { kind: "player-command", actorId: procedure.actorId, command: "activation-cost" },
        controllerId: procedure.actorId,
        source: procedure.object,
        affected: [procedure.object],
        bindings: { ...procedure.costBindings, paidCost: procedure.object },
        data: { playerId: procedure.actorId, object: procedure.object },
      },
    ]);
  }
  for (const counterCost of procedure.counterCosts) {
    appendFabEventGroup(processState, [
      {
        name: counterCost.operation === "add" ? "counter-added" : "counter-removed",
        processId: processState.processId,
        cause: { kind: "player-command", actorId: procedure.actorId, command: "activation-cost" },
        controllerId: procedure.actorId,
        source: procedure.object,
        affected: [procedure.object],
        bindings: { paidCost: procedure.object },
        data: {
          object: procedure.object,
          counter: counterCost.counter,
          amount: counterCost.amount,
        },
      },
    ]);
  }
  // Chane: create-token effect cost pays by minting the token into the arena
  // before the activate layer is put on the stack.
  let createTokenIndex = 0;
  for (const tokenCost of procedure.createTokenCosts) {
    const playerId =
      tokenCost.controller === "opponent"
        ? (state.playerIds.find((id) => id !== procedure.actorId) ?? procedure.actorId)
        : procedure.actorId;
    const tokenCanonicalId = `token:${tokenCost.token}`;
    const registeredDef = state.cardDefinitions[tokenCanonicalId];
    const tokenBase =
      registeredDef && registeredDef.base.abilities.length > 0
        ? basePropertiesOf(registeredDef)
        : syntheticTokenBaseProperties(tokenCost.token);
    for (let n = 0; n < tokenCost.count; n += 1) {
      const index = createTokenIndex;
      createTokenIndex += 1;
      const instanceId = `${processState.processId}:activate-cost:token-${index}`;
      const object = createSyntheticFabObjectSnapshot({
        ref: {
          instanceId,
          incarnation: state.counters.objectIncarnation + index + 1,
        },
        canonicalId: tokenCanonicalId,
        objectKind: "created-token",
        baseSource: { kind: "registered" },
        ownerId: playerId,
        controllerId: playerId,
        zone: "unknown",
        zoneRef: { playerId: fabPlayerId(playerId), zone: "arena" },
        base: tokenBase,
      });
      appendFabEventGroup(processState, [
        {
          name: "create",
          processId: processState.processId,
          cause: {
            kind: "player-command",
            actorId: procedure.actorId,
            command: "activation-cost",
          },
          controllerId: procedure.actorId,
          source: procedure.object,
          affected: [object],
          bindings: { paidCost: object },
          data: { playerId, object },
        },
      ]);
    }
  }
  // Zone-resetting cost moves (pitch already in the journal, discard, put on
  // deck, banish, destroy) each reserve a distinct destination incarnation.
  // moveKnownObject requires destinationRef.incarnation === objectIncarnation+1
  // at commit time; shared offset keeps sequential groups valid after the
  // counter advances (Mask of Malicious Manifestations: hand→deck + destroy-self).
  const priorDestinationResets = procedure.eventGroups.reduce((count, group) => {
    return (
      count +
      group.events.filter((event) => {
        const data = event.data as { readonly destinationRef?: unknown } | undefined;
        return data?.destinationRef != null;
      }).length
    );
  }, 0);
  let costDestinationResetOffset = priorDestinationResets;

  if (procedure.selfMoveToDeck) {
    const ownerId = procedure.object.ownerId;
    if (
      !state.players[ownerId] ||
      procedure.object.zone === "deck" ||
      !state.objects[procedure.object.instanceId]
    ) {
      return reverseActivation(state, processState.processId, procedure.actorId, {
        code: "required_cost_unpayable",
        message: "The activation source can no longer be moved into its owner's deck.",
      });
    }
    const moveEvent = {
      name: "move-zone" as const,
      processId: processState.processId,
      cause: {
        kind: "player-command" as const,
        actorId: procedure.actorId,
        command: "activation-cost" as const,
      },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [procedure.object],
      bindings: { paidCost: procedure.object },
      data: {
        object: procedure.object,
        destinationRef: nextFabDestinationRef(
          state,
          procedure.object,
          costDestinationResetOffset++,
        ),
        from: procedure.object.zone,
        to: "deck" as const,
        reason: "move" as const,
        destinationPlayerId: ownerId,
        ...(procedure.selfMoveToDeck.position === "shuffle"
          ? {}
          : { position: procedure.selfMoveToDeck.position }),
      },
    };
    appendFabEventGroup(processState, [
      moveEvent,
      ...(procedure.selfMoveToDeck.position === "shuffle"
        ? [
            {
              name: "shuffle-zone" as const,
              processId: processState.processId,
              cause: {
                kind: "player-command" as const,
                actorId: procedure.actorId,
                command: "activation-cost" as const,
              },
              controllerId: procedure.actorId,
              source: procedure.object,
              affected: [],
              bindings: { paidCost: procedure.object },
              data: { playerId: ownerId, zone: "deck" as const },
            },
          ]
        : []),
    ]);
  }

  if (procedure.discardSelf) {
    appendFabEventGroup(processState, [
      {
        name: "discard",
        processId: processState.processId,
        cause: { kind: "player-command", actorId: procedure.actorId, command: "activation-cost" },
        controllerId: procedure.actorId,
        source: procedure.object,
        affected: [procedure.object],
        bindings: { paidCost: procedure.object },
        data: {
          playerId: procedure.actorId,
          object: procedure.object,
          destinationRef: nextFabDestinationRef(
            state,
            procedure.object,
            costDestinationResetOffset++,
          ),
          random: false,
        },
      },
    ]);
  }
  const originalAbility = buildFabRulesViewWithLki(state, [procedure.object])
    .functionalAbilities(procedure.object.ref)
    .find(
      (candidate): candidate is FabActivatedAbility =>
        candidate.kind === "activated" && candidate.id === procedure.abilityId,
    );
  const activatedAbility = applyActivationTargetScope(
    state,
    buildFabRulesViewWithLki(state, [procedure.object]),
    procedure.object.ref,
    procedure.actorId,
    originalAbility ?? null,
  );
  if (!activatedAbility) {
    return rejected(state, "The activated ability no longer exists.", "stale_activation_ability");
  }
  const paidCostBindings = { ...procedure.costBindings };
  if (procedure.turnFaceUpTargets && activatedAbility) {
    for (const requirement of activationTurnFaceUpRequirements(procedure.cost)) {
      if (requirement.target.selector !== "object") continue;
      const targetRef = procedure.declaredTargets[requirement.key]?.[0];
      const target = targetRef ? snapshotDeclaredTargetObject(state, targetRef) : null;
      if (!target) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected activation cost target no longer exists.",
        });
      }
      if (requirement.outputBinding) paidCostBindings[requirement.outputBinding] = target;
      appendFabEventGroup(processState, [
        {
          name: "turn-face-up",
          processId: processState.processId,
          cause: { kind: "player-command", actorId: procedure.actorId, command: "activation-cost" },
          controllerId: procedure.actorId,
          source: procedure.object,
          affected: [target],
          bindings: { ...paidCostBindings, paidCost: target },
          data: { playerId: snapshotPlayerId(target) || procedure.actorId, object: target },
        },
      ]);
    }
  }
  if (procedure.turnFaceDownTargets && activatedAbility) {
    for (const requirement of activationTurnFaceDownRequirements(procedure.cost)) {
      const targets = (procedure.declaredTargets[requirement.key] ?? []).map((targetRef) =>
        snapshotDeclaredTargetObject(state, targetRef),
      );
      if (targets.some((target) => target === null)) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "A selected activation cost target no longer exists.",
        });
      }
      const knownTargets = targets.filter(
        (target): target is NonNullable<typeof target> => target !== null,
      );
      if (knownTargets.length === 0) continue;
      appendFabEventGroup(
        processState,
        knownTargets.map((target) => ({
          name: "turn-face-down" as const,
          processId: processState.processId,
          cause: {
            kind: "player-command" as const,
            actorId: procedure.actorId,
            command: "activation-cost",
          },
          controllerId: procedure.actorId,
          source: procedure.object,
          affected: [target],
          // Face-down targets can lack controller/zone/owner ids; the
          // activating seat always owns the cost move.
          bindings: { ...paidCostBindings, paidCost: target },
          data: { playerId: snapshotPlayerId(target) || procedure.actorId, object: target },
        })),
      );
    }
  }
  if (procedure.chargeTargets && activatedAbility) {
    for (const requirement of activationChargeRequirements(procedure.cost)) {
      const targetRefs = procedure.declaredTargets[requirement.key] ?? [];
      if (targetRefs.length !== requirement.count) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected charge cost no longer exists in hand.",
        });
      }
      const targets = targetRefs.map((targetRef) => snapshotDeclaredTargetObject(state, targetRef));
      if (targets.some((target) => !target || target.zone !== "hand")) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected charge cost no longer exists in hand.",
        });
      }
      const knownTargets = targets.filter(
        (target): target is NonNullable<typeof target> => target !== null,
      );
      if (requirement.outputBinding && knownTargets[0]) {
        paidCostBindings[requirement.outputBinding] = knownTargets;
      }
      for (const target of knownTargets) {
        appendFabEventGroup(processState, [
          {
            name: "move-zone",
            processId: processState.processId,
            cause: {
              kind: "player-command",
              actorId: procedure.actorId,
              command: "activation-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [target],
            bindings: { ...paidCostBindings, paidCost: target, "charged-this-way": knownTargets },
            data: {
              object: target,
              destinationRef: nextFabDestinationRef(state, target, costDestinationResetOffset++),
              from: "hand",
              to: "soul",
              reason: "rule",
            },
          },
        ]);
        appendFabEventGroup(processState, [
          {
            name: "charge",
            processId: processState.processId,
            cause: {
              kind: "player-command",
              actorId: procedure.actorId,
              command: "activation-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [procedure.object, target],
            bindings: {
              ...paidCostBindings,
              chargedCard: target,
              "charged-this-way": knownTargets,
            },
            data: {
              actorId: procedure.actorId,
              object: procedure.object,
              charged: target,
            },
          },
        ]);
      }
    }
  }
  if (procedure.discardTargets && activatedAbility) {
    for (const requirement of activationDiscardRequirements(procedure.cost)) {
      const targetRefs = procedure.declaredTargets[requirement.key] ?? [];
      const max = requirement.max ?? Number.POSITIVE_INFINITY;
      if (targetRefs.length < requirement.min || targetRefs.length > max) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected discard cost no longer exists in hand.",
        });
      }
      const targets = targetRefs.map((targetRef) => snapshotDeclaredTargetObject(state, targetRef));
      if (targets.some((target) => !target || target.zone !== "hand")) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected discard cost no longer exists in hand.",
        });
      }
      const knownTargets = targets.filter(
        (target): target is NonNullable<typeof target> => target !== null,
      );
      if (requirement.outputBinding && knownTargets[0]) {
        paidCostBindings[requirement.outputBinding] = knownTargets[0];
      }
      paidCostBindings["discarded-this-way"] = knownTargets;
      paidCostBindings["discarded-this-way-count"] = knownTargets.length;
      for (const target of knownTargets) {
        appendFabEventGroup(processState, [
          {
            name: "discard",
            processId: processState.processId,
            cause: {
              kind: "player-command",
              actorId: procedure.actorId,
              command: "activation-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [target],
            bindings: { ...paidCostBindings, paidCost: target },
            data: {
              playerId: procedure.actorId,
              object: target,
              destinationRef: nextFabDestinationRef(state, target, costDestinationResetOffset++),
              random: false,
            },
          },
        ]);
      }
    }
  }
  if (procedure.moveToDeckTargets && activatedAbility) {
    for (const requirement of activationMoveToDeckRequirements(procedure.cost)) {
      const targetRefs = procedure.declaredTargets[requirement.key] ?? [];
      if (targetRefs.length !== requirement.count) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected put-on-deck cost no longer exists in hand or arsenal.",
        });
      }
      const allowedZones = requirement.target.zones;
      const targets = targetRefs.map((targetRef) => snapshotDeclaredTargetObject(state, targetRef));
      if (
        targets.some(
          (target) =>
            !target || !allowedZones.includes(target.zone as (typeof allowedZones)[number]),
        )
      ) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected put-on-deck cost no longer exists in hand or arsenal.",
        });
      }
      const knownTargets = targets.filter(
        (target): target is NonNullable<typeof target> => target !== null,
      );
      if (requirement.outputBinding && knownTargets[0]) {
        paidCostBindings[requirement.outputBinding] = knownTargets[0];
      }
      for (const target of knownTargets) {
        const destinationRef = nextFabDestinationRef(state, target, costDestinationResetOffset++);
        appendFabEventGroup(processState, [
          {
            name: "move-zone",
            processId: processState.processId,
            cause: {
              kind: "player-command",
              actorId: procedure.actorId,
              command: "activation-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [target],
            bindings: { ...paidCostBindings, paidCost: target },
            data: {
              object: target,
              destinationRef,
              from: target.zone,
              to: "deck",
              reason: "move",
              position: requirement.position,
            },
          },
        ]);
      }
    }
  }
  if (procedure.revealTargets && activatedAbility) {
    // Reveal-a-card cost (Librarian JDG062): the declared card stays in its
    // zone (inventory/hand) but is stamped 'revealed-this-way' so the effect's
    // move-card filter can find it. Emit a reveal event for observers.
    for (const requirement of activationRevealRequirements(procedure.cost)) {
      const targetRef = procedure.declaredTargets[requirement.key]?.[0];
      const target = targetRef ? snapshotDeclaredTargetObject(state, targetRef) : null;
      const fromZone = requirement.target.zones[0] ?? "hand";
      if (!target || target.zone !== fromZone) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected reveal cost no longer exists in its zone.",
        });
      }
      if (requirement.outputBinding) paidCostBindings[requirement.outputBinding] = target;
      paidCostBindings["revealed-this-way"] = target;
      const objectRecord =
        targetRef?.kind === "object" ? state.objects[targetRef.ref.instanceId] : undefined;
      if (objectRecord && targetRef?.kind === "object") {
        // Stamp 'revealed-this-way' so the effect's move-card filter matches.
        // Mirror the immutable marker update used by the set-tapped reducer.
        state.objects[targetRef.ref.instanceId] = {
          ...objectRecord,
          markers: [...objectRecord.markers, { kind: "status", value: "revealed-this-way" }],
        };
      }
      appendFabEventGroup(processState, [
        {
          name: "reveal",
          processId: processState.processId,
          cause: { kind: "player-command", actorId: procedure.actorId, command: "activation-cost" },
          controllerId: procedure.actorId,
          source: procedure.object,
          affected: [target],
          bindings: { ...paidCostBindings, paidCost: target, "revealed-this-way": target },
          data: { playerId: procedure.actorId, object: target },
        },
      ]);
    }
  }
  if (procedure.banishTargets && activatedAbility) {
    // Multi-count / multi-component banishes (Kassai 2 red + 2 yellow) share the
    // destination-reset chain with other cost moves in this payment journal.
    for (const requirement of activationBanishRequirements(
      procedure.cost,
      [],
      procedure.chosenX ?? undefined,
    )) {
      const targetRefs = procedure.declaredTargets[requirement.key] ?? [];
      if (targetRefs.length !== requirement.count) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected banish cost count no longer matches the requirement.",
        });
      }
      for (const targetRef of targetRefs) {
        const target = snapshotDeclaredTargetObject(state, targetRef);
        // Catalog `permanent` (from:arena) must match weapon/equipment seats,
        // not only zone === "permanent". Same matcher as declaration/candidates.
        if (!target || !catalogZoneMatchesTargetZones(target.zone, requirement.target.zones)) {
          return reverseActivation(state, processState.processId, procedure.actorId, {
            code: "required_cost_unpayable",
            message: "The selected banish cost no longer exists in its source zone.",
          });
        }
        const paidTarget = requirement.faceDown ? { ...target, faceDown: true } : target;
        if (requirement.outputBinding) paidCostBindings[requirement.outputBinding] = paidTarget;
        if (requirement.faceDown) {
          appendFabEventGroup(processState, [
            {
              name: "turn-face-down",
              processId: processState.processId,
              cause: {
                kind: "player-command",
                actorId: procedure.actorId,
                command: "activation-cost",
              },
              controllerId: procedure.actorId,
              source: procedure.object,
              affected: [target],
              bindings: { ...paidCostBindings, paidCost: paidTarget },
              data: { playerId: snapshotPlayerId(target) || procedure.actorId, object: target },
            },
          ]);
        }
        appendFabEventGroup(processState, [
          {
            name: "banish",
            processId: processState.processId,
            cause: {
              kind: "player-command",
              actorId: procedure.actorId,
              command: "activation-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [paidTarget],
            bindings: { ...paidCostBindings, paidCost: paidTarget },
            data: {
              object: paidTarget,
              destinationRef: nextFabDestinationRef(
                state,
                paidTarget,
                costDestinationResetOffset++,
              ),
              from: target.zone,
              to: "banished",
              reason: "banish",
            },
          },
        ]);
      }
    }
  }
  if (procedure.tapTargets && activatedAbility) {
    for (const requirement of activationTapRequirements(procedure.cost)) {
      const targetRef = procedure.declaredTargets[requirement.key]?.[0];
      const target = targetRef ? snapshotDeclaredTargetObject(state, targetRef) : null;
      const live =
        targetRef?.kind === "object" ? state.objects[targetRef.ref.instanceId] : undefined;
      if (!target || !live) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected tap cost target no longer exists.",
        });
      }
      if (live.markers.some((m) => m.kind === "tapped")) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected tap cost target is already tapped.",
        });
      }
      appendFabEventGroup(processState, [
        {
          name: "set-tapped",
          processId: processState.processId,
          cause: { kind: "player-command", actorId: procedure.actorId, command: "activation-cost" },
          controllerId: procedure.actorId,
          source: procedure.object,
          affected: [target],
          bindings: { ...paidCostBindings, paidCost: target },
          data: { object: target, tapped: true },
        },
      ]);
    }
  }
  if (procedure.untapTargets && activatedAbility) {
    for (const requirement of activationUntapRequirements(procedure.cost)) {
      const targetRef = procedure.declaredTargets[requirement.key]?.[0];
      const target = targetRef ? snapshotDeclaredTargetObject(state, targetRef) : null;
      const live =
        targetRef?.kind === "object" ? state.objects[targetRef.ref.instanceId] : undefined;
      if (!target || !live) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected untap cost target no longer exists.",
        });
      }
      if (!live.markers.some((m) => m.kind === "tapped")) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected untap cost target is not tapped.",
        });
      }
      appendFabEventGroup(processState, [
        {
          name: "set-tapped",
          processId: processState.processId,
          cause: { kind: "player-command", actorId: procedure.actorId, command: "activation-cost" },
          controllerId: procedure.actorId,
          source: procedure.object,
          affected: [target],
          bindings: { ...paidCostBindings, paidCost: target },
          data: { object: target, tapped: false },
        },
      ]);
    }
  }
  if (procedure.destroyTargets && activatedAbility) {
    for (const requirement of activationDestroyRequirements(procedure.cost)) {
      const targetRefs = procedure.declaredTargets[requirement.key] ?? [];
      if (targetRefs.length < requirement.count) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected destroy cost target no longer exists in the arena.",
        });
      }
      for (const targetRef of targetRefs) {
        const target = snapshotDeclaredTargetObject(state, targetRef);
        // Validate against the requirement's own zone family — the same
        // matcher as declaration/candidates and the banish loop above. This
        // keeps hosted "under" seats payable (CR 3.0.14 destroy-under-this)
        // instead of hard-requiring an arena seat.
        if (!target || !catalogZoneMatchesTargetZones(target.zone, requirement.target.zones)) {
          return reverseActivation(state, processState.processId, procedure.actorId, {
            code: "required_cost_unpayable",
            message: "The selected destroy cost target no longer exists in the arena.",
          });
        }
        if (requirement.outputBinding) paidCostBindings[requirement.outputBinding] = target;
        // CR 8.1.8a: arena tokens cease to exist on destroy — they do not take a
        // GY destination incarnation. Reserving nextFabDestinationRef for them
        // still advanced costDestinationResetOffset, so a later destroy-self
        // (Runebleed Robe: destroy this and a Runechant) got a stale offset and
        // failed moveKnownObject. Omit destinationRef for token arena destroys.
        const isArenaToken = target.objectKind === "created-token" && isArenaZone(target.zone);
        const destinationRef = isArenaToken
          ? null
          : nextFabDestinationRef(state, target, costDestinationResetOffset++);
        appendFabEventGroup(processState, [
          {
            name: "destroy",
            processId: processState.processId,
            cause: {
              kind: "player-command",
              actorId: procedure.actorId,
              command: "activation-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [target],
            bindings: { ...paidCostBindings, paidCost: target },
            data: {
              object: target,
              destinationRef,
              from: target.zone,
              to: "graveyard",
              reason: "destroy",
            },
          },
        ]);
      }
    }
  }
  // Filtered remove-counter costs:
  // - named (Pleiades: remove suspense from an aura you control)
  // - numeric (Paragon Plate: remove +1{p} from an attacking sword you control)
  if (procedure.removeCounterTargets && activatedAbility) {
    for (const requirement of activationRemoveCounterRequirements(procedure.cost)) {
      const targetRef = procedure.declaredTargets[requirement.key]?.[0];
      const target = targetRef ? snapshotDeclaredTargetObject(state, targetRef) : null;
      const live =
        targetRef?.kind === "object" ? state.objects[targetRef.ref.instanceId] : undefined;
      if (!target || !live) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected counter cost target no longer exists.",
        });
      }
      if (requirement.outputBinding) paidCostBindings[requirement.outputBinding] = target;

      const counterSpec = requirement.counter;
      if (counterSpec.kind === "named") {
        const remaining =
          live.counters.find((c) => c.kind === "named" && c.name === counterSpec.name)?.count ?? 0;
        if (remaining < requirement.amount) {
          return reverseActivation(state, processState.processId, procedure.actorId, {
            code: "required_cost_unpayable",
            message: "The selected permanent lacks the required counters.",
          });
        }
        appendFabEventGroup(processState, [
          {
            name: "counter-removed",
            processId: processState.processId,
            cause: {
              kind: "player-command",
              actorId: procedure.actorId,
              command: "activation-cost",
            },
            controllerId: procedure.actorId,
            source: procedure.object,
            affected: [target],
            bindings: { ...paidCostBindings, paidCost: target },
            data: {
              object: target,
              counter: counterSpec.name,
              amount: requirement.amount,
            },
          },
        ]);
        continue;
      }

      // Numeric ±property counters (+1{p}, −1{d}, …).
      const available = live.counters.reduce((sum, counter) => {
        if (
          counter.kind === "numeric" &&
          counter.property === counterSpec.property &&
          counter.value === counterSpec.value
        ) {
          return sum + counter.count;
        }
        return sum;
      }, 0);
      if (available < requirement.amount) {
        return reverseActivation(state, processState.processId, procedure.actorId, {
          code: "required_cost_unpayable",
          message: "The selected permanent lacks the required counters.",
        });
      }
      appendFabEventGroup(processState, [
        {
          name: "numeric-counter-removed",
          processId: processState.processId,
          cause: {
            kind: "player-command",
            actorId: procedure.actorId,
            command: "activation-cost",
          },
          controllerId: procedure.actorId,
          source: procedure.object,
          affected: [target],
          bindings: { ...paidCostBindings, paidCost: target },
          data: {
            object: target,
            property: counterSpec.property,
            value: counterSpec.value,
            count: requirement.amount,
          },
        },
      ]);
    }
  }
  if (procedure.destroySelf) {
    appendFabEventGroup(processState, [
      {
        name: "destroy",
        processId: processState.processId,
        cause: { kind: "player-command", actorId: procedure.actorId, command: "activation-cost" },
        controllerId: procedure.actorId,
        source: procedure.object,
        affected: [procedure.object],
        bindings: { paidCost: procedure.object },
        data: {
          object: procedure.object,
          destinationRef: nextFabDestinationRef(
            state,
            procedure.object,
            costDestinationResetOffset++,
          ),
          from: procedure.object.zone,
          to: "graveyard",
          reason: "destroy",
        },
      },
    ]);
  }
  if (procedure.banishSelf) {
    appendFabEventGroup(processState, [
      {
        name: "banish",
        processId: processState.processId,
        cause: { kind: "player-command", actorId: procedure.actorId, command: "activation-cost" },
        controllerId: procedure.actorId,
        source: procedure.object,
        affected: [procedure.object],
        bindings: { paidCost: procedure.object },
        data: {
          object: procedure.object,
          destinationRef: nextFabDestinationRef(
            state,
            procedure.object,
            costDestinationResetOffset++,
          ),
          from: procedure.object.zone,
          to: "banished",
          reason: "banish",
        },
      },
    ]);
  }
  // Stamp "pitched this way" talent flags onto the activate event so layer
  // resolution can branch (Oldhim Earth/Ice, etc.) without re-querying the
  // pitch zone after cards have moved.
  const pitchedThisWayBindings: Record<string, string | number> = {};
  let pitchedAttackAction = false;
  let pitchedNonAttackAction = false;
  let pitchedChiCount = 0;
  for (const pitchedId of procedure.pitchedInstanceIds) {
    const pitched = snapshotKnownObject(state, pitchedId);
    if (!pitched) continue;
    const talents = [
      ...pitched.current.typeBox.supertypes,
      ...pitched.current.typeBox.types,
      ...pitched.current.typeBox.subtypes,
    ];
    if (talents.includes("Earth")) pitchedThisWayBindings["pitched-this-way-earth-card"] = 1;
    if (talents.includes("Ice")) pitchedThisWayBindings["pitched-this-way-ice-card"] = 1;
    if (talents.includes("Lightning"))
      pitchedThisWayBindings["pitched-this-way-lightning-card"] = 1;
    if (talents.includes("Chi")) {
      pitchedThisWayBindings["pitched-this-way-chi-card"] = 1;
      pitchedChiCount += 1;
    }
    // DYN172 Annals of Sutcliffe: "an attack action card and a 'non-attack'
    // action card were pitched this way" — classify each pitched card by its
    // printed type box (attack actions carry the Attack subtype; mirrors the
    // attack-and-non-attack-banished-this-way discrimination).
    if (pitched.current.typeBox.subtypes.includes("Attack")) pitchedAttackAction = true;
    else if (pitched.current.typeBox.types.includes("Action")) pitchedNonAttackAction = true;
  }
  if (pitchedAttackAction && pitchedNonAttackAction) {
    pitchedThisWayBindings["pitched-attack-and-non-attack-action-to-play-this"] = "true";
  }
  pitchedThisWayBindings["pitched-this-way-chi-count"] = pitchedChiCount;
  pitchedThisWayBindings["times-activated-this-ability"] =
    activationLimitUsageCount({
      state,
      actorId: procedure.actorId,
      instanceId: procedure.object.instanceId,
      incarnation: procedure.object.ref.incarnation,
      ability: activatedAbility,
    }) + 1;
  // CR 5.2.2a creates the activated layer before its costs are paid; CR
  // 5.2.2b then applies 5.1.3-5.1.10, so the observable activate event is
  // committed only after every cost event.
  const announcementGroup = appendFabEventGroup(processState, [
    {
      name: "announce-activation",
      processId: processState.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "activate" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [procedure.object],
      bindings: {
        "times-activated-this-ability": pitchedThisWayBindings["times-activated-this-ability"],
      },
      data: {
        actorId: procedure.actorId,
        object: procedure.object,
        abilityId: procedure.abilityId,
        ability: activatedAbility,
        targets: procedure.declaredTargets,
        equipDestination: procedure.equipDestination,
        attackTarget: procedure.attackTarget,
      },
    },
  ]);
  const activationGroup = appendFabEventGroup(processState, [
    {
      name: "activate",
      processId: processState.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "activate" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [procedure.object],
      bindings: { ...paidCostBindings, ...pitchedThisWayBindings },
      data: {
        actorId: procedure.actorId,
        object: procedure.object,
        abilityId: procedure.abilityId,
        ability: activatedAbility,
        targets: procedure.declaredTargets,
        equipDestination: procedure.equipDestination,
        attackTarget: procedure.attackTarget,
        pitchedInstanceIds: procedure.pitchedInstanceIds,
      },
    },
  ]);
  procedure.eventGroups.pop();
  procedure.eventGroups.pop();
  procedure.eventGroups.unshift(announcementGroup);
  procedure.eventGroups.push(activationGroup);
  const committed = executeFabEventJournalTransaction(state, procedure.eventGroups, options);
  if (
    !committed.committed &&
    ("suspendedForReplacementOrder" in committed || "suspendedForContinuousOrder" in committed)
  ) {
    return advanced(committed.state);
  }
  if (!committed.committed) {
    return rejected(
      state,
      "The activation procedure failed atomically.",
      "activation_journal_failed",
    );
  }
  const committedEvents = committed.batches.flatMap((batch) => batch.events);
  let layerIndex = -1;
  for (let index = committed.state.rulesStack.length - 1; index >= 0; index -= 1) {
    const layer = committed.state.rulesStack[index];
    if (
      layer?.kind === "activated" &&
      layer.controllerId === procedure.actorId &&
      layer.abilityId === procedure.abilityId &&
      layer.source.instanceId === procedure.object.instanceId
    ) {
      layerIndex = index;
      break;
    }
  }
  const activatedLayer = committed.state.rulesStack[layerIndex];
  if (activatedLayer?.kind === "activated") {
    committed.state.rulesStack[layerIndex] = {
      ...activatedLayer,
      bindings: {
        ...reanchorFabBindingsThroughCommittedMoves(
          committed.state,
          activatedLayer.bindings,
          committedEvents,
        ),
        "times-activated-this-ability": pitchedThisWayBindings["times-activated-this-ability"],
      },
    };
  }
  return advanced(committed.state);
}
