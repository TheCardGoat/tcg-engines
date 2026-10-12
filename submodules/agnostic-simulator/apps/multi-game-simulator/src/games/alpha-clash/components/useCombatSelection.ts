import { useEffect } from "react";
import type { EngineInteractionView } from "@tcg/protocol";
import { useInteractionDraft } from "@tcg/simulator-ui";

/** Open the native selection, never submit or pass on the player's behalf. */
export function useCombatSelection(view: EngineInteractionView, disabled = false) {
  const draft = useInteractionDraft();
  const obstruction = view.actions.find(
    (action) =>
      action.id === "declareObstructors" &&
      action.enabled &&
      action.inputs.some(
        (input) =>
          input.kind === "entity-selection" &&
          input.candidates.some((candidate) => candidate.enabled !== false),
      ),
  );
  useEffect(() => {
    if (
      !disabled &&
      !view.projectionFailure &&
      view.status !== "waiting" &&
      view.status !== "game-over" &&
      obstruction &&
      !draft.active
    ) {
      draft.begin(obstruction.id);
    }
  }, [disabled, view.projectionFailure, view.status, obstruction, draft.active, draft.begin]);
}
