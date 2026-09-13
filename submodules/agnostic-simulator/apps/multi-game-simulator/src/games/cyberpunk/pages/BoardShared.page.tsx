import type { MatchState, PlayerPrompt } from "@tcg/cyberpunk-engine";
import type {
  EngineInteractionView,
  InteractionSubmission,
  InteractionSubmissionValue,
} from "@tcg/protocol";
import {
  Board,
  ConnectionPanel as SharedConnectionPanel,
  EventLogPanel,
  InteractionPanel,
  SimulatorActivityTabs,
  SimulatorMatchSidebar,
  SimulatorViewportShell,
  type SimulatorMatchActions,
  type SimulatorMatchParticipant,
} from "@tcg/simulator-ui";
import { safeStringify } from "@tcg/simulator-runtime/debug";
import { createSimulatorExternalCommandGate } from "@tcg/simulator-runtime/animation";
import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import type { SimulatorRendererPackage, SimulatorRendererProps } from "@tcg/simulator-contract";
import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";

import { DeferredAiControlPanel } from "../components/AiControlPanel/DeferredAiControlPanel";
import { SimulatorBotQuickControls } from "../../../simulator/SimulatorBotQuickControls";
import { CyberpunkBoardRuntimeProvider } from "../components/BoardRuntimeContext";
import type {
  LiveMatchSidebarConfig,
  LiveMatchSidebarParticipant,
} from "../components/BoardRuntimeContext";
import { ConnectionPanel } from "../components/ConnectionDiagnostics";
import { CardNameToken } from "../components/CardDisplay/CardNameToken";
import { mapChatMessage } from "../components/ChatPanel/ChatPanel";
import { DeferredChatPanel } from "../components/ChatPanel/DeferredChatPanel";
import { EndGameModal } from "../components/EndGameModal";
import { ConfirmDialog, GameStateProvider, PassTurnControl } from "../components/GameBoard";
import {
  CyberpunkSettingsFields,
  UserConfigButton,
  UserConfigDialog,
} from "../components/UserConfig/UserConfigDialog";
import { CyberpunkSharedAnimationLayer } from "../animation";
import { cyberpunkRendererPackage } from "../cyberpunkRenderer";
import { useGameClock } from "../components/GameBoard/useGameClock";
import {
  EngineProvider,
  PLAYER_SIDE_TO_ID,
  formatPlayerIdentityMeta,
  otherSide,
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
import {
  buildSimulatorConnectionDiagnostic,
  type SimulatorConnectionDiagnosticInput,
} from "@tcg/game-page-contract/connection-diagnostic";
import { projectMoveLogEntries } from "../engine/moveLogProjection";
import {
  SimulatorOpponentParticipantActions,
  SimulatorSelfParticipantActions,
} from "../../../simulator/participant-actions";
import { connectionUiStatus, isConnectionDisconnected } from "../engine/live/playerConnectionState";
import { useOpponentPresence } from "../engine/live/useOpponentPresence";
import { useSimulatorProjection } from "../engine/useSimulatorProjection";
import { projectConnectionPanelDiagnostic } from "../../../simulator/connection-panel-projection";
import classes from "./BoardShared.module.css";
import sidebarClasses from "./Sidebar.module.css";

const EVENT_LOG_ENTRY_CAP = 200;
const CYBERPUNK_SHELL_BREAKPOINT_PX = 767;

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
  remoteInteractionView?: EngineInteractionView;
  remotePrompt?: PlayerPrompt;
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
  const animationCommandGate = useMemo(() => createSimulatorExternalCommandGate(), []);
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
    remoteInteractionView,
    remotePrompt,
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
      animationCommandGate={animationCommandGate}
      autoResolveSingletonCardTargets={autoResolveSingletonCardTargets}
      onMatchEnded={onMatchEnded}
      remoteDispatch={remoteDispatch}
      remoteSubmitInteraction={remoteSubmitInteraction}
      remoteInteractionView={remoteInteractionView}
      remotePrompt={remotePrompt}
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
        <CyberpunkSharedAnimationLayer commandGate={animationCommandGate}>
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
  const eventLogCopyText = formatCyberpunkEventLogReadableCopy(eventLogEntries);
  const rawEventLogCopyText = formatCyberpunkEventLogRawCopy(eventLogEntries, moveLogs);
  const eventLogPanel = (
    <EventLogPanel
      embedded
      showHeader={false}
      entries={eventLogEntries}
      renderMessage={renderEventLogMessage}
      copyText={eventLogCopyText}
      rawCopyText={rawEventLogCopyText}
    />
  );
  const combinedEventLogPanel = (
    <EventLogPanel
      embedded
      showHeader={false}
      entries={eventLogEntries}
      chatMessages={chatMessages.map((message) => mapChatMessage(message, humanSide))}
      renderMessage={renderEventLogMessage}
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
    <GameStateProvider>
      <SidebarContent
        playerIdentities={playerIdentities}
        playerConnections={playerConnections}
        connectionDiagnostic={connectionDiagnostic}
        onClaimRivalDrop={onClaimRivalDrop}
        postGameSurface={postGameSurface}
        eventLogPanel={eventLogPanel}
        combinedEventLogPanel={combinedEventLogPanel}
        liveMatchSidebar={liveMatchSidebar}
      />
    </GameStateProvider>
  );

  const tabletop = (
    <section className={classes.boardViewport} aria-label={fixture.boardLayout.title}>
      {BoardRenderer ? (
        <BoardRenderer fixture={fixture} onSubmitInteraction={onSubmitInteraction} />
      ) : (
        <>
          <Board
            table={fixture.table}
            entities={fixture.entities}
            layout={fixture.boardLayout}
            label={fixture.name}
          />
          <div className="border-t border-[var(--board-border)] p-3">
            <InteractionPanel fixture={fixture} onSubmitInteraction={onSubmitInteraction} />
          </div>
        </>
      )}
    </section>
  );

  return (
    <SimulatorViewportShell
      className={classes.pageShell}
      data-game="cyberpunk"
      data-theme="dark"
      mobileBreakpoint={CYBERPUNK_SHELL_BREAKPOINT_PX}
      sidebar={sidebar}
      mobilePanel={
        <div className={sidebarClasses.mobileActivityPanel}>
          <SimulatorActivityTabs
            log={eventLogPanel}
            chat={<DeferredChatPanel />}
            combined={combinedEventLogPanel}
          />
          <div className={sidebarClasses.mobileUtilityBar}>
            <UserConfigButton />
          </div>
        </div>
      }
      mobilePanelLabel="Cyberpunk activity and utilities"
      mobileTopRail={
        BoardRenderer
          ? undefined
          : ({ openSidebar }) => (
              <button type="button" className={classes.fallbackMobileRail} onClick={openSidebar}>
                Match panel
              </button>
            )
      }
      mobileBottomRail={
        BoardRenderer ? undefined : <div className={classes.fallbackMobileRail}>Tabletop</div>
      }
      tabletop={tabletop}
    >
      {gameEnded && (
        <GameStateProvider>
          <EndGameModal />
        </GameStateProvider>
      )}
    </SimulatorViewportShell>
  );
}

interface SidebarContentProps extends BoardSharedContentProps {
  eventLogPanel: ReactNode;
  combinedEventLogPanel: ReactNode;
}

function SidebarContent({
  playerIdentities,
  playerConnections,
  connectionDiagnostic,
  onClaimRivalDrop,
  postGameSurface,
  eventLogPanel,
  combinedEventLogPanel,
  liveMatchSidebar,
}: SidebarContentProps) {
  const isDeckBuilderPractice = postGameSurface === "deck-builder-practice";
  const {
    matchState,
    humanSide,
    prioritySide,
    aiMode,
    aiStrategies,
    aiTakeover,
    interactionViews,
    setAiMode,
    stepOnce,
    takeOverAiSide,
    releaseAiTakeover,
  } = useEngine();
  const clock = useGameClock(prioritySide, { paused: matchState.G.gameEnded });
  const matchActions = useCyberpunkMatchActions();
  const [practiceConfigurationOpen, setPracticeConfigurationOpen] = useState(false);
  const rivalSide = otherSide(humanSide);
  const controlledBotSide = aiTakeover?.side ?? rivalSide;
  const canTakeControl = aiTakeover !== null || aiStrategies[controlledBotSide] !== null;
  const botInteractionView = interactionViews[controlledBotSide];
  const canStepBot =
    aiMode === "step" &&
    aiTakeover === null &&
    aiStrategies[controlledBotSide] !== null &&
    (botInteractionView.status === "choosing" ||
      (botInteractionView.status === "ready" &&
        botInteractionView.actions.some((action) => action.enabled)));
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
        combinedEventLogPanel={combinedEventLogPanel}
        onClaimRivalDrop={onClaimRivalDrop}
        matchActions={matchActions.actions}
        matchActionConfirmation={matchActions.confirmation}
      />
    );
  }

  const activeSide =
    matchState.G.turnMetadata.activePlayerId === PLAYER_SIDE_TO_ID.player ? "player" : "opponent";
  const toPracticeParticipant = (
    side: Side,
    role: "self" | "opponent",
  ): SimulatorMatchParticipant => {
    const identity = playerIdentities?.[side];
    return {
      id: identity?.id ?? side,
      role,
      name: identity?.displayName ?? (role === "self" ? "You" : "Rival"),
      shortLabel: role === "self" ? "YOU" : "OP",
      clock: clock[side].time,
      active: activeSide === side,
      priority: prioritySide === side,
      status: prioritySide === side ? "Priority" : "Waiting",
      meta: formatPlayerIdentityMeta(identity) || (role === "self" ? "Local player" : "Rival"),
    };
  };

  return (
    <>
      <SimulatorMatchSidebar
        className={sidebarClasses.sharedSidebar}
        data-testid="cyberpunk-practice-sidebar"
        data-practice-surface={isDeckBuilderPractice ? "deck-builder" : "simulator"}
        opponent={toPracticeParticipant(rivalSide, "opponent")}
        self={{
          ...toPracticeParticipant(humanSide, "self"),
          actions: (
            <SimulatorSelfParticipantActions
              gameConfiguration={{
                settings: <CyberpunkSettingsFields />,
                requiresConfirmation: false,
                onSelect: () => setPracticeConfigurationOpen(true),
              }}
              support={{
                source: "cyberpunk-practice-participant-menu",
                gameSlug: "cyberpunk",
                stateVersion: matchState.ctx.stateID,
                turn: matchState.G.turnMetadata.turnNumber,
              }}
            />
          ),
        }}
        automation={{
          label: "Bot controls",
          panelLabel: "Bot strategy and pacing controls",
          summary: (
            <span className={sidebarClasses.automationSummary}>
              <span>{aiTakeover ? "Seat control" : "Bot playback"}</span>
              <strong>
                {aiTakeover
                  ? "You control bot"
                  : aiMode === "step"
                    ? "Paused · step"
                    : "Auto-running"}
              </strong>
            </span>
          ),
          control: (
            <SimulatorBotQuickControls
              pacing={aiMode}
              takeoverActive={aiTakeover !== null}
              canTakeover={canTakeControl}
              canStep={canStepBot}
              disabled={matchState.G.gameEnded}
              testIdPrefix="cyberpunk-practice-quick"
              onToggleTakeover={() => {
                if (aiTakeover) {
                  releaseAiTakeover();
                  return;
                }
                takeOverAiSide(controlledBotSide);
              }}
              onChangePacing={setAiMode}
              onStep={stepOnce}
            />
          ),
          details: (
            <div className={sidebarClasses.sharedModeControls}>
              <DeferredAiControlPanel
                compact
                embedded
                hideDecisionLog
                scenarioActionsVariant={isDeckBuilderPractice ? "hidden" : "details"}
              />
            </div>
          ),
        }}
        activity={{
          log: eventLogPanel,
          chat: <DeferredChatPanel />,
          combined: combinedEventLogPanel,
          combinedLabel: "All",
          secondary: (
            <div className={sidebarClasses.sharedUtilities}>
              <ConnectionPanel
                embedded
                playerIdentities={playerIdentities}
                playerConnections={playerConnections}
                connectionDiagnostic={connectionDiagnostic}
                onClaimRivalDrop={onClaimRivalDrop}
              />
            </div>
          ),
        }}
        actions={matchActions.actions}
      />
      {matchActions.confirmation}
      <UserConfigDialog
        opened={practiceConfigurationOpen}
        onClose={() => setPracticeConfigurationOpen(false)}
      />
    </>
  );
}

function useCyberpunkMatchActions(): {
  readonly actions: SimulatorMatchActions;
  readonly confirmation: ReactNode;
} {
  const { dispatch, humanSide, matchState } = useEngine();
  const [confirmingConcede, setConfirmingConcede] = useState(false);

  const actions: SimulatorMatchActions = {
    className: sidebarClasses.matchActionDock,
    controls: <PassTurnControl compact compactLabelStyle="action" actionsOnly />,
    danger: (
      <button
        type="button"
        className={`${sidebarClasses.sidebarActionButton} ${sidebarClasses.sidebarDangerButton}`}
        disabled={matchState.G.gameEnded}
        onClick={() => setConfirmingConcede(true)}
      >
        Concede
      </button>
    ),
  };
  const confirmation = (
    <ConfirmDialog
      opened={confirmingConcede && !matchState.G.gameEnded}
      title="Concede match?"
      body="This concedes the match and cannot be undone."
      cancelLabel="Keep playing"
      confirmLabel="Concede"
      onCancel={() => setConfirmingConcede(false)}
      onConfirm={() => {
        setConfirmingConcede(false);
        dispatch({ type: "concede", as: PLAYER_SIDE_TO_ID[humanSide] });
      }}
    />
  );
  return { actions, confirmation };
}

interface HumanMatchSidebarModel {
  self: LiveMatchSidebarParticipant;
  opponent: LiveMatchSidebarParticipant;
  selfSide: Side;
  opponentSide: Side;
  selfConnection?: PlayerConnectionBySide[Side];
  opponentConnection?: PlayerConnectionBySide[Side];
}

function HumanMatchSidebar({
  config,
  model,
  connectionDiagnostic,
  eventLogPanel,
  combinedEventLogPanel,
  onClaimRivalDrop,
  matchActions,
  matchActionConfirmation,
}: {
  config: LiveMatchSidebarConfig;
  model: HumanMatchSidebarModel;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  eventLogPanel: ReactNode;
  combinedEventLogPanel: ReactNode;
  onClaimRivalDrop?: () => void;
  matchActions: SimulatorMatchActions;
  matchActionConfirmation: ReactNode;
}) {
  const { matchState, prioritySide } = useEngine();
  const clock = useGameClock(prioritySide, { paused: matchState.G.gameEnded });
  const opponentPresence = useOpponentPresence(model.opponentConnection);
  const [gameConfigurationOpen, setGameConfigurationOpen] = useState(false);
  const opponentScore = scoreForSeat(config, model.opponent.seat);
  const selfScore = scoreForSeat(config, model.self.seat);
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

  const activeSide =
    matchState.G.turnMetadata.activePlayerId === PLAYER_SIDE_TO_ID.player ? "player" : "opponent";
  const toHumanParticipant = (
    role: "self" | "opponent",
    participant: LiveMatchSidebarParticipant,
    side: Side,
    connection: PlayerConnectionBySide[Side] | undefined,
    score: number | undefined,
  ): SimulatorMatchParticipant => ({
    id: participant.id,
    role,
    testId: `human-sidebar-${role}`,
    name: participant.displayName,
    shortLabel: role === "self" ? "YOU" : initialsFor(participant.displayName),
    clock: clock[side].time,
    active: activeSide === side,
    priority: prioritySide === side,
    status: prioritySide === side ? "Priority" : connectionLabel(connection).label,
    meta: [formatPlayerIdentityMeta(participant), participant.deckName].filter(Boolean).join(" · "),
    connection: (
      <CyberpunkConnectionIndicator
        role={role}
        participant={participant}
        side={side}
        connection={connection}
        connectionDiagnostic={connectionDiagnostic}
      />
    ),
    actions:
      role === "opponent" ? (
        <SimulatorOpponentParticipantActions
          participant={{
            kind: "human",
            gameProfileId: participant.id,
            userId: participant.userId,
            displayName: participant.displayName,
            connected: connectionUiStatus(connection) === "connected",
          }}
          match={{ matchId: config.matchId, gameId: config.gameId, gameSlug: "cyberpunk" }}
        />
      ) : (
        <SimulatorSelfParticipantActions
          gameConfiguration={{
            settings: <CyberpunkSettingsFields />,
            label: "Game configuration",
            requiresConfirmation: false,
            onSelect: () => setGameConfigurationOpen(true),
          }}
          support={{
            source: "cyberpunk-live-participant-menu",
            gameSlug: "cyberpunk",
            matchId: config.matchId,
            gameId: config.gameId,
            stateVersion: matchState.ctx.stateID,
            turn: matchState.G.turnMetadata.turnNumber,
          }}
        />
      ),
    metrics:
      typeof score === "number" ? [{ id: "score", label: "Score", value: score }] : undefined,
  });

  return (
    <div className={sidebarClasses.sharedSidebarFrame} data-testid="cyberpunk-human-match-sidebar">
      <SimulatorMatchSidebar
        className={sidebarClasses.sharedSidebar}
        opponent={toHumanParticipant(
          "opponent",
          model.opponent,
          model.opponentSide,
          model.opponentConnection,
          opponentScore,
        )}
        self={toHumanParticipant(
          "self",
          model.self,
          model.selfSide,
          model.selfConnection,
          selfScore,
        )}
        activity={{
          log: eventLogPanel,
          chat: <DeferredChatPanel />,
          combined: combinedEventLogPanel,
          secondary: (
            <>
              <div className={sidebarClasses.sharedModeControls}>
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
                <details className={sidebarClasses.sidebarDrawer}>
                  <summary>Opponent details</summary>
                  <PlayerDetails participant={model.opponent} />
                </details>
              </div>
              <div className={sidebarClasses.sharedUtilities}>
                {showSelfConnectionAlert ? (
                  <section
                    className={sidebarClasses.selfConnectionAlert}
                    data-status={selfConnectionStatus.status}
                    role="status"
                    aria-live="polite"
                  >
                    <span className={sidebarClasses.selfConnectionAlertKicker}>
                      {selfConnectionStatus.status === "reconnecting"
                        ? "Reconnecting"
                        : "Connection lost"}
                    </span>
                    <strong>Actions are paused.</strong>
                    <span>Wait for this to clear before trying a board action again.</span>
                  </section>
                ) : null}
                <div className={sidebarClasses.selfActions}>
                  {config.returnUrl ? (
                    <a className={sidebarClasses.returnLink} href={config.returnUrl}>
                      Matchmaking
                    </a>
                  ) : null}
                </div>
              </div>
            </>
          ),
        }}
        actions={matchActions}
      />
      {matchActionConfirmation}
      <UserConfigDialog
        opened={gameConfigurationOpen}
        onClose={() => setGameConfigurationOpen(false)}
      />
    </div>
  );
}

function CyberpunkConnectionIndicator({
  role,
  participant,
  side,
  connection,
  connectionDiagnostic,
}: {
  readonly role: "self" | "opponent";
  readonly participant: LiveMatchSidebarParticipant;
  readonly side: Side;
  readonly connection?: PlayerConnectionBySide[Side];
  readonly connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
}) {
  const connectionStatus = connectionLabel(connection);
  const copyPayload = useMemo(
    () =>
      connectionDiagnostic ? buildSimulatorConnectionDiagnostic(connectionDiagnostic) : undefined,
    [connectionDiagnostic],
  );
  return (
    <SharedConnectionPanel
      embedded
      indicatorOnly
      popoverAlign="end"
      copyPayload={copyPayload}
      sides={[
        {
          side,
          label: participant.displayName,
          playerId: participant.id,
          self: role === "self",
          connection: {
            status: connectionStatus.status,
            latencyMs: connection?.latencyMs,
            disconnectCount: connection?.disconnectCount,
          },
        },
      ]}
      diagnostic={projectConnectionPanelDiagnostic(connectionDiagnostic)}
    />
  );
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
