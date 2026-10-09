import { useContext, useState } from "react";
import { inputAllowsOmission, type EngineInteractionView } from "@tcg/protocol";
import { useInteractionDraft } from "./InteractionDraftContext";
import { InteractionAccessContext, useInteractionBoard } from "./InteractionWorkspace";
import {
  currentActionableInput,
  interactionInputComplete,
  interactionTargetPresentation,
  resolveInteractionText,
} from "./interaction-presentation";
import { createPromptVisibilityStore } from "./prompt-visibility";

/** Shares the protocol draft with DOM and R3F; stores visibility, never a second answer. */
export function useInteractionSurface(
  view: EngineInteractionView,
  {
    visibleEntityIds = new Set<string>(),
    disabled = false,
  }: { visibleEntityIds?: ReadonlySet<string>; disabled?: boolean } = {},
) {
  const draft = useInteractionDraft();
  const access = useContext(InteractionAccessContext);
  const board = useInteractionBoard(view, disabled);
  const [visibility] = useState(createPromptVisibilityStore);
  const action = view.actions.find(
    (candidate) => candidate.id === draft.actionId && candidate.requestId === draft.requestId,
  );
  const input = action
    ? currentActionableInput(action, draft.values, draft.confirmedInputIds)
    : undefined;
  const requestId = action
    ? `${view.gameSlug}:${view.actorId}:${action.requestId}:${input?.id ?? "submitted"}`
    : undefined;
  const minimized = visibility.usePromptMinimized("surface", requestId);
  const explicitOpen = visibility.usePromptOpen("surface", requestId);
  const spatial = interactionTargetPresentation(input, visibleEntityIds) === "spatial";
  const locked =
    disabled ||
    !access ||
    !action?.enabled ||
    Boolean(view.projectionFailure) ||
    view.status === "waiting" ||
    view.status === "game-over";
  const canConfirm = Boolean(
    input &&
    (interactionInputComplete(input, draft.values[input.id]) ||
      (input.kind === "entity-selection" &&
        input.min === 0 &&
        interactionInputComplete(input, []))),
  );
  return {
    action,
    input,
    requestId,
    spatial,
    minimized,
    locked,
    opened: Boolean(action && input && !locked && !minimized && (!spatial || explicitOpen)),
    title: input
      ? resolveInteractionText(input.text)
      : action
        ? resolveInteractionText(action.text)
        : "",
    selectedIds: board.selectedIds,
    candidateIds: board.candidateIds,
    values: draft.values,
    rejected: draft.submissionRejected === true,
    canRetry: !locked && draft.submissionRejected === true && !input,
    retry: () => {
      if (!locked && draft.submissionRejected && !input) draft.submit();
    },
    canConfirm: !locked && canConfirm,
    canSkip: !locked && Boolean(input && inputAllowsOmission(input, draft.values)),
    canCancel: !locked && !view.resolution && view.status !== "choosing",
    select: (id: string) => {
      if (!locked) board.selectEntity(id);
    },
    confirm: () => {
      if (!locked && canConfirm) draft.confirmCurrent();
    },
    skip: () => {
      if (!locked && input && inputAllowsOmission(input, draft.values)) draft.skipCurrent();
    },
    cancel: () => {
      if (!locked && !view.resolution && view.status !== "choosing") draft.cancel();
    },
    clear: () => {
      if (!locked) draft.clear();
    },
    minimize: () => {
      if (requestId) visibility.setPromptMinimized("surface", requestId, true);
    },
    restore: () => {
      if (requestId) visibility.setPromptOpen("surface", requestId, true);
    },
  };
}
