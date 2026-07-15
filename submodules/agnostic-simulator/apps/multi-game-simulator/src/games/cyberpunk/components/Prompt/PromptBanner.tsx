import { useCallback, useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  IconArrowBarToDown,
  IconArrowBarToUp,
  IconKeyboard,
  IconListDetails,
  IconMaximize,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import {
  defOf,
  getEffectivePower,
  type MatchState,
  type PendingChoice,
} from "@tcg/cyberpunk-engine";
import {
  getGearAttachTargets,
  getProgramSpatialTargets,
  PLAYER_SIDE_TO_ID,
  useBoardMode,
  useEngine,
  useEngineInteractionView,
  useNativePromptPresentation,
  type MoveId,
  type Side,
} from "../../engine";
import { interactionViewHasAttackers } from "../../engine/interactionViewHelpers";
import {
  collectPendingAttackTriggerSummaries,
  type AttackTriggerSummary,
} from "../../engine/attackTriggers";
import { useMoveSelection, type DirectCardMoveId } from "../GameBoard/MoveSelectionContext";
import { CardNameToken } from "../CardDisplay/CardNameToken";
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
 * Per-side banner that surfaces the current prompt context: in select-action
 * mode it lists the move verbs that have at least one legal candidate; in
 * select-target mode it shows the in-flight choice sentence; in view mode it
 * shows an "opponent is choosing" ribbon.
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
  const mode = useBoardMode(side);
  const prompt = useNativePromptPresentation(side);
  const interactionView = useEngineInteractionView(side);
  const { canUndo, dispatch, effectCardTargetSelection, matchState, submitEffectCardTargets } =
    useEngine();
  const moveSelection = useMoveSelection();
  const confirmTitleId = useId();
  const selectedMove =
    moveSelection.selection?.side === side ? moveSelection.selection.moveId : armedVerb;
  const selectedDirectMove = selectedMove && isDirectCardMove(selectedMove) ? selectedMove : null;
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
  const selectedPlayTargetIds =
    selectedPlayCardTargeting && selectedSourceCardId
      ? selectedSourceDef.type === "gear"
        ? getGearAttachTargets({ interactionView }, selectedSourceCardId, "gear")
        : getProgramSpatialTargets({ matchState, side, interactionView }, selectedSourceCardId)
      : [];
  const selectedPlayTargetRequestId =
    selectedPlayTargetIds.length > 0 && selectedSourceCardId
      ? ["selected-play-target", side, selectedSourceCardId, selectedPlayTargetIds.join("|")].join(
          ":",
        )
      : null;
  const inSetup = matchState.G.gamePhase === "setup";
  const gamePhase = matchState.G.gamePhase;
  const stealChoice = prompt.choice?.type === "chooseGigsToSteal" ? prompt.choice : null;
  const [selectedStealGigIds, setSelectedStealGigIds] = useState<string[]>([]);
  const [selectedInlineGigIds, setSelectedInlineGigIds] = useState<string[]>([]);
  const [confirmingPassWithAttackers, setConfirmingPassWithAttackers] = useState(false);
  const shouldConfirmPass =
    gamePhase === "main" &&
    !matchState.G.attackState &&
    interactionViewHasAttackers(interactionView);
  const modalAction = choiceModalActionFromInteractionView(interactionView.actions, matchState, {
    visibleHandOwnerId: PLAYER_SIDE_TO_ID[side],
  });
  const targetPromptPresentation = getTargetPromptPresentation({
    actions: interactionView.actions,
    matchState,
    selectedPlayTargetRequestId,
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
  const orderedGigCopyActive = isOrderedGigCopyChoice(prompt.choice);
  const orderedGigCopyRequestId = orderedGigCopyActive
    ? currentActionRequestId(interactionView, "resolveEffectTarget")
    : null;
  const [gigCopySource, setGigCopySource] = useState<GigCopySourceEventDetail | null>(null);
  const hasTargetModalAction =
    (targetModalAction &&
      targetModalAction.id !== "resolveTrigger" &&
      targetModalAction.id !== "resolveScry" &&
      choiceActionHasRenderableDrawerContent(targetModalAction)) ||
    targetPromptPresentation.presentation === "drawer" ||
    targetPromptPresentation.presentation === "spatial";
  const showTargetModalAction =
    (mode === "select-target" || selectedPlayTargetRequestId !== null) &&
    targetModalRequestId !== null &&
    hasTargetModalAction;
  const targetModalButton = showTargetModalAction ? (
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
    (mode === "select-target" || selectedPlayTargetRequestId !== null) &&
    onTogglePromptPlacement ? (
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
  const modalRestoreAction =
    modalAction && modalMinimized && modalAction.id !== "resolveTrigger" ? (
      <button
        type="button"
        className={classes.iconButton}
        data-testid="choice-modal-restore"
        aria-label="Restore choice window"
        title="Restore choice"
        onClick={() => setChoiceModalMinimized(side, modalAction.requestId, false)}
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
  const inlineSelectedPlayActions = selectedPlayCardTargeting && compact && surface === "mobile";
  const headerActions = (
    <HeaderActions
      minimized={minimized}
      position={position}
      onToggleMinimize={onToggleMinimize}
      onTogglePosition={onTogglePosition}
      extraAction={extraAction}
      inline={inlineSelectedPlayActions}
    />
  );

  useEffect(() => {
    setSelectedStealGigIds([]);
  }, [stealChoice?.payload.attackerId, stealChoice?.payload.count]);

  useEffect(() => {
    setSelectedInlineGigIds([]);
  }, [targetModalRequestId]);

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
    if (!shouldConfirmPass) {
      setConfirmingPassWithAttackers(false);
    }
  }, [shouldConfirmPass]);

  const passPhase = useCallback(() => {
    dispatch({ type: "passPhase", as: PLAYER_SIDE_TO_ID[side] });
    moveSelection.clearSelection();
    onArmVerb?.(null);
  }, [dispatch, moveSelection, onArmVerb, side]);

  useEffect(() => {
    if (!confirmingPassWithAttackers) {
      return;
    }

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.defaultPrevented) {
        return;
      }
      if (ev.key === "Escape") {
        ev.preventDefault();
        ev.stopPropagation();
        setConfirmingPassWithAttackers(false);
        return;
      }
      if (ev.key === " " || ev.code === PASS_CONFIRM_HOTKEY) {
        ev.preventDefault();
        ev.stopPropagation();
        setConfirmingPassWithAttackers(false);
        passPhase();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [confirmingPassWithAttackers, passPhase]);

  if (mode === "view") {
    // No banner when this side is just observing — the dimmed half-board +
    // active-side accent already communicate "not your move."
    return null;
  }

  if (
    (mode === "select-target" || selectedPlayTargetRequestId !== null) &&
    ((surface !== "mobile" &&
      modalAction &&
      modalAction.id !== "resolveTrigger" &&
      !modalMinimized) ||
      targetModalOpen)
  ) {
    return null;
  }

  if (minimized) {
    const source = pickBannerSource(prompt, moveSelection.selection, matchState);
    const isReaction = prompt.choice?.type === "chooseTrigger";
    const isTarget = mode === "select-target" && !isReaction;
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
        data-state="minimized"
        data-position={position}
        role="region"
        aria-label={`${side} prompt — minimized`}
      >
        <p className={classes.minimizedLabel} data-testid="prompt-banner-title">
          {source ? (
            <CardNameToken
              cardId={source.cardId ?? ""}
              fallbackName={source.displayName}
              className={classes.sourceCardName}
            />
          ) : (
            <span className={classes.titleText}>{fallbackTitle}</span>
          )}
        </p>
        {headerActions}
      </div>
    );
  }

  if (mode === "select-target") {
    // gainGig is the one select-target choice that's resolvable from the
    // banner itself: each allowed die gets a button so the user can pick
    // straight from the prompt without scanning the FixerZone. The dice in
    // the FixerZone are also clickable as a board-spatial alternative.
    if (prompt.choice && prompt.choice.type === "gainGig") {
      const allowed = prompt.choice.payload.allowedDieIds;
      return (
        <div
          className={`${classes.banner} ${classes.bannerAction}${compactClass}${surfaceClass}`}
          data-side={side}
          data-testid="prompt-banner"
          data-state="gain-gig"
          role="region"
          aria-label={`${side} prompt — gain a gig`}
        >
          <p className={classes.title} data-testid="prompt-banner-title">
            Take a gig die
          </p>
          <p className={classes.actionMessage} data-testid="prompt-banner-message">
            Bigger die = higher Street Cred ceiling, more variance. First to 6 gigs wins.
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
                  Take {label}
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
          data-state="steal-gigs"
          role="region"
          aria-label={`${side} prompt — steal gigs`}
        >
          <p className={classes.title} data-testid="prompt-banner-title">
            Choose rival gig{required === 1 ? "" : "s"}
          </p>
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
          {headerActions}
        </div>
      );
    }

    if (prompt.choice && prompt.choice.type === "chooseTrigger") {
      const canPass = Boolean(prompt.choice.payload.canPass);
      const primaryOption = prompt.choice.payload.options[0];
      const triggerCopy = triggerChoiceCopy(prompt.choice.payload.options, canPass);
      return (
        <div
          className={`${classes.banner} ${classes.bannerReaction}${compactClass}${surfaceClass}`}
          data-side={side}
          data-testid="prompt-banner"
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
          <div className={classes.verbs} data-testid="prompt-banner-verbs">
            {prompt.choice.payload.options.map((option) => (
              <button
                key={option.triggerId}
                type="button"
                className={`${classes.verb} ${option.optional ? classes.verbActive : ""}`}
                data-testid={`prompt-trigger-${option.triggerId}`}
                aria-label={`${option.optional ? "Play" : "Resolve"} ${option.cardName}: ${
                  option.abilityText
                }`}
                onClick={() => {
                  dispatch({
                    type: "resolveTrigger",
                    triggerId: option.triggerId,
                    as: PLAYER_SIDE_TO_ID[side],
                  });
                }}
              >
                <span className={classes.triggerOptionText}>
                  {option.optional ? "Use optional ability" : "Resolve ability"}
                  <span className={classes.triggerOptionDetail}>{option.abilityText}</span>
                </span>
              </button>
            ))}
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
    const adjustGigChoice =
      choice?.type === "chooseTarget" && choice.payload.type === "adjustGig" ? choice : null;
    const adjustGigOptions = adjustGigChoice
      ? buildAdjustGigPromptOptions(adjustGigChoice.payload, interactionView)
      : [];
    const inlineGigTargetChoice =
      surface === "mobile" &&
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
    const sentence = describeChoice(prompt);
    const effectTargetCopy = effectTargetChoiceCopy(choice);
    const choiceTitle =
      choice?.type === "chooseTarget" && choice.payload.type === "adjustGig"
        ? "Adjust Gig"
        : choice?.type === "scry"
          ? "Deck search"
          : choice?.type === "chooseCardToPlay"
            ? sentence
            : choice?.type === "chooseCardType"
              ? "Choose card type"
              : orderedGigCopyChoice
                ? "Choose Gigs"
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
    const displaySourceForTitle = adjustGigChoice ? null : sourceForTitle;
    const titlePrefix = orderedGigCopyChoice
      ? "Choose Gigs for "
      : choice?.type === "chooseTarget" && choice.payload.type === "discardFromHand"
        ? "Choose cards to discard for "
        : choice?.type === "chooseCardToMove" && choice.payload.destination === "trash"
          ? "Choose card to trash for "
          : isOptionalLegendCallChoice(choice)
            ? "Choose Legend to call with "
            : "Choose a target for ";
    const sourceTitleLabel = displaySourceForTitle
      ? `${titlePrefix}${displaySourceForTitle.displayName}`
      : choiceTitle;
    const titleRequirement =
      choice?.type === "chooseTarget" &&
      (choice.payload.type === "effectTarget" || choice.payload.type === "discardFromHand")
        ? (effectTargetCopy?.subtitle ?? sentence)
        : null;
    const declineTargetChoice =
      choice?.type === "chooseTarget" && (choice.payload.canDecline || choice.payload.min === 0)
        ? () => {
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
    const stagedTargets =
      effectCardTargetSelection?.side === side ? effectCardTargetSelection : null;
    const stagedTargetCount = stagedTargets?.targetIds.length ?? 0;
    const canSubmitStagedTargets =
      stagedTargets !== null &&
      stagedTargetCount >= stagedTargets.min &&
      stagedTargetCount <= stagedTargets.max;
    const compactTargetChoice = Boolean(displaySourceForTitle && !orderedGigCopyChoice && !compact);
    return (
      <div
        className={`${classes.banner} ${classes.bannerTarget} ${
          compactTargetChoice ? classes.bannerTargetSlim : ""
        }${compactClass}${surfaceClass}`}
        data-side={side}
        data-testid="prompt-banner"
        data-state="select-target"
        role="region"
        aria-label={`${side} prompt — choose target`}
      >
        <p className={classes.title} data-testid="prompt-banner-title">
          <span className={classes.titleText} aria-label={sourceTitleLabel}>
            {displaySourceForTitle ? (
              effectTargetCopy?.title ? (
                effectTargetCopy.title
              ) : (
                <CardNameToken
                  cardId={displaySourceForTitle.cardId}
                  fallbackName={displaySourceForTitle.displayName}
                  className={classes.sourceCardName}
                />
              )
            ) : (
              choiceTitle
            )}
          </span>
        </p>
        {titleRequirement ? (
          <span className={classes.titleMeta} data-testid="prompt-banner-message">
            {titleRequirement}
          </span>
        ) : null}
        {effectSource?.rulesText ? (
          <div className={classes.promptCopy}>
            <p className={classes.effectText} data-testid="prompt-banner-effect">
              {effectSource.rulesText}
            </p>
          </div>
        ) : null}
        {orderedGigCopyChoice ||
        adjustGigChoice ||
        (!displaySourceForTitle && !titleRequirement) ? (
          <div className={classes.promptCopy}>
            {orderedGigCopyChoice ? (
              <p className={classes.sequenceHint} data-testid="prompt-banner-sequence">
                {gigCopySource
                  ? `${gigCopySource.label} showing ${gigCopySource.value} is the source. Choose the Gig to change; smaller dice cap at their max.`
                  : "First, choose the Gig to copy from. Then choose the Gig that changes."}
              </p>
            ) : null}
            {adjustGigChoice || (!displaySourceForTitle && !titleRequirement) ? (
              <p className={classes.message} data-testid="prompt-banner-message">
                {sentence}
              </p>
            ) : null}
          </div>
        ) : null}
        {inlineGigTargetIds.length > 0 ||
        adjustGigOptions.length > 0 ||
        stagedTargets ||
        declineTargetChoice ||
        declineCardToMove ? (
          <div className={classes.verbs} data-testid="prompt-banner-verbs">
            {inlineGigTargetIds.map((dieId) => {
              const selected = selectedInlineGigIds.includes(dieId);
              const selectionLimitReached =
                inlineGigTargetMax > 1 &&
                selectedInlineGigIds.length >= inlineGigTargetMax &&
                !selected;
              return (
                <button
                  key={dieId}
                  type="button"
                  className={`${classes.verb} ${selected ? classes.verbActive : ""}`}
                  data-testid="prompt-gig-target-option"
                  data-die-id={dieId}
                  data-selected={selected ? "true" : "false"}
                  aria-pressed={selected}
                  disabled={selectionLimitReached}
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
                  dispatch({
                    type: "resolveAdjustGig",
                    value: option.value,
                    as: PLAYER_SIDE_TO_ID[side],
                  });
                }}
              >
                {option.label}
              </button>
            ))}
            {stagedTargets ? (
              <>
                <span className={classes.count} data-testid="prompt-target-selection-count">
                  {stagedTargetCount}/{stagedTargets.max}
                </span>
                <button
                  type="button"
                  className={classes.verb}
                  data-testid="prompt-target-confirm"
                  disabled={!canSubmitStagedTargets}
                  onClick={() => {
                    submitEffectCardTargets(side);
                  }}
                >
                  Confirm
                </button>
              </>
            ) : null}
            {declineTargetChoice || declineCardToMove ? (
              <button
                type="button"
                className={classes.verb}
                data-testid="prompt-target-pass"
                onClick={declineTargetChoice ?? declineCardToMove ?? undefined}
              >
                {choice?.type === "chooseTarget" &&
                choice.payload.type === "discardFromHand" &&
                choice.payload.canDecline
                  ? "Skip effect"
                  : choice?.type === "chooseTarget" && choice.payload.min === 0
                    ? "Take none"
                    : "Pass"}
              </button>
            ) : null}
          </div>
        ) : null}
        {headerActions}
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
  );
  const disabledPassReason = verbs.find(
    (verb) => verb.moveId === "passPhase" && !verb.enabled,
  )?.disabledReason;

  if (inSetup && verbs.length === 0) {
    // Player has decided (mulligan or keep) and is waiting for the opponent
    // to do the same before the game advances to the main phase.
    return (
      <div
        className={`${classes.banner} ${classes.bannerTarget}${compactClass}${surfaceClass}`}
        data-side={side}
        data-testid="prompt-banner"
        data-state="waiting-mulligan"
        role="region"
        aria-label={`${side} prompt — waiting for opponent`}
      >
        <p className={classes.title} data-testid="prompt-banner-title">
          Waiting
        </p>
        <p className={classes.message} data-testid="prompt-banner-message">
          Opponent is making their mulligan decision…
        </p>
        {headerActions}
      </div>
    );
  }

  const showForcedActionPrompt = inSetup || selectedDirectMove !== null;
  if (!showActionPrompt && !showForcedActionPrompt) {
    return null;
  }
  if (!showForcedActionPrompt && !hasOnlyIdlePromptActions(verbs) && !disabledPassReason) {
    return null;
  }
  const state = inSetup ? "mulligan" : selectedDirectMove ? "select-target" : "select-action";
  const cancelSelection = () => {
    moveSelection.clearSelection();
    onArmVerb?.(null);
  };
  const cancelButton = selectedDirectMove ? (
    <button
      type="button"
      className={classes.cancel}
      data-testid="prompt-cancel-selection"
      onClick={cancelSelection}
    >
      Cancel
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
      "Mulligan"
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
        ? "Select a friendly Unit to attach this Gear."
        : (selectedSourceDef.rulesText ?? "Select a highlighted target to resolve the program.")
      : actionPromptMessage({
          selectedMove: selectedDirectMove,
          selectedSourceCardId: moveSelection.selection?.sourceCardId,
          inSetup,
          verbs,
          disabledPassReason,
        });
  const showVerbRow = !selectedPlayCardTargeting;
  return (
    <>
      <div
        className={`${classes.banner} ${
          selectedPlayCardTargeting ? classes.bannerTarget : classes.bannerAction
        } ${
          selectedPlayCardTargeting ? classes.selectedPlayPrompt : ""
        }${compactClass}${surfaceClass}`}
        data-side={side}
        data-testid="prompt-banner"
        data-state={state}
        role="region"
        aria-label={`${side} prompt — ${
          selectedPlayCardTargeting ? "choose target" : inSetup ? "mulligan decision" : "your move"
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
              {actionMessage}
            </p>
          ) : null}
        </div>
        {showVerbRow ? (
          <div className={classes.verbs} data-testid="prompt-banner-verbs">
            {cancelButton}
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
            {verbs.map((verb) => {
              const enabled = verb.enabled;
              const active = selectedMove === verb.moveId;
              const ariaLabel = verb.disabledReason
                ? `${verb.label}. ${verb.disabledReason}`
                : verbAriaLabel(verb.moveId, matchState, matchState.G.attackState, attackTriggers);
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
                  data-armed={active ? "true" : "false"}
                  aria-label={ariaLabel}
                  aria-pressed={active}
                  title={verb.disabledReason}
                  onClick={() => {
                    if (verb.moveId === "passPhase") {
                      if (shouldConfirmPass) {
                        setConfirmingPassWithAttackers(true);
                        return;
                      }
                      passPhase();
                      return;
                    }
                    if (verb.moveId === "resolveAttack") {
                      dispatch({ type: "resolveAttack", pass: true, as: PLAYER_SIDE_TO_ID[side] });
                      moveSelection.clearSelection();
                      onArmVerb?.(null);
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
                  {verb.label}
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
        ) : inlineSelectedPlayActions ? (
          <div className={classes.selectedPlayActions}>
            {cancelButton}
            {headerActions}
          </div>
        ) : (
          cancelButton
        )}
        {inlineSelectedPlayActions ? null : headerActions}
      </div>
      {confirmingPassWithAttackers
        ? createPortal(
            <div
              className={classes.confirmScrim}
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
                    onClick={() => setConfirmingPassWithAttackers(false)}
                  >
                    <span>Keep attacking</span>
                    <DialogHotkeyHint label="Esc" />
                  </button>
                  <button
                    type="button"
                    className={classes.confirmPrimary}
                    aria-keyshortcuts="Space"
                    onClick={() => {
                      setConfirmingPassWithAttackers(false);
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
    return "Compare power, move defeated units to trash, and finish the attack";
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
  if (attack.step === "fight") {
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
          ? resolveAttackLabel(matchState, attack, attackTriggers)
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

function describeChoice(prompt: ReturnType<typeof useNativePromptPresentation>): string {
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
      return chooseCardToPlayCopy(prompt);
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
        if (isOrderedGigCopyChoice(choice)) {
          return `1 Copy value from a Gig, then 2 choose the Gig to change${
            choice.payload.canDecline ? ", or pass" : ""
          }`;
        }
        const n = choice.payload.min ?? 1;
        const max = choice.payload.max ?? n;
        if (n === 0) {
          return `Choose up to ${max} target${max === 1 ? "" : "s"}, or take none`;
        }
        return `${n} target${n === 1 ? "" : "s"} required${choice.payload.canDecline ? ", or pass" : ""}`;
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
  }
  return "Awaiting input…";
}

function buildAdjustGigPromptOptions(
  payload: AdjustGigPromptPayload,
  interactionView: ReturnType<typeof useEngineInteractionView>,
): AdjustGigPromptOption[] {
  if (payload.type !== "adjustGig") {
    return [];
  }
  const currentValue = payload.currentValue;
  const maxFaceValue = payload.maxFaceValue;
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
    maxAmount: payload.maxAmount,
    direction: payload.direction,
    chooseUpTo: payload.chooseUpTo,
    minValue: inputMin,
    maxValue: inputMax,
  });
}

function chooseCardToPlayCopy(prompt: ReturnType<typeof useNativePromptPresentation>): string {
  const choice = prompt.choice;
  if (choice?.type !== "chooseCardToPlay") {
    return "Choose a card to play";
  }
  const cards = choice.payload.cards;
  const allGear = cards.length > 0 && cards.every((card) => card.type === "gear");
  if (allGear && choice.payload.free && choice.payload.resolvedAttachToId) {
    return "Play selected Gear for free";
  }
  if (allGear && choice.payload.free) {
    return "Choose Gear to play for free";
  }
  return "Choose a card to play";
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
  const allUnits = cards.length > 0 && cards.every((card) => card.type === "unit");
  const allGear = cards.length > 0 && cards.every((card) => card.type === "gear");
  const allTrash = cards.length > 0 && cards.every((card) => card.zone === "trash");

  if (allUnits && choice.payload.targetPurpose === "attachHost") {
    return {
      title: "Choose Unit to equip",
      subtitle: "Pick the friendly Unit that will receive the Gear.",
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

function isOrderedGigCopyChoice(
  choice: ReturnType<typeof useNativePromptPresentation>["choice"],
): boolean {
  if (
    choice?.type !== "chooseTarget" ||
    choice.payload.type !== "effectTarget" ||
    choice.payload.targetKind !== "gig"
  ) {
    return false;
  }
  const min = choice.payload.min ?? 1;
  const max = choice.payload.max ?? min;
  const text = choice.payload.source?.rulesText?.toLowerCase() ?? "";
  return min === 2 && max === 2 && text.includes("value of another gig");
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
