import { useCallback, useMemo } from "react";
import type { HarnessFixture } from "@tcg/simulator-contract";
import {
  buildInteractionSubmissionForActionId,
  type EngineInteractionView,
  type InteractionAction,
  type InteractionInput,
  type InteractionSubmissionValue,
} from "@tcg/protocol";

import { useEngine } from "./engineContext";
import { interactionSubmissionToEngineAction } from "./interactionDispatch";
import { projectToHarnessFixture } from "./projectSimulator";
import { PLAYER_SIDE_TO_ID } from "./sides";

export interface UseSimulatorProjectionResult {
  fixture: HarnessFixture;
  onSubmitInteraction: (
    interactionId: string,
    selection: {
      entityIds: string[];
      optionIds: string[];
      paymentIds: string[];
      orderedIds: string[];
    },
  ) => void;
}

interface ActionContext {
  view: EngineInteractionView;
  action: InteractionAction;
  inputs: readonly InteractionInput[];
}

/**
 * Project the live Cyberpunk engine state into the shared simulator contract and
 * wire shared UI interaction submissions back into Cyberpunk engine actions.
 */
export function useSimulatorProjection(): UseSimulatorProjectionResult {
  const engine = useEngine();
  const { matchState, interactionViews, humanSide } = engine;
  const viewerSide = humanSide;

  const fixture = useMemo(
    () =>
      projectToHarnessFixture(
        {
          matchState,
          viewerSide,
          interactionViews,
          humanSide,
        },
        "Cyberpunk live match",
      ),
    [matchState.ctx.stateID, viewerSide, interactionViews, humanSide],
  );

  // Keep a stable map from projected interaction id back to the original
  // protocol action/input so submissions can be turned into engine moves.
  const actionContextById = useMemo(() => {
    const map = new Map<string, ActionContext>();
    const view = interactionViews[viewerSide];
    if (!view) return map;
    for (const action of view.actions) {
      if (!action.enabled) continue;
      map.set(action.id, { view, action, inputs: action.inputs });
    }
    return map;
  }, [interactionViews, viewerSide]);

  const onSubmitInteraction = useCallback(
    (
      interactionId: string,
      selection: {
        entityIds: string[];
        optionIds: string[];
        paymentIds: string[];
        orderedIds: string[];
      },
    ) => {
      const context = actionContextById.get(interactionId);
      if (!context) return;

      let values = selectionToValues(context.inputs, selection);
      if (context.action.id === "attackUnit") {
        const pairId = selection.entityIds[0];
        if (!pairId || !pairId.includes("->")) return;
        const [attackerId, defenderId] = pairId.split("->");
        if (!attackerId || !defenderId) return;
        values = { attackerId, defenderId };
      }
      const submission = buildInteractionSubmissionForActionId({
        view: context.view,
        actionId: context.action.id,
        values,
      });
      if (!submission) return;

      const as = PLAYER_SIDE_TO_ID[viewerSide];
      let engineAction: ReturnType<typeof interactionSubmissionToEngineAction>;
      try {
        engineAction = interactionSubmissionToEngineAction(submission, as);
      } catch {
        return;
      }
      if (!engineAction) return;

      engine.dispatch(engineAction);
    },
    [actionContextById, engine, viewerSide],
  );

  return { fixture, onSubmitInteraction };
}

function selectionToValues(
  inputs: readonly InteractionInput[],
  selection: {
    entityIds: string[];
    optionIds: string[];
    paymentIds: string[];
    orderedIds: string[];
  },
): Record<string, InteractionSubmissionValue> {
  const values: Record<string, InteractionSubmissionValue> = {};

  for (const input of inputs) {
    switch (input.kind) {
      case "entity-selection": {
        const ids = input.role === "cost" ? selection.paymentIds : selection.entityIds;
        if (ids.length > 0) values[input.id] = input.max <= 1 ? ids[0]! : ids;
        break;
      }
      case "option-selection": {
        const id = selection.optionIds[0];
        if (id) values[input.id] = id;
        break;
      }
      case "ordering": {
        if (selection.orderedIds.length > 0) values[input.id] = selection.orderedIds;
        break;
      }
      case "number": {
        const id = selection.optionIds[0];
        const value = id ? Number.parseInt(id, 10) : NaN;
        if (Number.isFinite(value)) values[input.id] = value;
        break;
      }
      case "boolean": {
        const id = selection.optionIds[0];
        if (id) values[input.id] = id === "true";
        break;
      }
    }
  }

  return values;
}
