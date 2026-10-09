import { GrandArchiveRoleCard } from "./GrandArchiveRoleCard";
import { grandArchivePhysicalCards } from "./grand-archive-physical-cards";
import { Button, Group } from "@mantine/core";
import type { InteractionSubmission } from "@tcg/protocol";
import {
  currentActionableInput,
  interactionInputComplete,
  InteractionDraftProvider,
  InteractionDraftPrompt,
  useInteractionDraft,
} from "@tcg/simulator-ui";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { createPortal } from "react-dom";

import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import {
  grandArchiveEntityWithPrintedDetails,
  useGrandArchiveCardPreview,
} from "./GrandArchiveCardPreview";

interface GrandArchiveInteractionWorkspaceValue {
  readonly active: boolean;
  readonly setPromptHost: (element: HTMLDivElement | null) => void;
  readonly attackSourceId?: string;
  readonly attackTargeting: boolean;
  readonly attackTargetIds: readonly string[];
  readonly previewTargetId?: string;
  readonly hasFocusedChoice: boolean;
  readonly candidateIds: readonly string[];
  readonly selectedIds: readonly string[];
  readonly selectedOrder: ReadonlyMap<string, number>;
  readonly beginAction: (actionId: string, clickedEntityId?: string) => void;
  readonly selectEntity: (entityId: string) => void;
  readonly finishSelection: () => void;
  readonly previewEntity: (
    entity: GrandArchiveHarnessFixture["entities"][number] | undefined,
  ) => void;
}

const GrandArchiveInteractionWorkspaceContext =
  createContext<GrandArchiveInteractionWorkspaceValue | null>(null);

const READ_ONLY_WORKSPACE: GrandArchiveInteractionWorkspaceValue = {
  active: false,
  setPromptHost: () => undefined,
  attackTargeting: false,
  attackTargetIds: [],
  hasFocusedChoice: false,
  candidateIds: [],
  selectedIds: [],
  selectedOrder: new Map(),
  beginAction: () => undefined,
  selectEntity: () => undefined,
  finishSelection: () => undefined,
  previewEntity: () => undefined,
};

export function useGrandArchiveInteractionWorkspace(): GrandArchiveInteractionWorkspaceValue {
  const workspace = useContext(GrandArchiveInteractionWorkspaceContext);
  if (!workspace) throw new Error("GrandArchiveInteractionWorkspace is unavailable.");
  return workspace;
}

/** Places the existing accessible prompt inside the portrait board composition. */
export function GrandArchivePromptHost() {
  const workspace = useGrandArchiveInteractionWorkspace();
  return <div className="ga-portrait-prompt-host" ref={workspace.setPromptHost} />;
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
  const { hide: hidePreview } = useGrandArchiveCardPreview();
  const visibilityKey = `${viewer?.id}:${fixture.id}:${fixture.table.status.stateVersion}:${view?.stateVersion}`;
  useLayoutEffect(() => {
    hidePreview();
    return hidePreview;
  }, [visibilityKey, hidePreview]);
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
      deferInitialSubmission={(action) =>
        action.inputs.some(
          (input) =>
            input.kind === "entity-selection" &&
            input.min === 0 &&
            input.max > 0 &&
            input.candidates.length > 0,
        )
      }
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

// Only visible rows count as spatial choices; support zones use the focused chooser.
function spatialEntityIds(fixture: GrandArchiveHarnessFixture): ReadonlySet<string> {
  const renderedIds = new Set(
    fixture.table.zones
      .filter(
        (zone) =>
          zone.role === "hand" ||
          zone.id === "effects-stack" ||
          zone.id.endsWith(":field") ||
          zone.id.endsWith(":intent"),
      )
      .flatMap((zone) => zone.entityIds),
  );
  const physical = grandArchivePhysicalCards({
    entities: fixture.entities,
    zones: fixture.table.zones,
  });
  for (const [nativeId, displayId] of physical.displayEntityIds) {
    if (renderedIds.has(displayId)) renderedIds.add(nativeId);
  }
  return new Set([
    ...fixture.entities.filter((entity) => renderedIds.has(entity.id)).map((entity) => entity.id),
    ...fixture.table.seats.map((seat) => seat.id),
  ]);
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
  const [promptHost, setPromptHost] = useState<HTMLDivElement | null>(null);
  const [hoveredEntityId, setHoveredEntityId] = useState<string>();
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
  const authoritativeVersion = `${self?.id}:${fixture.table.status.stateVersion}:${view?.stateVersion}`;
  const previousVersion = useRef(authoritativeVersion);
  useLayoutEffect(() => {
    if (previousVersion.current === authoritativeVersion) return;
    previousVersion.current = authoritativeVersion;
    automaticRequest.current = null;
    setHoveredEntityId(undefined);
    hidePreview();
    draft.cancel();
  }, [authoritativeVersion, draft.cancel, hidePreview]);
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
  const stackKind = stackTop?.dataAttributes?.["data-stack-item-kind"];
  const stackSubject =
    stackKind === "activated-ability" || stackKind === "triggered-ability" ? "ability" : "card";
  const stackOwner = stackTop?.ownerId === self?.id ? "your" : "your opponent’s";
  const stackText = stackTop?.details?.rules
    .map((rule) => rule.text ?? rule.label ?? "")
    .join("\n")
    .trim();
  const responseInstruction = `You have Opportunity. Respond to ${stackOwner} ${stackSubject} or use Pass.`;
  const stackPromptActive = Boolean(onSubmit && passAction && stackTop && !draft.active);
  // Fall back to the pending decision action while a resolution is projected:
  // if the decision draft was wiped by the stale-draft invalidation race, the
  // board must still project the decision's candidates so the click-to-begin
  // path in selectEntity can recover it.
  const selectedAction =
    view?.actions.find((action) => action.id === draft.actionId) ?? decisionAction;
  const input = selectedAction
    ? currentActionableInput(selectedAction, draft.values, draft.confirmedInputIds)
    : undefined;
  // Attack Declaration 2.2–2.5: target guidance must not replace weapon or cost steps.
  const attackerValue = draft.values["attacker"];
  const attackSourceId =
    draft.active && selectedAction?.intent === "attack" && Array.isArray(attackerValue)
      ? attackerValue[0]
      : undefined;
  const attackTargeting = Boolean(
    attackSourceId &&
    input?.kind === "entity-selection" &&
    (input.id === "attack-targets" ||
      input.id === "cleave-player" ||
      input.id === "delegated-player"),
  );
  // Player-seat choices (for example a resolved attack's defending-player step)
  // are answered through the seat's Select button; say so instead of falling
  // back to the generic combined instruction.
  const playerChoice = Boolean(
    input?.kind === "entity-selection" &&
    input.candidates.length > 0 &&
    input.candidates.every((candidate) => candidate.entity.kind === "player"),
  );
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
    () =>
      new Map(input?.kind === "ordering" ? selectedIds.map((id, index) => [id, index + 1]) : []),
    [selectedIds, input?.kind],
  );
  const directSpatialInput =
    (input?.kind === "entity-selection" || input?.kind === "ordering") &&
    candidateIds.length > 0 &&
    candidateIds.every((id) => spatialEntityIds(fixture).has(id));
  const retaliation =
    fixture.waitState.kind === "decision" &&
    fixture.waitState.decisionKind === "choose-retaliators" &&
    directSpatialInput;
  const [retaliationAnswers, setRetaliationAnswers] = useState<readonly string[]>([]);
  useEffect(() => {
    setRetaliationAnswers([]);
  }, [authoritativeVersion]);
  const undecidedRetaliator = retaliation
    ? candidateIds.find((id) => !retaliationAnswers.includes(id))
    : undefined;
  const answerRetaliation = (retaliate: boolean) => {
    if (!undecidedRetaliator || !input || !draft.active) return;
    if (retaliate) draft.change(input.id, [...selectedIds, undecidedRetaliator]);
    else if (inputValue === undefined) draft.change(input.id, []);
    setRetaliationAnswers((ids) => [...ids, undecidedRetaliator]);
  };
  useEffect(() => {
    if (
      retaliation &&
      !draft.submissionRejected &&
      draft.active &&
      input &&
      candidateIds.length === retaliationAnswers.length &&
      interactionInputComplete(input, inputValue ?? [])
    )
      draft.confirmCurrent();
  }, [
    retaliation,
    draft.submissionRejected,
    draft.active,
    input,
    candidateIds.length,
    retaliationAnswers.length,
    inputValue,
    draft.confirmCurrent,
  ]);
  // Choosing the last required card commits the selection; no second confirmation step.
  useEffect(() => {
    if (
      !onSubmit ||
      draft.submissionRejected ||
      !draft.active ||
      !directSpatialInput ||
      retaliation ||
      (input?.kind !== "entity-selection" && input?.kind !== "ordering")
    )
      return;
    if (selectedIds.length === input.max && interactionInputComplete(input, inputValue))
      draft.confirmCurrent();
  }, [
    onSubmit,
    draft.submissionRejected,
    draft.active,
    directSpatialInput,
    retaliation,
    input,
    inputValue,
    selectedIds.length,
    draft.confirmCurrent,
  ]);
  const finishSelection = () => {
    if (!onSubmit || !draft.active || !directSpatialInput || !input || retaliation) return;
    if (interactionInputComplete(input, inputValue ?? [])) draft.confirmCurrent();
  };
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
    if (retaliation) {
      if (entityId === undecidedRetaliator) answerRetaliation(true);
      return;
    }
    if (!draft.active && decisionAction) {
      // A view flip into a decision can clear the auto-begun decision draft in
      // the same commit (the provider's stale-draft invalidation runs after the
      // child auto-begin). The click proves the projected decision is answerable,
      // so begin it here; seed singleton entity selections so this answer is not
      // lost. Other input kinds restart the draft unseeded and keep their normal
      // toggle/ordering flow on the next click.
      const seedable = input.kind === "entity-selection" && input.min <= 1 && input.max >= 1;
      draft.begin(decisionAction.id, seedable ? { [input.id]: [entityId] } : undefined);
      return;
    }
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
  const beginAction = (actionId: string, clickedEntityId?: string) => {
    setHoveredEntityId(undefined);
    hidePreview();
    // A hosted send can be rejected after the draft considered it submitted.
    // An explicit retry must release that request's duplicate-send guard.
    if (errorMessage) draft.cancel();
    const action = view?.actions.find((entry) => entry.id === actionId);
    const attacker = action?.inputs.find((entry) => entry.id === "attacker");
    const sourceId = clickedEntityId;
    const selectedSource =
      action?.intent === "attack" &&
      sourceId &&
      attacker?.kind === "entity-selection" &&
      attacker.min === 1 &&
      attacker.max === 1 &&
      attacker.candidates.some(
        (candidate) => candidate.enabled !== false && candidate.entity.instanceId === sourceId,
      );
    // Clicking this card already selected the attacker. Seed only that choice;
    // the shared draft still validates weapons, targets, and costs in sequence.
    draft.begin(actionId, selectedSource ? { attacker: [sourceId] } : undefined);
  };
  const hasFocusedChoice = Boolean(choiceModal);
  const workspace = useMemo<GrandArchiveInteractionWorkspaceValue>(
    () => ({
      active: draft.active || Boolean(view?.resolution),
      setPromptHost,
      hasFocusedChoice,
      attackSourceId,
      attackTargetIds:
        attackSourceId && Array.isArray(draft.values["attack-targets"])
          ? draft.values["attack-targets"]
          : [],
      attackTargeting,
      previewTargetId:
        attackTargeting && hoveredEntityId && candidateIds.includes(hoveredEntityId)
          ? hoveredEntityId
          : undefined,
      candidateIds: retaliation ? (undecidedRetaliator ? [undecidedRetaliator] : []) : candidateIds,
      selectedIds,
      selectedOrder,
      beginAction,
      selectEntity,
      finishSelection,
      previewEntity: (entity) => {
        setHoveredEntityId(entity?.id);
        if (attackTargeting) hidePreview();
        else if (entity) showPreview(entity);
        else hidePreview();
      },
    }),
    [
      attackSourceId,
      attackTargeting,
      hoveredEntityId,
      hasFocusedChoice,
      retaliation,
      undecidedRetaliator,
      retaliationAnswers,
      candidateIds,
      errorMessage,
      draft.cancel,
      draft.values,
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
      <InteractionDraftPrompt
        view={view}
        viewerId={self?.id ?? ""}
        actionId={selectedActionId}
        visibleEntityIds={spatialEntityIds(fixture)}
        preferredPlacement="bottom"
        reserveBottomTargetArea
        choiceModal={choiceModal}
        instructionOnly={
          !onSubmit || pregamePromptActive || stackPromptActive || directSpatialInput
        }
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
          ) : draft.submissionRejected ? (
            <Group gap="xs">
              <Button mih={44} size="sm" onClick={draft.confirmCurrent}>
                Retry selection
              </Button>
              <Button
                mih={44}
                size="sm"
                variant="subtle"
                onClick={() => {
                  draft.clear();
                  setRetaliationAnswers([]);
                }}
              >
                Reset selection
              </Button>
            </Group>
          ) : retaliation ? (
            <Group gap="xs">
              <Button
                mih={44}
                size="sm"
                disabled={!undecidedRetaliator}
                onClick={() => answerRetaliation(true)}
              >
                Retaliate
              </Button>
              <Button
                mih={44}
                size="sm"
                variant="subtle"
                disabled={!undecidedRetaliator}
                onClick={() => answerRetaliation(false)}
              >
                Take hit
              </Button>
            </Group>
          ) : directSpatialInput && input ? (
            <Group gap="xs">
              {input.min !== input.max ? (
                <Button
                  mih={44}
                  size="sm"
                  onClick={finishSelection}
                  disabled={!interactionInputComplete(input, inputValue ?? [])}
                >
                  {selectedIds.length
                    ? "Use selected"
                    : input.id === "weapons"
                      ? "No weapon"
                      : "Choose none"}
                </Button>
              ) : null}
              {!view.resolution ? (
                <Button mih={44} size="sm" variant="subtle" onClick={draft.cancel}>
                  Cancel
                </Button>
              ) : null}
            </Group>
          ) : undefined
        }
        actionPresentation={
          retaliation
            ? {
                title: "Choose retaliation",
                body: `${fixture.entities.find((entity) => entity.id === undecidedRetaliator)?.title ?? "Defending unit"} · ${retaliationAnswers.length + 1} of ${candidateIds.length}`,
                details: "Decide for each eligible defender. No Opportunity during this choice.",
              }
            : directSpatialInput && input
              ? {
                  title: attackTargeting
                    ? input.id === "attack-targets"
                      ? "Choose attack targets"
                      : "Choose the defending player"
                    : playerChoice
                      ? "Choose the defending player"
                      : input.kind === "ordering"
                        ? "Order cards"
                        : input.kind === "entity-selection" && input.role === "cost"
                          ? "Pay cost"
                          : "Choose cards",
                  body: playerChoice
                    ? "Select a highlighted player."
                    : `${selectedIds.length} / ${input.max} selected · tap highlighted cards${input.kind === "ordering" ? " in order" : ""}.`,
                }
              : pregamePromptActive
                ? { title: "Before the game begins", body: "Choose your starting-card actions." }
                : attackTargeting
                  ? {
                      title:
                        input?.id !== "attack-targets"
                          ? "Choose the defending player"
                          : "Choose attack targets",
                      body:
                        input?.id !== "attack-targets"
                          ? "Select a highlighted player."
                          : "Select highlighted targets to attack.",
                    }
                  : playerChoice
                    ? { title: "Choose the defending player", body: "Select a highlighted player." }
                    : stackPromptActive
                      ? {
                          title: stackTop?.title ?? "Top effect",
                          body: responseInstruction,
                          details: stackText || undefined,
                        }
                      : undefined
        }
        cancellable={!view.resolution && !stackPromptActive}
        onCancel={draft.cancel}
        onSubmit={onSubmit}
        renderText={(text) => resolveEntityReferences(text, fixture)}
        candidateCaption={(_, id) => {
          const entity = fixture.entities.find(
            (candidate) => candidate.id === id && candidate.face === "public",
          );
          if (!entity) return undefined;
          const owner = fixture.table.seats.find((seat) => seat.id === entity.ownerId);
          return owner
            ? `${owner.perspective === "bottom" ? "You" : "Opponent"} · ${entity.title}`
            : entity.title;
        }}
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
      {promptHost ? createPortal(prompt, promptHost) : prompt}
      {errorMessage ? (
        promptHost ? (
          createPortal(
            <div className="ga-interaction-error" role="alert">
              {errorMessage}
            </div>,
            promptHost,
          )
        ) : (
          <div className="ga-interaction-error" role="alert">
            {errorMessage}
          </div>
        )
      ) : null}
    </GrandArchiveInteractionWorkspaceContext.Provider>
  );
}
