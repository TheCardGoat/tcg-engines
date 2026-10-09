import confirmationSkin from "./PromptConfirmationSkin.module.css";
import { usePromptSkin } from "./PromptSkin";
import { useCallback, useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Tooltip } from "@mantine/core";
import {
  IconArrowBarToDown,
  IconArrowBarToUp,
  IconCircleDashedCheck,
  IconDots,
  IconKeyboard,
  IconListDetails,
  IconMaximize,
  IconMinus,
  IconMinimize,
  IconPlus,
  IconTargetArrow,
} from "@tabler/icons-react";
import { InteractionResolutionPrompt, interactionBoundsCopy } from "@tcg/simulator-ui";
import {
  defOf,
  getEffectivePower,
  isValidGigCopyPair,
  type MatchState,
  type PendingChoice,
} from "@tcg/cyberpunk-engine";
import {
  PLAYER_SIDE_TO_ID,
  useBoardMode,
  useEngine,
  useEngineInteractionView,
  useNativePromptPresentation,
  useSideZones,
  type MoveId,
  type Side,
} from "../../engine";
import {
  interactionViewHasAttackers,
  interactionViewHasBlockers,
} from "../../engine/interactionViewHelpers";
import {
  collectPendingAttackTriggerSummaries,
  type AttackTriggerSummary,
} from "../../engine/attackTriggers";
import { useMoveSelection, type DirectCardMoveId } from "../GameBoard/MoveSelectionContext";
import { useGameState } from "../GameBoard/gameStateContext";
import { useAttackSelection } from "../GameBoard/useAttackSelection";
import { DieDisplay } from "../GameBoard/DieDisplay";
import { CardImage } from "../GameBoard/CardImage";
import { useCardPreview } from "../CardPreview/CardPreviewContext";
import { useHasHover } from "../../../../lib/media-query";
import { CardNameToken } from "../CardDisplay/CardNameToken";
import { CyberpunkRulesText } from "../CardContext/CyberpunkRulesText";
import { useLocalTargetSelection } from "./useLocalTargetSelection";
import {
  choiceActionHasRenderableDrawerContent,
  choiceModalActionFromInteractionView,
  getTargetPromptPresentation,
} from "./choiceModalAction";
import {
  buildAdjustGigOptions,
  type AdjustGigOption as AdjustGigPromptOption,
} from "../adjustGigOptions";
import {
  setChoiceModalOpen,
  setChoiceModalMinimized,
  useChoiceModalExplicitlyClosed,
  useChoiceModalMinimized,
  useChoiceModalOpen,
} from "./choiceModalState";
import { showBlockedPassTurnNotification } from "../blockedPassFeedback";
import {
  announceSkipBlockConfirmation,
  SKIP_BLOCK_CONFIRMATION_EVENT,
  type SkipBlockConfirmationEventDetail,
} from "../skipBlockConfirmation";
import { MulliganStatsStrip } from "./MulliganStatsStrip";
import { computeMulliganStats } from "./mulliganStats";
import { usePaymentSelection } from "../PaymentSelection/PaymentSelectionContext";
import { useCyberpunkBoardRuntime } from "../BoardRuntimeContext";
import classes from "./PromptBanner.module.css";

type BannerPosition = "top" | "bottom";

const GIG_COPY_SOURCE_EVENT = "cyberpunk:gig-copy-source";
const PASS_CONFIRM_HOTKEY = "Space";

interface GigCopySourceEventDetail {
  requestId: string;
  label: string;
  value: number;
}

interface PromptBannerProps {
  side: Side;
  surface?: "desktop" | "mobile";
  compact?: boolean;
  /** When set, the banner highlights the verb that's currently armed. */
  armedVerb?: MoveId | null;
  /** Set the armed verb (or clear it). */
  onArmVerb?: (verb: MoveId | null) => void;
  /** Whether the banner is collapsed to a chip. */
  minimized?: boolean;
  /** Current anchor position of the banner slot. */
  position?: BannerPosition;
  /** Toggle minimized state. */
  onToggleMinimize?: () => void;
  /** Toggle between top and bottom anchors. */
  onTogglePosition?: () => void;
  /** Temporary desktop-only board placement escape hatch for target prompts. */
  promptPlacement?: "player" | "rival";
  /** Move the containing prompt panel between player and rival board areas. */
  onTogglePromptPlacement?: () => void;
  /** Keep the normal action command row visible outside forced choices. */
  showActionPrompt?: boolean;
}

interface HeaderActionsProps {
  minimized: boolean;
  position: BannerPosition;
  onToggleMinimize?: () => void;
  onTogglePosition?: () => void;
  extraAction?: ReactNode;
  inline?: boolean;
}

type AdjustGigPromptPayload = Extract<
  NonNullable<ReturnType<typeof useNativePromptPresentation>["choice"]>,
  { type: "chooseTarget" }
>["payload"];

function HeaderActions({
  minimized,
  position,
  onToggleMinimize,
  onTogglePosition,
  extraAction,
  inline = false,
}: HeaderActionsProps) {
  if (!onToggleMinimize && !onTogglePosition && !extraAction) {
    return null;
  }
  return (
    <div
      className={`${classes.headerActions}${inline ? ` ${classes.headerActionsInline}` : ""}`}
      data-testid="prompt-banner-header-actions"
    >
      {extraAction}
      {onTogglePosition ? (
        <button
          type="button"
          className={classes.iconButton}
          data-testid="prompt-banner-toggle-position"
          aria-label={position === "top" ? "Move banner to bottom" : "Move banner to top"}
          title={position === "top" ? "Move to bottom" : "Move to top"}
          onClick={onTogglePosition}
        >
          {position === "top" ? (
            <IconArrowBarToDown size={14} stroke={1.8} />
          ) : (
            <IconArrowBarToUp size={14} stroke={1.8} />
          )}
        </button>
      ) : null}
      {onToggleMinimize ? (
        <button
          type="button"
          className={classes.iconButton}
          data-testid="prompt-banner-toggle-minimize"
          aria-label={minimized ? "Expand banner" : "Minimize banner"}
          aria-pressed={minimized}
          title={minimized ? "Expand" : "Minimize"}
          onClick={onToggleMinimize}
        >
          {minimized ? <IconPlus size={14} stroke={1.8} /> : <IconMinus size={14} stroke={1.8} />}
        </button>
      ) : null}
    </div>
  );
}

interface BannerSource {
  cardId?: string;
  displayName: string;
}

function boardPositionForDuplicate(state: MatchState, cardId: string | undefined): string | null {
  if (!cardId) return null;
  const card = state.G.cardIndex[cardId];
  if (!card || card.meta.faceDown || (card.zone !== "field" && card.zone !== "legendArea")) {
    return null;
  }
  const player = state.G.players[card.controllerId];
  if (!player) return null;
  const name = defOf(card).displayName ?? defOf(card).name;
  const activeIds = [...player.zones.field, ...player.zones.legendArea];
  const sameNameCount = activeIds.filter((id) => {
    const other = state.G.cardIndex[id];
    return (
      other && !other.meta.faceDown && (defOf(other).displayName ?? defOf(other).name) === name
    );
  }).length;
  if (sameNameCount < 2) return null;
  if (card.zone === "legendArea") {
    const index = player.zones.legendArea.indexOf(card.instanceId);
    return index >= 0 ? `Legends slot ${index + 1}` : null;
  }
  if (card.meta.attachedToId) return null;
  const fieldCards = player.zones.field.filter((id) => {
    const fieldCard = state.G.cardIndex[id];
    return fieldCard && !fieldCard.meta.attachedToId;
  });
  const index = fieldCards.indexOf(card.instanceId);
  return index >= 0 ? `Field card ${index + 1}` : null;
}

function SourceCardTitle({ source, matchState }: { source: BannerSource; matchState: MatchState }) {
  const position = boardPositionForDuplicate(matchState, source.cardId);
  return (
    <>
      <CardNameToken
        cardId={source.cardId}
        fallbackName={source.displayName}
        className={classes.sourceCardName}
      />
      {position ? <span className={classes.cardPosition}> · {position}</span> : null}
    </>
  );
}

function pickBannerSource(
  prompt: ReturnType<typeof useNativePromptPresentation>,
  selection: ReturnType<typeof useMoveSelection>["selection"],
  matchState: ReturnType<typeof useEngine>["matchState"],
): BannerSource | null {
  const choice = prompt.choice;
  if (choice?.type === "chooseTarget" && choice.payload.type === "effectTarget") {
    const source = choice.payload.source;
    if (source) {
      return { cardId: source.cardId, displayName: source.displayName };
    }
  }
  if (choice?.type === "chooseCardToMove") {
    const source = choice.payload.source;
    if (source) {
      return { cardId: source.cardId, displayName: source.displayName };
    }
  }
  if (choice?.type === "redirectDefeat" && choice.payload.source) {
    const source = choice.payload.source;
    return { cardId: source.cardId, displayName: source.displayName };
  }
  if (choice?.type === "chooseTrigger") {
    const first = choice.payload.options[0];
    if (first) {
      return { cardId: first.sourceCardId, displayName: first.cardName };
    }
  }
  if (selection?.sourceCardId) {
    const card = matchState.G.cardIndex[selection.sourceCardId];
    if (card) {
      const def = defOf(card);
      return { cardId: selection.sourceCardId, displayName: def.displayName ?? def.name };
    }
  }
  return null;
}

function pendingChoiceSource(
  choice: PendingChoice | undefined,
  matchState: MatchState,
): BannerSource | null {
  const sourceCardId =
    choice?.type === "chooseCardToMove" || choice?.type === "chooseTarget"
      ? choice.payload.sourceCardId
      : undefined;
  if (!sourceCardId) {
    return null;
  }
  const card = matchState.G.cardIndex[sourceCardId];
  if (!card) {
    return null;
  }
  const def = defOf(card);
  return { cardId: sourceCardId, displayName: def.displayName ?? def.name };
}

/**
 * Native Cyberpunk board prompt; see the surface map in ./index.ts. It owns
 * action verbs and inline/spatial choices, including source-card titles via
 * CardNameToken. Dense or private choices go to ./ChoiceModal.tsx. In view
 * mode only, it delegates opponent narration to InteractionResolutionPrompt.
 */
export function PromptBanner({
  side,
  surface = "desktop",
  compact = false,
  armedVerb,
  onArmVerb,
  minimized = false,
  position = "bottom",
  onToggleMinimize,
  onTogglePosition,
  promptPlacement = "player",
  onTogglePromptPlacement,
  showActionPrompt = true,
}: PromptBannerProps) {
  const promptSkin = usePromptSkin();
  const mode = useBoardMode(side);
  const prompt = useNativePromptPresentation(side);
  const interactionView = useEngineInteractionView(side);
  const { show: showCardPreview, hide: hideCardPreview } = useCardPreview();
  const hasHover = useHasHover();
  const {
    canUndo,
    dispatch,
    effectCardTargetSelection,
    humanSide,
    matchState,
    submitEffectCardTargets,
    toggleHumanSide,
  } = useEngine();
  const { prioritySide } = useGameState();
  const { practiceMode } = useCyberpunkBoardRuntime();
  const { dispatchCostedAction } = usePaymentSelection();
  const moveSelection = useMoveSelection();
  const attackSelection = useAttackSelection();
  const confirmTitleId = useId();
  const selectedMove =
    moveSelection.selection?.side === side ? moveSelection.selection.moveId : armedVerb;
  const selectedDirectMove = selectedMove && isDirectCardMove(selectedMove) ? selectedMove : null;
  const pendingAttackSelection =
    attackSelection.selection?.side === side ? attackSelection.selection : null;
  const selectedSourceCardId =
    moveSelection.selection?.side === side ? moveSelection.selection.sourceCardId : undefined;
  const selectedSourceCard = selectedSourceCardId
    ? matchState.G.cardIndex[selectedSourceCardId]
    : undefined;
  const selectedSourceDef = selectedSourceCard ? defOf(selectedSourceCard) : null;
  const selectedPlayCardTargeting =
    selectedDirectMove === "playCard" &&
    selectedSourceDef !== null &&
    (selectedSourceDef.type === "program" || selectedSourceDef.type === "gear");
  const localTargetSelection = useLocalTargetSelection(side);
  const localTargetRequestId = localTargetSelection?.requestId ?? null;
  const localTargeting = localTargetSelection !== null;
  const inSetup = matchState.G.gamePhase === "setup";
  const sideZones = useSideZones(side);
  const mulliganStats = inSetup ? computeMulliganStats(sideZones.hand) : null;
  const gamePhase = matchState.G.gamePhase;
  const rerollChoice =
    prompt.choice?.type === "chooseTarget" &&
    prompt.choice.payload.type === "effectTarget" &&
    prompt.choice.payload.effect?.effect === "rerollGig" &&
    interactionView.actions.some(
      (action) =>
        action.id === "resolveEffectTarget" &&
        action.inputs.some((input) => input.id === "rerollDieIds"),
    )
      ? prompt.choice
      : null;
  const stealChoice = prompt.choice?.type === "chooseGigsToSteal" ? prompt.choice : null;
  const [selectedStealGigIds, setSelectedStealGigIds] = useState<string[]>([]);
  const [selectedInlineGigIds, setSelectedInlineGigIds] = useState<string[]>([]);
  const [pendingConfirmation, setPendingConfirmation] = useState<
    "pass-with-attackers" | "skip-block" | null
  >(null);
  const [mobileCardTextExpanded, setMobileCardTextExpanded] = useState(false);
  // Source-card target prompts open compact (single row); the header toggle
  // expands the stacked presentation for the current prompt only.
  const [targetPromptExpanded, setTargetPromptExpanded] = useState(false);
  const mobileCardTextId = useId();
  const shouldConfirmPass =
    gamePhase === "main" &&
    !matchState.G.attackState &&
    interactionViewHasAttackers(interactionView);
  const shouldConfirmSkipBlock =
    matchState.G.attackState?.step === "react" &&
    matchState.G.attackState.redirectedByBlocker !== true &&
    interactionViewHasBlockers(interactionView);
  const modalAction = choiceModalActionFromInteractionView(interactionView.actions, matchState, {
    visibleHandOwnerId: PLAYER_SIDE_TO_ID[side],
  });
  const targetPromptPresentation = getTargetPromptPresentation({
    actions: interactionView.actions,
    matchState,
    localTargetRequestId,
    choice: prompt.choice,
    visibleHandOwnerId: PLAYER_SIDE_TO_ID[side],
  });
  const targetModalAction = targetPromptPresentation.action;
  const targetModalRequestId =
    targetPromptPresentation.presentation === "drawer" ||
    targetPromptPresentation.presentation === "spatial"
      ? targetPromptPresentation.requestId
      : null;
  const modalMinimized = useChoiceModalMinimized(side, modalAction?.requestId);
  const targetModalMinimized = useChoiceModalMinimized(side, targetModalRequestId ?? undefined);
  const targetModalOpen = useChoiceModalOpen(side, targetModalRequestId ?? undefined);
  const targetModalExplicitlyClosed = useChoiceModalExplicitlyClosed(
    side,
    targetModalRequestId ?? undefined,
  );
  const activeGigCopyPairConstraint =
    gigCopyPairConstraintFromInteractionView(interactionView) ??
    gigCopyPairConstraint(prompt.choice);
  const orderedGigCopyActive = activeGigCopyPairConstraint !== undefined;
  const orderedGigCopyRequestId = orderedGigCopyActive
    ? currentActionRequestId(interactionView, "resolveEffectTarget")
    : null;
  const [gigCopySource, setGigCopySource] = useState<GigCopySourceEventDetail | null>(null);
  const directHandDiscard =
    targetPromptPresentation.presentation === "spatial" &&
    targetModalAction?.id === "resolveDiscardFromHand";
  const hasTargetModalAction =
    !directHandDiscard &&
    ((targetModalAction &&
      targetModalAction.id !== "resolveTrigger" &&
      targetModalAction.id !== "resolveScry" &&
      choiceActionHasRenderableDrawerContent(targetModalAction)) ||
      targetPromptPresentation.presentation === "drawer" ||
      targetPromptPresentation.presentation === "spatial");
  const showTargetModalAction =
    (mode === "select-target" || localTargetRequestId !== null) &&
    targetModalRequestId !== null &&
    hasTargetModalAction;
  const targetModalButton =
    showTargetModalAction && !targetModalMinimized ? (
      <button
        type="button"
        className={`${classes.iconButton} ${classes.targetListButton}`}
        data-testid="prompt-target-modal-open"
        aria-label={surface === "mobile" ? "Show valid targets" : "Open choice modal"}
        title={surface === "mobile" ? "Show valid targets" : "Choice Modal"}
        onClick={() => setChoiceModalOpen(side, targetModalRequestId!, true)}
      >
        <IconListDetails size={surface === "mobile" ? 22 : 14} stroke={1.8} />
      </button>
    ) : null;
  const promptPlacementButton =
    (mode === "select-target" || localTargetRequestId !== null) && onTogglePromptPlacement ? (
      <button
        type="button"
        className={`${classes.iconButton} ${classes.promptPlacementButton}`}
        data-testid="prompt-banner-toggle-board-placement"
        aria-label={
          promptPlacement === "rival"
            ? "Move prompt back to your board"
            : "Move prompt to rival board"
        }
        aria-pressed={promptPlacement === "rival"}
        title={promptPlacement === "rival" ? "Move back to your board" : "Move to rival board"}
        onClick={onTogglePromptPlacement}
      >
        {promptPlacement === "rival" ? (
          <IconArrowBarToDown size={14} stroke={1.8} />
        ) : (
          <IconArrowBarToUp size={14} stroke={1.8} />
        )}
      </button>
    ) : null;
  const minimizedChoiceRequestId =
    modalAction && modalMinimized && modalAction.id !== "resolveTrigger"
      ? modalAction.requestId
      : targetModalMinimized
        ? targetModalRequestId
        : null;
  const modalRestoreAction = minimizedChoiceRequestId ? (
    <button
      type="button"
      className={classes.iconButton}
      data-testid="choice-modal-restore"
      aria-label="Restore choice window"
      title="Restore choice"
      onClick={() => setChoiceModalOpen(side, minimizedChoiceRequestId, true)}
    >
      <IconMaximize size={14} stroke={1.8} />
    </button>
  ) : null;
  const extraAction =
    promptPlacementButton || targetModalButton || modalRestoreAction ? (
      <>
        {promptPlacementButton}
        {targetModalButton}
        {modalRestoreAction}
      </>
    ) : null;
  const compactClass = compact ? ` ${classes.compact}` : "";
  const surfaceClass = surface === "mobile" ? ` ${classes.mobile}` : "";
  const inlineLocalTargetActions = localTargeting && compact && surface === "mobile";
  const headerActions = (
    <HeaderActions
      minimized={minimized}
      position={position}
      onToggleMinimize={onToggleMinimize}
      onTogglePosition={onTogglePosition}
      extraAction={extraAction}
      inline={inlineLocalTargetActions}
    />
  );

  useEffect(() => {
    setSelectedStealGigIds([]);
  }, [stealChoice?.payload.attackerId, stealChoice?.payload.count]);

  useEffect(() => {
    setSelectedInlineGigIds([]);
    setMobileCardTextExpanded(false);
    setTargetPromptExpanded(false);
  }, [matchState.G.turnMetadata.pendingChoice, targetModalRequestId]);

  useEffect(() => {
    if (
      !showTargetModalAction ||
      targetPromptPresentation.presentation !== "drawer" ||
      !targetModalRequestId ||
      targetModalOpen ||
      targetModalMinimized ||
      targetModalExplicitlyClosed
    ) {
      return;
    }
    setChoiceModalOpen(side, targetModalRequestId, true);
  }, [
    showTargetModalAction,
    side,
    targetModalExplicitlyClosed,
    targetPromptPresentation.presentation,
    targetModalMinimized,
    targetModalOpen,
    targetModalRequestId,
  ]);

  useEffect(() => {
    if (!orderedGigCopyActive) {
      setGigCopySource(null);
      return;
    }

    const handleGigCopySource = (event: Event) => {
      const detail = (event as CustomEvent<GigCopySourceEventDetail | null>).detail;
      if (!detail || detail.requestId !== orderedGigCopyRequestId) {
        setGigCopySource(null);
        return;
      }
      setGigCopySource(detail);
    };
    window.addEventListener(GIG_COPY_SOURCE_EVENT, handleGigCopySource);
    return () => window.removeEventListener(GIG_COPY_SOURCE_EVENT, handleGigCopySource);
  }, [orderedGigCopyActive, orderedGigCopyRequestId]);

  useEffect(() => {
    const syncSkipBlockConfirmation = (event: Event) => {
      const { armed } = (event as CustomEvent<SkipBlockConfirmationEventDetail>).detail;
      setPendingConfirmation((current) =>
        armed && shouldConfirmSkipBlock ? "skip-block" : current === "skip-block" ? null : current,
      );
    };

    window.addEventListener(SKIP_BLOCK_CONFIRMATION_EVENT, syncSkipBlockConfirmation);
    return () =>
      window.removeEventListener(SKIP_BLOCK_CONFIRMATION_EVENT, syncSkipBlockConfirmation);
  }, [shouldConfirmSkipBlock]);

  useEffect(() => {
    if (
      (pendingConfirmation === "pass-with-attackers" && !shouldConfirmPass) ||
      (pendingConfirmation === "skip-block" && !shouldConfirmSkipBlock)
    ) {
      if (pendingConfirmation === "skip-block") {
        announceSkipBlockConfirmation(false);
      } else {
        setPendingConfirmation(null);
      }
    }
  }, [pendingConfirmation, shouldConfirmPass, shouldConfirmSkipBlock]);

  const passPhase = useCallback(() => {
    dispatch({ type: "passPhase", as: PLAYER_SIDE_TO_ID[side] });
    moveSelection.clearSelection();
    onArmVerb?.(null);
  }, [dispatch, moveSelection, onArmVerb, side]);

  const skipBlock = useCallback(() => {
    dispatch({ type: "resolveAttack", pass: true, as: PLAYER_SIDE_TO_ID[side] });
    moveSelection.clearSelection();
    onArmVerb?.(null);
  }, [dispatch, moveSelection, onArmVerb, side]);

  useEffect(() => {
    if (!pendingConfirmation) {
      return;
    }

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.defaultPrevented) {
        return;
      }
      if (ev.key === "Escape") {
        ev.preventDefault();
        ev.stopPropagation();
        if (pendingConfirmation === "skip-block") {
          announceSkipBlockConfirmation(false);
        } else {
          setPendingConfirmation(null);
        }
        return;
      }
      if (ev.key === " " || ev.code === PASS_CONFIRM_HOTKEY) {
        ev.preventDefault();
        ev.stopPropagation();
        const confirmation = pendingConfirmation;
        if (confirmation === "skip-block") {
          announceSkipBlockConfirmation(false);
          skipBlock();
        } else {
          setPendingConfirmation(null);
          passPhase();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [passPhase, pendingConfirmation, skipBlock]);

  useEffect(() => {
    if (!pendingAttackSelection) {
      return;
    }

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key !== "Escape" || ev.defaultPrevented) {
        return;
      }
      ev.preventDefault();
      ev.stopPropagation();
      if (targetModalOpen && targetModalRequestId) {
        setChoiceModalOpen(side, targetModalRequestId, false);
      } else {
        localTargetSelection?.cancel();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [localTargetSelection, pendingAttackSelection, side, targetModalOpen, targetModalRequestId]);

  if (mode === "view") {
    // Narrate the acting side's in-flight decision while one is pending.
    // With nothing to narrate, the shared rail renders null; fall back to a
    // quiet waiting chip instead of an empty prompt slot — this state can
    // last a whole rival turn, so it must not read as a decision prompt.
    // A finished game stays silent — the post-game surface owns that moment.
    if (interactionView.resolution) {
      return (
        <InteractionResolutionPrompt view={interactionView} viewerId={PLAYER_SIDE_TO_ID[side]} />
      );
    }
    if (matchState.G.gameEnded) {
      return null;
    }
    const waitingMessage = inSetup
      ? "Rival is making their mulligan decision…"
      : side === "player"
        ? matchState.G.attackState
          ? "Your attack is in — the rival is deciding whether to block…"
          : "The rival is deciding their next move — you'll act again when they're done."
        : "You have the move — your rival is waiting on you.";
    return (
      <div
        className={`${classes.banner} ${classes.bannerWaiting}${compactClass}${surfaceClass}`}
        data-side={side}
        data-testid="prompt-banner"
        data-prompt-skin={promptSkin}
        data-state="waiting-opponent"
        role="region"
        aria-label={`${side} prompt — waiting for opponent`}
      >
        <p className={classes.title} data-testid="prompt-banner-title">
          Waiting
        </p>
        <p className={classes.message} data-testid="prompt-banner-message">
          {waitingMessage}
        </p>
        {practiceMode === "self" && side === humanSide && prioritySide !== side ? (
          <button
            type="button"
            className={classes.switchSeatButton}
            data-testid="self-practice-switch-seat"
            aria-label="Switch to rival seat"
            title="Switch to rival seat and take priority"
            onClick={toggleHumanSide}
          >
            Switch seat
          </button>
        ) : null}
        {headerActions}
      </div>
    );
  }

  if (mode === "select-target" && rerollChoice) {
    // The die is already known: this is Kerry's optional replacement decision,
    // not a target search. Reuse this board banner's source-card title and
    // direct verbs (as gainGig does below), not ChoiceModal or the shared rail.
    // See ./index.ts and ./pending-effects-modal.test.tsx.
    const dieId = rerollChoice.payload.eligibleIds?.[0];
    const die = dieId ? matchState.G.gigDice[dieId] : undefined;
    const dieLabel = die?.dieType.toUpperCase() ?? "Gig";
    const result = die?.faceValue;
    return (
      <div
        className={`${classes.banner} ${classes.bannerAction}${compactClass}${surfaceClass}`}
        data-side={side}
        data-testid="prompt-banner"
        data-prompt-skin={promptSkin}
        data-state="reroll-gig"
        role="region"
        aria-label={`${side} prompt — keep or reroll a gig`}
      >
        <div className={classes.actionSummary}>
          <p className={classes.title} data-testid="prompt-banner-title">
            {rerollChoice.payload.source ? (
              <SourceCardTitle source={rerollChoice.payload.source} matchState={matchState} />
            ) : (
              "Gig reroll"
            )}
          </p>
          <p className={classes.actionMessage} data-testid="prompt-banner-message">
            {dieLabel} rolled {result ?? "—"}. Keep it or reroll once.
          </p>
        </div>
        <div className={classes.verbs} data-testid="prompt-banner-verbs">
          <button
            type="button"
            className={classes.verb}
            data-testid="prompt-keep-gig-roll"
            onClick={() =>
              dispatch({ type: "resolveEffectTarget", pass: true, as: PLAYER_SIDE_TO_ID[side] })
            }
          >
            Keep {result ?? "result"}
          </button>
          <button
            type="button"
            className={classes.verb}
            data-testid="prompt-reroll-gig"
            disabled={!dieId}
            onClick={() => {
              if (dieId) {
                dispatch({
                  type: "resolveEffectTarget",
                  targetIds: [dieId],
                  as: PLAYER_SIDE_TO_ID[side],
                });
              }
            }}
          >
            Reroll {dieLabel}
          </button>
        </div>
        {headerActions}
      </div>
    );
  }

  if (
    (mode === "select-target" || localTargetRequestId !== null) &&
    ((surface !== "mobile" &&
      modalAction &&
      modalAction.id !== "resolveTrigger" &&
      !modalMinimized) ||
      (targetPromptPresentation.presentation === "drawer" && targetModalOpen))
  ) {
    return null;
  }

  if (minimized) {
    const source = pickBannerSource(prompt, moveSelection.selection, matchState);
    const isReaction = prompt.choice?.type === "chooseTrigger";
    const isTarget = (mode === "select-target" || localTargeting) && !isReaction;
    const variantClass = isReaction
      ? classes.bannerReaction
      : isTarget
        ? classes.bannerTarget
        : classes.bannerAction;
    const fallbackTitle = inSetup
      ? "Mulligan"
      : mode === "select-target"
        ? prompt.choice?.type === "chooseCardType"
          ? "Choose card type"
          : "Choose target"
        : "Your move";
    return (
      <div
        className={`${classes.banner} ${variantClass} ${classes.bannerMinimized}${compactClass}${surfaceClass}`}
        data-side={side}
        data-testid="prompt-banner"
        data-prompt-skin={promptSkin}
        data-state="minimized"
        data-position={position}
        role="region"
        aria-label={`${side} prompt — minimized`}
      >
        <p className={classes.minimizedLabel} data-testid="prompt-banner-title">
          {source ? (
            <SourceCardTitle source={source} matchState={matchState} />
          ) : (
            <span className={classes.titleText}>{fallbackTitle}</span>
          )}
        </p>
        {headerActions}
      </div>
    );
  }

  if (mode === "select-target" && prompt.choice?.type === "chooseFirstPlayer") {
    return (
      <div
        className={`${classes.banner} ${classes.bannerAction} ${
          promptPlacement === "player" ? classes.firstPlayerChoice : ""
        }${compactClass}${surfaceClass}`}
        data-side={side}
        data-testid="prompt-banner"
        data-prompt-skin={promptSkin}
        data-state="choose-first-player"
        role="region"
        aria-label={`${side} prompt — choose first player`}
      >
        <div className={classes.actionSummary}>
          <p className={classes.title} data-testid="prompt-banner-title">
            Go first or second?
          </p>
          <p className={classes.actionMessage} data-testid="prompt-banner-message">
            You choose who takes the first turn.
          </p>
        </div>
        <div className={classes.verbs} data-testid="prompt-banner-verbs">
          <button
            type="button"
            className={classes.verb}
            onClick={() =>
              dispatch({ type: "resolveFirstPlayer", goFirst: true, as: PLAYER_SIDE_TO_ID[side] })
            }
          >
            Go first
          </button>
          <button
            type="button"
            className={classes.verb}
            onClick={() =>
              dispatch({ type: "resolveFirstPlayer", goFirst: false, as: PLAYER_SIDE_TO_ID[side] })
            }
          >
            Go second
          </button>
        </div>
        {headerActions}
      </div>
    );
  }

  if (mode === "select-target") {
    const redirectDefeatChoice = prompt.choice?.type === "redirectDefeat" ? prompt.choice : null;
    if (redirectDefeatChoice) {
      const replacementCard =
        matchState.G.cardIndex[redirectDefeatChoice.payload.replacementCardId];
      const protectedCard = matchState.G.cardIndex[redirectDefeatChoice.payload.protectedCardId];
      const replacementDef = replacementCard ? defOf(replacementCard) : null;
      const protectedDef = protectedCard ? defOf(protectedCard) : null;
      const replacementName = replacementDef?.displayName ?? replacementDef?.name ?? "this Legend";
      const protectedName = protectedDef?.displayName ?? protectedDef?.name ?? "the friendly Unit";
      const protectedPosition = boardPositionForDuplicate(
        matchState,
        redirectDefeatChoice.payload.protectedCardId,
      );
      return (
        <div
          className={`${classes.banner} ${classes.bannerAction}${compactClass}${surfaceClass}`}
          data-side={side}
          data-testid="prompt-banner"
          data-prompt-skin={promptSkin}
          data-state="redirect-defeat"
          role="region"
          aria-label={`${side} prompt — redirect defeat`}
        >
          <div className={classes.actionSummary}>
            <p className={classes.title} data-testid="prompt-banner-title">
              <SourceCardTitle
                source={{
                  cardId: redirectDefeatChoice.payload.replacementCardId,
                  displayName: replacementName,
                }}
                matchState={matchState}
              />
            </p>
            <p
              className={`${classes.actionMessage} ${promptSkin === "v2" ? classes.spatialReminder : ""}`}
              data-testid="prompt-banner-message"
            >
              Spend {redirectDefeatChoice.payload.cost} €$ to defeat{" "}
              <CardNameToken
                cardId={redirectDefeatChoice.payload.replacementCardId}
                fallbackName={replacementName}
                className={classes.actionCardName}
              />{" "}
              instead of{" "}
              <CardNameToken
                cardId={redirectDefeatChoice.payload.protectedCardId}
                fallbackName={protectedName}
                className={classes.actionCardName}
              />
              {protectedPosition ? ` (${protectedPosition})` : null}.
            </p>
          </div>
          <div className={classes.verbs} data-testid="prompt-banner-verbs">
            <button
              type="button"
              className={classes.verb}
              data-testid="redirect-defeat-apply"
              onClick={() =>
                dispatchCostedAction({
                  type: "resolveRedirectDefeat",
                  pass: false,
                  as: PLAYER_SIDE_TO_ID[side],
                })
              }
            >
              Spend {redirectDefeatChoice.payload.cost} €$
            </button>
            <button
              type="button"
              className={classes.verb}
              data-testid="redirect-defeat-decline"
              onClick={() =>
                dispatch({
                  type: "resolveRedirectDefeat",
                  pass: true,
                  as: PLAYER_SIDE_TO_ID[side],
                })
              }
            >
              Let {protectedName}
              {protectedPosition ? ` (${protectedPosition})` : ""} be defeated
            </button>
          </div>
          {headerActions}
        </div>
      );
    }

    // V2 resolves the pick on the highlighted FixerZone dice themselves; a
    // button mirror of the pool would just duplicate the board.
    if (prompt.choice && prompt.choice.type === "gainGig") {
      const allowed = prompt.choice.payload.allowedDieIds;
      if (promptSkin === "v2") {
        // The swelled fixer dice are the controls; keep only a micro caption
        // so the decision stays on the board instead of in a framed plate.
        return (
          <div
            className={`${classes.banner} ${classes.bannerMicro}${compactClass}${surfaceClass}`}
            data-side={side}
            data-testid="prompt-banner"
            data-prompt-skin={promptSkin}
            data-state="gain-gig"
            role="region"
            aria-label={`${side} prompt — gain a gig`}
          >
            <p className={classes.title} data-testid="prompt-banner-title">
              Take a gig die
            </p>
            <p className={classes.actionMessage} data-testid="prompt-banner-message">
              Pick a highlighted die in your Fixer area.
            </p>
            {headerActions}
          </div>
        );
      }
      return (
        <div
          className={`${classes.banner} ${classes.bannerAction}${compactClass}${surfaceClass}`}
          data-side={side}
          data-testid="prompt-banner"
          data-prompt-skin={promptSkin}
          data-state="gain-gig"
          role="region"
          aria-label={`${side} prompt — gain a gig`}
        >
          <p className={classes.title} data-testid="prompt-banner-title">
            Take a gig die
          </p>
          <p className={classes.actionMessage} data-testid="prompt-banner-message">
            Bigger die = higher Street Cred ceiling, more variance. Start your turn with 7 gigs to
            win.
          </p>
          <div className={classes.verbs} data-testid="prompt-banner-verbs">
            {allowed.map((dieId) => {
              const die = matchState.G.gigDice[dieId];
              const label = die?.dieType.toUpperCase() ?? dieId;
              const parsedMax = die ? Number(die.dieType.replace(/^d/i, "")) : Number.NaN;
              const max = Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : null;
              const avg = max ? Math.round((max + 1) / 2) : null;
              const tip = max ? `Rolls 1–${max} (avg ~${avg})` : "";
              return (
                <button
                  key={dieId}
                  type="button"
                  className={classes.verb}
                  data-testid={`prompt-gain-gig-${die?.dieType ?? dieId}`}
                  data-die-id={dieId}
                  data-die-max={max ?? undefined}
                  title={tip || undefined}
                  aria-label={tip ? `Take ${label} — ${tip}` : `Take ${label}`}
                  onClick={() => {
                    dispatch({ type: "gainGig", dieId, as: PLAYER_SIDE_TO_ID[side] });
                  }}
                >
                  {die ? (
                    <span className={classes.gigDieIcon} aria-hidden="true">
                      <DieDisplay dieType={die.dieType} label={label} size="sm" />
                    </span>
                  ) : null}
                  <span className={classes.gigDieLabel}>Take {label}</span>
                </button>
              );
            })}
          </div>
          {headerActions}
        </div>
      );
    }

    if (stealChoice) {
      const required = stealChoice.payload.count;
      const chooseDie = (dieId: string) => {
        const next = selectedStealGigIds.includes(dieId)
          ? selectedStealGigIds.filter((id) => id !== dieId)
          : selectedStealGigIds.length >= required
            ? [...selectedStealGigIds.slice(1), dieId]
            : [...selectedStealGigIds, dieId];
        if (next.length === required) {
          setSelectedStealGigIds([]);
          dispatch({
            type: "resolveStealGigs",
            dieIds: next,
            as: PLAYER_SIDE_TO_ID[side],
          });
          return;
        }
        setSelectedStealGigIds(next);
      };
      return (
        <div
          className={`${classes.banner} ${classes.bannerAction}${compactClass}${surfaceClass}`}
          data-side={side}
          data-testid="prompt-banner"
          data-prompt-skin={promptSkin}
          data-state="steal-gigs"
          role="region"
          aria-label={`${side} prompt — steal gigs`}
        >
          <p className={classes.title} data-testid="prompt-banner-title">
            Choose rival gig{required === 1 ? "" : "s"}
          </p>
          {promptSkin === "v2" ? (
            <p
              className={`${classes.actionMessage} ${classes.spatialReminder}`}
              data-testid="prompt-banner-message"
            >
              Choose{" "}
              {required === 1
                ? "a highlighted Gig on the board."
                : `${required} highlighted Gigs on the board.`}
            </p>
          ) : null}
          {promptSkin !== "v2" ? (
            <div className={classes.verbs} data-testid="prompt-banner-verbs">
              {stealChoice.payload.eligibleDice.map((eligible) => {
                const die = matchState.G.gigDice[eligible.dieId];
                const label = die?.dieType.toUpperCase() ?? "GIG";
                const faceValue = die?.faceValue ?? eligible.faceValue;
                const active = selectedStealGigIds.includes(eligible.dieId);
                return (
                  <button
                    key={eligible.dieId}
                    type="button"
                    className={`${classes.verb} ${active ? classes.verbActive : ""}`}
                    data-testid={`prompt-steal-gig-${die?.dieType ?? eligible.dieId}`}
                    data-die-id={eligible.dieId}
                    data-selected={active ? "true" : "false"}
                    aria-pressed={active}
                    onClick={() => chooseDie(eligible.dieId)}
                  >
                    {label} {faceValue}
                  </button>
                );
              })}
            </div>
          ) : null}
          {headerActions}
        </div>
      );
    }

    if (prompt.choice && prompt.choice.type === "chooseTrigger") {
      const canPass = Boolean(prompt.choice.payload.canPass);
      const primaryOption = prompt.choice.payload.options[0];
      const triggerCopy = triggerChoiceCopy(prompt.choice.payload.options, canPass);
      const queueChoice = !canPass && prompt.choice.payload.options.length > 1;
      return (
        <div
          className={`${classes.banner} ${classes.bannerReaction}${compactClass}${surfaceClass}`}
          data-side={side}
          data-testid="prompt-banner"
          data-prompt-skin={promptSkin}
          data-state={canPass ? "optional-trigger" : "choose-trigger"}
          role="region"
          aria-label={`${side} prompt — ${canPass ? "optional trigger" : "choose trigger"}`}
        >
          <div className={classes.reactionSummary}>
            <p className={classes.title} data-testid="prompt-banner-title">
              {triggerCopy.title}
            </p>
            <p className={classes.reactionMessage} data-testid="prompt-banner-message">
              {triggerCopy.showSource && primaryOption ? (
                <>
                  <CardNameToken
                    cardId={primaryOption.sourceCardId}
                    fallbackName={primaryOption.cardName}
                    className={classes.actionCardName}
                  />{" "}
                  {triggerCopy.message}
                </>
              ) : (
                triggerCopy.message
              )}
            </p>
          </div>
          <div
            className={`${classes.verbs} ${queueChoice ? classes.triggerQueue : ""}`}
            data-testid="prompt-banner-verbs"
          >
            {prompt.choice.payload.options.map((option) => {
              const sourceCard = option.sourceCardId
                ? matchState.G.cardIndex[option.sourceCardId]
                : undefined;
              const sourceDef = sourceCard ? defOf(sourceCard) : undefined;
              const previewable = queueChoice && hasHover && Boolean(sourceDef?.imageUrl);
              const showPreview = () => {
                if (sourceDef?.imageUrl) {
                  showCardPreview({
                    imageUrl: sourceDef.imageUrl,
                    face: "public",
                    alt: option.cardName,
                    details: { name: option.cardName },
                  });
                }
              };
              return (
                <button
                  key={option.triggerId}
                  type="button"
                  className={`${classes.verb} ${option.optional ? classes.verbActive : ""}`}
                  data-testid={`prompt-trigger-${option.triggerId}`}
                  aria-label={`${option.optional ? "Play" : "Resolve"} ${option.cardName}: ${
                    option.abilityText
                  }`}
                  onMouseEnter={previewable ? showPreview : undefined}
                  onMouseLeave={previewable ? hideCardPreview : undefined}
                  onFocus={previewable ? showPreview : undefined}
                  onBlur={previewable ? hideCardPreview : undefined}
                  onClick={() => {
                    dispatch({
                      type: "resolveTrigger",
                      triggerId: option.triggerId,
                      as: PLAYER_SIDE_TO_ID[side],
                    });
                  }}
                >
                  {queueChoice ? (
                    <span className={classes.triggerQueueRow}>
                      <CardImage
                        imageUrl={sourceDef?.imageUrl}
                        alt={option.cardName}
                        disablePreview
                        className={classes.triggerQueueArt}
                      />
                      <span className={classes.triggerQueueBody}>
                        <span className={classes.triggerQueueName}>{option.cardName}</span>
                        {": "}
                        {option.abilityText}
                      </span>
                    </span>
                  ) : (
                    <span className={classes.triggerOptionText}>
                      {option.optional ? "Use optional ability" : "Resolve ability"}
                      <span className={classes.triggerOptionDetail}>{option.abilityText}</span>
                    </span>
                  )}
                </button>
              );
            })}
            {canPass ? (
              <button
                type="button"
                className={classes.verb}
                data-testid="prompt-trigger-pass"
                onClick={() => {
                  dispatch({
                    type: "resolveTrigger",
                    pass: true,
                    as: PLAYER_SIDE_TO_ID[side],
                  });
                }}
              >
                Pass on ability
              </button>
            ) : null}
          </div>
          {headerActions}
        </div>
      );
    }

    const choice = prompt.choice;
    const orderedGigCopyChoice = orderedGigCopyActive;
    const orderedGigCopyConstraint = activeGigCopyPairConstraint;
    const adjustGigChoice =
      choice?.type === "chooseTarget" &&
      (choice.payload.type === "adjustGig" ||
        (choice.payload.type === "effectTarget" && choice.payload.adjustGig))
        ? choice
        : null;
    // V2 picks Gig targets on the enlarged board lanes (mobile included); the
    // inline button mirror stays a V1-mobile affordance.
    const inlineGigTargetChoice =
      surface === "mobile" &&
      promptSkin !== "v2" &&
      choice?.type === "chooseTarget" &&
      choice.payload.type === "effectTarget" &&
      choice.payload.targetKind === "gig"
        ? choice
        : null;
    const inlineGigTargetIds = inlineGigTargetChoice
      ? (inlineGigTargetChoice.payload.eligibleIds ??
        inlineGigTargetChoice.payload.cards?.map((card) => card.instanceId) ??
        [])
      : [];
    const inlineGigSourceId = selectedInlineGigIds[0];
    const isLegalInlineGigTarget = (dieId: string) =>
      !orderedGigCopyConstraint ||
      !inlineGigSourceId ||
      dieId === inlineGigSourceId ||
      isValidGigCopyPair(matchState, [inlineGigSourceId, dieId], orderedGigCopyConstraint);
    const fixedAdjustGigId =
      adjustGigChoice?.payload.type === "adjustGig" ? adjustGigChoice.payload.dieId : undefined;
    const selectedAdjustGigId = selectedInlineGigIds[0] ?? fixedAdjustGigId;
    const adjustGigOptions =
      adjustGigChoice && selectedAdjustGigId
        ? buildAdjustGigPromptOptions(
            adjustGigChoice.payload,
            matchState,
            selectedAdjustGigId,
            interactionView,
          )
        : [];
    const inlineGigTargetMin = inlineGigTargetChoice?.payload.min ?? 1;
    const inlineGigTargetMax = inlineGigTargetChoice?.payload.max ?? inlineGigTargetMin;
    const canConfirmInlineGigTargets =
      inlineGigTargetChoice !== null &&
      selectedInlineGigIds.length >= inlineGigTargetMin &&
      selectedInlineGigIds.length <= inlineGigTargetMax;
    const submitInlineGigTargets = (targetIds: string[]) => {
      dispatch({
        type: "resolveEffectTarget",
        targetIds,
        as: PLAYER_SIDE_TO_ID[side],
      });
      setSelectedInlineGigIds([]);
      if (targetModalRequestId) {
        setChoiceModalOpen(side, targetModalRequestId, false);
      }
    };
    const chooseInlineGigTarget = (dieId: string) => {
      if (!isLegalInlineGigTarget(dieId)) {
        return;
      }
      if (adjustGigChoice) {
        setSelectedInlineGigIds([dieId]);
        return;
      }
      if (inlineGigTargetMax <= 1) {
        submitInlineGigTargets([dieId]);
        return;
      }
      setSelectedInlineGigIds((current) =>
        current.includes(dieId)
          ? current.filter((id) => id !== dieId)
          : current.length >= inlineGigTargetMax
            ? current
            : [...current, dieId],
      );
    };
    const sentence = describeChoice(prompt, matchState);
    const effectTargetCopy = effectTargetChoiceCopy(choice);
    const readyLegendsCopy = readyLegendChoiceCopy(choice);
    const choiceTitle =
      choice?.type === "chooseTarget" && choice.payload.type === "adjustGig"
        ? "Adjust Gig"
        : choice?.type === "scry"
          ? "Deck search"
          : choice?.type === "chooseCardToPlay"
            ? sentence
            : choice?.type === "chooseCardType"
              ? "Choose card type"
              : choice?.type === "chooseEffect"
                ? "Choose effect"
                : choice?.type === "preventGigSteal"
                  ? "Prevent Gig Steal"
                  : orderedGigCopyChoice
                    ? "Choose source and target Gigs"
                    : "Choose target";
    const effectSource =
      choice?.type === "chooseTarget" && choice.payload.type === "effectTarget"
        ? choice.payload.source
        : undefined;
    const moveSource = choice?.type === "chooseCardToMove" ? choice.payload.source : undefined;
    const sourceForTitle =
      effectSource ??
      moveSource ??
      pendingChoiceSource(matchState.G.turnMetadata.pendingChoice, matchState);
    const displaySourceForTitle = sourceForTitle;
    // The source card is the primary context for an effect choice. Keep the
    // instruction in the supporting line so players can immediately identify
    // which card is resolving without losing the action they must take.
    const decisionTitle = displaySourceForTitle ? null : (effectTargetCopy?.title ?? null);
    const titlePrefix = orderedGigCopyChoice
      ? "Choose Gigs for "
      : choice?.type === "chooseTarget" && choice.payload.type === "discardFromHand"
        ? "Choose cards to discard for "
        : choice?.type === "chooseCardToMove" && choice.payload.destination === "trash"
          ? "Choose card to trash for "
          : isOptionalLegendCallChoice(choice)
            ? "Choose Legend to call with "
            : "Choose a target for ";
    const sourceTitleLabel = decisionTitle
      ? decisionTitle
      : displaySourceForTitle
        ? `${titlePrefix}${displaySourceForTitle.displayName}`
        : choiceTitle;
    const titleRequirement =
      choice?.type === "chooseTarget" &&
      (choice.payload.type === "effectTarget" || choice.payload.type === "discardFromHand")
        ? (effectTargetCopy?.subtitle ?? sentence)
        : null;
    const compactTargetRequirement =
      choice?.type === "chooseTarget" &&
      (choice.payload.type === "effectTarget" || choice.payload.type === "discardFromHand") &&
      !orderedGigCopyChoice &&
      titleRequirement
        ? {
            optional: choice.payload.canDecline === true || (choice.payload.min ?? 1) === 0,
            label: [
              sentence.replace(" · ", " — "),
              titleRequirement !== sentence ? titleRequirement : null,
            ]
              .filter((part): part is string => Boolean(part))
              .map((part) => part.replace(/[.!?]+$/, ""))
              .join(". ")
              .concat("."),
          }
        : null;
    const TargetRequirementIcon = compactTargetRequirement?.optional
      ? IconCircleDashedCheck
      : IconTargetArrow;
    const declineTargetChoice =
      choice?.type === "chooseTarget" &&
      (choice.payload.canDecline ||
        choice.payload.min === 0 ||
        choice.payload.targetPurpose === "playCard")
        ? () => {
            if (choice.payload.type === "effectTarget" && choice.payload.adjustGig !== undefined) {
              dispatch({
                type: "resolveAdjustGig",
                choice: { kind: "noAdjustment" },
                as: PLAYER_SIDE_TO_ID[side],
              });
              return;
            }
            dispatch({
              type:
                choice.payload.type === "discardFromHand"
                  ? "resolveDiscardFromHand"
                  : "resolveEffectTarget",
              pass: true,
              as: PLAYER_SIDE_TO_ID[side],
            });
          }
        : null;
    const declineCardToMove =
      choice?.type === "chooseCardToMove" && choice.payload.canDecline
        ? () => {
            dispatch({
              type: "resolveCardToMove",
              pass: true,
              as: PLAYER_SIDE_TO_ID[side],
            });
          }
        : null;
    const declineCardToPlay =
      choice?.type === "chooseCardToPlay" && choice.payload.canDecline
        ? () => {
            dispatch({
              type: "resolveCardToPlay",
              pass: true,
              as: PLAYER_SIDE_TO_ID[side],
            });
          }
        : null;
    const acceptSingleCardToPlay =
      choice?.type === "chooseCardToPlay" &&
      choice.payload.canDecline &&
      choice.payload.cardIds.length === 1
        ? () => {
            dispatch({
              type: "resolveCardToPlay",
              cardId: choice.payload.cardIds[0],
              as: PLAYER_SIDE_TO_ID[side],
            });
          }
        : null;
    const canCancelActivatedAbility = prompt.availableMoves.some(
      (move) => move.moveId === "cancelPendingResolution",
    );
    const stagedTargets =
      effectCardTargetSelection?.side === side ? effectCardTargetSelection : null;
    const stagedTargetCount = stagedTargets?.targetIds.length ?? 0;
    const canSubmitStagedTargets =
      stagedTargets !== null &&
      stagedTargetCount >= stagedTargets.min &&
      stagedTargetCount <= stagedTargets.max;
    // Source-card target prompts default to the compact single-row layout on
    // desktop; the header toggle expands the stacked presentation.
    const compactTargetChoice =
      surface !== "mobile" &&
      displaySourceForTitle !== null &&
      !orderedGigCopyChoice &&
      !targetPromptExpanded;
    const targetSizeToggle =
      surface !== "mobile" && displaySourceForTitle !== null && !orderedGigCopyChoice ? (
        <button
          type="button"
          className={classes.iconButton}
          data-testid="prompt-banner-toggle-expanded"
          aria-label={targetPromptExpanded ? "Compact prompt" : "Expanded prompt"}
          aria-pressed={targetPromptExpanded}
          title={targetPromptExpanded ? "Compact" : "Expanded"}
          onClick={() => setTargetPromptExpanded((expanded) => !expanded)}
        >
          {targetPromptExpanded ? (
            <IconMinimize size={14} stroke={1.8} />
          ) : (
            <IconMaximize size={14} stroke={1.8} />
          )}
        </button>
      ) : null;
    const mobileCardPrompt = surface === "mobile" && displaySourceForTitle !== null;
    const mobileCardTextButton =
      (mobileCardPrompt || readyLegendsCopy) && effectSource?.rulesText ? (
        <button
          type="button"
          className={`${classes.iconButton} ${readyLegendsCopy ? classes.readyTextButton : classes.cardTextButton}`}
          data-testid="prompt-card-text-toggle"
          aria-label={`${mobileCardTextExpanded ? "Hide" : "Show"} ${displaySourceForTitle?.displayName ?? "source"} card text`}
          aria-controls={mobileCardTextId}
          aria-expanded={mobileCardTextExpanded}
          title={mobileCardTextExpanded ? "Hide card text" : "Show card text"}
          onClick={() => setMobileCardTextExpanded((expanded) => !expanded)}
        >
          {readyLegendsCopy ? (
            mobileCardTextExpanded ? (
              <IconMinus size={14} stroke={1.8} />
            ) : (
              <IconPlus size={14} stroke={1.8} />
            )
          ) : (
            <IconDots size={22} stroke={1.8} />
          )}
        </button>
      ) : null;
    const targetHeaderActions = mobileCardTextButton ? (
      <HeaderActions
        minimized={minimized}
        position={position}
        onToggleMinimize={onToggleMinimize}
        onTogglePosition={onTogglePosition}
        extraAction={
          <>
            {targetSizeToggle}
            {readyLegendsCopy ? (
              <>
                {promptPlacementButton}
                {mobileCardTextButton}
                {targetModalButton}
                {modalRestoreAction}
              </>
            ) : (
              <>
                {mobileCardTextButton}
                {extraAction}
              </>
            )}
          </>
        }
      />
    ) : (
      <HeaderActions
        minimized={minimized}
        position={position}
        onToggleMinimize={onToggleMinimize}
        onTogglePosition={onTogglePosition}
        extraAction={
          targetSizeToggle ? (
            <>
              {targetSizeToggle}
              {extraAction}
            </>
          ) : (
            extraAction
          )
        }
        inline={inlineLocalTargetActions}
      />
    );
    return (
      <div
        className={`${classes.banner} ${classes.bannerTarget} ${
          compactTargetChoice ? classes.bannerTargetSlim : ""
        }${mobileCardPrompt ? ` ${classes.mobileCardPrompt}` : ""}${readyLegendsCopy ? ` ${classes.readyLegendsPrompt}` : ""}${compactClass}${surfaceClass}`}
        data-side={side}
        data-card-prompt={mobileCardPrompt ? "true" : undefined}
        data-testid="prompt-banner"
        data-prompt-skin={promptSkin}
        data-state="select-target"
        role="region"
        aria-label={`${side} prompt — choose target`}
      >
        <div className={classes.promptLead}>
          <p
            className={classes.title}
            data-testid="prompt-banner-title"
            data-has-target-requirement={compactTargetRequirement ? true : undefined}
          >
            {compactTargetRequirement ? (
              <Tooltip
                label={`${compactTargetRequirement.optional ? "Optional effect" : "Target required"} — ${compactTargetRequirement.label}`}
                position="top-start"
                openDelay={0}
                withArrow
                withinPortal
                zIndex={420}
                classNames={{ tooltip: classes.targetRequirementTooltip }}
              >
                <span
                  className={classes.targetRequirementHint}
                  data-testid="prompt-banner-message"
                  role="img"
                  aria-label={`${compactTargetRequirement.optional ? "Optional effect" : "Target required"} — ${compactTargetRequirement.label}`}
                  tabIndex={0}
                >
                  <TargetRequirementIcon size={14} stroke={2.2} aria-hidden="true" />
                </span>
              </Tooltip>
            ) : null}
            <span
              className={classes.titleText}
              aria-label={decisionTitle || !displaySourceForTitle ? sourceTitleLabel : undefined}
            >
              {decisionTitle ? (
                decisionTitle
              ) : displaySourceForTitle ? (
                <SourceCardTitle source={displaySourceForTitle} matchState={matchState} />
              ) : (
                choiceTitle
              )}
            </span>
          </p>
          {readyLegendsCopy ? (
            <div className={classes.readyInstructions}>
              <h2 data-testid="prompt-banner-message">{readyLegendsCopy}</h2>
            </div>
          ) : null}
          {orderedGigCopyChoice ||
          (adjustGigChoice && !compactTargetRequirement) ||
          (!displaySourceForTitle && !titleRequirement && choice?.type !== "chooseCardToPlay") ? (
            <div className={`${classes.promptCopy} ${classes.instructionCopy}`}>
              {orderedGigCopyChoice ? (
                <p className={classes.sequenceHint} data-testid="prompt-banner-sequence">
                  {gigCopySource
                    ? orderedGigCopyConstraint === "gig-copy-between-players"
                      ? `Step 2 of 2 — Target Gig: choose the other player's Gig to receive ${gigCopySource.label}'s ${gigCopySource.value}.`
                      : `Step 2 of 2 — Target Gig: choose the Gig that will receive ${gigCopySource.label}'s ${gigCopySource.value}. If it cannot show that value, the set fails and later text still resolves.`
                    : orderedGigCopyConstraint === "gig-copy-between-players"
                      ? "Step 1 of 2 — Source Gig: choose any Gig. Step 2 uses a Gig owned by the other player."
                      : "Step 1 of 2 — Source Gig: choose the Gig whose value you will copy. Step 2 chooses the Gig that receives that value."}
                </p>
              ) : null}
              {(adjustGigChoice || (!displaySourceForTitle && !titleRequirement)) &&
              !compactTargetRequirement ? (
                <p className={classes.message} data-testid="prompt-banner-message">
                  {sentence}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
        {effectSource?.rulesText &&
        ((surface !== "mobile" && !readyLegendsCopy) || mobileCardTextExpanded) ? (
          <div
            id={surface === "mobile" || readyLegendsCopy ? mobileCardTextId : undefined}
            className={`${classes.promptCopy} ${classes.cardRulesCopy}`}
          >
            <p className={classes.effectText} data-testid="prompt-banner-effect">
              <CyberpunkRulesText text={effectSource.rulesText} />
            </p>
          </div>
        ) : null}
        {inlineGigTargetIds.length > 0 ||
        adjustGigOptions.length > 0 ||
        stagedTargets ||
        declineTargetChoice ||
        declineCardToMove ||
        declineCardToPlay ? (
          <div className={classes.verbs} data-testid="prompt-banner-verbs">
            {inlineGigTargetIds.map((dieId) => {
              const selected = selectedInlineGigIds.includes(dieId);
              const selectionLimitReached =
                inlineGigTargetMax > 1 &&
                selectedInlineGigIds.length >= inlineGigTargetMax &&
                !selected;
              const legalTarget = isLegalInlineGigTarget(dieId);
              return (
                <button
                  key={dieId}
                  type="button"
                  className={`${classes.verb} ${selected ? classes.verbActive : ""}`}
                  data-testid="prompt-gig-target-option"
                  data-die-id={dieId}
                  data-selected={selected ? "true" : "false"}
                  aria-pressed={selected}
                  disabled={selectionLimitReached || !legalTarget}
                  onClick={() => chooseInlineGigTarget(dieId)}
                >
                  {gigTargetPromptLabel(matchState, dieId, side)}
                </button>
              );
            })}
            {inlineGigTargetChoice && inlineGigTargetMax > 1 ? (
              <>
                <span className={classes.count} data-testid="prompt-gig-target-selection-count">
                  {selectedInlineGigIds.length}/{inlineGigTargetMax}
                </span>
                <button
                  type="button"
                  className={classes.verb}
                  data-testid="prompt-gig-target-confirm"
                  disabled={!canConfirmInlineGigTargets}
                  onClick={() => submitInlineGigTargets(selectedInlineGigIds)}
                >
                  Confirm
                </button>
              </>
            ) : null}
            {adjustGigOptions.map((option) => (
              <button
                key={`${option.delta}:${option.value}`}
                type="button"
                className={classes.verb}
                data-testid="prompt-adjust-gig-option"
                data-delta={option.delta}
                data-value={option.value}
                aria-label={option.label}
                onClick={() => {
                  const selectedDie = selectedAdjustGigId
                    ? matchState.G.gigDice[selectedAdjustGigId]
                    : undefined;
                  if (!selectedAdjustGigId || !selectedDie) return;
                  const adjustment =
                    adjustGigChoice?.payload.type === "effectTarget"
                      ? adjustGigChoice.payload.adjustGig
                      : adjustGigChoice?.payload;
                  dispatch({
                    type: "resolveAdjustGig",
                    choice:
                      adjustment?.chooseUpTo && option.value === selectedDie.faceValue
                        ? { kind: "noAdjustment" }
                        : { kind: "adjust", dieId: selectedAdjustGigId, value: option.value },
                    as: PLAYER_SIDE_TO_ID[side],
                  });
                  setSelectedInlineGigIds([]);
                }}
              >
                {option.label}
              </button>
            ))}
            {stagedTargets ? (
              <>
                <span
                  className={classes.count}
                  data-testid="prompt-target-selection-count"
                  aria-live="polite"
                >
                  {readyLegendsCopy
                    ? `${stagedTargetCount} of ${stagedTargets.max} Legends selected`
                    : `${stagedTargetCount}/${stagedTargets.max}`}
                </span>
                <button
                  type="button"
                  className={classes.verb}
                  data-testid="prompt-target-confirm"
                  disabled={
                    !canSubmitStagedTargets ||
                    (Boolean(readyLegendsCopy) && stagedTargetCount === 0)
                  }
                  onClick={() => {
                    submitEffectCardTargets(side);
                  }}
                >
                  {readyLegendsCopy
                    ? stagedTargetCount === 0
                      ? "Ready selected"
                      : `Ready ${stagedTargetCount} ${stagedTargetCount === 1 ? "Legend" : "Legends"}`
                    : "Confirm"}
                </button>
              </>
            ) : null}
            {canCancelActivatedAbility ? (
              <button
                type="button"
                className={classes.verb}
                data-testid="prompt-cancel-ability"
                onClick={() => {
                  dispatch({
                    type: "cancelPendingResolution",
                    as: PLAYER_SIDE_TO_ID[side],
                  });
                }}
              >
                Cancel ability
              </button>
            ) : null}
            {acceptSingleCardToPlay ? (
              <button
                type="button"
                className={classes.verb}
                data-testid="prompt-play-selected-card"
                onClick={acceptSingleCardToPlay}
              >
                {choice?.type === "chooseCardToPlay" && choice.payload.free
                  ? "Play for free"
                  : "Play card"}
              </button>
            ) : null}
            {declineCardToPlay ||
            declineCardToMove ||
            (declineTargetChoice &&
              !(
                canCancelActivatedAbility &&
                choice?.type === "chooseTarget" &&
                choice.payload.targetPurpose === "playCard"
              )) ? (
              <button
                type="button"
                className={classes.verb}
                data-testid="prompt-target-pass"
                onClick={declineTargetChoice ?? declineCardToMove ?? declineCardToPlay ?? undefined}
              >
                {readyLegendsCopy
                  ? "Ready none"
                  : choice?.type === "chooseTarget" &&
                      choice.payload.type === "discardFromHand" &&
                      choice.payload.canDecline
                    ? "Skip effect"
                    : choice?.type === "chooseCardToMove" && choice.payload.canDecline
                      ? "Skip effect"
                      : choice?.type === "chooseCardToPlay" && choice.payload.canDecline
                        ? choice.payload.free
                          ? "Add to hand"
                          : "Skip"
                        : choice?.type === "chooseTarget" &&
                            choice.payload.targetPurpose === "playCard"
                          ? "Cancel ability"
                          : choice?.type === "chooseTarget" && choice.payload.min === 0
                            ? "Take none"
                            : "Pass"}
              </button>
            ) : null}
          </div>
        ) : null}
        {targetHeaderActions}
      </div>
    );
  }

  // select-action mode
  const attackTriggers = collectPendingAttackTriggerSummaries(matchState);
  const verbs = collectVerbs(
    interactionView,
    inSetup,
    gamePhase,
    matchState,
    matchState.G.attackState,
    attackTriggers,
    shouldConfirmSkipBlock,
  );
  const disabledPassReason = verbs.find(
    (verb) => verb.moveId === "passPhase" && !verb.enabled,
  )?.disabledReason;

  if (inSetup && verbs.length === 0) {
    // Player has decided (mulligan or keep) and is waiting for the opponent
    // to do the same before the game advances to the main phase. Same quiet
    // chip as the mid-game wait — nothing here needs a decision plate.
    return (
      <div
        className={`${classes.banner} ${classes.bannerWaiting}${compactClass}${surfaceClass}`}
        data-side={side}
        data-testid="prompt-banner"
        data-prompt-skin={promptSkin}
        data-state="waiting-mulligan"
        role="region"
        aria-label={`${side} prompt — waiting for opponent`}
      >
        <p className={classes.title} data-testid="prompt-banner-title">
          Waiting
        </p>
        <p className={classes.message} data-testid="prompt-banner-message">
          Rival is making their mulligan decision…
        </p>
        {headerActions}
      </div>
    );
  }

  const showForcedActionPrompt =
    inSetup || selectedDirectMove !== null || pendingAttackSelection !== null;
  if (!showActionPrompt && !showForcedActionPrompt) {
    return null;
  }
  if (!showForcedActionPrompt && !hasOnlyIdlePromptActions(verbs) && !disabledPassReason) {
    return null;
  }
  const state = inSetup
    ? "mulligan"
    : selectedDirectMove || pendingAttackSelection
      ? "select-target"
      : "select-action";
  const cancelSelection = () => {
    if (localTargetSelection) localTargetSelection.cancel();
    else {
      moveSelection.clearSelection();
      attackSelection.clearSelection();
    }
    onArmVerb?.(null);
  };
  const cancelButton =
    selectedDirectMove || pendingAttackSelection ? (
      <button
        type="button"
        className={classes.cancel}
        data-testid="prompt-cancel-selection"
        aria-keyshortcuts="Escape"
        onClick={cancelSelection}
      >
        {pendingAttackSelection ? "Cancel attack" : "Cancel"}
      </button>
    ) : null;
  const selectedPlayTargetLabel =
    selectedPlayCardTargeting && selectedSourceDef
      ? `Choose a target for ${selectedSourceDef.displayName ?? selectedSourceDef.name}`
      : undefined;
  const title =
    selectedPlayCardTargeting && selectedSourceDef ? (
      <CardNameToken
        cardId={moveSelection.selection?.sourceCardId ?? ""}
        fallbackName={selectedSourceDef.displayName ?? selectedSourceDef.name}
        className={classes.sourceCardName}
      />
    ) : inSetup ? (
      `Mulligan — You go ${matchState.G.players[PLAYER_SIDE_TO_ID[side]].firstPlayer ? "first" : "second"}`
    ) : pendingAttackSelection ? (
      "Choose attack target"
    ) : selectedDirectMove ? (
      selectedMoveTitle(selectedDirectMove, moveSelection.selection?.sourceCardId)
    ) : matchState.G.attackState ? (
      attackPromptTitle(matchState.G.attackState)
    ) : (
      "Your move"
    );
  const actionMessage =
    selectedPlayCardTargeting && selectedSourceDef
      ? selectedSourceDef.type === "gear"
        ? "Select a friendly Unit or face-up Legend to attach this Gear."
        : (selectedSourceDef.rulesText ?? "Select a highlighted target to resolve the program.")
      : pendingAttackSelection
        ? pendingAttackSelection.intent === "fight"
          ? "Choose a spent rival Unit. Cancel if you do not want to attack."
          : "Choose a spent rival Unit or the rival. Cancel if you do not want to attack."
        : actionPromptMessage({
            selectedMove: selectedDirectMove,
            selectedSourceCardId: moveSelection.selection?.sourceCardId,
            inSetup,
            verbs,
            disabledPassReason,
          });
  const showVerbRow = !localTargeting;
  return (
    <>
      <div
        className={`${classes.banner} ${
          localTargeting ? classes.bannerTarget : classes.bannerAction
        } ${localTargeting ? classes.selectedPlayPrompt : ""}${compactClass}${surfaceClass}`}
        data-side={side}
        data-testid="prompt-banner"
        data-prompt-skin={promptSkin}
        data-state={state}
        role="region"
        aria-label={`${side} prompt — ${
          selectedPlayCardTargeting || pendingAttackSelection
            ? "choose target"
            : inSetup
              ? "mulligan decision"
              : "your move"
        }`}
      >
        <div className={classes.actionSummary}>
          <p
            className={classes.title}
            data-testid="prompt-banner-title"
            aria-label={selectedPlayTargetLabel}
          >
            {title}
          </p>
          {actionMessage ? (
            <p className={classes.actionMessage} data-testid="prompt-banner-message">
              {typeof actionMessage === "string" ? (
                <CyberpunkRulesText text={actionMessage} />
              ) : (
                actionMessage
              )}
            </p>
          ) : null}
          {mulliganStats ? (
            <MulliganStatsStrip
              stats={mulliganStats}
              compact={compact}
              mobile={surface === "mobile"}
            />
          ) : null}
        </div>
        {showVerbRow ? (
          <div className={classes.verbs} data-testid="prompt-banner-verbs">
            {cancelButton}
            {surface === "mobile" ? (
              <button
                type="button"
                className={classes.verb}
                disabled={!canUndo}
                data-testid="prompt-verb-undo"
                data-verb="undo"
                aria-label={canUndo ? "Undo last move" : "No undoable move available"}
                onClick={() => {
                  dispatch({ type: "undo" });
                  moveSelection.clearSelection();
                  onArmVerb?.(null);
                }}
              >
                Undo
              </button>
            ) : null}
            {verbs.map((verb) => {
              const enabled = verb.enabled;
              const active = selectedMove === verb.moveId;
              const confirmingSkipBlock =
                verb.moveId === "resolveAttack" && pendingConfirmation === "skip-block";
              const ariaLabel = verb.disabledReason
                ? `${verb.label}. ${verb.disabledReason}`
                : confirmingSkipBlock
                  ? "Are you sure? Skip blocking with a ready BLOCKER"
                  : verb.moveId === "resolveAttack" && shouldConfirmSkipBlock
                    ? "Skip blocking with a ready BLOCKER"
                    : verbAriaLabel(
                        verb.moveId,
                        matchState,
                        matchState.G.attackState,
                        attackTriggers,
                      );
              const blockedPassReason =
                verb.moveId === "passPhase" && !enabled ? verb.disabledReason : undefined;
              const button = (
                <button
                  key={verb.moveId}
                  type="button"
                  className={`${classes.verb} ${active ? classes.verbActive : ""}`}
                  disabled={!enabled}
                  data-testid={`prompt-verb-${verb.moveId}`}
                  data-verb={verb.moveId}
                  data-sim-move-id={verb.moveId}
                  data-armed={active || confirmingSkipBlock ? "true" : "false"}
                  aria-label={ariaLabel}
                  aria-pressed={active || confirmingSkipBlock}
                  title={verb.disabledReason}
                  onClick={() => {
                    if (verb.moveId === "passPhase") {
                      if (shouldConfirmPass) {
                        setPendingConfirmation("pass-with-attackers");
                        return;
                      }
                      passPhase();
                      return;
                    }
                    if (verb.moveId === "resolveAttack") {
                      if (shouldConfirmSkipBlock) {
                        if (pendingConfirmation === "skip-block") {
                          announceSkipBlockConfirmation(false);
                          skipBlock();
                          return;
                        }
                        announceSkipBlockConfirmation(true);
                        return;
                      }
                      skipBlock();
                      return;
                    }
                    if (verb.moveId === "mulligan") {
                      dispatch({ type: "mulligan", as: PLAYER_SIDE_TO_ID[side] });
                      moveSelection.clearSelection();
                      onArmVerb?.(null);
                      return;
                    }
                    if (verb.moveId === "keepHand") {
                      dispatch({ type: "keepHand", as: PLAYER_SIDE_TO_ID[side] });
                      moveSelection.clearSelection();
                      onArmVerb?.(null);
                      return;
                    }
                    if (isDirectCardMove(verb.moveId)) {
                      moveSelection.setSelection(
                        active ? null : { side, moveId: verb.moveId as DirectCardMoveId },
                      );
                      onArmVerb?.(active ? null : verb.moveId);
                      return;
                    }
                    onArmVerb?.(active ? null : verb.moveId);
                  }}
                >
                  {confirmingSkipBlock ? "Are you sure?" : verb.label}
                </button>
              );
              if (blockedPassReason) {
                return (
                  <span
                    key={verb.moveId}
                    className={classes.blockedPassHitTarget}
                    data-testid="prompt-verb-passPhase-hit-target"
                    title={blockedPassReason}
                    onClick={() => showBlockedPassTurnNotification(blockedPassReason)}
                  >
                    {button}
                  </span>
                );
              }
              return button;
            })}
          </div>
        ) : inlineLocalTargetActions ? (
          <div className={classes.selectedPlayActions}>
            {cancelButton}
            {headerActions}
          </div>
        ) : (
          cancelButton
        )}
        {inlineLocalTargetActions ? null : headerActions}
      </div>
      {pendingConfirmation === "pass-with-attackers"
        ? createPortal(
            <div
              className={`${classes.confirmScrim} ${confirmationSkin.skin}`}
              data-prompt-skin={promptSkin}
              role="dialog"
              aria-modal="true"
              aria-labelledby={confirmTitleId}
            >
              <div className={classes.confirmSheet}>
                <p id={confirmTitleId} className={classes.confirmTitle}>
                  Pass with attackers ready?
                </p>
                <p className={classes.confirmText}>
                  You still have Units that can attack. Passing ends your turn.
                </p>
                <div className={classes.confirmActions}>
                  <button
                    type="button"
                    className={classes.confirmSecondary}
                    aria-keyshortcuts="Escape"
                    data-testid="pass-confirm-cancel"
                    onClick={() => setPendingConfirmation(null)}
                  >
                    <span>Keep attacking</span>
                    <DialogHotkeyHint label="Esc" />
                  </button>
                  <button
                    type="button"
                    className={classes.confirmPrimary}
                    aria-keyshortcuts="Space"
                    data-testid="pass-confirm-submit"
                    onClick={() => {
                      setPendingConfirmation(null);
                      passPhase();
                    }}
                  >
                    <span>Pass turn</span>
                    <DialogHotkeyHint label="Space" />
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function isDirectCardMove(moveId: MoveId): moveId is DirectCardMoveId {
  return (
    moveId === "playCard" ||
    moveId === "sellCard" ||
    moveId === "callLegend" ||
    moveId === "goSolo" ||
    moveId === "attackUnit" ||
    moveId === "attackRival" ||
    moveId === "useBlocker" ||
    moveId === "activateAbility"
  );
}

function DialogHotkeyHint({ label }: { label: string }) {
  return (
    <kbd className={classes.confirmHotkey} aria-label={`${label} hotkey`}>
      <IconKeyboard size={12} stroke={2.2} aria-hidden="true" />
      <span>{label}</span>
    </kbd>
  );
}

function selectedMoveTitle(moveId: DirectCardMoveId, sourceCardId: string | undefined): string {
  switch (moveId) {
    case "playCard":
      return sourceCardId ? "Choose target" : "Choose card";
    case "callLegend":
      return "Choose legend";
    case "sellCard":
      return "Choose card";
    case "goSolo":
      return "Choose legend";
    case "attackUnit":
      return "Choose attacker";
    case "attackRival":
      return "Choose attacker";
    case "useBlocker":
      return "Choose blocker";
    case "activateAbility":
      return "Choose ability";
    default:
      return moveId satisfies never;
  }
}

interface VerbRow {
  moveId: MoveId;
  label: string;
  enabled: boolean;
  disabledReason?: string;
}

interface AttackLabelState {
  attackerId?: unknown;
  defenderId?: unknown;
  rivalId?: unknown;
  kind?: string;
  step?: string;
  gigsToSteal?: number;
}

const VERB_ORDER: MoveId[] = [
  "mulligan",
  "keepHand",
  "playCard",
  "callLegend",
  "goSolo",
  "sellCard",
  "attackUnit",
  "attackRival",
  "useBlocker",
  "activateAbility",
  "resolveAttack",
  "passPhase",
];

const VERB_LABELS: Partial<Record<MoveId, string>> = {
  mulligan: "Mulligan",
  keepHand: "Keep",
  playCard: "Play",
  callLegend: "Call legend",
  goSolo: "Go Solo",
  sellCard: "Sell",
  attackUnit: "FIGHT",
  attackRival: "STEAL",
  useBlocker: "Block",
  activateAbility: "Activate ability",
};

function verbAriaLabel(
  moveId: MoveId,
  matchState: ReturnType<typeof useEngine>["matchState"],
  attack: { kind?: string; step?: string } | null,
  attackTriggers: readonly AttackTriggerSummary[],
): string | undefined {
  if (moveId === "attackUnit") {
    return "Fight a spent rival unit";
  }
  if (moveId === "attackRival") {
    return "Steal from rival";
  }
  if (moveId === "resolveAttack") {
    return resolveAttackAriaLabel(matchState, attack, attackTriggers);
  }
  return undefined;
}

function resolveAttackAriaLabel(
  matchState: ReturnType<typeof useEngine>["matchState"],
  attack: AttackLabelState | null,
  attackTriggers: readonly AttackTriggerSummary[],
): string {
  if (!attack) {
    return "Resolve attack";
  }
  if (attack.step === "attack") {
    if (attackTriggers.length === 0) {
      return "Move to the React step";
    }
    return attackTriggers.length === 1
      ? `Resolve ${attackTriggers[0]!.cardName} ATTACK trigger: ${attackTriggers[0]!.text}`
      : `Resolve ${formatTriggerCount(attackTriggers)} before moving to the React step`;
  }
  if (attack.step === "react") {
    return attack.kind === "direct"
      ? "Pass React and let the attack reach the steal step"
      : "Pass React and move to the fight step";
  }
  if (attack.step === "fight") {
    return "Compare power and resolve fight-result effects before defeats";
  }
  if (attack.step === "fightResult") {
    return "Finish fight-result effects, then process defeats";
  }
  if (attack.step === "steal") {
    return needsGigChoice(matchState, attack)
      ? "Choose which rival gig die to steal"
      : "Steal gigs and finish the attack";
  }
  return "Resolve attack";
}

function resolveAttackLabel(
  matchState: ReturnType<typeof useEngine>["matchState"],
  attack: AttackLabelState | null,
  attackTriggers: readonly AttackTriggerSummary[],
): string {
  if (!attack) {
    return "Resolve attack";
  }
  if (attack.step === "attack") {
    if (attackTriggers.length === 0) {
      return "Go to React";
    }
    return attackTriggers.length === 1
      ? `Resolve ${attackTriggers[0]!.cardName}`
      : "Resolve effects";
  }
  if (attack.step === "react") {
    return attack.kind === "direct" ? "Let them steal" : "Start fight";
  }
  if (attack.step === "fight" || attack.step === "fightResult") {
    return "Fight";
  }
  if (attack.step === "steal") {
    return needsGigChoice(matchState, attack) ? "Choose rival gig" : "Steal gigs";
  }
  return "Resolve attack";
}

function actionPromptMessage({
  selectedMove,
  selectedSourceCardId,
  inSetup,
  verbs,
  disabledPassReason,
}: {
  selectedMove: DirectCardMoveId | null;
  selectedSourceCardId?: string;
  inSetup: boolean;
  verbs: readonly VerbRow[];
  disabledPassReason?: string;
}): ReactNode | null {
  if (inSetup) {
    return "Keep this hand or draw a fresh opening hand.";
  }

  if (selectedMove) {
    return selectedMoveMessage(selectedMove, selectedSourceCardId);
  }

  if (disabledPassReason) {
    return disabledPassReason;
  }

  return hasOnlyIdlePromptActions(verbs)
    ? "No legal attackers are available. Pass to end your turn."
    : null;
}

function selectedMoveMessage(moveId: DirectCardMoveId, sourceCardId: string | undefined): string {
  switch (moveId) {
    case "playCard":
      return sourceCardId
        ? "Attach this Gear to a friendly Unit."
        : "Pick a card you can afford to play.";
    case "callLegend":
      return "Flip one face-down Legend for 2 Eddies.";
    case "sellCard":
      return "Place a Sell card into Eddies.";
    case "goSolo":
      return "Play a GO SOLO unit ready to attack this turn.";
    case "attackUnit":
      return "Pick your attacker, then a spent rival unit.";
    case "attackRival":
      return "Pick your attacker to steal from the rival.";
    case "useBlocker":
      return "Spend a BLOCKER to redirect the attack.";
    case "activateAbility":
      return "Choose a card ability to activate.";
  }
}

function attackPromptTitle(attack: AttackLabelState): string {
  if (attack.kind === "direct") {
    return "Attack: Player";
  }
  if (attack.kind === "fight") {
    return "Attack: Unit";
  }
  return "Attack in progress";
}

function passPhaseLabel(gamePhase: string): string {
  if (gamePhase === "main") {
    return "Pass Turn";
  }
  return "Pass";
}

function formatTriggerCount(attackTriggers: readonly AttackTriggerSummary[]): string {
  return `${attackTriggers.length} ATTACK trigger${attackTriggers.length === 1 ? "" : "s"}`;
}

function needsGigChoice(
  matchState: ReturnType<typeof useEngine>["matchState"],
  attack: AttackLabelState,
): boolean {
  const rivalId = cardInstanceKey(attack.rivalId);
  if (!rivalId) {
    return false;
  }
  const rival = matchState.G.players[rivalId];
  if (!rival) {
    return false;
  }
  return rival.gigArea.length > getStealCount(matchState, attack);
}

function getStealCount(
  matchState: ReturnType<typeof useEngine>["matchState"],
  attack: AttackLabelState,
): number {
  const rivalId = cardInstanceKey(attack.rivalId);
  const rivalGigCount = rivalId ? (matchState.G.players[rivalId]?.gigArea.length ?? 0) : 0;
  if (attack.gigsToSteal !== undefined) {
    return Math.min(attack.gigsToSteal, rivalGigCount);
  }
  const attackerId = cardInstanceKey(attack.attackerId);
  if (!attackerId) {
    return Math.min(1, rivalGigCount);
  }
  const power = getEffectivePower(matchState, attackerId);
  return Math.min(power <= 0 ? 0 : 1 + Math.floor(power / 10), rivalGigCount);
}

function cardInstanceKey(cardId: unknown): string | null {
  if (typeof cardId === "string") {
    return cardId;
  }
  if (typeof cardId === "number") {
    return `${cardId}`;
  }
  return null;
}

function collectVerbs(
  interactionView: ReturnType<typeof useEngineInteractionView>,
  inSetup: boolean,
  gamePhase: string,
  matchState: ReturnType<typeof useEngine>["matchState"],
  attack: AttackLabelState | null,
  attackTriggers: readonly AttackTriggerSummary[],
  hasValidBlocker: boolean,
): VerbRow[] {
  // Note `enabled` is "has at least one candidate". Verbs with no candidates
  // appear disabled so the player can see the full action surface even when
  // it's not all reachable right now.
  // `passPhase` is suppressed during setup: direct commands still support the
  // legacy escape hatch, but player-facing prompts use mulligan/keepHand.
  const byId = new Map<string, ReturnType<typeof useEngineInteractionView>["actions"][number]>();
  for (const action of interactionView.actions) {
    byId.set(action.id, action);
  }
  return VERB_ORDER.flatMap((id) => {
    if (inSetup && id === "passPhase") {
      return [];
    }
    const label =
      id === "passPhase"
        ? passPhaseLabel(gamePhase)
        : id === "resolveAttack"
          ? hasValidBlocker
            ? "Skip block"
            : resolveAttackLabel(matchState, attack, attackTriggers)
          : VERB_LABELS[id];
    if (!label) {
      return [];
    }
    const action = byId.get(id);
    if (!action) {
      // Move isn't available at all (engine excluded it). Hide entirely.
      return [];
    }
    return [
      {
        moveId: id,
        label,
        enabled: action.enabled,
        disabledReason: interactionTextLabel(action.disabledText),
      },
    ];
  });
}

function hasOnlyIdlePromptActions(verbs: readonly VerbRow[]): boolean {
  return verbs.length > 0 && verbs.every((verb) => verb.moveId === "passPhase" && verb.enabled);
}

function interactionTextLabel(
  text: ReturnType<typeof useEngineInteractionView>["actions"][number]["disabledText"],
): string | undefined {
  const label = text?.params?.label;
  return typeof label === "string" ? label : undefined;
}

function triggerChoiceCopy(
  options: readonly { abilityText: string; optional?: boolean }[],
  canPass: boolean,
): { title: string; message: string; showSource: boolean } {
  if (canPass) {
    return {
      title: "Optional ability",
      message: "can resolve now. Use it, or pass to continue the turn.",
      showSource: true,
    };
  }
  if (options.length === 1) {
    return {
      title: "Ability pending",
      message: "must resolve before the game can continue.",
      showSource: true,
    };
  }
  return {
    title: "Choose ability order",
    message: "Several abilities are waiting. Pick one to resolve next.",
    showSource: false,
  };
}

function describeChoice(
  prompt: ReturnType<typeof useNativePromptPresentation>,
  matchState: MatchState,
): string {
  const choice = prompt.choice;
  if (!choice) {
    return "Awaiting input…";
  }
  switch (choice.type) {
    case "chooseEffect":
      return "Choose one effect to resolve";
    case "chooseTrigger":
      if (choice.payload.canPass) {
        return "Choose an optional effect or pass";
      }
      return "Choose the next trigger to resolve";
    case "chooseCardToPlay":
      return chooseCardToPlayCopy(prompt, matchState);
    case "chooseCardType":
      return "Choose a card type";
    case "chooseCardToMove":
      if (choice.payload.destination === "trash") {
        return `Choose a card to trash${choice.payload.canDecline ? ", or pass" : ""}`;
      }
      return `Choose a card to move${choice.payload.canDecline ? ", or pass" : ""}`;
    case "chooseGigsToSteal":
      return `Choose ${choice.payload.count} gig${choice.payload.count === 1 ? "" : "s"} to steal`;
    case "chooseTarget": {
      if (choice.payload.type === "discardFromHand") {
        const n = choice.payload.amount ?? 1;
        return `Select ${n} card${n === 1 ? "" : "s"} to discard${
          choice.payload.canDecline ? ", or skip" : ""
        }`;
      }
      if (choice.payload.type === "effectTarget") {
        if (choice.payload.targetPurpose === "playCard") {
          const remaining = choice.payload.availableEddiesAfterCosts;
          const remainingCopy =
            typeof remaining === "number" ? ` You have ${remaining} €$ left.` : "";
          return `Choose a Program to play. You still pay its Eddie cost.${remainingCopy} Cancel if you don't want to play one.`;
        }
        if (gigCopyPairConstraint(choice)) {
          return `Step 1: choose a source Gig. Step 2: choose the target Gig to change${
            choice.payload.canDecline ? ", or pass" : ""
          }`;
        }
        const n = choice.payload.min ?? 1;
        const max = choice.payload.max ?? n;
        return interactionBoundsCopy(
          {
            required: n > 0 && !choice.payload.canDecline,
            min: n,
            max,
          },
          "target",
          { includeStatus: n > 0 && !choice.payload.canDecline },
        );
      }
      if (choice.payload.type === "adjustGig") {
        const max = choice.payload.maxAmount ?? 0;
        return `Choose the Gig's new value below, or tap the highlighted Gig on the board. Adjust by up to ${max}.`;
      }
      return "Choose a target";
    }
    case "scry":
      return `Choose ${scrySelectionText(choice)} from top ${choice.payload.amount}`;
    case "revealDestination":
      return "Choose whether revealed cards go to hand or trash";
    case "gainGig":
      return "Pick a gig die from the fixer area";
    case "redirectDefeat":
      return `You may spend ${choice.payload.cost} €$ to defeat this Legend instead of a friendly Unit`;
    case "chooseSacrificialGear":
      return "Choose which attached Gear is defeated instead of this Unit";
    case "preventGigSteal": {
      const stolen = choice.payload.stealEntries.length;
      return `Discard card${choice.payload.handEntries.length === 1 ? "" : "s"} with matching cost to protect ${stolen === 1 ? "the stolen Gig" : `${stolen} stolen Gigs`}, or let the Rival steal.`;
    }
    case "chooseFirstPlayer":
      return "Choose who takes the first turn.";
  }
  return "Awaiting input…";
}

function buildAdjustGigPromptOptions(
  payload: AdjustGigPromptPayload,
  matchState: MatchState,
  dieId: string,
  interactionView: ReturnType<typeof useEngineInteractionView>,
): AdjustGigPromptOption[] {
  const die = matchState.G.gigDice[dieId];
  const adjustment = payload.type === "effectTarget" ? payload.adjustGig : payload;
  const currentValue =
    die?.faceValue ?? (payload.type === "adjustGig" ? payload.currentValue : undefined);
  const maxFaceValue = die
    ? ({ d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20 } as const)[die.dieType]
    : payload.type === "adjustGig"
      ? payload.maxFaceValue
      : undefined;
  if (typeof currentValue !== "number" || typeof maxFaceValue !== "number") {
    return [];
  }

  const valueInput = interactionView.actions
    .find((candidate) => candidate.enabled && candidate.id === "resolveAdjustGig")
    ?.inputs.find((input) => input.kind === "number" && input.id === "value");
  const inputMin = valueInput?.kind === "number" ? valueInput.min : undefined;
  const inputMax = valueInput?.kind === "number" ? valueInput.max : undefined;
  return buildAdjustGigOptions({
    currentValue,
    maxFaceValue,
    maxAmount: adjustment?.maxAmount,
    direction: adjustment?.direction,
    chooseUpTo: adjustment?.chooseUpTo,
    minValue: inputMin,
    maxValue: inputMax,
  });
}

function chooseCardToPlayCopy(
  prompt: ReturnType<typeof useNativePromptPresentation>,
  matchState: MatchState,
): string {
  const choice = prompt.choice;
  if (choice?.type !== "chooseCardToPlay") {
    return "Choose a card to play";
  }
  const cards = choice.payload.cards;
  const allGear = cards.length > 0 && cards.every((card) => card.type === "gear");
  const confirmedCardName =
    cards.length === 1 && choice.payload.canDecline ? cards[0]?.cardName : null;
  const declineSuffix = choice.payload.canDecline
    ? choice.payload.free
      ? ", or add it to hand"
      : ", or skip"
    : "";
  // These candidates live in a board pile, not a list — without the pointer
  // the prompt reads as a decision about nothing in particular.
  const candidateZones = new Set(
    choice.payload.cardIds.map((id) => matchState.G.cardIndex[id]?.zone),
  );
  const spatialHint =
    candidateZones.size === 1 && candidateZones.has("trash")
      ? " — tap a highlighted card in your Trash"
      : "";
  if (confirmedCardName && choice.payload.free) {
    return `Play ${confirmedCardName} for free?`;
  }
  if (allGear && choice.payload.free && choice.payload.resolvedAttachToId) {
    return `Play selected Gear for free${declineSuffix}`;
  }
  if (allGear && choice.payload.free) {
    return `Choose Gear to play for free${declineSuffix}${spatialHint}`;
  }
  if (choice.payload.free) {
    return `Play for free${declineSuffix}${spatialHint}`;
  }
  return `Choose a card to play${declineSuffix}${spatialHint}`;
}

function readyLegendChoiceCopy(
  choice: ReturnType<typeof useNativePromptPresentation>["choice"],
): string | null {
  if (choice?.type !== "chooseTarget" || choice.payload.type !== "effectTarget") return null;
  const effect = choice.payload.effect;
  if (effect?.effect !== "ready" || effect.target.selector !== "card") return null;
  const target = effect.target;
  if (
    target.controller !== "friendly" ||
    target.state !== "spent" ||
    target.zones?.length !== 1 ||
    target.zones[0] !== "legendArea" ||
    target.cardTypes?.length !== 1 ||
    target.cardTypes[0] !== "legend" ||
    (target.classifications?.length ?? 0) > 1 ||
    choice.payload.min !== 0
  )
    return null;
  const classifications = target.classifications?.map((name) => name.toUpperCase()).join(" ");
  return `Ready up to ${choice.payload.max} of your spent ${classifications ? `${classifications} ` : ""}Legends`;
}

function effectTargetChoiceCopy(
  choice: ReturnType<typeof useNativePromptPresentation>["choice"],
): { title: string; subtitle: string } | null {
  if (
    choice?.type === "chooseTarget" &&
    choice.payload.type === "effectTarget" &&
    choice.payload.targetKind === "gig"
  ) {
    const sourceName = choice.payload.source?.displayName;
    return {
      title: sourceName ? `Choose a Gig for ${sourceName}` : "Choose a Gig",
      subtitle: choice.payload.adjustGig
        ? "Select the Gig you want to change."
        : "Select the Gig this effect should use.",
    };
  }
  if (
    choice?.type !== "chooseTarget" ||
    choice.payload.type !== "effectTarget" ||
    choice.payload.targetKind !== "card"
  ) {
    return null;
  }
  const cards = choice.payload.cards ?? [];
  const hasLegend = cards.some((card) => card.type === "legend");
  const allEquipHosts =
    cards.length > 0 && cards.every((card) => card.type === "unit" || card.type === "legend");
  const allGear = cards.length > 0 && cards.every((card) => card.type === "gear");
  const allTrash = cards.length > 0 && cards.every((card) => card.zone === "trash");
  const sourceName = choice.payload.source?.displayName;

  if (allEquipHosts && choice.payload.targetPurpose === "attachHost") {
    return {
      title: hasLegend ? "Choose Unit or face-up Legend to equip" : "Choose Unit to equip",
      subtitle: hasLegend
        ? "Pick the friendly Unit or face-up Legend that will receive the Gear."
        : "Pick the friendly Unit that will receive the Gear.",
    };
  }

  if (allGear && choice.payload.targetPurpose === "gearToPlay") {
    return {
      title: "Choose Gear to play",
      subtitle: "Pick the Gear you want to play.",
    };
  }

  if (allGear && allTrash) {
    return {
      title: "Choose Gear from trash",
      subtitle: choice.payload.source?.rulesText?.toLowerCase().includes("cyberware")
        ? "Pick the Cyberware Gear to play for free."
        : "Pick the Gear to play from trash.",
    };
  }

  if (sourceName === "Unlikely Bond") {
    const allReady = cards.every((card) => !card.spent);
    const allSpent = cards.every((card) => card.spent);
    if (allReady) {
      return {
        title: "Choose ready friendly Unit",
        subtitle: "First, pick the ready friendly Unit to bottom-deck.",
      };
    }
    if (allSpent) {
      return {
        title: "Choose spent rival Unit",
        subtitle: "Now, pick the spent rival Unit to bottom-deck.",
      };
    }
  }

  return null;
}

function gigTargetPromptLabel(matchState: MatchState, dieId: string, side: Side): string {
  const die = matchState.G.gigDice[dieId];
  if (!die) {
    return "Gig";
  }
  const ownerId = Object.entries(matchState.G.players).find(([, player]) =>
    (player.gigArea as readonly string[]).includes(dieId),
  )?.[0];
  const ownerLabel = ownerId === PLAYER_SIDE_TO_ID[side] ? "Your" : "Rival";
  return `${ownerLabel} ${die.dieType.toUpperCase()}: ${die.faceValue}`;
}

function scrySelectionText(
  choice: Extract<
    NonNullable<ReturnType<typeof useNativePromptPresentation>["choice"]>,
    { type: "scry" }
  >,
): string {
  const destination =
    choice.payload.destinations.find((entry) => !entry.remainder) ?? choice.payload.destinations[0];
  if (!destination) return "cards";
  if (destination.min !== undefined && destination.max !== undefined) {
    if (destination.min === destination.max) return `${destination.min}`;
    if (destination.min === 0) return `up to ${destination.max}`;
    return `${destination.min}-${destination.max}`;
  }
  return "all matches";
}

function gigCopyPairConstraint(
  choice: ReturnType<typeof useNativePromptPresentation>["choice"],
): "gig-copy" | "gig-copy-between-players" | undefined {
  if (
    choice?.type !== "chooseTarget" ||
    choice.payload.type !== "effectTarget" ||
    choice.payload.targetKind !== "gig"
  ) {
    return undefined;
  }
  return choice.payload.pairConstraint;
}

function gigCopyPairConstraintFromInteractionView(
  interactionView: ReturnType<typeof useEngineInteractionView>,
): "gig-copy" | "gig-copy-between-players" | undefined {
  const value = interactionView.actions.find(
    (action) => action.enabled && action.id === "resolveEffectTarget",
  )?.text.params?.gigCopyPairConstraint;
  return value === "gig-copy" || value === "gig-copy-between-players" ? value : undefined;
}

function currentActionRequestId(
  interactionView: ReturnType<typeof useEngineInteractionView>,
  actionId: MoveId,
): string | null {
  return (
    interactionView.actions.find((action) => action.enabled && action.id === actionId)?.requestId ??
    null
  );
}

function isOptionalLegendCallChoice(
  choice: ReturnType<typeof useNativePromptPresentation>["choice"],
): boolean {
  return (
    choice?.type === "chooseTarget" &&
    choice.payload.type === "effectTarget" &&
    choice.payload.targetKind === "card" &&
    choice.payload.canDecline === true &&
    choice.payload.source?.rulesText?.toLowerCase().includes("call a legend") === true
  );
}
