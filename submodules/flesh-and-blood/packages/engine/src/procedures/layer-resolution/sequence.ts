import { snapshotObject } from "../../rules/snapshots.ts";
import { starRepeatTerminalHolds } from "../../rules/proposals/effects/repeat.ts";
import type { FabUnansweredLayerDecision } from "../../rules/decision-dispatch/decision-types.ts";
import type { FabCondition, FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabMatchState } from "../../state.ts";
import { sequenceStepEffect } from "../../rules/proposals/effects/sequence.ts";
import { proposeEffect } from "../../rules/effect-event-proposals.ts";
import type { ProposedEvent } from "../../rules/events.ts";
import {
  activeFabCardResolutionStep,
  fabLayerTargets,
  type FabRulesStackLayer,
} from "../../rules/layers.ts";
import type { FabRulesProcess } from "../../rules/process.ts";
import { executeFabEventJournalTransaction } from "../../kernel/transaction/index.ts";
import { type FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import type { FabLayerResolutionResult } from "../../rules/decision-dispatch/result.ts";
import { startFabRulesProcess } from "../../kernel/process-state.ts";
import {
  conditionHolds,
  heroTargets,
  layerWithEventBindings,
  type ProposalContext,
} from "../../rules/proposals/shared.ts";
import { sharedConditionalBranchTarget } from "../../rules/conditional-targets.ts";
import { reanchorFabBindingsThroughCommittedMoves } from "../../rules/binding-reanchor.ts";
import { applyDeterminedPrefixStepToClone, findDecision } from "./find-decision.ts";
import { failure, resolutionProcess, type AdvanceLayerResolution } from "./process.ts";
import { effectsForLayer } from "./meld.ts";
import { transitionFabRulesProcessStage } from "../../kernel/process-state.ts";

/**
 * Commit decisionless sequence prefix steps that precede an unanswered decision
 * path, then rewrite the layer effect to the remaining suffix and re-enter
 * advance. Returns null when no flush is needed/possible.
 */
export function flushSequencePrefixBeforeDecision(
  state: FabMatchState,
  layer: FabRulesStackLayer,
  process: FabRulesProcess,
  options: FabEventTransactionOptions,
  path: readonly number[],
  advance: AdvanceLayerResolution,
  repeatCommit?: Extract<FabUnansweredLayerDecision, { kind: "repeat-start" | "repeat-commit" }>,
): FabLayerResolutionResult | null {
  const context =
    sequencePrefixContext(state, layer, path) ??
    (repeatCommit
      ? {
          sequence: { type: "sequence" as const, steps: [repeatCommit.effect.effect] },
          sequencePath: repeatCommit.repeatPath,
          targetPath: repeatCommit.targetPath,
          resolutionLayer: layer,
          stepIndex: 1,
          repeatIndex: repeatCommit.index,
        }
      : null);
  if (!context) return null;
  const { sequence, sequencePath, targetPath, resolutionLayer, stepIndex, forEach, repeatIndex } =
    context;
  const rootEffect = effectsForLayer(layer)[sequencePath[0]!];
  const prefixNode = rootEffect ? effectAtPath(rootEffect, sequencePath.slice(1)) : null;
  const principalTargetSuffix =
    repeatIndex !== undefined
      ? `repeat-${repeatIndex}`
      : prefixNode?.type === "optional" || prefixNode?.type === "if-you-do"
        ? "effect"
        : null;
  const forEachNode =
    forEach && rootEffect ? effectAtPath(rootEffect, forEach.path.slice(1)) : null;
  const subjectPlan =
    forEachNode && forEachNode.type === "for-each" && forEach
      ? planForEachSubjectFlushUnits(
          state,
          process,
          resolutionLayer,
          sequence,
          sequencePath,
          stepIndex,
          { node: forEachNode, record: forEach },
        )
      : null;
  if (subjectPlan && process.effectOptions[subjectPlan.flushedKey] === "done") return null;
  // A subject-planned flush falls back to the single-unit plan when the
  // enclosing for-each cannot be replayed per subject (nested loops,
  // synthetic if-you-do sequences). The flushed subject's own prefix is then
  // planned exactly as before this generalization.
  const units = subjectPlan?.units ?? [
    {
      key: `seq-flush:${layer.layerId}:${sequencePath.join(".")}:${stepIndex}`,
      sequencePath,
      targetPath,
      layer: resolutionLayer,
      boundary: stepIndex,
    },
  ];
  if (!subjectPlan && process.effectOptions[units[0]!.key] === "done") return null;
  const boundary = units[0]!.boundary;
  // Freeze decisions per hero before any prefix changes their life or zones.
  // The loop body is shared, so replacing a condition with `true` would also
  // admit heroes whose branch was never entered.
  const frozenConditions: Record<string, FabCondition> = {};
  if (forEachNode?.type === "for-each" && forEach) {
    const trail = sequencePath.slice(forEach.path.length + 1);
    for (let offset = 0; offset < trail.length; offset += 1) {
      const node = effectAtPath(forEachNode.effect, trail.slice(0, offset));
      if (node?.type !== "conditional") continue;
      const nodePath = sequencePath.slice(0, forEach.path.length + 1 + offset);
      const binding = `sequence-branch:${layer.layerId}:${nodePath.join(".")}`;
      const qualified = forEach.subjects.filter((playerId) =>
        conditionHolds(
          state,
          {
            ...resolutionLayer,
            bindings: { ...resolutionLayer.bindings, "iteration-subject": playerId },
          },
          node.condition,
        ),
      );
      const heroes = qualified.flatMap((playerId) => {
        const heroId = state.containers.zonesByPlayerId[playerId]?.heroZone[0];
        return heroId ? [snapshotObject(state, heroId, playerId, "heroZone")] : [];
      });
      layer = { ...layer, bindings: { ...layer.bindings, [binding]: heroes } };
      frozenConditions[nodePath.join(".")] = {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "hero",
          player: "iteration-subject",
          filter: { inObjectBinding: binding },
        },
        comparison: { op: "gt", value: 0 },
      };
    }
  }
  const frozenLayerIndex = state.rulesStack.findIndex(
    (candidate) => candidate.layerId === layer.layerId,
  );
  if (frozenLayerIndex >= 0) state.rulesStack[frozenLayerIndex] = layer;

  // Prefix must be decisionless under current answers.
  for (const unit of units) {
    for (const [index, step] of sequence.steps.slice(0, unit.boundary).entries()) {
      const found = findDecision(
        state,
        unit.layer,
        step,
        [...unit.sequencePath, repeatIndex ?? index],
        principalTargetSuffix
          ? `${unit.targetPath}:${principalTargetSuffix}`
          : `${unit.targetPath}:step-${index}`,
        process.effectChoices,
        process.effectPartitions,
        process.effectOptions,
        process.effectTargets,
      );
      if (found) return null;
    }
  }

  // Propose prefix leaves in order, one unit per subject (loop order).
  const events: ProposedEvent[] = [];
  let principalAlreadyCommitted = false;
  let proposalState = state;
  for (const unit of units) {
    let proposalLayer = unit.layer;
    for (const [index, step] of sequence.steps.slice(0, unit.boundary).entries()) {
      const ctx: ProposalContext = {
        state: proposalState,
        layer: proposalLayer,
        processId: process.processId,
        effectPath: [...unit.sequencePath, repeatIndex ?? index],
        targetPath: principalTargetSuffix
          ? `${unit.targetPath}:${principalTargetSuffix}`
          : `${unit.targetPath}:step-${index}`,
        effectChoices: process.effectChoices,
        effectPartitions: process.effectPartitions,
        effectOptions: process.effectOptions,
        effectTargets: process.effectTargets,
        effectPaymentPitches: process.effectPaymentPitches ?? {},
      };
      const effective = sequenceStepEffect(proposalState, proposalLayer, sequence.steps, index);
      if (!effective) continue;
      const result = proposeEffect(ctx, effective);
      if (!result.supported) return null;
      principalAlreadyCommitted ||= result.outcome === "committed";
      events.push(...result.events);
      // Cheap zone simulation for subsequent proposals in this flush only.
      proposalState =
        applyDeterminedPrefixStepToClone(proposalState, proposalLayer, effective) ?? proposalState;
      proposalLayer = layerWithEventBindings(proposalLayer, result.events);
    }
  }
  if (events.length === 0) {
    // Still rewrite remaining so we don't loop.
    if (repeatIndex !== undefined) {
      finishRepeatIteration(state, layer, sequencePath, process, principalAlreadyCommitted);
    } else {
      rememberRepeatProgress(state, layer, sequencePath, process, principalAlreadyCommitted);
      rewriteLayerEffectToSequenceSuffix(
        state,
        layer,
        sequencePath,
        targetPath,
        boundary,
        principalAlreadyCommitted,
        frozenConditions,
      );
    }
    process.effectOptions = ancestorPathEntries(process.effectOptions, sequencePath);
    // The rewrite replaced the sequence with its suffix inside the stack, so
    // effect paths re-base (Cull's step 1 moves from [0,1] to [0]). Recursing
    // with the stale pre-rewrite layer published the decision under the old
    // path and orphaned the player's answer when the rewritten layer next
    // resolved — re-read the updated layer before continuing.
    const updatedLayer =
      state.rulesStack.find((candidate) => candidate.layerId === layer.layerId) ?? layer;
    return advance(state, updatedLayer, options);
  }

  for (const unit of units) process.effectOptions[unit.key] = "done";
  const savedOptions = { ...process.effectOptions };
  rememberRepeatProgress(state, layer, sequencePath, process, principalAlreadyCommitted);
  layer = state.rulesStack.find((candidate) => candidate.layerId === layer.layerId) ?? layer;
  process.resolutionEventGroups = [
    {
      eventGroupId: `${process.processId}:seq-prefix-${boundary}`,
      // A prefix has already passed target/choice validation. Individual
      // leaves may nevertheless reduce to a legal no-op (for example a
      // card is already face-up by the time a “turn it face-up, then …”
      // sequence resolves). That must not roll back the answered decision
      // or suppress the remaining suffix; only an invalid procedure is
      // atomic-failure material.
      required: false,
      events,
    },
  ];
  process.sequencePrefixContinuation = {
    frozenConditions,
    repeatIndex,
    eventGroupId: process.resolutionEventGroups[0]!.eventGroupId,
    layerId: layer.layerId,
    sequencePath,
    targetPath,
    fromStep: boundary,
    ancestorEffectChoices: ancestorPathEntries(process.effectChoices, sequencePath),
    ancestorEffectPartitions: ancestorPathEntries(process.effectPartitions, sequencePath),
    ancestorEffectTargets: ancestorPathEntries(process.effectTargets, sequencePath),
    effectOptions: savedOptions,
    events,
  };
  // Snapshot process fields we must restore: full journal commit settles and
  // clears rulesProcess when there is no parent procedure.
  // The nested resolver may bind an iteration subject. Keep that LKI on the
  // live layer while its sequence suffix is resumed after the prefix journal.
  const layerIndex = state.rulesStack.findIndex((candidate) => candidate.layerId === layer.layerId);
  if (layerIndex >= 0) {
    state.rulesStack[layerIndex] = {
      ...layer,
      bindings: { ...layer.bindings, ...resolutionLayer.bindings },
    };
  }
  const resolved = executeFabEventJournalTransaction(state, process.resolutionEventGroups, {
    ...options,
    deferTriggerDeclaration: true,
  });
  if (!resolved.committed) {
    if ("suspendedForReplacementOrder" in resolved || "suspendedForContinuousOrder" in resolved) {
      return { accepted: true, state: resolved.state };
    }
    return failure(
      state,
      `Cannot resolve ${layer.layerId} sequence prefix: ${resolved.failedEventGroupId}`,
      "rules_effect_journal_failed",
    );
  }
  return {
    accepted: true,
    state: resumeSequencePrefixAfterJournal(
      resolved.state,
      process.sequencePrefixContinuation,
      options,
      resolved.batches.flatMap((batch) => batch.events),
      advance,
    ),
  };
}

type PlannedFlushUnit = {
  readonly key: string;
  readonly sequencePath: readonly number[];
  readonly targetPath: string;
  readonly layer: FabRulesStackLayer;
  readonly boundary: number;
};

/**
 * The flushed sequence node inside a for-each is shared by every subject.
 * Committing only the flushed subject's prefix and rewriting the shared node
 * to its suffix would drop every other subject's uncommitted prefix (their
 * lose-life, say) from the tree. Plan one flush unit per subject whose branch
 * reaches the sequence instead: every included subject's prefix commits in
 * this single transaction, which makes the shared-node rewrite valid for all
 * of them (Spur Locked tie: both tied heroes pay before either search asks).
 *
 * The shared rewrite boundary is the earliest first-pending step across the
 * included subjects, so no subject's pending-or-later steps are stripped.
 * Returns null when the enclosing for-each cannot be replayed per subject;
 * the caller then falls back to the single-unit plan.
 */
function planForEachSubjectFlushUnits(
  state: Readonly<FabMatchState>,
  process: FabRulesProcess,
  resolutionLayer: FabRulesStackLayer,
  sequence: Extract<FabEffect, { readonly type: "sequence" }>,
  sequencePath: readonly number[],
  flushedStepIndex: number,
  forEach: {
    node: Extract<FabEffect, { readonly type: "for-each" }>;
    record: NonNullable<SequencePrefixContext["forEach"]>;
  },
): { flushedKey: string; units: readonly PlannedFlushUnit[] } | null {
  const trail = sequencePath.slice(forEach.record.path.length + 1);
  let flushedCandidate: {
    readonly keyPath: readonly number[];
    readonly target: string;
    readonly boundary: number;
  } | null = null;
  const candidates: {
    readonly keyPath: readonly number[];
    readonly layer: FabRulesStackLayer;
    readonly target: string;
    readonly boundary: number;
  }[] = [];
  for (const [index, playerId] of forEach.record.subjects.entries()) {
    const subjectLayer = {
      ...resolutionLayer,
      bindings: { ...resolutionLayer.bindings, "iteration-subject": playerId },
    };
    const subjectPath = [...forEach.record.path, index, ...trail];
    const subjectTarget = descendSubjectTrail(
      state,
      subjectLayer,
      forEach.node.effect,
      trail,
      `${forEach.record.targetPath}:for-each-${index}`,
      sequence,
    );
    if (subjectTarget === null) {
      // The subject resolves through another branch, or the trail cannot be
      // replayed. Only the flushed subject must be replannable — the context
      // walk reached the sequence through its branch by construction.
      if (index === forEach.record.subjectIndex) return null;
      continue;
    }
    const firstPending = sequence.steps.findIndex((step, stepIdx) =>
      findDecision(
        state,
        subjectLayer,
        step,
        [...subjectPath, stepIdx],
        `${subjectTarget}:step-${stepIdx}`,
        process.effectChoices,
        process.effectPartitions,
        process.effectOptions,
        process.effectTargets,
      ),
    );
    const candidate = {
      keyPath: subjectPath,
      layer: subjectLayer,
      target: subjectTarget,
      boundary: firstPending === -1 ? sequence.steps.length : firstPending,
    };
    candidates.push(candidate);
    if (index === forEach.record.subjectIndex) flushedCandidate = candidate;
  }
  if (!flushedCandidate) return null;
  // The shared rewrite boundary is the earliest first-pending step across the
  // included subjects so no subject's pending-or-later steps are stripped.
  const boundary = Math.min(flushedStepIndex, ...candidates.map((candidate) => candidate.boundary));
  const keyFor = (keyPath: readonly number[]) =>
    `seq-flush:${resolutionLayer.layerId}:${keyPath.join(".")}:${boundary}`;
  return {
    flushedKey: keyFor(flushedCandidate.keyPath),
    units: candidates.map((candidate) => ({
      key: keyFor(candidate.keyPath),
      sequencePath: candidate.keyPath,
      targetPath: candidate.target,
      layer: candidate.layer,
      boundary,
    })),
  };
}

/**
 * Replay the flushed subject's branch trail for another subject, re-evaluating
 * conditionals per subject. Returns the subject's target path for the flushed
 * sequence, or null when their branch diverges (their resolution never reaches
 * this sequence) or the trail crosses a node type that cannot be replayed.
 */
function descendSubjectTrail(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  start: FabEffect,
  trail: readonly number[],
  baseTarget: string,
  flushed: FabEffect,
): string | null {
  let node = start;
  let targetPath = baseTarget;
  for (const segment of trail) {
    if (node === flushed) return targetPath;
    switch (node.type) {
      case "sequence": {
        const step = node.steps[segment];
        if (!step) return null;
        targetPath = `${targetPath}:step-${segment}`;
        node = step;
        break;
      }
      case "conditional": {
        const branchIndex = conditionHolds(state, layer, node.condition) ? 0 : 1;
        if (segment !== branchIndex) return null;
        const branch = branchIndex === 0 ? node.then : node.else;
        if (!branch) return null;
        targetPath = sharedConditionalBranchTarget(node)
          ? `${targetPath}:then`
          : `${targetPath}:${branchIndex === 0 ? "then" : "else"}`;
        node = branch;
        break;
      }
      case "if-you-do": {
        if (segment !== 0 && segment !== 1) return null;
        const branch = segment === 0 ? node.effect : node.then;
        targetPath = `${targetPath}:${segment === 0 ? "effect" : "then"}`;
        node = branch;
        break;
      }
      case "optional": {
        const branch = segment === 0 ? node.effect : node.then;
        if (branch === undefined) return null;
        targetPath = `${targetPath}:${segment === 0 ? "effect" : "then"}`;
        node = branch;
        break;
      }
      case "choice": {
        const branch = node.options[segment];
        if (!branch) return null;
        targetPath = `${targetPath}:option-${segment}`;
        node = branch;
        break;
      }
      case "unless": {
        if (segment !== 0 && !(segment === 1 && node.escape)) return null;
        targetPath = `${targetPath}:${segment === 0 ? "unless" : "unless-escape"}`;
        node = segment === 0 ? node.effect : node.escape;
        break;
      }
      case "for-each":
      case "repeat":
        // Nested loops are not replayed per subject; the caller falls back.
        return null;
      default:
        return null;
    }
  }
  return node === flushed ? targetPath : null;
}

/**
 * Find a sequence boundary whose next conditional reads whether an earlier
 * damage event actually committed. That fact is unknowable during proposal:
 * CR 6.4 replacements may prevent or redirect the packet. The caller flushes
 * the returned prefix through the real transaction pipeline before evaluating
 * the conditional suffix.
 */
export function committedDamageConditionBarrierPath(
  layer: FabRulesStackLayer,
): readonly number[] | null {
  for (const [index, effect] of effectsForLayer(layer).entries()) {
    const found = committedDamageBarrierInEffect(effect, [index]);
    if (found) return found;
  }
  return null;
}

/** A following instruction must observe the committed clash, including reclashes. */
export function committedClashBarrierPath(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
): readonly number[] | null {
  function visit(effect: FabEffect, path: readonly number[]): readonly number[] | null {
    if (effect.type === "sequence") {
      for (const [index, step] of effect.steps.entries()) {
        if (index > 0 && effect.steps[index - 1]?.type === "clash") {
          return [...path, index];
        }
        const nested = visit(step, [...path, index]);
        if (nested) return nested;
      }
    } else if (effect.type === "conditional") {
      const branchIndex = conditionHolds(state, layer, effect.condition) ? 0 : 1;
      const branch = branchIndex === 0 ? effect.then : effect.else;
      return branch ? visit(branch, [...path, branchIndex]) : null;
    }
    return null;
  }
  for (const [index, effect] of effectsForLayer(layer).entries()) {
    const found = visit(effect, [index]);
    if (found) return found;
  }
  return null;
}

function committedDamageBarrierInEffect(
  effect: FabEffect,
  path: readonly number[],
): readonly number[] | null {
  if (effect.type === "sequence") {
    for (const [index, step] of effect.steps.entries()) {
      if (
        index > 0 &&
        step.type === "conditional" &&
        JSON.stringify(step.condition).includes('"dealt-damage-to-hero"')
      ) {
        return [...path, index];
      }
      const nested = committedDamageBarrierInEffect(step, [...path, index]);
      if (nested) return nested;
    }
  }
  return null;
}

export function resumeSequencePrefixAfterJournal(
  nextState: FabMatchState,
  continuation: NonNullable<FabRulesProcess["sequencePrefixContinuation"]>,
  options: FabEventTransactionOptions,
  committedPrefixEvents: readonly import("../../rules/events.ts").CommittedEvent[],
  advance: AdvanceLayerResolution,
): FabMatchState {
  const nextLayer = nextState.rulesStack.find((c) => c.layerId === continuation.layerId);
  if (!nextLayer) {
    throw new Error("Layer lost after sequence prefix flush.");
  }
  // Re-attach layer-resolution process if the journal settled it away.
  if (
    !nextState.rulesProcess ||
    nextState.rulesProcess.processId !== continuation.events[0]?.processId
  ) {
    const processId = continuation.events[0]?.processId;
    if (!processId) throw new Error("Sequence prefix has no process id.");
    startFabRulesProcess(nextState, resolutionProcess(processId, continuation.layerId, null));
  }
  const nextProcess = nextState.rulesProcess!;
  transitionFabRulesProcessStage(nextProcess, "layer-resolution");
  nextProcess.resolvingLayerId = continuation.layerId;
  nextProcess.effectTargets = { ...continuation.ancestorEffectTargets };
  nextProcess.effectChoices = { ...continuation.ancestorEffectChoices };
  nextProcess.effectPartitions = { ...continuation.ancestorEffectPartitions };
  // The prefix is removed below. Its completed guard paths are no longer
  // identities of the rebased suffix, which can contain another boundary at
  // exactly the same path (clash, movement, then another clash).
  // Option answers inside the removed prefix are not answers to the suffix.
  // Retain only wrapper decisions, just as for targets and boolean choices.
  nextProcess.effectOptions = ancestorPathEntries(
    continuation.effectOptions,
    continuation.sequencePath,
  );
  nextProcess.resolutionEventGroups = [];
  nextProcess.sequencePrefixContinuation = undefined;
  // Prefix events may bind a real object for the remaining sequence (for
  // example, create a Crouching Tiger, then "you may play it").  The prefix
  // is committed before we open the later decision, so carry those bindings
  // onto the surviving layer before rewriting it to its suffix.
  // Bind from what actually committed, not from the pre-replacement proposal.
  // A prevention can reduce a proposed damage packet to zero; using the
  // proposal here would make "deals damage" riders fire despite CR 6.4.
  let proposedBoundLayer = layerWithEventBindings(nextLayer, committedPrefixEvents);
  const committedDamage = committedPrefixEvents.filter(
    (event) => event.name === "deal-damage" || event.name === "dealt-damage",
  );
  const crossedDamageBoundary =
    committedDamage.length > 0 || committedPrefixEvents.some((event) => event.name === "prevent");
  if (crossedDamageBoundary) {
    const dealtDamageToHero = committedDamage.some(
      (event) =>
        event.data.amount > 0 && "kind" in event.data.target && event.data.target.kind === "hero",
    );
    proposedBoundLayer = {
      ...proposedBoundLayer,
      bindings: {
        ...proposedBoundLayer.bindings,
        "dealt-damage-to-hero": dealtDamageToHero ? "true" : "false",
      },
    };
  }
  let boundLayer = {
    ...proposedBoundLayer,
    bindings: reanchorFabBindingsThroughCommittedMoves(
      nextState,
      proposedBoundLayer.bindings,
      committedPrefixEvents,
    ),
  };
  const nextLayerIndex = nextState.rulesStack.findIndex(
    (candidate) => candidate.layerId === continuation.layerId,
  );
  if (nextLayerIndex >= 0) nextState.rulesStack[nextLayerIndex] = boundLayer;
  rememberRepeatProgress(
    nextState,
    boundLayer,
    continuation.sequencePath,
    nextProcess,
    committedPrefixEvents.length > 0,
  );
  boundLayer =
    nextState.rulesStack.find((candidate) => candidate.layerId === boundLayer.layerId) ??
    boundLayer;
  if (continuation.repeatIndex !== undefined) {
    finishRepeatIteration(
      nextState,
      boundLayer,
      continuation.sequencePath,
      nextProcess,
      committedPrefixEvents.length > 0,
    );
  } else {
    rewriteLayerEffectToSequenceSuffix(
      nextState,
      boundLayer,
      continuation.sequencePath,
      continuation.targetPath,
      continuation.fromStep,
      committedPrefixEvents.length > 0,
      continuation.frozenConditions,
    );
  }
  const rewritten =
    nextState.rulesStack.find((c) => c.layerId === continuation.layerId) ?? boundLayer;
  const resumed = advance(nextState, rewritten, options);
  if (!resumed.accepted) throw new Error(resumed.error);
  return resumed.state;
}

/** Keep loop-control outcomes separate from rebased optional answer paths. */
function rememberRepeatProgress(
  state: FabMatchState,
  layer: FabRulesStackLayer,
  path: readonly number[],
  process: FabRulesProcess,
  progressed: boolean,
): void {
  if (!layer.repeatFrames) return;
  const frames = { ...layer.repeatFrames };
  for (const [key, frame] of Object.entries(frames)) {
    const loopPath = key.split(".").map(Number);
    if (!loopPath.every((segment, index) => path[index] === segment)) continue;
    const iterationKey = `${key}.${frame.index}`;
    const accepted = Object.entries(process.effectChoices).some(
      ([choiceKey, value]) =>
        value && (choiceKey === iterationKey || choiceKey.startsWith(`${iterationKey}.`)),
    );
    frames[key] = {
      ...frame,
      accepted: frame.accepted || accepted,
      progressed: frame.progressed || progressed,
    };
  }
  const index = state.rulesStack.findIndex((candidate) => candidate.layerId === layer.layerId);
  if (index >= 0) state.rulesStack[index] = { ...state.rulesStack[index]!, repeatFrames: frames };
}

function finishRepeatIteration(
  state: FabMatchState,
  layer: FabRulesStackLayer,
  path: readonly number[],
  process: FabRulesProcess,
  progressed: boolean,
): void {
  const key = path.join(".");
  const frame = layer.repeatFrames?.[key];
  if (!frame) throw new Error("Repeat cursor disappeared before its iteration committed.");
  const root = effectsForLayer(layer)[path[0]!];
  const current = root ? effectAtPath(root, path.slice(1)) : null;
  if (current?.type !== "repeat")
    throw new Error("Repeat continuation no longer points at a loop.");
  const iterationKey = `${key}.${frame.index}`;
  const accepted =
    frame.accepted ||
    Object.entries(process.effectChoices).some(
      ([choiceKey, value]) =>
        value && (choiceKey === iterationKey || choiceKey.startsWith(`${iterationKey}.`)),
    );
  const until = frame.original.until;
  const terminal =
    until === "declined"
      ? !accepted
      : until !== undefined
        ? conditionHolds(state, layer, until)
        : false;
  const stop =
    frame.index + 1 >= frame.limit ||
    terminal ||
    (!progressed && !frame.progressed) ||
    (until !== undefined && starRepeatTerminalHolds(current.effect, state, layer));
  const frames = { ...layer.repeatFrames };
  if (stop) delete frames[key];
  else frames[key] = { ...frame, index: frame.index + 1, accepted: false, progressed: false };
  const index = state.rulesStack.findIndex((candidate) => candidate.layerId === layer.layerId);
  if (index < 0) throw new Error("Repeat layer disappeared.");
  const updated = { ...layer, repeatFrames: frames };
  state.rulesStack[index] = updated;
  installEffectAtPath(
    state,
    updated,
    path,
    stop ? { type: "sequence", steps: [] } : frame.original,
  );
  process.effectChoices = ancestorPathEntries(process.effectChoices, path);
  process.effectPartitions = ancestorPathEntries(process.effectPartitions, path);
  process.effectTargets = ancestorPathEntries(process.effectTargets, path);
  process.effectOptions = ancestorPathEntries(process.effectOptions, path);
}

/**
 * A prefix commit rewrites only the selected sequence. Decisions on wrappers
 * that contain that sequence (for example an accepted outer optional) remain
 * authoritative; answers inside the rewritten sequence would use stale paths.
 */
function ancestorPathEntries<T>(
  entries: Readonly<Record<string, T>>,
  sequencePath: readonly number[],
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(entries).filter(([key]) => {
      const path = key.split(".").map(Number);
      return (
        path.length < sequencePath.length &&
        path.every((segment, index) => Number.isInteger(segment) && sequencePath[index] === segment)
      );
    }),
  );
}

function rewriteLayerEffectToSequenceSuffix(
  state: FabMatchState,
  layer: FabRulesStackLayer,
  sequencePath: readonly number[],
  targetPath: string,
  fromStep: number,
  prefixCommitted = true,
  frozenConditions: Readonly<Record<string, FabCondition>> = {},
): void {
  const effectIndex = sequencePath[0];
  if (effectIndex === undefined) return;
  const effects = effectsForLayer(layer);
  const root = effects[effectIndex];
  if (!root) return;
  const node = effectAtPath(root, sequencePath.slice(1));
  if (!node) return;
  // if-you-do prefix flush uses a synthetic [do X, then Y] sequence. The live
  // layer effect is still `if-you-do`. After a successful X, rewrite to Y so
  // X does not re-run (Insidious Chill). After a no-op X, keep X so Y does
  // not run (Crown of Reflection with no aura).
  let nextEffect: FabEffect;
  if ((node.type === "if-you-do" || (node.type === "optional" && node.then)) && fromStep === 1) {
    nextEffect = prefixCommitted && node.then ? node.then : node.effect;
  } else if (node.type === "sequence") {
    const remaining = node.steps.slice(fromStep);
    if (remaining.length === 0) return;
    nextEffect = remaining.length === 1 ? remaining[0]! : { type: "sequence", steps: remaining };
  } else {
    return;
  }
  const live = state.rulesStack.find((candidate) => candidate.layerId === layer.layerId);
  if (!live) return;
  const targets =
    node.type === "optional" || node.type === "if-you-do"
      ? Object.fromEntries(
          Object.entries(fabLayerTargets(live)).map(([key, value]) => {
            const prefix = `${targetPath}:${prefixCommitted ? "then" : "effect"}`;
            return [
              key === prefix || key.startsWith(`${prefix}:`)
                ? `${targetPath}${key.slice(prefix.length)}`
                : key,
              value,
            ];
          }),
        )
      : rekeySequenceSuffixTargets(fabLayerTargets(live), targetPath, fromStep);
  installEffectAtPath(state, layer, sequencePath, nextEffect, targets, frozenConditions);
}

function installEffectAtPath(
  state: FabMatchState,
  layer: FabRulesStackLayer,
  path: readonly number[],
  replacement: FabEffect,
  targets = fabLayerTargets(layer),
  frozenConditions: Readonly<Record<string, FabCondition>> = {},
): void {
  const effectIndex = path[0];
  if (effectIndex === undefined) return;
  const root = effectsForLayer(layer)[effectIndex];
  if (!root) return;
  const rewrittenRoot = replaceEffectAtPath(root, path.slice(1), replacement, frozenConditions, [
    effectIndex,
  ]);
  const idx = state.rulesStack.findIndex((candidate) => candidate.layerId === layer.layerId);
  if (idx < 0) return;
  const live = state.rulesStack[idx]!;
  if (live.kind === "triggered" && live.resolution.kind === "effect") {
    state.rulesStack[idx] = {
      ...live,
      targets,
      resolution: { kind: "effect", effect: rewrittenRoot },
    };
  } else if (live.kind === "triggered" && live.resolution.kind !== "effect") {
    // ability-backed triggered: replace ability.effect shape via resolution effect wrapper
    state.rulesStack[idx] = {
      ...live,
      targets,
      resolution: { kind: "effect", effect: rewrittenRoot },
    };
  } else if (live.kind === "activated") {
    state.rulesStack[idx] = { ...live, targets, effect: rewrittenRoot };
  } else if (live.kind === "card") {
    const activeStep = activeFabCardResolutionStep(live);
    const nextEffects = [...activeStep.effects];
    nextEffects[effectIndex] = rewrittenRoot;
    const steps = [...live.resolutionPlan.steps] as [typeof activeStep, ...(typeof activeStep)[]];
    steps[live.resolutionPlan.cursor] = { ...activeStep, effects: nextEffects, targets };
    state.rulesStack[idx] = {
      ...live,
      resolutionPlan: { ...live.resolutionPlan, steps },
    };
  }
}

/** Keep declaration-time targets addressable after removing sequence prefix steps. */
function rekeySequenceSuffixTargets(
  targets: ReturnType<typeof fabLayerTargets>,
  targetPath: string,
  fromStep: number,
): ReturnType<typeof fabLayerTargets> {
  const prefix = `${targetPath}:step-`;
  return Object.fromEntries(
    Object.entries(targets).map(([key, value]) => {
      if (!key.startsWith(prefix)) return [key, value];
      const suffix = key.slice(prefix.length);
      const match = /^(\d+)(.*)$/.exec(suffix);
      if (!match) return [key, value];
      const priorIndex = Number(match[1]);
      if (!Number.isInteger(priorIndex) || priorIndex < fromStep) return [key, value];
      return [`${prefix}${priorIndex - fromStep}${match[2]}`, value];
    }),
  );
}

type SequencePrefixContext = {
  readonly sequence: Extract<FabEffect, { readonly type: "sequence" }>;
  readonly sequencePath: readonly number[];
  readonly targetPath: string;
  readonly resolutionLayer: FabRulesStackLayer;
  readonly stepIndex: number;
  readonly repeatIndex?: number;
  readonly forEach?: {
    readonly path: readonly number[];
    readonly targetPath: string;
    readonly subjectIndex: number;
    readonly subjects: readonly string[];
  };
};

/**
 * Locate the deepest sequence that owns a pending decision.  Decision paths
 * and proposal target paths are traversed together so wrapper context (most
 * importantly a for-each subject) survives the prefix transaction.
 */
function sequencePrefixContext(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  decisionPath: readonly number[],
): SequencePrefixContext | null {
  const effectIndex = decisionPath[0];
  if (effectIndex === undefined) return null;
  const root = effectsForLayer(layer)[effectIndex];
  if (!root) return null;
  return findSequencePrefixContext(
    state,
    layer,
    root,
    decisionPath,
    1,
    [effectIndex],
    `effect-${effectIndex}`,
  );
}

function findSequencePrefixContext(
  state: Readonly<FabMatchState>,
  layer: FabRulesStackLayer,
  effect: FabEffect,
  decisionPath: readonly number[],
  cursor: number,
  effectPath: readonly number[],
  targetPath: string,
  enclosingForEach?: SequencePrefixContext["forEach"],
): SequencePrefixContext | null {
  const next = decisionPath[cursor];
  if (next === undefined) return null;
  if (effect.type === "sequence") {
    if (next > 0 && next < effect.steps.length) {
      return {
        sequence: effect,
        sequencePath: effectPath,
        targetPath,
        resolutionLayer: layer,
        stepIndex: next,
        forEach: enclosingForEach,
      };
    }
    const step = effect.steps[next];
    return step
      ? findSequencePrefixContext(
          state,
          layer,
          step,
          decisionPath,
          cursor + 1,
          [...effectPath, next],
          `${targetPath}:step-${next}`,
          enclosingForEach,
        )
      : null;
  }
  if (effect.type === "for-each") {
    const subjects = heroTargets(state, layer, effect.target, targetPath);
    const playerId = subjects?.[next];
    if (!playerId || !subjects) return null;
    return findSequencePrefixContext(
      state,
      { ...layer, bindings: { ...layer.bindings, "iteration-subject": playerId } },
      effect.effect,
      decisionPath,
      cursor + 1,
      [...effectPath, next],
      `${targetPath}:for-each-${next}`,
      { path: effectPath, targetPath, subjectIndex: next, subjects },
    );
  }
  if (effect.type === "repeat") {
    return findSequencePrefixContext(
      state,
      layer,
      effect.effect,
      decisionPath,
      cursor + 1,
      [...effectPath, next],
      `${targetPath}:repeat-${next}`,
      enclosingForEach,
    );
  }
  if (effect.type === "conditional") {
    const branch = next === 0 ? effect.then : next === 1 ? effect.else : undefined;
    if (!branch) return null;
    const branchTarget = sharedConditionalBranchTarget(effect)
      ? `${targetPath}:then`
      : `${targetPath}:${next === 0 ? "then" : "else"}`;
    return findSequencePrefixContext(
      state,
      layer,
      branch,
      decisionPath,
      cursor + 1,
      [...effectPath, next],
      branchTarget,
      enclosingForEach,
    );
  }
  if (effect.type === "if-you-do") {
    // Banish-then-may-play (HNT072) needs the same prefix flush as sequence:
    // commit "Do X" before asking the "If you do, you may …" optional so
    // outputBinding `it` is live for the play permission.
    if (next === 1) {
      return {
        sequence: { type: "sequence", steps: [effect.effect, effect.then] },
        sequencePath: effectPath,
        targetPath,
        resolutionLayer: layer,
        stepIndex: 1,
        forEach: enclosingForEach,
      };
    }
    const branch = next === 0 ? effect.effect : undefined;
    return branch
      ? findSequencePrefixContext(
          state,
          layer,
          branch,
          decisionPath,
          cursor + 1,
          [...effectPath, next],
          `${targetPath}:effect`,
          enclosingForEach,
        )
      : null;
  }
  if (effect.type === "optional") {
    if (next === 1 && effect.then) {
      return {
        sequence: { type: "sequence", steps: [effect.effect, effect.then] },
        sequencePath: effectPath,
        targetPath,
        resolutionLayer: layer,
        stepIndex: 1,
        forEach: enclosingForEach,
      };
    }
    const branch = next === 0 ? effect.effect : next === 1 ? effect.then : undefined;
    return branch
      ? findSequencePrefixContext(
          state,
          layer,
          branch,
          decisionPath,
          cursor + 1,
          [...effectPath, next],
          next === 0 ? `${targetPath}:effect` : `${targetPath}:then`,
          enclosingForEach,
        )
      : null;
  }
  if (effect.type === "choice") {
    const branch = effect.options[next];
    return branch
      ? findSequencePrefixContext(
          state,
          layer,
          branch,
          decisionPath,
          cursor + 1,
          [...effectPath, next],
          `${targetPath}:option-${next}`,
          enclosingForEach,
        )
      : null;
  }
  if (effect.type === "unless") {
    const branch = next === 0 ? effect.effect : next === 1 ? effect.escape : undefined;
    return branch
      ? findSequencePrefixContext(
          state,
          layer,
          branch,
          decisionPath,
          cursor + 1,
          [...effectPath, next],
          next === 0 ? `${targetPath}:unless` : `${targetPath}:unless-escape`,
          enclosingForEach,
        )
      : null;
  }
  return null;
}

function effectAtPath(effect: FabEffect, path: readonly number[]): FabEffect | null {
  if (path.length === 0) return effect;
  const [index, ...rest] = path;
  if (index === undefined) return null;
  switch (effect.type) {
    case "sequence":
      return effect.steps[index] ? effectAtPath(effect.steps[index]!, rest) : null;
    case "for-each":
    case "repeat":
      return effectAtPath(effect.effect, rest);
    case "if-you-do":
      return index === 0
        ? effectAtPath(effect.effect, rest)
        : index === 1
          ? effectAtPath(effect.then, rest)
          : null;
    case "conditional":
      return index === 0
        ? effectAtPath(effect.then, rest)
        : index === 1 && effect.else
          ? effectAtPath(effect.else, rest)
          : null;
    case "optional":
      return index === 0
        ? effectAtPath(effect.effect, rest)
        : index === 1 && effect.then
          ? effectAtPath(effect.then, rest)
          : null;
    case "choice":
      return effect.options[index] ? effectAtPath(effect.options[index]!, rest) : null;
    case "unless":
      return index === 0
        ? effectAtPath(effect.effect, rest)
        : index === 1
          ? effectAtPath(effect.escape, rest)
          : null;
    default:
      return null;
  }
}

function replaceEffectAtPath(
  effect: FabEffect,
  path: readonly number[],
  replacement: FabEffect,
  frozenConditions: Readonly<Record<string, FabCondition>> = {},
  nodePath: readonly number[] = [],
): FabEffect {
  if (path.length === 0) return replacement;
  const [index, ...rest] = path;
  if (index === undefined) return effect;
  switch (effect.type) {
    case "sequence":
      return effect.steps[index]
        ? {
            ...effect,
            steps: effect.steps.map((step, i) =>
              i === index
                ? replaceEffectAtPath(step, rest, replacement, frozenConditions, [
                    ...nodePath,
                    index,
                  ])
                : step,
            ),
          }
        : effect;
    case "for-each":
    case "repeat":
      return {
        ...effect,
        effect: replaceEffectAtPath(effect.effect, rest, replacement, frozenConditions, [
          ...nodePath,
          index,
        ]),
      };
    case "if-you-do":
      return index === 0
        ? {
            ...effect,
            effect: replaceEffectAtPath(effect.effect, rest, replacement, frozenConditions, [
              ...nodePath,
              index,
            ]),
          }
        : index === 1
          ? {
              ...effect,
              then: replaceEffectAtPath(effect.then, rest, replacement, frozenConditions, [
                ...nodePath,
                index,
              ]),
            }
          : effect;
    case "conditional":
      return index === 0
        ? {
            ...effect,
            // Entering the branch already evaluated this discrete condition.
            // Preserve its path for declared targets, but freeze that choice:
            // suffix events may replace the binding the condition originally read.
            condition: frozenConditions[nodePath.join(".")] ?? {
              type: "compare-amount",
              amount: 0,
              comparison: { op: "eq", value: 0 },
            },
            then: replaceEffectAtPath(effect.then, rest, replacement, frozenConditions, [
              ...nodePath,
              index,
            ]),
          }
        : index === 1 && effect.else
          ? {
              ...effect,
              condition: frozenConditions[nodePath.join(".")] ?? {
                type: "compare-amount",
                amount: 0,
                comparison: { op: "eq", value: 1 },
              },
              else: replaceEffectAtPath(effect.else, rest, replacement, frozenConditions, [
                ...nodePath,
                index,
              ]),
            }
          : effect;
    case "optional":
      return index === 0
        ? {
            ...effect,
            effect: replaceEffectAtPath(effect.effect, rest, replacement, frozenConditions, [
              ...nodePath,
              index,
            ]),
          }
        : index === 1 && effect.then
          ? {
              ...effect,
              then: replaceEffectAtPath(effect.then, rest, replacement, frozenConditions, [
                ...nodePath,
                index,
              ]),
            }
          : effect;
    case "choice":
      return effect.options[index]
        ? {
            ...effect,
            options: effect.options.map((option, i) =>
              i === index
                ? replaceEffectAtPath(option, rest, replacement, frozenConditions, [
                    ...nodePath,
                    index,
                  ])
                : option,
            ),
          }
        : effect;
    case "unless":
      return index === 0
        ? {
            ...effect,
            effect: replaceEffectAtPath(effect.effect, rest, replacement, frozenConditions, [
              ...nodePath,
              index,
            ]),
          }
        : index === 1
          ? {
              ...effect,
              escape: replaceEffectAtPath(effect.escape, rest, replacement, frozenConditions, [
                ...nodePath,
                index,
              ]),
            }
          : effect;
    default:
      return effect;
  }
}
