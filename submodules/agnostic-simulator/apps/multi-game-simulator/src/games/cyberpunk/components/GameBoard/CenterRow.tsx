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
import { IconKeyboard } from "@tabler/icons-react";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import {
  AnimatedEntityCollection,
  AnimatedEntityNode,
  ClockReadout,
  MobileMirrorLedger,
  ResolvingEntityStage,
} from "@tcg/simulator-ui";
import {
  defOf,
  getProjectedDirectAttackGigStealCount,
  type CardInstance,
  type MatchState,
} from "@tcg/cyberpunk-engine";
import type { Ability, CardType } from "@tcg/cyberpunk-types";
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
import { CardImage } from "./CardImage";
import { useDragDrop } from "./DragDropContext";
import { useMoveSelection } from "./MoveSelectionContext";
import { useZoneDroppable } from "./useZoneDroppable";
import { useResolvingProgramVisuals } from "../../animation";
import { showBlockedPassTurnNotification } from "../blockedPassFeedback";
import { buildAdjustGigOptions } from "../adjustGigOptions";
import { compareGigStats, computeGigSideStats, type GigHelperComparison } from "./gigStats";
import { StreetCredHelperPopover, useStreetCredHelper } from "./StreetCredHelper";
import type { Phase } from "./gameStateTypes";
import classes from "./CenterRow.module.css";

const DIE_MAX_VALUES: Record<GigDieView["dieType"], number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
};

const GIG_LOG_HOVER_EVENT = "cyberpunk:gig-log-hover";
const GIG_COPY_SOURCE_EVENT = "cyberpunk:gig-copy-source";
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
  directAttackDropSurface?: boolean;
  directAttackDropTarget?: boolean;
  selectionHintForDie?: (dieId: string) => GigSelectionHint | undefined;
  onDieClick?: (dieId: string) => void;
  onAdjustGig?: (value: number) => void;
}) {
  const gigCount = dice.length;
  const hasWinCondition = gigCount >= WIN_GIG_THRESHOLD;
  const ownStats = useMemo(() => computeGigSideStats(dice), [dice]);
  const credHelper = useStreetCredHelper(side);
  const [diePopover, setDiePopover] = useState<GigDiePopoverState | null>(null);
  const compactScore = scoreVariant === "compact";
  const boardCorrectionEnabled = useEngineOptional()?.boardCorrectionEnabled === true;
  const directAttackDrop = useZoneDroppable(directAttackDropSurface ? "opp-gigArea" : null);
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
      ref={directAttackDrop.setNodeRef}
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
            {dice.map((die) => {
              const showAdjustPanel = adjustChoice?.dieId === die.id;
              return (
                <div
                  key={die.id}
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
                  {showAdjustPanel ? (
                    <GigAdjustPanel
                      choice={adjustChoice}
                      placement={side === "friendly" ? "bottom" : "top"}
                      onAdjustGig={onAdjustGig}
                    />
                  ) : null}
                </div>
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
  placement,
  onAdjustGig,
}: {
  choice: AdjustGigControl;
  placement: "top" | "bottom";
  onAdjustGig?: (value: number) => void;
}) {
  const adjustmentOptions = buildAdjustGigOptions(choice);
  if (adjustmentOptions.length === 0) {
    return null;
  }

  return (
    <div
      className={classes.adjustPanel}
      data-placement={placement}
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
    </div>
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
        <span>SC</span>
        <strong>{streetCred}</strong>
      </button>
      <StreetCredHelperPopover state={credHelper.state} helper={helper} compact />
    </>
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
}: {
  compact?: boolean;
  docked?: boolean;
}) {
  const { activeSide, prioritySide, turnNumber, phase, gameEnded, overtimeActive } = useGameState();
  const clock = useGameClock(prioritySide, { paused: gameEnded });
  const { humanSide } = useEngine();
  const rivalSide = otherSide(humanSide);
  const humanClock = clock[humanSide];
  const rivalClock = clock[rivalSide];
  const priorityLabel = prioritySide === humanSide ? "Your priority" : "Rival priority";
  const turnLabel = activeSide === humanSide ? "Your turn" : "Rival's turn";

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
      <div className={classes.clockMeta}>
        <span className={classes.clockLabel} data-testid="phase-turn">
          T{turnNumber}
        </span>
        <span className={classes.clockPhase} data-testid="phase-name">
          {phase}
        </span>
        {overtimeActive ? (
          <span className={classes.overtimeChip} data-testid="phase-overtime">
            Overtime
          </span>
        ) : null}
      </div>
      {!gameEnded ? (
        <div className={classes.clockChips}>
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
  const { phase, advancePhase, activeSide, prioritySide, gameEnded, overtimeActive } =
    useGameState();
  const { humanSide, matchState, moveLogs, aiMode, aiStrategies, stepOnce, dispatch } = useEngine();
  const aiSide = otherSide(humanSide);
  const aiInteractionView = useEngineInteractionView(aiSide);
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
    !isPlayerTurn &&
    interactionViewHasBlockers(humanInteractionView);
  const humanChoiceInProgress = humanInteractionView.status === "choosing";
  const canStepAi =
    !gameEnded &&
    aiMode === "step" &&
    aiStrategies[aiSide] !== null &&
    interactionViewIsActionable(aiInteractionView);
  const isWaitingForRival = prioritySide !== humanSide && !canStepAi;
  const controlsDisabled =
    phase === "SETUP" ||
    phase === "START" ||
    gameEnded ||
    humanChoiceInProgress ||
    disabledPassReason !== undefined ||
    isWaitingForRival ||
    isAttackerDuringReactStep ||
    (!isPlayerTurn && !canStepAi && !attackInProgress);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attackStateRef = useRef(matchState.G.attackState);
  attackStateRef.current = matchState.G.attackState;
  const attackSteps = attackInProgress
    ? buildAttackPhaseSteps(matchState.G.attackState, moveLogs)
    : [];

  useEffect(() => {
    if (
      controlsDisabled ||
      (pendingConfirmation === "pass-with-attackers" && !shouldConfirmPass) ||
      (pendingConfirmation === "skip-block" && !shouldConfirmSkipBlock)
    ) {
      setPendingConfirmation(null);
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
    if (canStepAi) {
      stepOnce();
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
          setPendingConfirmation("skip-block");
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
    canStepAi,
    controlsDisabled,
    disabledPassReason,
    dispatch,
    humanSide,
    performAdvance,
    shouldConfirmPass,
    shouldConfirmSkipBlock,
    stepOnce,
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
        setPendingConfirmation(null);
        return;
      }
      if (ev.key === " " || ev.code === PHASE_ADVANCE_HOTKEY) {
        ev.preventDefault();
        ev.stopPropagation();
        const confirmation = pendingConfirmation;
        setPendingConfirmation(null);
        if (confirmation === "skip-block") {
          dispatch({
            type: "resolveAttack",
            pass: true,
            as: PLAYER_SIDE_TO_ID[humanSide],
          });
        } else {
          performAdvance();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [dispatch, humanSide, pendingConfirmation, performAdvance]);

  const label = isWaitingForRival
    ? "WAITING"
    : phaseAdvanceLabel(phase, attackInProgress, canStepAi);
  const compactLabel = shouldConfirmSkipBlock
    ? "SKIP"
    : isWaitingForRival
      ? "WAITING"
      : compactPhaseAdvanceLabel(phase, attackInProgress, canStepAi);
  const compactActionLabel = shouldConfirmSkipBlock
    ? "Skip block"
    : isWaitingForRival
      ? "WAITING"
      : dockedPhaseAdvanceLabel(phase, attackInProgress, canStepAi);
  const pendingChoiceLabel = pendingChoiceActionLabel(matchState.G.turnMetadata.pendingChoice);
  const visibleLabel = shouldConfirmSkipBlock
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
      {!actionsOnly && attackSteps.length > 0 ? (
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
      ) : null}
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
      {pendingConfirmation
        ? createPortal(
            <div
              className={classes.confirmScrim}
              role="dialog"
              aria-modal="true"
              aria-labelledby={confirmTitleId}
            >
              <div className={classes.confirmSheet}>
                <p id={confirmTitleId} className={classes.confirmTitle}>
                  {pendingConfirmation === "skip-block"
                    ? "Skip your chance to block?"
                    : "Pass with attackers ready?"}
                </p>
                <p className={classes.confirmText}>
                  {pendingConfirmation === "skip-block"
                    ? "You have a ready BLOCKER. To block, choose it and select BLOCK. Continuing lets the attack through."
                    : "You still have Units that can attack. Passing ends your turn."}
                </p>
                <div className={classes.confirmActions}>
                  <button
                    type="button"
                    className={classes.confirmSecondary}
                    data-testid={
                      pendingConfirmation === "skip-block"
                        ? "skip-block-confirm-cancel"
                        : "pass-confirm-cancel"
                    }
                    aria-keyshortcuts="Escape"
                    onClick={() => setPendingConfirmation(null)}
                  >
                    <span>
                      {pendingConfirmation === "skip-block" ? "Back to blockers" : "Keep attacking"}
                    </span>
                    <DialogHotkeyHint label="Esc" />
                  </button>
                  <button
                    type="button"
                    className={classes.confirmPrimary}
                    data-testid={
                      pendingConfirmation === "skip-block"
                        ? "skip-block-confirm-submit"
                        : "pass-confirm-submit"
                    }
                    aria-keyshortcuts="Space"
                    onClick={() => {
                      const confirmation = pendingConfirmation;
                      setPendingConfirmation(null);
                      if (confirmation === "skip-block") {
                        dispatch({
                          type: "resolveAttack",
                          pass: true,
                          as: PLAYER_SIDE_TO_ID[humanSide],
                        });
                      } else {
                        performAdvance();
                      }
                    }}
                  >
                    <span>{pendingConfirmation === "skip-block" ? "Skip block" : "Pass turn"}</span>
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
    const timer = window.setTimeout(() => setVisibleSale(null), 1350);
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
        <CardImage imageUrl={card?.imageUrl} alt={card?.name ?? visibleSale.cardName} />
      </div>
      <div className={classes.sellRevealLabel}>
        <span>{opponent ? "Rival sold" : "Sold"}</span>
        <strong>{visibleSale.cardName}</strong>
      </div>
    </div>
  );
}

export function MobileClockRail() {
  const { prioritySide, turnNumber, phase, gameEnded } = useGameState();
  const clock = useGameClock(prioritySide, { paused: gameEnded });
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

function interactionViewIsActionable(view: ReturnType<typeof useEngineInteractionView>): boolean {
  return (
    view.status === "choosing" ||
    (view.status === "ready" && view.actions.some((action) => action.enabled))
  );
}

function disabledPassPhaseReason(
  view: ReturnType<typeof useEngineInteractionView>,
): string | undefined {
  const passPhase = view.actions.find((action) => action.id === "passPhase" && !action.enabled);
  const label = passPhase?.disabledText?.params?.label;
  return typeof label === "string" ? label : undefined;
}

function phaseAdvanceLabel(phase: string, attackInProgress: boolean, canStepAi: boolean): string {
  if (canStepAi) {
    return "NEXT AI MOVE ›";
  }
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

function compactPhaseAdvanceLabel(
  phase: string,
  attackInProgress: boolean,
  canStepAi: boolean,
): string {
  if (canStepAi) {
    return "AI";
  }
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

function dockedPhaseAdvanceLabel(
  phase: string,
  attackInProgress: boolean,
  canStepAi: boolean,
): string {
  if (canStepAi) {
    return "AI Move";
  }
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

type PendingChoice = NonNullable<MatchState["G"]["turnMetadata"]["pendingChoice"]>;

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
      const step = attackState.step;
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
  return attackState.step.toUpperCase();
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

function getVisibleAttackStep(
  attack: {
    attackerId?: unknown;
    defenderId?: unknown;
    kind?: string;
    step?: string;
  },
  moveLogs: ReadonlyArray<MoveLogEntry>,
): string | undefined {
  if (attack.step !== "attack" || attack.kind !== "fight") {
    return attack.step;
  }

  const wasRedirectedByBlocker = moveLogs.some((entry) => {
    const log = entry.log;
    return (
      log.type === "useBlocker" &&
      String(log.attackerId) === String(attack.attackerId) &&
      String(log.blockerId) === String(attack.defenderId)
    );
  });

  return wasRedirectedByBlocker ? "react" : attack.step;
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
  mobileLedger?: {
    rivalLegends: ReactNode;
    rivalLegendCount?: number;
    rivalLayout?: "scoreOnly" | "compact" | "singleRow" | "stacked";
    center?: ReactNode;
    friendlyLegends: ReactNode;
    friendlyLegendCount?: number;
    friendlyLayout?: "scoreOnly" | "compact" | "singleRow" | "stacked";
    density?: "scoreOnly" | "singleRow" | "stacked";
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
  mobileLedger,
}: CenterRowProps) {
  const { activeSide, gameEnded } = useGameState();
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
  const eligibleEffectGigIds = useMemo(
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
        action: "choose",
        required: effectGigChoice.max,
        selected: selectedEffectGigIds.length,
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
    resolvingCardFromPersistedVisuals({
      humanSide,
      resolvingProgramVisuals,
      cardIndex: matchState.G.cardIndex,
    });

  if (mobileLedger) {
    const friendlyStackedLegendLayout = mobileLedger.friendlyLayout === "stacked";
    const rivalStackedLegendLayout = mobileLedger.rivalLayout === "stacked";
    const friendlyShowsLegends = mobileLedger.friendlyLayout !== "scoreOnly";
    const rivalShowsLegends = mobileLedger.rivalLayout !== "scoreOnly";
    const mobileLedgerCenter = mobileLedger.center ? (
      <div className={classes.mobileLedgerPriority}>{mobileLedger.center}</div>
    ) : null;

    return (
      <div
        className={classes.mobileLedgerRoot}
        data-has-resolving={resolvingCard ? "true" : undefined}
      >
        <MobileMirrorLedger
          className={classes.mobileLedger}
          data-ledger-density={mobileLedger.density}
          aria-label="Mobile Legends, Street Cred, and Gig dice"
          left={
            <div
              className={classes.mobileLedgerSide}
              data-tone="friendly"
              data-legend-count={mobileLedger.friendlyLegendCount ?? undefined}
              data-side-layout={mobileLedger.friendlyLayout}
            >
              {friendlyTemporaryEffects.length > 0 ? (
                <MobileActiveEffectsStack effects={friendlyTemporaryEffects} tone="friendly" />
              ) : null}
              {friendlyStackedLegendLayout ? (
                <div className={classes.mobileLedgerLegendCred}>
                  <div
                    className={classes.mobileLedgerLegends}
                    data-legend-count={mobileLedger.friendlyLegendCount ?? undefined}
                    data-testid="mobile-ledger-legends"
                  >
                    {mobileLedger.friendlyLegends}
                  </div>
                </div>
              ) : friendlyShowsLegends ? (
                <div
                  className={classes.mobileLedgerLegends}
                  data-legend-count={mobileLedger.friendlyLegendCount ?? undefined}
                  data-testid="mobile-ledger-legends"
                >
                  {mobileLedger.friendlyLegends}
                </div>
              ) : null}
              <div className={classes.mobileLedgerGigWell}>
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
                    stealChoice !== null &&
                    friendly.gigArea.some((die) => eligibleStealIds.has(die.id))
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
            </div>
          }
          center={mobileLedgerCenter}
          right={
            <div
              className={classes.mobileLedgerSide}
              data-tone="rival"
              data-legend-count={mobileLedger.rivalLegendCount ?? undefined}
              data-side-layout={mobileLedger.rivalLayout}
            >
              {rivalTemporaryEffects.length > 0 ? (
                <MobileActiveEffectsStack effects={rivalTemporaryEffects} tone="rival" />
              ) : null}
              <div className={classes.mobileLedgerGigWell}>
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
                    stealChoice !== null &&
                    rival.gigArea.some((die) => eligibleStealIds.has(die.id))
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
              {rivalStackedLegendLayout ? (
                <div className={classes.mobileLedgerLegendCred}>
                  <div
                    className={classes.mobileLedgerLegends}
                    data-legend-count={mobileLedger.rivalLegendCount ?? undefined}
                    data-testid="mobile-ledger-legends"
                  >
                    {mobileLedger.rivalLegends}
                  </div>
                </div>
              ) : rivalShowsLegends ? (
                <div
                  className={classes.mobileLedgerLegends}
                  data-legend-count={mobileLedger.rivalLegendCount ?? undefined}
                  data-testid="mobile-ledger-legends"
                >
                  {mobileLedger.rivalLegends}
                </div>
              ) : null}
            </div>
          }
        />
        {resolvingCard ? <ResolvingCardAnchor card={resolvingCard} /> : null}
      </div>
    );
  }

  return (
    <div
      className={`${classes.row} ${gigsOnly ? classes.gigsOnly : ""} ${spaciousGigs ? classes.spaciousGigs : ""}`}
      data-interactive={canInteract ? "true" : "false"}
    >
      {!gigsOnly && (
        <div className={`${classes.cell} ${classes.clock}`}>
          <ClockDisplay />
        </div>
      )}
      <div className={`${classes.effectSide} ${classes.rivalEffectSide}`}>
        {hasRivalEffects ? (
          <ActiveEffectsRail effects={rivalTemporaryEffects} tone="rival" />
        ) : null}
        <GigLane
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
      {resolvingCard ? <ResolvingCardAnchor card={resolvingCard} /> : null}
      <div className={`${classes.effectSide} ${classes.friendlyEffectSide}`}>
        <GigLane
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
        {hasFriendlyEffects ? (
          <ActiveEffectsRail effects={friendlyTemporaryEffects} tone="friendly" />
        ) : null}
      </div>
      {!gigsOnly && (
        <div className={`${classes.cell} ${classes.pass}`}>
          <PassTurnControl />
        </div>
      )}
    </div>
  );
}

type CenterActiveEffect = CardActiveEffectView & { ownerSide: Side };

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
  cardType: CardType;
  faceDown?: boolean;
  label: string;
  name: string;
  imageUrl: string;
  color: "blue" | "green" | "red" | "yellow";
  rulesText: string | null;
};

function ResolvingCardAnchor({ card }: { card: ResolvingCard }) {
  const entity: SimulatorEntity = {
    id: card.cardId,
    title: card.name,
    subtitle: card.cardType,
    kind: "card",
    ownerId: "resolution",
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

  return (
    <ResolvingEntityStage
      entity={entity}
      active
      anchorId={`resolving-program:${card.cardId}`}
      label={card.label}
      className={classes.resolvingProgram}
      labelClassName={classes.resolvingProgramLabel}
      entityClassName={classes.resolvingProgramCard}
      testId="resolving-program"
    />
  );
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
    cardType: def.type,
    label: def.type === "gear" ? "Playing gear" : "Resolving program",
    name: def.displayName ?? def.name,
    imageUrl: def.imageUrl,
    color: def.color as ResolvingCard["color"],
    rulesText: def.rulesText ?? null,
  };
}

function resolvingCardFromPersistedVisuals({
  humanSide,
  resolvingProgramVisuals,
  cardIndex,
}: {
  humanSide: Side;
  resolvingProgramVisuals: ReturnType<typeof useResolvingProgramVisuals>;
  cardIndex: Record<string, CardInstance>;
}): ResolvingCard | null {
  const visual =
    resolvingProgramVisuals.find((candidate) => candidate.side === humanSide) ??
    resolvingProgramVisuals[0];
  if (!visual) {
    return null;
  }
  const card = cardIndex[visual.cardId];
  if (!card) {
    return null;
  }
  const def = defOf(card);
  if (!isResolvingCardType(def.type)) {
    return null;
  }
  return {
    cardId: visual.cardId,
    cardType: def.type,
    faceDown: visual.face === "hidden",
    label: visual.label ?? resolvingCardLabel(card, { persistedVisual: true }),
    name: def.displayName ?? def.name,
    imageUrl: def.imageUrl,
    color: def.color as ResolvingCard["color"],
    rulesText: def.rulesText ?? null,
  };
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
  return {
    side,
    view,
    requestId: action.requestId,
    min: targetInput.min,
    max: targetInput.max,
    ordered: targetInput.ordered,
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
      ariaLabel: "Copy value from",
      tooltip: "Step 1: copy value from",
    };
  }
  return {
    role: "copy-target",
    ariaLabel: "Change",
    tooltip: "Step 2: change to that value",
  };
}

function buildGigSelectionPrompt({
  action,
  required,
  selected,
}: {
  action: "choose" | "steal";
  required: number;
  selected: number;
}): GigSelectionPrompt | undefined {
  if (required <= 1) {
    return undefined;
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
