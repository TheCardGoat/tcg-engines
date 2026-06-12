import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import type { MatchState } from "@tcg/cyberpunk-engine";
import type { SimulatorConnectionDiagnosticInput } from "@tcg/game-page-contract/connection-diagnostic";
import type {
  EngineInteractionView,
  InteractionSubmission,
  InteractionSubmissionValue,
} from "@tcg/protocol";
import {
  CenterRow,
  CombatArrowOverlay,
  ConfirmDialog,
  GameBoard,
  GameStateProvider,
  HandZone,
  MobileBoard,
  OpponentDisconnectOverlay,
  AttackSelectionProvider,
  MoveSelectionProvider,
  useAttackSelection,
  useMoveSelection,
  useDragDrop,
} from "../components/GameBoard";
import { ChoiceModal, PromptBanner } from "../components/Prompt";
import { EndGameModal } from "../components/EndGameModal";
import { CyberpunkSharedAnimationLayer, ScriptPlayer, SoundPlayer } from "../animation";
import { AiControlPanel } from "../components/AiControlPanel";
import { ChatPanel } from "../components/ChatPanel";
import { MoveLogPanel } from "../components/MoveLogPanel";
import { RawEngineEventsPanel } from "../components/RawEngineEventsPanel";
import { DebugPanelProvider, DebugPanelToggle } from "../components/DebugPanel";
import { ConnectionDiagnosticPopover } from "../components/ConnectionDiagnostics";
import { UserConfigButton } from "../components/UserConfig/UserConfigDialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "../components/Sidebar";
import {
  AI_STRATEGIES,
  DEFAULT_SCENARIO,
  EngineProvider,
  PLAYER_SIDE_TO_ID,
  findStrategyDescriptor,
  getGearAttachTargets,
  getProgramSpatialTargets,
  getStrategyById,
  mapDropToAction,
  otherSide,
  resolveAiStatus,
  useEngine,
  useEngineInteractionView,
  useEngineOptional,
  useSideZones,
  type AISideConfig,
  type AiMode,
  type AiSpeed,
  type AIStrategy,
  type CardDropEvent,
  type CyberpunkTestEngine,
  type CyberpunkPostGameContext,
  type EngineAction,
  type LocalCommandCommit,
  type ChatMessage,
  type MoveLog,
  type PlayerConnectionBySide,
  type PlayerIdentityBySide,
  type PostGameSurface,
  type RawEngineEventEntry,
  type ScenarioId,
  type Side,
  formatPlayerIdentityMeta,
  isVisibleSubscriptionTier,
} from "../engine";
import {
  interactionActionIsAvailable,
  interactionViewHasAttacker,
} from "../engine/interactionViewHelpers";
import { connectionUiStatus, isConnectionDisconnected } from "../engine/live/playerConnectionState";
import classes from "./Board.module.css";
import { getAutoAttackAdvanceAction, getAutoPostAttackPassAction } from "./autoAttackFlow";

const FIXER_COLLAPSED_STORAGE_KEY = "cyberpunk:desktopFixerCollapsed";

interface BoardPageProps {
  /**
   * Which fixture to bootstrap the engine with. Defaults to the canonical
   * "opening main" scenario for the root route; test routes pass their own
   * fixture id.
   */
  scenarioId?: ScenarioId;
  /**
   * Initial AI strategies. Defaults to the default AI on the opponent so a fresh
   * tab is immediately playable. Pass `{ player: null, opponent: null }` to
   * boot with no AI (hot-seat).
   */
  initialAi?: AISideConfig;
  /** Initial human seat. Defaults to URL `?control=` or "player". */
  initialHumanSide?: Side;
  /** Initial pacing mode. Defaults to URL `?ai-mode=` or "auto". */
  initialAiMode?: AiMode;
  /** Initial speed bucket. Defaults to URL `?ai-speed=` or "balanced". */
  initialAiSpeed?: AiSpeed;
  /** Whether singleton non-Program card target prompts resolve automatically. */
  autoResolveSingletonCardTargets?: boolean;
  /** Whether attack windows advance automatically when no manual choice is needed. */
  autoAdvanceAttackFlow?: boolean;
  /** Optional builder for a dynamic local session, such as a practice match. */
  initialEngineBuilder?: () => CyberpunkTestEngine;
  /** Optional terminal-state callback for embedded/webview hosts. */
  onMatchEnded?: (result: { winnerId: string | null; reason: string | null }) => void;
  /** Optional server-authority dispatch bridge for live hosted matches. */
  remoteDispatch?: (
    action: EngineAction,
    state: MatchState,
    actor: {
      side: Side;
      interactionView: EngineInteractionView;
      submission: InteractionSubmission;
      optimisticResult?: LocalCommandCommit["result"];
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
  /** Request a server-authority undo through the live-match host. */
  requestRemoteUndo?: () => boolean;
  /** Server-authority move logs collected from gateway updates. */
  remoteMoveLogs?: ReadonlyArray<MoveLog>;
  /** Server-authority animation scripts collected from gateway updates. */
  remoteEngineEvents?: ReadonlyArray<RawEngineEventEntry>;
  /** Server-authority chat history collected from context and gateway updates. */
  remoteChatMessages?: ReadonlyArray<ChatMessage>;
  /** Server-authority live match has one optimistic move awaiting ack. */
  hasPendingRemoteMove?: boolean;
  /** Live player identity metadata projected onto the local board sides. */
  playerIdentities?: PlayerIdentityBySide;
  /** Live connectivity metadata projected onto the local board sides. */
  playerConnections?: PlayerConnectionBySide;
  /** Exportable live connection support payload. */
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  /** Claim the live match when the rival is disconnected or timed out. */
  onClaimRivalDrop?: () => void;
  /** Return target for hosted matches once the game is over. */
  remoteReturnUrl?: string;
  /** Hosted-match context for post-game analytics and series navigation. */
  postGameContext?: CyberpunkPostGameContext;
  /** UI surface that owns post-game actions and available post-game data. */
  postGameSurface?: PostGameSurface;
  /** Observer for successful local engine commands. */
  onLocalCommandCommitted?: (commit: LocalCommandCommit) => void;
  /** Disable undo/restart while keeping local play active. */
  lockLocalHistoryControls?: boolean;
  /** Disable restart/scenario switching without disabling local undo. */
  lockLocalResetControls?: boolean;
}

function ReconnectCue() {
  return (
    <div className={classes.reconnectCue} role="status" aria-live="polite">
      <strong>Reconnecting</strong>
      <span>Actions are paused while we rejoin the match server.</span>
    </div>
  );
}

/**
 * URL params recognised here:
 * - `?ai=default|greedy|first-legal|random|pass-only|attack-unit-only|call-legend-only|off`
 *   — initial strategy on the rival side.
 * - `?ai-mode=auto|step` — initial pacing.
 * - `?ai-speed=fast|balanced|slow` — initial AI delay bucket.
 * - `?control=player|opponent` — which side the human starts on.
 * - `?auto-advance-attack=off` — disable simulator attack-step automation.
 */
function readUrlAi(): {
  ai: AISideConfig;
  humanSide: Side;
  aiMode: AiMode;
  aiSpeed: AiSpeed;
  autoAdvanceAttackFlow: boolean;
} {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const aiName = params?.get("ai");
  const aiMode = pickMode(params?.get("ai-mode"));
  const aiSpeed = pickSpeed(params?.get("ai-speed"));
  const humanSide = pickSide(params?.get("control"));
  const autoAdvanceAttackFlow = params?.get("auto-advance-attack") !== "off";

  let ai: AISideConfig;
  if (aiName === "off" || aiName === "none") {
    ai = { player: null, opponent: null };
  } else if (aiName === "both") {
    const defaultAI = AI_STRATEGIES[0]!.strategy;
    ai = { player: defaultAI, opponent: defaultAI };
  } else {
    const strat = pickStrategyByName(aiName ?? "default");
    // The AI sits on the side opposite the human seat.
    const aiSide = otherSide(humanSide);
    ai = aiSide === "player" ? { player: strat } : { opponent: strat };
  }
  return { ai, humanSide, aiMode, aiSpeed, autoAdvanceAttackFlow };
}

function pickStrategyByName(name: string | null): AIStrategy {
  if (!name) {
    return AI_STRATEGIES[0]!.strategy;
  }
  const desc = getStrategyById(name);
  return desc ? desc.strategy : AI_STRATEGIES[0]!.strategy;
}

function pickMode(raw: string | null | undefined): AiMode {
  return raw === "step" ? "step" : "auto";
}

function pickSpeed(raw: string | null | undefined): AiSpeed {
  if (raw === "fast" || raw === "slow") {
    return raw;
  }
  return "balanced";
}

function pickSide(raw: string | null | undefined): Side {
  return raw === "opponent" ? "opponent" : "player";
}

function loadFixerCollapsedPreference(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(FIXER_COLLAPSED_STORAGE_KEY) === "1";
}

function persistFixerCollapsedPreference(collapsed: boolean) {
  try {
    window.localStorage.setItem(FIXER_COLLAPSED_STORAGE_KEY, collapsed ? "1" : "0");
  } catch {
    // ignore storage errors
  }
}

export function BoardPage({
  scenarioId = DEFAULT_SCENARIO,
  initialAi,
  initialHumanSide,
  initialAiMode,
  initialAiSpeed,
  autoResolveSingletonCardTargets,
  autoAdvanceAttackFlow,
  initialEngineBuilder,
  onMatchEnded,
  remoteDispatch,
  remoteSubmitInteraction,
  requestRemoteUndo,
  remoteMoveLogs,
  remoteEngineEvents,
  remoteChatMessages,
  hasPendingRemoteMove,
  playerIdentities,
  playerConnections,
  connectionDiagnostic,
  onClaimRivalDrop,
  remoteReturnUrl,
  postGameContext,
  postGameSurface,
  onLocalCommandCommitted,
  lockLocalHistoryControls,
  lockLocalResetControls,
}: BoardPageProps = {}) {
  const url = readUrlAi();
  return (
    <EngineProvider
      key={scenarioId}
      initialScenario={scenarioId}
      initialEngineBuilder={initialEngineBuilder}
      initialAi={initialAi ?? url.ai}
      initialHumanSide={initialHumanSide ?? url.humanSide}
      initialAiMode={initialAiMode ?? url.aiMode}
      initialAiSpeed={initialAiSpeed ?? url.aiSpeed}
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
      <GameStateProvider>
        <BoardPageInner
          playerIdentities={playerIdentities}
          playerConnections={playerConnections}
          connectionDiagnostic={connectionDiagnostic}
          onClaimRivalDrop={onClaimRivalDrop}
          autoAdvanceAttackFlow={autoAdvanceAttackFlow ?? url.autoAdvanceAttackFlow}
        />
      </GameStateProvider>
    </EngineProvider>
  );
}

function BoardPageInner({
  playerIdentities,
  playerConnections,
  connectionDiagnostic,
  onClaimRivalDrop,
  autoAdvanceAttackFlow,
}: {
  playerIdentities?: PlayerIdentityBySide;
  playerConnections?: PlayerConnectionBySide;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  onClaimRivalDrop?: () => void;
  autoAdvanceAttackFlow: boolean;
}) {
  const engine = useEngineOptional();
  const isNarrow = useMediaQuery("(max-width: 768px)");
  const forceMobile =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("mobile");
  const mobile = forceMobile || isNarrow;

  // Project the human seat — the bottom of the board reads from this side
  // regardless of which engine player is at P1.
  const humanSide = engine?.humanSide ?? "player";
  if (mobile) {
    return (
      <DebugPanelProvider>
        <AttackSelectionProvider>
          <MoveSelectionProvider>
            <DropDispatchBridge />
            <SelectionReset side={humanSide} />
            {autoAdvanceAttackFlow ? <AutoAdvanceAttackFlow /> : null}
            <ScriptPlayer />
            <SoundPlayer />
            <CyberpunkSharedAnimationLayer>
              <MobileBoard
                playerIdentities={playerIdentities}
                playerConnections={playerConnections}
                connectionDiagnostic={connectionDiagnostic}
                onClaimRivalDrop={onClaimRivalDrop}
              />
            </CyberpunkSharedAnimationLayer>
            <ChoiceModal side="player" />
            <ChoiceModal side="opponent" />
            <EndGameModal />
          </MoveSelectionProvider>
        </AttackSelectionProvider>
      </DebugPanelProvider>
    );
  }

  return (
    <DebugPanelProvider>
      <AttackSelectionProvider>
        <MoveSelectionProvider>
          <DropDispatchBridge />
          <SelectionReset side={humanSide} />
          {autoAdvanceAttackFlow ? <AutoAdvanceAttackFlow /> : null}
          <ScriptPlayer />
          <SoundPlayer />
          <CyberpunkSharedAnimationLayer>
            <DesktopBoard
              humanSide={humanSide}
              playerIdentities={playerIdentities}
              playerConnections={playerConnections}
              connectionDiagnostic={connectionDiagnostic}
              onClaimRivalDrop={onClaimRivalDrop}
            />
          </CyberpunkSharedAnimationLayer>
        </MoveSelectionProvider>
      </AttackSelectionProvider>
    </DebugPanelProvider>
  );
}

function DropDispatchBridge() {
  const { registerCardDropHandler } = useDragDrop();
  const engine = useEngineOptional();
  const moveSelection = useMoveSelection();
  const humanSide = engine?.humanSide ?? "player";
  const humanZones = useSideZones(humanSide);
  const humanInteractionView = useEngineInteractionView(humanSide);

  // Hold the latest engine context + projection in refs so the drop handler is
  // registered exactly once, instead of re-registering on every engine update.
  const engineRef = useRef(engine);
  const zonesRef = useRef(humanZones);
  const interactionViewRef = useRef(humanInteractionView);
  const sideRef = useRef<Side>(humanSide);
  const selectionRef = useRef(moveSelection);
  engineRef.current = engine;
  zonesRef.current = humanZones;
  interactionViewRef.current = humanInteractionView;
  sideRef.current = humanSide;
  selectionRef.current = moveSelection;

  // Wire dnd drops to engine dispatch via the pure adapter mapper. Drops
  // always dispatch with `humanSide` as the actor — permissions handle "is
  // it actually their turn?" inside the engine.
  useEffect(() => {
    const handle = (event: CardDropEvent) => {
      const e = engineRef.current;
      if (!e || !event.source.cardId) {
        return;
      }
      const ctx = {
        humanSide: sideRef.current,
        humanZones: zonesRef.current,
        interactionView: interactionViewRef.current,
      };
      const sourceCard = ctx.humanZones.hand.find((c) => c.cardId === event.source.cardId);
      if (
        sourceCard?.cardType === "program" &&
        event.source.zone === "p-hand" &&
        event.target.type === "card" &&
        event.target.cardId
      ) {
        const programTargets = getProgramSpatialTargets(
          {
            matchState: e.matchState,
            side: ctx.humanSide,
            interactionView: ctx.interactionView,
          },
          event.source.cardId,
        );
        if (programTargets.includes(event.target.cardId)) {
          const as = PLAYER_SIDE_TO_ID[ctx.humanSide];
          const result = e.dispatch({ type: "playCard", cardId: event.source.cardId, as });
          if (result.success) {
            e.dispatch({
              type: "resolveEffectTarget",
              targetIds: [event.target.cardId],
              as,
            });
          }
          selectionRef.current.clearSelection();
          return;
        }
      }
      if (
        event.source.zone === "p-hand" &&
        event.target.type === "zone" &&
        event.target.zone === "p-field"
      ) {
        const attachTargets = getGearAttachTargets(ctx, event.source.cardId, sourceCard?.cardType);
        if (sourceCard?.cardType === "gear" && attachTargets.length > 0) {
          selectionRef.current.setSelection({
            side: ctx.humanSide,
            moveId: "playCard",
            sourceCardId: event.source.cardId,
            sourceCardType: sourceCard.cardType,
          });
          return;
        }
        const programTargets = getProgramSpatialTargets(
          {
            matchState: e.matchState,
            side: ctx.humanSide,
            interactionView: ctx.interactionView,
          },
          event.source.cardId,
        );
        if (sourceCard?.cardType === "program" && programTargets.length > 0) {
          selectionRef.current.setSelection({
            side: ctx.humanSide,
            moveId: "playCard",
            sourceCardId: event.source.cardId,
            sourceCardType: sourceCard.cardType,
          });
          return;
        }
      }
      const action = mapDropToAction(event, ctx);
      if (!action) {
        return;
      }
      e.dispatch(action);
      selectionRef.current.clearSelection();
    };
    registerCardDropHandler(handle);
    return () => registerCardDropHandler(null);
  }, [registerCardDropHandler]);

  return null;
}

function SelectionReset({ side }: { side: Side }) {
  const interactionView = useEngineInteractionView(side);
  const { selection, clearSelection } = useMoveSelection();
  const attackSelection = useAttackSelection();

  useEffect(() => {
    if (!selection || selection.side !== side) {
      return;
    }
    if (interactionView.status !== "ready") {
      clearSelection();
      return;
    }
    const stillAvailable = interactionActionIsAvailable(interactionView, selection.moveId);
    if (!stillAvailable) {
      clearSelection();
    }
  }, [clearSelection, interactionView, selection, side]);

  useEffect(() => {
    const pending = attackSelection.selection;
    if (!pending || pending.side !== side) {
      return;
    }
    if (interactionView.status !== "ready") {
      attackSelection.clearSelection();
      return;
    }
    const attackerStillAvailable = interactionViewHasAttacker(interactionView, pending.attackerId);
    if (!attackerStillAvailable) {
      attackSelection.clearSelection();
    }
  }, [attackSelection, interactionView, side]);

  return null;
}

function AutoAdvanceAttackFlow() {
  const { activeSide, aiStrategies, humanSide, matchState, rawEngineEvents, dispatch } =
    useEngine();
  const playerInteractionView = useEngineInteractionView("player");
  const opponentInteractionView = useEngineInteractionView("opponent");
  const action =
    getAutoAttackAdvanceAction(matchState, {
      player: playerInteractionView,
      opponent: opponentInteractionView,
    }) ??
    getAutoPostAttackPassAction(matchState, {
      activeSide,
      activeSideHasAi: aiStrategies[activeSide] !== null,
      humanSide,
      rawEngineEvents,
    });

  useEffect(() => {
    if (!action) {
      return;
    }
    dispatch(action);
  }, [action, dispatch]);

  return null;
}

function DesktopBoard({
  humanSide,
  playerIdentities,
  playerConnections,
  connectionDiagnostic,
  onClaimRivalDrop,
}: {
  humanSide: Side;
  playerIdentities?: PlayerIdentityBySide;
  playerConnections?: PlayerConnectionBySide;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  onClaimRivalDrop?: () => void;
}) {
  const rivalSide: Side = otherSide(humanSide);
  const boardWrapRef = useRef<HTMLDivElement | null>(null);
  const [bannerMinimized, setBannerMinimized] = useState(false);
  const [bannerPosition, setBannerPosition] = useState<"top" | "bottom">("bottom");
  const [fixerCollapsed, setFixerCollapsed] = useState(loadFixerCollapsedPreference);
  const [confirmingConcede, setConfirmingConcede] = useState(false);
  const shouldCollapseSidebarForBoard =
    useMediaQuery("(min-width: 769px) and (max-width: 1100px)") ?? false;
  const [sidebarOpen, setSidebarOpen] = useState(() => !shouldCollapseSidebarForBoard);
  const [sidebarUserToggled, setSidebarUserToggled] = useState(false);
  const toggleBannerMinimized = useCallback(() => setBannerMinimized((v) => !v), []);
  const toggleBannerPosition = useCallback(
    () => setBannerPosition((p) => (p === "top" ? "bottom" : "top")),
    [],
  );
  const handleSidebarOpenChange = useCallback((open: boolean) => {
    setSidebarUserToggled(true);
    setSidebarOpen(open);
  }, []);
  const toggleFixerCollapsed = useCallback(() => {
    setFixerCollapsed((current) => {
      const next = !current;
      persistFixerCollapsedPreference(next);
      return next;
    });
  }, []);
  useEffect(() => {
    if (sidebarUserToggled) {
      return;
    }
    setSidebarOpen(!shouldCollapseSidebarForBoard);
  }, [shouldCollapseSidebarForBoard, sidebarUserToggled]);
  const engine = useEngine();
  const {
    activeSide,
    aiStrategies,
    aiTakeover,
    canResetScenario,
    canUndo,
    canUndoToTurnStart,
    dispatch,
    prioritySide,
    resetScenario,
  } = engine;
  const rivalZones = useSideZones(rivalSide);
  const humanZones = useSideZones(humanSide);
  const rivalClaimAvailable = isConnectionDisconnected(playerConnections?.[rivalSide]);
  const humanConnectionStatus = connectionUiStatus(playerConnections?.[humanSide]);
  const hasAiControls =
    aiTakeover !== null || aiStrategies.player !== null || aiStrategies.opponent !== null;
  const canConcede =
    !hasAiControls &&
    !engine.matchState.G.gameEnded &&
    (!engine.isRemote || engine.postGameContext !== undefined);
  const concedeGame = useCallback(() => {
    setConfirmingConcede(false);
    dispatch({ type: "concede", as: PLAYER_SIDE_TO_ID[humanSide] });
  }, [dispatch, humanSide]);
  const controlledAiSide = aiTakeover?.side ?? rivalSide;
  const aiInteractionView = useEngineInteractionView(controlledAiSide);
  const aiStrategy = aiTakeover?.strategy ?? aiStrategies[rivalSide];
  const aiDescriptor = findStrategyDescriptor(aiStrategy);
  const aiStatus = resolveAiStatus({
    gameEnded: engine.matchState.G.gameEnded,
    lastError: engine.lastAiError,
    mode: engine.aiMode,
    humanSide,
    aiSide: controlledAiSide,
    hasStrategy: aiStrategy !== null && aiTakeover === null,
    aiInteractionView,
  });
  const showDiagnostics = import.meta.env.DEV;

  return (
    <>
      <SidebarProvider
        defaultOpen={!shouldCollapseSidebarForBoard}
        open={sidebarOpen}
        onOpenChange={handleSidebarOpenChange}
      >
        <SidebarInset>
          <div className={classes.page}>
            <div className={classes.boardWrap} ref={boardWrapRef} data-testid="board-wrap">
              <div className={classes.boardShell}>
                <div
                  className={classes.opponentSide}
                  data-side={rivalSide}
                  data-priority={prioritySide === rivalSide ? "true" : "false"}
                >
                  <GameBoard
                    opponent
                    side={rivalSide}
                    bannerState={{
                      minimized: bannerMinimized,
                      position: bannerPosition,
                      toggleMinimized: toggleBannerMinimized,
                      togglePosition: toggleBannerPosition,
                    }}
                    fixerCollapsed={fixerCollapsed}
                    onToggleFixerCollapsed={toggleFixerCollapsed}
                  />
                  <OpponentDisconnectOverlay
                    variant="opponent"
                    connection={playerConnections?.[rivalSide]}
                    onClaimDrop={onClaimRivalDrop}
                    claimAvailable={rivalClaimAvailable}
                  />
                </div>
                <div className={classes.centerWrapper}>
                  <CenterRow gigsOnly spaciousGigs />
                </div>
                <div
                  className={classes.playerSide}
                  data-side={humanSide}
                  data-priority={prioritySide === humanSide ? "true" : "false"}
                >
                  <GameBoard
                    side={humanSide}
                    bannerState={{
                      minimized: bannerMinimized,
                      position: bannerPosition,
                      toggleMinimized: toggleBannerMinimized,
                      togglePosition: toggleBannerPosition,
                    }}
                    fixerCollapsed={fixerCollapsed}
                    onToggleFixerCollapsed={toggleFixerCollapsed}
                  />
                  {humanConnectionStatus === "disconnected" ||
                  humanConnectionStatus === "reconnecting" ? (
                    <OpponentDisconnectOverlay
                      variant="self"
                      connection={playerConnections?.[humanSide]}
                    />
                  ) : null}
                </div>
              </div>
              <CombatArrowOverlay containerRef={boardWrapRef} />
              <RivalHand side={rivalSide} />
              <HumanHand side={humanSide} />
              <div
                className={`${classes.bannerSlot} ${
                  bannerPosition === "top" ? classes.bannerSlotTop : classes.bannerSlotBottom
                }`}
                data-position={bannerPosition}
              >
                {humanConnectionStatus === "reconnecting" ? <ReconnectCue /> : null}
                <PromptBanner
                  side={humanSide}
                  minimized={bannerMinimized}
                  position={bannerPosition}
                  onToggleMinimize={toggleBannerMinimized}
                  onTogglePosition={toggleBannerPosition}
                  showActionPrompt={true}
                />
              </div>
            </div>
          </div>
        </SidebarInset>
        <Sidebar side="right" collapsible="icon">
          <SidebarRail />
          <SidebarContent className={classes.sidebarTable}>
            <div className={classes.sidebarTopRail}>
              <SideRailSummary
                label={playerIdentities?.[rivalSide]?.displayName ?? "Rival"}
                side={rivalSide}
                active={activeSide === rivalSide}
                zones={rivalZones}
                tone="rival"
                detail={summaryDetail({
                  identity: playerIdentities?.[rivalSide],
                  aiDetail: hasAiControls ? (aiDescriptor?.label ?? "No AI") : undefined,
                })}
                connection={playerConnections?.[rivalSide]}
                allConnections={playerConnections}
                connectionDiagnostic={connectionDiagnostic}
                playerId={playerIdentities?.[rivalSide]?.id}
                onClaimDrop={onClaimRivalDrop}
                claimAvailable={rivalClaimAvailable}
                highlightName={isVisibleSubscriptionTier(
                  playerIdentities?.[rivalSide]?.subscriptionTier,
                )}
                status={hasAiControls ? AI_STATUS_LABELS[aiStatus] : undefined}
                action={<SidebarTrigger className={classes.sideRailTrigger} />}
              >
                {hasAiControls ? (
                  <div className={classes.sideRailAi}>
                    <AiControlPanel compact embedded hideDecisionLog hideScenarioActions />
                  </div>
                ) : null}
              </SideRailSummary>
            </div>

            <div className={classes.sidebarLogRail}>
              <SidebarGroup className={classes.sidebarLogGroup}>
                <SidebarGroupLabel>Event log</SidebarGroupLabel>
                <SidebarGroupContent className={classes.sidebarLogContent}>
                  <MoveLogPanel />
                </SidebarGroupContent>
              </SidebarGroup>
              <details className={`${classes.sidebarDrawer} ${classes.sidebarMidDrawer}`}>
                <summary>Chat</summary>
                <ChatPanel compact />
              </details>
            </div>

            <div className={classes.sidebarBottomRail}>
              <SideRailSummary
                label={playerIdentities?.[humanSide]?.displayName ?? "You"}
                side={humanSide}
                active={activeSide === humanSide}
                zones={humanZones}
                tone="you"
                detail={summaryDetail({ identity: playerIdentities?.[humanSide] })}
                connection={playerConnections?.[humanSide]}
                allConnections={playerConnections}
                connectionDiagnostic={connectionDiagnostic}
                playerId={playerIdentities?.[humanSide]?.id}
                self
              />
              <div className={classes.sidebarLocalActions}>
                <button
                  type="button"
                  className={classes.sidebarActionButton}
                  data-testid="rail-undo"
                  aria-label="Undo last move"
                  onClick={() => dispatch({ type: "undo" })}
                  disabled={!canUndo}
                >
                  Undo
                </button>
                <button
                  type="button"
                  className={classes.sidebarActionButton}
                  data-testid="rail-undo-turn-start"
                  aria-label="Undo to turn start"
                  onClick={() => dispatch({ type: "undoToTurnStart" })}
                  disabled={!canUndoToTurnStart}
                >
                  Turn start
                </button>
                {hasAiControls ? (
                  <button
                    type="button"
                    className={`${classes.sidebarActionButton} ${classes.sidebarDangerButton}`}
                    data-testid="rail-restart"
                    onClick={resetScenario}
                    disabled={!canResetScenario}
                  >
                    Restart
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`${classes.sidebarActionButton} ${classes.sidebarDangerButton}`}
                    data-testid="rail-concede"
                    aria-label="Concede game"
                    onClick={() => setConfirmingConcede(true)}
                    disabled={!canConcede}
                  >
                    Concede
                  </button>
                )}
                <UserConfigButton />
              </div>
              {showDiagnostics ? (
                <details className={classes.sidebarDrawer}>
                  <summary>Development</summary>
                  <RawEngineEventsPanel />
                  <DebugPanelToggle />
                </details>
              ) : null}
            </div>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
      <ChoiceModal side="player" />
      <ChoiceModal side="opponent" />
      <EndGameModal />
      <ConfirmDialog
        opened={confirmingConcede && canConcede}
        title="Concede game?"
        body="This concedes the game and cannot be undone."
        cancelLabel="Keep playing"
        confirmLabel="Concede"
        onCancel={() => setConfirmingConcede(false)}
        onConfirm={concedeGame}
      />
    </>
  );
}

function summaryDetail({
  identity,
  aiDetail,
}: {
  identity?: PlayerIdentityBySide[Side];
  aiDetail?: string;
}): string | undefined {
  const playerMeta = formatPlayerIdentityMeta(identity);
  return [playerMeta, aiDetail].filter(Boolean).join(" · ") || undefined;
}

function SideRailSummary({
  label,
  side,
  active,
  zones,
  tone,
  detail,
  status,
  action,
  connection,
  allConnections,
  connectionDiagnostic,
  playerId,
  onClaimDrop,
  claimAvailable,
  self,
  highlightName,
  children,
}: {
  label: string;
  side: Side;
  active: boolean;
  zones: ReturnType<typeof useSideZones>;
  tone: "rival" | "you";
  detail?: string;
  status?: string;
  action?: ReactNode;
  connection?: PlayerConnectionBySide[Side];
  allConnections?: PlayerConnectionBySide;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  playerId?: string;
  onClaimDrop?: () => void;
  claimAvailable?: boolean;
  self?: boolean;
  highlightName?: boolean;
  children?: ReactNode;
}) {
  const highlightedName = tone === "rival" && highlightName;
  return (
    <section
      className={`${classes.sideRailSummary} ${classes[`sideRail_${tone}`]}`}
      data-testid="rail-summary"
      data-side={side}
      data-tone={tone}
      data-active={active ? "true" : "false"}
      data-ai-status={status ?? undefined}
    >
      <div className={classes.sideRailMain}>
        <div className={classes.sideRailHeading}>
          <ConnectionDiagnosticPopover
            className={classes.sideRailDot}
            connection={connection}
            allConnections={allConnections}
            diagnostic={connectionDiagnostic}
            label={label}
            side={side}
            playerId={playerId}
            onClaimDrop={onClaimDrop}
            claimAvailable={claimAvailable}
            self={self}
          />
          <span>
            <strong
              data-testid="rail-player-name"
              data-subscriber={highlightedName ? "true" : undefined}
            >
              {label}
            </strong>
            {detail ? <small>{detail}</small> : null}
          </span>
        </div>
        <div className={classes.sideRailStats} aria-label={`${label} board summary`}>
          <span
            title="Deck"
            aria-label={`Deck: ${zones.deckCount}`}
            data-testid="rail-stat"
            data-stat="deck"
            data-value={zones.deckCount}
          >
            <strong>{zones.deckCount}</strong>
            <small>D</small>
          </span>
          <span
            title="Hand"
            aria-label={`Hand: ${zones.hand.length}`}
            data-testid="rail-stat"
            data-stat="hand"
            data-value={zones.hand.length}
          >
            <strong>{zones.hand.length}</strong>
            <small>H</small>
          </span>
          <span
            title="Eddies"
            aria-label={`Eddies: ${zones.eddies}`}
            data-testid="rail-stat"
            data-stat="eddies"
            data-value={zones.eddies}
          >
            <strong>{zones.eddies}</strong>
            <small>E</small>
          </span>
          <span
            title="Street Cred"
            aria-label={`Street Cred: ${zones.streetCred}`}
            data-testid="rail-stat"
            data-stat="streetCred"
            data-value={zones.streetCred}
          >
            <strong>{zones.streetCred}</strong>
            <small>C</small>
          </span>
        </div>
        <div className={classes.sideRailControls}>
          <em
            data-testid="rail-active-pill"
            data-active={active ? "true" : "false"}
            aria-label={`${label} status: ${status ?? (active ? "Active" : "Waiting")}`}
          >
            {status ?? (active ? "Active" : "Waiting")}
          </em>
          {action}
        </div>
      </div>
      {children}
    </section>
  );
}

const AI_STATUS_LABELS = {
  thinking: "Thinking",
  paused: "Paused",
  waiting: "Waiting",
  "you-control": "You control",
  done: "Done",
  error: "Error",
} as const;

function HumanHand({ side }: { side: Side }) {
  // The bottom-rendered hand is the human's. Renders via the desktop fan
  // layout. `side` is "player" or "opponent" depending on which seat the
  // human is in.
  useEngine(); // ensure provider — useSideZones below also throws if not.
  const zones = useSideZones(side);
  // Affordability hint is strictly an eddies-vs-cost check — `playCard`
  // validates against `player.eddies` only; ready Legends count as eddies
  // visually in the rail but aren't spendable to play hand cards.
  const availableEddies = zones.eddies;
  return (
    <div className={classes.handBottom}>
      <HandZone
        cards={zones.hand.map((c) => ({
          imageUrl: c.imageUrl,
          name: c.name,
          cardId: c.cardId,
          cardType: c.cardType,
          color: c.color,
          effectiveRules: c.effectiveRules,
          rulesText: c.rulesText,
          classifications: c.classifications,
          keywords: c.keywords,
          hasSellTag: c.hasSellTag,
          cost: c.cost,
          effectiveCost: c.effectiveCost,
          costEffects: c.costEffects,
          power: c.power,
          effectivePower: c.effectivePower,
          activeEffects: c.activeEffects,
        }))}
        side={side}
        availableEddies={availableEddies}
      />
    </div>
  );
}

function RivalHand({ side }: { side: Side }) {
  const zones = useSideZones(side);
  return (
    <div className={classes.handTop}>
      <HandZone faceDown cardCount={zones.hand.length} side={side} />
    </div>
  );
}
