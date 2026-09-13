import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabMatchState } from "../../state.ts";
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
): FabLayerResolutionResult | null {
  const context = sequencePrefixContext(state, layer, path);
  if (!context) return null;
  const { sequence, sequencePath, targetPath, resolutionLayer, stepIndex } = context;
  const flushKey = `seq-flush:${layer.layerId}:${sequencePath.join(".")}:${stepIndex}`;
  if (process.effectOptions[flushKey] === "done") return null;

  const prefix = sequence.steps.slice(0, stepIndex);
  // Prefix must be decisionless under current answers.
  for (const [index, step] of prefix.entries()) {
    const found = findDecision(
      state,
      resolutionLayer,
      step,
      [...sequencePath, index],
      `${targetPath}:step-${index}`,
      process.effectChoices,
      process.effectPartitions,
      process.effectOptions,
      process.effectTargets,
    );
    if (found) return null;
  }

  // Propose prefix leaves in order.
  const events: ProposedEvent[] = [];
  let proposalState = state;
  let proposalLayer = resolutionLayer;
  for (const [index, step] of prefix.entries()) {
    const ctx: ProposalContext = {
      state: proposalState,
      layer: proposalLayer,
      processId: process.processId,
      effectPath: [...sequencePath, index],
      targetPath: `${targetPath}:step-${index}`,
      effectChoices: process.effectChoices,
      effectPartitions: process.effectPartitions,
      effectOptions: process.effectOptions,
      effectTargets: process.effectTargets,
      effectPaymentPitches: process.effectPaymentPitches ?? {},
    };
    const result = proposeEffect(ctx, step);
    if (!result.supported) return null;
    events.push(...result.events);
    // Cheap zone simulation for subsequent proposals in this flush only.
    proposalState =
      applyDeterminedPrefixStepToClone(proposalState, proposalLayer, step) ?? proposalState;
  }
  if (events.length === 0) {
    // Still rewrite remaining so we don't loop.
    rewriteLayerEffectToSequenceSuffix(state, layer, sequencePath, targetPath, stepIndex, false);
    process.effectOptions[flushKey] = "done";
    return advance(state, layer, options);
  }

  process.effectOptions[flushKey] = "done";
  const savedOptions = { ...process.effectOptions, [flushKey]: "done" };
  process.resolutionEventGroups = [
    {
      eventGroupId: `${process.processId}:seq-prefix-${stepIndex}`,
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
    eventGroupId: process.resolutionEventGroups[0]!.eventGroupId,
    layerId: layer.layerId,
    sequencePath,
    targetPath,
    fromStep: stepIndex,
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
  nextProcess.effectOptions = { ...continuation.effectOptions };
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
  const boundLayer = {
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
  rewriteLayerEffectToSequenceSuffix(
    nextState,
    boundLayer,
    continuation.sequencePath,
    continuation.targetPath,
    continuation.fromStep,
    committedPrefixEvents.length > 0,
  );
  const rewritten =
    nextState.rulesStack.find((c) => c.layerId === continuation.layerId) ?? boundLayer;
  const resumed = advance(nextState, rewritten, options);
  if (!resumed.accepted) throw new Error(resumed.error);
  return resumed.state;
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
  if (node.type === "if-you-do" && fromStep === 1) {
    nextEffect = prefixCommitted ? node.then : node.effect;
  } else if (node.type === "sequence") {
    const remaining = node.steps.slice(fromStep);
    if (remaining.length === 0) return;
    nextEffect = remaining.length === 1 ? remaining[0]! : { type: "sequence", steps: remaining };
  } else {
    return;
  }
  const rewrittenRoot = replaceEffectAtPath(root, sequencePath.slice(1), nextEffect);
  const idx = state.rulesStack.findIndex((c) => c.layerId === layer.layerId);
  if (idx < 0) return;
  const live = state.rulesStack[idx]!;
  const targets = rekeySequenceSuffixTargets(fabLayerTargets(live), targetPath, fromStep);
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
        )
      : null;
  }
  if (effect.type === "for-each") {
    const subjects = heroTargets(state, layer, effect.target, targetPath);
    const playerId = subjects?.[next];
    if (!playerId) return null;
    return findSequencePrefixContext(
      state,
      { ...layer, bindings: { ...layer.bindings, "iteration-subject": playerId } },
      effect.effect,
      decisionPath,
      cursor + 1,
      [...effectPath, next],
      `${targetPath}:for-each-${next}`,
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
        )
      : null;
  }
  if (effect.type === "optional") {
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
              i === index ? replaceEffectAtPath(step, rest, replacement) : step,
            ),
          }
        : effect;
    case "for-each":
    case "repeat":
      return { ...effect, effect: replaceEffectAtPath(effect.effect, rest, replacement) };
    case "if-you-do":
      return index === 0
        ? { ...effect, effect: replaceEffectAtPath(effect.effect, rest, replacement) }
        : index === 1
          ? { ...effect, then: replaceEffectAtPath(effect.then, rest, replacement) }
          : effect;
    case "conditional":
      return index === 0
        ? { ...effect, then: replaceEffectAtPath(effect.then, rest, replacement) }
        : index === 1 && effect.else
          ? { ...effect, else: replaceEffectAtPath(effect.else, rest, replacement) }
          : effect;
    case "optional":
      return index === 0
        ? { ...effect, effect: replaceEffectAtPath(effect.effect, rest, replacement) }
        : index === 1 && effect.then
          ? { ...effect, then: replaceEffectAtPath(effect.then, rest, replacement) }
          : effect;
    case "choice":
      return effect.options[index]
        ? {
            ...effect,
            options: effect.options.map((option, i) =>
              i === index ? replaceEffectAtPath(option, rest, replacement) : option,
            ),
          }
        : effect;
    case "unless":
      return index === 0
        ? { ...effect, effect: replaceEffectAtPath(effect.effect, rest, replacement) }
        : index === 1
          ? { ...effect, escape: replaceEffectAtPath(effect.escape, rest, replacement) }
          : effect;
    default:
      return effect;
  }
}
