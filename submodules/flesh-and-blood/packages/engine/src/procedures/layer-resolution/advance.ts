import { proposeLayerResolutionEvents } from "../../rules/effect-event-proposals.ts";
import type { FabMatchState } from "../../state.ts";
import type { FabProposedEventGroup } from "../../rules/events.ts";
import type { FabRulesStackLayer } from "../../rules/layers.ts";
import { executeFabEventJournalTransaction } from "../../kernel/transaction/index.ts";
import { type FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { dispatchLayerDecision } from "../../rules/decision-dispatch/dispatch-decision.ts";
import type { FabLayerResolutionResult } from "../../rules/decision-dispatch/result.ts";
import { commitResolutionEffectPayment, resumeAbilityStepAfterJournal } from "./journal.ts";
import {
  committedClashBarrierPath,
  committedDamageConditionBarrierPath,
  flushSequencePrefixBeforeDecision,
} from "./sequence.ts";
import {
  advanceMultiFaceCursor,
  cardResolutionCursor,
  effectsForLayer,
  nextAbilityStepContinuation,
} from "./meld.ts";
import {
  firstUnansweredDecision,
  firstRequiredAtResolutionTarget,
  stageAnsweredOutputBindings,
  stageDeterministicOutputBindings,
} from "./find-decision.ts";
import { failure } from "./process.ts";
import { optionalChooserActorId } from "../../rules/decision-dispatch/decisions/optional.ts";

export function advanceFabLayerResolution(
  state: FabMatchState,
  layer: FabRulesStackLayer,
  options: FabEventTransactionOptions,
): FabLayerResolutionResult {
  const process = state.rulesProcess;
  if (!process)
    return failure(state, "The FAB layer-resolution process disappeared.", "stale_rules_process");
  // Persist outputBinding snapshots for answered at-resolution targets onto the
  // stack layer so later steps (and legalTargets scans) see them — e.g. Taylor's
  // binding-relative same-subtype equip filter after the banish target is chosen.
  const stagedLayer = stageAnsweredOutputBindings(
    state,
    layer,
    effectsForLayer(layer),
    [],
    process.effectChoices,
    process.effectTargets,
  );
  if (stagedLayer !== layer) {
    const idx = state.rulesStack.findIndex((candidate) => candidate.layerId === layer.layerId);
    if (idx >= 0) state.rulesStack[idx] = stagedLayer;
    layer = stagedLayer;
  }
  // Pre-stage deterministic output bindings (e.g. reveal → "it") so conditionals
  // in later steps evaluate correctly during the decision scan.
  const preBound = stageDeterministicOutputBindings(
    state,
    layer,
    effectsForLayer(layer),
    [],
    process.effectChoices,
    process.effectTargets,
  );
  if (preBound !== layer) {
    const idx2 = state.rulesStack.findIndex((c) => c.layerId === layer.layerId);
    if (idx2 >= 0) state.rulesStack[idx2] = preBound;
    layer = preBound;
  }
  const pending = firstUnansweredDecision(
    state,
    layer,
    process.effectChoices,
    process.effectPartitions,
    process.effectOptions,
    process.effectTargets,
  );
  if (pending) {
    // Progressive sequence flush: commit decisionless prefix steps (draw, …)
    // before opening a later step's decision so hand/deck candidates see
    // intermediate zone changes (PEN299 Two-Faced: draw then look at hand).
    const flushed = flushSequencePrefixBeforeDecision(
      state,
      layer,
      process,
      options,
      pending.decision.path,
      advanceFabLayerResolution,
      pending.decision.kind === "repeat-commit" ? pending.decision : undefined,
    );
    if (flushed) return flushed;
    if (pending.decision.kind === "repeat-start") {
      const decision = pending.decision;
      const initialized = {
        ...pending.layer,
        repeatFrames: {
          ...pending.layer.repeatFrames,
          [decision.repeatPath.join(".")]: {
            original: decision.effect,
            index: 0,
            limit: decision.limit,
            accepted: false,
            progressed: false,
          },
        },
      };
      const index = state.rulesStack.findIndex((candidate) => candidate.layerId === layer.layerId);
      if (index < 0) return failure(state, "Repeat layer disappeared.", "stale_rules_process");
      state.rulesStack[index] = initialized;
      return advanceFabLayerResolution(state, initialized, options);
    }

    if (pending.decision.kind === "payment-commit") {
      return commitResolutionEffectPayment(
        state,
        pending.layer,
        process,
        options,
        pending.decision,
        advanceFabLayerResolution,
      );
    }

    if (
      pending.decision.kind === "optional" &&
      pending.layer.kind === "triggered" &&
      pending.layer.optionalTriggerAutomation !== undefined &&
      optionalChooserActorId(pending.layer, state, pending.decision.effect.chooser) ===
        pending.layer.optionalTriggerAutomation.ownerId
    ) {
      process.effectChoices[pending.decision.path.join(".")] =
        pending.layer.optionalTriggerAutomation.ownerChoice === "accept";
      return advanceFabLayerResolution(state, pending.layer, options);
    }

    // Use the layer that discovered the decision (for-each rebinds
    // iteration-subject on a subject layer). Scans and choosers must see that
    // binding; the ability controllerId stays on the subject layer.
    return dispatchLayerDecision({
      state,
      layer: pending.layer,
      process,
      options,
      decision: pending.decision,
      firstRequiredAtResolutionTarget,
      failure,
      advance: advanceFabLayerResolution,
    });
  }

  const committedConditionBarrier =
    committedClashBarrierPath(state, layer) ?? committedDamageConditionBarrierPath(layer);
  if (committedConditionBarrier) {
    const flushed = flushSequencePrefixBeforeDecision(
      state,
      layer,
      process,
      options,
      committedConditionBarrier,
      advanceFabLayerResolution,
    );
    if (flushed) return flushed;
  }

  const choices = { ...process.effectChoices };
  const proposal = proposeLayerResolutionEvents(
    state,
    layer,
    process.processId,
    choices,
    process.effectPartitions,
    process.effectOptions,
    process.effectTargets,
    process.effectPaymentPitches ?? {},
  );
  if (!proposal.supported)
    return failure(
      state,
      `Cannot resolve ${layer.layerId}: ${proposal.reason}`,
      "unsupported_rules_effect",
    );
  const groups = proposal.eventGroups ?? (proposal.events.length > 0 ? [proposal.events] : []);
  const proposalRemovesResolvingLayer = groups.some((events) =>
    events.some(
      (event) => event.name === "remove-rules-layer" && event.data.layerId === layer.layerId,
    ),
  );
  const { hasNextCardResolutionStep, hasNextAbilityOnSameFace } = cardResolutionCursor(layer);
  const removeLayerGroup: FabProposedEventGroup = {
    eventGroupId: `${process.processId}:remove-layer`,
    required: true,
    events: [
      {
        name: "remove-rules-layer",
        processId: process.processId,
        cause: {
          kind: "layer",
          layerId: layer.layerId,
          source: layer.source,
          controllerId: layer.controllerId,
        },
        controllerId: layer.controllerId,
        source: layer.source,
        affected: [layer.source],
        bindings: layer.bindings,
        data: { layerId: layer.layerId, reason: "resolved" },
      },
    ],
  };
  process.resolutionEventGroups = [
    ...groups.map((events, index) => ({
      eventGroupId: `${process.processId}:resolution-${index + 1}`,
      // A resolved effect's continuous rule and card cleanup must commit.
      // Optional journal groups are intentionally droppable for optional
      // choices, but a generated continuous effect is the resolution itself.
      required: events.some(
        (event) =>
          event.name === "continuous-effect-generated" ||
          event.name === "clash-prize" ||
          ((event.name === "move-zone" || event.name === "enter-arena") &&
            "reason" in event.data &&
            event.data.reason === "resolve" &&
            event.data.object.instanceId === layer.source.instanceId),
      ),
      events,
    })),
    ...(hasNextCardResolutionStep || proposalRemovesResolvingLayer ? [] : [removeLayerGroup]),
  ];
  process.abilityStepContinuation =
    hasNextAbilityOnSameFace && layer.kind === "card"
      ? nextAbilityStepContinuation(layer, groups)
      : undefined;
  // Printed resolution abilities on one face resolve in order without a
  // priority boundary. Triggers generated by an earlier ability therefore
  // remain collected until the remaining same-face abilities have resolved.
  const resolved = executeFabEventJournalTransaction(
    state,
    process.resolutionEventGroups,
    hasNextAbilityOnSameFace ? { ...options, deferTriggerDeclaration: true } : options,
  );
  if (
    !resolved.committed &&
    ("suspendedForReplacementOrder" in resolved || "suspendedForContinuousOrder" in resolved)
  ) {
    return { accepted: true, state: resolved.state };
  }
  if (!resolved.committed) {
    return failure(
      state,
      `Cannot resolve ${layer.layerId}: ${resolved.failedEventGroupId}`,
      "rules_effect_journal_failed",
    );
  }
  if (hasNextCardResolutionStep && layer.kind === "card") {
    if (hasNextAbilityOnSameFace && process.abilityStepContinuation) {
      return {
        accepted: true,
        state: resumeAbilityStepAfterJournal(
          resolved.state,
          process.abilityStepContinuation,
          options,
          resolved.batches.flatMap((batch) => batch.events),
          advanceFabLayerResolution,
        ),
      };
    }
    return { accepted: true, state: advanceMultiFaceCursor(resolved.state, layer) };
  }
  return { accepted: true, state: resolved.state };
}
