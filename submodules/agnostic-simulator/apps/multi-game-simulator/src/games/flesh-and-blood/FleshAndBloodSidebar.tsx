import {
  EventLogPanel,
  SimulatorActivityTabs,
  SimulatorMatchActionDock,
  SimulatorMatchParticipantView,
  SimulatorMatchSidebar,
  type SimulatorMatchActions,
  type SimulatorMatchActivity,
  type SimulatorMatchAutomation,
  type SimulatorMatchParticipant,
} from "@tcg/simulator-ui";
import type {
  SimulatorCardReference,
  SimulatorEventLogEntry,
  SimulatorMatchHistoryRow,
} from "@tcg/simulator-contract";
import { Button, Group, Kbd, Modal, Text } from "@mantine/core";
import { ArrowLeft, RotateCcw, Space } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";

import type { FabPresentationState } from "./state";
import { FabHistoryCardReference } from "./FabHistoryCardReference";
import { FabMatchHistoryPanel } from "./FabMatchHistoryPanel";
import { SupporterPlayerName } from "../../components/SupporterPlayerName";

export interface FabSidebarLocalPracticeIdentity {
  readonly kind: "human" | "bot";
  readonly heroName?: string;
  readonly deckLabel?: string;
  readonly controlLabel: string;
}

export interface FabSidebarPlayerSnapshot {
  readonly playerId: string;
  readonly life: number;
  readonly resourcePoints: number;
  readonly actionPoints: number;
  readonly intellect?: number;
  readonly localPractice?: FabSidebarLocalPracticeIdentity;
  readonly displayName?: string;
  readonly subscriptionTier?: string;
  /** Only supplied for ranked participants with completed placements at match start. */
  readonly rankedMmr?: number;
  readonly heroName?: string;
  readonly connection?: ReactNode;
  readonly clock?: ReactNode;
  readonly actions?: ReactNode;
}

export interface FleshAndBloodSidebarProps {
  readonly state: FabPresentationState;
  readonly viewerId: string;
  readonly opponentId: string;
  readonly self: FabSidebarPlayerSnapshot;
  readonly opponent: FabSidebarPlayerSnapshot;
  /** Sync / conflict / pending label shown in the activity region. */
  readonly status: ReactNode;
  readonly sidebarExtra?: ReactNode;
  /**
   * Page-owned action surface (practice legal moves, fixture switcher content
   * embedded by the page, replay chrome). Lives in the flexible activity band
   * so hierarchical controls are not crushed into the fixed action dock.
   */
  readonly matchActions?: ReactNode;
  /** Trusted return destination shown instead of player controls while spectating. */
  readonly spectatorReturnHref?: string;
  /** Optional fully composed activity tabs for game-owned local/dev surfaces. */
  readonly activity?: SimulatorMatchActivity;
  /** Optional game-owned label for the primary activity surface. */
  readonly activityLogLabel?: string;
  /** The page-owned activity renders its own current-state hierarchy. */
  readonly activityOwnsStatus?: boolean;
  /**
   * Shared event-log feed for the default activity log tab. Pages that own
   * canonical engine move logs project them via `projectFabLogEntries` and
   * supply the entries here; page-owned match chrome still composes around
   * it per the shared simulator sidebar layout.
   */
  readonly eventLog?: readonly SimulatorEventLogEntry[];
  /** Flat player-readable history; eventLog remains the development trace. */
  readonly matchHistory?: readonly SimulatorMatchHistoryRow[];
  readonly replayControls?: ReactNode;
  /** Local-practice bot ownership and seat-takeover controls. */
  readonly automation?: SimulatorMatchAutomation;
  /** Public, game-owned context that should remain above the activity feed. */
  readonly matchContext?: ReactNode;
  readonly onConcede?: () => void;
  /** Live matches already own an authoritative confirmation at the page boundary. */
  readonly confirmConcede?: boolean;
  readonly onPassPriority?: () => void;
  /** The dock always exposes pass, but only enables it for the current legal priority window. */
  readonly canPassPriority?: boolean;
  /** The current decision prompt may temporarily own the primary action. */
  readonly showPassPriority?: boolean;
  /** Reuses the persistent priority slot for another step-owned primary action. */
  readonly passPriorityLabel?: string;
  readonly onUndo?: () => void;
  readonly canUndo?: boolean;
  /** Replaces gameplay actions after the game ends and reopens the summary. */
  readonly onOpenGameSummary?: () => void;
  readonly actionsDisabled?: boolean;
  readonly className?: string;
}

/**
 * FAB-owned adapter over the shared match-sidebar contract.
 * Hierarchy is owned by `SimulatorMatchSidebar`; FAB only maps state and labels.
 */
export function FleshAndBloodSidebar({
  state,
  viewerId,
  opponentId,
  self,
  opponent,
  status,
  sidebarExtra,
  matchActions,
  spectatorReturnHref,
  activity,
  activityLogLabel,
  activityOwnsStatus = false,
  eventLog,
  matchHistory,
  replayControls,
  automation,
  matchContext,
  onConcede,
  confirmConcede = true,
  onPassPriority,
  canPassPriority = false,
  showPassPriority = true,
  passPriorityLabel,
  onUndo,
  canUndo,
  onOpenGameSummary,
  actionsDisabled = false,
  className,
}: FleshAndBloodSidebarProps) {
  const pageOwnedActions = matchActions ?? replayControls ?? null;

  return (
    <SimulatorMatchSidebar
      className={[
        "fab-match-sidebar",
        activityOwnsStatus ? "fab-practice-match-sidebar" : undefined,
        spectatorReturnHref ? "fab-spectator-match-sidebar" : undefined,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={fabSidebarStyle}
      data-testid="fab-sidebar"
      opponent={toFabParticipant({
        snapshot: opponent,
        role: "opponent",
        state,
        viewerId,
      })}
      self={toFabParticipant({
        snapshot: self,
        role: "self",
        state,
        viewerId,
      })}
      activity={
        activity ??
        buildFabActivity({
          state,
          viewerId,
          opponentId,
          status,
          sidebarExtra,
          pageOwnedActions,
          activityLogLabel,
          activityOwnsStatus,
          eventLog,
          matchHistory,
        })
      }
      activityLabel="Match activity"
      automation={automation}
      context={matchContext}
      contextLabel="Current rules state"
      actions={buildFabMatchActions({
        spectatorReturnHref,
        onConcede,
        confirmConcede,
        onPassPriority,
        canPassPriority,
        showPassPriority,
        passPriorityLabel,
        onUndo,
        canUndo,
        onOpenGameSummary,
        disabled: actionsDisabled,
      })}
    />
  );
}

/**
 * Phone drawer counterpart to the desktop sidebar.
 *
 * The complete activity and action contracts stay shared with desktop, while
 * participant and automation detail use compact disclosure so History/Now/Lab
 * keep useful height on short landscape phones.
 */
export function FleshAndBloodMobilePanel({
  state,
  viewerId,
  opponentId,
  self,
  opponent,
  status,
  sidebarExtra,
  matchActions,
  spectatorReturnHref,
  activity,
  activityLogLabel,
  activityOwnsStatus = false,
  eventLog,
  matchHistory,
  replayControls,
  automation,
  matchContext,
  onConcede,
  confirmConcede = true,
  onPassPriority,
  canPassPriority = false,
  showPassPriority = true,
  passPriorityLabel,
  onUndo,
  canUndo,
  onOpenGameSummary,
  actionsDisabled = false,
}: FleshAndBloodSidebarProps) {
  const pageOwnedActions = matchActions ?? replayControls ?? null;
  const opponentParticipant = toFabParticipant({
    snapshot: opponent,
    role: "opponent",
    state,
    viewerId,
  });
  const selfParticipant = toFabParticipant({
    snapshot: self,
    role: "self",
    state,
    viewerId,
  });
  const resolvedActivity =
    activity ??
    buildFabActivity({
      state,
      viewerId,
      opponentId,
      status,
      sidebarExtra,
      pageOwnedActions,
      activityLogLabel,
      activityOwnsStatus,
      eventLog,
      matchHistory,
    });
  const resolvedActions = buildFabMatchActions({
    spectatorReturnHref,
    onConcede,
    confirmConcede,
    onPassPriority,
    canPassPriority,
    showPassPriority,
    passPriorityLabel,
    onUndo,
    canUndo,
    onOpenGameSummary,
    disabled: actionsDisabled,
  });

  return (
    <section
      className="fab-mobile-match-panel"
      data-testid="fab-mobile-match-panel"
      aria-label="Flesh and Blood match center"
    >
      <div className="flex justify-between gap-2" aria-label="Match clocks">
        {opponent.clock}
        {self.clock}
      </div>
      <header className="fab-mobile-match-panel-header">
        <div>
          <strong>Match center</strong>
          <span>Turn {state.turnNumber}</span>
        </div>
        <details className="fab-mobile-seat-details">
          <summary>Seats</summary>
          <div className="fab-mobile-seat-details-panel">
            <SimulatorMatchParticipantView participant={opponentParticipant} />
            <SimulatorMatchParticipantView participant={selfParticipant} />
          </div>
        </details>
      </header>
      {automation ? (
        <section
          className="fab-mobile-panel-automation"
          aria-label={automation.label ?? "Automated opponent controls"}
        >
          {automation.control ? (
            <div className="fab-mobile-panel-automation-control">{automation.control}</div>
          ) : null}
          <details>
            <summary>
              <span>{automation.summary}</span>
              <span aria-hidden="true">+</span>
            </summary>
            <div className="fab-mobile-panel-automation-details">{automation.details}</div>
          </details>
        </section>
      ) : null}
      {matchContext ? (
        <section className="fab-mobile-panel-context" aria-label="Resolution stack">
          {matchContext}
        </section>
      ) : null}
      <section className="fab-mobile-panel-activity" aria-label="Match activity">
        <SimulatorActivityTabs {...resolvedActivity} />
      </section>
      <section className="fab-mobile-panel-actions" aria-label="Match actions">
        <SimulatorMatchActionDock {...resolvedActions} />
      </section>
    </section>
  );
}

/** Pure projection: presentation seat → shared participant band. */
export function toFabParticipant({
  snapshot,
  role,
  state,
  viewerId,
}: {
  readonly snapshot: FabSidebarPlayerSnapshot;
  readonly role: "opponent" | "self";
  readonly state: FabPresentationState;
  readonly viewerId: string;
}): SimulatorMatchParticipant {
  const isSelf = role === "self";
  const hasTurn = state.activePlayerId === snapshot.playerId;
  const hasPriority = state.priorityPlayerId === snapshot.playerId;
  const localIdentity = snapshot.localPractice;
  const displayName =
    snapshot.displayName ??
    (localIdentity
      ? localIdentity.kind === "human"
        ? "You"
        : "Practice bot"
      : isSelf
        ? snapshot.playerId === viewerId
          ? "You"
          : snapshot.playerId
        : snapshot.playerId);
  const localMeta = localIdentity ? (
    <span
      className="fab-practice-participant-meta"
      title={`Local engine · ${localIdentity.heroName ?? "Hero not selected"}${
        localIdentity.deckLabel ? ` · ${localIdentity.deckLabel}` : ""
      } · ${localIdentity.controlLabel}`}
    >
      {localIdentity.heroName ?? "Hero not selected"} · {localIdentity.controlLabel}
    </span>
  ) : null;

  return {
    id: snapshot.playerId,
    role,
    name: (
      <span className="fab-participant-name">
        <SupporterPlayerName name={displayName} tier={snapshot.subscriptionTier} />
        {snapshot.connection}
      </span>
    ),
    shortLabel: localIdentity
      ? localIdentity.kind === "human"
        ? "YOU"
        : "AI"
      : isSelf
        ? "YOU"
        : "OP",
    showAvatar: false,
    ariaLabel: localIdentity
      ? localIdentity.kind === "human"
        ? "Your match status"
        : "Practice bot match status"
      : undefined,
    testId: isSelf ? "fab-sidebar-self" : "fab-sidebar-opponent",
    active: hasTurn,
    priority: hasPriority,
    meta: (
      <>
        <span className="fab-participant-detail" title={snapshot.heroName}>
          {localMeta ?? snapshot.heroName}
        </span>
        {snapshot.rankedMmr !== undefined ? (
          <span className="fab-participant-rating" title="Ranked rating at match start">
            {Math.round(snapshot.rankedMmr)} MMR
          </span>
        ) : null}
      </>
    ),
    clock: snapshot.clock,
    actions: snapshot.actions,
  };
}

/** Pure projection: status + page content → activity tabs. */
export function buildFabActivity({
  state,
  viewerId,
  opponentId,
  sidebarExtra,
  pageOwnedActions,
  activityLogLabel,
  eventLog,
  matchHistory,
}: {
  readonly state: FabPresentationState;
  readonly viewerId: string;
  readonly opponentId: string;
  readonly status: ReactNode;
  readonly sidebarExtra?: ReactNode;
  readonly pageOwnedActions: ReactNode | null;
  readonly activityLogLabel?: string;
  readonly activityOwnsStatus?: boolean;
  readonly eventLog?: readonly SimulatorEventLogEntry[];
  readonly matchHistory?: readonly SimulatorMatchHistoryRow[];
}): SimulatorMatchActivity {
  const log = (
    <div className="fab-sidebar-activity-log" data-testid="fab-sidebar-activity-log">
      {pageOwnedActions ? (
        <div className="fab-sidebar-page-actions" data-testid="fab-sidebar-page-actions">
          {pageOwnedActions}
        </div>
      ) : null}
      {matchHistory && matchHistory.length > 0 ? (
        <div className="fab-sidebar-event-log">
          <FabMatchHistoryPanel
            embedded
            rows={matchHistory}
            viewerSeatId={viewerId}
            rowAlignment="left"
            rowVariant={(row) =>
              row.kind === "match-start" || !row.actorSeatId
                ? "system"
                : row.actorSeatId === viewerId
                  ? "viewer"
                  : "opponent"
            }
            renderCardReference={(reference) => renderFabHistoryCardReference(reference, state)}
            turnOwnerLabel={(_, rows) => {
              const ownerId = rows.find((row) => row.turnOwnerSeatId)?.turnOwnerSeatId;
              if (ownerId === viewerId) return "You";
              if (ownerId === opponentId) return "Opponent";
              return ownerId ?? "Match";
            }}
          />
        </div>
      ) : eventLog && eventLog.length > 0 ? (
        <div className="fab-sidebar-event-log">
          <EventLogPanel
            embedded
            entries={eventLog}
            turnExpansion="latest"
            sectionExpansion="latest"
          />
        </div>
      ) : !pageOwnedActions ? (
        <p className="fab-sidebar-activity-empty">Match events and practice actions appear here.</p>
      ) : null}
    </div>
  );

  return {
    log,
    logLabel:
      activityLogLabel ??
      (pageOwnedActions
        ? "Actions"
        : matchHistory && matchHistory.length > 0
          ? "History"
          : eventLog && eventLog.length > 0
            ? "Log"
            : "Status"),
    secondary: sidebarExtra ? (
      <section className="fab-sidebar-extra" data-testid="fab-sidebar-extra">
        {sidebarExtra}
      </section>
    ) : import.meta.env.DEV && eventLog && eventLog.length > 0 ? (
      <EventLogPanel embedded entries={eventLog} turnExpansion="latest" sectionExpansion="latest" />
    ) : undefined,
    secondaryLabel: sidebarExtra
      ? "More"
      : import.meta.env.DEV && eventLog && eventLog.length > 0
        ? "Debug trace"
        : undefined,
    defaultTab: "log",
  };
}

function renderFabHistoryCardReference(
  reference: SimulatorCardReference,
  state: FabPresentationState,
): ReactNode {
  const projectedCard = reference.entityId ? state.cards[reference.entityId] : undefined;
  const definition =
    (reference.definitionId ? state.cardDefinitions[reference.definitionId] : undefined) ??
    (projectedCard ? state.cardDefinitions[projectedCard.cardId] : undefined) ??
    Object.values(state.cardDefinitions).find((card) => card.name === reference.name);
  return (
    <FabHistoryCardReference
      name={reference.name}
      definition={definition}
      definitionId={reference.definitionId ?? projectedCard?.cardId}
      entityId={reference.entityId}
    />
  );
}

function FabMatchActionSlot({
  disabledReason,
  placement = "start",
  children,
}: {
  readonly disabledReason?: string;
  readonly placement?: "start" | "end";
  readonly children: ReactNode;
}) {
  return (
    <span
      className="fab-match-action-slot"
      data-disabled-reason={disabledReason}
      data-tooltip-placement={placement}
    >
      {children}
    </span>
  );
}

/** Persistent match controls mirror the desktop quick controls in the sidebar. */
export function buildFabMatchActions({
  spectatorReturnHref,
  onConcede,
  confirmConcede = true,
  onPassPriority,
  canPassPriority = false,
  showPassPriority = true,
  passPriorityLabel = "Pass",
  onUndo,
  canUndo = false,
  onOpenGameSummary,
  disabled,
}: {
  readonly spectatorReturnHref?: string;
  readonly onConcede?: () => void;
  readonly confirmConcede?: boolean;
  readonly onPassPriority?: () => void;
  readonly canPassPriority?: boolean;
  readonly showPassPriority?: boolean;
  readonly passPriorityLabel?: string;
  readonly onUndo?: () => void;
  readonly canUndo?: boolean;
  readonly onOpenGameSummary?: () => void;
  readonly disabled: boolean;
}): SimulatorMatchActions {
  if (spectatorReturnHref) {
    return {
      className: "fab-match-action-dock fab-spectator-action-dock",
      danger: null,
      controls: (
        <div className="fab-match-dock-controls" data-testid="fab-match-actions">
          <a
            className="fab-spectator-return-button"
            data-testid="fab-spectator-return"
            href={spectatorReturnHref}
          >
            <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.8} />
            Back to matchmaking
          </a>
        </div>
      ),
    };
  }

  if (onOpenGameSummary) {
    return {
      className: "fab-match-action-dock",
      danger: null,
      controls: (
        <div className="fab-match-dock-controls" data-testid="fab-match-actions">
          <button
            type="button"
            className="fab-match-summary-button"
            data-testid="fab-summary-restore"
            onClick={onOpenGameSummary}
          >
            <RotateCcw aria-hidden="true" size={16} />
            View game summary
          </button>
        </div>
      ),
    };
  }

  const undoDisabled = disabled || !onUndo || !canUndo;
  const undoDisabledReason = disabled
    ? "Undo is temporarily unavailable."
    : !onUndo
      ? "Undo is available only in practice matches."
      : !canUndo
        ? "There is no action available to undo."
        : undefined;
  const passDisabled = disabled || !onPassPriority || !canPassPriority;
  const passDisabledReason = disabled
    ? `${passPriorityLabel} is temporarily unavailable.`
    : !onPassPriority
      ? `${passPriorityLabel} is unavailable in this match.`
      : !canPassPriority
        ? passPriorityLabel === "Pass"
          ? "Pass is unavailable because you do not have priority."
          : `${passPriorityLabel} is unavailable until the current selection is legal.`
        : undefined;
  const concedeDisabled = disabled || !onConcede;
  const concedeDisabledReason = disabled
    ? "Concede is temporarily unavailable."
    : !onConcede
      ? "Concede is unavailable in this match."
      : undefined;

  return {
    className: "fab-match-action-dock",
    controls: (
      <div className="fab-match-dock-controls" data-testid="fab-match-actions">
        <FabMatchActionSlot disabledReason={undoDisabledReason}>
          <button
            type="button"
            disabled={undoDisabled}
            onClick={onUndo}
            title={undoDisabledReason}
            aria-label={undoDisabledReason ? `Undo unavailable. ${undoDisabledReason}` : "Undo"}
            data-testid="fab-action-undo"
          >
            Undo
          </button>
        </FabMatchActionSlot>
        {showPassPriority ? (
          <FabMatchActionSlot disabledReason={passDisabledReason}>
            <button
              type="button"
              disabled={passDisabled}
              onClick={onPassPriority}
              title={passDisabledReason}
              aria-label={
                passDisabledReason
                  ? `${passPriorityLabel} unavailable. ${passDisabledReason}`
                  : passPriorityLabel === "Pass"
                    ? "Pass priority"
                    : passPriorityLabel
              }
              data-testid="fab-action-pass-priority"
            >
              {passPriorityLabel === "Pass" ? "Pass priority" : passPriorityLabel}
              {passPriorityLabel === "Pass" ? (
                <Kbd aria-label="Space bar">
                  <Space size={14} aria-hidden="true" />
                </Kbd>
              ) : null}
            </button>
          </FabMatchActionSlot>
        ) : null}
      </div>
    ),
    danger: (
      <FabMatchActionSlot disabledReason={concedeDisabledReason} placement="end">
        <FabConcedeAction
          disabled={concedeDisabled}
          disabledReason={concedeDisabledReason}
          confirm={confirmConcede}
          onConcede={onConcede}
        />
      </FabMatchActionSlot>
    ),
  };
}

function FabConcedeAction({
  disabled,
  disabledReason,
  confirm,
  onConcede,
}: {
  readonly disabled: boolean;
  readonly disabledReason?: string;
  readonly confirm: boolean;
  readonly onConcede?: () => void;
}) {
  const [opened, setOpened] = useState(false);
  const requestConcede = () => {
    if (confirm) setOpened(true);
    else onConcede?.();
  };

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        className="fab-concede-btn"
        title={disabledReason}
        aria-label={disabledReason ? `Concede unavailable. ${disabledReason}` : "Concede match"}
        data-testid="fab-action-concede"
        data-danger="true"
        onClick={requestConcede}
      >
        Concede
      </button>
      {opened ? (
        <Modal
          opened
          onClose={() => setOpened(false)}
          centered
          title="Concede match?"
          classNames={{ close: "fab-concede-confirm-close" }}
        >
          <Text size="sm">This ends the match as a loss and cannot be undone.</Text>
          <Group justify="flex-end" mt="lg" className="fab-concede-confirm-actions">
            <Button variant="default" onClick={() => setOpened(false)}>
              Keep playing
            </Button>
            <Button
              color="red"
              data-testid="fab-concede-confirm"
              onClick={() => {
                setOpened(false);
                onConcede?.();
              }}
            >
              Concede
            </Button>
          </Group>
        </Modal>
      ) : null}
    </>
  );
}

/** Theme tokens inherit from `.fab-tabletop`; only rival/friendly need explicit mapping. */
const fabSidebarStyle = {
  "--game-friendly": "var(--game-accent)",
  "--game-rival": "#dc2626",
} as CSSProperties;
