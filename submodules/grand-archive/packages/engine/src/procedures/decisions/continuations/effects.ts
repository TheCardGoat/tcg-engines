import {
  declareGrandArchiveResolutionChoice,
  grandArchiveLevelUpCandidates,
} from "../../activation/activation.ts";
import type { GrandArchiveCommandFailure } from "../../../kernel/command-results.ts";
import type { GrandArchiveCommandHandlerContext } from "../../../commands/handler-context.ts";
import { payGrandArchiveAbilityCost } from "../../activation/costs.ts";
import { GrandArchiveUnsupportedRuleError } from "../../effects/evaluation.ts";
import { grandArchiveDecisionId, grandArchiveObjectId } from "../../../game/identity.ts";
import type { GrandArchiveTargetId } from "../../../game/identity.ts";
import {
  declareGrandArchiveRemodedStackItem,
  declareGrandArchiveRetargetedStackItem,
  resumeGrandArchiveEffectResolution,
} from "../../effects/stack-resolution.ts";
import { grandArchiveSimultaneousSelectionIsPublic } from "../../../projection/simultaneous-selection-visibility.ts";
import { GrandArchiveDecisionAnswerCodec } from "../answer-codec.ts";
import type { GrandArchiveDecisionResolver } from "../types.ts";

function effectDecisionFailure(
  match: GrandArchiveCommandHandlerContext,
  error: unknown,
): GrandArchiveCommandFailure {
  if (error instanceof GrandArchiveUnsupportedRuleError) {
    return match.failure("not-implemented", error.message);
  }
  if (error instanceof Error) return match.failure("illegal-command", error.message);
  throw error;
}

export const resolveGrandArchiveOptionalEffectDecision: GrandArchiveDecisionResolver<
  "resolve-optional-effect"
> = ({ match, decision, command, playerId }) => {
  if (typeof command.answer !== "boolean") {
    return match.failure("illegal-command", "Optional-effect answer must be a boolean");
  }
  const state = match.getState();
  const resolution = state.resolution;
  if (!resolution || resolution.stackItemId !== decision.stackItemId) {
    return match.failure("illegal-command", "Effect resolution is no longer suspended");
  }
  const pending = resolution.pendingOptional;
  if (!pending) return match.failure("illegal-command", "Optional effect is no longer pending");
  const { pendingOptional: _pendingOptional, ...baseResolution } = resolution;
  const selected = command.answer ? pending.effect : pending.otherwise;
  const resumed = {
    ...baseResolution,
    frames: selected
      ? [{ kind: "effect" as const, effect: selected }, ...resolution.frames]
      : resolution.frames,
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
    return effectDecisionFailure(match, error);
  }
};

export const resolveGrandArchiveLevelUpDecision: GrandArchiveDecisionResolver<
  "resolve-level-up"
> = ({ match, decision, command, playerId }) => {
  const state = match.getState();
  const resolution = state.resolution;
  if (!resolution || resolution.stackItemId !== decision.stackItemId) {
    return match.failure("illegal-command", "Effect resolution is no longer suspended");
  }
  const pending = resolution.pendingLevelUp;
  if (!pending || pending.championId !== decision.championId) {
    return match.failure("illegal-command", "Champion level-up is no longer pending");
  }
  const selectedId =
    typeof command.answer === "string"
      ? grandArchiveObjectId(command.answer)
      : Array.isArray(command.answer) &&
          command.answer.length === 1 &&
          typeof command.answer[0] === "string"
        ? grandArchiveObjectId(command.answer[0])
        : undefined;
  if (!selectedId || !pending.candidateCardIds.includes(selectedId)) {
    return match.failure("illegal-command", "Level-up answer is not an eligible card");
  }
  const champion = state.objects[pending.championId];
  if (!champion) return match.failure("illegal-command", "The champion to level no longer exists");
  const evaluation = {
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
  if (
    !grandArchiveLevelUpCandidates(match.getProgram(), state, champion, evaluation).some(
      (candidate) => candidate.id === selectedId,
    )
  ) {
    return match.failure("illegal-command", "The selected level-up card is no longer legal");
  }
  const original = state;
  try {
    const { pendingLevelUp: _pendingLevelUp, ...resumed } = resolution;
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
      {
        type: "champion-leveled-up",
        championId: champion.id,
        cardId: selectedId,
        actorId: playerId,
        cause: { kind: "stack-item", stackItemId: decision.stackItemId },
      },
    ]);
    match.replaceState(transaction.state);
    const events = [...transaction.result.events];
    if (match.getState().decision?.kind === "choose-replacement") {
      return { ok: true, state: match.getState(), events };
    }
    const currentResolution = match.getState().resolution;
    if (!currentResolution) throw new Error("Level-up choice lost its resolution");
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
    return effectDecisionFailure(match, error);
  }
};

export const resolveGrandArchiveDirectionChoiceDecision: GrandArchiveDecisionResolver<
  "resolve-direction-choice"
> = ({ match, decision, command, playerId }) => {
  const state = match.getState();
  const resolution = state.resolution;
  if (!resolution || resolution.stackItemId !== decision.stackItemId) {
    return match.failure("illegal-command", "Effect resolution is no longer suspended");
  }
  const pending = resolution.pendingDirectionChoice;
  if (
    !pending ||
    pending.playerId !== decision.playerId ||
    pending.state !== decision.state ||
    pending.from !== decision.from
  ) {
    return match.failure("illegal-command", "Direction choice is no longer pending");
  }
  const selected =
    typeof command.answer === "string"
      ? pending.directions.find((direction) => direction === command.answer)
      : undefined;
  if (!selected) {
    return match.failure("illegal-command", "Direction answer is not an eligible direction");
  }
  const player = state.players[pending.playerId];
  if (
    player?.mastery?.name !== "Shifting Currents" ||
    player.states[pending.state] !== pending.from
  ) {
    return match.failure("illegal-command", "Shifting Currents state has changed");
  }
  const original = state;
  try {
    const { pendingDirectionChoice: _pendingDirectionChoice, ...resumed } = resolution;
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
      {
        type: "player-state-changed",
        playerId: pending.playerId,
        state: pending.state,
        value: selected,
        actorId: playerId,
        cause: { kind: "stack-item", stackItemId: decision.stackItemId },
      },
    ]);
    match.replaceState(transaction.state);
    const continuation = resumeGrandArchiveEffectResolution(
      match.getProgram(),
      match.getState(),
      match.getKernel(),
      resumed,
    );
    match.replaceState(continuation.state);
    const events = [...transaction.result.events, ...continuation.events];
    if (continuation.paused) return { ok: true, state: match.getState(), events };
    return match.stabilize(events, continuation.triggerEvents);
  } catch (error) {
    match.replaceState(original);
    return effectDecisionFailure(match, error);
  }
};

export const resolveGrandArchiveEffectChoiceDecision: GrandArchiveDecisionResolver<
  "resolve-effect-choice"
> = ({ match, decision, command, playerId }) => {
  const state = match.getState();
  const resolution = state.resolution;
  if (!resolution || resolution.stackItemId !== decision.stackItemId) {
    return match.failure("illegal-command", "Effect resolution is no longer suspended");
  }
  const pending = resolution.pendingChoice;
  if (!pending || pending.selection.id !== decision.selection.id) {
    return match.failure("illegal-command", "Resolution choice is no longer pending");
  }
  const original = state;
  try {
    let selected = declareGrandArchiveResolutionChoice(
      pending.selection,
      command.answer,
      {
        program: match.getProgram(),
        state,
        controllerId: pending.controllerId ?? resolution.controllerId,
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
      },
      pending.mayFailToFind ? { mayFailToFind: true } : {},
    );
    if (pending.simultaneous) {
      if (!Array.isArray(selected)) {
        throw new GrandArchiveUnsupportedRuleError(
          "simultaneous choice with a non-identity selection",
        );
      }
      const selectedTargets: GrandArchiveTargetId[] = [];
      for (const value of selected) {
        if (typeof value !== "string") {
          throw new GrandArchiveUnsupportedRuleError(
            "simultaneous choice with a non-identity selection",
          );
        }
        const target = [
          ...Object.values(state.objects),
          ...Object.values(state.players),
          ...state.stack,
        ].find((candidate) => candidate.id === value);
        if (!target) {
          throw new GrandArchiveUnsupportedRuleError(
            "simultaneous choice with an unknown identity",
          );
        }
        selectedTargets.push(target.id);
      }
      const accumulated = [...pending.simultaneous.selected, ...selectedTargets];
      const publicSelections = [
        ...(pending.simultaneous.publicSelections ?? []),
        ...(grandArchiveSimultaneousSelectionIsPublic(state, selectedTargets)
          ? [{ playerId, targetIds: selectedTargets }]
          : []),
      ];
      const [next, ...remaining] = pending.simultaneous.remaining;
      if (next) {
        const suspended = {
          ...resolution,
          pendingChoice: {
            ...pending,
            selection: next.selection,
            controllerId: next.playerId,
            simultaneous: { selected: accumulated, publicSelections, remaining },
          },
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
            resolution: suspended,
            cause: { kind: "stack-item", stackItemId: decision.stackItemId },
          },
          {
            type: "decision-created",
            decision: {
              id: grandArchiveDecisionId(`decision-${state.nextDecisionOrdinal}`),
              kind: "resolve-effect-choice",
              playerId: next.playerId,
              stackItemId: decision.stackItemId,
              selection: next.selection,
              ...(publicSelections.length > 0 ? { publicSelections } : {}),
              ...(pending.mayFailToFind ? { mayFailToFind: true } : {}),
              stateVersion: state.stateVersion,
            },
            cause: { kind: "stack-item", stackItemId: decision.stackItemId },
          },
        ]);
        match.replaceState(transaction.state);
        return { ok: true, state: match.getState(), events: transaction.result.events };
      }
      selected = accumulated;
    }
    const { pendingChoice: _pendingChoice, ...baseResolution } = resolution;
    const resumed = {
      ...baseResolution,
      bindings: {
        ...resolution.bindings,
        [pending.selection.id]: selected,
        ...(pending.bindResultAs ? { [pending.bindResultAs]: selected } : {}),
      },
      frames: [...pending.framesAfterChoice, ...resolution.frames],
    };
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
    return effectDecisionFailure(match, error);
  }
};

export const resolveGrandArchiveRetargetDecision: GrandArchiveDecisionResolver<
  "retarget-stack-item"
> = ({ match, decision, command, playerId }) => {
  const state = match.getState();
  const resolution = state.resolution;
  if (!resolution || resolution.stackItemId !== decision.stackItemId) {
    return match.failure("illegal-command", "Effect resolution is no longer suspended");
  }
  const pending = resolution.pendingRetarget;
  if (!pending || pending.targetStackItemId !== decision.targetStackItemId) {
    return match.failure("illegal-command", "Stack-item retargeting is no longer pending");
  }
  if (
    typeof command.answer !== "object" ||
    command.answer === null ||
    Array.isArray(command.answer) ||
    !("targets" in command.answer) ||
    Object.keys(command.answer).some((key) => key !== "targets")
  ) {
    return match.failure("illegal-command", "Retarget answer must contain targets");
  }
  const submitted = new GrandArchiveDecisionAnswerCodec(match).parseTargetAnswer(
    command.answer.targets,
  );
  if (!submitted) return match.failure("illegal-command", "Retarget targets are malformed");
  const deferred = resolution.deferredStackItems.find(
    (item) => item.id === pending.targetStackItemId,
  );
  const live = state.stack.find((item) => item.id === pending.targetStackItemId);
  const targetItem = deferred ?? live;
  if (!targetItem) {
    return match.failure("illegal-command", "Retargeted stack item no longer exists");
  }
  const original = state;
  try {
    const retargeted = declareGrandArchiveRetargetedStackItem(
      match.getProgram(),
      state,
      targetItem,
      pending.declarations,
      submitted,
    );
    const { pendingRetarget: _pendingRetarget, ...baseResolution } = resolution;
    const resumed = {
      ...baseResolution,
      deferredStackItems: deferred
        ? resolution.deferredStackItems.map((item) =>
            item.id === retargeted.id ? retargeted : item,
          )
        : resolution.deferredStackItems,
    };
    const transaction = match.getKernel().transact(state, [
      {
        type: "decision-cleared",
        decisionId: decision.id,
        actorId: playerId,
        cause: { kind: "command", move: "answer-decision" },
      },
      ...(live
        ? [
            {
              type: "stack-item-retargeted" as const,
              item: retargeted,
              actorId: playerId,
              cause: { kind: "stack-item" as const, stackItemId: decision.stackItemId },
            },
          ]
        : []),
      {
        type: "effect-resolution-suspended",
        resolution: resumed,
        cause: { kind: "stack-item", stackItemId: decision.stackItemId },
      },
    ]);
    match.replaceState(transaction.state);
    const continuation = resumeGrandArchiveEffectResolution(
      match.getProgram(),
      match.getState(),
      match.getKernel(),
      resumed,
    );
    match.replaceState(continuation.state);
    const events = [...transaction.result.events, ...continuation.events];
    if (continuation.paused) return { ok: true, state: match.getState(), events };
    return match.stabilize(events, continuation.triggerEvents);
  } catch (error) {
    match.replaceState(original);
    return effectDecisionFailure(match, error);
  }
};

export const resolveGrandArchiveRemodeDecision: GrandArchiveDecisionResolver<
  "remode-stack-item"
> = ({ match, decision, command, playerId }) => {
  const state = match.getState();
  const resolution = state.resolution;
  if (!resolution || resolution.stackItemId !== decision.stackItemId) {
    return match.failure("illegal-command", "Effect resolution is no longer suspended");
  }
  const pending = resolution.pendingRemode;
  if (!pending || pending.targetStackItemId !== decision.targetStackItemId) {
    return match.failure("illegal-command", "Stack-item mode selection is no longer pending");
  }
  if (
    typeof command.answer !== "object" ||
    command.answer === null ||
    Array.isArray(command.answer) ||
    !("modeIds" in command.answer) ||
    !Array.isArray(command.answer.modeIds) ||
    !command.answer.modeIds.every((id): id is string => typeof id === "string") ||
    Object.keys(command.answer).some((key) => key !== "modeIds")
  ) {
    return match.failure("illegal-command", "Mode answer must contain modeIds");
  }
  const selectedModeIds = command.answer.modeIds;
  if (
    !pending.choices.some(
      (choice) =>
        choice.length === selectedModeIds.length &&
        choice.every((id, index) => id === selectedModeIds[index]),
    )
  ) {
    return match.failure("illegal-command", "Selected modes are not available");
  }
  const targetItem = resolution.deferredStackItems.find(
    (item) => item.id === pending.targetStackItemId,
  );
  if (!targetItem) {
    return match.failure("illegal-command", "Copied stack item no longer exists");
  }
  const original = state;
  try {
    const remoded = declareGrandArchiveRemodedStackItem(
      match.getProgram(),
      state,
      targetItem,
      selectedModeIds,
      pending.mayRetarget,
    );
    const { pendingRemode: _pendingRemode, ...baseResolution } = resolution;
    const resumed = {
      ...baseResolution,
      deferredStackItems: resolution.deferredStackItems.map((item) =>
        item.id === remoded.id ? remoded : item,
      ),
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
    ]);
    match.replaceState(transaction.state);
    const continuation = resumeGrandArchiveEffectResolution(
      match.getProgram(),
      match.getState(),
      match.getKernel(),
      resumed,
    );
    match.replaceState(continuation.state);
    const events = [...transaction.result.events, ...continuation.events];
    if (continuation.paused) return { ok: true, state: match.getState(), events };
    return match.stabilize(events, continuation.triggerEvents);
  } catch (error) {
    match.replaceState(original);
    return effectDecisionFailure(match, error);
  }
};

export const resolveGrandArchiveEffectPaymentDecision: GrandArchiveDecisionResolver<
  "resolve-effect-payment"
> = ({ match, decision, command, playerId }) => {
  const state = match.getState();
  const resolution = state.resolution;
  if (!resolution || resolution.stackItemId !== decision.stackItemId) {
    return match.failure("illegal-command", "Effect resolution is no longer suspended");
  }
  const pending = resolution.pendingPayment;
  if (!pending || pending.playerId !== decision.playerId) {
    return match.failure("illegal-command", "Effect payment is no longer pending");
  }
  const declined = command.answer === false;
  if (declined && !pending.mayDecline) {
    return match.failure("illegal-command", "This effect payment cannot be declined");
  }
  if (declined && pending.remainingPlayerIds?.length) {
    const [nextPlayerId, ...remainingPlayerIds] = pending.remainingPlayerIds;
    const { remainingPlayerIds: _remainingPlayerIds, ...pendingWithoutRemainingPlayers } = pending;
    const resumed = {
      ...resolution,
      pendingPayment: {
        ...pendingWithoutRemainingPlayers,
        playerId: nextPlayerId!,
        ...(remainingPlayerIds.length > 0 ? { remainingPlayerIds } : {}),
      },
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
      {
        type: "decision-created",
        decision: {
          id: grandArchiveDecisionId(`decision-${state.nextDecisionOrdinal}`),
          kind: "resolve-effect-payment",
          playerId: nextPlayerId!,
          stackItemId: decision.stackItemId,
          cost: pending.cost,
          mayDecline: true,
          stateVersion: state.stateVersion,
        },
        cause: { kind: "stack-item", stackItemId: decision.stackItemId },
      },
    ]);
    match.replaceState(transaction.state);
    return { ok: true, state: match.getState(), events: transaction.result.events };
  }
  const payment = declined
    ? undefined
    : new GrandArchiveDecisionAnswerCodec(match).parseCostPaymentAnswer(command.answer);
  if (!declined && !payment) {
    return match.failure("illegal-command", "Effect payment answer is malformed");
  }
  const original = state;
  try {
    const paid = payment
      ? payGrandArchiveAbilityCost(pending.cost, payment, {
          program: match.getProgram(),
          state,
          controllerId: pending.playerId,
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
        })
      : { events: [], paidBindings: {} };
    const { pendingPayment: _pendingPayment, ...baseResolution } = resolution;
    const continuationEffect = declined ? pending.afterDeclined : pending.afterPaid;
    const resumed = {
      ...baseResolution,
      bindings: { ...resolution.bindings, ...paid.paidBindings },
      frames: continuationEffect
        ? [{ kind: "effect" as const, effect: continuationEffect }, ...resolution.frames]
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
      ...paid.events,
    ]);
    match.replaceState(transaction.state);
    const events = [...transaction.result.events];
    if (match.getState().decision?.kind === "choose-replacement") {
      return { ok: true, state: match.getState(), events };
    }
    const currentResolution = match.getState().resolution;
    if (!currentResolution) throw new Error("Effect payment lost its resolution");
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
    return effectDecisionFailure(match, error);
  }
};

export const grandArchiveEffectDecisionResolvers = {
  "resolve-optional-effect": resolveGrandArchiveOptionalEffectDecision,
  "resolve-level-up": resolveGrandArchiveLevelUpDecision,
  "resolve-direction-choice": resolveGrandArchiveDirectionChoiceDecision,
  "resolve-effect-choice": resolveGrandArchiveEffectChoiceDecision,
  "retarget-stack-item": resolveGrandArchiveRetargetDecision,
  "remode-stack-item": resolveGrandArchiveRemodeDecision,
  "resolve-effect-payment": resolveGrandArchiveEffectPaymentDecision,
} satisfies {
  readonly [Kind in
    | "resolve-optional-effect"
    | "resolve-level-up"
    | "resolve-direction-choice"
    | "resolve-effect-choice"
    | "retarget-stack-item"
    | "remode-stack-item"
    | "resolve-effect-payment"]: GrandArchiveDecisionResolver<Kind>;
};
