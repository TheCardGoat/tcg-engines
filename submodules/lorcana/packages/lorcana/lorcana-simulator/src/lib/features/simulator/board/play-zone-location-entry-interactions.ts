import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";

interface ActionSelectionSessionLike {
  categoryId: string;
  phase: string;
}

interface ResolutionSelectionSessionLike {
  context: {
    kind: string;
    cardCandidateIds?: readonly string[];
  };
}

interface HandlePlayZoneLocationEntryDirectSelectionOptions {
  card: LorcanaCardSnapshot;
  event: Pick<MouseEvent, "stopPropagation">;
  directSelectionMode: boolean;
  onSelect: (card: LorcanaCardSnapshot) => void;
}

export function isPlayZoneLocationEntryDirectSelectionMode(
  actionSelectionSession: ActionSelectionSessionLike | null | undefined,
): boolean {
  return Boolean(
    actionSelectionSession &&
    (actionSelectionSession.phase === "choose-source" ||
      actionSelectionSession.phase === "choose-target") &&
    (actionSelectionSession.categoryId === "challenge" ||
      actionSelectionSession.categoryId === "move-to-location"),
  );
}

export function isPlayZoneLocationEntryResolutionSelectionMode(
  resolutionSelectionSession: ResolutionSelectionSessionLike | null | undefined,
  cardId: string,
): boolean {
  return Boolean(
    resolutionSelectionSession?.context.kind === "target-selection" &&
    resolutionSelectionSession.context.cardCandidateIds?.some(
      (candidateId) => String(candidateId) === cardId,
    ),
  );
}

export function handlePlayZoneLocationEntryDirectSelection(
  options: HandlePlayZoneLocationEntryDirectSelectionOptions,
): boolean {
  if (!options.directSelectionMode) {
    return false;
  }

  options.event.stopPropagation();
  options.onSelect(options.card);
  return true;
}
