import { usePromptSkin } from "../Prompt/PromptSkin";
import confirmationSkin from "../Prompt/PromptConfirmationSkin.module.css";
import { getVisibleAttackStep, visibleAttackStep } from "../../engine/attackPresentation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Popover } from "@mantine/core";
import { IconArrowsMaximize, IconKeyboard, IconX } from "@tabler/icons-react";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import {
  AnimatedEntityCollection,
  AnimatedEntityNode,
  ClockReadout,
  PendingResolutionCards,
  type PendingResolutionCard,
  useAnimationNode,
} from "@tcg/simulator-ui";
import {
  bothFixerAreasEmpty,
  defOf,
  getProjectedDirectAttackGigStealCount,
  isValidGigCopyPair,
  turnsUntilOvertime,
  type CardInstance,
  type ChoicePrompt,
  type MatchState,
} from "@tcg/cyberpunk-engine";
import { DIE_MAX_VALUES, type Ability, type CardType } from "@tcg/cyberpunk-types";
import {
  buildInteractionSubmissionForActionId,
  type EngineInteractionView,
  type EntitySelectionInput,
} from "@tcg/protocol";
import { useGameState } from "./gameStateContext";
import { useGameClock } from "./useGameClock";
import { ZoneBadge } from "./ZoneBadge";
import { DieDisplay } from "./DieDisplay";
import {
  interactionSubmissionToEngineAction,
  otherSide,
  PLAYER_SIDE_TO_ID,
  useEngine,
  useEngineInteractionView,
  useEngineOptional,
  useCardView,
  useSideZones,
  WIN_GIG_THRESHOLD,
  type CardActiveEffectView,
  type GigDieView,
  type MoveLogEntry,
  type Side,
} from "../../engine";
import {
  interactionViewCanAttackRival,
  interactionViewHasAttackers,
  interactionViewHasBlockers,
} from "../../engine/interactionViewHelpers";
import { CARD_BACK, CardImage } from "./CardImage";
import { useDragDrop } from "./DragDropContext";
import { useMoveSelection } from "./MoveSelectionContext";
import { useZoneDroppable } from "./useZoneDroppable";
import { useResolvingProgramVisuals } from "../../animation";
import { showBlockedPassTurnNotification } from "../blockedPassFeedback";
import {
  announceSkipBlockConfirmation,
  SKIP_BLOCK_CONFIRMATION_EVENT,
  type SkipBlockConfirmationEventDetail,
} from "../skipBlockConfirmation";
import { buildAdjustGigOptions } from "../adjustGigOptions";
import { compareGigStats, computeGigSideStats, type GigHelperComparison } from "./gigStats";
import {
  StreetCredHelperPopover,
  StreetCredStarIcon,
  useStreetCredHelper,
} from "./StreetCredHelper";
import type { Phase } from "./gameStateTypes";
import classes from "./CenterRow.module.css";
import { soldCardImageUrl } from "./useLastSoldCard";

const GIG_LOG_HOVER_EVENT = "cyberpunk:gig-log-hover";
const GIG_COPY_SOURCE_EVENT = "cyberpunk:gig-copy-source";

function OvertimeStatus({ matchState }: { matchState: MatchState }) {
  if (matchState.G.gamePhase === "setup" || matchState.G.gameEnded) return null;

  const active = matchState.G.overtime;
  if (!active && !bothFixerAreasEmpty(matchState)) return null;
  const turns = active ? 0 : turnsUntilOvertime(matchState);
  return (
    <div
      className={classes.overtimeStatus}
      data-active={active ? "true" : "false"}
      data-testid="overtime-status"
      role="status"
      aria-label={
        active
          ? "Overtime active. Seven Gigs win immediately."
          : `Overtime can start in ${turns} ${turns === 1 ? "turn" : "turns"} if both Fixer areas stay empty.`
      }
    >
      <span className={classes.overtimeStatusLabel}>OVERTIME</span>
      <strong className={classes.overtimeStatusValue}>
        {active ? "7 GIGS WIN" : `IN ${turns} ${turns === 1 ? "TURN" : "TURNS"}`}
      </strong>
    </div>
  );
}
const PHASE_ADVANCE_HOTKEY = "Space";

export interface LastSoldCard {
  id: number;
  cardId: string;
  cardName: string;
  side: Side;
}

interface GigDiePopoverState {
  dieId: string;
  side: "rival" | "friendly";
  text: string;
  rect: DOMRect;
  pinned: boolean;
  correction?: boolean;
}

function GigDieCell({
  die,
  side,
  selectionActive,
  interactive,
  selected,
  selectionHint,
  logHighlighted,
  onClick,
  popoverOpen,
  onPopoverOpen,
  onPopoverClose,
  correctionEnabled = false,
}: {
  die: GigDieView;
  side: "rival" | "friendly";
  selectionActive: boolean;
  interactive: boolean;
  selected?: boolean;
  selectionHint?: GigSelectionHint;
  logHighlighted?: boolean;
  onClick?: (dieId: string) => void;
  popoverOpen?: boolean;
  onPopoverOpen?: (state: GigDiePopoverState) => void;
  onPopoverClose?: (dieId: string, pinned?: boolean) => void;
  correctionEnabled?: boolean;
}) {
  const dieRef = useRef<HTMLElement | null>(null);
  const className = `${classes.gigDie} ${classes[side]}`;
  const baseLabel = selectionHint
    ? `${selectionHint.ariaLabel} ${die.label}, showing ${die.faceValue}`
    : interactive
      ? `Select ${die.label}, showing ${die.faceValue}`
      : `${die.label}, showing ${die.faceValue}`;
  const ariaLabel = selected
    ? selectionHint
      ? `${selectionHint.ariaLabel} ${die.label} selected, showing ${die.faceValue}`
      : `${die.label} selected, showing ${die.faceValue}`
    : baseLabel;
  const tooltip = selectionHint
    ? `${selectionHint.tooltip} · ${die.label} · rolled ${die.faceValue}`
    : `${die.label} · rolled ${die.faceValue}`;
  const commonProps = {
    className,
    "aria-label": ariaLabel,
    "data-tooltip": tooltip,
    "data-testid": "gig-die",
    "data-die-type": die.dieType,
    "data-die-id": die.id,
    "data-sim-entity-id": die.id,
    "data-face": die.faceValue,
    "data-selection-active": selectionActive ? "true" : "false",
    "data-interactive": interactive ? "true" : "false",
    "data-selected": selected ? "true" : "false",
    "data-selection-role": selectionHint?.role,
    "data-log-highlight": logHighlighted ? "true" : "false",
    "data-popover-open": popoverOpen ? "true" : "false",
    "data-board-correction": correctionEnabled ? "on" : undefined,
  };
  const openPopover = useCallback(
    (pinned: boolean) => {
      const rect = dieRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }
      onPopoverOpen?.({ dieId: die.id, side, text: tooltip, rect, pinned });
    },
    [die.id, onPopoverOpen, side, tooltip],
  );
  const closeHoverPopover = useCallback(() => {
    onPopoverClose?.(die.id, false);
  }, [die.id, onPopoverClose]);
  const handleClick = useCallback(() => {
    if (interactive && !correctionEnabled) {
      onPopoverClose?.(die.id, false);
    } else {
      openPopover(true);
    }
    onClick?.(die.id);
  }, [correctionEnabled, die.id, interactive, onClick, onPopoverClose, openPopover]);
  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      handleClick();
    },
    [handleClick],
  );
  const hoverProps = {
    onMouseEnter: () => openPopover(false),
    onMouseLeave: closeHoverPopover,
    onFocus: () => openPopover(false),
    onBlur: closeHoverPopover,
  };
  const content = (
    <span
      ref={dieRef}
      data-testid="card"
      data-card-kind="die"
      data-entity-id={die.id}
      data-sim-entity-id={die.id}
      data-face={die.faceValue}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-hidden
    >
      <DieDisplay
        dieType={die.dieType}
        faceValue={die.faceValue}
        label={die.label}
        side={side}
        size="md"
      />
    </span>
  );

  return (
    <AnimatedEntityNode
      entityId={die.id}
      zoneRef={{ kind: "zone", id: side === "friendly" ? "p-gigArea" : "opp-gigArea" }}
      density="mini"
      {...commonProps}
      {...hoverProps}
      tabIndex={0}
      role="button"
      aria-disabled={correctionEnabled ? undefined : !interactive || !onClick}
      aria-pressed={interactive && onClick ? selected : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {content}
    </AnimatedEntityNode>
  );
}

type GigSelectionPrompt = {
  title: string;
  progress: string;
  remaining: string;
};

function MobileLedgerMiniGigs({
  tone,
  streetCred,
  dice,
  onOpen,
}: {
  tone: "rival" | "friendly";
  streetCred: number;
  dice: readonly GigDieView[];
  onOpen: () => void;
}) {
  const label = tone === "rival" ? "Rival" : "Your";
  return (
    <button
      type="button"
      className={classes.mobileLedgerGigMiniRail}
      data-tone={tone}
      aria-label={`Show ${label.toLowerCase()} Gigs: ${dice.length} dice, ${streetCred} Street Cred`}
      onClick={onOpen}
    >
      <span className={classes.mobileLedgerGigMiniCred} aria-hidden="true">
        <StreetCredStarIcon size={14} />
        <strong>{streetCred}</strong>
      </span>
      <span className={classes.mobileLedgerGigMiniDice} aria-hidden="true">
        {[...dice].sort(compareGigDiceByFaces).map((die) => (
          <span
            key={die.id}
            className={classes.mobileLedgerGigMiniDie}
            data-die-type={die.dieType}
            title={`${die.label}, showing ${die.faceValue}`}
          >
            {die.faceValue}
          </span>
        ))}
      </span>
    </button>
  );
}

function GigDiePopover({
  state,
  compact,
  ownerSide,
  die,
}: {
  state: GigDiePopoverState | null;
  compact: boolean;
  ownerSide?: Side;
  die?: GigDieView;
}) {
  if (!state || typeof document === "undefined" || typeof window === "undefined") {
    return null;
  }

  const viewportPadding = 8;
  const maxWidth = compact ? 188 : 240;
  const estimatedWidth = Math.min(maxWidth, Math.max(118, state.text.length * 5.8));
  const preferredX = state.rect.left + state.rect.width / 2;
  const x = Math.min(
    window.innerWidth - viewportPadding - estimatedWidth / 2,
    Math.max(viewportPadding + estimatedWidth / 2, preferredX),
  );
  const placeBelow = state.side === "friendly";
  const y = placeBelow ? state.rect.bottom + 8 : state.rect.top - 8;
  const style = {
    "--gig-popover-x": `${x}px`,
    "--gig-popover-y": `${y}px`,
    "--gig-popover-max-w": `${maxWidth}px`,
  } as CSSProperties;

  const engine = useEngineOptional();
  const correction = Boolean(engine?.boardCorrectionEnabled && state.pinned && die && ownerSide);
  const max = die ? DIE_MAX_VALUES[die.dieType] : 1;
  const ownerId = ownerSide ? PLAYER_SIDE_TO_ID[ownerSide] : undefined;
  const rivalId = ownerSide ? PLAYER_SIDE_TO_ID[otherSide(ownerSide)] : undefined;

  return createPortal(
    <div
      className={`${classes.gigDiePopover} ${classes[state.side]} ${
        correction ? classes.gigCorrectionMenu : ""
      }`}
      data-placement={placeBelow ? "bottom" : "top"}
      data-compact={compact ? "true" : "false"}
      data-testid={correction ? "gig-correction-menu" : undefined}
      role={correction ? "menu" : "tooltip"}
      style={style}
    >
      {state.text}
      {correction && die && ownerId && rivalId && engine ? (
        <div className={classes.gigCorrectionActions}>
          <button
            type="button"
            disabled={die.faceValue <= 1}
            onClick={() =>
              engine.dispatch({
                type: "manualSetGigValue",
                dieId: die.id,
                value: die.faceValue - 1,
                as: ownerId,
              })
            }
          >
            −
          </button>
          <button
            type="button"
            disabled={die.faceValue >= max}
            onClick={() =>
              engine.dispatch({
                type: "manualSetGigValue",
                dieId: die.id,
                value: die.faceValue + 1,
                as: ownerId,
              })
            }
          >
            +
          </button>
          <button
            type="button"
            onClick={() =>
              engine.dispatch({
                type: "manualMoveGig",
                dieId: die.id,
                toPlayerId: rivalId,
                location: "gigArea",
                as: ownerId,
              })
            }
          >
            Give to rival
          </button>
          <button
            type="button"
            onClick={() =>
              engine.dispatch({
                type: "manualMoveGig",
                dieId: die.id,
                toPlayerId: ownerId,
                location: "fixerArea",
                as: ownerId,
              })
            }
          >
            Return to fixer
          </button>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}

function GigLane({
  label,
  side,
  ownerSide,
  gridClass,
  badgeClass,
  badgePosition,
  dice,
  streetCred,
  helper,
  interactive,
  interactiveDieIds,
  selectedDieIds,
  selectionPrompt,
  logHighlightedDieId,
  adjustChoice,
  scoreVariant = "full",
  showScore = true,
  showSummary = false,
  directAttackDropSurface = false,
  directAttackDropTarget = false,
  selectionHintForDie,
  onDieClick,
  onAdjustGig,
}: {
  label: string;
  side: "rival" | "friendly";
  ownerSide: Side;
  gridClass: string;
  badgeClass: string;
  badgePosition: "top" | "bottom";
  dice: GigDieView[];
  streetCred: number;
  helper: GigHelperComparison;
  interactive: boolean;
  interactiveDieIds?: ReadonlySet<string>;
  selectedDieIds?: ReadonlySet<string>;
  selectionPrompt?: GigSelectionPrompt;
  logHighlightedDieId?: string | null;
  adjustChoice?: AdjustGigControl | null;
  scoreVariant?: "full" | "compact";
  showScore?: boolean;
  showSummary?: boolean;
  directAttackDropSurface?: boolean;
  directAttackDropTarget?: boolean;
  selectionHintForDie?: (dieId: string) => GigSelectionHint | undefined;
  onDieClick?: (dieId: string) => void;
  onAdjustGig?: (value: number) => void;
}) {
  const gigCount = dice.length;
  const hasWinCondition = gigCount >= WIN_GIG_THRESHOLD;
  const ownStats = useMemo(() => computeGigSideStats(dice), [dice]);
  // Visual order only: smallest die type first, ties keep engine order.
  const orderedDice = useMemo(() => [...dice].sort(compareGigDiceByFaces), [dice]);
  const credHelper = useStreetCredHelper(side);
  const [diePopover, setDiePopover] = useState<GigDiePopoverState | null>(null);
  const compactScore = scoreVariant === "compact";
  const boardCorrectionEnabled = useEngineOptional()?.boardCorrectionEnabled === true;
  const directAttackDrop = useZoneDroppable(directAttackDropSurface ? "opp-gigArea" : null);
  const gigZoneId = ownerSide === "opponent" ? "opp-gigArea" : "p-gigArea";
  const setAnimationZoneRef = useAnimationNode(
    { kind: "zone", id: gigZoneId, ownerId: String(PLAYER_SIDE_TO_ID[ownerSide]) },
    { zoneId: gigZoneId, density: "normal", presence: "present" },
  );
  const setGigLaneRef = useCallback(
    (node: HTMLDivElement | null) => {
      directAttackDrop.setNodeRef(node);
      setAnimationZoneRef(node);
    },
    [directAttackDrop.setNodeRef, setAnimationZoneRef],
  );
  const handlePopoverClose = useCallback((dieId: string, pinned = false) => {
    setDiePopover((current) =>
      current?.dieId === dieId && current.pinned === pinned ? null : current,
    );
  }, []);

  useEffect(() => {
    if (!boardCorrectionEnabled) {
      setDiePopover(null);
    }
  }, [boardCorrectionEnabled]);

  // A pinned popover snapshots the die's face and position; close it when the
  // die it describes changes value or leaves the lane so it never goes stale.
  // The board-correction menu is exempt — its buttons act on the live die and
  // are meant to survive consecutive ± clicks.
  const pinnedPopoverDie = useMemo(
    () => (diePopover ? (orderedDice.find((die) => die.id === diePopover.dieId) ?? null) : null),
    [diePopover, orderedDice],
  );
  const pinnedPopoverFaceRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!diePopover?.pinned) {
      pinnedPopoverFaceRef.current = undefined;
      return;
    }
    if (!pinnedPopoverDie) {
      if (!boardCorrectionEnabled) {
        setDiePopover(null);
      }
      return;
    }
    if (pinnedPopoverFaceRef.current === undefined) {
      pinnedPopoverFaceRef.current = pinnedPopoverDie.faceValue;
      return;
    }
    if (pinnedPopoverFaceRef.current !== pinnedPopoverDie.faceValue) {
      pinnedPopoverFaceRef.current = pinnedPopoverDie.faceValue;
      if (!boardCorrectionEnabled) {
        setDiePopover(null);
      }
    }
  }, [boardCorrectionEnabled, diePopover?.pinned, pinnedPopoverDie]);

  useEffect(() => {
    if (!diePopover?.pinned) {
      return;
    }

    const close = () => setDiePopover(null);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    window.addEventListener("pointerdown", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [diePopover?.pinned]);

  return (
    <div
      ref={setGigLaneRef}
      className={`${classes.cell} ${gridClass} ${classes.gigLane} ${
        directAttackDropTarget ? classes.gigLaneDirectAttackTarget : ""
      } ${directAttackDrop.isOver ? classes.gigLaneDirectAttackOver : ""}`}
      data-testid="gig-row"
      data-zone-id={ownerSide === "opponent" ? "opp-gigArea" : "p-gigArea"}
      data-sim-zone-id={ownerSide === "opponent" ? "opp-gigArea" : "p-gigArea"}
      data-side={ownerSide}
      data-count={gigCount}
      data-empty={gigCount === 0 ? "true" : "false"}
      data-street-cred={streetCred}
      data-win-condition={hasWinCondition ? "true" : "false"}
      data-selection-active={interactive ? "true" : "false"}
      data-drop-hint={directAttackDropTarget ? "attackRival" : undefined}
      data-drop-zone={directAttackDropTarget ? "opp-gigArea" : undefined}
      aria-label={`${label}: ${gigCount} Gigs, ${streetCred} Street Cred, ${ownStats.minCount} min, ${ownStats.maxCount} max, ${ownStats.pairs} value-pair${ownStats.pairs === 1 ? "" : "s"}${hasWinCondition ? ", win condition active" : ""}`}
    >
      {directAttackDropTarget ? (
        <div className={classes.gigLaneAttackDropCue} aria-hidden="true">
          <span>Drop</span>
          <strong>Attack Rival</strong>
        </div>
      ) : null}
      {showScore ? (
        <div className={classes.gigScore} data-score-variant={scoreVariant}>
          <button
            type="button"
            ref={credHelper.chipRef}
            className={classes.gigCred}
            data-sim-anchor-id={ownerSide === "opponent" ? "opp-street-cred" : "p-street-cred"}
            aria-label={`Open ${label} Gig breakdown, ${streetCred} Street Cred`}
            {...credHelper.chipHandlers}
          >
            <span aria-hidden="true">{scoreVariant === "compact" ? "SC" : "Street Cred"}</span>
            <strong>{streetCred}</strong>
          </button>
          {hasWinCondition ? (
            <span
              className={classes.gigWinMarker}
              data-testid="gig-win-condition"
              aria-hidden="true"
            >
              {WIN_GIG_THRESHOLD}+ Gigs
            </span>
          ) : null}
        </div>
      ) : null}
      {selectionPrompt ? (
        <div
          className={classes.gigSelectionPrompt}
          data-testid="gig-selection-prompt"
          aria-live="polite"
        >
          <span className={classes.gigSelectionTitle}>{selectionPrompt.title}</span>
          <strong>{selectionPrompt.progress}</strong>
          <span className={classes.gigSelectionRemaining}>{selectionPrompt.remaining}</span>
        </div>
      ) : null}
      <div className={classes.gigTrack}>
        <div className={classes.gigInner}>
          <AnimatedEntityCollection>
            {orderedDice.map((die) => {
              const showAdjustPanel = adjustChoice?.dieId === die.id;
              return (
                <Popover
                  key={die.id}
                  opened={showAdjustPanel}
                  position={side === "friendly" ? "bottom" : "top"}
                  offset={12}
                  withinPortal
                  withArrow
                  arrowSize={8}
                  zIndex={2400}
                  middlewares={{ flip: true, shift: { padding: 8 } }}
                  classNames={{
                    dropdown: classes.adjustPanel,
                    arrow: classes.adjustPanelArrow,
                  }}
                >
                  <Popover.Target>
                    <div
                      className={classes.gigDieAnchor}
                      data-testid="gig-die-anchor"
                      data-die-id={die.id}
                    >
                      <GigDieCell
                        die={die}
                        side={side}
                        selectionActive={interactive}
                        interactive={
                          interactive && (!interactiveDieIds || interactiveDieIds.has(die.id))
                        }
                        selected={selectedDieIds?.has(die.id)}
                        selectionHint={
                          interactive && (!interactiveDieIds || interactiveDieIds.has(die.id))
                            ? selectionHintForDie?.(die.id)
                            : undefined
                        }
                        logHighlighted={logHighlightedDieId === die.id}
                        onClick={onDieClick}
                        correctionEnabled={boardCorrectionEnabled}
                        popoverOpen={diePopover?.dieId === die.id}
                        onPopoverOpen={(state) =>
                          setDiePopover({
                            ...state,
                            correction: boardCorrectionEnabled && state.pinned,
                          })
                        }
                        onPopoverClose={handlePopoverClose}
                      />
                    </div>
                  </Popover.Target>
                  {showAdjustPanel ? (
                    <GigAdjustPanel choice={adjustChoice} onAdjustGig={onAdjustGig} />
                  ) : null}
                </Popover>
              );
            })}
          </AnimatedEntityCollection>
          {gigCount === 0 ? <span className={classes.gigEmpty}>No Gigs</span> : null}
        </div>
      </div>
      <ZoneBadge position={badgePosition} className={badgeClass} label={label}>
        {label}
        <span className={classes.gigBadgeTotal} data-sim-value={gigCount}>
          {gigCount}
        </span>
        {showSummary && (
          <span className={classes.gigSummary} data-testid="gig-summary">
            <span title="Gigs at their lowest possible value" data-zero={ownStats.minCount === 0}>
              MIN <strong>{ownStats.minCount}</strong>
            </span>
            <span title="Gigs at their highest possible value" data-zero={ownStats.maxCount === 0}>
              MAX <strong>{ownStats.maxCount}</strong>
            </span>
            <span
              title="Pairs of equal-value Gigs. Each Gig counts in only one pair."
              data-zero={ownStats.pairs === 0}
            >
              PAIRS <strong>{ownStats.pairs}</strong>
            </span>
          </span>
        )}
        {showSummary && hasWinCondition ? (
          <span
            className={classes.gigThreatTag}
            data-testid="gig-win-threat-tag"
            title={`${WIN_GIG_THRESHOLD}+ Gigs win at the start of that player's turn — or immediately in overtime.`}
          >
            WIN THREAT
          </span>
        ) : null}
      </ZoneBadge>
      <GigDiePopover
        state={diePopover}
        compact={compactScore}
        ownerSide={ownerSide}
        die={dice.find((candidate) => candidate.id === diePopover?.dieId)}
      />
      <StreetCredHelperPopover state={credHelper.state} helper={helper} compact={compactScore} />
    </div>
  );
}

function GigAdjustPanel({
  choice,
  onAdjustGig,
}: {
  choice: AdjustGigControl;
  onAdjustGig?: (value: number) => void;
}) {
  const adjustmentOptions = buildAdjustGigOptions(choice);
  if (adjustmentOptions.length === 0) {
    return null;
  }

  return (
    <Popover.Dropdown
      data-testid="gig-adjust-panel"
      data-die-id={choice.dieId}
      aria-label={`Adjust ${choice.label}`}
    >
      <span className={classes.adjustTitle}>Adjust {choice.label}</span>
      <div className={classes.adjustChoices}>
        {adjustmentOptions.map((option) => (
          <button
            key={`${option.delta}:${option.value}`}
            type="button"
            className={classes.adjustButton}
            data-testid="gig-adjust-option"
            data-delta={option.delta}
            data-value={option.value}
            aria-label={option.label}
            onClick={() => onAdjustGig?.(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </Popover.Dropdown>
  );
}

function MobileLedgerRails({
  tone,
  streetCred,
  helper,
}: {
  tone: "friendly" | "rival";
  streetCred: number;
  helper: GigHelperComparison;
}) {
  const credHelper = useStreetCredHelper(tone);
  return (
    <>
      <button
        type="button"
        className={classes.mobileLedgerRail}
        data-kind="street-cred"
        data-edge="outer"
        data-sim-anchor-id={tone === "rival" ? "opp-street-cred" : "p-street-cred"}
        aria-label={`Show ${tone === "friendly" ? "your" : "rival"} Gig breakdown`}
        ref={(el) => {
          credHelper.chipRef.current = el;
        }}
        {...credHelper.chipHandlers}
      >
        <span className={classes.mobileLedgerRailSymbol} aria-hidden="true">
          <StreetCredStarIcon size={14} />
        </span>
        <strong>{streetCred}</strong>
      </button>
      <StreetCredHelperPopover state={credHelper.state} helper={helper} compact />
    </>
  );
}

function AttackStepStrip() {
  const { matchState, moveLogs } = useEngine();
  const attackSteps = matchState.G.attackState
    ? buildAttackPhaseSteps(matchState.G.attackState, moveLogs)
    : [];
  if (attackSteps.length === 0) return null;
  return (
    <div className={classes.phaseStrip} aria-label="Attack step">
      {attackSteps.map((step) => (
        <span
          key={step.label}
          className={`${classes.phaseStep} ${step.active ? classes.phaseActive : ""}`}
          aria-current={step.active ? "step" : undefined}
          data-step={step.id}
        >
          {step.label}
        </span>
      ))}
    </div>
  );
}

/**
 * Standalone clock display. Used inside CenterRow on desktop and inside the
 * top sticky strip on mobile. Reads the shared useGameClock + useGameState
 * so the displayed turn label and time stay in sync wherever it's mounted.
 */
export function ClockDisplay({
  compact = false,
  docked = false,
  combatSteps = false,
  overtimeBand = false,
}: {
  compact?: boolean;
  docked?: boolean;
  combatSteps?: boolean;
  /**
   * V2 mounts the clock on the left rail away from the center row, so it — not
   * the center plaque — carries the overtime state: a "7 GIGS WIN" band while
   * overtime runs and a turn countdown once both Fixer areas empty.
   */
  overtimeBand?: boolean;
}) {
  const { activeSide, prioritySide, turnNumber, phase, gameEnded, overtimeActive } = useGameState();
  const clock = useGameClock();
  const { humanSide, matchState } = useEngine();
  const rivalSide = otherSide(humanSide);
  const humanClock = clock[humanSide];
  const rivalClock = clock[rivalSide];
  const priorityLabel = prioritySide === humanSide ? "Your priority" : "Rival priority";
  const turnLabel = activeSide === humanSide ? "Your turn" : "Rival's turn";
  const showCombat = combatSteps && Boolean(matchState.G.attackState);
  const showOvertimeBand = overtimeBand && !gameEnded && matchState.G.gamePhase !== "setup";
  const overtimeCountdownTurns =
    showOvertimeBand && !overtimeActive && bothFixerAreasEmpty(matchState)
      ? turnsUntilOvertime(matchState)
      : null;
  const overtimeBandVisible =
    showOvertimeBand && (overtimeActive || overtimeCountdownTurns !== null);

  return (
    <div
      className={`${classes.clockInner} ${compact ? classes.clockCompact : ""} ${docked ? classes.clockDocked : ""} ${
        clock.active.urgent ? classes.clockUrgent : ""
      } ${clock.active.critical ? classes.clockCritical : ""}`}
      data-testid="phase-clock"
      data-turn={turnNumber}
      data-phase={phase}
      data-overtime={overtimeActive ? "true" : "false"}
      data-active-side={activeSide}
      data-clock-side={prioritySide}
      aria-label={`Turn ${turnNumber} ${phase}${overtimeActive ? ", overtime" : ""}. ${turnLabel} ${priorityLabel}. Rival clock ${rivalClock.time}. Your clock ${humanClock.time}.`}
    >
      {overtimeBandVisible ? (
        <div
          className={classes.clockOvertimeBand}
          data-testid="clock-overtime-band"
          data-state={overtimeActive ? "active" : "countdown"}
          data-turns={overtimeCountdownTurns ?? undefined}
          role="status"
          aria-label={
            overtimeActive
              ? "Overtime active. Seven Gigs win immediately."
              : `Overtime can start in ${overtimeCountdownTurns} ${
                  overtimeCountdownTurns === 1 ? "turn" : "turns"
                } if both Fixer areas stay empty.`
          }
        >
          <span className={classes.clockOvertimeBandLabel}>OVERTIME</span>
          <strong className={classes.clockOvertimeBandValue}>
            {overtimeActive
              ? "7 GIGS WIN"
              : `IN ${overtimeCountdownTurns} ${overtimeCountdownTurns === 1 ? "TURN" : "TURNS"}`}
          </strong>
        </div>
      ) : null}
      <div className={classes.clockMeta} data-testid="clock-meta">
        <span className={classes.clockLabel} data-testid="phase-turn">
          T{turnNumber}
        </span>
        {showCombat ? (
          <span
            className={classes.priorityChip}
            data-testid="priority-side-chip"
            data-tone={prioritySide === humanSide ? "friendly" : "rival"}
          >
            {priorityLabel}
          </span>
        ) : (
          <span className={classes.clockPhase} data-testid="phase-name">
            {phase}
          </span>
        )}
        {overtimeActive ? (
          <span className={classes.overtimeChip} data-testid="phase-overtime">
            Overtime
          </span>
        ) : null}
      </div>
      {!gameEnded && !showCombat ? (
        <div className={classes.clockChips} data-testid="clock-chips">
          <span
            className={classes.turnChip}
            data-testid="turn-side-chip"
            data-tone={activeSide === humanSide ? "friendly" : "rival"}
          >
            {turnLabel}
          </span>
          {prioritySide !== activeSide ? (
            <span
              className={classes.priorityChip}
              data-testid="priority-side-chip"
              data-tone={prioritySide === humanSide ? "friendly" : "rival"}
            >
              {priorityLabel}
            </span>
          ) : null}
        </div>
      ) : null}
      {showCombat ? (
        <div data-testid="clock-combat-steps">
          <AttackStepStrip />
        </div>
      ) : null}
      <div className={classes.clockFaces}>
        <ClockFace
          label="Rival"
          time={rivalClock.time}
          active={prioritySide === rivalSide}
          tone="rival"
          urgent={rivalClock.urgent}
          critical={rivalClock.critical}
        />
        <ClockFace
          label="You"
          time={humanClock.time}
          active={prioritySide === humanSide}
          tone="friendly"
          urgent={humanClock.urgent}
          critical={humanClock.critical}
        />
      </div>
    </div>
  );
}

function ClockFace({
  label,
  time,
  active,
  tone,
  urgent,
  critical,
}: {
  label: string;
  time: string;
  active: boolean;
  tone: "rival" | "friendly";
  urgent: boolean;
  critical: boolean;
}) {
  return (
    <ClockReadout
      label={label}
      value={time}
      active={active}
      urgency={critical ? "critical" : urgent ? "warning" : "normal"}
      tone={tone}
      className={classes.clockFace}
      data-urgent={urgent ? "true" : "false"}
      data-critical={critical ? "true" : "false"}
      data-sim-value={time}
      aria-hidden="true"
      valueClassName={classes.clockTime}
      valueTestId={active ? "phase-clock-time" : undefined}
    />
  );
}

/**
 * Phase label + advance CTA. Used inside CenterRow on desktop and inside the
 * bottom sticky strip on mobile.
 */
export function PassTurnControl({
  compact = false,
  docked = false,
  compactLabelStyle = "short",
  actionsOnly = false,
}: {
  compact?: boolean;
  docked?: boolean;
  compactLabelStyle?: "short" | "action";
  actionsOnly?: boolean;
}) {
  const promptSkin = usePromptSkin();
  const { phase, advancePhase, activeSide, prioritySide, gameEnded, overtimeActive } =
    useGameState();
  const { humanSide, matchState, dispatch, prompts } = useEngine();
  const humanInteractionView = useEngineInteractionView(humanSide);
  const disabledPassReason = disabledPassPhaseReason(humanInteractionView);
  const confirmTitleId = useId();
  const [pressed, setPressed] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<
    "pass-with-attackers" | "skip-block" | null
  >(null);
  const isPlayerTurn = activeSide === humanSide;
  const attackInProgress = Boolean(matchState.G.attackState);
  const isAttackerDuringReactStep =
    attackInProgress && matchState.G.attackState?.step === "react" && isPlayerTurn;
  const shouldConfirmPass =
    isPlayerTurn && !attackInProgress && interactionViewHasAttackers(humanInteractionView);
  const shouldConfirmSkipBlock =
    matchState.G.attackState?.step === "react" &&
    matchState.G.attackState.redirectedByBlocker !== true &&
    !isPlayerTurn &&
    interactionViewHasBlockers(humanInteractionView);
  const humanChoiceInProgress = humanInteractionView.status === "choosing";
  const isWaitingForRival = prioritySide !== humanSide;
  const controlsDisabled =
    phase === "SETUP" ||
    phase === "START" ||
    gameEnded ||
    humanChoiceInProgress ||
    disabledPassReason !== undefined ||
    isWaitingForRival ||
    isAttackerDuringReactStep ||
    (!isPlayerTurn && !attackInProgress);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attackStateRef = useRef(matchState.G.attackState);
  attackStateRef.current = matchState.G.attackState;

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
      controlsDisabled ||
      (pendingConfirmation === "pass-with-attackers" && !shouldConfirmPass) ||
      (pendingConfirmation === "skip-block" && !shouldConfirmSkipBlock)
    ) {
      if (pendingConfirmation === "skip-block") {
        announceSkipBlockConfirmation(false);
      } else {
        setPendingConfirmation(null);
      }
    }
  }, [controlsDisabled, pendingConfirmation, shouldConfirmPass, shouldConfirmSkipBlock]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const performAdvance = useCallback(() => {
    setPressed(true);
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setPressed(false);
      timerRef.current = null;
    }, 320);
    advancePhase();
  }, [advancePhase]);

  const handleAdvance = useCallback(() => {
    if (controlsDisabled) {
      if (disabledPassReason) {
        showBlockedPassTurnNotification(disabledPassReason);
      }
      return;
    }
    if (attackInProgress) {
      const attack = attackStateRef.current;
      if (!attack) return;

      // During the react step, only the defender (rival / non-active player)
      // may resolve. The active player must wait for the defender's response.
      if (attack.step === "react") {
        if (isPlayerTurn) {
          // Attacker cannot act during the defender's response window.
          return;
        }
        if (shouldConfirmSkipBlock) {
          if (pendingConfirmation === "skip-block") {
            announceSkipBlockConfirmation(false);
            dispatch({
              type: "resolveAttack",
              pass: true,
              as: PLAYER_SIDE_TO_ID[humanSide],
            });
            return;
          }
          announceSkipBlockConfirmation(true);
          return;
        }
        dispatch({
          type: "resolveAttack",
          pass: true,
          as: PLAYER_SIDE_TO_ID[humanSide],
        });
        return;
      }

      // Attack, fight, and steal steps are all resolved by the
      // active player (the attacker).
      dispatch({
        type: "resolveAttack",
        as: PLAYER_SIDE_TO_ID[activeSide],
      });
      return;
    }
    if (shouldConfirmPass) {
      setPendingConfirmation("pass-with-attackers");
      return;
    }
    performAdvance();
  }, [
    activeSide,
    attackInProgress,
    controlsDisabled,
    disabledPassReason,
    dispatch,
    humanSide,
    pendingConfirmation,
    performAdvance,
    shouldConfirmPass,
    shouldConfirmSkipBlock,
  ]);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (
        ev.altKey ||
        ev.ctrlKey ||
        ev.metaKey ||
        ev.shiftKey ||
        ev.defaultPrevented ||
        pendingConfirmation !== null ||
        (ev.key !== " " && ev.code !== PHASE_ADVANCE_HOTKEY)
      ) {
        return;
      }
      if (isKeyboardInputTarget(ev.target)) {
        return;
      }
      ev.preventDefault();
      ev.stopPropagation();
      handleAdvance();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [handleAdvance, pendingConfirmation]);

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
      if (ev.key === " " || ev.code === PHASE_ADVANCE_HOTKEY) {
        ev.preventDefault();
        ev.stopPropagation();
        const confirmation = pendingConfirmation;
        if (confirmation === "skip-block") {
          announceSkipBlockConfirmation(false);
          dispatch({
            type: "resolveAttack",
            pass: true,
            as: PLAYER_SIDE_TO_ID[humanSide],
          });
        } else {
          setPendingConfirmation(null);
          performAdvance();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [dispatch, humanSide, pendingConfirmation, performAdvance]);

  const label = isWaitingForRival ? "WAITING" : phaseAdvanceLabel(phase, attackInProgress);
  const confirmingSkipBlock = pendingConfirmation === "skip-block";
  const compactLabel = confirmingSkipBlock
    ? "Are you sure?"
    : shouldConfirmSkipBlock
      ? "SKIP"
      : isWaitingForRival
        ? "WAITING"
        : compactPhaseAdvanceLabel(phase, attackInProgress);
  const compactActionLabel = confirmingSkipBlock
    ? "Are you sure?"
    : shouldConfirmSkipBlock
      ? "Skip block"
      : isWaitingForRival
        ? "WAITING"
        : dockedPhaseAdvanceLabel(phase, attackInProgress);
  const pendingChoiceLabel = pendingChoiceActionLabel(prompts[humanSide].choice);
  const visibleLabel = confirmingSkipBlock
    ? "Are you sure?"
    : shouldConfirmSkipBlock
      ? compact || docked
        ? "Skip block"
        : "SKIP BLOCK"
      : docked && humanChoiceInProgress
        ? pendingChoiceLabel
        : docked
          ? compactActionLabel
          : label;
  const advanceAriaLabel = isWaitingForRival
    ? "Waiting for Rival"
    : (disabledPassReason ?? visibleLabel);
  const usesActionCompactLabel = compact && compactLabelStyle === "action";
  const attackTargetSummary = useAttackTargetSummary(matchState, matchState.G.attackState);
  const attackTarget = docked ? null : attackTargetSummary;
  const showPhaseLabel = !actionsOnly && !(docked && humanChoiceInProgress);
  const phaseText = docked
    ? dockedPhaseLabel(phase, matchState.G.attackState)
    : phaseLabel(phase, matchState.G.attackState);

  return (
    <div
      className={`${classes.passInner} ${compact ? classes.passCompact : ""} ${docked ? classes.passDocked : ""} ${actionsOnly ? classes.passActionsOnly : ""}`}
      data-testid="phase-hud"
      data-phase={phase}
      data-overtime={overtimeActive ? "true" : "false"}
      data-active-side={activeSide}
      data-attack-in-progress={attackInProgress ? "true" : "false"}
      data-choice-in-progress={humanChoiceInProgress ? "true" : "false"}
      data-waiting-for-rival={isWaitingForRival ? "true" : "false"}
    >
      {showPhaseLabel ? (
        <span
          className={`${classes.phaseLabel} ${attackTarget ? classes.phaseLabelWithTarget : ""}`}
          data-testid="phase-hud-label"
        >
          {overtimeActive ? (
            <span className={classes.overtimeChip} data-testid="phase-hud-overtime">
              Overtime
            </span>
          ) : null}
          <span>{phaseText}</span>
          {attackTarget ? (
            <span
              className={classes.phaseAttackTarget}
              data-testid="attack-target-summary"
              data-attack-kind={attackTarget.kind}
              aria-label={attackTarget.ariaLabel}
              title={attackTarget.title}
            >
              <span className={classes.phaseAttackTargetLabel}>Target</span>
              <strong>{attackTarget.value}</strong>
              {attackTarget.stealCount !== undefined ? (
                <span
                  className={classes.phaseStealCount}
                  data-testid="phase-direct-attack-steal-count"
                  aria-label={`If unblocked, steal ${formatGigCount(attackTarget.stealCount)}`}
                >
                  Steal {attackTarget.stealCount}
                </span>
              ) : null}
            </span>
          ) : null}
        </span>
      ) : null}
      {!actionsOnly ? <AttackStepStrip /> : null}
      <span
        className={`${classes.passActionSlot} ${disabledPassReason ? classes.blockedPassHitTarget : ""}`}
        data-testid={disabledPassReason ? "phase-advance-hit-target" : undefined}
        title={disabledPassReason}
        onClick={disabledPassReason ? handleAdvance : undefined}
      >
        <button
          type="button"
          aria-label={advanceAriaLabel}
          title={disabledPassReason}
          data-testid="phase-advance"
          data-phase={phase}
          data-attack-in-progress={attackInProgress ? "true" : "false"}
          data-confirming-skip-block={confirmingSkipBlock ? "true" : undefined}
          className={`${classes.passBtn} ${pressed ? classes.active : ""} ${compact ? classes.passBtnCompact : ""} ${docked ? classes.passBtnDocked : ""} ${(compact || docked) && isPlayerTurn && !controlsDisabled ? classes.passBtnReady : ""}`}
          onClick={handleAdvance}
          disabled={controlsDisabled}
          aria-keyshortcuts={PHASE_ADVANCE_HOTKEY}
        >
          {usesActionCompactLabel ? (
            <>
              <span>{compactActionLabel}</span>
              {!isWaitingForRival ? <HotkeyHint block /> : null}
            </>
          ) : compact ? (
            <>
              <span>{compactLabel}</span>
              {!isWaitingForRival ? <HotkeyHint /> : null}
              {!isWaitingForRival ? (
                <span aria-hidden="true" className={classes.passChevron}>
                  ›
                </span>
              ) : null}
            </>
          ) : (
            <>
              <span>{visibleLabel}</span>
              {!isWaitingForRival ? <HotkeyHint /> : null}
            </>
          )}
        </button>
      </span>
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
                    data-testid="pass-confirm-cancel"
                    aria-keyshortcuts="Escape"
                    onClick={() => setPendingConfirmation(null)}
                  >
                    <span>Keep attacking</span>
                    <DialogHotkeyHint label="Esc" />
                  </button>
                  <button
                    type="button"
                    className={classes.confirmPrimary}
                    data-testid="pass-confirm-submit"
                    aria-keyshortcuts="Space"
                    onClick={() => {
                      setPendingConfirmation(null);
                      performAdvance();
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
    </div>
  );
}

function HotkeyHint({ block = false }: { block?: boolean }) {
  return (
    <kbd
      className={`${classes.phaseHotkey} ${block ? classes.phaseHotkeyBlock : ""}`}
      aria-label="Spacebar hotkey"
    >
      <IconKeyboard size={12} stroke={2.2} aria-hidden="true" />
      <span>Space</span>
    </kbd>
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

export function MobileSellReveal({
  sale,
  card,
  opponent,
}: {
  sale: LastSoldCard | null;
  card?: { imageUrl?: string; name?: string } | null;
  opponent: boolean;
}) {
  const [visibleSale, setVisibleSale] = useState<LastSoldCard | null>(null);
  const lastAnimatedSaleIdRef = useRef<number | null>(null);
  const saleId = sale?.id ?? null;
  const saleCardId = sale?.cardId ?? "";
  const saleCardName = sale?.cardName ?? "";
  const saleSide = sale?.side ?? "player";

  useEffect(() => {
    if (saleId === null || saleId === lastAnimatedSaleIdRef.current) {
      return;
    }
    lastAnimatedSaleIdRef.current = saleId;
    setVisibleSale({
      id: saleId,
      cardId: saleCardId,
      cardName: saleCardName,
      side: saleSide,
    });
    const timer = window.setTimeout(() => setVisibleSale(null), 820);
    return () => window.clearTimeout(timer);
  }, [saleCardId, saleCardName, saleId, saleSide]);

  if (!visibleSale) {
    return null;
  }

  return (
    <div
      key={visibleSale.id}
      className={classes.sellRevealTrack}
      data-side={opponent ? "opponent" : "player"}
      data-testid="mobile-sell-reveal"
      aria-live="polite"
      aria-label={`${opponent ? "Rival" : "You"} sold ${visibleSale.cardName}`}
    >
      <div className={classes.sellRevealCard}>
        <CardImage
          imageUrl={card?.imageUrl ?? soldCardImageUrl(visibleSale.cardName) ?? CARD_BACK}
          alt={card?.name ?? visibleSale.cardName}
          disablePreview
        />
      </div>
    </div>
  );
}

export function MobileClockRail() {
  const { prioritySide, turnNumber, phase, gameEnded } = useGameState();
  const clock = useGameClock();
  const { humanSide } = useEngine();
  const rivalSide = otherSide(humanSide);
  const rivalClock = clock[rivalSide];
  const humanClock = clock[humanSide];

  return (
    <div
      className={`${classes.mobileClockRail} ${clock.active.urgent ? classes.mobileClockRailUrgent : ""} ${
        clock.active.critical ? classes.mobileClockRailCritical : ""
      }`}
      aria-label={`Turn ${turnNumber} ${phase} priority clock. Rival ${rivalClock.time}. You ${humanClock.time}.`}
    >
      <ClockPill
        ariaLabel="Rival clock"
        time={rivalClock.time}
        active={prioritySide === rivalSide}
        tone="rival"
      />
      <div className={classes.clockCore} aria-hidden="true">
        <span>T{turnNumber}</span>
        <strong>{phase}</strong>
      </div>
      <ClockPill
        ariaLabel="Your clock"
        time={humanClock.time}
        active={prioritySide === humanSide}
        tone="friendly"
      />
    </div>
  );
}

function ClockPill({
  ariaLabel,
  time,
  active,
  tone,
}: {
  ariaLabel: string;
  time: string;
  active: boolean;
  tone: "rival" | "friendly";
}) {
  return (
    <div
      className={classes.clockPill}
      data-active={active ? "true" : "false"}
      data-tone={tone}
      aria-label={`${ariaLabel} ${time}${active ? ", active" : ""}`}
    >
      <strong>{time}</strong>
    </div>
  );
}

export function MobileDirectAttackDropTarget() {
  const drop = useZoneDroppable("opp-pinfo");
  const { activeSource } = useDragDrop();
  const engine = useEngineOptional();
  const interactionView = useEngineInteractionView(engine?.humanSide ?? "player");
  const active =
    activeSource?.zone === "p-field" &&
    activeSource.cardId &&
    interactionViewCanAttackRival(interactionView, activeSource.cardId);

  return (
    <div
      ref={drop.setNodeRef}
      className={classes.directAttackDropTarget}
      data-active={active ? "true" : "false"}
      data-over={drop.isOver ? "true" : "false"}
      data-drop-zone="opp-pinfo"
      data-drop-surface="rival-gigs"
      aria-hidden="true"
    >
      <div className={classes.directAttackDropCue}>
        <span>Steal</span>
        <strong>Rival Gigs</strong>
      </div>
    </div>
  );
}

function isKeyboardInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return Boolean(
    target.closest(
      "input, textarea, select, button, a, [role='button'], [role='menuitem'], [contenteditable='true']",
    ),
  );
}

function useAttackTargetSummary(
  state: MatchState,
  attack: {
    attackerId?: unknown;
    defenderId?: unknown;
    kind?: string;
    redirectedByBlocker?: boolean;
  } | null,
): {
  kind: "direct" | "fight";
  value: string;
  ariaLabel: string;
  title: string;
  stealCount?: number;
} | null {
  const attacker = useCardView(cardIdFromAttack(attack?.attackerId));
  const defender = useCardView(cardIdFromAttack(attack?.defenderId));

  if (!attack?.kind) {
    return null;
  }

  if (attack.kind === "direct") {
    const stealCount = getProjectedDirectAttackGigStealCount(state, state.G.attackState);
    return {
      kind: "direct",
      value: "Player",
      ariaLabel:
        stealCount === null
          ? "Attack target: player"
          : `Attack target: player. If unblocked, steal ${formatGigCount(stealCount)}`,
      title: attacker
        ? `${attacker.name} is attacking the rival directly${
            stealCount === null ? "" : ` and would steal ${formatGigCount(stealCount)} if unblocked`
          }`
        : "Attacking the rival",
      stealCount: stealCount ?? undefined,
    };
  }

  if (attack.kind === "fight") {
    return {
      kind: "fight",
      value: "Unit",
      ariaLabel: "Attack target: rival unit",
      title:
        attacker && defender
          ? `${attacker.name} is attacking ${defender.name}`
          : "Attacking a rival unit",
    };
  }

  return null;
}

function cardIdFromAttack(cardId: unknown): string | undefined {
  return typeof cardId === "string" ? cardId : undefined;
}

function formatGigCount(count: number): string {
  return `${count} Gig${count === 1 ? "" : "s"}`;
}

function disabledPassPhaseReason(
  view: ReturnType<typeof useEngineInteractionView>,
): string | undefined {
  const passPhase = view.actions.find((action) => action.id === "passPhase" && !action.enabled);
  const label = passPhase?.disabledText?.params?.label;
  return typeof label === "string" ? label : undefined;
}

function phaseAdvanceLabel(phase: string, attackInProgress: boolean): string {
  if (phase === "START") {
    return "START PHASE";
  }
  if (phase === "END") {
    return "GAME OVER";
  }
  if (attackInProgress) {
    return "RESOLVE ATTACK";
  }
  return "PASS TURN ›";
}

function compactPhaseAdvanceLabel(phase: string, attackInProgress: boolean): string {
  if (phase === "START") {
    return "ST";
  }
  if (phase === "END") {
    return "END";
  }
  if (attackInProgress) {
    return "...";
  }
  return "PASS";
}

function dockedPhaseAdvanceLabel(phase: string, attackInProgress: boolean): string {
  if (phase === "START") {
    return "Start";
  }
  if (phase === "END") {
    return "Over";
  }
  if (attackInProgress) {
    return "Resolve";
  }
  return "Pass";
}

type PendingChoice = ChoicePrompt;

function pendingChoiceActionLabel(choice: PendingChoice | null | undefined): string {
  if (!choice) {
    return "Resolve Prompt";
  }
  switch (choice.type) {
    case "chooseTrigger":
      return "Choose Trigger";
    case "chooseGigsToSteal":
      return choice.payload.count === 1 ? "Choose Gig" : "Choose Gigs";
    case "chooseTarget":
      return pendingTargetChoiceLabel(choice);
    case "chooseEffect":
      return "Choose Effect";
    case "preventGigSteal":
      return "Prevent Steal";
    case "chooseCardToPlay":
      return pendingCardToPlayLabel(choice);
    case "chooseCardToMove":
      return "Choose Card";
    case "scry":
      return "Search Deck";
    case "revealDestination":
      return "Choose Destination";
    case "gainGig":
      return "Gain Gig";
    case "redirectDefeat":
      return "Redirect Defeat";
    case "chooseSacrificialGear":
      return "Choose Gear";
    case "chooseFirstPlayer":
      return "Choose First Player";
  }
  return "Resolve Prompt";
}

function pendingCardToPlayLabel(
  choice: Extract<PendingChoice, { type: "chooseCardToPlay" }>,
): string {
  if (choice.payload.free && choice.payload.resolvedAttachToId) {
    return "Play Gear";
  }
  if (choice.payload.free) {
    return "Choose Free Card";
  }
  return "Choose Card";
}

function pendingTargetChoiceLabel(
  choice: Extract<PendingChoice, { type: "chooseTarget" }>,
): string {
  switch (choice.payload.type) {
    case "discardFromHand":
      return "Discard Card";
    case "adjustGig":
      return "Adjust Gig";
    case "effectTarget":
      return "Choose Target";
  }
  return "Choose Target";
}

function phaseLabel(phase: Phase, attackState: { step?: string } | null = null): string {
  switch (phase) {
    case "SETUP":
      return "SETUP PHASE";
    case "START":
      return "START PHASE";
    case "MAIN": {
      if (!attackState) return "MAIN PHASE";
      const step = visibleAttackStep(attackState.step);
      const suffix = step ? ` — ${step.toUpperCase()}` : " — ATTACK";
      return `MAIN PHASE${suffix}`;
    }
    case "END":
      return "GAME OVER";
    default: {
      const exhaustive: never = phase;
      return exhaustive;
    }
  }
}

function dockedPhaseLabel(phase: Phase, attackState: { step?: string } | null = null): string {
  if (phase !== "MAIN" || !attackState?.step) {
    return phaseLabel(phase, null);
  }
  return visibleAttackStep(attackState.step)?.toUpperCase() ?? "ATTACK";
}

function buildAttackPhaseSteps(
  attack: {
    attackerId?: unknown;
    defenderId?: unknown;
    kind?: string;
    step?: string;
  } | null,
  moveLogs: ReadonlyArray<MoveLogEntry>,
): { id: string; label: string; active: boolean }[] {
  if (!attack?.kind) {
    return [{ id: "declare", label: "Declare", active: true }];
  }

  const step = getVisibleAttackStep(attack, moveLogs);
  if (attack.kind === "direct") {
    return [
      { id: "attack", label: "Attack", active: step === "attack" },
      { id: "react", label: "React", active: step === "react" },
      { id: "steal", label: "Steal", active: step === "steal" },
    ];
  }

  return [
    { id: "attack", label: "Attack", active: step === "attack" },
    { id: "react", label: "React", active: step === "react" },
    { id: "fight", label: "Fight", active: step === "fight" },
  ];
}

interface CenterRowProps {
  /**
   * When true, only the rival/friendly gig cells render and they expand to
   * fill the full row. The mobile layout uses this and slots the clock and
   * pass-turn control into its top/bottom sticky bars instead.
   */
  gigsOnly?: boolean;
  /**
   * Desktop-only visual treatment for the central gig row. Keeps mobile strips
   * compact while letting the full board breathe between rival/friendly gigs.
   */
  spaciousGigs?: boolean;
  /** Show readable effect labels beside the source art in flat HUD layouts. */
  effectDetails?: boolean;
  /**
   * Portal target for the resolving-program display. Boards with a projected
   * 3D field plane pass a dedicated flat layer above the field so the card
   * reads as floating level with the viewer instead of lying on the table.
   */
  resolvingCardHost?: HTMLElement | null;
  mobileLedger?: {
    rivalLegends: ReactNode;
    rivalLegendCount?: number;
    friendlyLegends: ReactNode;
    friendlyLegendCount?: number;
    resolvingCardHost?: HTMLElement | null;
  };
}

/**
 * CenterRow shows each side's claimed Gig dice (the gig area). Per the alpha
 * rules each die is rolled once when taken from the fixer area and is not
 * re-rolled afterwards, so these tiles are read-only — the engine owns the
 * face value.
 */
export function CenterRow({
  gigsOnly = false,
  spaciousGigs = false,
  effectDetails = false,
  resolvingCardHost,
  mobileLedger,
}: CenterRowProps) {
  const { activeSide, gameEnded, overtimeActive } = useGameState();
  const [legendFocus, setLegendFocus] = useState<"friendly" | "rival" | null>(null);
  const { humanSide, dispatch, interactionViews, matchState } = useEngine();
  const interactionView = useEngineInteractionView(humanSide);
  const { activeSource } = useDragDrop();
  const moveSelection = useMoveSelection();
  const resolvingProgramVisuals = useResolvingProgramVisuals();
  const rivalSide = otherSide(humanSide);
  const friendly = useSideZones(humanSide);
  const rival = useSideZones(rivalSide);
  const canDropDirectAttackOnRivalGigs =
    activeSource?.zone === "p-field" &&
    typeof activeSource.cardId === "string" &&
    interactionViewCanAttackRival(interactionView, activeSource.cardId);
  const temporaryEffects = useMemo(
    () =>
      collectTemporaryEffects([
        {
          ownerSide: rivalSide,
          cards: [rival.field, rival.legendArea],
          playerEffects: rival.activeEffects,
        },
        {
          ownerSide: humanSide,
          cards: [friendly.field, friendly.legendArea],
          playerEffects: friendly.activeEffects,
        },
      ]),
    [
      friendly.activeEffects,
      friendly.field,
      friendly.legendArea,
      humanSide,
      rival.activeEffects,
      rival.field,
      rival.legendArea,
      rivalSide,
    ],
  );
  const showActiveEffectsRail = gigsOnly && spaciousGigs && temporaryEffects.length > 0;
  const rivalTemporaryEffects = temporaryEffects.filter((effect) => effect.ownerSide === rivalSide);
  const friendlyTemporaryEffects = temporaryEffects.filter(
    (effect) => effect.ownerSide === humanSide,
  );
  const hasRivalEffects = showActiveEffectsRail && rivalTemporaryEffects.length > 0;
  const hasFriendlyEffects = showActiveEffectsRail && friendlyTemporaryEffects.length > 0;
  const stealChoice = stealChoiceContextFromInteractionViews({
    humanSide,
    interactionViews,
  });
  const effectGigChoice = effectGigChoiceContextFromInteractionViews({
    humanSide,
    interactionViews,
  });
  const adjustGigChoice = adjustGigChoiceContextFromInteractionViews({
    humanSide,
    interactionViews,
    dice: [...friendly.gigArea, ...rival.gigArea],
  });
  const stealChoiceInteractive = stealChoice?.side === humanSide;
  const effectGigChoiceInteractive = effectGigChoice?.side === humanSide;
  const adjustGigChoiceInteractive = adjustGigChoice?.side === humanSide;
  const canInteract =
    !gameEnded &&
    (activeSide === humanSide ||
      stealChoiceInteractive ||
      effectGigChoiceInteractive ||
      adjustGigChoiceInteractive);
  const eligibleStealIds = useMemo(
    () => new Set<string>(stealChoice?.eligibleDieIds ?? []),
    [stealChoice],
  );
  const allEligibleEffectGigIds = useMemo(
    () => new Set<string>(effectGigChoice?.eligibleDieIds ?? []),
    [effectGigChoice],
  );
  const eligibleAdjustGigIds = useMemo(
    () => new Set<string>(adjustGigChoice?.eligibleDieIds ?? []),
    [adjustGigChoice],
  );
  const [selectedStealIds, setSelectedStealIds] = useState<string[]>([]);
  const [selectedEffectGigIds, setSelectedEffectGigIds] = useState<string[]>([]);
  const [selectedAdjustGigId, setSelectedAdjustGigId] = useState<string | null>(null);
  const [logHighlightedGigId, setLogHighlightedGigId] = useState<string | null>(null);
  const selectedStealIdSet = useMemo(() => new Set(selectedStealIds), [selectedStealIds]);
  const selectedEffectGigIdSet = useMemo(
    () => new Set(selectedEffectGigIds),
    [selectedEffectGigIds],
  );
  const eligibleEffectGigIds = useMemo(() => {
    if (!effectGigChoice?.pairConstraint) {
      return allEligibleEffectGigIds;
    }
    const sourceId = selectedEffectGigIds[0];
    if (sourceId) {
      return new Set([
        sourceId,
        ...effectGigChoice.eligibleDieIds.filter((targetId) =>
          isValidGigCopyPair(matchState, [sourceId, targetId], effectGigChoice.pairConstraint!),
        ),
      ]);
    }
    return new Set(
      effectGigChoice.eligibleDieIds.filter((candidateSourceId) =>
        effectGigChoice.eligibleDieIds.some((candidateTargetId) =>
          isValidGigCopyPair(
            matchState,
            [candidateSourceId, candidateTargetId],
            effectGigChoice.pairConstraint!,
          ),
        ),
      ),
    );
  }, [allEligibleEffectGigIds, effectGigChoice, matchState, selectedEffectGigIds]);
  const gigHelper = useMemo(
    () => compareGigStats(friendly.gigArea, rival.gigArea),
    [friendly.gigArea, rival.gigArea],
  );
  const gigDiceById = useMemo(() => {
    const byId = new Map<string, GigDieView>();
    for (const die of [...rival.gigArea, ...friendly.gigArea]) {
      byId.set(die.id, die);
    }
    return byId;
  }, [friendly.gigArea, rival.gigArea]);
  const effectGigSelectionHintForDie = (dieId: string) =>
    buildEffectGigSelectionHint(effectGigChoice ?? undefined, selectedEffectGigIds, dieId);
  const stealSelectionPrompt = stealChoiceInteractive
    ? buildGigSelectionPrompt({
        action: "steal",
        required: stealChoice.required,
        selected: selectedStealIds.length,
      })
    : undefined;
  const effectGigSelectionPrompt = effectGigChoice
    ? buildGigSelectionPrompt({
        action: effectGigChoice.pairConstraint ? "gig-copy" : "choose",
        required: effectGigChoice.max,
        selected: selectedEffectGigIds.length,
        source: selectedEffectGigIds[0] ? gigDiceById.get(selectedEffectGigIds[0]!) : undefined,
      })
    : undefined;

  useEffect(() => {
    setSelectedStealIds([]);
  }, [stealChoice?.requestId, stealChoice?.required, stealChoice?.side]);
  useEffect(() => {
    setSelectedEffectGigIds([]);
  }, [
    effectGigChoice?.side,
    effectGigChoice?.requestId,
    effectGigChoice?.min,
    effectGigChoice?.max,
  ]);
  useEffect(() => {
    setSelectedAdjustGigId(
      adjustGigChoice?.eligibleDieIds.length === 1 ? adjustGigChoice.eligibleDieIds[0]! : null,
    );
  }, [adjustGigChoice?.requestId, adjustGigChoice?.side]);
  useEffect(() => {
    if (!effectGigChoice?.ordered || selectedEffectGigIds.length === 0) {
      emitGigCopySource(null);
      return;
    }
    const sourceDie = gigDiceById.get(selectedEffectGigIds[0]!);
    if (!sourceDie) {
      emitGigCopySource(null);
      return;
    }
    emitGigCopySource({
      requestId: effectGigChoice.requestId,
      label: sourceDie.label,
      value: sourceDie.faceValue,
    });
  }, [effectGigChoice?.ordered, effectGigChoice?.requestId, gigDiceById, selectedEffectGigIds]);
  useEffect(() => {
    const handleLogHover = (event: Event) => {
      const detail = (event as CustomEvent<{ dieId?: string | null }>).detail;
      setLogHighlightedGigId(detail?.dieId ?? null);
    };
    window.addEventListener(GIG_LOG_HOVER_EVENT, handleLogHover);
    return () => window.removeEventListener(GIG_LOG_HOVER_EVENT, handleLogHover);
  }, []);

  const handleStealDieClick = (dieId: string) => {
    if (!stealChoice || !eligibleStealIds.has(dieId)) {
      return;
    }
    const required = stealChoice.required;
    const next = selectedStealIds.includes(dieId)
      ? selectedStealIds.filter((id) => id !== dieId)
      : selectedStealIds.length >= required
        ? [...selectedStealIds.slice(1), dieId]
        : [...selectedStealIds, dieId];
    if (next.length === required) {
      setSelectedStealIds([]);
      const submission = buildInteractionSubmissionForActionId({
        view: stealChoice.view,
        actionId: "resolveStealGigs",
        values: { dieIds: next },
      });
      const action = submission
        ? interactionSubmissionToEngineAction(submission, PLAYER_SIDE_TO_ID[stealChoice.side])
        : null;
      if (action) {
        dispatch(action);
      }
      return;
    }
    setSelectedStealIds(next);
  };

  const handleEffectGigClick = (dieId: string) => {
    if (!effectGigChoice || !eligibleEffectGigIds.has(dieId)) {
      return;
    }
    const max = effectGigChoice.max;
    if (max <= 1) {
      const submission = buildInteractionSubmissionForActionId({
        view: effectGigChoice.view,
        actionId: "resolveEffectTarget",
        values: { targetIds: [dieId] },
      });
      const action = submission
        ? interactionSubmissionToEngineAction(submission, PLAYER_SIDE_TO_ID[effectGigChoice.side])
        : null;
      if (action) {
        dispatch(action);
      }
      return;
    }
    const next = selectedEffectGigIds.includes(dieId)
      ? selectedEffectGigIds.filter((id) => id !== dieId)
      : selectedEffectGigIds.length >= max
        ? [...selectedEffectGigIds.slice(1), dieId]
        : [...selectedEffectGigIds, dieId];
    if (next.length === max) {
      setSelectedEffectGigIds([]);
      emitGigCopySource(null);
      const submission = buildInteractionSubmissionForActionId({
        view: effectGigChoice.view,
        actionId: "resolveEffectTarget",
        values: { targetIds: next },
      });
      const action = submission
        ? interactionSubmissionToEngineAction(submission, PLAYER_SIDE_TO_ID[effectGigChoice.side])
        : null;
      if (action) {
        dispatch(action);
      }
      return;
    }
    setSelectedEffectGigIds(next);
  };
  const handleAdjustGigClick = (dieId: string) => {
    if (!adjustGigChoice || !eligibleAdjustGigIds.has(dieId)) return;
    setSelectedAdjustGigId(dieId);
  };
  const handleAdjustGigValue = (value: number) => {
    if (!adjustGigChoice || !selectedAdjustGigId) {
      return;
    }
    const selectedDie = gigDiceById.get(selectedAdjustGigId);
    const noAdjustment = adjustGigChoice.chooseUpTo && selectedDie?.faceValue === value;
    const submission = buildInteractionSubmissionForActionId({
      view: adjustGigChoice.view,
      actionId: "resolveAdjustGig",
      values: noAdjustment ? { pass: true } : { dieId: selectedAdjustGigId, value },
    });
    const action = submission
      ? interactionSubmissionToEngineAction(submission, PLAYER_SIDE_TO_ID[adjustGigChoice.side])
      : null;
    if (action) {
      dispatch(action);
      setSelectedAdjustGigId(null);
    }
  };

  const rivalEffectGigActive = effectGigChoice
    ? rival.gigArea.some((die) => eligibleEffectGigIds.has(die.id))
    : false;
  const friendlyEffectGigActive = effectGigChoice
    ? friendly.gigArea.some((die) => eligibleEffectGigIds.has(die.id))
    : false;
  const rivalAdjustGigActive = adjustGigChoice
    ? adjustGigChoiceInteractive && rival.gigArea.some((die) => eligibleAdjustGigIds.has(die.id))
    : false;
  const friendlyAdjustGigActive = adjustGigChoice
    ? adjustGigChoiceInteractive && friendly.gigArea.some((die) => eligibleAdjustGigIds.has(die.id))
    : false;
  const adjustControl = buildAtomicAdjustGigControl(
    selectedAdjustGigId ? gigDiceById.get(selectedAdjustGigId) : undefined,
    adjustGigChoice,
  );
  const gigChoiceActive = Boolean(stealChoice || effectGigChoice || adjustGigChoice);
  useEffect(() => {
    if (gigChoiceActive) setLegendFocus(null);
  }, [gigChoiceActive]);
  const persistedCards = persistedResolvingCards({
    humanSide,
    resolvingProgramVisuals,
    cardIndex: matchState.G.cardIndex,
  }).filter((card) => !isCardPubliclyMounted(matchState, card.cardId));
  const resolvingCard =
    resolvingCardFromCurrentTrigger(
      matchState.G.turnMetadata.currentTrigger,
      matchState.G.cardIndex,
    ) ??
    resolvingCardFromInteractionViews({
      humanSide,
      interactionViews,
      cardIndex: matchState.G.cardIndex,
    }) ??
    selectedPlayedCardFromMoveSelection(moveSelection.selection, matchState.G.cardIndex) ??
    persistedCards[0] ??
    null;
  const mountedResolvingCard =
    resolvingCard !== null && isCardPubliclyMounted(matchState, resolvingCard.cardId);
  const displayResolvingCard = mountedResolvingCard ? null : resolvingCard;
  // A resolving program's exit flight (resolving anchor → trash) starts on a
  // later transition than its play, and by then a newer trigger may have taken
  // over the display slot. Keep every plan-referenced card's anchor mounted as
  // an invisible overlay so the outgoing flight still finds its source.
  const ghostResolvingCards = persistedCards.filter(
    (card) => card.cardId !== displayResolvingCard?.cardId,
  );

  if (mobileLedger) {
    return (
      <div className={classes.mobileLedgerRoot} data-overtime={overtimeActive ? "true" : "false"}>
        <OvertimeStatus matchState={matchState} />
        <section
          className={classes.mobileLedgerThreeRows}
          data-legend-focus={legendFocus ?? "none"}
          aria-label="Mobile Legends, Street Cred, and Gig dice"
        >
          <div className={classes.mobileLedgerGigRow} data-tone="rival">
            <MobileLedgerRails tone="rival" streetCred={rival.streetCred} helper={gigHelper} />
            <GigLane
              label="Rival Gigs"
              side="rival"
              ownerSide={rivalSide}
              gridClass={classes.mobileLedgerGigLane}
              badgeClass={classes.gigBadgeRival}
              badgePosition="top"
              dice={rival.gigArea}
              streetCred={rival.streetCred}
              helper={gigHelper}
              scoreVariant="compact"
              showScore
              interactive={
                (stealChoice !== null &&
                  rival.gigArea.some((die) => eligibleStealIds.has(die.id))) ||
                rivalEffectGigActive ||
                rivalAdjustGigActive
              }
              interactiveDieIds={
                stealChoice
                  ? eligibleStealIds
                  : adjustGigChoice
                    ? eligibleAdjustGigIds
                    : eligibleEffectGigIds
              }
              selectedDieIds={
                rivalAdjustGigActive
                  ? new Set(selectedAdjustGigId ? [selectedAdjustGigId] : [])
                  : rivalEffectGigActive
                    ? selectedEffectGigIdSet
                    : selectedStealIdSet
              }
              selectionPrompt={
                stealChoice !== null && rival.gigArea.some((die) => eligibleStealIds.has(die.id))
                  ? stealSelectionPrompt
                  : rivalEffectGigActive
                    ? effectGigSelectionPrompt
                    : undefined
              }
              logHighlightedDieId={logHighlightedGigId}
              adjustChoice={rivalAdjustGigActive ? adjustControl : null}
              selectionHintForDie={effectGigChoice ? effectGigSelectionHintForDie : undefined}
              onDieClick={
                stealChoice
                  ? handleStealDieClick
                  : adjustGigChoice
                    ? handleAdjustGigClick
                    : effectGigChoice
                      ? handleEffectGigClick
                      : undefined
              }
              onAdjustGig={handleAdjustGigValue}
            />
          </div>

          <div className={classes.mobileLedgerLegendRow} data-focus={legendFocus ?? "none"}>
            {legendFocus ? (
              <div className={classes.mobileLedgerFocusControls}>
                <button
                  type="button"
                  className={classes.mobileLedgerFocusClose}
                  aria-label="Close Legend focus"
                  onClick={() => setLegendFocus(null)}
                >
                  <IconX aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Your Legends"
                  aria-pressed={legendFocus === "friendly"}
                  onClick={() => setLegendFocus("friendly")}
                >
                  YOU
                </button>
                <button
                  type="button"
                  aria-label="Rival Legends"
                  aria-pressed={legendFocus === "rival"}
                  onClick={() => setLegendFocus("rival")}
                >
                  RIVAL
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={classes.mobileLedgerFocusOpen}
                aria-label="Focus Legends"
                onClick={() => setLegendFocus("friendly")}
              >
                <IconArrowsMaximize aria-hidden="true" />
              </button>
            )}
            <div className={classes.mobileLedgerLegendSide} data-tone="friendly">
              {friendlyTemporaryEffects.length > 0 ? (
                <MobileActiveEffectsStack effects={friendlyTemporaryEffects} tone="friendly" />
              ) : null}
              <div
                className={classes.mobileLedgerLegends}
                data-legend-count={mobileLedger.friendlyLegendCount ?? undefined}
                data-testid="mobile-ledger-legends"
              >
                {mobileLedger.friendlyLegends}
              </div>
            </div>
            <div className={classes.mobileLedgerLegendSide} data-tone="rival">
              {rivalTemporaryEffects.length > 0 ? (
                <MobileActiveEffectsStack effects={rivalTemporaryEffects} tone="rival" />
              ) : null}
              <div
                className={classes.mobileLedgerLegends}
                data-legend-count={mobileLedger.rivalLegendCount ?? undefined}
                data-testid="mobile-ledger-legends"
              >
                {mobileLedger.rivalLegends}
              </div>
            </div>
            {legendFocus ? (
              <MobileLedgerMiniGigs
                tone={legendFocus}
                streetCred={legendFocus === "friendly" ? friendly.streetCred : rival.streetCred}
                dice={legendFocus === "friendly" ? friendly.gigArea : rival.gigArea}
                onOpen={() => setLegendFocus(null)}
              />
            ) : null}
          </div>

          <div className={classes.mobileLedgerGigRow} data-tone="friendly">
            <MobileLedgerRails
              tone="friendly"
              streetCred={friendly.streetCred}
              helper={gigHelper}
            />
            <GigLane
              label="Friendly Gigs"
              side="friendly"
              ownerSide={humanSide}
              gridClass={classes.mobileLedgerGigLane}
              badgeClass={classes.gigBadgeFriendly}
              badgePosition="bottom"
              dice={friendly.gigArea}
              streetCred={friendly.streetCred}
              helper={gigHelper}
              scoreVariant="compact"
              showScore
              interactive={
                (stealChoice !== null &&
                  friendly.gigArea.some((die) => eligibleStealIds.has(die.id))) ||
                friendlyEffectGigActive ||
                friendlyAdjustGigActive
              }
              interactiveDieIds={
                stealChoice
                  ? eligibleStealIds
                  : adjustGigChoice
                    ? eligibleAdjustGigIds
                    : eligibleEffectGigIds
              }
              selectedDieIds={
                friendlyAdjustGigActive
                  ? new Set(selectedAdjustGigId ? [selectedAdjustGigId] : [])
                  : friendlyEffectGigActive
                    ? selectedEffectGigIdSet
                    : selectedStealIdSet
              }
              selectionPrompt={
                stealChoice !== null && friendly.gigArea.some((die) => eligibleStealIds.has(die.id))
                  ? stealSelectionPrompt
                  : friendlyEffectGigActive
                    ? effectGigSelectionPrompt
                    : undefined
              }
              logHighlightedDieId={logHighlightedGigId}
              adjustChoice={friendlyAdjustGigActive ? adjustControl : null}
              selectionHintForDie={effectGigChoice ? effectGigSelectionHintForDie : undefined}
              onDieClick={
                stealChoice
                  ? handleStealDieClick
                  : adjustGigChoice
                    ? handleAdjustGigClick
                    : effectGigChoice
                      ? handleEffectGigClick
                      : undefined
              }
              onAdjustGig={handleAdjustGigValue}
            />
          </div>
        </section>
        {mobileLedger.resolvingCardHost && (
          <PendingResolutionCards
            current={
              displayResolvingCard ? pendingResolutionCard(displayResolvingCard, humanSide) : null
            }
            retained={ghostResolvingCards.map((card) => pendingResolutionCard(card, humanSide))}
            host={mobileLedger.resolvingCardHost}
            showLabel={false}
            className={classes.resolvingProgram}
            ghostClassName={classes.resolvingProgramGhost}
            entityClassName={classes.resolvingProgramCard}
            labelClassName={classes.resolvingProgramLabel}
            testId="resolving-program"
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`${classes.row} ${gigsOnly ? classes.gigsOnly : ""} ${spaciousGigs ? classes.spaciousGigs : ""}`}
      data-interactive={canInteract ? "true" : "false"}
      data-overtime={overtimeActive ? "true" : "false"}
    >
      <OvertimeStatus matchState={matchState} />
      {!gigsOnly && (
        <div className={`${classes.cell} ${classes.clock}`}>
          <ClockDisplay />
        </div>
      )}
      <div className={`${classes.effectSide} ${classes.rivalEffectSide}`}>
        {hasRivalEffects && !effectDetails ? (
          <ActiveEffectsRail effects={rivalTemporaryEffects} tone="rival" />
        ) : null}
        <GigLane
          showSummary={gigsOnly && spaciousGigs}
          label="Rival Gigs"
          side="rival"
          ownerSide={rivalSide}
          gridClass={classes.rival}
          badgeClass={classes.gigBadgeRival}
          badgePosition="top"
          dice={rival.gigArea}
          streetCred={rival.streetCred}
          helper={gigHelper}
          directAttackDropSurface
          directAttackDropTarget={canDropDirectAttackOnRivalGigs}
          interactive={
            (stealChoice !== null && rival.gigArea.some((die) => eligibleStealIds.has(die.id))) ||
            rivalEffectGigActive ||
            rivalAdjustGigActive
          }
          interactiveDieIds={
            stealChoice
              ? eligibleStealIds
              : adjustGigChoice
                ? eligibleAdjustGigIds
                : eligibleEffectGigIds
          }
          selectedDieIds={
            rivalAdjustGigActive
              ? new Set(selectedAdjustGigId ? [selectedAdjustGigId] : [])
              : rivalEffectGigActive
                ? selectedEffectGigIdSet
                : selectedStealIdSet
          }
          selectionPrompt={
            stealChoice !== null && rival.gigArea.some((die) => eligibleStealIds.has(die.id))
              ? stealSelectionPrompt
              : rivalEffectGigActive
                ? effectGigSelectionPrompt
                : undefined
          }
          logHighlightedDieId={logHighlightedGigId}
          adjustChoice={rivalAdjustGigActive ? adjustControl : null}
          selectionHintForDie={effectGigChoice ? effectGigSelectionHintForDie : undefined}
          onDieClick={
            stealChoice
              ? handleStealDieClick
              : adjustGigChoice
                ? handleAdjustGigClick
                : effectGigChoice
                  ? handleEffectGigClick
                  : undefined
          }
          onAdjustGig={handleAdjustGigValue}
        />
      </div>
      <PendingResolutionCards
        current={
          displayResolvingCard ? pendingResolutionCard(displayResolvingCard, humanSide) : null
        }
        retained={ghostResolvingCards.map((card) => pendingResolutionCard(card, humanSide))}
        host={resolvingCardHost}
        elevated={Boolean(resolvingCardHost)}
        showLabel={false}
        className={resolvingCardHost ? undefined : classes.resolvingProgram}
        ghostClassName={classes.resolvingProgramGhost}
        entityClassName={classes.resolvingProgramCard}
        labelClassName={classes.resolvingProgramLabel}
        testId="resolving-program"
      />
      <div className={`${classes.effectSide} ${classes.friendlyEffectSide}`}>
        <GigLane
          showSummary={gigsOnly && spaciousGigs}
          label="Friendly Gigs"
          side="friendly"
          ownerSide={humanSide}
          gridClass={classes.friendly}
          badgeClass={classes.gigBadgeFriendly}
          badgePosition="bottom"
          dice={friendly.gigArea}
          streetCred={friendly.streetCred}
          helper={gigHelper}
          interactive={
            (stealChoice !== null &&
              friendly.gigArea.some((die) => eligibleStealIds.has(die.id))) ||
            friendlyEffectGigActive ||
            friendlyAdjustGigActive
          }
          interactiveDieIds={
            stealChoice
              ? eligibleStealIds
              : adjustGigChoice
                ? eligibleAdjustGigIds
                : eligibleEffectGigIds
          }
          selectedDieIds={
            friendlyAdjustGigActive
              ? new Set(selectedAdjustGigId ? [selectedAdjustGigId] : [])
              : friendlyEffectGigActive
                ? selectedEffectGigIdSet
                : selectedStealIdSet
          }
          selectionPrompt={
            stealChoice !== null && friendly.gigArea.some((die) => eligibleStealIds.has(die.id))
              ? stealSelectionPrompt
              : friendlyEffectGigActive
                ? effectGigSelectionPrompt
                : undefined
          }
          logHighlightedDieId={logHighlightedGigId}
          adjustChoice={friendlyAdjustGigActive ? adjustControl : null}
          selectionHintForDie={effectGigChoice ? effectGigSelectionHintForDie : undefined}
          onDieClick={
            stealChoice
              ? handleStealDieClick
              : adjustGigChoice
                ? handleAdjustGigClick
                : effectGigChoice
                  ? handleEffectGigClick
                  : undefined
          }
          onAdjustGig={handleAdjustGigValue}
        />
        {hasFriendlyEffects && !effectDetails ? (
          <ActiveEffectsRail effects={friendlyTemporaryEffects} tone="friendly" />
        ) : null}
      </div>
      {effectDetails && (hasRivalEffects || hasFriendlyEffects) ? (
        <ActiveEffectsDock friendly={friendlyTemporaryEffects} rival={rivalTemporaryEffects} />
      ) : null}
      {!gigsOnly && (
        <div className={`${classes.cell} ${classes.pass}`}>
          <PassTurnControl />
        </div>
      )}
    </div>
  );
}

type CenterActiveEffect = CardActiveEffectView & { ownerSide: Side };

/** Gig dice read smallest-first regardless of the order they were gained. */
function compareGigDiceByFaces(a: GigDieView, b: GigDieView): number {
  return (
    (DIE_MAX_VALUES[a.dieType] ?? Number.POSITIVE_INFINITY) -
    (DIE_MAX_VALUES[b.dieType] ?? Number.POSITIVE_INFINITY)
  );
}

export function collectTemporaryEffects(
  sides: ReadonlyArray<{
    ownerSide: Side;
    cards: ReadonlyArray<ReadonlyArray<{ activeEffects: readonly CardActiveEffectView[] }>>;
    playerEffects: readonly CardActiveEffectView[];
  }>,
): CenterActiveEffect[] {
  const effects = new Map<string, CenterActiveEffect>();
  for (const { ownerSide, cards, playerEffects } of sides) {
    for (const effect of playerEffects) {
      if (effect.isTemporary) effects.set(effect.id, { ...effect, ownerSide });
    }
    for (const card of cards.flat()) {
      for (const effect of card.activeEffects) {
        if (effect.isTemporary) effects.set(effect.id, { ...effect, ownerSide });
      }
    }
  }
  return [...effects.values()];
}

/** Compact per-effect chips; the V1 board keeps these in its gig grid cells. */
function ActiveEffectsRail({
  effects,
  tone,
}: {
  effects: readonly CenterActiveEffect[];
  tone: "rival" | "friendly";
}) {
  return (
    <section
      className={`${classes.activeEffectsRail} ${tone === "rival" ? classes.rivalEffectsRail : classes.friendlyEffectsRail}`}
      data-testid={`active-effects-rail-${tone}`}
      aria-label={`${tone === "rival" ? "Rival" : "Your"} active effects`}
    >
      <span className={classes.activeEffectsRailTitle}>Active effects</span>
      <div className={classes.activeEffectsRailCards}>
        {effects.map((effect) => (
          <div
            key={effect.id}
            className={classes.activeEffectCard}
            data-tone={tone}
            data-effect-kind={effect.effectKind}
            data-source-card-id={effect.sourceCardId}
            title={effect.detail}
          >
            <CardImage
              className={classes.activeEffectImage}
              imageUrl={effect.sourceImageUrl}
              alt={effect.sourceName}
              previewDetails={{ name: effect.sourceName }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

interface ActiveEffectSourceGroup {
  key: string;
  tone: "rival" | "friendly";
  sourceName: string;
  sourceImageUrl?: string;
  sourceCardId?: string;
  effects: CenterActiveEffect[];
}

function groupEffectsBySource(
  effects: readonly CenterActiveEffect[],
  tone: "rival" | "friendly",
): ActiveEffectSourceGroup[] {
  const groups = new Map<string, ActiveEffectSourceGroup>();
  for (const effect of effects) {
    const key = effect.sourceCardId ?? effect.id;
    const group = groups.get(key);
    if (group) {
      group.effects.push(effect);
    } else {
      groups.set(key, {
        key,
        tone,
        sourceName: effect.sourceName,
        sourceImageUrl: effect.sourceImageUrl,
        sourceCardId: effect.sourceCardId,
        effects: [effect],
      });
    }
  }
  return [...groups.values()];
}

/**
 * V2 combined effects dock: one chip per source card (friendly and rival
 * alike). Hovering/focusing a chip lists every effect that card grants and
 * outlines its target cards on the board.
 */
function ActiveEffectsDock({
  friendly,
  rival,
}: {
  friendly: readonly CenterActiveEffect[];
  rival: readonly CenterActiveEffect[];
}) {
  const groups = useMemo(
    () => [...groupEffectsBySource(friendly, "friendly"), ...groupEffectsBySource(rival, "rival")],
    [friendly, rival],
  );
  const [tip, setTip] = useState<{
    group: ActiveEffectSourceGroup;
    left: number;
    top: number;
  } | null>(null);
  const highlightedTargets = useRef<HTMLElement[]>([]);
  const clearHighlightedTargets = useCallback(() => {
    for (const el of highlightedTargets.current) el.removeAttribute("data-effect-target");
    highlightedTargets.current = [];
  }, []);
  useEffect(() => clearHighlightedTargets, [clearHighlightedTargets]);

  const showGroup = (group: ActiveEffectSourceGroup, el: HTMLElement) => {
    clearHighlightedTargets();
    highlightedTargets.current = group.effects
      .map((effect) =>
        effect.targetKind === "card" && effect.targetId
          ? document.querySelector<HTMLElement>(`[data-instance-id="${String(effect.targetId)}"]`)
          : null,
      )
      .filter((target): target is HTMLElement => Boolean(target));
    for (const target of highlightedTargets.current)
      target.setAttribute("data-effect-target", "true");
    // The dock rides under the rival gigs, so the tip opens below and grows
    // leftward into the open center.
    const rect = el.getBoundingClientRect();
    setTip({ group, left: rect.right, top: rect.bottom + 9 });
  };
  const hideGroup = () => {
    setTip(null);
    clearHighlightedTargets();
  };

  if (!groups.length) return null;
  return (
    <section
      className={classes.activeEffectsRail}
      data-testid="active-effects-dock"
      aria-label="Active effects"
    >
      <span className={classes.activeEffectsRailTitle}>Active effects</span>
      <div className={classes.activeEffectsRailCards}>
        {groups.map((group) => {
          return (
            <div
              key={group.key}
              className={classes.activeEffectCard}
              data-tone={group.tone}
              data-source-card-id={group.sourceCardId}
              tabIndex={0}
              aria-label={`${group.sourceName}: ${group.effects.map((effect) => effect.label).join(", ")}`}
              onMouseEnter={(event) => showGroup(group, event.currentTarget)}
              onFocus={(event) => showGroup(group, event.currentTarget)}
              onMouseLeave={hideGroup}
              onBlur={hideGroup}
            >
              <CardImage
                className={classes.activeEffectImage}
                imageUrl={group.sourceImageUrl}
                alt={group.sourceName}
                previewDetails={{ name: group.sourceName }}
                inspectOnTap
              />
              {group.effects.length > 1 ? (
                <span className={classes.activeEffectCount}>+{group.effects.length - 1}</span>
              ) : null}
            </div>
          );
        })}
      </div>
      {tip
        ? createPortal(
            <div
              className={classes.activeEffectTip}
              role="tooltip"
              style={{ left: tip.left, top: tip.top, transform: "translate(-100%, 0)" }}
            >
              <strong className={classes.activeEffectTipSource}>{tip.group.sourceName}</strong>
              {tip.group.effects.map((effect) => (
                <div
                  key={effect.id}
                  className={classes.activeEffectTipEntry}
                  data-effect-tone={effect.tone}
                >
                  <strong>{effect.label}</strong>
                  <span>{effect.detail}</span>
                  <span className={classes.activeEffectTipTarget}>
                    {effect.targetName ? `Target: ${effect.targetName}` : "Player-wide"}
                  </span>
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}

function MobileActiveEffectsStack({
  effects,
  tone,
}: {
  effects: readonly CenterActiveEffect[];
  tone: "rival" | "friendly";
}) {
  const firstEffect = effects[0]!;
  return (
    <div
      className={classes.mobileActiveEffects}
      data-testid={`mobile-active-effects-${tone}`}
      data-tone={tone}
      aria-label={`${tone === "rival" ? "Rival" : "Your"} active effects: ${effects.length}`}
    >
      <span className={classes.mobileActiveEffectsLabel}>FX</span>
      <CardImage
        className={classes.mobileActiveEffectImage}
        imageUrl={firstEffect.sourceImageUrl}
        alt={firstEffect.sourceName}
        previewDetails={{ name: firstEffect.sourceName }}
        inspectOnTap
      />
      {effects.length > 1 ? (
        <span className={classes.mobileActiveEffectsCount}>+{effects.length - 1}</span>
      ) : null}
    </div>
  );
}

type ProtocolStealChoice = {
  side: Side;
  view: EngineInteractionView;
  requestId: string;
  required: number;
  eligibleDieIds: string[];
};
type ProtocolEffectGigChoice = {
  side: Side;
  view: EngineInteractionView;
  requestId: string;
  min: number;
  max: number;
  ordered: boolean;
  pairConstraint?: "gig-copy" | "gig-copy-between-players";
  eligibleDieIds: string[];
  adjustGig?: {
    direction?: string;
    maxAmount?: number;
    chooseUpTo?: boolean;
  };
  source?: {
    cardId?: string;
    displayName?: string;
    rulesText?: string;
  };
};
type GigSelectionHint = {
  role: "copy-source" | "copy-target";
  ariaLabel: string;
  tooltip: string;
};
type AdjustGigControl = {
  dieId: string;
  label: string;
  currentValue: number;
  maxFaceValue: number;
  maxAmount: number;
  direction?: string;
  chooseUpTo?: boolean;
  minValue?: number;
  maxValue?: number;
};
type ProtocolAdjustGigChoice = {
  side: Side;
  view: EngineInteractionView;
  requestId: string;
  eligibleDieIds: string[];
  maxAmount: number;
  direction?: string;
  chooseUpTo: boolean;
};
type ResolvingCard = {
  cardId: string;
  ownerId: CardInstance["ownerId"];
  controllerId: CardInstance["controllerId"];
  cardType: CardType;
  faceDown?: boolean;
  label: string;
  name: string;
  imageUrl: string;
  color: "blue" | "green" | "red" | "yellow";
  rulesText: string | null;
};

function pendingResolutionCard(card: ResolvingCard, humanSide: Side): PendingResolutionCard {
  const entity: SimulatorEntity = {
    id: card.cardId,
    title: card.name,
    subtitle: card.cardType,
    kind: "card",
    ownerId: card.ownerId,
    face: card.faceDown ? "hidden" : "public",
    states: card.faceDown ? ["hidden"] : [],
    stats: [],
    traits: [],
    imageUrl: card.imageUrl,
    frameStyle: { color: card.color },
    dataAttributes: {
      "data-card-id": card.cardId,
      "data-card-type": card.cardType,
    },
  };

  return {
    entity,
    anchorId: `resolving-program:${card.cardId}`,
    label: card.label,
    side: card.controllerId === PLAYER_SIDE_TO_ID[humanSide] ? "left" : "right",
  };
}

function resolvingCardFromInteractionViews({
  humanSide,
  interactionViews,
  cardIndex,
}: {
  humanSide: Side;
  interactionViews: Record<Side, EngineInteractionView>;
  cardIndex: Record<string, CardInstance>;
}): ResolvingCard | null {
  return (
    resolvingCardFromInteractionView(interactionViews[humanSide], cardIndex) ??
    resolvingCardFromInteractionView(interactionViews[otherSide(humanSide)], cardIndex)
  );
}

function resolvingCardFromInteractionView(
  view: EngineInteractionView,
  cardIndex: Record<string, CardInstance>,
): ResolvingCard | null {
  const action = view.actions.find(
    (candidate) =>
      candidate.enabled &&
      candidate.source?.kind === "card" &&
      isResolvingSourceActionId(candidate.id),
  );
  if (action?.source?.kind !== "card") {
    return null;
  }
  return resolvingCardFromSourceCardId(action.source.instanceId, cardIndex, {
    label: resolvingSourceActionLabel(action.source.instanceId, cardIndex),
  });
}

function selectedPlayedCardFromMoveSelection(
  selection: ReturnType<typeof useMoveSelection>["selection"],
  cardIndex: Record<string, CardInstance>,
): ResolvingCard | null {
  if (
    selection?.moveId !== "playCard" ||
    (selection.sourceCardType !== "program" && selection.sourceCardType !== "gear") ||
    !selection.sourceCardId
  ) {
    return null;
  }
  const card = cardIndex[selection.sourceCardId];
  if (!card) {
    return null;
  }
  const def = defOf(card);
  if (def.type !== "program" && def.type !== "gear") {
    return null;
  }
  return {
    cardId: selection.sourceCardId,
    ownerId: card.ownerId,
    controllerId: card.controllerId,
    cardType: def.type,
    label: def.type === "gear" ? "Playing gear" : "Resolving program",
    name: def.displayName ?? def.name,
    imageUrl: def.imageUrl,
    color: def.color as ResolvingCard["color"],
    rulesText: def.rulesText ?? null,
  };
}

function persistedResolvingCards({
  humanSide,
  resolvingProgramVisuals,
  cardIndex,
}: {
  humanSide: Side;
  resolvingProgramVisuals: ReturnType<typeof useResolvingProgramVisuals>;
  cardIndex: Record<string, CardInstance>;
}): ResolvingCard[] {
  const ordered = [
    ...resolvingProgramVisuals.filter((candidate) => candidate.side === humanSide),
    ...resolvingProgramVisuals.filter((candidate) => candidate.side !== humanSide),
  ];
  const seen = new Set<string>();
  const cards: ResolvingCard[] = [];
  for (const visual of ordered) {
    if (seen.has(visual.cardId)) continue;
    seen.add(visual.cardId);
    const card = cardIndex[visual.cardId];
    if (!card) continue;
    const def = defOf(card);
    if (!isResolvingCardType(def.type)) continue;
    cards.push({
      cardId: visual.cardId,
      ownerId: card.ownerId,
      controllerId: card.controllerId,
      cardType: def.type,
      faceDown: visual.face === "hidden",
      label: visual.label ?? resolvingCardLabel(card, { persistedVisual: true }),
      name: def.displayName ?? def.name,
      imageUrl: def.imageUrl,
      color: def.color as ResolvingCard["color"],
      rulesText: def.rulesText ?? null,
    });
  }
  return cards;
}

/**
 * Cards the viewer can already see rendered on the board — field units,
 * attached gear, and legends in their rack — never stage on the resolving
 * plane: the display would only duplicate them (and spoil face-down legends).
 */
function isCardPubliclyMounted(matchState: MatchState, cardId: string): boolean {
  const card = matchState.G.cardIndex[cardId];
  if (!card) return false;
  return card.zone === "field" || card.zone === "legendArea" || card.meta.attachedToId !== null;
}

function resolvingCardFromSourceCardId(
  cardId: string,
  cardIndex: Record<string, CardInstance>,
  options: { label?: string } = {},
): ResolvingCard | null {
  const card = cardIndex[cardId];
  if (!card) {
    return null;
  }
  const def = defOf(card);
  if (!isResolvingCardType(def.type)) {
    return null;
  }
  return {
    cardId,
    ownerId: card.ownerId,
    controllerId: card.controllerId,
    cardType: def.type,
    label: options.label ?? resolvingCardLabel(card),
    name: def.displayName ?? def.name,
    imageUrl: def.imageUrl,
    color: def.color as ResolvingCard["color"],
    rulesText: def.rulesText ?? null,
  };
}

function resolvingCardFromCurrentTrigger(
  currentTrigger: MatchState["G"]["turnMetadata"]["currentTrigger"],
  cardIndex: Record<string, CardInstance>,
): ResolvingCard | null {
  if (!currentTrigger) {
    return null;
  }
  const card = cardIndex[currentTrigger.sourceCardId as string];
  const label = currentTrigger.id.startsWith("activated-")
    ? activatedAbilityLabel(card)
    : currentTrigger.event.type === "blockerActivated"
      ? "Blocker trigger"
      : undefined;
  return resolvingCardFromSourceCardId(
    currentTrigger.sourceCardId as string,
    cardIndex,
    label ? { label } : {},
  );
}

function activatedAbilityLabel(card: CardInstance | undefined): string | undefined {
  if (!card) {
    return undefined;
  }
  switch (defOf(card).type) {
    case "gear":
      return "Gear ability";
    case "legend":
      return "Legend ability";
    case "unit":
      return "Unit ability";
    default:
      return undefined;
  }
}

function resolvingSourceActionLabel(
  cardId: string,
  cardIndex: Record<string, CardInstance>,
): string | undefined {
  const card = cardIndex[cardId];
  if (!card || triggerLabelForCard(card)) {
    return undefined;
  }
  return activatedAbilityLabel(card);
}

function isResolvingSourceActionId(actionId: string): boolean {
  return (
    actionId === "resolveEffectTarget" ||
    actionId === "resolveCardToMove" ||
    actionId === "resolveScry" ||
    actionId === "resolveRevealDestination" ||
    actionId === "resolveCardTypeChoice"
  );
}

function isResolvingCardType(cardType: string): cardType is CardType {
  return (
    cardType === "program" || cardType === "gear" || cardType === "legend" || cardType === "unit"
  );
}

function resolvingCardLabel(
  card: CardInstance,
  options: { persistedVisual?: boolean } = {},
): string {
  const def = defOf(card);
  if (def.type === "program") {
    return "Resolving program";
  }
  if (def.type === "gear" && !triggerLabelForCard(card)) {
    return options.persistedVisual ? "Triggering gear" : "Playing gear";
  }
  if (def.type === "legend" && !triggerLabelForCard(card)) {
    return "Calling legend";
  }
  return triggerLabelForCard(card) ?? `${def.type} trigger`;
}

function triggerLabelForCard(card: CardInstance): string | null {
  const trigger = defOf(card).abilities.find((ability: Ability) => ability.kind === "triggered")
    ?.trigger?.trigger;
  switch (trigger) {
    case "play":
      return "Play trigger";
    case "attack":
      return "Attack trigger";
    case "call":
    case "flip":
      return "Call trigger";
    case "defeated":
      return "Defeated trigger";
    default:
      return null;
  }
}

function stealChoiceContextFromInteractionViews({
  humanSide,
  interactionViews,
}: {
  humanSide: Side;
  interactionViews: Record<Side, EngineInteractionView>;
}): ProtocolStealChoice | null {
  return (
    stealChoiceFromInteractionView(interactionViews[humanSide], humanSide) ??
    stealChoiceFromInteractionView(interactionViews[otherSide(humanSide)], otherSide(humanSide))
  );
}

function stealChoiceFromInteractionView(
  view: EngineInteractionView,
  side: Side,
): ProtocolStealChoice | null {
  const action = view.actions.find(
    (candidate) => candidate.enabled && candidate.id === "resolveStealGigs",
  );
  const dieInput = action?.inputs.find(
    (input) => input.kind === "entity-selection" && input.id === "dieIds",
  );
  if (dieInput?.kind !== "entity-selection" || !action) {
    return null;
  }
  return {
    side,
    view,
    requestId: action.requestId,
    required: dieInput.max,
    eligibleDieIds: dieInput.candidates
      .filter((candidate) => candidate.enabled)
      .map((candidate) => candidate.entity.instanceId),
  };
}

function effectGigChoiceContextFromInteractionViews({
  humanSide,
  interactionViews,
}: {
  humanSide: Side;
  interactionViews: Record<Side, EngineInteractionView>;
}): ProtocolEffectGigChoice | null {
  return (
    effectGigChoiceFromInteractionView(interactionViews[humanSide], humanSide) ??
    effectGigChoiceFromInteractionView(interactionViews[otherSide(humanSide)], otherSide(humanSide))
  );
}

function effectGigChoiceFromInteractionView(
  view: EngineInteractionView,
  side: Side,
): ProtocolEffectGigChoice | null {
  const action = view.actions.find(
    (candidate) => candidate.enabled && candidate.id === "resolveEffectTarget",
  );
  const targetInput = action?.inputs.find(
    (input): input is EntitySelectionInput =>
      input.kind === "entity-selection" &&
      input.id === "targetIds" &&
      input.entityKinds.includes("die"),
  );
  if (!action || !targetInput) {
    return null;
  }
  const params = action.text.params ?? {};
  const sourceDisplayName =
    typeof params.sourceDisplayName === "string" ? params.sourceDisplayName : undefined;
  const sourceRulesText =
    typeof params.sourceRulesText === "string" ? params.sourceRulesText : undefined;
  const adjustGigDirection =
    typeof params.adjustGigDirection === "string" ? params.adjustGigDirection : undefined;
  const adjustGigMaxAmount =
    typeof params.adjustGigMaxAmount === "number" ? params.adjustGigMaxAmount : undefined;
  const adjustGigChooseUpTo = action.text.params?.adjustGigChooseUpTo === true;
  const pairConstraintParam = action.text.params?.gigCopyPairConstraint;
  const pairConstraint =
    pairConstraintParam === "gig-copy" || pairConstraintParam === "gig-copy-between-players"
      ? pairConstraintParam
      : undefined;
  return {
    side,
    view,
    requestId: action.requestId,
    min: targetInput.min,
    max: targetInput.max,
    ordered: targetInput.ordered,
    ...(pairConstraint ? { pairConstraint } : {}),
    eligibleDieIds: targetInput.candidates
      .filter((candidate) => candidate.enabled)
      .map((candidate) => candidate.entity.instanceId),
    ...(adjustGigDirection !== undefined || adjustGigMaxAmount !== undefined
      ? {
          adjustGig: {
            direction: adjustGigDirection,
            maxAmount: adjustGigMaxAmount,
            chooseUpTo: adjustGigChooseUpTo,
          },
        }
      : {}),
    source: {
      cardId: action.source?.kind === "card" ? action.source.instanceId : undefined,
      displayName: sourceDisplayName,
      rulesText: sourceRulesText,
    },
  };
}

function buildEffectGigSelectionHint(
  choice: ProtocolEffectGigChoice | undefined,
  selectedDieIds: string[],
  dieId: string,
): GigSelectionHint | undefined {
  if (!choice?.ordered) {
    return undefined;
  }
  if (selectedDieIds[0] === dieId || selectedDieIds.length === 0) {
    return {
      role: "copy-source",
      ariaLabel: "Source Gig: copy value from",
      tooltip: "Step 1 — Source Gig: copy value from",
    };
  }
  return {
    role: "copy-target",
    ariaLabel: "Target Gig: set to source value",
    tooltip: "Step 2 — Target Gig: set to source value",
  };
}

function buildGigSelectionPrompt({
  action,
  required,
  selected,
  source,
}: {
  action: "choose" | "steal" | "gig-copy";
  required: number;
  selected: number;
  source?: Pick<GigDieView, "label" | "faceValue">;
}): GigSelectionPrompt | undefined {
  if (required <= 1) {
    return undefined;
  }
  if (action === "gig-copy") {
    if (selected === 0) {
      return {
        title: "Step 1 of 2 — Source Gig",
        progress: "SOURCE",
        remaining: "Select the Gig whose value you will copy.",
      };
    }
    return {
      title: "Step 2 of 2 — Target Gig",
      progress: "TARGET",
      remaining: `${source?.label ?? "Source Gig"} shows ${source?.faceValue ?? "a value"}; select the Gig that will receive it.`,
    };
  }
  const remaining = Math.max(required - selected, 0);
  const verb = action === "steal" ? "Steal" : "Select";
  return {
    title: `${verb} ${required} Gigs`,
    progress: `${selected}/${required}`,
    remaining: remaining === 0 ? "Resolving..." : `${remaining} more - resolves after the last Gig`,
  };
}

function emitGigCopySource(detail: { requestId: string; label: string; value: number } | null) {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(GIG_COPY_SOURCE_EVENT, { detail }));
}

function adjustGigChoiceContextFromInteractionViews({
  humanSide,
  interactionViews,
  dice,
}: {
  humanSide: Side;
  interactionViews: Record<Side, EngineInteractionView>;
  dice: readonly GigDieView[];
}): ProtocolAdjustGigChoice | null {
  return (
    adjustGigChoiceFromInteractionView(interactionViews[humanSide], humanSide, dice) ??
    adjustGigChoiceFromInteractionView(
      interactionViews[otherSide(humanSide)],
      otherSide(humanSide),
      dice,
    )
  );
}

function adjustGigChoiceFromInteractionView(
  view: EngineInteractionView,
  side: Side,
  dice: readonly GigDieView[],
): ProtocolAdjustGigChoice | null {
  const action = view.actions.find(
    (candidate) => candidate.enabled && candidate.id === "resolveAdjustGig",
  );
  const dieInput = action?.inputs.find(
    (input) => input.kind === "entity-selection" && input.id === "dieId",
  );
  const valueInput = action?.inputs.find(
    (input) => input.kind === "number" && input.id === "value",
  );
  if (!action || valueInput?.kind !== "number" || dieInput?.kind !== "entity-selection") {
    return null;
  }
  const eligibleDieIds = dieInput.candidates
    .filter((candidate) => candidate.enabled)
    .map((candidate) => candidate.entity.instanceId)
    .filter((dieId) => dice.some((candidate) => candidate.id === dieId));
  if (eligibleDieIds.length === 0) {
    return null;
  }
  return {
    side,
    view,
    requestId: action.requestId,
    eligibleDieIds,
    maxAmount: Math.max(0, Number(action.text.params?.adjustGigMaxAmount ?? 0)),
    direction:
      typeof action.text.params?.adjustGigDirection === "string"
        ? action.text.params.adjustGigDirection
        : undefined,
    chooseUpTo:
      action.text.params?.adjustGigChooseUpTo === true || action.text.params?.canDecline === true,
  };
}

function buildAtomicAdjustGigControl(
  die: GigDieView | undefined,
  choice: ProtocolAdjustGigChoice | null,
): AdjustGigControl | null {
  if (!die || !choice) {
    return null;
  }
  return {
    dieId: die.id,
    label: die.label,
    currentValue: die.faceValue,
    maxFaceValue: DIE_MAX_VALUES[die.dieType],
    maxAmount: choice.maxAmount,
    direction: choice.direction,
    chooseUpTo: choice.chooseUpTo,
  };
}
