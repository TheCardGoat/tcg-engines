import { Button, Group, Text } from "@mantine/core";
import type { EngineInteractionView, InteractionSubmission } from "@tcg/protocol";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { InteractionDraftProvider, useInteractionDraft } from "./InteractionDraftContext";
import { currentActionableInput, resolveInteractionText } from "./interaction-presentation";
import {
  InteractionResolutionPrompt,
  type InteractionResolutionPromptProps,
} from "../components/InteractionResolutionPrompt";

import { useOptionalAnimationRuntime } from "../animation/provider/contexts";

export const InteractionAccessContext = createContext(true);

/** One protocol draft for DOM controls and any board renderer (including R3F). */
export function InteractionWorkspace({
  view,
  viewerId,
  onSubmit,
  disabled = false,
  children,
}: {
  view: EngineInteractionView;
  viewerId: string;
  onSubmit: (submission: InteractionSubmission) => boolean;
  disabled?: boolean;
  children: ReactNode;
}) {
  const animation = useOptionalAnimationRuntime();
  const canAct =
    !animation?.activeTransition &&
    !disabled &&
    !view.projectionFailure &&
    view.status !== "game-over" &&
    view.actorId === viewerId;
  return (
    <InteractionDraftProvider view={view} onSubmit={(submission) => canAct && onSubmit(submission)}>
      <InteractionAccessContext.Provider value={canAct}>
        <PendingDecision view={view} enabled={canAct} />
        {children}
      </InteractionAccessContext.Provider>
    </InteractionDraftProvider>
  );
}
function PendingDecision({ view, enabled }: { view: EngineInteractionView; enabled: boolean }) {
  const draft = useInteractionDraft();
  // Only unambiguous pending decisions start automatically. Never choose an action
  // for the player, and never infer semantics from a game's action-id spelling.
  const choices = view.actions.filter((action) => action.enabled && action.intent !== "concede");
  const choice =
    enabled && view.status === "choosing" && choices.length === 1 ? choices[0] : undefined;
  useEffect(() => {
    if (choice && !draft.active) draft.begin(choice.id);
  }, [choice, draft.active, draft.begin]);
  return null;
}

export interface InteractionActionMenuProps {
  view: EngineInteractionView;
  viewerId: string;
  disabled?: boolean;
  renderText?: (text: string) => string;
}
export function InteractionActionMenu({
  view,
  viewerId,
  disabled = false,
  renderText,
}: InteractionActionMenuProps) {
  const draft = useInteractionDraft();
  const canAct = useContext(InteractionAccessContext);
  if (view.projectionFailure)
    return <Text role="alert">Actions are unavailable. Waiting for a refreshed game state.</Text>;
  if (view.status === "game-over") return <Text role="status">The match is over.</Text>;
  if (view.actorId !== viewerId || (view.status === "waiting" && view.actions.length === 0))
    return <Text role="status">Waiting for the other player…</Text>;
  if (view.actions.length === 0) return <Text role="status">No actions are available.</Text>;
  return (
    <Group gap="xs" aria-label="Available actions">
      {view.actions.map((action) => (
        <Button
          key={action.id}
          size="sm"
          mih={44}
          styles={{
            root: { maxWidth: "100%", height: "auto", paddingBlock: 8 },
            label: { whiteSpace: "normal", textAlign: "left" },
          }}
          variant={draft.actionId === action.id ? "filled" : "light"}
          color={action.intent === "concede" ? "red" : undefined}
          disabled={disabled || !canAct || !action.enabled}
          title={action.disabledText ? resolveInteractionText(action.disabledText) : undefined}
          aria-pressed={draft.actionId === action.id}
          onClick={() => draft.begin(action.id)}
        >
          {renderText?.(resolveInteractionText(action.text)) ?? resolveInteractionText(action.text)}
        </Button>
      ))}
    </Group>
  );
}

/** Shared prompt bindings. Games supply presentation, never duplicate input widgets. */
export function InteractionDraftPrompt({
  cancellable = true,
  ...props
}: Omit<
  InteractionResolutionPromptProps,
  | "values"
  | "confirmedInputIds"
  | "onChange"
  | "onClearInput"
  | "onClear"
  | "onConfirm"
  | "onSkipInput"
> & { cancellable?: boolean }) {
  const draft = useInteractionDraft();
  const canAct = useContext(InteractionAccessContext);
  return (
    <InteractionResolutionPrompt
      {...props}
      instructionOnly={props.instructionOnly || !canAct}
      onSubmit={canAct ? props.onSubmit : undefined}
      actionId={props.actionId ?? draft.actionId}
      values={draft.values}
      confirmedInputIds={draft.confirmedInputIds}
      onChange={draft.change}
      onClearInput={draft.unset}
      onClear={draft.clear}
      onConfirm={draft.confirmCurrent}
      onSkipInput={draft.skipCurrent}
      onCancel={
        cancellable && canAct
          ? (props.onCancel ?? (props.view.resolution ? undefined : draft.cancel))
          : undefined
      }
    />
  );
}

/** Board-facing IDs are protocol instance IDs; no game or mesh types cross this boundary. */
export function useInteractionBoard(view: EngineInteractionView, disabled = false) {
  const draft = useInteractionDraft();
  const canAct = useContext(InteractionAccessContext);
  const action = view.actions.find(
    (entry) => entry.id === draft.actionId && entry.requestId === draft.requestId,
  );
  const input = action
    ? currentActionableInput(action, draft.values, draft.confirmedInputIds)
    : undefined;
  const candidates =
    !disabled && canAct && input && "candidates" in input
      ? input.candidates
          .filter((candidate) => candidate.enabled !== false)
          .map((candidate) => candidate.entity.instanceId)
      : [];
  const value = input ? draft.values[input.id] : undefined;
  const selected = Array.isArray(value)
    ? value
    : value && typeof value === "object"
      ? Object.entries(value).flatMap(([id, amount]) =>
          Array.isArray(amount) ? amount : typeof amount === "number" && amount > 0 ? [id] : [],
        )
      : [];
  return {
    candidateIds: new Set(candidates),
    selectedIds: new Set(selected),
    selectEntity: (id: string) => {
      if (disabled || !canAct || !input || !candidates.includes(id)) return;
      if (input.kind === "ordering") {
        const next = selected.includes(id)
          ? selected.filter((item) => item !== id)
          : selected.length < input.max
            ? [...selected, id]
            : selected;
        draft.change(input.id, next);
      } else draft.toggleEntity(input.id, id);
    },
  };
}
