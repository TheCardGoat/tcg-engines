import type { DeepReadonly, MatchRuntimeConfig, MatchStaticResources, PlayerId } from "#core";
import { buildValidationContext } from "../core/runtime/match-runtime.utils";
import { lorcanaRuntimeConfig } from "../runtime-game";
import { getNextBagResolver } from "../triggered-abilities";
import type { LorcanaCard, LorcanaMatchState, LorcanaRuntimeMoveInputs } from "../types";

import type { AutomatedActionDiagnostic } from "./types";

export function resolveServerCurrentActor(args: {
  state: DeepReadonly<LorcanaMatchState>;
  staticResources: MatchStaticResources;
}): Extract<AutomatedActionDiagnostic, { kind: "actor-resolution" }> {
  const { state, staticResources } = args;

  const pendingChoice = state.ctx.priority.pendingChoice;
  if (pendingChoice?.type === "action-effect") {
    const matchingPendingEffect = state.G.pendingEffects.find(
      (entry) => entry.id === pendingChoice.requestID,
    );
    if (matchingPendingEffect?.chooserId) {
      return {
        kind: "actor-resolution",
        source: "pending-effect-chooser",
        actorId: matchingPendingEffect.chooserId,
        reason: "Resolved current actor from the active pending effect chooser",
      };
    }

    if (!matchingPendingEffect && pendingChoice.playerID) {
      return {
        kind: "actor-resolution",
        source: "pending-effect-chooser",
        actorId: pendingChoice.playerID as PlayerId,
        reason: "Resolved current actor from the active pending effect chooser",
      };
    }
  }

  const pendingEffectChooser = state.G.pendingEffects[0]?.chooserId;
  if (pendingEffectChooser) {
    return {
      kind: "actor-resolution",
      source: "pending-effect-chooser",
      actorId: pendingEffectChooser,
      reason: "Resolved current actor from the next pending effect chooser",
    };
  }

  const validationContext = buildValidationContext({
    state: state as LorcanaMatchState,
    playerId: state.ctx.priority.holder ?? state.ctx.playerIds[0] ?? "",
    input: { args: {} } as LorcanaRuntimeMoveInputs["passTurn"],
    config: lorcanaRuntimeConfig as unknown as MatchRuntimeConfig,
    staticResources,
    gameEnded: state.ctx.status.gameEnded,
    validationMode: "preflight",
  });
  const bagResolver = getNextBagResolver(
    validationContext as unknown as Parameters<typeof getNextBagResolver>[0],
  );
  if (bagResolver) {
    return {
      kind: "actor-resolution",
      source: "bag-chooser",
      actorId: bagResolver as PlayerId,
      reason: "Resolved current actor from the active bag resolver",
    };
  }

  const mulliganPlayer = state.ctx.status.pendingMulligan?.[0] as PlayerId | undefined;
  if (state.ctx.status.phase === "mulligan" && mulliganPlayer) {
    return {
      kind: "actor-resolution",
      source: "pending-mulligan",
      actorId: mulliganPlayer,
      reason: "Resolved current actor from the pending mulligan order",
    };
  }

  const choosingFirstPlayer = state.ctx.status.choosingFirstPlayer as PlayerId | undefined;
  if (state.ctx.status.phase === "chooseFirstPlayer" && choosingFirstPlayer) {
    return {
      kind: "actor-resolution",
      source: "choosing-first-player",
      actorId: choosingFirstPlayer,
      reason: "Resolved current actor from the choosing-first-player prompt",
    };
  }

  if (mulliganPlayer) {
    return {
      kind: "actor-resolution",
      source: "pending-mulligan",
      actorId: mulliganPlayer,
      reason: "Resolved current actor from the pending mulligan order",
    };
  }

  const priorityHolder = state.ctx.priority.holder as PlayerId | undefined;
  if (priorityHolder) {
    return {
      kind: "actor-resolution",
      source: "priority-holder",
      actorId: priorityHolder,
      reason: "Resolved current actor from the priority holder",
    };
  }

  return {
    kind: "actor-resolution",
    source: "unresolved",
    reason:
      "Unable to resolve a current actor from pending effects, bag items, setup prompts, or priority",
  };
}
