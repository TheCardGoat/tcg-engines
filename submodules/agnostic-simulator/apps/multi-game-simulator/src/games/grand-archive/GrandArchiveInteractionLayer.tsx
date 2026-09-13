import { GrandArchiveRoleCard } from "./GrandArchiveRoleCard";
import { Button, Group } from "@mantine/core";
import type { InteractionSubmission } from "@tcg/protocol";
import {
  currentActionableInput,
  InteractionDraftProvider,
  InteractionResolutionPrompt,
  useInteractionDraft,
} from "@tcg/simulator-ui";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import {
  grandArchiveEntityWithPrintedDetails,
  useGrandArchiveCardPreview,
} from "./GrandArchiveCardPreview";

interface GrandArchiveInteractionWorkspaceValue {
  readonly active: boolean;
  readonly hasFocusedChoice: boolean;
  readonly candidateIds: readonly string[];
  readonly selectedIds: readonly string[];
  readonly selectedOrder: ReadonlyMap<string, number>;
  readonly beginAction: (actionId: string) => void;
  readonly selectEntity: (entityId: string) => void;
  readonly previewEntity: (
    entity: GrandArchiveHarnessFixture["entities"][number] | undefined,
  ) => void;
}

const GrandArchiveInteractionWorkspaceContext =
  createContext<GrandArchiveInteractionWorkspaceValue | null>(null);

const READ_ONLY_WORKSPACE: GrandArchiveInteractionWorkspaceValue = {
  active: false,
  hasFocusedChoice: false,
  candidateIds: [],
  selectedIds: [],
  selectedOrder: new Map(),
  beginAction: () => undefined,
  selectEntity: () => undefined,
  previewEntity: () => undefined,
};

export function useGrandArchiveInteractionWorkspace(): GrandArchiveInteractionWorkspaceValue {
  const workspace = useContext(GrandArchiveInteractionWorkspaceContext);
  if (!workspace) throw new Error("GrandArchiveInteractionWorkspace is unavailable.");
  return workspace;
}

interface GrandArchiveInteractionLayerProps {
  readonly fixture: GrandArchiveHarnessFixture;
  readonly onSubmit?: (submission: InteractionSubmission) => boolean;
  readonly errorMessage?: string;
  readonly children: ReactNode;
}

/** Owns the GA interaction draft and its board-wide prompt surface. */
export function GrandArchiveInteractionLayer({
  fixture,
  onSubmit,
  errorMessage,
  children,
}: GrandArchiveInteractionLayerProps) {
  const viewer = fixture.table.seats.find((seat) => seat.perspective === "bottom");
  const view = fixture.interactionView;
  if (!view) {
    return (
      <GrandArchiveInteractionWorkspaceContext.Provider value={READ_ONLY_WORKSPACE}>
        {children}
      </GrandArchiveInteractionWorkspaceContext.Provider>
    );
  }
  return (
    <InteractionDraftProvider
      key={`${viewer?.id}:${fixture.id}`}
      view={view}
      onSubmit={(submission) => {
        if (!onSubmit) return false;
        return onSubmit(submission);
      }}
    >
      <GrandArchiveInteractionWorkspace
        fixture={fixture}
        onSubmit={onSubmit}
        errorMessage={errorMessage}
      >
        {children}
      </GrandArchiveInteractionWorkspace>
    </InteractionDraftProvider>
  );
}

// Memory and support piles live behind counters; their choices use the focused modal.
function spatialEntityIds(fixture: GrandArchiveHarnessFixture): ReadonlySet<string> {
  const renderedZoneIds = new Set(
    fixture.table.zones
      .filter(
        (zone) =>
          zone.role === "hand" ||
          zone.id === "effects-stack" ||
          zone.id.endsWith(":field") ||
          ["intent", "pantheon", "inner-lineage", "loaded"].some((name) =>
            zone.id.endsWith(`:${name}`),
          ),
      )
      .flatMap((zone) => zone.entityIds),
  );
  const renderedEntityIds = fixture.entities.flatMap((entity) =>
    entity.face === "public" &&
    (renderedZoneIds.has(entity.id) || entity.dataAttributes?.["data-combat-role"] !== undefined)
      ? [entity.id]
      : [],
  );
  return new Set([...renderedEntityIds, ...fixture.table.seats.map((seat) => seat.id)]);
}

function resolveEntityReferences(text: string, fixture: GrandArchiveHarnessFixture): string {
  const self = fixture.table.seats.find((seat) => seat.perspective === "bottom");
  return fixture.entities.reduce((label, entity) => {
    if (entity.face !== "public") return label;
    const copies = fixture.entities.filter(
      (candidate) =>
        candidate.face === "public" &&
        candidate.ownerId === entity.ownerId &&
        candidate.title === entity.title,
    );
    const owner = entity.ownerId === self?.id ? "yours" : "opponent’s";
    const context =
      copies.length > 1
        ? `${owner} · copy ${copies.findIndex((candidate) => candidate.id === entity.id) + 1}`
        : owner;
    return label.replaceAll(` (${entity.id})`, ` (${context})`);
  }, text);
}

function GrandArchiveInteractionWorkspace({
  fixture,
  onSubmit,
  errorMessage,
  children,
}: {
  readonly fixture: GrandArchiveHarnessFixture;
  readonly onSubmit?: (submission: InteractionSubmission) => boolean;
  readonly errorMessage?: string;
  readonly children: ReactNode;
}) {
  const draft = useInteractionDraft();
  const { show: showPreview, hide: hidePreview } = useGrandArchiveCardPreview();
  const view = fixture.interactionView;
  const self = fixture.table.seats.find((seat) => seat.perspective === "bottom");
  const pregameActions =
    fixture.waitState.kind === "pregame-action" && fixture.waitState.playerId === self?.id
      ? fixture.interactions.filter(
          (interaction) =>
            interaction.movePreview.command !== "concede" &&
            view?.actions.some((action) => action.id === interaction.id && action.enabled),
        )
      : [];
  const completion = pregameActions.find(
    (action) => action.movePreview.command === "complete-pregame-actions",
  );
  const automaticCompletion = pregameActions.length === 1 ? completion : undefined;
  const automaticRequest = useRef<string | null>(null);
  const authoritativeVersion = `${fixture.table.status.stateVersion}:${view?.stateVersion}`;
  const previousVersion = useRef(authoritativeVersion);
  useLayoutEffect(() => {
    if (previousVersion.current === authoritativeVersion) return;
    previousVersion.current = authoritativeVersion;
    automaticRequest.current = null;
    draft.cancel();
  }, [authoritativeVersion, draft.cancel]);
  useEffect(() => {
    if (!automaticCompletion || !onSubmit || draft.active || errorMessage) return;
    const key = `${view?.stateVersion}:${automaticCompletion.id}`;
    if (automaticRequest.current === key) return;
    automaticRequest.current = key;
    draft.begin(automaticCompletion.id);
  }, [automaticCompletion, onSubmit, draft.active, draft.begin, view?.stateVersion, errorMessage]);
  const pregamePromptActive =
    pregameActions.length > 0 && (!automaticCompletion || Boolean(errorMessage)) && !draft.active;
  const decisionAction =
    fixture.waitState.kind === "decision"
      ? view?.actions.find((action) => action.id.startsWith("grand-archive:decision:"))
      : undefined;
  const passAction =
    fixture.waitState.kind === "opportunity"
      ? view?.actions.find(
          (action) => action.enabled && action.intent === "pass" && action.inputs.length === 0,
        )
      : undefined;
  const stackZone = fixture.table.zones.find((zone) => zone.id === "effects-stack");
  const stackTopId = stackZone?.entityIds.at(-1);
  const rawStackTop = fixture.entities.find((entity) => entity.id === stackTopId);
  const stackTop = rawStackTop ? grandArchiveEntityWithPrintedDetails(rawStackTop) : undefined;
  const stackPromptActive = Boolean(onSubmit && passAction && stackTop && !draft.active);
  const selectedAction = view?.actions.find((action) => action.id === draft.actionId);
  const input = selectedAction
    ? currentActionableInput(selectedAction, draft.values, draft.confirmedInputIds)
    : undefined;
  const inputValue = input ? draft.values[input.id] : undefined;
  const selectedIds = Array.isArray(inputValue)
    ? inputValue
    : input && inputValue && typeof inputValue === "object"
      ? input.kind === "entity-allocation"
        ? Object.entries(inputValue)
            .filter((entry) => typeof entry[1] === "number" && entry[1] > 0)
            .map(([id]) => id)
        : Object.values(inputValue).flatMap((value) =>
            Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [],
          )
      : [];
  const candidateIds =
    input && "candidates" in input
      ? input.candidates
          .filter((candidate) => candidate.enabled !== false)
          .map((candidate) => candidate.entity.instanceId)
      : [];
  const selectedOrder = useMemo(
    () => new Map(selectedIds.map((id, index) => [id, index + 1])),
    [selectedIds],
  );
  const choiceCandidateEntities =
    input &&
    (input.kind === "entity-selection" || input.kind === "ordering") &&
    input.candidates.every((candidate) => candidate.entity.kind === "card")
      ? input.candidates.flatMap((candidate) => {
          const entity = fixture.entities.find(
            (fixtureEntity) => fixtureEntity.id === candidate.entity.instanceId,
          );
          return entity ? [entity] : [];
        })
      : [];
  const choiceModal =
    input &&
    (input.kind === "entity-selection" || input.kind === "ordering") &&
    choiceCandidateEntities.length === input.candidates.length &&
    choiceCandidateEntities.some((entity) => !spatialEntityIds(fixture).has(entity.id))
      ? {
          title:
            input.kind === "entity-selection" && input.role === "cost"
              ? "Choose payment cards"
              : "Choose cards",
          description: "Choose from the cards allowed by the current Grand Archive effect.",
          filter: {
            kind: "entity" as const,
            includeHidden: true,
          },
          table: fixture.table,
          entities: choiceCandidateEntities,
          emptyLabel: "No legal cards are available",
          autoOpen: true,
        }
      : undefined;
  const selectEntity = (entityId: string) => {
    if (!input || !candidateIds.includes(entityId)) return;
    if (input.kind === "ordering") {
      const next = selectedIds.includes(entityId)
        ? selectedIds.filter((id) => id !== entityId)
        : [...selectedIds, entityId];
      draft.change(input.id, next);
      return;
    }
    if (
      input.kind === "entity-selection" ||
      input.kind === "entity-partition" ||
      input.kind === "entity-allocation"
    ) {
      draft.toggleEntity(input.id, entityId);
    }
  };
  const beginAction = (actionId: string) => {
    hidePreview();
    // A hosted send can be rejected after the draft considered it submitted.
    // An explicit retry must release that request's duplicate-send guard.
    if (errorMessage) draft.cancel();
    draft.begin(actionId);
  };
  const hasFocusedChoice = Boolean(choiceModal);
  const workspace = useMemo<GrandArchiveInteractionWorkspaceValue>(
    () => ({
      active: draft.active || Boolean(view?.resolution),
      hasFocusedChoice,
      candidateIds,
      selectedIds,
      selectedOrder,
      beginAction,
      selectEntity,
      previewEntity: (entity) => (entity ? showPreview(entity) : hidePreview()),
    }),
    [
      hasFocusedChoice,
      candidateIds,
      errorMessage,
      draft.cancel,
      draft.active,
      draft.begin,
      hidePreview,
      selectedIds,
      selectedOrder,
      showPreview,
      view?.resolution,
    ],
  );

  useEffect(() => {
    if (decisionAction && !draft.active && onSubmit) draft.begin(decisionAction.id);
  }, [decisionAction, draft.active, draft.begin, onSubmit]);

  const selectedActionId =
    draft.actionId ??
    (pregamePromptActive ? pregameActions[0]?.id : stackPromptActive ? passAction?.id : undefined);
  const prompt =
    !view ||
    (!view.resolution && !draft.active && !stackPromptActive && !pregamePromptActive) ? null : (
      <InteractionResolutionPrompt
        view={view}
        viewerId={self?.id ?? ""}
        actionId={selectedActionId}
        values={draft.values}
        confirmedInputIds={draft.confirmedInputIds}
        visibleEntityIds={spatialEntityIds(fixture)}
        preferredPlacement="bottom"
        reserveBottomTargetArea
        choiceModal={choiceModal}
        instructionOnly={!onSubmit || pregamePromptActive}
        decisionControls={
          pregamePromptActive ? (
            <Group gap="xs">
              {pregameActions.map((action) => (
                <Button
                  key={action.id}
                  size="sm"
                  mih={44}
                  disabled={!onSubmit}
                  onClick={() => beginAction(action.id)}
                >
                  {action.movePreview.command === "complete-pregame-actions"
                    ? "Continue to starting champions"
                    : action.label}
                </Button>
              ))}
            </Group>
          ) : undefined
        }
        actionPresentation={
          pregamePromptActive
            ? { title: "Before the game begins", body: "Choose your starting-card actions." }
            : stackPromptActive
              ? {
                  title: stackTop?.title ?? "Top effect",
                  body: "Players may respond before this effect resolves.",
                  details: stackTop?.details?.rules.map((rule) => rule.text).join("\n"),
                  submitLabel: "Pass Opportunity",
                }
              : undefined
        }
        onChange={draft.change}
        onClearInput={draft.unset}
        onClear={draft.clear}
        onConfirm={draft.confirmCurrent}
        onCancel={view.resolution || stackPromptActive ? undefined : draft.cancel}
        onSubmit={onSubmit}
        renderText={(text) => resolveEntityReferences(text, fixture)}
        renderCandidate={(_, id) => {
          const entity = fixture.entities.find(
            (candidate) => candidate.id === id && candidate.face === "public",
          );
          return entity ? (
            <GrandArchiveRoleCard as="div" entity={entity} density="compact" />
          ) : undefined;
        }}
      />
    );
  return (
    <GrandArchiveInteractionWorkspaceContext.Provider value={workspace}>
      {children}
      {prompt}
      {errorMessage ? (
        <div className="ga-interaction-error" role="alert">
          {errorMessage}
        </div>
      ) : null}
    </GrandArchiveInteractionWorkspaceContext.Provider>
  );
}
