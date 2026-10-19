import { CostRouteControl } from "./CostRouteControl";
import { useCombatSelection } from "./useCombatSelection";
import { Paper, Text } from "@mantine/core";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  PresentationSettingsProvider,
  usePresentationSettings,
} from "@tcg/simulator-presentation/settings";
import { DamageStrikeOverlay } from "@tcg/simulator-presentation/effects";
import { playSimulatorSound } from "@tcg/simulator-presentation/audio/sound-service";
import { useAlphaClashPresentation } from "./useAlphaClashPresentation";
import type {
  EngineInteractionView,
  InteractionSubmission,
  InteractionAction,
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
import { useArenaOpening } from "./Arena3D/useArenaOpening";

const AlphaClashArena3D = lazy(() => import("./Arena3D/AlphaClashArena3D"));

/**
 * Optional cost decisions stay open instead of submitting their default: the
 * player picks between the printed resource cost and an alternative cost.
 */
export function deferAlphaClashOptionalCosts(action: InteractionAction): boolean {
  return action.inputs.some(
    (input) => input.kind === "entity-selection" && input.role === "cost" && !input.required,
  );
}

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
        return {
          ...input,
          // Single unordered targets submit on selection; ordered and
          // multi-target drafts keep the explicit confirm step.
          confirmBeforeSubmit:
            input.role === "target" && (input.ordered === true || input.max !== 1)
              ? true
              : input.confirmBeforeSubmit,
          candidates: input.candidates.map(labelCandidate),
        };
      case "option-selection":
        return input.options.every((option) => option.entity?.kind === "card")
          ? { ...input, confirmBeforeSubmit: true }
          : input;
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
          <CostRouteControl view={view} disabled={disabled || Boolean(view.projectionFailure)} />
          <InteractionDraftPrompt
            view={view}
            viewerId={viewerId}
            onSubmit={onSubmit}
            instructionOnly={disabled || Boolean(view.projectionFailure)}
            cancellable={view.status !== "choosing" && !view.resolution}
            embedded
          />
        </div>
      )}
    </Paper>
  );
}
type BoardProps = Omit<
  ArenaProps,
  "selectableInstanceIds" | "selectedInstanceIds" | "onCardClick"
> & {
  view: EngineInteractionView;
  disabled?: boolean;
  matchId: string;
  onSubmit: (submission: InteractionSubmission) => boolean;
  openingResetKey?: number;
};
export function AlphaClashInteractionBoard(props: BoardProps) {
  return (
    <PresentationSettingsProvider>
      <PresentationBoard key={props.matchId} {...props} />
    </PresentationSettingsProvider>
  );
}
function PresentationBoard({
  view,
  disabled,
  onSubmit,
  openingResetKey,
  matchId: _matchId,
  ...props
}: BoardProps) {
  const openingScene = useArenaOpening({
    board: props.board,
    viewerSeat: props.viewerSeat,
    view,
    submit: onSubmit,
    disabled,
    resetKey: openingResetKey,
  });
  const openingBusy = Boolean(openingScene?.beat.duration);
  useCombatSelection(view, disabled);
  const board = useInteractionBoard(view, disabled);
  const settings = usePresentationSettings();
  const effects = useAlphaClashPresentation(props.board, view);
  const [arenaBusy, setArenaBusy] = useState(false);
  const onBusy = props.onTransientBusyChange;
  useEffect(() => {
    onBusy?.(arenaBusy || effects.busy || openingBusy);
  }, [arenaBusy, effects.busy, openingBusy, onBusy]);
  useEffect(() => () => onBusy?.(false), [onBusy]);
  return (
    <>
      <DamageStrikeOverlay
        strike={effects.strike}
        reduced={settings.reducedMotion}
        onImpact={() =>
          playSimulatorSound("combat.hit", () => settings.soundEnabled && !document.hidden)
        }
        onDone={effects.finishStrike}
      />
      <Suspense fallback={<Text>Preparing the arena…</Text>}>
        <AlphaClashArena3D
          {...props}
          view={view}
          disabled={disabled || openingScene?.pending}
          openingScene={openingScene}
          onTransientBusyChange={setArenaBusy}
          onSceneAnchors={effects.onSceneAnchors}
          selectableInstanceIds={board.candidateIds}
          selectedInstanceIds={board.selectedIds}
          onCardClick={board.selectEntity}
        />
      </Suspense>
    </>
  );
}
