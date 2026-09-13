import {
  InteractionDraftProvider,
  currentActionableInput,
  useInteractionDraft,
} from "@tcg/simulator-ui";
import { gundamSubmissionToPayload } from "@tcg/gundam-server-adapter";
import type { InteractionInput } from "@tcg/protocol";
import { useMemo, type ReactNode } from "react";

import { useSubmitError } from "../components/containers/submit-error-context.tsx";
import { useGundamGame } from "./context.tsx";
import { useInteractionView } from "./hooks.ts";
import { asMoveName } from "./types.ts";

export function GundamInteractionDraftProvider({ children }: { readonly children: ReactNode }) {
  const view = useInteractionView();
  const { adapter } = useGundamGame();
  const { report } = useSubmitError();

  return (
    <InteractionDraftProvider
      view={view}
      onSubmit={(submission) => {
        const translated = gundamSubmissionToPayload(submission);
        return (
          report(adapter.submit(asMoveName(translated.moveType), translated.payload))?.ok === true
        );
      }}
    >
      {children}
    </InteractionDraftProvider>
  );
}

export function useGundamInteractionDraft() {
  const view = useInteractionView();
  const draft = useInteractionDraft();
  const action = draft.actionId
    ? view.actions.find(
        (candidate) => candidate.id === draft.actionId && candidate.requestId === draft.requestId,
      )
    : undefined;
  const input = action
    ? currentActionableInput(action, draft.values, draft.confirmedInputIds)
    : undefined;
  const candidateIds = useMemo(() => new Set(entityCandidateIds(input)), [input]);
  const boardCandidateIds = useMemo(
    () =>
      input?.kind === "entity-selection"
        ? candidateIds
        : input?.kind === "entity-partition"
          ? new Set(
              input.candidates
                .filter(
                  (candidate) =>
                    candidate.enabled &&
                    input.routes.filter(
                      (route) =>
                        route.candidateIds === undefined ||
                        route.candidateIds.includes(candidate.entity.instanceId),
                    ).length === 1,
                )
                .map((candidate) => candidate.entity.instanceId),
            )
          : new Set<string>(),
    [candidateIds, input],
  );
  const boardInteractionEnabled =
    !draft.active || input?.kind === "entity-selection" || boardCandidateIds.size > 0;
  const selectedIds = useMemo(() => {
    const value = input ? draft.values[input.id] : undefined;
    const selected = Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : input?.kind === "entity-partition" && value && typeof value === "object"
        ? Object.values(value)
            .flat()
            .filter((item): item is string => typeof item === "string")
        : [];
    return new Set<string>(selected);
  }, [draft.values, input]);
  const sourceId = useMemo(() => {
    const sourceInput = action?.inputs.find(
      (candidate) => candidate.kind === "entity-selection" && candidate.role === "source",
    );
    const value = sourceInput ? draft.values[sourceInput.id] : undefined;
    return Array.isArray(value) && typeof value[0] === "string" ? value[0] : undefined;
  }, [action, draft.values]);

  return {
    ...draft,
    action,
    input,
    candidateIds,
    boardCandidateIds,
    boardInteractionEnabled,
    selectedIds,
    sourceId,
  };
}

function entityCandidateIds(input: InteractionInput | undefined): readonly string[] {
  if (
    input?.kind !== "entity-selection" &&
    input?.kind !== "ordering" &&
    input?.kind !== "entity-partition"
  ) {
    return [];
  }
  return input.candidates
    .filter((candidate) => candidate.enabled)
    .map((candidate) => candidate.entity.instanceId);
}
