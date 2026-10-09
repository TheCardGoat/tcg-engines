import { BackgroundMusicControls, BackgroundMusicProvider } from "../audio/BackgroundMusic";
import { CyberpunkVersionMenuItem } from "../components/BoardV2/VersionMenuItem";
import { BookOpen } from "lucide-react";
import { CyberpunkViewportShell, useCyberpunkUiV2 } from "../components/BoardV2/version";
import { useInRouterContext } from "react-router";
import { SupporterPlayerName } from "../../../components/SupporterPlayerName";
import { CombatPriorityShortcut } from "../components/PaymentSelection/CombatPriorityShortcut";
import type { FilteredMatchView, MatchState, PlayerPrompt } from "@tcg/cyberpunk-engine";
import type {
  DropEligibility,
  EngineInteractionView,
  InteractionSubmission,
  InteractionSubmissionValue,
  UndoScopeValue,
} from "@tcg/protocol";
import {
  Board,
  ConnectionPanel as SharedConnectionPanel,
  DropClaimControl,
  EventLogPanel,
  InteractionPanel,
  SimulatorActivityTabs,
  SimulatorMatchSidebar,
  type SimulatorMatchActions,
  type SimulatorMatchParticipant,
} from "@tcg/simulator-ui";
import { safeStringify } from "@tcg/simulator-runtime/debug";
import { createSimulatorExternalCommandGate } from "@tcg/simulator-runtime/animation";
import {
  Component,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ErrorInfo,
  type ReactNode,
} from "react";
import type { SimulatorRendererPackage, SimulatorRendererProps } from "@tcg/simulator-contract";
import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";
import { cyberpunkTurnPlayerLabels } from "../engine/turnPlayerLabels";
import {
  firstGameTutorialMessages,
  handsOnTutorialMessages,
  resolveTutorialLocale,
} from "../components/FirstGameTutorial/firstGameTutorialMessages";
import {
  firstGameTutorialSeen,
  readTutorialLocalePreference,
  saveFirstGameTutorialResult,
} from "../components/FirstGameTutorial/storage";
import { cyberpunkSimulatorPath } from "./simulatorPaths";
import tutorialClasses from "./FirstGameTutorial.module.css";

import { DeferredAiControlPanel } from "../components/AiControlPanel/DeferredAiControlPanel";
import { LocalTableControlsContext } from "../components/AiControlPanel/LocalTableControls";
import { SetupSyncNotice, useSetupSyncStall } from "./setupSyncStallNotice";
import { SimulatorBotQuickControls } from "../../../simulator/SimulatorBotQuickControls";
import { CyberpunkBoardRuntimeProvider } from "../components/BoardRuntimeContext";
import type {
  LiveMatchSidebarConfig,
  LiveMatchSidebarParticipant,
} from "../components/BoardRuntimeContext";
import { ConnectionPanel } from "../components/ConnectionDiagnostics";
import { mapChatMessage } from "../components/ChatPanel/ChatPanel";
import { FloatingChatComposer } from "../components/ChatPanel/FloatingChatComposer";
import { renderCyberpunkEventLogMessage } from "../components/EventLog/CyberpunkEventLogMessage";
import { EndGameModal } from "../components/EndGameModal";
import { ConfirmDialog, GameStateProvider, PassTurnControl } from "../components/GameBoard";
import { boardCorrectionMenuAction } from "../components/GameBoard/BoardCorrectionStrip";
import {
  CyberpunkSettingsFields,
  UserConfigButton,
  UserConfigDialog,
} from "../components/UserConfig/UserConfigDialog";
import { CyberpunkSharedAnimationLayer } from "../animation";
import { cyberpunkRendererPackage } from "../cyberpunkRenderer";
import { GameClockProvider, useGameClock } from "../components/GameBoard/useGameClock";
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
import { isRealHumanParticipant } from "../live-match-participants";
import {
  SimulatorOpponentParticipantActions,
  SimulatorSelfParticipantActions,
} from "../../../simulator/participant-actions";
import { connectionUiStatus } from "../engine/live/playerConnectionState";
import { useSimulatorProjection } from "../engine/useSimulatorProjection";
import { projectConnectionPanelDiagnostic } from "../../../simulator/connection-panel-projection";
import {
  CyberpunkPaymentSelectionDiscovery,
  CyberpunkPaymentSelectionPlayerAction,
  CyberpunkPaymentSelectionShortcut,
} from "../components/PaymentSelection/PaymentSelectionPlayerAction";
import participantClasses from "../../../simulator/participant-actions/SimulatorParticipantActions.module.css";
import { PaymentSelectionProvider } from "../components/PaymentSelection/PaymentSelectionContext";
import classes from "./BoardShared.module.css";
import sidebarClasses from "./Sidebar.module.css";

const EVENT_LOG_ENTRY_CAP = 200;
const CYBERPUNK_SHELL_BREAKPOINT_PX = 767;

type RendererPackage = ComponentType<SimulatorRendererProps>;

function CyberpunkMatchMenuItems({ close }: { close: () => void }) {
  const engine = useEngine();
  const correctionAction = boardCorrectionMenuAction(engine);

  return (
    <>
      <CyberpunkVersionMenuItem onComplete={close} />
      <CyberpunkGuideMenuItem close={close} />
      <CyberpunkPaymentSelectionPlayerAction onComplete={close} />
      <button
        type="button"
        role="menuitem"
        className={participantClasses.menuItem}
        data-testid={`participant-${correctionAction.id}`}
        disabled={correctionAction.disabled}
        onClick={() => {
          correctionAction.run();
          close();
        }}
      >
        <span>{correctionAction.label}</span>
      </button>
      <button
        type="button"
        role="menuitem"
        className={participantClasses.menuItem}
        data-testid="participant-undo-turn-start"
        disabled={!engine.canUndoToTurnStart}
        onClick={() => {
          engine.dispatch({ type: "undoToTurnStart" });
          close();
        }}
      >
        <span>Undo to turn start</span>
      </button>
    </>
  );
}

export interface BoardSharedPageProps {
  /** Local route tools rendered inside the board's engine context. */
  localTools?: ReactNode;
  /** Keep the local engine alive while an authoring surface owns input. */
  suspendPresentation?: boolean;
  practiceMode?: "bot" | "self";
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
  remoteProjection?: FilteredMatchView;
  requestRemoteUndo?: (scope: UndoScopeValue) => boolean;
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
  remoteBoardCorrectionEnabled?: boolean;
  remoteBoardCorrectionProposalPending?: boolean;
  canRequestBoardCorrection?: boolean;
  requestRemoteBoardCorrection?: () => boolean;
  requestRemoteBoardCorrectionExit?: () => boolean;
  remoteExecuteMove?: (input: {
    moveType: string;
    payload: Record<string, unknown>;
    expectedVersion: number;
  }) => boolean;
  hasPendingRemoteMove?: boolean;
  pendingRemoteActionId?: string | null;
  remoteReturnUrl?: string;
  postGameContext?: CyberpunkPostGameContext;
  onLocalCommandCommitted?: (commit: LocalCommandCommit) => void;
  lockLocalHistoryControls?: boolean;
  lockLocalResetControls?: boolean;
  showFirstGameInvitation?: boolean;
  tutorialMode?: boolean;

  // Connection diagnostics surfaced in the sidebar.
  playerIdentities?: PlayerIdentityBySide;
  playerConnections?: PlayerConnectionBySide;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  onClaimRivalDrop?: () => void;
  dropEligibility?: DropEligibility | null;
  liveMatchSidebar?: LiveMatchSidebarConfig;

  /**
   * Live-match hook for the missed-setup recovery affordance: fires the
   * authoritative state re-sync request when the board sits in the pre-deal
   * setup state past the grace window. Omitted on local-engine surfaces
   * (practice), where a stale board cannot come from a missed update.
   */
  onSetupStallSync?: () => void;
}

export function BoardSharedPage(props: BoardSharedPageProps) {
  const animationCommandGate = useMemo(() => createSimulatorExternalCommandGate(), []);
  const {
    rendererPackage: rendererPackageProp,
    practiceMode = "bot",
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
    remoteProjection,
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
    remoteBoardCorrectionEnabled,
    remoteBoardCorrectionProposalPending,
    canRequestBoardCorrection,
    requestRemoteBoardCorrection,
    requestRemoteBoardCorrectionExit,
    remoteExecuteMove,
    hasPendingRemoteMove,
    pendingRemoteActionId,
    remoteReturnUrl,
    postGameContext,
    onLocalCommandCommitted,
    lockLocalHistoryControls,
    lockLocalResetControls,
    showFirstGameInvitation,
    tutorialMode,
    playerIdentities,
    playerConnections,
    connectionDiagnostic,
    onClaimRivalDrop,
    dropEligibility,
    liveMatchSidebar,
    onSetupStallSync,
  } = props;

  const rendererPackage = rendererPackageProp ?? cyberpunkRendererPackage;

  return (
    <CyberpunkBoardErrorBoundary>
      <BackgroundMusicProvider>
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
          remoteProjection={remoteProjection}
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
          remoteBoardCorrectionEnabled={remoteBoardCorrectionEnabled}
          remoteBoardCorrectionProposalPending={remoteBoardCorrectionProposalPending}
          canRequestBoardCorrection={canRequestBoardCorrection}
          requestRemoteBoardCorrection={requestRemoteBoardCorrection}
          requestRemoteBoardCorrectionExit={requestRemoteBoardCorrectionExit}
          remoteExecuteMove={remoteExecuteMove}
          hasPendingRemoteMove={hasPendingRemoteMove}
          pendingRemoteActionId={pendingRemoteActionId}
          remoteReturnUrl={remoteReturnUrl}
          postGameContext={postGameContext}
          postGameSurface={postGameSurface}
          onLocalCommandCommitted={onLocalCommandCommitted}
          lockLocalHistoryControls={lockLocalHistoryControls}
          lockLocalResetControls={lockLocalResetControls}
        >
          <GameClockProvider>
            <CyberpunkBoardRuntimeProvider
              value={{
                practiceMode,
                playerIdentities,
                playerConnections,
                connectionDiagnostic,
                onClaimRivalDrop,
                dropEligibility,
                liveMatchSidebar,
              }}
            >
              {!props.suspendPresentation && (
                <PaymentSelectionProvider>
                  <CyberpunkSharedAnimationLayer commandGate={animationCommandGate}>
                    <BoardSharedContent
                      practiceMode={practiceMode}
                      showFirstGameInvitation={showFirstGameInvitation}
                      tutorialMode={tutorialMode}
                      rendererPackage={rendererPackage}
                      postGameSurface={postGameSurface}
                      playerIdentities={playerIdentities}
                      playerConnections={playerConnections}
                      connectionDiagnostic={connectionDiagnostic}
                      onClaimRivalDrop={onClaimRivalDrop}
                      dropEligibility={dropEligibility}
                      liveMatchSidebar={liveMatchSidebar}
                      onSetupStallSync={onSetupStallSync}
                      remoteInteractionView={remoteInteractionView}
                    />
                    {props.localTools}
                  </CyberpunkSharedAnimationLayer>
                </PaymentSelectionProvider>
              )}
            </CyberpunkBoardRuntimeProvider>
          </GameClockProvider>
        </EngineProvider>
      </BackgroundMusicProvider>
    </CyberpunkBoardErrorBoundary>
  );
}

class CyberpunkBoardErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[cyberpunk] board render failed", error, info);
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <main role="alert" aria-live="assertive">
        <h1>Cyberpunk board unavailable</h1>
        <p>The legal action view could not be built. Reload after the game state is repaired.</p>
        <p>{this.state.error.message}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Reload board
        </button>
      </main>
    );
  }
}

interface BoardSharedContentProps {
  practiceMode?: "bot" | "self";
  showFirstGameInvitation?: boolean;
  tutorialMode?: boolean;
  rendererPackage?: SimulatorRendererPackage<RendererPackage>;
  postGameSurface?: PostGameSurface;
  playerIdentities?: PlayerIdentityBySide;
  playerConnections?: PlayerConnectionBySide;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  onClaimRivalDrop?: () => void;
  dropEligibility?: DropEligibility | null;
  liveMatchSidebar?: LiveMatchSidebarConfig;
  onSetupStallSync?: () => void;
  remoteInteractionView?: EngineInteractionView;
}

function BoardSharedContent({
  practiceMode,
  showFirstGameInvitation,
  tutorialMode,
  rendererPackage,
  postGameSurface,
  playerIdentities,
  playerConnections,
  connectionDiagnostic,
  onClaimRivalDrop,
  dropEligibility,
  liveMatchSidebar,
  onSetupStallSync,
  remoteInteractionView,
}: BoardSharedContentProps) {
  const { fixture, onSubmitInteraction } = useSimulatorProjection();
  const { matchState, moveLogs, humanSide, chatMessages, pendingRemoteActionId } = useEngine();
  const gameEnded = matchState.G.gameEnded;
  const eventLogEntries = projectMoveLogEntries(
    matchState,
    moveLogs,
    humanSide,
    pendingRemoteActionId,
  ).slice(-EVENT_LOG_ENTRY_CAP);
  const eventLogCopyText = formatCyberpunkEventLogReadableCopy(eventLogEntries);
  const rawEventLogCopyText = formatCyberpunkEventLogRawCopy(eventLogEntries, moveLogs);
  const turnPlayerLabel = cyberpunkTurnPlayerLabels(
    matchState,
    moveLogs,
    playerIdentities,
    humanSide,
  );
  const [sidebarLogOptionsHost, setSidebarLogOptionsHost] = useState<HTMLDivElement | null>(null);
  const [mobileLogOptionsHost, setMobileLogOptionsHost] = useState<HTMLDivElement | null>(null);
  // One unified activity feed (log + chat merged), with the compose dock
  // floating over the feed's lower edge — the Flesh and Blood sidebar pattern.
  const renderActivityFeed = (controlsContainer: HTMLDivElement | null) => (
    <div className={sidebarClasses.activityFeed}>
      <EventLogPanel
        embedded
        showHeader={false}
        controlsContainer={controlsContainer}
        entries={eventLogEntries}
        turnPlayerLabel={turnPlayerLabel}
        countUnit="log"
        chatMessages={chatMessages.map((message) => mapChatMessage(message, humanSide))}
        renderMessage={renderCyberpunkEventLogMessage}
        copyText={eventLogCopyText}
        rawCopyText={rawEventLogCopyText}
      />
      <FloatingChatComposer />
    </div>
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
        practiceMode={practiceMode}
        tutorialMode={tutorialMode}
        playerIdentities={playerIdentities}
        playerConnections={playerConnections}
        connectionDiagnostic={connectionDiagnostic}
        onClaimRivalDrop={onClaimRivalDrop}
        dropEligibility={dropEligibility}
        postGameSurface={postGameSurface}
        activityFeed={renderActivityFeed(sidebarLogOptionsHost)}
        activityHeaderActions={<div ref={setSidebarLogOptionsHost} />}
        liveMatchSidebar={liveMatchSidebar}
        onSetupStallSync={onSetupStallSync}
        remoteInteractionView={remoteInteractionView}
      />
    </GameStateProvider>
  );

  const tabletop = (
    <section
      className={classes.boardViewport}
      aria-label={fixture.boardLayout.title}
      data-action-attention-target
      tabIndex={-1}
    >
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
    <CyberpunkViewportShell
      className={classes.pageShell}
      data-game="cyberpunk"
      data-theme="dark"
      mobileBreakpoint={CYBERPUNK_SHELL_BREAKPOINT_PX}
      sidebar={sidebar}
      mobilePanel={
        <div className={sidebarClasses.mobileActivityPanel}>
          <SimulatorActivityTabs
            log={renderActivityFeed(mobileLogOptionsHost)}
            headerActions={<div ref={setMobileLogOptionsHost} />}
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
      {showFirstGameInvitation ? <FirstGameInvitation /> : null}
      {gameEnded && (
        <GameStateProvider>
          <EndGameModal playerIdentities={playerIdentities} />
        </GameStateProvider>
      )}
    </CyberpunkViewportShell>
  );
}

/** The invitation points new players at the guided game for the board version they are on. */
function FirstGameInvitation() {
  return useInRouterContext() ? <RoutedFirstGameInvitation /> : <FirstGameInvitationCard />;
}

function RoutedFirstGameInvitation() {
  const isV2 = useCyberpunkUiV2();
  return <FirstGameInvitationCard v2={isV2} />;
}

/** Replays the guided game for the board version the player is on. */
function CyberpunkGuideMenuItem({ close }: { close: () => void }) {
  return useInRouterContext() ? (
    <RoutedCyberpunkGuideMenuItem close={close} />
  ) : (
    <FirstGameGuideLink v2={false} onOpen={close} />
  );
}

function RoutedCyberpunkGuideMenuItem({ close }: { close: () => void }) {
  const isV2 = useCyberpunkUiV2();
  return <FirstGameGuideLink v2={isV2} onOpen={close} />;
}

function FirstGameGuideLink({ v2, onOpen }: { v2: boolean; onOpen: () => void }) {
  return (
    <a
      role="menuitem"
      className={participantClasses.menuItem}
      href={cyberpunkSimulatorPath(v2 ? "/tutorial?ui=v2" : "/tutorial")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onOpen}
    >
      <BookOpen size={16} aria-hidden="true" />
      <span>Show first-game guide</span>
    </a>
  );
}

function FirstGameInvitationCard({ v2 = false }: { v2?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [locale, setLocale] = useState<ReturnType<typeof resolveTutorialLocale>>("en");

  useEffect(() => {
    setVisible(!firstGameTutorialSeen(v2 ? "v2" : "v1"));
    setLocale(resolveTutorialLocale(readTutorialLocalePreference(), navigator.languages));
  }, [v2]);

  if (!visible) return null;
  const dismiss = () => {
    saveFirstGameTutorialResult("dismissed", v2 ? "v2" : "v1");
    setVisible(false);
  };
  const copy = firstGameTutorialMessages[locale];
  const lesson = handsOnTutorialMessages[locale];
  return (
    <aside
      className={`${tutorialClasses.guide} ${tutorialClasses.invitation}`}
      aria-label={copy.label}
    >
      <strong>{copy.label}</strong>
      <p>{lesson.invitation}</p>
      <div className={tutorialClasses.actions}>
        <a
          className={tutorialClasses.primary}
          href={cyberpunkSimulatorPath(v2 ? "/tutorial?ui=v2" : "/tutorial")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
        >
          {lesson.start}
        </a>
        <button type="button" onClick={dismiss}>
          {copy.skip}
        </button>
      </div>
    </aside>
  );
}

interface SidebarContentProps extends BoardSharedContentProps {
  activityFeed: ReactNode;
  activityHeaderActions: ReactNode;
}

function SidebarContent({
  practiceMode = "bot",
  tutorialMode,
  playerIdentities,
  playerConnections,
  connectionDiagnostic,
  onClaimRivalDrop,
  dropEligibility,
  postGameSurface,
  activityFeed,
  activityHeaderActions,
  liveMatchSidebar,
  onSetupStallSync,
  remoteInteractionView,
}: SidebarContentProps) {
  const hasLocalTableControls = useContext(LocalTableControlsContext);
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
    toggleHumanSide,
    takeOverAiSide,
    releaseAiTakeover,
  } = useEngine();
  const clock = useGameClock();
  const matchActions = useCyberpunkMatchActions();
  const [practiceConfigurationOpen, setPracticeConfigurationOpen] = useState(false);
  const rivalSide = otherSide(humanSide);
  const controlledBotSide = aiTakeover?.side ?? rivalSide;
  const isSelfPractice = practiceMode === "self";
  const canTakeControl =
    isSelfPractice || aiTakeover !== null || aiStrategies[controlledBotSide] !== null;
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
  const setupSyncNoticeVisible = useSetupSyncStall(onSetupStallSync, remoteInteractionView);
  const setupSyncNotice = setupSyncNoticeVisible ? (
    <SetupSyncNotice onSync={onSetupStallSync} />
  ) : null;

  if (humanSidebar && liveMatchSidebar) {
    return (
      <>
        <HumanMatchSidebar
          config={liveMatchSidebar}
          model={humanSidebar}
          connectionDiagnostic={connectionDiagnostic}
          activityFeed={activityFeed}
          activityHeaderActions={activityHeaderActions}
          onClaimRivalDrop={onClaimRivalDrop}
          dropEligibility={dropEligibility}
          matchActions={matchActions.actions}
          matchActionConfirmation={matchActions.confirmation}
        />
        {setupSyncNotice}
      </>
    );
  }

  // A live viewer without a seat is always a spectator, including public
  // practice-vs-bot matches. Never expose practice mutations to that viewer.
  if (
    liveMatchSidebar &&
    (!liveMatchSidebar.localPlayerId || !hasBotParticipant(liveMatchSidebar))
  ) {
    return (
      <>
        <SpectatorMatchSidebar
          config={liveMatchSidebar}
          connections={playerConnections}
          activityFeed={activityFeed}
          activityHeaderActions={activityHeaderActions}
        />
        {setupSyncNotice}
      </>
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
      layout: "stacked",
      name: identity ? (
        <SupporterPlayerName name={identity.displayName} tier={identity.subscriptionTier} />
      ) : undefined,
      showAvatar: false,
      clock: clock[side].time,
      active: activeSide === side,
      priority: prioritySide === side,
      status: prioritySide === side ? "Priority" : "Waiting",
      meta: formatPlayerIdentityMeta(identity),
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
            <CyberpunkPaymentSelectionDiscovery>
              <div className={sidebarClasses.participantQuickActions}>
                <CyberpunkPaymentSelectionShortcut />
                <CombatPriorityShortcut />
                <SimulatorSelfParticipantActions
                  gameConfiguration={{
                    settings: <CyberpunkSettingsFields />,
                    audioSettings: <BackgroundMusicControls />,
                    requiresConfirmation: false,
                    onSelect: () => setPracticeConfigurationOpen(true),
                  }}
                  matchMenuItems={(close) => <CyberpunkMatchMenuItems close={close} />}
                  support={{
                    source: "cyberpunk-practice-participant-menu",
                    gameSlug: "cyberpunk",
                    stateVersion: matchState.ctx.stateID,
                    turn: matchState.G.turnMetadata.turnNumber,
                  }}
                />
              </div>
            </CyberpunkPaymentSelectionDiscovery>
          ),
        }}
        automation={
          tutorialMode || hasLocalTableControls
            ? undefined
            : {
                label: "Opponent controls",
                panelLabel:
                  practiceMode === "self"
                    ? "Play both sides controls"
                    : "Bot strategy and pacing controls",
                summary: (
                  <span
                    className={sidebarClasses.automationSummary}
                    role={practiceMode === "self" ? "status" : undefined}
                    aria-live={practiceMode === "self" ? "polite" : undefined}
                  >
                    <span>
                      {practiceMode === "self"
                        ? "Play both sides"
                        : aiTakeover
                          ? "Opponent control"
                          : "Bot playback"}
                    </span>
                    <strong>
                      {practiceMode === "self"
                        ? `Controlling ${humanSide === "player" ? "Player 1" : "Player 2"}`
                        : aiTakeover
                          ? "You control the opponent"
                          : aiMode === "step"
                            ? "Paused · step"
                            : "Auto-running"}
                    </strong>
                  </span>
                ),
                control: (
                  <SimulatorBotQuickControls
                    practiceMode={practiceMode}
                    pacing={aiMode}
                    takeoverActive={isSelfPractice ? humanSide !== "player" : aiTakeover !== null}
                    canTakeover={canTakeControl}
                    canStep={canStepBot}
                    disabled={matchState.G.gameEnded}
                    testIdPrefix="cyberpunk-practice-quick"
                    onToggleTakeover={() => {
                      if (isSelfPractice) {
                        toggleHumanSide();
                        return;
                      }
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
                details:
                  practiceMode === "self" ? (
                    <p role="status" aria-live="polite" data-testid="cyberpunk-self-control-status">
                      Automation is off. Switch seats to make decisions for either player.
                    </p>
                  ) : (
                    <div className={sidebarClasses.sharedModeControls}>
                      <DeferredAiControlPanel
                        compact
                        embedded
                        hideDecisionLog
                        scenarioActionsVariant={isDeckBuilderPractice ? "hidden" : "details"}
                      />
                    </div>
                  ),
              }
        }
        activity={{
          log: activityFeed,
          headerActions: activityHeaderActions,
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
      {setupSyncNotice}
    </>
  );
}

function SpectatorMatchSidebar({
  config,
  connections,
  activityFeed,
  activityHeaderActions,
}: {
  config: LiveMatchSidebarConfig;
  connections?: PlayerConnectionBySide;
  activityFeed: ReactNode;
  activityHeaderActions: ReactNode;
}) {
  const { matchState, prioritySide } = useEngine();
  const clock = useGameClock();
  const activeSide =
    matchState.G.turnMetadata.activePlayerId === PLAYER_SIDE_TO_ID.player ? "player" : "opponent";
  const participantForSeat = (seat: 1 | 2, role: "self" | "opponent") => {
    const participant = config.participants.find((candidate) => candidate.seat === seat);
    const side = sideForSeat(seat);
    return {
      id: participant?.id ?? `seat-${seat}`,
      role,
      layout: "stacked",
      testId: `spectator-sidebar-seat-${seat}`,
      name: (
        <SupporterPlayerName
          name={participant?.displayName ?? `Player ${seat}`}
          tier={participant?.subscriptionTier}
        />
      ),
      showAvatar: false,
      clock: clock[side].time,
      active: activeSide === side,
      priority: prioritySide === side,
      status: prioritySide === side ? "Priority" : connectionLabel(connections?.[side]).label,
      meta: participant ? formatPlayerIdentityMeta(participant) : "Spectator view",
      metrics:
        shouldShowMatchScore(config) && typeof scoreForSeat(config, seat) === "number"
          ? [{ id: "score", label: "Score", value: scoreForSeat(config, seat) }]
          : undefined,
    } satisfies SimulatorMatchParticipant;
  };

  return (
    <div className={sidebarClasses.sharedSidebarFrame} data-testid="cyberpunk-spectator-sidebar">
      <SimulatorMatchSidebar
        className={sidebarClasses.sharedSidebar}
        opponent={participantForSeat(2, "opponent")}
        self={participantForSeat(1, "self")}
        activity={{ log: activityFeed, headerActions: activityHeaderActions }}
        actions={{ controls: null, danger: null }}
      />
    </div>
  );
}

function useCyberpunkMatchActions(): {
  readonly actions: SimulatorMatchActions;
  readonly confirmation: ReactNode;
} {
  const { canUndo, dispatch, humanSide, matchState, pendingRemoteActionId } = useEngine();
  const [confirmingConcede, setConfirmingConcede] = useState(false);

  const actions: SimulatorMatchActions = {
    className: sidebarClasses.matchActionDock,
    undo: (
      <button
        type="button"
        className={`${sidebarClasses.sidebarActionButton} ${sidebarClasses.sidebarUndoButton}`}
        disabled={!canUndo}
        data-testid="sidebar-undo"
        aria-label={canUndo ? "Undo last move" : "No undoable move available"}
        onClick={() => dispatch({ type: "undo" })}
      >
        Undo
      </button>
    ),
    primary: <PassTurnControl compact compactLabelStyle="action" actionsOnly />,
    danger: (
      <button
        type="button"
        className={`${sidebarClasses.sidebarActionButton} ${sidebarClasses.sidebarDangerButton}`}
        disabled={matchState.G.gameEnded || pendingRemoteActionId === "concede"}
        onClick={() => setConfirmingConcede(true)}
      >
        {pendingRemoteActionId === "concede" ? "Conceding…" : "Concede"}
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
  activityFeed,
  activityHeaderActions,
  onClaimRivalDrop,
  dropEligibility,
  matchActions,
  matchActionConfirmation,
}: {
  config: LiveMatchSidebarConfig;
  model: HumanMatchSidebarModel;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  activityFeed: ReactNode;
  activityHeaderActions: ReactNode;
  onClaimRivalDrop?: () => void;
  dropEligibility?: DropEligibility | null;
  matchActions: SimulatorMatchActions;
  matchActionConfirmation: ReactNode;
}) {
  const { matchState, prioritySide } = useEngine();
  const clock = useGameClock();
  const [gameConfigurationOpen, setGameConfigurationOpen] = useState(false);
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
  ): SimulatorMatchParticipant => ({
    id: participant.id,
    role,
    layout: "stacked",
    testId: `human-sidebar-${role}`,
    name: (
      <SupporterPlayerName
        name={participant.displayName}
        tier={participant.subscriptionTier}
        isMobile={participant.isMobile}
      />
    ),
    showAvatar: false,
    clock: clock[side].time,
    active: activeSide === side,
    priority: prioritySide === side,
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
        <CyberpunkPaymentSelectionDiscovery>
          <div className={sidebarClasses.participantQuickActions}>
            <CyberpunkPaymentSelectionShortcut />
            <CombatPriorityShortcut />
            <SimulatorSelfParticipantActions
              gameConfiguration={{
                settings: <CyberpunkSettingsFields />,
                audioSettings: <BackgroundMusicControls />,
                label: "Game configuration",
                requiresConfirmation: false,
                onSelect: () => setGameConfigurationOpen(true),
              }}
              matchMenuItems={(close) => <CyberpunkMatchMenuItems close={close} />}
              support={{
                source: "cyberpunk-live-participant-menu",
                gameSlug: "cyberpunk",
                matchId: config.matchId,
                gameId: config.gameId,
                stateVersion: matchState.ctx.stateID,
                turn: matchState.G.turnMetadata.turnNumber,
              }}
            />
          </div>
        </CyberpunkPaymentSelectionDiscovery>
      ),
  });

  return (
    <div className={sidebarClasses.sharedSidebarFrame} data-testid="cyberpunk-human-match-sidebar">
      <SimulatorMatchSidebar
        className={`${sidebarClasses.sharedSidebar} ${sidebarClasses.humanSidebar}`}
        context={shouldShowMatchScore(config) ? <CyberpunkMatchScore config={config} /> : undefined}
        contextLabel="Match score"
        opponent={toHumanParticipant(
          "opponent",
          model.opponent,
          model.opponentSide,
          model.opponentConnection,
        )}
        self={toHumanParticipant("self", model.self, model.selfSide, model.selfConnection)}
        activity={{
          log: activityFeed,
          headerActions: activityHeaderActions,
          secondary: (
            <>
              <div className={sidebarClasses.sharedModeControls}>
                {onClaimRivalDrop ? (
                  <DropClaimControl
                    className={sidebarClasses.dropControl}
                    actionClassName={`${sidebarClasses.sidebarActionButton} ${sidebarClasses.sidebarDangerButton}`}
                    eligibility={dropEligibility}
                    serverNowMs={dropEligibility?.projectedAtMs ?? Date.now()}
                    onClaim={onClaimRivalDrop}
                    label="Drop opponent"
                  />
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

function CyberpunkMatchScore({ config }: { config: LiveMatchSidebarConfig }) {
  return (
    <dl className={sidebarClasses.matchScore} aria-label="Match score" title="Match score">
      {config.participants.map((participant) => (
        <div key={participant.id}>
          <dt>{participant.displayName}</dt>
          <dd>{scoreForSeat(config, participant.seat) ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

function shouldShowMatchScore(config: LiveMatchSidebarConfig): boolean {
  return (
    config.format !== "best_of_1" &&
    config.gameNumber > 1 &&
    (config.player1Score !== undefined || config.player2Score !== undefined)
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
      popoverAlign="start"
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
  const self = local;
  if (!self || !isRealHumanParticipant(self)) {
    return null;
  }
  const opponent = config.participants.find(
    (participant) => participant.id !== self.id && isRealHumanParticipant(participant),
  );
  if (!opponent) {
    return null;
  }
  const selfSide = sideForSeat(self.seat);
  const opponentSide = sideForSeat(opponent.seat);
  return {
    self,
    opponent,
    selfSide,
    opponentSide,
    selfConnection: connections?.[selfSide],
    opponentConnection: connections?.[opponentSide],
  };
}

function hasBotParticipant(config: LiveMatchSidebarConfig): boolean {
  return config.participants.some((participant) => !isRealHumanParticipant(participant));
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
