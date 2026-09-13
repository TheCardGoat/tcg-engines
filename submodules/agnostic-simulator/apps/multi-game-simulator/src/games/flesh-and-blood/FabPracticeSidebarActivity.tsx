import type { FabLogActorLabelUsage } from "@tcg/flesh-and-blood-engine/log";
import { visibleFabPlayerLog } from "@tcg/flesh-and-blood-engine/simulator";
import { Loader, MantineProvider } from "@mantine/core";
import type { SimulatorEventLogEntry, SimulatorMatchHistoryRow } from "@tcg/simulator-contract";
import { copyTextToClipboard, safeStringify } from "@tcg/simulator-runtime/debug";
import {
  EventLogPanel,
  SimulatorActivityTabs,
  type SimulatorMatchActivity,
  type SimulatorActivityTab,
} from "@tcg/simulator-ui";
import { Check, ClipboardCopy, FlaskConical, MessageCircle, Send, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { projectFabLogEntries, type FabLogActorLabel } from "./log-projection";
import {
  projectFabPlayerNarrativeHistory,
  projectFabPlayerNarrativeMatchStart,
} from "./player-narrative-projection";
import { projectFabPlayerHistoryRows } from "./player-history-projection";
import { FabHistoryCardReference } from "./FabHistoryCardReference";
import { FabMatchHistoryPanel } from "./FabMatchHistoryPanel";
import type { FabPresentationState } from "./state";
import type {
  StoredFabPracticeChatMessage,
  StoredFabPracticeDecisionSnapshot,
  StoredFabPracticeTelemetryEntry,
} from "./practice-session";

type MatchHistoryScope = "public" | "player";

export interface FabPracticeDecisionSnapshot extends StoredFabPracticeDecisionSnapshot {}

export interface FabPracticeTelemetryEntry extends StoredFabPracticeTelemetryEntry {
  readonly getRawState: () => string;
  readonly getRawInteraction: () => string;
}

export interface FabPracticeNowState {
  readonly title: string;
  readonly detail: string;
  readonly context: string;
  readonly sessionLabel: string;
  readonly controlLabel: string;
  readonly tone: "ready" | "thinking" | "waiting" | "error" | "complete";
}

export interface FabPracticeChatMessage extends StoredFabPracticeChatMessage {}

export interface FabPracticeSessionSummary {
  readonly mode: string;
  readonly playerDeck?: string;
  readonly botDeck?: string;
  readonly botStrategy: string;
  readonly seed: string;
}

export interface FabPracticeSidebarActivityProps {
  readonly actions: ReactNode;
  readonly telemetry: readonly FabPracticeTelemetryEntry[];
  readonly humanPlayerId: string;
  readonly controlledPlayerId: string;
  readonly botPlayerId: string;
  readonly turnNumber: number;
  readonly firstTurnPlayerId?: string;
  readonly pendingDecision: FabPracticeDecisionSnapshot | null;
  readonly now: FabPracticeNowState;
  readonly disclosure: string;
  readonly session: FabPracticeSessionSummary;
  readonly activeTab?: SimulatorActivityTab;
  readonly onActiveTabChange?: (tab: SimulatorActivityTab) => void;
  readonly chatMessages?: readonly FabPracticeChatMessage[];
  /** Human-authored local chat remains factual while controlling either seat. */
  readonly chatActorId?: string;
  readonly onSendChat?: (message: string) => void;
  readonly labExtra?: ReactNode;
  /** Invalidates lazy live debug payloads after an authoritative engine update. */
  readonly debugRevision?: number;
  readonly getRawState: () => string;
  readonly getRawInteraction: () => string;
  /** The immutable match program resolves public log card names to previews. */
  readonly cardDefinitions?: FabPresentationState["cardDefinitions"];
  /** Current viewer-safe card projection used only to determine spatial availability. */
  readonly cards?: FabPresentationState["cards"];
  readonly highlightedEntityIds?: readonly string[];
  readonly availableEntityIds?: readonly string[];
  readonly onHighlightEntity?: (entityIds: readonly string[]) => void;
}

export function createFabPracticeSidebarActivity({
  actions,
  telemetry,
  humanPlayerId,
  controlledPlayerId,
  botPlayerId,
  firstTurnPlayerId,
  pendingDecision,
  now,
  disclosure,
  session,
  activeTab,
  onActiveTabChange,
  chatMessages = [],
  chatActorId = humanPlayerId,
  onSendChat,
  labExtra,
  debugRevision = 0,
  getRawState,
  getRawInteraction,
  cardDefinitions,
  cards,
}: FabPracticeSidebarActivityProps): SimulatorMatchActivity {
  const actorLabel = (actorId: string) => practiceActorLabel(actorId, humanPlayerId, botPlayerId);
  const showDeveloperTrace = import.meta.env.DEV || import.meta.env.MODE === "test";
  const debugEntries = showDeveloperTrace
    ? projectFabLogEntries(
        telemetry.flatMap((entry) => entry.moveLogs),
        {
          viewerId: controlledPlayerId,
          seatIds: [humanPlayerId, botPlayerId],
          actorLabel: (actorId, usage) =>
            practiceActorLabelForm(actorId, usage, humanPlayerId, botPlayerId),
        },
      )
    : [];

  return {
    combined: (
      <PracticeHistory
        telemetry={telemetry}
        humanPlayerId={humanPlayerId}
        controlledPlayerId={controlledPlayerId}
        botPlayerId={botPlayerId}
        firstTurnPlayerId={firstTurnPlayerId}
        chatMessages={chatMessages}
        chatActorId={chatActorId}
        onSendChat={onSendChat}
        cardDefinitions={cardDefinitions}
        cards={cards}
      />
    ),
    combinedLabel: "History",
    log: (
      <PracticeNow
        actions={actions}
        pendingDecision={pendingDecision}
        now={now}
        disclosure={disclosure}
        actorLabel={actorLabel}
      />
    ),
    logLabel: "Now",
    secondary: showDeveloperTrace ? (
      <section className="fab-practice-lab" data-testid="fab-practice-lab">
        <header className="fab-practice-lab-tab-heading">
          <span>
            <FlaskConical aria-hidden="true" size={15} strokeWidth={1.8} />
            <strong>Practice Lab</strong>
          </span>
          <small>
            {telemetry.length} {telemetry.length === 1 ? "command" : "commands"}
          </small>
        </header>
        <div className="fab-practice-lab-content">
          <section aria-labelledby="fab-practice-trace-heading">
            <header className="fab-practice-lab-section-heading">
              <h4 id="fab-practice-trace-heading">Detailed trace</h4>
              <span>Complete engine receipts for development</span>
            </header>
            <EventLogPanel
              embedded
              entries={debugEntries}
              turnExpansion="latest"
              sectionExpansion="latest"
              rawCopyText={safeStringify(telemetry)}
            />
          </section>
          <PracticeSessionDetails session={session} />
          {labExtra ? (
            <section
              className="fab-practice-lab-extra"
              aria-labelledby="fab-practice-tools-heading"
            >
              <header className="fab-practice-lab-section-heading">
                <h4 id="fab-practice-tools-heading">Fixture controls</h4>
                <span>Local scenario information and navigation</span>
              </header>
              {labExtra}
            </section>
          ) : null}
          <section aria-labelledby="fab-practice-decisions-heading">
            <header className="fab-practice-lab-section-heading">
              <h4 id="fab-practice-decisions-heading">Decisions</h4>
              <span>Accepted commands and engine outcomes</span>
            </header>
            <DecisionLog
              telemetry={telemetry}
              pendingDecision={pendingDecision}
              humanPlayerId={humanPlayerId}
              botPlayerId={botPlayerId}
              actorLabel={actorLabel}
            />
          </section>
          <section aria-labelledby="fab-practice-debug-heading">
            <header className="fab-practice-lab-section-heading">
              <h4 id="fab-practice-debug-heading">Debug snapshots</h4>
              <span>Raw local runtime and controlled-seat interaction data</span>
            </header>
            <DebugPayloads
              debugRevision={debugRevision}
              getRawState={getRawState}
              getRawInteraction={getRawInteraction}
              telemetry={telemetry}
              humanPlayerId={humanPlayerId}
              botPlayerId={botPlayerId}
            />
          </section>
        </div>
      </section>
    ) : undefined,
    secondaryLabel: showDeveloperTrace ? "Lab" : undefined,
    defaultTab: "combined",
    activeTab,
    onActiveTabChange,
  };
}

export function FabPracticeSidebarActivity(props: FabPracticeSidebarActivityProps) {
  const [localChatMessages, setLocalChatMessages] = useState<readonly FabPracticeChatMessage[]>([]);
  const localChatIdRef = useRef(0);
  const chatMessages = props.chatMessages ?? localChatMessages;
  const onSendChat =
    props.onSendChat ??
    ((message: string) => {
      setLocalChatMessages((current) => [
        ...current,
        {
          id: ++localChatIdRef.current,
          recordedAt: Date.now(),
          turn: props.turnNumber,
          actorId: props.chatActorId ?? props.humanPlayerId,
          message,
        },
      ]);
    });

  return (
    <section className="fab-practice-activity" data-testid="fab-practice-activity">
      <SimulatorActivityTabs
        {...createFabPracticeSidebarActivity({ ...props, chatMessages, onSendChat })}
      />
    </section>
  );
}

function PracticeNow({
  actions,
  pendingDecision,
  now,
  disclosure,
  actorLabel,
}: {
  readonly actions: ReactNode;
  readonly pendingDecision: FabPracticeDecisionSnapshot | null;
  readonly now: FabPracticeNowState;
  readonly disclosure: string;
  readonly actorLabel: (actorId: string) => string;
}) {
  return (
    <MantineProvider>
      <section
        className="fab-practice-now"
        data-tone={now.tone}
        aria-label="Current practice state"
        data-testid="fab-practice-now"
      >
        <header className="fab-practice-now-header">
          {now.tone === "thinking" ? (
            <Loader
              className="fab-practice-now-signal fab-practice-now-loader"
              size="xs"
              color="yellow"
              aria-hidden="true"
            />
          ) : (
            <span className="fab-practice-now-signal" aria-hidden="true" />
          )}
          <div>
            <strong>{now.title}</strong>
            <span>{now.context}</span>
          </div>
          <span className="fab-practice-mode-chip">{now.sessionLabel}</span>
        </header>
        <p className="fab-practice-now-detail" aria-live="polite" data-testid="fab-practice-status">
          {now.detail}
        </p>
        <div className="fab-practice-control-state">
          <span>{now.controlLabel}</span>
          {pendingDecision ? (
            <span data-testid="fab-practice-pending-decision">
              {pendingDecision.label} · {actorLabel(pendingDecision.actorId)}
            </span>
          ) : null}
        </div>
        <div className="fab-practice-now-actions">{actions}</div>
        <p className="fab-practice-disclosure" data-testid="fab-practice-rules-light-disclosure">
          {disclosure}
        </p>
      </section>
    </MantineProvider>
  );
}

function PracticeHistory({
  telemetry,
  humanPlayerId,
  controlledPlayerId,
  botPlayerId,
  firstTurnPlayerId,
  chatMessages,
  chatActorId,
  onSendChat,
  cardDefinitions,
  cards,
}: {
  readonly telemetry: readonly FabPracticeTelemetryEntry[];
  readonly humanPlayerId: string;
  readonly controlledPlayerId: string;
  readonly botPlayerId: string;
  readonly firstTurnPlayerId?: string;
  readonly chatMessages: readonly FabPracticeChatMessage[];
  readonly chatActorId: string;
  readonly onSendChat?: (message: string) => void;
  readonly cardDefinitions?: FabPresentationState["cardDefinitions"];
  readonly cards?: FabPresentationState["cards"];
}) {
  const [draft, setDraft] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const actorLabel = (actorId: string) => practiceActorLabel(actorId, humanPlayerId, botPlayerId);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatOpen) chatInputRef.current?.focus();
  }, [chatOpen]);

  const submitChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message || !onSendChat) return;
    onSendChat(message);
    setDraft("");
  };

  return (
    <section className="fab-practice-history-surface" data-testid="fab-practice-activity">
      <section className="fab-practice-history" aria-label="Match history">
        <div className="fab-practice-history-body">
          <PracticeEventLog
            telemetry={telemetry}
            humanPlayerId={humanPlayerId}
            controlledPlayerId={controlledPlayerId}
            botPlayerId={botPlayerId}
            firstTurnPlayerId={firstTurnPlayerId}
            cardDefinitions={cardDefinitions}
            cards={cards}
          />
        </div>
        {chatMessages.length > 0 ? (
          <ol className="fab-practice-chat-messages" aria-label="Local practice chat messages">
            {chatMessages.map((message) => (
              <li key={message.id} data-message-kind="chat">
                <strong>{actorLabel(message.actorId)}</strong>
                <span>{message.message}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </section>
      <div className="fab-practice-chat-dock" data-open={chatOpen ? "true" : "false"}>
        {chatOpen ? (
          <form
            className="fab-practice-chat-compose"
            onSubmit={submitChat}
            onKeyDown={(event) => {
              if (event.key !== "Escape") return;
              event.preventDefault();
              setChatOpen(false);
            }}
          >
            <label>
              <span>Local practice chat</span>
              <input
                ref={chatInputRef}
                value={draft}
                maxLength={200}
                placeholder={`Message as ${actorLabel(chatActorId)}`}
                onChange={(event) => setDraft(event.currentTarget.value)}
              />
            </label>
            <button
              type="submit"
              disabled={!draft.trim() || !onSendChat}
              aria-label="Send local practice message"
            >
              <Send aria-hidden="true" size={14} />
            </button>
            <small>Local only</small>
          </form>
        ) : null}
        <button
          type="button"
          className="fab-practice-chat-toggle"
          aria-label={chatOpen ? "Close local practice chat" : "Open local practice chat"}
          aria-expanded={chatOpen}
          onClick={() => setChatOpen((current) => !current)}
        >
          {chatOpen ? (
            <X aria-hidden="true" size={17} />
          ) : (
            <MessageCircle aria-hidden="true" size={18} />
          )}
        </button>
      </div>
    </section>
  );
}

function PracticeEventLog({
  telemetry,
  humanPlayerId,
  controlledPlayerId,
  botPlayerId,
  firstTurnPlayerId,
  cardDefinitions,
  cards,
}: {
  readonly telemetry: readonly FabPracticeTelemetryEntry[];
  readonly humanPlayerId: string;
  readonly controlledPlayerId: string;
  readonly botPlayerId: string;
  readonly firstTurnPlayerId?: string;
  readonly cardDefinitions?: FabPresentationState["cardDefinitions"];
  readonly cards?: FabPresentationState["cards"];
}) {
  const viewerId = controlledPlayerId;
  const actorIds = useMemo(() => {
    const ids = new Set<string>([humanPlayerId, botPlayerId, controlledPlayerId]);
    for (const entry of telemetry) {
      ids.add(entry.actorId);
      for (const log of entry.moveLogs) ids.add(log.playerId);
    }
    return ids;
  }, [telemetry, humanPlayerId, botPlayerId, controlledPlayerId]);
  const logActorLabel = useCallback<FabLogActorLabel>(
    (actorId, usage) =>
      actorIds.has(actorId)
        ? practiceActorLabelForm(actorId, usage, humanPlayerId, botPlayerId)
        : undefined,
    [actorIds, humanPlayerId, botPlayerId],
  );

  const rows = useMemo(() => {
    const projectionOptions = {
      viewerId,
      seatIds: [humanPlayerId, botPlayerId],
      actorLabel: logActorLabel,
    } as const;
    const matchStartRows = firstTurnPlayerId
      ? [projectFabPlayerNarrativeMatchStart(firstTurnPlayerId, projectionOptions)]
      : [];
    const legacyRows = projectFabPlayerHistoryRows(
      telemetry.flatMap((entry) => (entry.playerLog ? [] : entry.moveLogs)),
      projectionOptions,
    );
    const narrativeRows = projectFabPlayerNarrativeHistory(
      telemetry.flatMap((entry) =>
        entry.playerLog ? [visibleFabPlayerLog(entry.playerLog, viewerId)] : [],
      ),
      projectionOptions,
    );
    return [...matchStartRows, ...legacyRows, ...narrativeRows].sort((left, right) => {
      if (left.kind === "match-start") return -1;
      if (right.kind === "match-start") return 1;
      return Date.parse(left.timestamp) - Date.parse(right.timestamp);
    });
  }, [telemetry, viewerId, humanPlayerId, botPlayerId, logActorLabel, firstTurnPlayerId]);

  const turnOwnerLabel = useCallback(
    (_turn: number, turnRows: readonly SimulatorMatchHistoryRow[]) => {
      const ownerId = turnRows.find((row) => row.turnOwnerSeatId)?.turnOwnerSeatId;
      return ownerId ? practiceActorLabel(ownerId, humanPlayerId, botPlayerId) : "Match";
    },
    [humanPlayerId, botPlayerId],
  );

  const historyRowVariant = useCallback(
    (row: SimulatorMatchHistoryRow) => {
      if (row.kind === "match-start" || !row.actorSeatId) return "system" as const;
      return row.actorSeatId === humanPlayerId ? ("viewer" as const) : ("opponent" as const);
    },
    [humanPlayerId],
  );

  return (
    <div className="fab-practice-turn-log" data-testid="fab-practice-game-log">
      <FabMatchHistoryPanel
        embedded
        rows={rows}
        viewerSeatId={viewerId}
        rowVariant={historyRowVariant}
        rowAlignment="left"
        turnOwnerLabel={turnOwnerLabel}
        renderCardReference={(reference) => {
          const projectedCard = reference.entityId ? cards?.[reference.entityId] : undefined;
          const definition =
            (reference.definitionId ? cardDefinitions?.[reference.definitionId] : undefined) ??
            (projectedCard ? cardDefinitions?.[projectedCard.cardId] : undefined) ??
            Object.values(cardDefinitions ?? {}).find((card) => card.name === reference.name);
          return (
            <FabHistoryCardReference
              name={reference.name}
              definition={definition}
              definitionId={reference.definitionId ?? projectedCard?.cardId}
              entityId={reference.entityId}
            />
          );
        }}
      />
    </div>
  );
}

/**
 * A bare pass carries no semantic line, so keep a transient row synthesized
 * from its accepted command label. Other silent commands must stay silent:
 * their semantic receipt may be private to another history scope, and using
 * the command label as a fallback would leak that private action publicly.
 */
export function practiceCommandEntries(
  telemetry: readonly FabPracticeTelemetryEntry[],
  viewerId: string,
  scope: MatchHistoryScope,
): SimulatorEventLogEntry[] {
  const visible = telemetry.filter((entry) => scope !== "player" || entry.actorId === viewerId);
  // A zero-row command (a pass) is only informative while it is the latest
  // thing that happened — it marks whose court the ball is in. Once any later
  // entry produces visible rows, the marker is implied and would only
  // pollute the log, so only the trailing run of silent commands renders.
  // End turns never ride this fallback: their command move logs always carry
  // semantic system rows ("You ended the turn."), so passing the turn stays
  // permanently visible. Silence is measured through the real projection so
  // a command whose batch only carries suppressed rows (for example the turn
  // announcement filtered out by the projection) still counts as silent and
  // keeps its marker — otherwise the pass would render nothing at all.
  const isSemantic = (entry: FabPracticeTelemetryEntry): boolean => {
    const logs =
      scope === "player"
        ? entry.moveLogs.filter((log) => log.playerId === viewerId)
        : entry.moveLogs;
    if (logs.length === 0) return false;
    return (
      projectFabLogEntries(logs, {
        viewerId,
        includePrivate: scope === "player",
      }).length > 0
    );
  };
  let lastSemanticIndex = -1;
  visible.forEach((entry, index) => {
    if (isSemantic(entry)) lastSemanticIndex = index;
  });
  const entries: SimulatorEventLogEntry[] = [];
  visible.forEach((entry, index) => {
    if (index <= lastSemanticIndex) return;
    if (entry.move !== "pass") return;
    entries.push({
      id: `fab-practice-command-${entry.id}`,
      turn: entry.turnNumber,
      phase: "",
      seatId: entry.actorId === viewerId ? "player" : "opponent",
      timestamp: new Date(entry.recordedAt).toISOString(),
      message: entry.commandLabel,
      tags: ["move"],
    });
  });
  return entries;
}

function DecisionLog({
  telemetry,
  pendingDecision,
  humanPlayerId,
  botPlayerId,
  actorLabel,
}: {
  readonly telemetry: readonly FabPracticeTelemetryEntry[];
  readonly pendingDecision: FabPracticeDecisionSnapshot | null;
  readonly humanPlayerId: string;
  readonly botPlayerId: string;
  readonly actorLabel: (actorId: string) => string;
}) {
  return (
    <div className="fab-practice-decisions" data-testid="fab-practice-decision-log">
      {pendingDecision ? (
        <section className="fab-practice-pending-decision" aria-live="polite">
          <span>Awaiting {actorLabel(pendingDecision.actorId)}</span>
          <strong>{pendingDecision.label}</strong>
          <small>
            {pendingDecision.kind} · {pendingDecision.decisionId}
          </small>
        </section>
      ) : null}
      {telemetry.length === 0 ? (
        <EmptyActivity>Accepted player and bot decisions will appear here.</EmptyActivity>
      ) : (
        <ol className="fab-practice-log" aria-label="Accepted decisions">
          {telemetry.map((entry) => (
            <li key={entry.id} data-source={entry.source}>
              <span>
                #{entry.id} · {formatPracticeTime(entry.recordedAt)} · state {entry.stateId}
              </span>
              <strong>{practiceActorLabel(entry.actorId, humanPlayerId, botPlayerId)}</strong>
              <p>{entry.commandLabel}</p>
              <small>
                Accepted · <code>{entry.move}</code> ·{" "}
                {entry.source === "bot" ? "automated" : "player controlled"}
              </small>
              {entry.completedDecision ? (
                <small>Completed: {entry.completedDecision.label}</small>
              ) : null}
              {entry.pendingDecision ? <small>Opened: {entry.pendingDecision.label}</small> : null}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function DebugPayloads({
  debugRevision,
  getRawState,
  getRawInteraction,
  telemetry,
  humanPlayerId,
  botPlayerId,
}: {
  readonly debugRevision: number;
  readonly getRawState: () => string;
  readonly getRawInteraction: () => string;
  readonly telemetry: readonly FabPracticeTelemetryEntry[];
  readonly humanPlayerId: string;
  readonly botPlayerId: string;
}) {
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<number | null>(null);
  const selectedSnapshot =
    telemetry.find((entry) => entry.id === selectedSnapshotId) ?? telemetry.at(-1);

  return (
    <div className="fab-practice-debug" data-testid="fab-practice-debug">
      <DebugPayload
        label="Engine state"
        payload={getRawState}
        revision={debugRevision}
        testId="fab-debug-state"
      />
      <DebugPayload
        label="Interaction view"
        payload={getRawInteraction}
        revision={debugRevision}
        testId="fab-debug-interaction"
      />
      {selectedSnapshot ? (
        <section className="fab-practice-command-snapshot" data-testid="fab-debug-command-snapshot">
          <label>
            <span>Accepted command snapshot</span>
            <select
              value={selectedSnapshot.id}
              onChange={(event) => setSelectedSnapshotId(Number(event.currentTarget.value))}
            >
              {telemetry.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  #{entry.id} · {practiceActorLabel(entry.actorId, humanPlayerId, botPlayerId)} ·{" "}
                  {entry.commandLabel}
                </option>
              ))}
            </select>
          </label>
          <DebugPayload
            label={`State after command ${selectedSnapshot.id}`}
            payload={selectedSnapshot.getRawState}
            revision={selectedSnapshot.id}
            testId="fab-debug-snapshot-state"
          />
          <DebugPayload
            label={`Interaction after command ${selectedSnapshot.id} · ${practiceActorLabel(
              selectedSnapshot.interactionActorId,
              humanPlayerId,
              botPlayerId,
            )}`}
            payload={selectedSnapshot.getRawInteraction}
            revision={selectedSnapshot.id}
            testId="fab-debug-snapshot-interaction"
          />
        </section>
      ) : (
        <EmptyActivity>Command snapshots appear after the first accepted action.</EmptyActivity>
      )}
    </div>
  );
}

function DebugPayload({
  label,
  payload,
  revision,
  testId,
}: {
  readonly label: string;
  readonly payload: string | (() => string);
  readonly revision: string | number;
  readonly testId: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [feedback, setFeedback] = useState<"idle" | "copied" | "failed">("idle");
  const [resolvedPayload, setResolvedPayload] = useState<string | null>(
    typeof payload === "string" ? payload : null,
  );
  const resolvePayload = () => {
    if (resolvedPayload !== null) return resolvedPayload;
    const next = typeof payload === "string" ? payload : payload();
    setResolvedPayload(next);
    return next;
  };
  useEffect(() => {
    const next =
      typeof payload === "string" ? payload : detailsRef.current?.open ? payload() : null;
    setResolvedPayload(next);
    setFeedback("idle");
  }, [payload, revision]);
  const copy = async () => {
    setFeedback((await copyTextToClipboard(resolvePayload())) ? "copied" : "failed");
  };
  return (
    <details
      ref={detailsRef}
      className="fab-practice-debug-payload"
      data-testid={testId}
      onToggle={(event) => {
        if (event.currentTarget.open) resolvePayload();
      }}
    >
      <summary>{label}</summary>
      <div className="fab-practice-debug-toolbar">
        <button type="button" onClick={() => void copy()}>
          {feedback === "copied" ? (
            <Check aria-hidden="true" size={14} />
          ) : (
            <ClipboardCopy aria-hidden="true" size={14} />
          )}
          Copy {label.toLowerCase()}
        </button>
        {feedback !== "idle" ? (
          <span role="status">{feedback === "copied" ? "Copied." : "Clipboard unavailable."}</span>
        ) : null}
      </div>
      <pre>{resolvedPayload ?? "Open to generate this debug snapshot."}</pre>
    </details>
  );
}

function practiceActorLabel(actorId: string, humanPlayerId: string, botPlayerId: string): string {
  if (actorId === humanPlayerId) return "You";
  return actorId === botPlayerId ? "Practice bot" : "Opponent seat";
}

/** Log-slot label with possessive grammar for ownership slots. */
function practiceActorLabelForm(
  actorId: string,
  usage: FabLogActorLabelUsage,
  humanPlayerId: string,
  botPlayerId: string,
): string {
  const subject = practiceActorLabel(actorId, humanPlayerId, botPlayerId);
  if (usage === "subject") return subject;
  if (usage === "possessive") return subject === "You" ? "Your" : `${subject}'s`;
  return subject === "You" ? "your" : "their";
}

function PracticeSessionDetails({ session }: { readonly session: FabPracticeSessionSummary }) {
  return (
    <section aria-labelledby="fab-practice-session-heading">
      <header className="fab-practice-lab-section-heading">
        <h4 id="fab-practice-session-heading">Session</h4>
        <span>Local match configuration</span>
      </header>
      <dl className="fab-practice-session-details">
        <div>
          <dt>Mode</dt>
          <dd>{session.mode}</dd>
        </div>
        {session.playerDeck ? (
          <div>
            <dt>Your deck</dt>
            <dd>{session.playerDeck}</dd>
          </div>
        ) : null}
        {session.botDeck ? (
          <div>
            <dt>Bot deck</dt>
            <dd>{session.botDeck}</dd>
          </div>
        ) : null}
        <div>
          <dt>Bot strategy</dt>
          <dd>{session.botStrategy}</dd>
        </div>
        <div>
          <dt>Seed</dt>
          <dd title={session.seed}>{session.seed}</dd>
        </div>
      </dl>
    </section>
  );
}

function formatPracticeTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function EmptyActivity({ children }: { readonly children: ReactNode }) {
  return <p className="fab-practice-activity-empty">{children}</p>;
}
