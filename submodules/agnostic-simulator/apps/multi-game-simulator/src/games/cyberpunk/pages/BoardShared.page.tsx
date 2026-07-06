import type { MatchState } from "@tcg/cyberpunk-engine";
import type {
  EngineInteractionView,
  InteractionSubmission,
  InteractionSubmissionValue,
} from "@tcg/protocol";
import { Board, EventLogPanel, InteractionPanel, MobileShell } from "@tcg/simulator-ui";
import type { ComponentType } from "react";
import type { SimulatorRendererPackage, SimulatorRendererProps } from "@tcg/simulator-contract";

import { AiControlPanel } from "../components/AiControlPanel";
import { ChatPanel } from "../components/ChatPanel";
import { ConnectionPanel } from "../components/ConnectionDiagnostics";
import { EndGameModal } from "../components/EndGameModal";
import { GameStateProvider } from "../components/GameBoard";
import { CyberpunkSharedAnimationLayer } from "../animation";
import { cyberpunkRendererPackage } from "../cyberpunkRenderer";
import {
  EngineProvider,
  useEngine,
  type AISideConfig,
  type AiMode,
  type AiSpeed,
  type ChatMessage,
  type CyberpunkPostGameContext,
  type CyberpunkTestEngine,
  type EngineAction,
  type LocalCommandCommit,
  type MoveLog,
  type PlayerConnectionBySide,
  type PlayerIdentityBySide,
  type PostGameSurface,
  type RawEngineEventEntry,
  type ScenarioId,
  type Side,
} from "../engine";
import type { SimulatorConnectionDiagnosticInput } from "@tcg/game-page-contract/connection-diagnostic";
import { projectMoveLogEntries } from "../engine/moveLogProjection";
import { useSimulatorProjection } from "../engine/useSimulatorProjection";
import classes from "./BoardShared.module.css";
import sidebarClasses from "./Sidebar.module.css";

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
}

export function BoardSharedPage(props: BoardSharedPageProps) {
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
      autoResolveSingletonCardTargets={autoResolveSingletonCardTargets}
      onMatchEnded={onMatchEnded}
      remoteDispatch={remoteDispatch}
      remoteSubmitInteraction={remoteSubmitInteraction}
      requestRemoteUndo={requestRemoteUndo}
      remoteMoveLogs={remoteMoveLogs}
      remoteEngineEvents={remoteEngineEvents}
      remoteChatMessages={remoteChatMessages}
      hasPendingRemoteMove={hasPendingRemoteMove}
      remoteReturnUrl={remoteReturnUrl}
      postGameContext={postGameContext}
      postGameSurface={postGameSurface}
      onLocalCommandCommitted={onLocalCommandCommitted}
      lockLocalHistoryControls={lockLocalHistoryControls}
      lockLocalResetControls={lockLocalResetControls}
    >
      <CyberpunkSharedAnimationLayer>
        <BoardSharedContent
          rendererPackage={rendererPackage}
          playerIdentities={playerIdentities}
          playerConnections={playerConnections}
          connectionDiagnostic={connectionDiagnostic}
          onClaimRivalDrop={onClaimRivalDrop}
        />
      </CyberpunkSharedAnimationLayer>
    </EngineProvider>
  );
}

interface BoardSharedContentProps {
  rendererPackage?: SimulatorRendererPackage<RendererPackage>;
  playerIdentities?: PlayerIdentityBySide;
  playerConnections?: PlayerConnectionBySide;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  onClaimRivalDrop?: () => void;
}

function BoardSharedContent({
  rendererPackage,
  playerIdentities,
  playerConnections,
  connectionDiagnostic,
  onClaimRivalDrop,
}: BoardSharedContentProps) {
  const { fixture, onSubmitInteraction } = useSimulatorProjection();
  const { matchState } = useEngine();
  const gameEnded = matchState.G.gameEnded;

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
    />
  );

  return (
    <main className={classes.pageShell}>
      {BoardRenderer ? (
        <MobileShell
          hasLog
          layoutBreakpoint={900}
          sidebar={sidebar}
          board={
            <section className={classes.boardViewport} aria-label={fixture.boardLayout.title}>
              <BoardRenderer fixture={fixture} onSubmitInteraction={onSubmitInteraction} />
            </section>
          }
          interactions={null}
          log={<ChatPanel />}
        />
      ) : (
        <MobileShell
          hasLog
          layoutBreakpoint={900}
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
          log={<ChatPanel />}
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

function SidebarContent({
  playerIdentities,
  playerConnections,
  connectionDiagnostic,
  onClaimRivalDrop,
}: BoardSharedContentProps) {
  const { matchState, moveLogs, humanSide } = useEngine();
  const eventLogEntries = projectMoveLogEntries(matchState, moveLogs, humanSide);

  return (
    <div className={sidebarClasses.sidebar}>
      <div className={sidebarClasses.section}>
        <AiControlPanel embedded />
      </div>
      <div className={sidebarClasses.section}>
        <ConnectionPanel
          embedded
          playerIdentities={playerIdentities}
          playerConnections={playerConnections}
          connectionDiagnostic={connectionDiagnostic}
          onClaimRivalDrop={onClaimRivalDrop}
        />
      </div>
      <div className={sidebarClasses.logPanel}>
        <EventLogPanel embedded entries={eventLogEntries} />
      </div>
    </div>
  );
}
