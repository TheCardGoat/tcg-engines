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
  const { matchState, interactionViews, humanSide, dispatch } = engine;
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
    [matchState, viewerSide, interactionViews, humanSide],
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
      if (!context) {
        // The view changed between render and submit (state push) — the
        // prompt is stale and the player must act on the re-rendered one.
        console.warn("[cyberpunk] interaction dropped: stale prompt", interactionId);
        return;
      }

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
      if (!submission) {
        console.warn(
          "[cyberpunk] interaction dropped: submission build failed",
          context.action.id,
          values,
        );
        return;
      }

      const as = PLAYER_SIDE_TO_ID[viewerSide];
      let engineAction: ReturnType<typeof interactionSubmissionToEngineAction>;
      try {
        engineAction = interactionSubmissionToEngineAction(submission, as);
      } catch (error) {
        console.warn(
          "[cyberpunk] interaction dropped: value conversion failed",
          context.action.id,
          error,
        );
        return;
      }
      if (!engineAction) {
        console.warn("[cyberpunk] interaction dropped: unsupported action", context.action.id);
        return;
      }

      const result = dispatch(engineAction);
      if (result && result.success === false) {
        console.warn(
          "[cyberpunk] interaction rejected by dispatch",
          context.action.id,
          result.error,
        );
      }
    },
    [actionContextById, dispatch, viewerSide],
  );

  return { fixture, onSubmitInteraction };
}

// Entity-selection inputs whose native engine payload is a string array must
// keep the array form even for a single pick: both the local engine-action
// converter (interactionDispatch.requireStringArray) and the server adapter
// read them strictly. The scalar collapse is only correct for singular inputs
// (cardId, dieId, attackerId, ...).
const ARRAY_VALUED_SELECTION_IDS: ReadonlySet<string> = new Set([
  "targetIds",
  "cardIds",
  "dieIds",
  "selectedCardIds",
]);

export function selectionToValues(
  inputs: readonly InteractionInput[],
  selection: {
    entityIds: string[];
    optionIds: string[];
    paymentIds: string[];
    orderedIds: string[];
  },
): Record<string, InteractionSubmissionValue> {
  const values: Record<string, InteractionSubmissionValue> = {};
  // Actions can carry several entity/payment/option inputs. Each input must
  // consume its own slice of the submitted pool in declaration order —
  // reading ids[0] for every input bound playCard's gear to itself instead
  // of the chosen host.
  let entityCursor = 0;
  let paymentCursor = 0;
  let optionCursor = 0;

  for (const input of inputs) {
    switch (input.kind) {
      case "entity-selection": {
        const isCost = input.role === "cost";
        const pool = isCost ? selection.paymentIds : selection.entityIds;
        const cursor = isCost ? paymentCursor : entityCursor;
        const remaining = pool.length - cursor;
        if (remaining <= 0) {
          if (input.min === 0 && ARRAY_VALUED_SELECTION_IDS.has(input.id)) {
            values[input.id] = [];
          } else if (
            input.min === 0 &&
            input.id === "cardId" &&
            inputs.some((candidate) => candidate.kind === "boolean" && candidate.id === "pass")
          ) {
            values.pass = true;
          }
          break;
        }
        const take = input.max <= 1 ? 1 : Math.min(input.max, remaining);
        const slice = pool.slice(cursor, cursor + take);
        values[input.id] =
          input.max <= 1 && !ARRAY_VALUED_SELECTION_IDS.has(input.id) ? slice[0]! : slice;
        if (isCost) paymentCursor += take;
        else entityCursor += take;
        break;
      }
      case "option-selection": {
        const id = selection.optionIds[optionCursor];
        if (id) {
          values[input.id] = id;
          optionCursor += 1;
        }
        break;
      }
      case "ordering": {
        if (selection.orderedIds.length > 0) values[input.id] = selection.orderedIds;
        break;
      }
      case "entity-partition":
        break;
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
