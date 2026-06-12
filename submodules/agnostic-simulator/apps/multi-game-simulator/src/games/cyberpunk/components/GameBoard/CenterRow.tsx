import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconKeyboard } from "@tabler/icons-react";
import { defOf, type CardInstance } from "@tcg/cyberpunk-engine";
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
  type GigDieView,
  type MoveLogEntry,
  type Side,
} from "../../engine";
import {
  interactionViewCanAttackRival,
  interactionViewHasAttackers,
} from "../../engine/interactionViewHelpers";
import { CardImage } from "./CardImage";
import { simEntityAnchor, simZoneAnchor } from "./animationAnchors";
import { useDragDrop } from "./DragDropContext";
import { useMoveSelection } from "./MoveSelectionContext";
import { useZoneDroppable } from "./useZoneDroppable";
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
const GIG_WIN_THRESHOLD = 6;
const PHASE_ADVANCE_HOTKEY = "Space";

export interface LastSoldCard {
  id: number;
  cardId: string;
  cardName: string;
  side: Side;
}

function GigDieCell({
  die,
  side,
  ownerSide,
  selectionActive,
  interactive,
  selected,
  selectionHint,
  logHighlighted,
  onClick,
}: {
  die: GigDieView;
  side: "rival" | "friendly";
  ownerSide: Side;
  selectionActive: boolean;
  interactive: boolean;
  selected?: boolean;
  selectionHint?: GigSelectionHint;
  logHighlighted?: boolean;
  onClick?: (dieId: string) => void;
}) {
  const className = `${classes.gigDie} ${classes[side]}`;
  const baseLabel = selectionHint
    ? `${selectionHint.ariaLabel} ${die.label}, showing ${die.faceValue}`
    : interactive
      ? `Select ${die.label}, showing ${die.faceValue}`
      : `${die.label}, showing ${die.faceValue}`;
  const ariaLabel = selected ? `${die.label} selected, showing ${die.faceValue}` : baseLabel;
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
    "data-face": die.faceValue,
    "data-selection-active": selectionActive ? "true" : "false",
    "data-interactive": interactive ? "true" : "false",
    "data-selected": selected ? "true" : "false",
    "data-selection-role": selectionHint?.role,
    "data-log-highlight": logHighlighted ? "true" : "false",
    ...simEntityAnchor({
      entityId: die.id,
      zoneId: `${ownerSide === "player" ? "p" : "opp"}-gigs`,
      side: ownerSide,
      face: "public" as const,
    }),
  };
  const content = (
    <DieDisplay
      dieType={die.dieType}
      faceValue={die.faceValue}
      label={die.label}
      side={side}
      size="md"
    />
  );

  if (interactive && onClick) {
    return (
      <button
        {...commonProps}
        type="button"
        aria-pressed={selected}
        onClick={() => onClick(die.id)}
      >
        {content}
      </button>
    );
  }

  return (
    <div {...commonProps} aria-disabled={!interactive}>
      {content}
    </div>
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
  interactive,
  interactiveDieIds,
  selectedDieIds,
  logHighlightedDieId,
  adjustChoice,
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
  interactive: boolean;
  interactiveDieIds?: ReadonlySet<string>;
  selectedDieIds?: ReadonlySet<string>;
  logHighlightedDieId?: string | null;
  adjustChoice?: AdjustGigControl | null;
  selectionHintForDie?: (dieId: string) => GigSelectionHint | undefined;
  onDieClick?: (dieId: string) => void;
  onAdjustGig?: (value: number) => void;
}) {
  const gigCount = dice.length;
  const hasWinCondition = gigCount >= GIG_WIN_THRESHOLD;
  const adjustmentOptions = adjustChoice ? buildAdjustGigOptions(adjustChoice) : [];
  const adjustedDie = adjustChoice ? dice.find((die) => die.id === adjustChoice.dieId) : undefined;
  const adjustLabel = adjustedDie?.label ?? adjustChoice?.label ?? "Gig";

  return (
    <div
      className={`${classes.cell} ${gridClass} ${classes.gigLane}`}
      data-testid="gig-row"
      data-side={ownerSide}
      data-count={gigCount}
      data-street-cred={streetCred}
      data-win-condition={hasWinCondition ? "true" : "false"}
      data-selection-active={interactive ? "true" : "false"}
      {...simZoneAnchor({
        id: `${ownerSide === "player" ? "p" : "opp"}-gigs`,
        side: ownerSide,
        visibility: "public",
        role: "resource",
      })}
      aria-label={`${label}: ${gigCount} Gigs, ${streetCred} Street Cred${hasWinCondition ? ", win condition active" : ""}`}
    >
      <div className={classes.gigScore} aria-hidden="true">
        <span className={classes.gigCred}>
          <span>Street Cred</span>
          <strong>{streetCred}</strong>
        </span>
        {hasWinCondition ? (
          <span className={classes.gigWinMarker} data-testid="gig-win-condition">
            6+ Gigs
          </span>
        ) : null}
      </div>
      <div className={classes.gigTrack}>
        <div className={classes.gigInner}>
          {dice.map((die) => (
            <GigDieCell
              key={die.id}
              die={die}
              side={side}
              ownerSide={ownerSide}
              selectionActive={interactive}
              interactive={interactive && (!interactiveDieIds || interactiveDieIds.has(die.id))}
              selected={selectedDieIds?.has(die.id)}
              selectionHint={
                interactive && (!interactiveDieIds || interactiveDieIds.has(die.id))
                  ? selectionHintForDie?.(die.id)
                  : undefined
              }
              logHighlighted={logHighlightedDieId === die.id}
              onClick={onDieClick}
            />
          ))}
          {gigCount === 0 ? <span className={classes.gigEmpty}>No Gigs</span> : null}
        </div>
      </div>
      {adjustChoice && adjustmentOptions.length > 0 ? (
        <div
          className={`${classes.adjustPanel} ${side === "friendly" ? classes.adjustPanelFriendly : ""}`}
          data-testid="gig-adjust-panel"
          data-die-id={adjustChoice.dieId}
          aria-label={`Adjust ${adjustLabel}`}
        >
          <span className={classes.adjustTitle}>Adjust {adjustLabel}</span>
          <div className={classes.adjustChoices}>
            {adjustmentOptions.map((option) => (
              <button
                key={`${option.delta}:${option.value}`}
                type="button"
                className={classes.adjustButton}
                data-testid="gig-adjust-option"
                data-delta={option.delta}
                data-value={option.value}
                aria-label={`${option.label} to ${option.value}`}
                onClick={() => onAdjustGig?.(option.value)}
              >
                <span>{option.label}</span>
                <strong>{option.value}</strong>
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <ZoneBadge position={badgePosition} className={badgeClass}>
        {label}
        <span className={classes.gigBadgeTotal}>{gigCount}</span>
      </ZoneBadge>
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
}: {
  compact?: boolean;
  docked?: boolean;
}) {
  const { activeSide, prioritySide, turnNumber, phase, gameEnded } = useGameState();
  const clock = useGameClock(prioritySide, { paused: gameEnded });
  const { humanSide } = useEngine();
  const rivalSide = otherSide(humanSide);
  const humanClock = clock[humanSide];
  const rivalClock = clock[rivalSide];
  const priorityLabel = prioritySide === humanSide ? "Your priority" : "Rival priority";

  return (
    <div
      className={`${classes.clockInner} ${compact ? classes.clockCompact : ""} ${docked ? classes.clockDocked : ""} ${
        clock.active.urgent ? classes.clockUrgent : ""
      } ${clock.active.critical ? classes.clockCritical : ""}`}
      data-testid="phase-clock"
      data-turn={turnNumber}
      data-phase={phase}
      data-active-side={activeSide}
      data-clock-side={prioritySide}
      aria-label={`Turn ${turnNumber} ${phase}. ${priorityLabel}. Rival clock ${rivalClock.time}. Your clock ${humanClock.time}.`}
    >
      <div className={classes.clockMeta}>
        <span className={classes.clockLabel} data-testid="phase-turn">
          T{turnNumber}
        </span>
        <span className={classes.clockPhase} data-testid="phase-name">
          {phase}
        </span>
      </div>
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
    <div
      className={classes.clockFace}
      data-active={active ? "true" : "false"}
      data-tone={tone}
      data-urgent={urgent ? "true" : "false"}
      data-critical={critical ? "true" : "false"}
      aria-hidden="true"
    >
      <span>{label}</span>
      <strong className={classes.clockTime} data-testid={active ? "phase-clock-time" : undefined}>
        {time}
      </strong>
    </div>
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
}: {
  compact?: boolean;
  docked?: boolean;
  compactLabelStyle?: "short" | "action";
}) {
  const { phase, advancePhase, activeSide, gameEnded } = useGameState();
  const { humanSide, matchState, moveLogs, aiMode, aiStrategies, canUndo, stepOnce, dispatch } =
    useEngine();
  const aiSide = otherSide(humanSide);
  const aiInteractionView = useEngineInteractionView(aiSide);
  const humanInteractionView = useEngineInteractionView(humanSide);
  const confirmTitleId = useId();
  const [pressed, setPressed] = useState(false);
  const [confirmingPassWithAttackers, setConfirmingPassWithAttackers] = useState(false);
  const isPlayerTurn = activeSide === humanSide;
  const attackInProgress = Boolean(matchState.G.attackState);
  const isAttackerDuringDefensiveStep =
    attackInProgress && matchState.G.attackState?.step === "defensive" && isPlayerTurn;
  const shouldConfirmPass =
    isPlayerTurn && !attackInProgress && interactionViewHasAttackers(humanInteractionView);
  const humanChoiceInProgress = humanInteractionView.status === "choosing";
  const canStepAi =
    !gameEnded &&
    aiMode === "step" &&
    aiStrategies[aiSide] !== null &&
    interactionViewIsActionable(aiInteractionView);
  const controlsDisabled =
    phase === "SETUP" ||
    phase === "START" ||
    gameEnded ||
    humanChoiceInProgress ||
    isAttackerDuringDefensiveStep ||
    (!isPlayerTurn && !canStepAi && !attackInProgress);
  const undoDisabled = !canUndo || humanChoiceInProgress;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attackStateRef = useRef(matchState.G.attackState);
  attackStateRef.current = matchState.G.attackState;
  const attackSteps = attackInProgress
    ? buildAttackPhaseSteps(matchState.G.attackState, moveLogs)
    : [];

  useEffect(() => {
    if (!shouldConfirmPass || controlsDisabled) {
      setConfirmingPassWithAttackers(false);
    }
  }, [controlsDisabled, shouldConfirmPass]);

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
      return;
    }
    if (canStepAi) {
      stepOnce();
      return;
    }
    if (attackInProgress) {
      const attack = attackStateRef.current;
      if (!attack) return;

      // During the defensive step, only the defender (rival / non-active player)
      // may resolve. The active player must wait for the defender's response.
      if (attack.step === "defensive") {
        if (isPlayerTurn) {
          // Attacker cannot act during the defender's response window.
          return;
        }
        dispatch({
          type: "resolveAttack",
          pass: true,
          as: PLAYER_SIDE_TO_ID[humanSide],
        });
        return;
      }

      // Offensive, fight, defeat, and steal steps are all resolved by the
      // active player (the attacker).
      dispatch({
        type: "resolveAttack",
        as: PLAYER_SIDE_TO_ID[activeSide],
      });
      return;
    }
    if (shouldConfirmPass) {
      setConfirmingPassWithAttackers(true);
      return;
    }
    performAdvance();
  }, [
    activeSide,
    attackInProgress,
    canStepAi,
    controlsDisabled,
    dispatch,
    humanSide,
    performAdvance,
    shouldConfirmPass,
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
        confirmingPassWithAttackers ||
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
  }, [confirmingPassWithAttackers, handleAdvance]);

  const label = phaseAdvanceLabel(phase, attackInProgress, canStepAi);
  const compactLabel = compactPhaseAdvanceLabel(phase, attackInProgress, canStepAi);
  const compactActionLabel = dockedPhaseAdvanceLabel(phase, attackInProgress, canStepAi);
  const visibleLabel = docked ? dockedPhaseAdvanceLabel(phase, attackInProgress, canStepAi) : label;
  const usesActionCompactLabel = compact && compactLabelStyle === "action";
  const attackTarget = useAttackTargetSummary(matchState.G.attackState);

  return (
    <div
      className={`${classes.passInner} ${compact ? classes.passCompact : ""} ${docked ? classes.passDocked : ""}`}
      data-testid="phase-hud"
      data-phase={phase}
      data-active-side={activeSide}
      data-attack-in-progress={attackInProgress ? "true" : "false"}
      data-choice-in-progress={humanChoiceInProgress ? "true" : "false"}
    >
      <span
        className={`${classes.phaseLabel} ${attackTarget ? classes.phaseLabelWithTarget : ""}`}
        data-testid="phase-hud-label"
      >
        <span>{phaseLabel(phase, matchState.G.attackState)}</span>
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
          </span>
        ) : null}
      </span>
      {attackSteps.length > 0 ? (
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
      <button
        type="button"
        aria-label={label}
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
            <HotkeyHint block />
          </>
        ) : compact ? (
          <>
            <span>{compactLabel}</span>
            <HotkeyHint />
            <span aria-hidden="true" className={classes.passChevron}>
              ›
            </span>
          </>
        ) : (
          <>
            <span>{visibleLabel}</span>
            <HotkeyHint />
          </>
        )}
      </button>
      <button
        type="button"
        className={`${classes.undoBtn} ${compact ? classes.undoBtnCompact : ""} ${docked ? classes.undoBtnDocked : ""}`}
        data-testid="phase-undo"
        aria-label={
          canUndo
            ? humanChoiceInProgress
              ? "Resolve current prompt before undoing"
              : "Undo last move"
            : "No undoable move available"
        }
        onClick={() => {
          if (undoDisabled) {
            return;
          }
          dispatch({ type: "undo" });
        }}
        disabled={undoDisabled}
      >
        Undo
      </button>
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
                      performAdvance();
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
  attack: {
    attackerId?: unknown;
    defenderId?: unknown;
    kind?: string;
  } | null,
): {
  kind: "direct" | "fight";
  value: string;
  ariaLabel: string;
  title: string;
} | null {
  const attacker = useCardView(cardIdFromAttack(attack?.attackerId));
  const defender = useCardView(cardIdFromAttack(attack?.defenderId));

  if (!attack?.kind) {
    return null;
  }

  if (attack.kind === "direct") {
    return {
      kind: "direct",
      value: "Player",
      ariaLabel: "Attack target: player",
      title: attacker ? `${attacker.name} is attacking the rival directly` : "Attacking the rival",
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

function interactionViewIsActionable(view: ReturnType<typeof useEngineInteractionView>): boolean {
  return (
    view.status === "choosing" ||
    (view.status === "ready" && view.actions.some((action) => action.enabled))
  );
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
      { id: "offensive", label: "Offense", active: step === "offensive" },
      { id: "defensive", label: "Defense", active: step === "defensive" },
      { id: "steal", label: "Steal", active: step === "steal" },
    ];
  }

  return [
    { id: "offensive", label: "Offense", active: step === "offensive" },
    { id: "defensive", label: "Defense", active: step === "defensive" },
    { id: "fight", label: "Fight", active: step === "fight" },
    { id: "defeat", label: "Defeat", active: step === "defeat" },
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
  if (attack.step !== "offensive" || attack.kind !== "fight") {
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

  return wasRedirectedByBlocker ? "defensive" : attack.step;
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
}

/**
 * CenterRow shows each side's claimed Gig dice (the gig area). Per the alpha
 * rules each die is rolled once when taken from the fixer area and is not
 * re-rolled afterwards, so these tiles are read-only — the engine owns the
 * face value.
 */
export function CenterRow({ gigsOnly = false, spaciousGigs = false }: CenterRowProps) {
  const { activeSide, gameEnded } = useGameState();
  const { humanSide, dispatch, interactionViews, matchState } = useEngine();
  const moveSelection = useMoveSelection();
  const rivalSide = otherSide(humanSide);
  const friendly = useSideZones(humanSide);
  const rival = useSideZones(rivalSide);
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
  const canInteract =
    !gameEnded &&
    (activeSide === humanSide ||
      Boolean(stealChoice) ||
      Boolean(effectGigChoice) ||
      Boolean(adjustGigChoice));
  const eligibleStealIds = useMemo(
    () => new Set<string>(stealChoice?.eligibleDieIds ?? []),
    [stealChoice],
  );
  const eligibleEffectGigIds = useMemo(
    () => new Set<string>(effectGigChoice?.eligibleDieIds ?? []),
    [effectGigChoice],
  );
  const softAdjustGigChoice = effectGigChoice?.adjustGig ? effectGigChoice : null;
  const eligibleAdjustGigIds = useMemo(
    () => new Set<string>(adjustGigChoice ? [adjustGigChoice.control.dieId] : []),
    [adjustGigChoice],
  );
  const [selectedStealIds, setSelectedStealIds] = useState<string[]>([]);
  const [selectedEffectGigIds, setSelectedEffectGigIds] = useState<string[]>([]);
  const [logHighlightedGigId, setLogHighlightedGigId] = useState<string | null>(null);
  const selectedStealIdSet = useMemo(() => new Set(selectedStealIds), [selectedStealIds]);
  const selectedEffectGigIdSet = useMemo(
    () => new Set(selectedEffectGigIds),
    [selectedEffectGigIds],
  );
  const effectGigSelectionHintForDie = (dieId: string) =>
    buildEffectGigSelectionHint(effectGigChoice ?? undefined, selectedEffectGigIds, dieId);

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
    if (softAdjustGigChoice) {
      setSelectedEffectGigIds([dieId]);
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
  const handleAdjustGigValue = (value: number) => {
    const selectedEffectGigId = selectedEffectGigIds[0];
    if (softAdjustGigChoice && selectedEffectGigId) {
      const submission = buildInteractionSubmissionForActionId({
        view: softAdjustGigChoice.view,
        actionId: "resolveEffectTarget",
        values: { targetIds: [selectedEffectGigId] },
      });
      const action = submission
        ? interactionSubmissionToEngineAction(
            submission,
            PLAYER_SIDE_TO_ID[softAdjustGigChoice.side],
          )
        : null;
      if (action) {
        dispatch(action);
      }
      dispatch({
        type: "resolveAdjustGig",
        value,
        as: PLAYER_SIDE_TO_ID[softAdjustGigChoice.side],
      });
      setSelectedEffectGigIds([]);
      return;
    }
    if (!adjustGigChoice) {
      return;
    }
    const submission = buildInteractionSubmissionForActionId({
      view: adjustGigChoice.view,
      actionId: "resolveAdjustGig",
      values: { value },
    });
    const action = submission
      ? interactionSubmissionToEngineAction(submission, PLAYER_SIDE_TO_ID[adjustGigChoice.side])
      : null;
    if (action) {
      dispatch(action);
    }
  };

  const rivalEffectGigActive = effectGigChoice
    ? rival.gigArea.some((die) => eligibleEffectGigIds.has(die.id))
    : false;
  const friendlyEffectGigActive = effectGigChoice
    ? friendly.gigArea.some((die) => eligibleEffectGigIds.has(die.id))
    : false;
  const rivalAdjustGigActive = adjustGigChoice
    ? rival.gigArea.some((die) => die.id === adjustGigChoice.control.dieId)
    : false;
  const friendlyAdjustGigActive = adjustGigChoice
    ? friendly.gigArea.some((die) => die.id === adjustGigChoice.control.dieId)
    : false;
  const softAdjustControl = softAdjustGigChoice?.adjustGig
    ? buildSoftAdjustGigControl(
        [...rival.gigArea, ...friendly.gigArea].find((die) => die.id === selectedEffectGigIds[0]),
        softAdjustGigChoice.adjustGig,
      )
    : null;
  const rivalSoftAdjustActive = softAdjustControl
    ? rival.gigArea.some((die) => die.id === softAdjustControl.dieId)
    : false;
  const friendlySoftAdjustActive = softAdjustControl
    ? friendly.gigArea.some((die) => die.id === softAdjustControl.dieId)
    : false;
  const resolvingCard =
    resolvingCardFromInteractionViews({
      humanSide,
      interactionViews,
      cardIndex: matchState.G.cardIndex,
    }) ?? selectedPlayedCardFromMoveSelection(moveSelection.selection, matchState.G.cardIndex);

  return (
    <div
      className={`${classes.row} ${classes[`turn-${activeSide}`] ?? ""} ${gigsOnly ? classes.gigsOnly : ""} ${spaciousGigs ? classes.spaciousGigs : ""}`}
      data-interactive={canInteract ? "true" : "false"}
    >
      {!gigsOnly && (
        <div className={`${classes.cell} ${classes.clock}`}>
          <ClockDisplay />
        </div>
      )}
      <GigLane
        label="Rival Gigs"
        side="rival"
        ownerSide={rivalSide}
        gridClass={classes.rival}
        badgeClass={classes.gigBadgeRival}
        badgePosition="top"
        dice={rival.gigArea}
        streetCred={rival.streetCred}
        interactive={
          (stealChoice !== null && rival.gigArea.some((die) => eligibleStealIds.has(die.id))) ||
          rivalEffectGigActive ||
          rivalAdjustGigActive ||
          rivalSoftAdjustActive
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
            ? eligibleAdjustGigIds
            : rivalSoftAdjustActive || rivalEffectGigActive
              ? selectedEffectGigIdSet
              : selectedStealIdSet
        }
        logHighlightedDieId={logHighlightedGigId}
        adjustChoice={
          rivalAdjustGigActive
            ? adjustGigChoice?.control
            : rivalSoftAdjustActive
              ? softAdjustControl
              : null
        }
        selectionHintForDie={effectGigChoice ? effectGigSelectionHintForDie : undefined}
        onDieClick={
          stealChoice ? handleStealDieClick : effectGigChoice ? handleEffectGigClick : undefined
        }
        onAdjustGig={handleAdjustGigValue}
      />
      {resolvingCard ? (
        <div
          className={classes.resolvingProgram}
          data-testid="resolving-program"
          data-card-id={resolvingCard.cardId}
          data-card-type={resolvingCard.cardType}
          aria-label={`${resolvingCard.label}: ${resolvingCard.name}`}
        >
          <span className={classes.resolvingProgramLabel}>{resolvingCard.label}</span>
          <div className={classes.resolvingProgramCard}>
            <CardImage
              imageUrl={resolvingCard.imageUrl}
              alt={resolvingCard.name}
              cardType={resolvingCard.cardType}
              color={resolvingCard.color}
              previewDetails={{
                name: resolvingCard.name,
                rules: resolvingCard.rulesText ? [resolvingCard.rulesText] : undefined,
              }}
            />
          </div>
        </div>
      ) : null}
      <GigLane
        label="Friendly Gigs"
        side="friendly"
        ownerSide={humanSide}
        gridClass={classes.friendly}
        badgeClass={classes.gigBadgeFriendly}
        badgePosition="bottom"
        dice={friendly.gigArea}
        streetCred={friendly.streetCred}
        interactive={
          (stealChoice !== null && friendly.gigArea.some((die) => eligibleStealIds.has(die.id))) ||
          friendlyEffectGigActive ||
          friendlyAdjustGigActive ||
          friendlySoftAdjustActive
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
            ? eligibleAdjustGigIds
            : friendlySoftAdjustActive || friendlyEffectGigActive
              ? selectedEffectGigIdSet
              : selectedStealIdSet
        }
        logHighlightedDieId={logHighlightedGigId}
        adjustChoice={
          friendlyAdjustGigActive
            ? adjustGigChoice?.control
            : friendlySoftAdjustActive
              ? softAdjustControl
              : null
        }
        selectionHintForDie={effectGigChoice ? effectGigSelectionHintForDie : undefined}
        onDieClick={
          stealChoice ? handleStealDieClick : effectGigChoice ? handleEffectGigClick : undefined
        }
        onAdjustGig={handleAdjustGigValue}
      />
      {!gigsOnly && (
        <div className={`${classes.cell} ${classes.pass}`}>
          <PassTurnControl />
        </div>
      )}
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
  control: AdjustGigControl;
};
type AdjustGigOption = {
  delta: number;
  label: string;
  value: number;
};
type ResolvingCard = {
  cardId: string;
  cardType: "program" | "gear";
  label: string;
  name: string;
  imageUrl: string;
  color: "blue" | "green" | "red" | "yellow";
  rulesText: string | null;
};

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
    (candidate) => candidate.enabled && candidate.id === "resolveEffectTarget",
  );
  if (action?.source?.kind !== "card") {
    return null;
  }
  const cardId = action.source.instanceId;
  const card = cardIndex[cardId];
  if (!card) {
    return null;
  }
  const def = defOf(card);
  if (def.type !== "program") {
    return null;
  }
  return {
    cardId,
    cardType: "program",
    label: "Resolving program",
    name: def.displayName ?? def.name,
    imageUrl: def.imageUrl,
    color: def.color as ResolvingCard["color"],
    rulesText: def.rulesText ?? null,
  };
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
  const dieId = action?.source?.kind === "die" ? action.source.instanceId : undefined;
  const valueInput = action?.inputs.find(
    (input) => input.kind === "number" && input.id === "value",
  );
  if (!action || valueInput?.kind !== "number" || !dieId) {
    return null;
  }
  const die = dice.find((candidate) => candidate.id === dieId);
  if (!die) {
    return null;
  }
  return {
    side,
    view,
    requestId: action.requestId,
    control: {
      dieId,
      label: die.label,
      currentValue: die.faceValue,
      maxFaceValue: DIE_MAX_VALUES[die.dieType],
      maxAmount: Math.max(
        Math.abs((valueInput.min ?? die.faceValue) - die.faceValue),
        Math.abs((valueInput.max ?? die.faceValue) - die.faceValue),
      ),
      chooseUpTo: action.text.params?.chooseUpTo === true,
      minValue: valueInput.min,
      maxValue: valueInput.max,
    },
  };
}

function buildAdjustGigOptions(choice: AdjustGigControl): AdjustGigOption[] {
  const options: AdjustGigOption[] = [];
  if (choice.minValue !== undefined || choice.maxValue !== undefined) {
    const min = Math.max(1, choice.minValue ?? 1);
    const max = Math.min(choice.maxFaceValue, choice.maxValue ?? choice.maxFaceValue);
    for (let value = min; value <= max; value += 1) {
      const delta = value - choice.currentValue;
      if (delta === 0 && !choice.chooseUpTo) {
        continue;
      }
      options.push({
        delta,
        label: delta > 0 ? `+${delta}` : String(delta),
        value,
      });
    }
    return options;
  }
  for (let delta = -choice.maxAmount; delta <= choice.maxAmount; delta += 1) {
    if (delta === 0 && !choice.chooseUpTo) {
      continue;
    }
    if (choice.direction === "increase" && delta < 0) {
      continue;
    }
    if (choice.direction === "decrease" && delta > 0) {
      continue;
    }
    const value = choice.currentValue + delta;
    if (value < 1 || value > choice.maxFaceValue) {
      continue;
    }
    options.push({
      delta,
      label: delta > 0 ? `+${delta}` : String(delta),
      value,
    });
  }
  return options;
}

function buildSoftAdjustGigControl(
  die: GigDieView | undefined,
  adjustGig: NonNullable<ProtocolEffectGigChoice["adjustGig"]>,
): AdjustGigControl | null {
  if (!die) {
    return null;
  }
  return {
    dieId: die.id,
    label: die.label,
    currentValue: die.faceValue,
    maxFaceValue: DIE_MAX_VALUES[die.dieType],
    maxAmount: Math.max(0, adjustGig.maxAmount ?? 0),
    direction: adjustGig.direction,
    chooseUpTo: adjustGig.chooseUpTo,
  };
}
