import { Paper, Text } from "@mantine/core";
import { lazy, Suspense } from "react";
import type {
  EngineInteractionView,
  InteractionSubmission,
  InteractionInput,
  EntityCandidate,
} from "@tcg/protocol";
import {
  InteractionActionMenu,
  InteractionDraftPrompt,
  useInteractionBoard,
  useInteractionDraft,
} from "@tcg/simulator-ui";
import type { ArenaProps } from "./board-types";
import classes from "../pages/Practice.module.css";
import type { ArenaOpening } from "./Arena3D/useArenaOpening";

const AlphaClashArena3D = lazy(() => import("./Arena3D/AlphaClashArena3D"));

/** Labels come only from the viewer-safe projection, never the card registry. */
export function labelAlphaClashInteractions(
  view: EngineInteractionView,
  labelFor: (id: string) => string,
): EngineInteractionView {
  const labelCandidate = <T extends EntityCandidate>(candidate: T): T => ({
    ...candidate,
    text: candidate.text ?? { key: labelFor(candidate.entity.instanceId) },
  });
  const labelInput = (input: InteractionInput): InteractionInput => {
    switch (input.kind) {
      case "entity-allocation":
        return { ...input, candidates: input.candidates.map(labelCandidate) };
      case "entity-selection":
      case "entity-partition":
      case "ordering":
        return { ...input, candidates: input.candidates.map(labelCandidate) };
      default:
        return input;
    }
  };
  return {
    ...view,
    actions: view.actions.map((action) => ({ ...action, inputs: action.inputs.map(labelInput) })),
  };
}
export function AlphaClashInteractionPanel({
  view,
  viewerId,
  onSubmit,
  disabled = false,
}: {
  view: EngineInteractionView;
  viewerId: string;
  onSubmit: (submission: InteractionSubmission) => boolean;
  disabled?: boolean;
}) {
  const draft = useInteractionDraft();
  return (
    <Paper withBorder p="sm" radius="md" className={classes.actionPanel}>
      <Text fw={600} size="sm" mb={8}>
        Available actions
      </Text>
      <InteractionActionMenu view={view} viewerId={viewerId} disabled={disabled} />
      {(draft.active || view.resolution) && (
        <div style={{ marginTop: 12 }}>
          <InteractionDraftPrompt
            view={view}
            viewerId={viewerId}
            onSubmit={onSubmit}
            instructionOnly={disabled || Boolean(view.projectionFailure)}
            embedded
          />
        </div>
      )}
    </Paper>
  );
}
export function AlphaClashInteractionBoard({
  view,
  disabled,
  openingScene,
  ...props
}: Omit<ArenaProps, "selectableInstanceIds" | "selectedInstanceIds" | "onCardClick"> & {
  view: EngineInteractionView;
  disabled?: boolean;
  openingScene?: ArenaOpening;
}) {
  const board = useInteractionBoard(view, disabled);
  const ui = new URLSearchParams(window.location.search).get("ui");
  const threeDimensional =
    ui === "3d" ||
    (ui !== "classic" &&
      (window.location.pathname.includes("/simulator/tests/arena") ||
        window.location.pathname.endsWith("/simulator/tests/opening-preview")));
  if (threeDimensional)
    return (
      <Suspense fallback={<Text>Preparing the arena…</Text>}>
        <AlphaClashArena3D
          {...props}
          view={view}
          disabled={disabled}
          openingScene={openingScene}
          selectableInstanceIds={board.candidateIds}
          selectedInstanceIds={board.selectedIds}
          onCardClick={board.selectEntity}
        />
      </Suspense>
    );
  return (
    <Suspense fallback={<Text>Preparing the arena…</Text>}>
      <AlphaClashArena3D
        {...props}
        view={view}
        disabled={disabled}
        openingScene={openingScene}
        selectableInstanceIds={board.candidateIds}
        selectedInstanceIds={board.selectedIds}
        onCardClick={board.selectEntity}
      />
    </Suspense>
  );
}
