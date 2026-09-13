import {
  proposeGrandArchiveCardActivation,
  proposeGrandArchiveMaterialization,
} from "../../activation/activation.ts";
import type { GrandArchiveCommandFailure } from "../../../kernel/command-results.ts";
import type { GrandArchiveCommandHandlerContext } from "../../../commands/handler-context.ts";
import {
  proposeGrandArchiveAttackDeclaration,
  proposeGrandArchiveCombatCleanup,
} from "../../combat/combat.ts";
import { payGrandArchiveAbilityCost } from "../../activation/costs.ts";
import {
  GrandArchiveUnsupportedRuleError,
  type GrandArchiveEvaluationContext,
} from "../../effects/evaluation.ts";
import { resumeGrandArchiveEffectResolution } from "../../effects/stack-resolution.ts";
import { GrandArchiveDecisionAnswerCodec } from "../answer-codec.ts";
import type { GrandArchiveDecisionResolver } from "../types.ts";

function declarationFailure(
  match: GrandArchiveCommandHandlerContext,
  error: unknown,
): GrandArchiveCommandFailure {
  if (error instanceof GrandArchiveUnsupportedRuleError) {
    return match.failure("not-implemented", error.message);
  }
  if (error instanceof Error) return match.failure("illegal-command", error.message);
  throw error;
}

export const resolveGrandArchiveEffectMaterializationAnnouncementDecision: GrandArchiveDecisionResolver<
  "announce-effect-materialization"
> = ({ match, decision, command, playerId }) => {
  const state = match.getState();
  const resolution = state.resolution;
  if (!resolution || resolution.stackItemId !== decision.stackItemId) {
    return match.failure("illegal-command", "Effect resolution is no longer suspended");
  }
  const pending = resolution.pendingMaterialization;
  if (!pending || pending.playerId !== decision.playerId || pending.cardId !== decision.cardId) {
    return match.failure("illegal-command", "Effect materialization is no longer pending");
  }
  const { pendingMaterialization: _pendingMaterialization, ...baseResolution } = resolution;
  if (command.answer === false) {
    if (!pending.attemptBinding) {
      return match.failure(
        "illegal-command",
        "This effect requires the materialization to be announced",
      );
    }
    const resumed = {
      ...baseResolution,
      bindings: { ...resolution.bindings, [pending.attemptBinding]: false },
    };
    const original = state;
    try {
      const cleared = match.getKernel().transact(state, [
        {
          type: "decision-cleared",
          decisionId: decision.id,
          actorId: playerId,
          cause: { kind: "command", move: "answer-decision" },
        },
      ]);
      match.replaceState(cleared.state);
      const continuation = resumeGrandArchiveEffectResolution(
        match.getProgram(),
        match.getState(),
        match.getKernel(),
        resumed,
      );
      match.replaceState(continuation.state);
      const events = [...cleared.result.events, ...continuation.events];
      if (continuation.paused) return { ok: true, state: match.getState(), events };
      return match.stabilize(events, continuation.triggerEvents);
    } catch (error) {
      match.replaceState(original);
      return declarationFailure(match, error);
    }
  }
  const answer = new GrandArchiveDecisionAnswerCodec(match).parseEffectMaterializationAnswer(
    command.answer,
  );
  if (!answer) {
    return match.failure("illegal-command", "Effect materialization announcement is malformed");
  }
  const original = state;
  try {
    const proposal = proposeGrandArchiveMaterialization(
      match.getProgram(),
      state,
      playerId,
      { move: "materialize", cardId: pending.cardId, ...answer },
      {
        kind: "effect",
        payCosts: pending.payCosts,
        ignoreElementRequirements: pending.ignoreElementRequirements,
        costModifiers: pending.costModifiers,
      },
    );
    const resumed = {
      ...baseResolution,
      bindings: pending.attemptBinding
        ? { ...resolution.bindings, [pending.attemptBinding]: true }
        : resolution.bindings,
    };
    const transaction = match.getKernel().transact(state, [
      {
        type: "decision-cleared",
        decisionId: decision.id,
        actorId: playerId,
        cause: { kind: "command", move: "answer-decision" },
      },
      {
        type: "effect-resolution-suspended",
        resolution: resumed,
        cause: { kind: "stack-item", stackItemId: decision.stackItemId },
      },
      ...proposal.events,
    ]);
    match.replaceState(transaction.state);
    const events = [...transaction.result.events];
    if (match.getState().decision?.kind === "choose-replacement") {
      return { ok: true, state: match.getState(), events };
    }
    const currentResolution = match.getState().resolution;
    if (!currentResolution) {
      throw new Error("Effect materialization lost its suspended resolution");
    }
    const continuation = resumeGrandArchiveEffectResolution(
      match.getProgram(),
      match.getState(),
      match.getKernel(),
      currentResolution,
    );
    match.replaceState(continuation.state);
    events.push(...continuation.events);
    if (continuation.paused) return { ok: true, state: match.getState(), events };
    return match.stabilize(events, continuation.triggerEvents);
  } catch (error) {
    match.replaceState(original);
    return declarationFailure(match, error);
  }
};

export const resolveGrandArchiveEffectActivationAnnouncementDecision: GrandArchiveDecisionResolver<
  "announce-effect-activation"
> = ({ match, decision, command, playerId }) => {
  const state = match.getState();
  const resolution = state.resolution;
  if (!resolution || resolution.stackItemId !== decision.stackItemId) {
    return match.failure("illegal-command", "Effect resolution is no longer suspended");
  }
  const pending = resolution.pendingActivation;
  if (!pending || pending.playerId !== decision.playerId || pending.cardId !== decision.cardId) {
    return match.failure("illegal-command", "Effect activation is no longer pending");
  }
  const answer = new GrandArchiveDecisionAnswerCodec(match).parseEffectActivationAnswer(
    command.answer,
  );
  if (!answer) {
    return match.failure("illegal-command", "Effect activation announcement is malformed");
  }
  const { pendingActivation: _pendingActivation, ...baseResolution } = resolution;
  const original = state;
  try {
    const proposal = proposeGrandArchiveCardActivation(
      match.getProgram(),
      state,
      playerId,
      { move: "activate-card", cardId: pending.cardId, ...answer },
      {
        effect: {
          payCosts: pending.payCosts,
          ignoreElementRequirements: pending.ignoreElementRequirements,
          ...(pending.speed ? { speed: pending.speed } : {}),
          costModifiers: pending.costModifiers,
        },
      },
    );
    const transaction = match.getKernel().transact(state, [
      {
        type: "decision-cleared",
        decisionId: decision.id,
        actorId: playerId,
        cause: { kind: "command", move: "answer-decision" },
      },
      {
        type: "effect-resolution-suspended",
        resolution: baseResolution,
        cause: { kind: "stack-item", stackItemId: decision.stackItemId },
      },
      ...proposal.events,
    ]);
    match.replaceState(transaction.state);
    const events = [...transaction.result.events];
    if (match.getState().decision?.kind === "choose-replacement") {
      return { ok: true, state: match.getState(), events };
    }
    const currentResolution = match.getState().resolution;
    if (!currentResolution) throw new Error("Effect activation lost its suspended resolution");
    const continuation = resumeGrandArchiveEffectResolution(
      match.getProgram(),
      match.getState(),
      match.getKernel(),
      currentResolution,
    );
    match.replaceState(continuation.state);
    events.push(...continuation.events);
    if (continuation.paused) return { ok: true, state: match.getState(), events };
    return match.stabilize(events, continuation.triggerEvents);
  } catch (error) {
    match.replaceState(original);
    return declarationFailure(match, error);
  }
};

export const resolveGrandArchiveEffectAttackAnnouncementDecision: GrandArchiveDecisionResolver<
  "announce-effect-attack"
> = ({ match, decision, command, playerId }) => {
  const state = match.getState();
  const resolution = state.resolution;
  if (!resolution || resolution.stackItemId !== decision.stackItemId) {
    return match.failure("illegal-command", "Effect resolution is no longer suspended");
  }
  const pending = resolution.pendingEffectAttack;
  if (
    !pending ||
    pending.playerId !== decision.playerId ||
    pending.attackerId !== decision.attackerId ||
    pending.additional !== decision.additional
  ) {
    return match.failure("illegal-command", "Effect attack declaration is no longer pending");
  }
  const answer = new GrandArchiveDecisionAnswerCodec(match).parseEffectAttackAnswer(command.answer);
  if (!answer) {
    return match.failure("illegal-command", "Effect attack declaration is malformed");
  }
  if (!pending.cost && answer.effectCostPayment) {
    return match.failure("illegal-command", "This attack effect has no separate cost");
  }
  if (state.combat && (!pending.additional || state.combat.step !== "end")) {
    return match.failure(
      "illegal-command",
      "An additional effect attack can only follow a finished combat",
    );
  }
  const evaluation: GrandArchiveEvaluationContext = {
    program: match.getProgram(),
    state,
    controllerId: resolution.controllerId,
    ...(resolution.sourceId
      ? {
          sourceId: resolution.sourceId,
          abilityBearerId: resolution.sourceId,
          sourceIdentityId: resolution.sourceId,
          ...(resolution.sourceIncarnation !== undefined
            ? { sourceIncarnation: resolution.sourceIncarnation }
            : {}),
        }
      : {}),
    ...(resolution.sourceLkiEventId ? { sourceLkiEventId: resolution.sourceLkiEventId } : {}),
    bindings: resolution.bindings,
    variables: resolution.variables,
    resolvingStackItemId: resolution.stackItemId,
    resolutionStartedEventHistoryIndex: resolution.startedEventHistoryIndex,
  };
  const original = state;
  try {
    const effectPayment = pending.cost
      ? payGrandArchiveAbilityCost(pending.cost, answer.effectCostPayment ?? {}, evaluation)
      : { events: [], paidBindings: {} };
    const attackEvents = proposeGrandArchiveAttackDeclaration(
      match.getProgram(),
      state,
      playerId,
      {
        move: "declare-attack",
        attackerId: pending.attackerId,
        targetIds: answer.targetIds,
        ...(answer.weaponIds ? { weaponIds: answer.weaponIds } : {}),
        ...(answer.cleavePlayerId ? { cleavePlayerId: answer.cleavePlayerId } : {}),
        ...(answer.delegatePlayerId ? { delegatePlayerId: answer.delegatePlayerId } : {}),
        ...answer.attackCostPayment,
      },
      { effectGranted: true, effectStackItemId: decision.stackItemId },
    );
    const cleanupEvents = state.combat
      ? proposeGrandArchiveCombatCleanup(state, { suppressOpportunity: true })
      : [];
    const { pendingEffectAttack: _pendingEffectAttack, ...baseResolution } = resolution;
    const resumed = {
      ...baseResolution,
      bindings: { ...resolution.bindings, ...effectPayment.paidBindings },
      frames: pending.ifDeclared
        ? [{ kind: "effect" as const, effect: pending.ifDeclared }, ...resolution.frames]
        : resolution.frames,
    };
    const transaction = match.getKernel().transact(state, [
      {
        type: "decision-cleared",
        decisionId: decision.id,
        actorId: playerId,
        cause: { kind: "command", move: "answer-decision" },
      },
      {
        type: "effect-resolution-suspended",
        resolution: resumed,
        cause: { kind: "stack-item", stackItemId: decision.stackItemId },
      },
      ...effectPayment.events,
      ...cleanupEvents,
      ...attackEvents,
    ]);
    match.replaceState(transaction.state);
    const events = [...transaction.result.events];
    if (match.getState().decision?.kind === "choose-replacement") {
      return { ok: true, state: match.getState(), events };
    }
    const currentResolution = match.getState().resolution;
    if (!currentResolution) throw new Error("Effect attack declaration lost its resolution");
    const continuation = resumeGrandArchiveEffectResolution(
      match.getProgram(),
      match.getState(),
      match.getKernel(),
      currentResolution,
    );
    match.replaceState(continuation.state);
    events.push(...continuation.events);
    if (continuation.paused) return { ok: true, state: match.getState(), events };
    return match.stabilize(events, continuation.triggerEvents);
  } catch (error) {
    match.replaceState(original);
    return declarationFailure(match, error);
  }
};

export const grandArchiveEffectDeclarationDecisionResolvers = {
  "announce-effect-materialization": resolveGrandArchiveEffectMaterializationAnnouncementDecision,
  "announce-effect-activation": resolveGrandArchiveEffectActivationAnnouncementDecision,
  "announce-effect-attack": resolveGrandArchiveEffectAttackAnnouncementDecision,
} satisfies {
  readonly [Kind in
    | "announce-effect-materialization"
    | "announce-effect-activation"
    | "announce-effect-attack"]: GrandArchiveDecisionResolver<Kind>;
};
