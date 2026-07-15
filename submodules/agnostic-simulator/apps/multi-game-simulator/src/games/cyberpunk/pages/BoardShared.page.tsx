import type { MatchState } from "@tcg/cyberpunk-engine";
import type {
  EngineInteractionView,
  InteractionSubmission,
  InteractionSubmissionValue,
} from "@tcg/protocol";
import { Board, EventLogPanel, InteractionPanel, MobileShell } from "@tcg/simulator-ui";
import { safeStringify } from "@tcg/simulator-runtime/debug";
import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type FormEvent,
  type ReactNode,
} from "react";
import { notifications } from "@mantine/notifications";
import type { SimulatorRendererPackage, SimulatorRendererProps } from "@tcg/simulator-contract";
import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";
import { IconMessageCircle, IconX } from "@tabler/icons-react";

import { AiControlPanel } from "../components/AiControlPanel";
import { CyberpunkBoardRuntimeProvider } from "../components/BoardRuntimeContext";
import type {
  LiveMatchSidebarConfig,
  LiveMatchSidebarParticipant,
} from "../components/BoardRuntimeContext";
import { ConnectionPanel } from "../components/ConnectionDiagnostics";
import { CardNameToken } from "../components/CardDisplay/CardNameToken";
import { ChatPanel, mapChatMessage } from "../components/ChatPanel/ChatPanel";
import { EndGameModal } from "../components/EndGameModal";
import { GameStateProvider } from "../components/GameBoard";
import { UserConfigButton } from "../components/UserConfig/UserConfigDialog";
import { CyberpunkSharedAnimationLayer } from "../animation";
import { cyberpunkRendererPackage } from "../cyberpunkRenderer";
import { useGameClock } from "../components/GameBoard/useGameClock";
import {
  EngineProvider,
  formatPlayerIdentityMeta,
  useEngine,
  type AISideConfig,
  type AiMode,
  type AiSpeed,
  type ChatMessage,
  type ChatPresetKey,
  type CyberpunkPostGameContext,
  type CyberpunkTestEngine,
  type EngineAction,
  type LocalCommandCommit,
  type MoveLog,
  type MoveLogEntry,
  type PlayerConnectionBySide,
  type PlayerIdentityBySide,
  type PostGameSurface,
  type RawEngineEventEntry,
  type ScenarioId,
  type Side,
} from "../engine";
import type { SimulatorConnectionDiagnosticInput } from "@tcg/game-page-contract/connection-diagnostic";
import { projectMoveLogEntries } from "../engine/moveLogProjection";
import { connectionUiStatus, isConnectionDisconnected } from "../engine/live/playerConnectionState";
import { useOpponentPresence } from "../engine/live/useOpponentPresence";
import { useSimulatorProjection } from "../engine/useSimulatorProjection";
import { apiUrl } from "../../../runtime/gameRuntimeApi";
import classes from "./BoardShared.module.css";
import sidebarClasses from "./Sidebar.module.css";

const EVENT_LOG_ENTRY_CAP = 200;
const CYBERPUNK_SHELL_BREAKPOINT_PX = 900;

type RendererPackage = ComponentType<SimulatorRendererProps>;

export interface BoardSharedPageProps {
  rendererPackage?: SimulatorRendererPackage<RendererPackage>;
  scenarioId?: ScenarioId;
  initialEngineBuilder?: () => CyberpunkTestEngine;
  initialAi?: AISideConfig;
  initialHumanSide?: Side;
  initialAiMode?: AiMode;
  initialAiSpeed?: AiSpeed;
  autoResolveSingletonCardTargets?: boolean;
  onMatchEnded?: (result: { winnerId: string | null; reason: string | null }) => void;
  postGameSurface?: PostGameSurface;

  // Server-authority / hosted match wiring forwarded to EngineProvider.
  remoteDispatch?: (
    action: EngineAction,
    state: MatchState,
    actor: {
      side: Side;
      interactionView: EngineInteractionView;
      submission: InteractionSubmission;
    },
  ) => boolean;
  remoteSubmitInteraction?: (
    submission: {
      side: Side;
      interactionView: EngineInteractionView;
      actionId: string;
      values: Record<string, InteractionSubmissionValue>;
    },
    state: MatchState,
  ) => boolean;
  requestRemoteUndo?: () => boolean;
  remoteMoveLogs?: ReadonlyArray<MoveLog>;
  remoteEngineEvents?: ReadonlyArray<RawEngineEventEntry>;
  remoteChatMessages?: ReadonlyArray<ChatMessage>;
  canSendChat?: boolean;
  remoteFreeTextEnabled?: boolean;
  remoteFreeTextProposalPending?: boolean;
  canRequestFreeText?: boolean;
  sendRemoteChatPreset?: (key: ChatPresetKey) => boolean;
  sendRemoteChatText?: (text: string) => boolean;
  requestRemoteFreeTextChat?: () => boolean;
  hasPendingRemoteMove?: boolean;
  remoteReturnUrl?: string;
  postGameContext?: CyberpunkPostGameContext;
  onLocalCommandCommitted?: (commit: LocalCommandCommit) => void;
  lockLocalHistoryControls?: boolean;
  lockLocalResetControls?: boolean;

  // Connection diagnostics surfaced in the sidebar.
  playerIdentities?: PlayerIdentityBySide;
  playerConnections?: PlayerConnectionBySide;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  onClaimRivalDrop?: () => void;
  liveMatchSidebar?: LiveMatchSidebarConfig;
}

export function BoardSharedPage(props: BoardSharedPageProps) {
  const [hasPendingAnimations, setHasPendingAnimations] = useState(false);
  const {
    rendererPackage: rendererPackageProp,
    scenarioId,
    initialEngineBuilder,
    initialAi,
    initialHumanSide,
    initialAiMode,
    initialAiSpeed,
    autoResolveSingletonCardTargets,
    onMatchEnded,
    postGameSurface,
    remoteDispatch,
    remoteSubmitInteraction,
    requestRemoteUndo,
    remoteMoveLogs,
    remoteEngineEvents,
    remoteChatMessages,
    canSendChat,
    remoteFreeTextEnabled,
    remoteFreeTextProposalPending,
    canRequestFreeText,
    sendRemoteChatPreset,
    sendRemoteChatText,
    requestRemoteFreeTextChat,
    hasPendingRemoteMove,
    remoteReturnUrl,
    postGameContext,
    onLocalCommandCommitted,
    lockLocalHistoryControls,
    lockLocalResetControls,
    playerIdentities,
    playerConnections,
    connectionDiagnostic,
    onClaimRivalDrop,
    liveMatchSidebar,
  } = props;

  const rendererPackage = rendererPackageProp ?? cyberpunkRendererPackage;

  return (
    <EngineProvider
      initialScenario={scenarioId}
      initialEngineBuilder={initialEngineBuilder}
      initialAi={initialAi}
      initialHumanSide={initialHumanSide}
      initialAiMode={initialAiMode}
      initialAiSpeed={initialAiSpeed}
      hasPendingAnimations={hasPendingAnimations}
      autoResolveSingletonCardTargets={autoResolveSingletonCardTargets}
      onMatchEnded={onMatchEnded}
      remoteDispatch={remoteDispatch}
      remoteSubmitInteraction={remoteSubmitInteraction}
      requestRemoteUndo={requestRemoteUndo}
      remoteMoveLogs={remoteMoveLogs}
      remoteEngineEvents={remoteEngineEvents}
      remoteChatMessages={remoteChatMessages}
      canSendChat={canSendChat}
      remoteFreeTextEnabled={remoteFreeTextEnabled}
      remoteFreeTextProposalPending={remoteFreeTextProposalPending}
      canRequestFreeText={canRequestFreeText}
      sendRemoteChatPreset={sendRemoteChatPreset}
      sendRemoteChatText={sendRemoteChatText}
      requestRemoteFreeTextChat={requestRemoteFreeTextChat}
      hasPendingRemoteMove={hasPendingRemoteMove}
      remoteReturnUrl={remoteReturnUrl}
      postGameContext={postGameContext}
      postGameSurface={postGameSurface}
      onLocalCommandCommitted={onLocalCommandCommitted}
      lockLocalHistoryControls={lockLocalHistoryControls}
      lockLocalResetControls={lockLocalResetControls}
    >
      <CyberpunkBoardRuntimeProvider
        value={{
          playerIdentities,
          playerConnections,
          connectionDiagnostic,
          onClaimRivalDrop,
          liveMatchSidebar,
        }}
      >
        <CyberpunkSharedAnimationLayer onAnimationPendingChange={setHasPendingAnimations}>
          <BoardSharedContent
            rendererPackage={rendererPackage}
            postGameSurface={postGameSurface}
            playerIdentities={playerIdentities}
            playerConnections={playerConnections}
            connectionDiagnostic={connectionDiagnostic}
            onClaimRivalDrop={onClaimRivalDrop}
            liveMatchSidebar={liveMatchSidebar}
          />
        </CyberpunkSharedAnimationLayer>
      </CyberpunkBoardRuntimeProvider>
    </EngineProvider>
  );
}

interface BoardSharedContentProps {
  rendererPackage?: SimulatorRendererPackage<RendererPackage>;
  postGameSurface?: PostGameSurface;
  playerIdentities?: PlayerIdentityBySide;
  playerConnections?: PlayerConnectionBySide;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  onClaimRivalDrop?: () => void;
  liveMatchSidebar?: LiveMatchSidebarConfig;
}

function BoardSharedContent({
  rendererPackage,
  postGameSurface,
  playerIdentities,
  playerConnections,
  connectionDiagnostic,
  onClaimRivalDrop,
  liveMatchSidebar,
}: BoardSharedContentProps) {
  const { fixture, onSubmitInteraction } = useSimulatorProjection();
  const { matchState, moveLogs, humanSide, chatMessages } = useEngine();
  const gameEnded = matchState.G.gameEnded;
  const eventLogEntries = projectMoveLogEntries(matchState, moveLogs, humanSide).slice(
    -EVENT_LOG_ENTRY_CAP,
  );
  const eventLogChatMessages = chatMessages.map((message) => mapChatMessage(message, humanSide));
  const eventLogCopyText = formatCyberpunkEventLogReadableCopy(eventLogEntries);
  const rawEventLogCopyText = formatCyberpunkEventLogRawCopy(eventLogEntries, moveLogs);
  const eventLogPanel = (
    <EventLogPanel
      embedded
      entries={eventLogEntries}
      renderMessage={renderEventLogMessage}
      chatMessages={eventLogChatMessages}
      copyText={eventLogCopyText}
      rawCopyText={rawEventLogCopyText}
    />
  );

  const BoardRenderer = rendererPackage?.BoardRenderer;
  // InteractionRenderer is intentionally not consumed here: the desktop board
  // (CyberpunkBoard) hosts the interaction overlay inline so the action panel
  // floats above the self hand. The renderer package still exports
  // InteractionRenderer (see cyberpunkRenderer.ts) for any other surface that
  // wants the dedicated panel.

  const sidebar = (
    <SidebarContent
      playerIdentities={playerIdentities}
      playerConnections={playerConnections}
      connectionDiagnostic={connectionDiagnostic}
      onClaimRivalDrop={onClaimRivalDrop}
      postGameSurface={postGameSurface}
      eventLogPanel={eventLogPanel}
      liveMatchSidebar={liveMatchSidebar}
    />
  );

  return (
    <main className={classes.pageShell}>
      {BoardRenderer ? (
        <MobileShell
          hasLog
          layoutBreakpoint={CYBERPUNK_SHELL_BREAKPOINT_PX}
          mobileNavigation="none"
          mobileNavigationBreakpoint={CYBERPUNK_SHELL_BREAKPOINT_PX}
          sidebar={sidebar}
          board={
            <section className={classes.boardViewport} aria-label={fixture.boardLayout.title}>
              <BoardRenderer fixture={fixture} onSubmitInteraction={onSubmitInteraction} />
            </section>
          }
          interactions={null}
          log={eventLogPanel}
        />
      ) : (
        <MobileShell
          hasLog
          layoutBreakpoint={CYBERPUNK_SHELL_BREAKPOINT_PX}
          sidebar={sidebar}
          board={
            <section className={classes.boardViewport} aria-label={fixture.boardLayout.title}>
              <Board
                table={fixture.table}
                entities={fixture.entities}
                layout={fixture.boardLayout}
                label={fixture.name}
              />
              {/*
                Generic-renderer fallback has no inline overlay host (the shared
                Board does not own a floating action slot), so the interaction
                panel is stacked inside the board section instead of occupying a
                dedicated MobileShell column. MobileShell still collapses to two
                columns because interactions is null.
              */}
              <div className="border-t border-[var(--board-border)] p-3">
                <InteractionPanel fixture={fixture} onSubmitInteraction={onSubmitInteraction} />
              </div>
            </section>
          }
          interactions={null}
          log={eventLogPanel}
        />
      )}
      {gameEnded && (
        <GameStateProvider>
          <EndGameModal />
        </GameStateProvider>
      )}
    </main>
  );
}

interface SidebarContentProps extends BoardSharedContentProps {
  eventLogPanel: ReactNode;
}

function SidebarContent({
  playerIdentities,
  playerConnections,
  connectionDiagnostic,
  onClaimRivalDrop,
  postGameSurface,
  eventLogPanel,
  liveMatchSidebar,
}: SidebarContentProps) {
  const isDeckBuilderPractice = postGameSurface === "deck-builder-practice";
  const humanSidebar = useMemo(
    () => (liveMatchSidebar ? resolveHumanMatchSidebar(liveMatchSidebar, playerConnections) : null),
    [liveMatchSidebar, playerConnections],
  );

  if (humanSidebar && liveMatchSidebar) {
    return (
      <HumanMatchSidebar
        config={liveMatchSidebar}
        model={humanSidebar}
        connectionDiagnostic={connectionDiagnostic}
        eventLogPanel={eventLogPanel}
        onClaimRivalDrop={onClaimRivalDrop}
      />
    );
  }

  return (
    <div
      className={sidebarClasses.sidebar}
      data-testid="cyberpunk-practice-sidebar"
      data-practice-surface={isDeckBuilderPractice ? "deck-builder" : "simulator"}
    >
      <div className={sidebarClasses.controlsSection}>
        <AiControlPanel
          compact
          embedded
          hideDecisionLog
          scenarioActionsVariant={isDeckBuilderPractice ? "hidden" : "details"}
        />
      </div>
      <div className={sidebarClasses.presenceSection}>
        <ConnectionPanel
          embedded
          playerIdentities={playerIdentities}
          playerConnections={playerConnections}
          connectionDiagnostic={connectionDiagnostic}
          onClaimRivalDrop={onClaimRivalDrop}
        />
      </div>
      <div className={sidebarClasses.logPanel}>
        <EventLogChatOverlay eventLogPanel={eventLogPanel} />
      </div>
    </div>
  );
}

function EventLogChatOverlay({ eventLogPanel }: { eventLogPanel: ReactNode }) {
  const [chatControlsOpen, setChatControlsOpen] = useState(false);

  useEffect(() => {
    if (!chatControlsOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setChatControlsOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [chatControlsOpen]);

  return (
    <div
      className={sidebarClasses.eventLogChatFrame}
      data-chat-open={chatControlsOpen ? "true" : "false"}
    >
      {eventLogPanel}
      <div className={sidebarClasses.eventLogChatOverlay}>
        {chatControlsOpen ? (
          <div className={sidebarClasses.eventLogChatPopover}>
            <div className={sidebarClasses.eventLogChatPopoverHeader}>
              <span>Chat</span>
              <span className={sidebarClasses.eventLogChatEscHint}>Esc</span>
              <button
                type="button"
                className={sidebarClasses.eventLogChatCloseButton}
                aria-label="Close chat popover"
                title="Close chat controls"
                onClick={() => setChatControlsOpen(false)}
              >
                <IconX size={14} stroke={2.4} aria-hidden="true" />
              </button>
            </div>
            <ChatPanel compact showMessages={false} />
          </div>
        ) : null}
        <button
          type="button"
          className={sidebarClasses.floatingChatButton}
          aria-label={chatControlsOpen ? "Close chat controls" : "Open chat controls"}
          aria-expanded={chatControlsOpen}
          title={chatControlsOpen ? "Close chat controls" : "Open chat controls"}
          onClick={() => setChatControlsOpen((open) => !open)}
        >
          <IconMessageCircle size={18} stroke={2.35} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

interface HumanMatchSidebarModel {
  self: LiveMatchSidebarParticipant;
  opponent: LiveMatchSidebarParticipant;
  selfSide: Side;
  opponentSide: Side;
  selfConnection?: PlayerConnectionBySide[Side];
  opponentConnection?: PlayerConnectionBySide[Side];
}

const REPORT_REASONS = [
  { value: "stalling", label: "Stalling" },
  { value: "abusive_chat", label: "Abusive chat" },
  { value: "exploit", label: "Exploit" },
  { value: "collusion", label: "Collusion" },
  { value: "inappropriate_name", label: "Inappropriate name" },
  { value: "intentional_disconnect", label: "Intentional disconnect" },
  { value: "other", label: "Other" },
] as const;

type SupportDialog = "bug" | "feature" | "feedback";

const SUPPORT_DIALOG_COPY: Record<
  SupportDialog,
  { title: string; description: string; placeholder: string; successTitle: string }
> = {
  bug: {
    title: "Report bug",
    description: "Tell us what went wrong. This includes the match context automatically.",
    placeholder: "What happened?",
    successTitle: "Bug report submitted",
  },
  feature: {
    title: "Request feature",
    description: "Tell us what would make this match experience better.",
    placeholder: "What should we add or improve?",
    successTitle: "Feature request submitted",
  },
  feedback: {
    title: "Share feedback",
    description: "Tell us what would make the simulator more useful.",
    placeholder: "What should we improve?",
    successTitle: "Feedback submitted",
  },
};

function HumanMatchSidebar({
  config,
  model,
  connectionDiagnostic,
  eventLogPanel,
  onClaimRivalDrop,
}: {
  config: LiveMatchSidebarConfig;
  model: HumanMatchSidebarModel;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  eventLogPanel: ReactNode;
  onClaimRivalDrop?: () => void;
}) {
  const { matchState, prioritySide } = useEngine();
  const clock = useGameClock(prioritySide, { paused: matchState.G.gameEnded });
  const opponentPresence = useOpponentPresence(model.opponentConnection);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [friendState, setFriendState] = useState<"idle" | "loading" | "done">("idle");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] =
    useState<(typeof REPORT_REASONS)[number]["value"]>("stalling");
  const [reportDetails, setReportDetails] = useState("");
  const [reportState, setReportState] = useState<"idle" | "loading" | "done">("idle");
  const [supportDialog, setSupportDialog] = useState<SupportDialog | null>(null);
  const [supportText, setSupportText] = useState("");
  const [supportState, setSupportState] = useState<"idle" | "loading">("idle");
  const opponentScore = scoreForSeat(config, model.opponent.seat);
  const selfScore = scoreForSeat(config, model.self.seat);
  const canAddFriend = Boolean(model.opponent.userId);
  const opponentDisconnected = isConnectionDisconnected(model.opponentConnection);
  const opponentTimeoutExpired = Boolean(
    !matchState.G.gameEnded &&
    connectionUiStatus(model.selfConnection) === "connected" &&
    connectionUiStatus(model.opponentConnection) === "connected" &&
    clock[model.opponentSide].seconds <= 0,
  );
  const canDropOpponent = Boolean(
    onClaimRivalDrop && (opponentPresence.canDrop || opponentTimeoutExpired),
  );
  const showDropControl = Boolean(
    onClaimRivalDrop && (opponentDisconnected || opponentTimeoutExpired),
  );
  const dropStatusText = opponentTimeoutExpired
    ? "Opponent clock expired. The server will validate the timeout before ending the game."
    : opponentPresence.canDrop
      ? "Opponent has been disconnected long enough to drop."
      : opponentDisconnected
        ? `Opponent disconnected. Drop available in ${opponentPresence.secondsRemaining}s.`
        : null;
  const selfConnectionStatus = connectionLabel(model.selfConnection);
  const showSelfConnectionAlert =
    selfConnectionStatus.status === "reconnecting" ||
    selfConnectionStatus.status === "disconnected";

  async function addOpponentFriend(): Promise<void> {
    if (!model.opponent.userId || friendState === "loading" || friendState === "done") {
      return;
    }
    setFriendState("loading");
    try {
      const response = await fetch(
        apiUrl("platform", `/friends/by-user/${encodeURIComponent(model.opponent.userId)}`),
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            matchId: config.matchId,
            gameId: config.gameId,
          }),
        },
      );
      if (!response.ok) {
        throw new Error(await readResponseMessage(response, "Could not add friend."));
      }
      setFriendState("done");
      notifications.show({
        color: "green",
        title: "Friend added",
        message: `${model.opponent.displayName} is now in your friends list.`,
      });
    } catch (error) {
      setFriendState("idle");
      notifications.show({
        color: "red",
        title: "Friend request failed",
        message: error instanceof Error ? error.message : "Could not add friend.",
      });
    }
  }

  function openSupportDialog(kind: SupportDialog): void {
    setActionMenuOpen(false);
    setSupportDialog(kind);
    setSupportText("");
    setSupportState("idle");
  }

  async function submitSupport(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!supportDialog || supportState === "loading" || supportText.trim().length === 0) {
      return;
    }

    const text = supportText.trim();
    setSupportState("loading");
    try {
      const isBug = supportDialog === "bug";
      const response = await fetch(
        apiUrl("platform", isBug ? "/feedback/bug-reports" : "/feedback"),
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: isBug
            ? JSON.stringify({
                description: text,
                source: "cyberpunk-live-match-sidebar",
                context: {
                  gameId: config.gameId,
                  gameSlug: "cyberpunk",
                  matchId: config.matchId,
                  stateVersion: matchState.ctx.stateID,
                  turn: matchState.G.turnMetadata.turnNumber,
                  platform: window.innerWidth < 768 ? "mobile" : "desktop",
                },
              })
            : JSON.stringify({
                message: supportDialog === "feature" ? `Feature request: ${text}` : text,
                source: "cyberpunk-live-match-sidebar",
              }),
        },
      );
      if (!response.ok) {
        throw new Error(await readResponseMessage(response, "Could not send this right now."));
      }
      notifications.show({
        color: "green",
        title: SUPPORT_DIALOG_COPY[supportDialog].successTitle,
        message: "Thanks. The team will review it.",
      });
      setSupportDialog(null);
      setSupportText("");
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Support request failed",
        message: error instanceof Error ? error.message : "Could not send this right now.",
      });
    } finally {
      setSupportState("idle");
    }
  }

  async function submitReport(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (reportState === "loading") {
      return;
    }
    setReportState("loading");
    try {
      const response = await fetch(apiUrl("platform", "/moderation/player-reports"), {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          reportedGameProfileId: model.opponent.id,
          matchId: config.matchId,
          gameId: config.gameId,
          reason: reportReason,
          details: reportDetails.trim() || undefined,
        }),
      });
      if (!response.ok) {
        throw new Error(await readResponseMessage(response, "Could not submit report."));
      }
      setReportState("done");
      setReportOpen(false);
      notifications.show({
        color: "green",
        title: "Report submitted",
        message: "Thanks. Moderators will review this match.",
      });
    } catch (error) {
      setReportState("idle");
      notifications.show({
        color: "red",
        title: "Report failed",
        message: error instanceof Error ? error.message : "Could not submit report.",
      });
    }
  }

  return (
    <div
      className={`${sidebarClasses.sidebar} ${sidebarClasses.humanSidebar ?? ""}`}
      data-testid="cyberpunk-human-match-sidebar"
    >
      <div className={sidebarClasses.humanTop}>
        <PlayerSummaryCard
          config={config}
          role="opponent"
          participant={model.opponent}
          side={model.opponentSide}
          connection={model.opponentConnection}
          connectionDiagnostic={connectionDiagnostic}
          score={opponentScore}
        />
        <div className={sidebarClasses.actionMenuWrap}>
          <button
            type="button"
            className={sidebarClasses.sidebarActionButton}
            aria-expanded={actionMenuOpen}
            aria-controls="cyberpunk-player-actions-menu"
            onClick={() => setActionMenuOpen((open) => !open)}
          >
            Player actions
          </button>
          {actionMenuOpen ? (
            <div
              id="cyberpunk-player-actions-menu"
              className={sidebarClasses.actionMenu}
              role="menu"
              aria-label="Player actions"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setActionMenuOpen(false);
                  void addOpponentFriend();
                }}
                disabled={!canAddFriend || friendState === "loading" || friendState === "done"}
              >
                {friendState === "done"
                  ? "Friend added"
                  : friendState === "loading"
                    ? "Adding..."
                    : "Add friend"}
              </button>
              <button
                type="button"
                role="menuitem"
                className={sidebarClasses.actionMenuDanger}
                onClick={() => {
                  setActionMenuOpen(false);
                  setReportOpen(true);
                }}
              >
                Report player
              </button>
              <button type="button" role="menuitem" onClick={() => openSupportDialog("bug")}>
                Report bug
              </button>
              <button type="button" role="menuitem" onClick={() => openSupportDialog("feature")}>
                Request feature
              </button>
              <button type="button" role="menuitem" onClick={() => openSupportDialog("feedback")}>
                Share feedback
              </button>
            </div>
          ) : null}
          {showDropControl ? (
            <div className={sidebarClasses.dropControl}>
              <button
                type="button"
                className={`${sidebarClasses.sidebarActionButton} ${sidebarClasses.sidebarDangerButton}`}
                onClick={onClaimRivalDrop}
                disabled={!canDropOpponent}
              >
                Drop opponent
              </button>
              {dropStatusText ? <span>{dropStatusText}</span> : null}
            </div>
          ) : null}
        </div>
        <details className={sidebarClasses.sidebarDrawer}>
          <summary>Details</summary>
          <PlayerDetails participant={model.opponent} />
        </details>
      </div>

      <div className={sidebarClasses.humanLogPanel}>
        <EventLogChatOverlay eventLogPanel={eventLogPanel} />
      </div>

      <div className={sidebarClasses.humanBottom}>
        {showSelfConnectionAlert ? (
          <section
            className={sidebarClasses.selfConnectionAlert}
            data-status={selfConnectionStatus.status}
            role="status"
            aria-live="polite"
          >
            <span className={sidebarClasses.selfConnectionAlertKicker}>
              {selfConnectionStatus.status === "reconnecting" ? "Reconnecting" : "Connection lost"}
            </span>
            <strong>Actions are paused.</strong>
            <span>Wait for this to clear before trying a move, pass, undo, or mulligan again.</span>
          </section>
        ) : null}
        <PlayerSummaryCard
          config={config}
          role="self"
          participant={model.self}
          side={model.selfSide}
          connection={model.selfConnection}
          connectionDiagnostic={connectionDiagnostic}
          score={selfScore}
        />
        <div className={sidebarClasses.selfActions}>
          <UserConfigButton />
          {config.returnUrl ? (
            <a className={sidebarClasses.returnLink} href={config.returnUrl}>
              Matchmaking
            </a>
          ) : null}
        </div>
      </div>

      {reportOpen ? (
        <div
          className={sidebarClasses.reportOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cyberpunk-report-title"
        >
          <form className={sidebarClasses.reportDialog} onSubmit={submitReport}>
            <header className={sidebarClasses.reportHeader}>
              <span id="cyberpunk-report-title">Report {model.opponent.displayName}</span>
              <button type="button" onClick={() => setReportOpen(false)} aria-label="Close report">
                x
              </button>
            </header>
            <label className={sidebarClasses.reportField}>
              <span>Reason</span>
              <select
                value={reportReason}
                onChange={(event) =>
                  setReportReason(event.currentTarget.value as typeof reportReason)
                }
              >
                {REPORT_REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={sidebarClasses.reportField}>
              <span>Details</span>
              <textarea
                value={reportDetails}
                onChange={(event) => setReportDetails(event.currentTarget.value)}
                maxLength={2000}
                rows={4}
                placeholder="What happened?"
              />
            </label>
            <div className={sidebarClasses.reportActions}>
              <button type="button" onClick={() => setReportOpen(false)}>
                Cancel
              </button>
              <button type="submit" disabled={reportState === "loading"}>
                {reportState === "loading" ? "Submitting..." : "Submit report"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {supportDialog ? (
        <div
          className={sidebarClasses.reportOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cyberpunk-support-title"
        >
          <form className={sidebarClasses.reportDialog} onSubmit={submitSupport}>
            <header className={sidebarClasses.reportHeader}>
              <span id="cyberpunk-support-title">{SUPPORT_DIALOG_COPY[supportDialog].title}</span>
              <button
                type="button"
                onClick={() => setSupportDialog(null)}
                aria-label="Close support dialog"
              >
                x
              </button>
            </header>
            <p className={sidebarClasses.reportDescription}>
              {SUPPORT_DIALOG_COPY[supportDialog].description}
            </p>
            <label className={sidebarClasses.reportField}>
              <span>{supportDialog === "bug" ? "Description" : "Message"}</span>
              <textarea
                value={supportText}
                onChange={(event) => setSupportText(event.currentTarget.value)}
                maxLength={supportDialog === "bug" ? 5000 : 2000}
                rows={5}
                placeholder={SUPPORT_DIALOG_COPY[supportDialog].placeholder}
              />
            </label>
            <div className={sidebarClasses.reportActions}>
              <button type="button" onClick={() => setSupportDialog(null)}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={supportState === "loading" || supportText.trim().length === 0}
              >
                {supportState === "loading" ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function PlayerSummaryCard({
  config,
  role,
  participant,
  side,
  connection,
  connectionDiagnostic,
  score,
}: {
  config: LiveMatchSidebarConfig;
  role: "self" | "opponent";
  participant: LiveMatchSidebarParticipant;
  side: Side;
  connection?: PlayerConnectionBySide[Side];
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  score: number | undefined;
}) {
  const [connectionOpen, setConnectionOpen] = useState(false);
  const connectionStatus = connectionLabel(connection);
  const meta = formatPlayerIdentityMeta(participant);
  const technicalRows = connectionTechnicalRows({
    config,
    participant,
    connection,
    connectionDiagnostic,
  });
  return (
    <section
      className={sidebarClasses.playerCard}
      data-role={role}
      data-side={side}
      data-testid={`human-sidebar-${role}`}
    >
      <div className={sidebarClasses.playerHeader}>
        <div className={sidebarClasses.playerAvatar} aria-hidden>
          {initialsFor(participant.displayName)}
        </div>
        <div className={sidebarClasses.playerTitleBlock}>
          <span className={sidebarClasses.playerKicker}>
            {role === "self" ? "You" : "Opponent"} · Seat {participant.seat}
          </span>
          <span className={sidebarClasses.playerName}>{participant.displayName}</span>
        </div>
        <div className={sidebarClasses.connectionStatusControl}>
          <button
            type="button"
            className={sidebarClasses.connectionDotButton}
            data-status={connectionStatus.status}
            aria-expanded={connectionOpen}
            aria-label={`${participant.displayName} connection status: ${connectionStatus.label}`}
            onClick={() => setConnectionOpen((open) => !open)}
          >
            <span className={sidebarClasses.connectionDot} data-status={connectionStatus.status} />
          </button>
          {connectionOpen ? (
            <div
              className={sidebarClasses.connectionPopover}
              role="dialog"
              aria-label={`${participant.displayName} connection details`}
            >
              <div className={sidebarClasses.connectionPopoverHeader}>
                <div>
                  <span className={sidebarClasses.connectionPopoverKicker}>
                    {role === "self" ? "Your connection" : "Opponent presence"}
                  </span>
                  <strong>{connectionHeadline(connectionStatus.status, role)}</strong>
                </div>
                <span
                  className={sidebarClasses.connectionStatusBadge}
                  data-status={connectionStatus.status}
                >
                  {connectionStatus.label}
                </span>
              </div>
              <p className={sidebarClasses.connectionStatusMessage}>
                {connectionStatusMessage(connectionStatus.status, participant.displayName, role)}
              </p>
              <dl className={sidebarClasses.connectionMetricGrid}>
                <div>
                  <dt>Latency</dt>
                  <dd>{formatLatency(connection?.latencyMs)}</dd>
                </div>
                <div>
                  <dt>Disconnects</dt>
                  <dd>{connection?.disconnectCount ?? 0}</dd>
                </div>
              </dl>
              <details className={sidebarClasses.connectionDetails}>
                <summary>
                  Technical details
                  <span>Show</span>
                </summary>
                <dl className={sidebarClasses.connectionDetailGrid}>
                  {technicalRows.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd title={row.value}>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            </div>
          ) : null}
        </div>
      </div>
      <div className={sidebarClasses.playerMeta}>
        {typeof score === "number" ? <span>Score {score}</span> : null}
        {meta ? <span>{meta}</span> : null}
        {participant.deckName ? <span>{participant.deckName}</span> : null}
      </div>
    </section>
  );
}

function connectionTechnicalRows({
  config,
  participant,
  connection,
  connectionDiagnostic,
}: {
  config: LiveMatchSidebarConfig;
  participant: LiveMatchSidebarParticipant;
  connection?: PlayerConnectionBySide[Side];
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
}): Array<{ label: string; value: string }> {
  const gateway = connectionDiagnostic?.connection;
  return [
    { label: "Profile", value: participant.id },
    { label: "User", value: participant.userId ?? "None" },
    { label: "Game", value: config.gameId },
    { label: "Match", value: config.matchId },
    { label: "Last ping", value: formatTimestamp(connection?.lastPingAt) },
    { label: "Disconnected", value: connection?.disconnectedAt ?? "None" },
    { label: "Gateway", value: gateway?.status ?? "Unknown" },
    { label: "Connection", value: gateway?.connectionId ?? "None" },
    { label: "Auth", value: gateway?.authModeLabel ?? "Unknown" },
    { label: "Reconnects", value: String(gateway?.reconnectAttempts ?? 0) },
  ];
}

function connectionHeadline(
  status: "connected" | "reconnecting" | "disconnected" | "unknown",
  role: "self" | "opponent",
): string {
  if (status === "connected") return role === "self" ? "Match server is live" : "Presence is live";
  if (status === "reconnecting") return role === "self" ? "Rejoining match" : "Reconnecting";
  if (status === "disconnected") return role === "self" ? "Disconnected" : "Opponent offline";
  return "Checking status";
}

function connectionStatusMessage(
  status: "connected" | "reconnecting" | "disconnected" | "unknown",
  name: string,
  role: "self" | "opponent",
): string {
  if (status === "connected") {
    return role === "self"
      ? "Your match connection is currently stable."
      : `${name} is connected to this match.`;
  }
  if (status === "reconnecting") {
    return role === "self"
      ? "Trying to restore your match connection."
      : `${name} is reconnecting to this match.`;
  }
  if (status === "disconnected") {
    return role === "self"
      ? "Your browser is disconnected from the match server."
      : `${name} is disconnected from this match.`;
  }
  return "Waiting for live presence data.";
}

function formatLatency(latencyMs: number | undefined): string {
  return typeof latencyMs === "number" ? `${latencyMs}ms` : "Measuring";
}

function formatTimestamp(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "None";
  }
  return new Date(value).toISOString();
}

function PlayerDetails({ participant }: { participant: LiveMatchSidebarParticipant }) {
  return (
    <dl className={sidebarClasses.detailsList}>
      <div>
        <dt>Profile</dt>
        <dd>{participant.id}</dd>
      </div>
      {participant.userId ? (
        <div>
          <dt>User</dt>
          <dd>{participant.userId}</dd>
        </div>
      ) : null}
    </dl>
  );
}

function resolveHumanMatchSidebar(
  config: LiveMatchSidebarConfig,
  connections: PlayerConnectionBySide | undefined,
): HumanMatchSidebarModel | null {
  if (config.participants.length < 2) {
    return null;
  }
  const local = config.localPlayerId
    ? config.participants.find(
        (participant) =>
          participant.id === config.localPlayerId || participant.userId === config.localPlayerId,
      )
    : null;
  if (!local || !isRealHumanParticipant(local)) {
    return null;
  }
  const opponent = config.participants.find(
    (participant) => participant.id !== local.id && isRealHumanParticipant(participant),
  );
  if (!opponent) {
    return null;
  }
  const selfSide = sideForSeat(local.seat);
  const opponentSide = sideForSeat(opponent.seat);
  return {
    self: local,
    opponent,
    selfSide,
    opponentSide,
    selfConnection: connections?.[selfSide],
    opponentConnection: connections?.[opponentSide],
  };
}

function isRealHumanParticipant(participant: LiveMatchSidebarParticipant): boolean {
  return Boolean(
    participant.userId &&
    !participant.userId.startsWith("bot_") &&
    !participant.userId.startsWith("guest_"),
  );
}

function sideForSeat(seat: 1 | 2): Side {
  return seat === 1 ? "player" : "opponent";
}

function scoreForSeat(config: LiveMatchSidebarConfig, seat: 1 | 2): number | undefined {
  return seat === 1 ? config.player1Score : config.player2Score;
}

function connectionLabel(connection: PlayerConnectionBySide[Side] | undefined): {
  status: "connected" | "reconnecting" | "disconnected" | "unknown";
  label: string;
} {
  if (!connection?.status) {
    return { status: "unknown", label: "Status unknown" };
  }
  if (connection.status === "connected") {
    return { status: "connected", label: "Connected" };
  }
  if (connection.status === "reconnecting") {
    return { status: "reconnecting", label: "Reconnecting" };
  }
  return { status: "disconnected", label: "Disconnected" };
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts.length > 1 ? parts[1]?.[0] : parts[0]?.[1];
  return `${first}${second ?? ""}`.toUpperCase();
}

async function readResponseMessage(response: Response, fallback: string): Promise<string> {
  try {
    const payload = (await response.json()) as {
      message?: string;
      error?: { message?: string } | string;
    };
    if (typeof payload.error === "object" && payload.error?.message) {
      return payload.error.message;
    }
    if (payload.message) {
      return payload.message;
    }
    if (typeof payload.error === "string") {
      return payload.error;
    }
  } catch {
    // Keep the caller's fallback when the response body is not JSON.
  }
  return fallback;
}

function formatCyberpunkEventLogReadableCopy(entries: readonly SimulatorEventLogEntry[]): string {
  return [
    "# Cyberpunk event log",
    entries.length === 0
      ? "No event log entries."
      : entries.map(formatEventLogEntryForClipboard).join("\n"),
  ].join("\n");
}

function formatCyberpunkEventLogRawCopy(
  entries: readonly SimulatorEventLogEntry[],
  moveLogs: readonly MoveLogEntry[],
): string {
  return [
    "# Cyberpunk raw event log",
    "",
    "# Projected entries",
    safeStringify(entries),
    "",
    "# Viewer-safe Cyberpunk move logs",
    safeStringify(moveLogs),
  ].join("\n");
}

function formatEventLogEntryForClipboard(entry: SimulatorEventLogEntry): string {
  const timestamp = entry.timestamp ? ` ${entry.timestamp}` : "";
  const speaker = speakerLabel(entry.seatId);
  const tags = entry.tags.length > 0 ? ` [${entry.tags.join(", ")}]` : "";
  return `Turn ${entry.turn}${timestamp} ${speaker} ${entry.phase}${tags}: ${entry.message}`;
}

function speakerLabel(seatId: string | undefined): string {
  if (!seatId) return "SYS";
  if (seatId === "player" || seatId === "p1") return "P1";
  if (seatId === "opponent" || seatId === "p2") return "P2";
  return seatId.slice(0, 3).toUpperCase();
}

function renderEventLogMessage(entry: SimulatorEventLogEntry): ReactNode {
  if (!entry.cardRefs || entry.cardRefs.length === 0) {
    return entry.message;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;
  const refsByName = new Map<string, NonNullable<SimulatorEventLogEntry["cardRefs"]>>();
  for (const ref of entry.cardRefs) {
    const queue = refsByName.get(ref.name) ?? [];
    queue.push(ref);
    refsByName.set(ref.name, queue);
  }
  const names = [...refsByName.keys()].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`\\b(${names.map(escapeRegExp).join("|")})\\b`, "g");

  for (const match of entry.message.matchAll(pattern)) {
    const matchedName = match[0];
    const index = match.index ?? 0;
    if (index > cursor) {
      parts.push(entry.message.slice(cursor, index));
    }
    const ref = refsByName.get(matchedName)?.shift();
    parts.push(
      <CardNameToken
        key={`${entry.id}:${index}:${matchedName}`}
        cardId={ref?.id}
        fallbackName={matchedName}
        interactive={false}
      />,
    );
    cursor = index + matchedName.length;
  }

  if (parts.length === 0) {
    return entry.message;
  }
  if (cursor < entry.message.length) {
    parts.push(entry.message.slice(cursor));
  }
  return parts;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
