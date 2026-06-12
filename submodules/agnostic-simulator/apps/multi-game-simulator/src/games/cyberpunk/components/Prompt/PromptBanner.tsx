import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  IconArrowBarToDown,
  IconArrowBarToUp,
  IconInfoCircle,
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
import { CardNameToken } from "../GameBoard/CardNameToken";
import { choiceModalActionFromInteractionView } from "./choiceModalAction";
import {
  setChoiceModalOpen,
  setChoiceModalMinimized,
  useChoiceModalMinimized,
  useChoiceModalOpen,
} from "./choiceModalState";
import classes from "./PromptBanner.module.css";

type BannerPosition = "top" | "bottom";

interface PromptBannerProps {
  side: Side;
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
  /** Keep the normal action command row visible outside forced choices. */
  showActionPrompt?: boolean;
}

interface HeaderActionsProps {
  minimized: boolean;
  position: BannerPosition;
  onToggleMinimize?: () => void;
  onTogglePosition?: () => void;
  extraAction?: ReactNode;
}

function HeaderActions({
  minimized,
  position,
  onToggleMinimize,
  onTogglePosition,
  extraAction,
}: HeaderActionsProps) {
  if (!onToggleMinimize && !onTogglePosition && !extraAction) {
    return null;
  }
  return (
    <div className={classes.headerActions} data-testid="prompt-banner-header-actions">
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

function PromptHelperTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      className={`${classes.iconButton} ${classes.promptHelpButton} ${
        open ? classes.promptHelpButtonOpen : ""
      }`}
      data-testid="prompt-banner-helper"
      aria-label={text}
      aria-expanded={open}
      title={text}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen(true)}
      onFocus={() => setOpen(true)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <IconInfoCircle size={14} stroke={1.8} aria-hidden="true" />
      <span className={classes.promptHelpTooltip} role="tooltip">
        {text}
      </span>
    </button>
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
  compact = false,
  armedVerb,
  onArmVerb,
  minimized = false,
  position = "bottom",
  onToggleMinimize,
  onTogglePosition,
  showActionPrompt = true,
}: PromptBannerProps) {
  const mode = useBoardMode(side);
  const prompt = useNativePromptPresentation(side);
  const interactionView = useEngineInteractionView(side);
  const { canUndo, dispatch, matchState } = useEngine();
  const moveSelection = useMoveSelection();
  const confirmTitleId = useId();
  const selectedMove =
    moveSelection.selection?.side === side ? moveSelection.selection.moveId : armedVerb;
  const inSetup = matchState.G.gamePhase === "setup";
  const gamePhase = matchState.G.gamePhase;
  const stealChoice = prompt.choice?.type === "chooseGigsToSteal" ? prompt.choice : null;
  const [selectedStealGigIds, setSelectedStealGigIds] = useState<string[]>([]);
  const [confirmingPassWithAttackers, setConfirmingPassWithAttackers] = useState(false);
  const shouldConfirmPass =
    gamePhase === "main" &&
    !matchState.G.attackState &&
    interactionViewHasAttackers(interactionView);
  const modalAction = choiceModalActionFromInteractionView(interactionView.actions, matchState);
  const targetModalAction = choiceModalActionFromInteractionView(
    interactionView.actions,
    matchState,
    { includeSpatialTargets: true },
  );
  const modalMinimized = useChoiceModalMinimized(side, modalAction?.requestId);
  const targetModalOpen = useChoiceModalOpen(side, targetModalAction?.requestId);
  const showTargetModalAction =
    mode === "select-target" &&
    targetModalAction !== null &&
    targetModalAction.id !== "resolveTrigger" &&
    targetModalAction.id !== "resolveSearchDeck";
  const orderedGigCopyChoiceForHeader = isOrderedGigCopyChoice(prompt.choice);
  const targetRequirementForHeader =
    mode === "select-target" &&
    prompt.choice?.type === "chooseTarget" &&
    !orderedGigCopyChoiceForHeader &&
    (prompt.choice.payload.type === "effectTarget" ||
      prompt.choice.payload.type === "discardFromHand")
      ? describeChoice(prompt)
      : null;
  const promptHelperText = orderedGigCopyChoiceForHeader
    ? "Select the Gig to copy from first, then select the Gig to change."
    : targetRequirementForHeader;
  const promptHelperAction = promptHelperText ? (
    <PromptHelperTooltip text={promptHelperText} />
  ) : null;
  const targetModalButton =
    showTargetModalAction && !compact ? (
      <button
        type="button"
        className={`${classes.iconButton} ${classes.targetListButton}`}
        data-testid="prompt-target-modal-open"
        aria-label="Open choice modal"
        title="Choice Modal"
        onClick={() => setChoiceModalOpen(side, targetModalAction!.requestId, true)}
      >
        <IconListDetails size={14} stroke={1.8} />
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
    promptHelperAction || targetModalButton || modalRestoreAction ? (
      <>
        {promptHelperAction}
        {targetModalButton}
        {modalRestoreAction}
      </>
    ) : null;
  const compactClass = compact ? ` ${classes.compact}` : "";
  const headerActions = (
    <HeaderActions
      minimized={minimized}
      position={position}
      onToggleMinimize={onToggleMinimize}
      onTogglePosition={onTogglePosition}
      extraAction={extraAction}
    />
  );

  useEffect(() => {
    setSelectedStealGigIds([]);
  }, [stealChoice?.payload.attackerId, stealChoice?.payload.count]);

  useEffect(() => {
    if (!shouldConfirmPass) {
      setConfirmingPassWithAttackers(false);
    }
  }, [shouldConfirmPass]);

  const passPhase = () => {
    dispatch({ type: "passPhase", as: PLAYER_SIDE_TO_ID[side] });
    moveSelection.clearSelection();
    onArmVerb?.(null);
  };

  if (mode === "view") {
    // No banner when this side is just observing — the dimmed half-board +
    // active-side accent already communicate "not your move."
    return null;
  }

  if (
    mode === "select-target" &&
    ((modalAction && modalAction.id !== "resolveTrigger" && !modalMinimized) || targetModalOpen)
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
        ? "Choose target"
        : "Your move";
    return (
      <div
        className={`${classes.banner} ${variantClass} ${classes.bannerMinimized}${compactClass}`}
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
          className={`${classes.banner} ${classes.bannerAction}${compactClass}`}
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
          className={`${classes.banner} ${classes.bannerAction}${compactClass}`}
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
      return (
        <div
          className={`${classes.banner} ${classes.bannerReaction}${compactClass}`}
          data-side={side}
          data-testid="prompt-banner"
          data-state={canPass ? "optional-trigger" : "choose-trigger"}
          role="region"
          aria-label={`${side} prompt — ${canPass ? "optional trigger" : "choose trigger"}`}
        >
          <div className={classes.reactionSummary}>
            <p className={classes.title} data-testid="prompt-banner-title">
              {canPass ? "Reaction window" : "Choose trigger"}
            </p>
            <p className={classes.reactionMessage} data-testid="prompt-banner-message">
              {canPass && primaryOption ? (
                <>
                  <CardNameToken
                    cardId={primaryOption.sourceCardId}
                    fallbackName={primaryOption.cardName}
                    className={classes.actionCardName}
                  />{" "}
                  can be played now.
                </>
              ) : (
                "Pick the next effect to resolve."
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
                {option.optional ? `Play ${option.cardName}` : option.cardName}
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
                Pass
              </button>
            ) : null}
          </div>
          {headerActions}
        </div>
      );
    }

    const choice = prompt.choice;
    const orderedGigCopyChoice = isOrderedGigCopyChoice(choice);
    const sentence = describeChoice(prompt);
    const choiceTitle =
      choice?.type === "chooseTarget" && choice.payload.type === "adjustGig"
        ? "Adjust Gig"
        : choice?.type === "searchDeck"
          ? "Deck search"
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
    const titlePrefix = orderedGigCopyChoice
      ? "Choose Gigs for "
      : choice?.type === "chooseTarget" && choice.payload.type === "discardFromHand"
        ? "Choose cards to discard for "
        : choice?.type === "chooseCardToMove" && choice.payload.destination === "trash"
          ? "Choose card to trash for "
          : isOptionalLegendCallChoice(choice)
            ? "Choose Legend to call with "
            : "Choose a target for ";
    const titleRequirement =
      choice?.type === "chooseTarget" &&
      !orderedGigCopyChoice &&
      (choice.payload.type === "effectTarget" || choice.payload.type === "discardFromHand")
        ? sentence
        : null;
    const declineTargetChoice =
      choice?.type === "chooseTarget" && choice.payload.canDecline
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
    const compactTargetChoice = Boolean(sourceForTitle && !orderedGigCopyChoice && !compact);
    const effectRulesText = effectSource?.rulesText;
    const bannerEffectRulesText = !orderedGigCopyChoice ? effectRulesText : undefined;
    return (
      <div
        className={`${classes.banner} ${classes.bannerTarget} ${
          compactTargetChoice ? classes.bannerTargetSlim : ""
        } ${orderedGigCopyChoice ? classes.bannerOrderedGigCopy : ""}${
          compactClass ? ` ${compactClass.trim()}` : ""
        }`}
        data-side={side}
        data-testid="prompt-banner"
        data-state="select-target"
        role="region"
        aria-label={`${side} prompt — choose target`}
      >
        <p className={classes.title} data-testid="prompt-banner-title">
          <span className={classes.titleText}>
            {sourceForTitle ? (
              <>
                {titlePrefix}
                <CardNameToken
                  cardId={sourceForTitle.cardId}
                  fallbackName={sourceForTitle.displayName}
                  className={classes.sourceCardName}
                />
              </>
            ) : (
              choiceTitle
            )}
          </span>
        </p>
        {bannerEffectRulesText ? (
          <div className={classes.promptCopy}>
            <p className={classes.effectText} data-testid="prompt-banner-effect">
              {bannerEffectRulesText}
            </p>
          </div>
        ) : null}
        {orderedGigCopyChoice || (!sourceForTitle && !titleRequirement) ? (
          <div className={classes.promptCopy}>
            {orderedGigCopyChoice ? (
              <>
                {effectRulesText ? (
                  <p className={classes.effectText} data-testid="prompt-banner-effect">
                    {effectRulesText}
                  </p>
                ) : null}
              </>
            ) : null}
            {!sourceForTitle && !titleRequirement ? (
              <p className={classes.message} data-testid="prompt-banner-message">
                {sentence}
              </p>
            ) : null}
          </div>
        ) : null}
        {declineTargetChoice || declineCardToMove ? (
          <div className={classes.verbs} data-testid="prompt-banner-verbs">
            <button
              type="button"
              className={classes.verb}
              data-testid="prompt-target-pass"
              onClick={declineTargetChoice ?? declineCardToMove ?? undefined}
            >
              {choice?.type === "chooseTarget" && choice.payload.type === "discardFromHand"
                ? "Skip effect"
                : "Pass"}
            </button>
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

  if (inSetup && verbs.length === 0) {
    // Player has decided (mulligan or keep) and is waiting for the opponent
    // to do the same before the game advances to the main phase.
    return (
      <div
        className={`${classes.banner} ${classes.bannerTarget}${compactClass}`}
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

  const selectedDirectMove = selectedMove && isDirectCardMove(selectedMove) ? selectedMove : null;
  const selectedSourceCard = moveSelection.selection?.sourceCardId
    ? matchState.G.cardIndex[moveSelection.selection.sourceCardId]
    : undefined;
  const selectedSourceDef = selectedSourceCard ? defOf(selectedSourceCard) : null;
  const selectedPlayCardTargeting =
    selectedDirectMove === "playCard" &&
    selectedSourceDef !== null &&
    (selectedSourceDef.type === "program" || selectedSourceDef.type === "gear");
  const showForcedActionPrompt = inSetup || selectedDirectMove !== null;
  if (!showActionPrompt && !showForcedActionPrompt) {
    return null;
  }
  if (!showForcedActionPrompt && !hasOnlyIdlePromptActions(verbs)) {
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
  const title =
    selectedPlayCardTargeting && selectedSourceDef ? (
      <>
        Playing{" "}
        <CardNameToken
          cardId={moveSelection.selection?.sourceCardId ?? ""}
          fallbackName={selectedSourceDef.displayName ?? selectedSourceDef.name}
          className={classes.sourceCardName}
        />
      </>
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
        });
  const showVerbRow = !selectedPlayCardTargeting;
  return (
    <>
      <div
        className={`${classes.banner} ${classes.bannerAction} ${
          selectedPlayCardTargeting ? classes.selectedPlayPrompt : ""
        }${compactClass}`}
        data-side={side}
        data-testid="prompt-banner"
        data-state={state}
        role="region"
        aria-label={`${side} prompt — ${inSetup ? "mulligan decision" : "your move"}`}
      >
        <div className={classes.actionSummary}>
          <p className={classes.title} data-testid="prompt-banner-title">
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
              return (
                <button
                  key={verb.moveId}
                  type="button"
                  className={`${classes.verb} ${active ? classes.verbActive : ""}`}
                  disabled={!enabled}
                  data-testid={`prompt-verb-${verb.moveId}`}
                  data-verb={verb.moveId}
                  data-armed={active ? "true" : "false"}
                  aria-label={verbAriaLabel(
                    verb.moveId,
                    matchState,
                    matchState.G.attackState,
                    attackTriggers,
                  )}
                  aria-pressed={active}
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
            })}
          </div>
        ) : (
          cancelButton
        )}
        {headerActions}
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
                    onClick={() => setConfirmingPassWithAttackers(false)}
                  >
                    Keep attacking
                  </button>
                  <button
                    type="button"
                    className={classes.confirmPrimary}
                    onClick={() => {
                      setConfirmingPassWithAttackers(false);
                      passPhase();
                    }}
                  >
                    Pass turn
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
}

interface AttackLabelState {
  attackerId?: unknown;
  defenderId?: unknown;
  rivalId?: unknown;
  kind?: string;
  step?: string;
  fightResult?: string;
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
  if (attack.step === "offensive") {
    if (attackTriggers.length === 0) {
      return "Move to the defensive step";
    }
    return attackTriggers.length === 1
      ? `Resolve ${attackTriggers[0]!.cardName} ATTACK trigger: ${attackTriggers[0]!.text}`
      : `Resolve ${formatTriggerCount(attackTriggers)} before moving to the defensive step`;
  }
  if (attack.step === "defensive") {
    return attack.kind === "direct"
      ? "Pass defense and let the attack reach the steal step"
      : "Pass defense and move to the fight step";
  }
  if (attack.step === "fight") {
    return "Compare power and determine which units are defeated";
  }
  if (attack.step === "defeat") {
    const defeated = defeatedCardsText(matchState, attack, { fullNames: true });
    return defeated
      ? `Move ${defeated} to trash and finish the attack`
      : "Move defeated units to trash and finish the attack";
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
  if (attack.step === "offensive") {
    if (attackTriggers.length === 0) {
      return "Go to defense";
    }
    return attackTriggers.length === 1
      ? `Resolve ${attackTriggers[0]!.cardName}`
      : "Resolve effects";
  }
  if (attack.step === "defensive") {
    return attack.kind === "direct" ? "Let them steal" : "Start fight";
  }
  if (attack.step === "fight") {
    return "Compare power";
  }
  if (attack.step === "defeat") {
    const defeated = defeatedCardsText(matchState, attack, { fullNames: false });
    return defeated ? `Trash ${defeated}` : "Trash defeated";
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
}: {
  selectedMove: DirectCardMoveId | null;
  selectedSourceCardId?: string;
  inSetup: boolean;
  verbs: readonly VerbRow[];
}): ReactNode | null {
  if (inSetup) {
    return "Keep this hand or draw a fresh opening hand.";
  }

  if (selectedMove) {
    return selectedMoveMessage(selectedMove, selectedSourceCardId);
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
  return Math.min(1 + Math.floor(getEffectivePower(matchState, attackerId) / 10), rivalGigCount);
}

function defeatedCardsText(
  matchState: ReturnType<typeof useEngine>["matchState"],
  attack: AttackLabelState,
  { fullNames }: { fullNames: boolean },
): string | null {
  if (attack.kind !== "fight") {
    return null;
  }

  const attackerName = cardName(matchState, attack.attackerId, fullNames);
  const defenderName = cardName(matchState, attack.defenderId, fullNames);

  if (attack.fightResult === "attackerWins") {
    return defenderName;
  }
  if (attack.fightResult === "defenderWins") {
    return attackerName;
  }
  if (attack.fightResult === "mutual") {
    if (attackerName && defenderName) {
      return `${attackerName} + ${defenderName}`;
    }
    return attackerName ?? defenderName;
  }
  return null;
}

function cardName(
  matchState: ReturnType<typeof useEngine>["matchState"],
  cardId: unknown,
  fullName: boolean,
): string | null {
  const key = cardInstanceKey(cardId);
  if (!key) {
    return null;
  }
  const card = matchState.G.cardIndex[key];
  if (!card) {
    return null;
  }
  const def = defOf(card);
  const name = def.displayName ?? def.name;
  return fullName ? name : shortCardName(name);
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

function shortCardName(name: string): string {
  return name.split(" - ")[0]!.trim();
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
  const byId = new Map<string, { enabled: boolean }>();
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
    return [{ moveId: id, label, enabled: action.enabled }];
  });
}

function hasOnlyIdlePromptActions(verbs: readonly VerbRow[]): boolean {
  return verbs.length > 0 && verbs.every((verb) => verb.moveId === "passPhase");
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
      return "Choose a card to play";
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
          return `1 Copy from -> 2 Change${choice.payload.canDecline ? ", or pass" : ""}`;
        }
        const n = choice.payload.min ?? 1;
        const max = choice.payload.max ?? n;
        if (n === 0) {
          return `Up to ${max} target${max === 1 ? "" : "s"}${choice.payload.canDecline ? ", or pass" : ""}`;
        }
        return `${n} target${n === 1 ? "" : "s"} required${choice.payload.canDecline ? ", or pass" : ""}`;
      }
      if (choice.payload.type === "adjustGig") {
        const max = choice.payload.maxAmount ?? 0;
        return `Adjust the selected Gig by up to ${max}`;
      }
      return "Choose a target";
    }
    case "searchDeck":
      return `Choose ${searchDeckSelectionText(choice.payload.select)} from top ${
        choice.payload.lookCount
      }`;
    case "gainGig":
      return "Pick a gig die from the fixer area";
  }
  return "Awaiting input…";
}

function searchDeckSelectionText(
  select: Extract<
    NonNullable<ReturnType<typeof useNativePromptPresentation>["choice"]>,
    { type: "searchDeck" }
  >["payload"]["select"],
): string {
  switch (select.kind) {
    case "all":
      return "all matches";
    case "exact":
      return `${select.amount}`;
    case "upTo":
      return `up to ${select.max}`;
  }
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
