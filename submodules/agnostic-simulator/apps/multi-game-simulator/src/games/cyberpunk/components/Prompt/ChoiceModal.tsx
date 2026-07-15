import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IconArrowBarToDown, IconArrowBarToUp, IconMinus } from "@tabler/icons-react";
import {
  buildInteractionSubmissionForActionId,
  type InteractionAction,
  type InteractionSubmissionValue,
} from "@tcg/protocol";
import type { PlayerPrompt } from "@tcg/cyberpunk-engine";
import { DeckRevealShelf } from "@tcg/simulator-ui";
import { defOf } from "@tcg/cyberpunk-engine";
import {
  getGearAttachTargets,
  getProgramSpatialTargets,
  PLAYER_SIDE_TO_ID,
  interactionSubmissionToEngineAction,
  useEngine,
  useEngineInteractionView,
  useNativePromptPresentation,
  type Side,
} from "../../engine";
import { buildCyberpunkDeckReveal } from "../../engine/deckRevealProjection";
import { CardImage } from "../GameBoard/CardImage";
import { CardNameToken } from "../CardDisplay/CardNameToken";
import { useMoveSelection } from "../GameBoard/MoveSelectionContext";
import {
  choiceActionHasRenderableDrawerContent,
  choiceModalActionFromInteractionView,
  getTargetPromptPresentation,
  nativeTargetChoiceModalRequestId,
} from "./choiceModalAction";
import {
  setChoiceModalOpen,
  setChoiceModalMinimized,
  useChoiceModalExplicitlyClosed,
  useChoiceModalMinimized,
  useChoiceModalOpen,
} from "./choiceModalState";
import { booleanInput, entityInput, optionInput } from "./interactionInputs";
import classes from "./ChoiceModal.module.css";

interface ChoiceModalProps {
  /** The side whose perspective the modal is rendered for. */
  side: Side;
  /** Adapts the same choice modal for the dense mobile board shell. */
  surface?: "desktop" | "mobile";
}

type ChoiceModalPlacement = "top" | "bottom";

/**
 * Renders a centered sheet for non-spatial choice prompts. Spatial choices
 * (chooseCardToPlay where candidates are visible on the board, chooseCardToMove
 * onto a unit, etc.) are handled inline by Card.tsx and don't surface here.
 *
 * chooseEffect is fully wired; the rest get a JSON placeholder so designers can
 * see the shape and we can plumb them incrementally.
 */
export function ChoiceModal({ side, surface = "desktop" }: ChoiceModalProps) {
  const [placement, setPlacement] = useState<ChoiceModalPlacement>("bottom");
  const { humanSide, matchState } = useEngine();
  const interactionView = useEngineInteractionView(side);
  const prompt = useNativePromptPresentation(side);
  const moveSelection = useMoveSelection();
  const selectedPlayCardId =
    moveSelection.selection?.side === side && moveSelection.selection.moveId === "playCard"
      ? moveSelection.selection.sourceCardId
      : undefined;
  const selectedPlayCard = selectedPlayCardId ? matchState.G.cardIndex[selectedPlayCardId] : null;
  const selectedPlayCardDef = selectedPlayCard ? defOf(selectedPlayCard) : null;
  const selectedPlaySourceType: SelectedPlaySourceType | null =
    selectedPlayCardDef?.type === "gear"
      ? "gear"
      : selectedPlayCardDef?.type === "program"
        ? "program"
        : null;
  const selectedPlayTargetIds =
    selectedPlayCardId && selectedPlaySourceType === "gear"
      ? getGearAttachTargets({ interactionView }, selectedPlayCardId, "gear")
      : selectedPlayCardId && selectedPlaySourceType === "program"
        ? getProgramSpatialTargets({ matchState, side, interactionView }, selectedPlayCardId)
        : [];
  const selectedPlayTargetRequestId =
    selectedPlayCardId && selectedPlayTargetIds.length > 0
      ? ["selected-play-target", side, selectedPlayCardId, selectedPlayTargetIds.join("|")].join(
          ":",
        )
      : null;
  const targetPromptPresentation = getTargetPromptPresentation({
    actions: interactionView.actions,
    matchState,
    selectedPlayTargetRequestId,
    choice: prompt.choice,
    visibleHandOwnerId: PLAYER_SIDE_TO_ID[side],
  });
  const autoActionCandidate = choiceModalActionFromInteractionView(
    interactionView.actions,
    matchState,
    {
      visibleHandOwnerId: PLAYER_SIDE_TO_ID[side],
    },
  );
  const autoAction =
    targetPromptPresentation.presentation !== "none" ||
    (surface === "mobile" && isTargetChoiceModalAction(autoActionCandidate))
      ? null
      : autoActionCandidate;
  const requestId =
    targetPromptPresentation.presentation === "drawer" ||
    targetPromptPresentation.presentation === "spatial"
      ? targetPromptPresentation.requestId
      : null;
  const storedOpened = useChoiceModalOpen(side, requestId ?? undefined);
  const spatialChoiceOpened =
    targetPromptPresentation.presentation === "spatial" &&
    targetPromptPresentation.requestId !== null &&
    storedOpened;
  const requestedAction =
    targetPromptPresentation.presentation === "drawer" || spatialChoiceOpened
      ? targetPromptPresentation.action
      : null;
  const nativeTargetRequestId =
    (targetPromptPresentation.presentation === "drawer" || spatialChoiceOpened) &&
    !requestedAction &&
    nativeTargetChoiceModalRequestId(prompt.choice)
      ? targetPromptPresentation.requestId
      : null;
  const currentRequestId = requestId ?? autoAction?.requestId ?? undefined;
  const minimized = useChoiceModalMinimized(side, currentRequestId);
  const actionRequestId = autoAction?.requestId;
  const selectedPlayTargetChoiceOpen =
    spatialChoiceOpened &&
    selectedPlayCardId !== undefined &&
    selectedPlaySourceType !== null &&
    selectedPlayTargetIds.length > 0;
  const canRenderChoice =
    targetPromptPresentation.presentation === "drawer" ||
    Boolean(autoAction && !isTargetChoiceModalAction(autoAction)) ||
    spatialChoiceOpened;
  const canAutoOpenChoice = Boolean(
    canRenderChoice &&
    requestId &&
    targetPromptPresentation.presentation === "drawer" &&
    (requestedAction || nativeTargetRequestId),
  );
  const explicitlyClosed = useChoiceModalExplicitlyClosed(side, requestId ?? undefined);
  const opened =
    storedOpened || (side === humanSide && !minimized && !explicitlyClosed && canAutoOpenChoice);
  const action = opened ? requestedAction : autoAction;
  const nativeTargetChoice =
    opened && !requestedAction && nativeTargetRequestId && isNativeTargetChoice(prompt.choice)
      ? prompt.choice
      : null;
  const hasRenderableActionContent = action
    ? choiceActionHasRenderableDrawerContent(action)
    : false;
  const hasRenderableNativeTargetChoice =
    nativeTargetChoice !== null && nativeTargetChoiceHasRenderableContent(nativeTargetChoice);
  const hasRenderableModalContent =
    hasRenderableActionContent || hasRenderableNativeTargetChoice || selectedPlayTargetChoiceOpen;
  const shouldRenderEmptyDrawer =
    opened &&
    targetPromptPresentation.presentation === "drawer" &&
    !hasRenderableModalContent &&
    currentRequestId !== undefined;

  useEffect(() => {
    if (actionRequestId) {
      setChoiceModalMinimized(side, actionRequestId, false);
    }
  }, [actionRequestId, side]);

  useEffect(() => {
    if (!currentRequestId) {
      return;
    }
    setPlacement("bottom");
  }, [currentRequestId]);

  useEffect(() => {
    if (
      side !== humanSide ||
      !currentRequestId ||
      storedOpened ||
      minimized ||
      explicitlyClosed ||
      !canAutoOpenChoice
    ) {
      return;
    }
    setChoiceModalOpen(side, currentRequestId, true);
  }, [
    canRenderChoice,
    canAutoOpenChoice,
    currentRequestId,
    explicitlyClosed,
    humanSide,
    minimized,
    nativeTargetRequestId,
    requestedAction,
    side,
    storedOpened,
  ]);

  useEffect(() => {
    if (!currentRequestId || !storedOpened) {
      return;
    }
    if (!hasRenderableModalContent && !shouldRenderEmptyDrawer) {
      setChoiceModalOpen(side, currentRequestId, false);
    }
  }, [currentRequestId, hasRenderableModalContent, side, storedOpened, shouldRenderEmptyDrawer]);

  if (
    side !== humanSide ||
    !canRenderChoice ||
    (!hasRenderableModalContent && !shouldRenderEmptyDrawer)
  ) {
    return null;
  }
  const title = shouldRenderEmptyDrawer
    ? "No targets available"
    : action
      ? modalTitle(action)
      : "Choose target";
  if (minimized) {
    return null;
  }
  if (!currentRequestId) {
    return null;
  }
  const dialog = (
    <div
      className={`${classes.scrim} ${surface === "mobile" ? classes.mobileScrim : ""}`}
      role="dialog"
      aria-modal="true"
      data-placement={placement}
      data-surface={surface}
    >
      <div
        className={`${classes.sheet} ${surface === "mobile" ? classes.mobileSheet : ""}`}
        data-testid="choice-modal-sheet"
        data-placement={placement}
        data-surface={surface}
      >
        <div className={classes.windowActions}>
          <button
            type="button"
            className={classes.iconButton}
            data-testid="choice-modal-toggle-placement"
            aria-label={placement === "top" ? "Move prompt below board" : "Move prompt above board"}
            title={placement === "top" ? "Move below" : "Move above"}
            onClick={() => setPlacement((current) => (current === "top" ? "bottom" : "top"))}
          >
            {placement === "top" ? (
              <IconArrowBarToDown size={14} stroke={1.8} />
            ) : (
              <IconArrowBarToUp size={14} stroke={1.8} />
            )}
          </button>
          <button
            type="button"
            className={classes.minimizeButton}
            data-testid="choice-modal-minimize"
            aria-label={`Minimize ${title}`}
            title="Minimize"
            onClick={() => setChoiceModalMinimized(side, currentRequestId, true)}
          >
            <IconMinus size={14} stroke={1.8} />
          </button>
        </div>
        {action && hasRenderableActionContent ? (
          <ChoiceContent action={action} side={side} />
        ) : nativeTargetChoice && hasRenderableNativeTargetChoice ? (
          <NativeTargetChoiceContent
            choice={nativeTargetChoice}
            requestId={currentRequestId}
            side={side}
          />
        ) : selectedPlayTargetChoiceOpen &&
          selectedPlayCardId &&
          selectedPlayCardDef &&
          selectedPlaySourceType &&
          currentRequestId ? (
          <SelectedPlayTargetChoiceContent
            requestId={currentRequestId}
            side={side}
            sourceCardId={selectedPlayCardId}
            sourceName={selectedPlayCardDef.displayName ?? selectedPlayCardDef.name}
            sourceType={selectedPlaySourceType}
            targetIds={selectedPlayTargetIds}
          />
        ) : shouldRenderEmptyDrawer ? (
          <EmptyChoiceContent onClose={() => setChoiceModalOpen(side, currentRequestId, false)} />
        ) : null}
      </div>
    </div>
  );
  return typeof document === "undefined" ? dialog : createPortal(dialog, document.body);
}

type NativeTargetChoice = Extract<NonNullable<PlayerPrompt["choice"]>, { type: "chooseTarget" }>;
type SelectedPlaySourceType = "gear" | "program";

function isTargetChoiceModalAction(action: InteractionAction | null): boolean {
  switch (action?.id) {
    case "resolveCardToPlay":
    case "resolveEffectTarget":
    case "resolveDiscardFromHand":
    case "resolveCardToMove":
      return true;
    default:
      return false;
  }
}

function isNativeTargetChoice(
  choice: PlayerPrompt["choice"] | null | undefined,
): choice is NativeTargetChoice {
  return choice?.type === "chooseTarget";
}

function nativeTargetChoiceHasRenderableContent(choice: NativeTargetChoice): boolean {
  if (choice.payload.type !== "effectTarget") {
    return false;
  }
  return Boolean(choice.payload.cards?.length || choice.payload.eligibleIds?.length);
}

function EmptyChoiceContent({ onClose }: { onClose: () => void }) {
  return (
    <div className={classes.emptyState} data-testid="choice-modal-empty-body">
      <p className={classes.kicker}>Target prompt</p>
      <p className={classes.title}>No targets available</p>
      <p className={classes.subtitle}>
        This prompt has no drawer targets to show. Close it and use any highlighted board target if
        one is available.
      </p>
      <div className={classes.actions}>
        <button type="button" className={classes.secondary} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function SelectedPlayTargetChoiceContent({
  requestId,
  side,
  sourceCardId,
  sourceName,
  sourceType,
  targetIds,
}: {
  requestId: string;
  side: Side;
  sourceCardId: string;
  sourceName: string;
  sourceType: SelectedPlaySourceType;
  targetIds: readonly string[];
}) {
  const { dispatch, matchState } = useEngine();
  const moveSelection = useMoveSelection();
  const chooseTarget = (targetId: string) => {
    const as = PLAYER_SIDE_TO_ID[side];
    if (sourceType === "gear") {
      dispatch({ type: "playCard", cardId: sourceCardId, attachToId: targetId, as });
      moveSelection.clearSelection();
      setChoiceModalOpen(side, requestId, false);
      return;
    }
    const result = dispatch({ type: "playCard", cardId: sourceCardId, as });
    if (result.success) {
      dispatch({ type: "resolveEffectTarget", targetIds: [targetId], as });
    }
    moveSelection.clearSelection();
    setChoiceModalOpen(side, requestId, false);
  };

  return (
    <>
      <p className={classes.title}>
        Choose target for <SourceCardName cardId={sourceCardId} fallbackName={sourceName} />
      </p>
      <p className={classes.subtitle}>Select from the legal board targets below.</p>
      <TargetCandidateGrid
        candidates={targetIds.map((cardId) => ({
          cardId,
          selected: false,
          summary: cardSummary(matchState, cardId),
          selectable: true,
          source: targetSource(matchState, cardId),
          onSelect: () => chooseTarget(cardId),
        }))}
      />
    </>
  );
}

function NativeTargetChoiceContent({
  choice,
  requestId,
  side,
}: {
  choice: NativeTargetChoice;
  requestId: string;
  side: Side;
}) {
  const { dispatch, matchState } = useEngine();
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  if (choice.payload.type !== "effectTarget") {
    return null;
  }
  const targetKind = choice.payload.targetKind ?? "card";
  const targetIds =
    targetKind === "gig"
      ? (choice.payload.eligibleIds ?? choice.payload.cards?.map((card) => card.instanceId) ?? [])
      : (choice.payload.cards?.map((card) => card.instanceId) ?? choice.payload.eligibleIds ?? []);
  if (!targetIds.length) {
    return null;
  }
  const required = choice.payload.min ?? 1;
  const max = choice.payload.max ?? required;
  const canSkip = required === 0 || Boolean(choice.payload.canDecline);
  const selectedCount = selectedTargetIds.length;
  const canConfirm =
    selectedCount >= required && selectedCount <= max && !(canSkip && selectedCount === 0);
  const sourceName = choice.payload.source?.displayName;
  const sourceCardId = choice.payload.source?.cardId;
  if (targetKind === "gig") {
    const submitTargets = (targetIds: string[]) => {
      dispatch({
        type: "resolveEffectTarget",
        targetIds,
        as: PLAYER_SIDE_TO_ID[side],
      });
      setChoiceModalOpen(side, requestId, false);
    };
    const toggleTarget = (dieId: string) => {
      if (max <= 1) {
        submitTargets([dieId]);
        return;
      }
      setSelectedTargetIds((current) =>
        current.includes(dieId)
          ? current.filter((id) => id !== dieId)
          : current.length >= max
            ? current
            : [...current, dieId],
      );
    };
    return (
      <>
        <p className={classes.title}>
          {sourceName ? (
            <>
              Choose Gig for <SourceCardName cardId={sourceCardId} fallbackName={sourceName} />
            </>
          ) : (
            "Choose Gig"
          )}
        </p>
        <p className={classes.subtitle}>{gigTargetSubtitle(required, max)}</p>
        {choice.payload.source?.rulesText ? (
          <p className={classes.sourceLine}>{choice.payload.source.rulesText}</p>
        ) : null}
        <div className={classes.options}>
          {targetIds.map((dieId) => {
            const selected = selectedTargetIds.includes(dieId);
            const summary = gigDieSummary(matchState, dieId);
            return (
              <button
                key={dieId}
                type="button"
                className={`${classes.option} ${selected ? classes.optionSelected : ""}`}
                data-testid="target-modal-gig"
                data-die-id={dieId}
                data-owner-id={summary?.ownerId ?? ""}
                data-selectable="true"
                aria-pressed={selected}
                aria-label={`${selected ? "Selected" : "Select"} ${summary?.label ?? "Gig"}`}
                onClick={() => toggleTarget(dieId)}
              >
                <span className={classes.triggerOptionTitle}>{summary?.label ?? "Gig die"}</span>
                <span className={classes.triggerOptionCopy}>{summary?.description ?? dieId}</span>
                {selected ? <span className={classes.selectedMark}>Selected</span> : null}
              </button>
            );
          })}
        </div>
        {max > 1 || canSkip ? (
          <div className={classes.actions}>
            <span className={classes.selectionCount}>
              {selectedCount}/{max}
            </span>
            <button
              type="button"
              className={classes.secondary}
              onClick={() => setSelectedTargetIds([])}
              disabled={selectedCount === 0}
            >
              Clear
            </button>
            {canSkip ? (
              <button
                type="button"
                className={classes.secondary}
                onClick={() => {
                  dispatch({
                    type: "resolveEffectTarget",
                    pass: true,
                    as: PLAYER_SIDE_TO_ID[side],
                  });
                  setChoiceModalOpen(side, requestId, false);
                }}
              >
                Take none
              </button>
            ) : null}
            <button
              type="button"
              className={classes.primary}
              data-testid="target-modal-confirm"
              disabled={!canConfirm}
              onClick={() => {
                if (!canConfirm) return;
                submitTargets(selectedTargetIds);
              }}
            >
              Confirm
            </button>
          </div>
        ) : null}
      </>
    );
  }
  const summaries = targetIds.map((cardId) => cardSummary(matchState, cardId)).filter(Boolean);
  const allUnits = summaries.length > 0 && summaries.every((summary) => summary?.type === "unit");
  const sourceRules = choice.payload.source?.rulesText?.toLowerCase() ?? "";
  const title =
    allUnits && choice.payload.targetPurpose === "attachHost" ? (
      "Choose Unit to equip"
    ) : choice.payload.source ? (
      <>
        Choose target for{" "}
        <SourceCardName
          cardId={choice.payload.source.cardId}
          fallbackName={choice.payload.source.displayName}
        />
      </>
    ) : (
      "Choose target"
    );
  const subtitle =
    allUnits && choice.payload.targetPurpose === "attachHost"
      ? "Pick the friendly Unit that will receive the Gear."
      : sourceRules.toLowerCase().includes("rival unit")
        ? "Pick the rival Unit to target."
        : effectTargetSubtitle(
            required,
            max,
            nativeChoiceHasMultipleTargetZones(matchState, targetIds),
          );
  const submitTargets = (targetIds: string[]) => {
    dispatch({
      type: "resolveEffectTarget",
      targetIds,
      as: PLAYER_SIDE_TO_ID[side],
    });
    setChoiceModalOpen(side, requestId, false);
  };
  const toggleTarget = (cardId: string) => {
    if (max <= 1) {
      submitTargets([cardId]);
      return;
    }
    setSelectedTargetIds((current) =>
      current.includes(cardId)
        ? current.filter((id) => id !== cardId)
        : current.length >= max
          ? current
          : [...current, cardId],
    );
  };
  return (
    <>
      <p className={classes.title}>{title}</p>
      <p className={classes.subtitle}>{subtitle}</p>
      <TargetCandidateGrid
        candidates={targetIds.map((cardId) => ({
          cardId,
          selected: selectedTargetIds.includes(cardId),
          summary: cardSummary(matchState, cardId),
          selectable: true,
          source: targetSource(matchState, cardId),
          onSelect: () => toggleTarget(cardId),
        }))}
      />
      {max > 1 || canSkip ? (
        <div className={classes.actions}>
          <span className={classes.selectionCount}>
            {selectedCount}/{max}
          </span>
          <button
            type="button"
            className={classes.secondary}
            onClick={() => setSelectedTargetIds([])}
            disabled={selectedCount === 0}
          >
            Clear
          </button>
          {canSkip ? (
            <button
              type="button"
              className={classes.secondary}
              onClick={() => {
                dispatch({
                  type: "resolveEffectTarget",
                  pass: true,
                  as: PLAYER_SIDE_TO_ID[side],
                });
                setChoiceModalOpen(side, requestId, false);
              }}
            >
              Take none
            </button>
          ) : null}
          <button
            type="button"
            className={classes.primary}
            data-testid="target-modal-confirm"
            disabled={!canConfirm}
            onClick={() => {
              if (!canConfirm) return;
              submitTargets(selectedTargetIds);
            }}
          >
            Confirm
          </button>
        </div>
      ) : null}
    </>
  );
}

function modalTitle(action: InteractionAction): string {
  if (optionInput(action, "effectId")) {
    return "Choose effect";
  }
  switch (action.id) {
    case "resolveScry":
      return "Deck search";
    case "resolveRevealDestination":
      return "Choose destination";
    case "resolveCardTypeChoice":
      return "Choose card type";
    case "resolveTrigger":
      return "Choose trigger";
    case "resolveEffectTarget":
      return "Choose target";
    case "resolveCardToMove":
      return "Choose target";
    default:
      return "Choice";
  }
}

function ChoiceContent({ action, side }: { action: InteractionAction; side: Side }) {
  const { dispatch, matchState } = useEngine();
  const interactionView = useEngineInteractionView(side);
  const [selectedSearchIds, setSelectedSearchIds] = useState<string[]>([]);
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  const submitInteraction = useCallback(
    (actionId: string, values: Record<string, InteractionSubmissionValue> = {}) => {
      const submission = buildInteractionSubmissionForActionId({
        view: interactionView,
        actionId,
        values,
      });
      if (!submission) {
        return;
      }
      const action = interactionSubmissionToEngineAction(submission, PLAYER_SIDE_TO_ID[side]);
      if (action) {
        dispatch(action);
      }
    },
    [dispatch, interactionView, side],
  );
  const choiceResetKey = `${action.requestId}:${action.id}`;

  useEffect(() => {
    setSelectedSearchIds([]);
    setSelectedTargetIds([]);
  }, [choiceResetKey]);

  useEffect(() => {
    if (action.id !== "resolveScry") {
      return;
    }
    const cardInput = entityInput(action, "selectedCardIds", "card");
    if (!cardInput || cardInput.min !== 0) {
      return;
    }
    const hasSelectableCandidate = cardInput.candidates.some(
      (candidate) => candidate.enabled !== false,
    );
    if (cardInput.candidates.length > 0 && !hasSelectableCandidate) {
      const destinationZone = optionInput(action, "destinationZone")?.options[0]?.id ?? "hand";
      submitInteraction("resolveScry", { destinationZone, selectedCardIds: [] });
    }
  }, [action, submitInteraction]);

  const effectInput = optionInput(action, "effectId");
  if (effectInput) {
    const effects = effectInput.options;
    return (
      <>
        <p className={classes.title}>Choose effect</p>
        <p className={classes.subtitle}>Pick one effect to resolve.</p>
        <div className={classes.options}>
          {effects.map((eff) => (
            <button
              key={eff.id}
              type="button"
              className={classes.option}
              disabled={!action.enabled}
              onClick={() => {
                // Effect resolution is handled engine-side via resolveCardToPlay
                // for the chooseCardToPlay subtype, or the engine auto-applies
                // for chooseEffect when the chooser submits a direct index.
                // For this prototype we surface the option but rely on the
                // engine's own auto-resolve for chooseEffect — manual wiring
                // requires a new dispatch action which we'll add when the
                // engine surfaces `resolveChooseEffect`.
                // eslint-disable-next-line no-console
                console.warn("chooseEffect id", eff.id, "not yet wired to a dispatch");
              }}
            >
              {textParam(eff.text.params, "label") ?? `Effect ${eff.id}`}
            </button>
          ))}
        </div>
      </>
    );
  }

  switch (action.id) {
    case "resolveEffectTarget": {
      const targetInput = entityInput(action, "targetIds", "card");
      if (targetInput) {
        const passInput = booleanInput(action, "pass");
        const sourceName = textParam(action.text.params, "sourceDisplayName");
        const sourceCardId = textParam(action.text.params, "sourceCardId");
        const copy = effectTargetChoiceCopy(
          matchState,
          action,
          targetInput.candidates.map((candidate) => candidate.entity.instanceId),
        );
        const required = targetInput.min;
        const max = targetInput.max;
        const canSkip = required === 0 || Boolean(passInput);
        const selectedCount = selectedTargetIds.length;
        const canConfirm =
          selectedCount >= required && selectedCount <= max && !(canSkip && selectedCount === 0);
        const toggleTarget = (cardId: string) => {
          if (max <= 1) {
            submitInteraction("resolveEffectTarget", { targetIds: [cardId] });
            return;
          }
          setSelectedTargetIds((current) =>
            current.includes(cardId)
              ? current.filter((id) => id !== cardId)
              : current.length >= max
                ? current
                : [...current, cardId],
          );
        };
        return (
          <>
            <p className={classes.title}>
              {copy.title ? (
                copy.title
              ) : sourceName ? (
                <>
                  Choose target for{" "}
                  <SourceCardName cardId={sourceCardId} fallbackName={sourceName} />
                </>
              ) : (
                "Choose target"
              )}
            </p>
            <p className={classes.subtitle}>
              {copy.subtitle ??
                effectTargetSubtitle(
                  required,
                  max,
                  hasMultipleTargetZones(matchState, targetInput.candidates),
                )}
            </p>
            <TargetCandidateGrid
              candidates={targetInput.candidates.map((candidate) => {
                const cardId = candidate.entity.instanceId;
                return {
                  cardId,
                  selected: selectedTargetIds.includes(cardId),
                  summary: cardSummary(matchState, cardId),
                  selectable: candidate.enabled !== false,
                  source: targetSource(matchState, cardId),
                  onSelect: () => toggleTarget(cardId),
                };
              })}
            />
            {max > 1 || canSkip ? (
              <div className={classes.actions}>
                <span className={classes.selectionCount}>
                  {selectedCount}/{max}
                </span>
                <button
                  type="button"
                  className={classes.secondary}
                  onClick={() => setSelectedTargetIds([])}
                >
                  Clear
                </button>
                {canSkip ? (
                  <button
                    type="button"
                    className={classes.secondary}
                    onClick={() => {
                      dispatch({
                        type: "resolveEffectTarget",
                        pass: true,
                        as: PLAYER_SIDE_TO_ID[side],
                      });
                    }}
                  >
                    Take none
                  </button>
                ) : null}
                <button
                  type="button"
                  className={classes.primary}
                  data-testid="target-modal-confirm"
                  disabled={!canConfirm}
                  onClick={() => {
                    if (!canConfirm) return;
                    submitInteraction("resolveEffectTarget", { targetIds: selectedTargetIds });
                  }}
                >
                  Confirm
                </button>
              </div>
            ) : null}
          </>
        );
      }
      const dieTargetInput = entityInput(action, "targetIds", "die");
      if (dieTargetInput) {
        const passInput = booleanInput(action, "pass");
        const sourceName = textParam(action.text.params, "sourceDisplayName");
        const sourceCardId = textParam(action.text.params, "sourceCardId");
        const sourceRules = textParam(action.text.params, "sourceRulesText");
        const required = dieTargetInput.min;
        const max = dieTargetInput.max;
        const canSkip = required === 0 || Boolean(passInput);
        const selectedCount = selectedTargetIds.length;
        const canConfirm =
          selectedCount >= required && selectedCount <= max && !(canSkip && selectedCount === 0);
        const submitTargets = (targetIds: string[]) => {
          submitInteraction("resolveEffectTarget", { targetIds });
        };
        const toggleTarget = (dieId: string) => {
          if (max <= 1) {
            submitTargets([dieId]);
            return;
          }
          setSelectedTargetIds((current) =>
            current.includes(dieId)
              ? current.filter((id) => id !== dieId)
              : current.length >= max
                ? current
                : [...current, dieId],
          );
        };
        return (
          <>
            <p className={classes.title}>
              {sourceName ? (
                <>
                  Choose Gig for <SourceCardName cardId={sourceCardId} fallbackName={sourceName} />
                </>
              ) : (
                "Choose Gig"
              )}
            </p>
            <p className={classes.subtitle}>{gigTargetSubtitle(required, max)}</p>
            {sourceRules ? <p className={classes.sourceLine}>{sourceRules}</p> : null}
            <div className={classes.options}>
              {dieTargetInput.candidates.map((candidate) => {
                const dieId = candidate.entity.instanceId;
                const selected = selectedTargetIds.includes(dieId);
                const summary = gigDieSummary(matchState, dieId);
                const selectable = candidate.enabled !== false;
                return (
                  <button
                    key={dieId}
                    type="button"
                    className={`${classes.option} ${selected ? classes.optionSelected : ""} ${
                      selectable ? "" : classes.optionUnavailable
                    }`}
                    data-testid="target-modal-gig"
                    data-die-id={dieId}
                    data-owner-id={summary?.ownerId ?? ""}
                    data-selectable={selectable ? "true" : "false"}
                    aria-disabled={selectable ? undefined : true}
                    aria-pressed={selected}
                    aria-label={`${selectable ? (selected ? "Selected" : "Select") : "Not a valid target"} ${
                      summary?.label ?? "Gig"
                    }`}
                    onClick={() => {
                      if (!selectable) return;
                      toggleTarget(dieId);
                    }}
                  >
                    <span className={classes.triggerOptionTitle}>
                      {summary?.label ?? "Gig die"}
                    </span>
                    <span className={classes.triggerOptionCopy}>
                      {summary?.description ?? dieId}
                    </span>
                    {selected ? <span className={classes.selectedMark}>Selected</span> : null}
                  </button>
                );
              })}
            </div>
            {max > 1 || canSkip ? (
              <div className={classes.actions}>
                <span className={classes.selectionCount}>
                  {selectedCount}/{max}
                </span>
                <button
                  type="button"
                  className={classes.secondary}
                  onClick={() => setSelectedTargetIds([])}
                  disabled={selectedCount === 0}
                >
                  Clear
                </button>
                {canSkip ? (
                  <button
                    type="button"
                    className={classes.secondary}
                    onClick={() => {
                      dispatch({
                        type: "resolveEffectTarget",
                        pass: true,
                        as: PLAYER_SIDE_TO_ID[side],
                      });
                    }}
                  >
                    Take none
                  </button>
                ) : null}
                <button
                  type="button"
                  className={classes.primary}
                  data-testid="target-modal-confirm"
                  disabled={!canConfirm}
                  onClick={() => {
                    if (!canConfirm) return;
                    submitTargets(selectedTargetIds);
                  }}
                >
                  Confirm
                </button>
              </div>
            ) : null}
          </>
        );
      }
      return (
        <>
          <p className={classes.title}>Choose target</p>
          <p className={classes.subtitle}>{action.id}</p>
          <pre className={classes.placeholder}>{JSON.stringify(action, null, 2)}</pre>
        </>
      );
    }

    case "resolveDiscardFromHand": {
      const cardInput = entityInput(action, "cardIds", "card");
      if (!cardInput) return null;
      const passInput = booleanInput(action, "pass");
      const max = cardInput.max;
      const required = passInput ? max : cardInput.min;
      const selectedCount = selectedTargetIds.length;
      const canConfirm = selectedCount >= required && selectedCount <= max;
      const toggleCard = (cardId: string) => {
        setSelectedTargetIds((current) =>
          current.includes(cardId)
            ? current.filter((id) => id !== cardId)
            : current.length >= max
              ? current
              : [...current, cardId],
        );
      };
      const requirement = required === max ? `${required}` : `${required}-${max}`;
      return (
        <>
          <p className={classes.title}>Choose cards to discard</p>
          <p className={classes.subtitle}>
            Select {requirement} card{max === 1 ? "" : "s"}, or skip this optional effect.
          </p>
          <div className={`${classes.options} ${classes.searchOptions}`}>
            {cardInput.candidates.map((candidate) => {
              const cardId = candidate.entity.instanceId;
              const selected = selectedTargetIds.includes(cardId);
              const summary = cardSummary(matchState, cardId);
              return (
                <button
                  key={cardId}
                  type="button"
                  className={`${classes.option} ${classes.cardOption} ${
                    selected ? classes.optionSelected : ""
                  }`}
                  aria-label={`${selected ? "Selected" : "Select"} ${summary?.name ?? cardId}`}
                  aria-pressed={selected}
                  onClick={() => toggleCard(cardId)}
                >
                  <CardArt summary={summary} fallbackName={cardId} />
                  <CardMeta summary={summary} />
                  {selected ? <span className={classes.selectedMark}>Selected</span> : null}
                </button>
              );
            })}
          </div>
          <div className={classes.actions}>
            <span className={classes.selectionCount}>
              {selectedCount}/{max} selected
            </span>
            <button
              type="button"
              className={classes.secondary}
              onClick={() => setSelectedTargetIds([])}
              disabled={selectedCount === 0}
            >
              Clear
            </button>
            {passInput ? (
              <button
                type="button"
                className={classes.secondary}
                data-testid="discard-from-hand-pass"
                onClick={() => {
                  submitInteraction("resolveDiscardFromHand", { pass: true });
                }}
              >
                Skip effect
              </button>
            ) : null}
            <button
              type="button"
              className={classes.primary}
              data-testid="discard-from-hand-confirm"
              disabled={!canConfirm}
              onClick={() => {
                if (!canConfirm) return;
                submitInteraction("resolveDiscardFromHand", { cardIds: selectedTargetIds });
              }}
            >
              Discard selected
            </button>
          </div>
        </>
      );
    }

    case "resolveTrigger": {
      const triggerInput = optionInput(action, "triggerId");
      if (!triggerInput) return null;
      const canPass = !triggerInput.required;
      return (
        <>
          <p className={classes.title}>{canPass ? "Optional ability" : "Ability pending"}</p>
          <p className={classes.subtitle}>
            {canPass
              ? "Use the ability now, or pass to continue the turn."
              : triggerInput.options.length === 1
                ? "Resolve this ability before the game can continue."
                : "Choose which pending ability resolves next."}
          </p>
          <div className={classes.options}>
            {triggerInput.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={classes.option}
                onClick={() => {
                  submitInteraction("resolveTrigger", { triggerId: option.id });
                }}
              >
                <span className={classes.triggerOptionTitle}>
                  <SourceCardName
                    cardId={textParam(option.text.params, "sourceCardId")}
                    fallbackName={textParam(option.text.params, "cardName") ?? option.id}
                    interactive={false}
                  />
                </span>
                <span className={classes.triggerOptionCopy}>
                  {textParam(option.text.params, "abilityText") ?? "Resolve ability"}
                </span>
              </button>
            ))}
            {canPass ? (
              <button
                type="button"
                className={classes.option}
                onClick={() => {
                  submitInteraction("resolveTrigger", { pass: true });
                }}
              >
                Pass on ability
              </button>
            ) : null}
          </div>
        </>
      );
    }

    case "resolveScry": {
      const cardInput = entityInput(action, "selectedCardIds", "card");
      if (!cardInput) return null;
      const destinationZone = optionInput(action, "destinationZone")?.options[0]?.id ?? "hand";
      const canSkip = cardInput.min === 0;
      const maxSelect = cardInput.max;
      const multiSelect = maxSelect > 1;
      const requiredText =
        cardInput.min === cardInput.max
          ? `${cardInput.min}`
          : cardInput.min === 0
            ? `up to ${cardInput.max}`
            : `${cardInput.min}-${cardInput.max}`;
      const lookCount = numberParam(action.text.params, "lookCount") ?? maxSelect;
      const sourceName = textParam(action.text.params, "sourceDisplayName");
      const sourceCardId = textParam(action.text.params, "sourceCardId");
      const revealedCardIds = cardInput.candidates.flatMap((candidate) =>
        candidate.entity.kind === "card" ? [String(candidate.entity.instanceId)] : [],
      );
      const reveal = buildCyberpunkDeckReveal({
        id: `${action.requestId}:search`,
        zoneId: side === "opponent" ? "opp-deck" : "p-deck",
        ownerId: String(PLAYER_SIDE_TO_ID[side]),
        cardIds: revealedCardIds,
        count: lookCount,
        turnNumber: matchState.G.turnMetadata.turnNumber,
        matchState,
      });
      const selectedCount = selectedSearchIds.length;
      const selectableCount = cardInput.candidates.filter(
        (candidate) => candidate.enabled !== false,
      ).length;
      const canConfirm =
        selectedCount >= cardInput.min && selectedCount <= cardInput.max && selectedCount > 0;
      const submitScry = (selectedCardIds: string[]) => {
        submitInteraction("resolveScry", {
          destinationZone,
          selectedCardIds,
        });
      };
      const toggleSearchCard = (cardId: string) => {
        setSelectedSearchIds((current) => {
          if (current.includes(cardId)) {
            return current.filter((id) => id !== cardId);
          }
          if (current.length >= maxSelect) {
            return current;
          }
          return [...current, cardId];
        });
      };
      return (
        <>
          <div className={classes.searchHeader}>
            <div className={classes.searchTitleBlock}>
              <p className={classes.kicker}>Deck search</p>
              {sourceName ? (
                <p className={classes.sourceLine}>
                  Resolving <SourceCardName cardId={sourceCardId} fallbackName={sourceName} />
                </p>
              ) : null}
              <p className={classes.title}>Pick {requiredText}</p>
              <p className={classes.subtitle}>
                {selectableCount === 0 && canSkip
                  ? "No valid Gear targets. Take none to continue."
                  : `Top ${lookCount} revealed. Hover for full card view.`}
              </p>
              <DeckRevealShelf reveal={reveal} className={classes.promptRevealShelf} />
            </div>
            <div
              className={classes.searchMeter}
              aria-label={`${selectedCount} of ${maxSelect} selected`}
            >
              <strong>
                {selectedCount}/{maxSelect}
              </strong>
              <span>selected</span>
            </div>
          </div>
          <div className={`${classes.options} ${classes.searchOptions}`}>
            {cardInput.candidates.map((candidate) => {
              const cardId = candidate.entity.instanceId;
              const selected = selectedSearchIds.includes(cardId);
              const summary = cardSummary(matchState, cardId);
              const selectable = candidate.enabled !== false;
              return (
                <button
                  key={cardId}
                  type="button"
                  className={`${classes.option} ${classes.searchOption} ${
                    selected ? classes.optionSelected : ""
                  } ${selectable ? "" : classes.optionUnavailable}`}
                  data-testid="search-deck-card"
                  data-instance-id={cardId}
                  data-card-id={cardId}
                  data-definition-id={summary?.definitionId}
                  data-card-name={summary?.name}
                  data-card-type={summary?.type ?? undefined}
                  data-card-color={summary?.color}
                  data-cost={summary?.cost ?? undefined}
                  data-power={summary?.power ?? undefined}
                  data-selected={selected ? "true" : "false"}
                  data-selectable={selectable ? "true" : "false"}
                  aria-pressed={multiSelect ? selected : undefined}
                  aria-disabled={selectable ? undefined : true}
                  aria-label={`${
                    selectable ? (selected ? "Selected" : "Select") : "Not a valid target"
                  } ${summary?.name ?? cardId}`}
                  onClick={() => {
                    if (!selectable) {
                      return;
                    }
                    if (multiSelect) {
                      toggleSearchCard(cardId);
                    } else {
                      submitScry([cardId]);
                    }
                  }}
                >
                  <CardArt summary={summary} fallbackName={cardId} />
                  <CardMeta summary={summary} />
                  {!selectable ? <span className={classes.invalidMark}>Not target</span> : null}
                  {selected ? <span className={classes.selectedMark}>Selected</span> : null}
                </button>
              );
            })}
          </div>
          <div className={classes.actions} data-testid="search-deck-actions">
            <span className={classes.selectionCount}>
              {selectedCount === 0
                ? "No cards selected"
                : `${selectedCount} ready for ${scryDestinationLabel(destinationZone)}`}
            </span>
            {canSkip ? (
              <button
                type="button"
                className={selectedCount === 0 ? classes.primary : classes.secondary}
                data-testid="search-deck-skip"
                onClick={() => {
                  submitScry([]);
                }}
              >
                Take none
              </button>
            ) : null}
            {multiSelect ? (
              <button
                type="button"
                className={classes.primary}
                data-testid="search-deck-confirm"
                disabled={!canConfirm}
                onClick={() => {
                  submitScry(selectedSearchIds);
                }}
              >
                {scryConfirmLabel(destinationZone)}
              </button>
            ) : null}
          </div>
        </>
      );
    }

    case "resolveRevealDestination": {
      const destinationInput = optionInput(action, "destination");
      if (!destinationInput) return null;
      const sourceName = textParam(action.text.params, "sourceDisplayName");
      const sourceCardId = textParam(action.text.params, "sourceCardId");
      const revealedCount = numberParam(action.text.params, "revealedCount") ?? 0;
      const revealedCardIds = delimitedTextParam(action.text.params, "revealedCardIds");
      const revealedCardNames = delimitedTextParam(action.text.params, "revealedCardNames");
      const drawAmount = numberParam(action.text.params, "drawAmount") ?? 0;
      const reveal = buildCyberpunkDeckReveal({
        id: `${action.requestId}:destination`,
        zoneId:
          textParam(action.text.params, "destinationOwnerId") === String(PLAYER_SIDE_TO_ID.opponent)
            ? "opp-deck"
            : "p-deck",
        ownerId: textParam(action.text.params, "destinationOwnerId"),
        cardIds: revealedCardIds,
        fallbackNames: revealedCardNames,
        count: revealedCount,
        turnNumber: matchState.G.turnMetadata.turnNumber,
        matchState,
      });
      return (
        <>
          <p className={classes.kicker}>Revealed cards</p>
          {sourceName ? (
            <p className={classes.sourceLine}>
              Resolving <SourceCardName cardId={sourceCardId} fallbackName={sourceName} />
            </p>
          ) : null}
          <p className={classes.title}>Choose where they go</p>
          <p className={classes.subtitle}>
            {revealedCount} card{revealedCount === 1 ? "" : "s"} revealed from the top of the deck.
          </p>
          <DeckRevealShelf reveal={reveal} className={classes.promptRevealShelf} />
          <div className={classes.options}>
            {destinationInput.options.map((option) => {
              const label =
                option.id === "trash"
                  ? drawAmount > 0
                    ? `Trash them and draw ${drawAmount}`
                    : "Trash them"
                  : "Add them to hand";
              return (
                <button
                  key={option.id}
                  type="button"
                  className={classes.option}
                  data-testid="reveal-destination-option"
                  data-destination={option.id}
                  disabled={!action.enabled || option.enabled === false}
                  onClick={() => {
                    submitInteraction("resolveRevealDestination", { destination: option.id });
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </>
      );
    }

    case "resolveCardTypeChoice": {
      const cardTypeInput = optionInput(action, "cardType");
      if (!cardTypeInput) return null;
      const sourceName = textParam(action.text.params, "sourceDisplayName");
      const sourceCardId = textParam(action.text.params, "sourceCardId");
      return (
        <>
          {sourceName ? (
            <p className={classes.sourceLine}>
              Resolving <SourceCardName cardId={sourceCardId} fallbackName={sourceName} />
            </p>
          ) : null}
          <p className={classes.title}>Choose card type</p>
          <p className={classes.subtitle}>Pick the card type for this effect.</p>
          <div className={classes.options}>
            {cardTypeInput.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={classes.option}
                data-testid="card-type-choice-option"
                data-card-type={option.id}
                disabled={!action.enabled || option.enabled === false}
                onClick={() => {
                  submitInteraction("resolveCardTypeChoice", { cardType: option.id });
                }}
              >
                {cardTypeLabel(option.text)}
              </button>
            ))}
          </div>
        </>
      );
    }

    case "resolveCardToMove": {
      const cardInput = entityInput(action, "cardId", "card");
      if (!cardInput) return null;
      const sourceName = textParam(action.text.params, "sourceDisplayName");
      const sourceCardId = textParam(action.text.params, "sourceCardId");
      const destination = textParam(action.text.params, "destination");
      const titlePrefix =
        destination === "trash" && sourceName
          ? "Choose card to trash for"
          : sourceName
            ? "Choose target for"
            : null;
      return (
        <>
          <p className={classes.title}>
            {titlePrefix && sourceName ? (
              <>
                {titlePrefix} <SourceCardName cardId={sourceCardId} fallbackName={sourceName} />
              </>
            ) : (
              "Choose target"
            )}
          </p>
          <p className={classes.subtitle}>
            {hasMultipleTargetZones(matchState, cardInput.candidates)
              ? "Select from the legal targets below. Targets are grouped by source zone."
              : "Select from the legal targets below."}
          </p>
          <TargetCandidateGrid
            candidates={cardInput.candidates.map((candidate) => {
              const cardId = candidate.entity.instanceId;
              return {
                cardId,
                selected: false,
                summary: cardSummary(matchState, cardId),
                selectable: candidate.enabled !== false,
                source: targetSource(matchState, cardId),
                onSelect: () => submitInteraction("resolveCardToMove", { cardId }),
              };
            })}
          />
        </>
      );
    }

    case "gainGig":
    case "resolveCardToPlay":
      return null;
    default:
      return null;
  }
}

interface TargetCandidateView {
  cardId: string;
  selected: boolean;
  summary: CardSummary | null;
  selectable: boolean;
  source: TargetSource;
  onSelect: () => void;
}

interface TargetSource {
  zone: string | undefined;
  label: string;
  ownerId: string | undefined;
}

function TargetCandidateGrid({ candidates }: { candidates: readonly TargetCandidateView[] }) {
  const groups = groupTargetCandidates(candidates);
  if (groups.length <= 1) {
    return (
      <div className={`${classes.options} ${classes.searchOptions}`}>
        {candidates.map((candidate) => (
          <TargetCandidateButton key={candidate.cardId} candidate={candidate} />
        ))}
      </div>
    );
  }

  return (
    <div className={classes.targetZoneGroups}>
      {groups.map((group) => (
        <section
          key={group.key}
          className={classes.targetZoneGroup}
          data-testid="target-modal-zone-group"
          data-zone={group.zone ?? ""}
        >
          <div className={classes.targetZoneHeader}>
            <span className={classes.targetZoneTitle} data-testid="target-modal-zone-heading">
              {group.label}
            </span>
            <span className={classes.targetZoneCount}>
              {group.candidates.length} {group.candidates.length === 1 ? "card" : "cards"}
            </span>
          </div>
          <div className={`${classes.options} ${classes.searchOptions}`}>
            {group.candidates.map((candidate) => (
              <TargetCandidateButton key={candidate.cardId} candidate={candidate} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function TargetCandidateButton({ candidate }: { candidate: TargetCandidateView }) {
  const name = candidate.summary?.name ?? candidate.cardId;
  return (
    <button
      type="button"
      className={`${classes.option} ${classes.cardOption} ${
        candidate.selected ? classes.optionSelected : ""
      } ${candidate.selectable ? "" : classes.optionUnavailable}`}
      data-testid="target-modal-card"
      data-card-id={candidate.cardId}
      data-zone={candidate.source.zone ?? ""}
      data-owner-id={candidate.source.ownerId ?? ""}
      data-selectable={candidate.selectable ? "true" : "false"}
      aria-label={`${targetCandidateActionLabel(candidate)} ${name} from ${candidate.source.label}`}
      aria-disabled={candidate.selectable ? undefined : true}
      aria-pressed={candidate.selected}
      onClick={() => {
        if (!candidate.selectable) return;
        candidate.onSelect();
      }}
    >
      <span className={classes.zoneBadge} data-testid="target-modal-zone-badge">
        {candidate.source.label}
      </span>
      <CardArt summary={candidate.summary} fallbackName={candidate.cardId} />
      <CardMeta summary={candidate.summary} />
      {!candidate.selectable ? <span className={classes.invalidMark}>Not target</span> : null}
      {candidate.selected ? <span className={classes.selectedMark}>Selected</span> : null}
    </button>
  );
}

function targetCandidateActionLabel(candidate: TargetCandidateView): string {
  if (!candidate.selectable) {
    return "Not a valid target";
  }
  return candidate.selected ? "Selected" : "Select";
}

function groupTargetCandidates(candidates: readonly TargetCandidateView[]) {
  const groups = new Map<
    string,
    { key: string; zone: string | undefined; label: string; candidates: TargetCandidateView[] }
  >();
  for (const candidate of candidates) {
    const key = candidate.source.zone ?? "unknown";
    const current = groups.get(key) ?? {
      key,
      zone: candidate.source.zone,
      label: candidate.source.label,
      candidates: [],
    };
    current.candidates.push(candidate);
    groups.set(key, current);
  }
  return [...groups.values()].sort((a, b) => targetZoneSort(a.zone) - targetZoneSort(b.zone));
}

function targetZoneSort(zone: string | undefined): number {
  switch (zone) {
    case "hand":
      return 10;
    case "trash":
      return 20;
    case "field":
      return 30;
    case "legendArea":
      return 40;
    case "eddieArea":
      return 50;
    case "deck":
      return 60;
    default:
      return 100;
  }
}

function effectTargetSubtitle(required: number, max: number, hasMultipleZones: boolean): string {
  const cardLabel = max === 1 ? "card" : "cards";
  const selectionText =
    required === 0
      ? `Pick up to ${max} ${cardLabel}.`
      : `Pick ${required === max ? required.toString() : `${required}-${max}`} ${cardLabel}.`;
  return hasMultipleZones
    ? `${selectionText} Targets are grouped by source zone.`
    : `${selectionText} Hover for full card view.`;
}

function gigTargetSubtitle(required: number, max: number): string {
  if (required === 0) {
    return max === 1 ? "Pick up to 1 Gig." : `Pick up to ${max} Gigs.`;
  }
  const range = required === max ? required.toString() : `${required}-${max}`;
  return `Pick ${range} Gig${max === 1 ? "" : "s"}.`;
}

function gigDieSummary(
  matchState: ReturnType<typeof useEngine>["matchState"],
  dieId: string,
): { label: string; description: string; ownerId: string | undefined } | null {
  const die = matchState.G.gigDice[dieId];
  if (!die) {
    return null;
  }
  const ownerEntry = Object.entries(matchState.G.players).find(([, player]) =>
    (player.gigArea as readonly string[]).includes(dieId),
  );
  const ownerId = ownerEntry?.[0];
  const ownerLabel =
    ownerId === PLAYER_SIDE_TO_ID.player
      ? "Your Gig"
      : ownerId === PLAYER_SIDE_TO_ID.opponent
        ? "Rival Gig"
        : "Gig";
  const dieLabel = die.dieType.toUpperCase();
  return {
    label: `${ownerLabel}: ${dieLabel}`,
    description: `Showing ${die.faceValue}`,
    ownerId,
  };
}

function hasMultipleTargetZones(
  matchState: ReturnType<typeof useEngine>["matchState"],
  candidates: readonly { entity: { instanceId: string } }[],
): boolean {
  const zones = new Set(
    candidates.map((candidate) => targetSource(matchState, candidate.entity.instanceId).zone),
  );
  return zones.size > 1;
}

function nativeChoiceHasMultipleTargetZones(
  matchState: ReturnType<typeof useEngine>["matchState"],
  cardIds: readonly string[],
): boolean {
  const zones = new Set(cardIds.map((cardId) => targetSource(matchState, cardId).zone));
  return zones.size > 1;
}

function targetSource(
  matchState: ReturnType<typeof useEngine>["matchState"],
  cardId: string,
): TargetSource {
  const card = matchState.G.cardIndex[cardId];
  return {
    zone: card?.zone,
    label: targetZoneLabel(card?.zone),
    ownerId: card?.ownerId ? String(card.ownerId) : undefined,
  };
}

function targetZoneLabel(zone: string | undefined): string {
  switch (zone) {
    case "hand":
      return "Hand";
    case "trash":
      return "Trash";
    case "field":
      return "Field";
    case "legendArea":
      return "Legend area";
    case "eddieArea":
      return "Eddies";
    case "deck":
      return "Deck";
    default:
      return "Unknown zone";
  }
}

function textParam(params: InteractionAction["text"]["params"], key: string): string | undefined {
  const value = params?.[key];
  return typeof value === "string" ? value : undefined;
}

function delimitedTextParam(params: InteractionAction["text"]["params"], key: string): string[] {
  return (
    textParam(params, key)
      ?.split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0) ?? []
  );
}

function cardTypeLabel(text: InteractionAction["text"]): string {
  const label = textParam(text.params, "label");
  if (label) return label;
  switch (text.key) {
    case "cyberpunk.cardType.gear":
      return "Gear";
    case "cyberpunk.cardType.legend":
      return "Legend";
    case "cyberpunk.cardType.program":
      return "Program";
    case "cyberpunk.cardType.unit":
      return "Unit";
    default:
      return text.key;
  }
}

function SourceCardName({
  cardId,
  fallbackName,
  interactive = true,
}: {
  cardId: string | undefined;
  fallbackName: string;
  interactive?: boolean;
}) {
  return <CardNameToken cardId={cardId} fallbackName={fallbackName} interactive={interactive} />;
}

function numberParam(params: InteractionAction["text"]["params"], key: string): number | undefined {
  const value = params?.[key];
  return typeof value === "number" ? value : undefined;
}

type CardType = "legend" | "unit" | "gear" | "program";
type CardColor = "blue" | "green" | "red" | "yellow";

interface CardSummary {
  definitionId: string;
  name: string;
  type: CardType | null;
  cost: number | null;
  power: number | null;
  imageUrl: string | undefined;
  color: CardColor | undefined;
  classifications: readonly string[];
  keywords: readonly string[];
  rules: readonly string[];
  hasSellTag: boolean;
}

function CardArt({ summary, fallbackName }: { summary: CardSummary | null; fallbackName: string }) {
  const name = summary?.name ?? fallbackName;
  return (
    <span className={classes.cardArt}>
      <CardImage
        imageUrl={summary?.imageUrl}
        alt={name}
        cardType={summary?.type ?? undefined}
        color={summary?.color}
        previewDetails={
          summary
            ? {
                name,
                cardType: summary.type,
                cost: summary.cost,
                power: summary.power,
                classifications: summary.classifications,
                keywords: summary.keywords,
                rules: summary.rules,
                hasSellTag: summary.hasSellTag,
              }
            : { name }
        }
      />
    </span>
  );
}

function CardMeta({ summary }: { summary: CardSummary | null }) {
  if (!summary) {
    return null;
  }
  return (
    <span className={classes.searchCardMeta}>
      {summary.type ? <span>{summary.type}</span> : null}
      {summary.cost !== null ? <span>Cost {summary.cost}</span> : null}
    </span>
  );
}

function cardSummary(
  matchState: ReturnType<typeof useEngine>["matchState"],
  cardId: string,
): CardSummary | null {
  const card = matchState.G.cardIndex[cardId];
  if (!card) {
    return null;
  }
  const definition = defOf(card);
  return {
    definitionId: card.definitionId,
    name: definition.displayName ?? definition.name,
    type: isCardType(definition.type) ? definition.type : null,
    cost: definition.cost ?? null,
    power: definition.power ?? null,
    imageUrl: definition.imageUrl,
    color: isCardColor(definition.color) ? definition.color : undefined,
    classifications: definition.classifications,
    keywords: definition.keywords,
    rules: definition.rulesText ? [definition.rulesText] : [],
    hasSellTag: definition.hasSellTag,
  };
}

function isCardType(value: string | null | undefined): value is CardType {
  return value === "legend" || value === "unit" || value === "gear" || value === "program";
}

function isCardColor(value: string | null | undefined): value is CardColor {
  return value === "blue" || value === "green" || value === "red" || value === "yellow";
}

function scryDestinationLabel(destinationZone: string): string {
  switch (destinationZone) {
    case "trash":
      return "trash";
    case "deckBottom":
      return "deck bottom";
    case "deckTop":
      return "deck top";
    case "hand":
      return "hand";
    default:
      return destinationZone;
  }
}

function scryConfirmLabel(destinationZone: string): string {
  switch (destinationZone) {
    case "trash":
      return "Trash selected";
    case "deckBottom":
      return "Bottom selected";
    case "deckTop":
      return "Top selected";
    case "hand":
      return "Add selected";
    default:
      return "Confirm selected";
  }
}

function effectTargetChoiceCopy(
  matchState: ReturnType<typeof useEngine>["matchState"],
  action: InteractionAction,
  cardIds: readonly string[],
): { title: string | null; subtitle: string | null } {
  const summaries = cardIds.map((cardId) => cardSummary(matchState, cardId)).filter(Boolean);
  const zones = cardIds.map((cardId) => matchState.G.cardIndex[cardId]?.zone);
  const allUnits = summaries.length > 0 && summaries.every((summary) => summary?.type === "unit");
  const allGear = summaries.length > 0 && summaries.every((summary) => summary?.type === "gear");
  const allTrash = zones.length > 0 && zones.every((zone) => zone === "trash");
  const targetPurpose = textParam(action.text.params, "targetPurpose");
  const sourceRules = textParam(action.text.params, "sourceRulesText")?.toLowerCase() ?? "";

  if (allUnits && targetPurpose === "attachHost") {
    return {
      title: "Choose Unit to equip",
      subtitle: "Pick the friendly Unit that will receive the Gear.",
    };
  }

  if (allGear && allTrash) {
    return {
      title: "Choose Gear from trash",
      subtitle: sourceRules.includes("cyberware")
        ? "Pick the Cyberware Gear to play for free."
        : "Pick the Gear to play from trash.",
    };
  }

  return { title: null, subtitle: null };
}
