import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { buildCyberpunkInteractionView } from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import {
  AIPlayer,
  stripPrivateFields,
  type AIStrategy,
  type CyberpunkTestEngine,
  type GameEvent,
  type MatchState,
  type MoveDecision,
  type MoveLog,
  type PlayerPrompt,
  type AnimationScript,
  type CommandResult,
  type CommandSuccess,
  type StepResult,
  EMPTY_ANIMATION_SCRIPT,
  defOf,
} from "@tcg/cyberpunk-engine";
import type {
  EngineInteractionView,
  EntitySelectionInput,
  InteractionAction,
  InteractionSubmission,
  InteractionSubmissionValue,
} from "@tcg/protocol";
import { DEFAULT_SCENARIO, getScenario, P1, P2, type ScenarioId } from "./fixtures/scenarios";
import { AI_SPEED_MS, type AiMode, type AiSpeed } from "./aiStatus";
import type { ChatMessage, ChatPresetKey } from "./chat";
import type { EngineAction } from "../types/e2e";
import type { CyberpunkAnalyticsEnvelope } from "../components/EndGameModal/postGameApi";
import { EngineContext } from "./engineContext";
import { actionToInteractionSubmission } from "./live/actionToInteraction";
import { otherSide, PLAYER_SIDE_TO_ID, type Side } from "./sides";

// Re-export so consumers that imported `EngineAction` from this module keep
// compiling. The canonical declaration now lives in `src/types/e2e.ts` so the
// Playwright harness can share it without dragging React into its tsconfig.
export type { EngineAction };

function sideForPlayerId(playerId: unknown): MoveLogEntry["side"] {
  if (playerId === P1) {
    return "player";
  }
  if (playerId === P2) {
    return "opponent";
  }
  return "system";
}

function sideForGameEvent(event: GameEvent): MoveLogEntry["side"] {
  if ("playerId" in event) {
    return sideForPlayerId(event.playerId);
  }
  if (event.type === "gigStolen") {
    return sideForPlayerId(event.toPlayerId);
  }
  if (event.type === "gameEnded") {
    return sideForPlayerId(event.winnerId);
  }
  return "system";
}

function rawMoveLogEntry(
  log: MoveLog,
  id: number,
): { id: number; side: MoveLogEntry["side"]; log: MoveLog } {
  const side: MoveLogEntry["side"] =
    log.type === "turnStarted" || log.type === "turnEnded" || log.type === "gameEnded"
      ? "system"
      : sideForPlayerId(log.playerId);
  return { id, side, log };
}

function undoMoveLog(
  state: MatchState,
  playerId: typeof P1,
  scope: Extract<MoveLog, { type: "undo" }>["scope"],
): MoveLog {
  return {
    type: "undo",
    scope,
    playerId,
    turnNumber: state.G.turnMetadata.turnNumber,
    timestamp: Date.now(),
  };
}

function resolvePrioritySide(
  views: Readonly<Record<Side, EngineInteractionView>>,
  fallback: Side,
): Side {
  const playerHasPriority = hasPriorityStatus(views.player);
  const opponentHasPriority = hasPriorityStatus(views.opponent);

  if (playerHasPriority !== opponentHasPriority) {
    return playerHasPriority ? "player" : "opponent";
  }

  return fallback;
}

function hasPriorityStatus(view: EngineInteractionView): boolean {
  return view.status === "choosing" || view.status === "ready";
}

/** Optional AI configuration: drive one or both sides with a strategy. */
export interface AISideConfig {
  player?: AIStrategy | null;
  opponent?: AIStrategy | null;
}

/** Single decision recorded by the AI driver. */
export interface AiLogEntry {
  /** Monotonic id within a scenario (resets on rebuild). */
  id: number;
  /** ms since epoch. */
  timestamp: number;
  /** Which side acted. */
  side: Side;
  /** What the strategy did and what came back. */
  result: StepResult;
}

export interface AiTakeoverState {
  /** The side whose AI strategy is currently paused while the human controls it. */
  side: Side;
  /** Strategy to restore when control is released. */
  strategy: AIStrategy;
}

const EVENT_LOG_CAP = 200;
const MOVE_LOG_CAP = 200;
const RAW_ENGINE_EVENT_CAP = 300;
const CHAT_LOG_CAP = 200;

function singletonCardTargetAction(
  state: MatchState,
): Extract<EngineAction, { type: "resolveEffectTarget" }> | null {
  const choice = state.G.turnMetadata.pendingChoice;
  if (
    choice?.type !== "chooseTarget" ||
    choice.payload.type !== "effectTarget" ||
    choice.payload.targetKind !== "card" ||
    !choice.payload.effect ||
    !choice.payload.sourceCardId ||
    !choice.payload.sourcePlayerId
  ) {
    return null;
  }
  const min = choice.payload.min ?? 1;
  const max = choice.payload.max ?? 1;
  const eligibleIds = choice.payload.eligibleIds ?? [];
  if (min !== 1 || max !== 1 || eligibleIds.length !== 1) {
    return null;
  }
  const sourceCard = state.G.cardIndex[choice.payload.sourceCardId as unknown as string];
  if (sourceCard && defOf(sourceCard).type === "program") {
    return null;
  }
  return {
    type: "resolveEffectTarget",
    targetIds: [eligibleIds[0]!],
    as: choice.chooserId,
  };
}

interface ProtocolCardTargetSelection {
  readonly choiceKey: string;
  readonly actionId: "resolveEffectTarget" | "resolveDiscardFromHand";
  readonly targetInput: EntitySelectionInput;
  readonly min: number;
  readonly max: number;
}

function cardEffectTargetSelectionFromInteractionView(
  side: Side,
  view: EngineInteractionView,
): ProtocolCardTargetSelection | null {
  if (view.status !== "choosing") {
    return null;
  }
  const action = view.actions.find(
    (
      candidate,
    ): candidate is InteractionAction & {
      id: ProtocolCardTargetSelection["actionId"];
    } =>
      candidate.enabled &&
      (candidate.id === "resolveEffectTarget" || candidate.id === "resolveDiscardFromHand"),
  );
  const targetInput = action?.inputs.find(
    (input): input is EntitySelectionInput =>
      input.kind === "entity-selection" &&
      (input.id === "targetIds" || input.id === "cardIds") &&
      input.entityKinds.includes("card"),
  );
  if (!action || !targetInput) {
    return null;
  }
  const max = targetInput.max;
  if (max <= 1) {
    return null;
  }
  const eligibleIds = targetInput.candidates.map((candidate) => candidate.entity.instanceId);
  return {
    choiceKey: [
      side,
      action.id,
      action.source?.instanceId ?? "",
      eligibleIds.join("|"),
      targetInput.min,
      targetInput.max,
    ].join(":"),
    actionId: action.id,
    targetInput,
    min: targetInput.min,
    max: targetInput.max,
  };
}

export interface MoveLogEntry {
  /** Stable id within a scenario (resets on rebuild). */
  id: number;
  /** Side the engine attributed the log to, projected through {@link PLAYER_SIDE_TO_ID}. */
  side: "player" | "opponent" | "system";
  /** Privacy-stripped MoveLog. Always project before storing. */
  log: MoveLog;
}

export interface RawEngineEventEntry {
  /** Stable id within a scenario (resets on rebuild). */
  id: number;
  /** Capture time in ms since epoch. Raw engine events do not carry timestamps. */
  timestamp: number;
  /** Best-effort side attribution derived from the command issuer and emitted events. */
  side: MoveLogEntry["side"];
  /** Move id dispatched into the engine. */
  move: string;
  /** Raw command input supplied to the move. */
  input: unknown;
  /** Engine state id after the command was applied. */
  stateID: number;
  /** Raw events emitted by the engine for this successful command, in order. */
  events: ReadonlyArray<GameEvent>;
  /** Player-facing move logs synthesized for this command. */
  moveLogs: ReadonlyArray<MoveLog>;
  /** Pre-computed animation timeline for this command — consumed by ScriptPlayer. */
  animationScript: AnimationScript;
}

export interface LocalCommandCommit {
  source: "human" | "ai";
  side: Side;
  action?: EngineAction;
  result: CommandSuccess;
}

export interface CyberpunkPostGameContext {
  gameId: string;
  matchId: string;
  gameNumber: number;
  format: "best_of_1" | "best_of_3";
  matchStatus: "in_progress" | "completed" | "abandoned";
  currentGameId?: string;
  nextGameId?: string;
  player1Score?: number;
  player2Score?: number;
  actorIds?: {
    player: string;
    opponent: string;
  };
  analytics?: CyberpunkAnalyticsEnvelope;
}

export type PostGameSurface = "default" | "deck-builder-practice";

interface EffectCardTargetSelection {
  side: Side;
  choiceKey: string;
  targetIds: readonly string[];
  min: number;
  max: number;
}

export interface EngineContextValue {
  scenarioId: ScenarioId;
  setScenario: (id: ScenarioId) => void;
  /** Rebuild the current scenario from its fixture (clears log + errors). */
  resetScenario: () => void;
  matchState: MatchState;
  /** Player-facing prompt for each side. */
  prompts: { player: PlayerPrompt; opponent: PlayerPrompt };
  /** Game-agnostic interaction projection for each side. */
  interactionViews: { player: EngineInteractionView; opponent: EngineInteractionView };
  /** Active player id from the engine's turn metadata. */
  activeSide: Side;
  /** Side currently holding priority for clock and decision affordances. */
  prioritySide: Side;

  // ── Human seat & AI configuration ─────────────────────────────────────────
  /** Side currently driven by the human. */
  humanSide: Side;
  /** AI strategy attached to each side (or null). */
  aiStrategies: Readonly<Record<Side, AIStrategy | null>>;
  /** Pacing mode for the AI driver. */
  aiMode: AiMode;
  /** Speed bucket ("fast" | "balanced" | "slow") — maps to ms via AI_SPEED_MS. */
  aiSpeed: AiSpeed;
  /** Most recent AI error, if any. Cleared on the next successful step. */
  lastAiError: string | null;
  /** Suspended AI control, if the human has taken over an AI-driven side. */
  aiTakeover: AiTakeoverState | null;
  /** Recent decisions, newest last. Capped at EVENT_LOG_CAP. */
  eventLog: ReadonlyArray<AiLogEntry>;
  /**
   * Engine-emitted move logs, projected through the local viewer (humanSide).
   * Newest last, capped at {@link MOVE_LOG_CAP}.
   */
  moveLogs: ReadonlyArray<MoveLogEntry>;
  /**
   * Dev-facing raw engine events emitted by successful commands.
   * Newest last, capped at {@link RAW_ENGINE_EVENT_CAP}.
   */
  rawEngineEvents: ReadonlyArray<RawEngineEventEntry>;
  /** True when the previous move can be undone without crossing a reveal barrier. */
  canUndo: boolean;
  /** True when the current turn can be rewound to its clean main-phase checkpoint. */
  canUndoToTurnStart: boolean;
  /** True when local history-changing controls such as restart are available. */
  canResetScenario: boolean;
  /** Local chat history. Cleared on scenario reset. */
  chatMessages: ReadonlyArray<ChatMessage>;
  /** Send a canned chat message attributed to the current humanSide. */
  sendChatPreset: (key: ChatPresetKey) => void;
  /** Send a free-text chat message attributed to the current humanSide. */
  sendChatText: (text: string) => void;

  // ── Setters ───────────────────────────────────────────────────────────────
  /** Move the human seat to the given side (and so flip the board camera). */
  setHumanSide: (side: Side) => void;
  /** Convenience: move the human seat to the other side. Take Control / Release. */
  toggleHumanSide: () => void;
  /** Attach (or detach with `null`) an AI strategy on a side. */
  setStrategy: (side: Side, strategy: AIStrategy | null) => void;
  /** Pause the AI on a side and move the human seat there. Returns false when no AI exists there. */
  takeOverAiSide: (side: Side) => boolean;
  /** Restore the paused AI strategy and move the human seat back. */
  releaseAiTakeover: () => boolean;
  setAiMode: (mode: AiMode) => void;
  setAiSpeed: (speed: AiSpeed) => void;
  /** Run a single AI step now, regardless of mode. Used by the panel's Next button. */
  stepOnce: () => void;
  /** Empty the event log and clear lastAiError. */
  clearLog: () => void;
  /** Empty the raw engine event inspector log. */
  clearRawEngineEvents: () => void;
  /** Optional return target for hosted matches. */
  remoteReturnUrl?: string;
  /** Hosted-match context for the post-game modal. */
  postGameContext?: CyberpunkPostGameContext;
  /** UI surface that owns post-game actions and available post-game data. */
  postGameSurface: PostGameSurface;
  /** Current visible-card target picks for multi-target field selections. */
  effectCardTargetSelection: EffectCardTargetSelection | null;
  /** Toggle one visible card target and auto-submit when the prompt is complete. */
  toggleEffectCardTarget: (side: Side, cardId: string) => boolean;

  /**
   * Dispatch a CyberpunkTestEngine method (e.g. "playCard", "attackUnit") and
   * re-render. Returns the underlying CommandResult so callers can react.
   * Errors are caught and returned as failures so a bad UI dispatch does not
   * crash the app.
   */
  dispatch: (action: EngineAction) => CommandResult | { success: false; error: string };

  /**
   * True when this engine session is driven by a server (live match) — i.e.
   * the host passed `remoteDispatch`. Local controls that mutate the engine
   * directly (resetScenario, undo, AI takeover, etc.) should be hidden or
   * routed through the server in that case.
   */
  isRemote: boolean;
  /** True while a server-authority live match has one optimistic move awaiting ack. */
  hasPendingRemoteMove: boolean;
}

interface EngineProviderProps {
  children: ReactNode;
  initialScenario?: ScenarioId;
  /**
   * Optional dynamic builder for non-fixture sessions such as local practice
   * matches. When provided, Restart rebuilds from this builder instead of the
   * static scenario registry.
   */
  initialEngineBuilder?: () => CyberpunkTestEngine;
  /**
   * Initial AI strategies per side. The provider drives each AI on its turns,
   * but only when the side is *not* the human seat.
   */
  initialAi?: AISideConfig;
  /** Initial human seat. Defaults to "player". */
  initialHumanSide?: Side;
  /** Initial pacing mode. Defaults to "auto". */
  initialAiMode?: AiMode;
  /** Initial speed bucket. Defaults to "balanced". */
  initialAiSpeed?: AiSpeed;
  /**
   * When true, single-card non-Program target prompts resolve automatically.
   * Useful for smoother practice play, but disabled by dev test fixtures that
   * need to exercise manual target selection.
   */
  autoResolveSingletonCardTargets?: boolean;
  /** Called once when the current engine state reaches a terminal game state. */
  onMatchEnded?: (result: { winnerId: string | null; reason: string | null }) => void;
  /**
   * Optional server-authority dispatcher. When provided, UI actions are sent
   * out of process and the provider waits for the caller to remount it with
   * the next authoritative state.
   */
  remoteDispatch?: (
    action: EngineAction,
    state: MatchState,
    actor: {
      side: Side;
      interactionView: EngineInteractionView;
      submission: InteractionSubmission;
      optimisticResult?: CommandSuccess;
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
  /** Request a server-authority undo through the host surface. */
  requestRemoteUndo?: () => boolean;
  /** Server-authority move logs collected from gateway updates. */
  remoteMoveLogs?: ReadonlyArray<MoveLog>;
  /** Server-authority animation scripts collected from gateway updates. */
  remoteEngineEvents?: ReadonlyArray<RawEngineEventEntry>;
  /** Server-authority chat history collected from context and gateway updates. */
  remoteChatMessages?: ReadonlyArray<ChatMessage>;
  /** Server-authority live match has one optimistic move awaiting ack. */
  hasPendingRemoteMove?: boolean;
  /** Return target for hosted matches once the game is over. */
  remoteReturnUrl?: string;
  /** Hosted-match context for analytics, notes, feedback, and series navigation. */
  postGameContext?: CyberpunkPostGameContext;
  /** UI surface that owns post-game actions and available post-game data. */
  postGameSurface?: PostGameSurface;
  /**
   * Called after a successful local command. Server-synced client-authority
   * practice uses this to persist the browser-owned engine state.
   */
  onLocalCommandCommitted?: (commit: LocalCommandCommit) => void;
  /** Disable undo/restart while keeping local dispatch and AI execution active. */
  lockLocalHistoryControls?: boolean;
  /** Disable restart/scenario switching without disabling local undo. */
  lockLocalResetControls?: boolean;
}

function buildInitialStrategies(cfg: AISideConfig | undefined): Record<Side, AIStrategy | null> {
  return {
    player: cfg?.player ?? null,
    opponent: cfg?.opponent ?? null,
  };
}

function submissionValuesFromDecision(
  decision: MoveDecision & { kind: "command" },
): Record<string, InteractionSubmissionValue> | null {
  const out: Record<string, InteractionSubmissionValue> = {};
  for (const [key, value] of Object.entries(decision.args ?? {})) {
    const submissionValue = toSubmissionValue(value);
    if (submissionValue === undefined) {
      return null;
    }
    out[key] = submissionValue;
  }
  return out;
}

function toSubmissionValue(value: unknown): InteractionSubmissionValue | undefined {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return value;
  }
  if (Array.isArray(value) && value.every((item): item is string => typeof item === "string")) {
    return value;
  }
  return undefined;
}

export function executeEngineAction(eng: CyberpunkTestEngine, action: EngineAction): CommandResult {
  switch (action.type) {
    case "playCard":
      return action.attachToId
        ? eng.executeMove(
            "playCard",
            { args: { cardId: action.cardId, attachToId: action.attachToId } },
            action.as,
          )
        : eng.playCard(action.cardId, { as: action.as });
    case "sellCard":
      return eng.sellCard(action.cardId, { as: action.as });
    case "callLegend":
      return eng.callLegend(action.cardId, { as: action.as });
    case "goSolo":
      return eng.executeMove("goSolo", { args: { cardId: action.cardId } }, action.as);
    case "attackUnit":
      return eng.attackUnit(action.attackerId, action.defenderId, { as: action.as });
    case "attackRival":
      return eng.attackRival(action.attackerId, { as: action.as });
    case "useBlocker":
      return eng.useBlocker(action.blockerId, { as: action.as });
    case "activateAbility":
      return eng.activateAbility(action.cardId, action.abilityIndex, { as: action.as });
    case "resolveAttack":
      return eng.executeMove("resolveAttack", { args: { pass: action.pass } }, action.as);
    case "resolveStealGigs":
      return eng.executeMove("resolveStealGigs", { args: { dieIds: action.dieIds } }, action.as);
    case "resolveTrigger":
      return eng.executeMove(
        "resolveTrigger",
        { args: { triggerId: action.triggerId, pass: action.pass } },
        action.as,
      );
    case "resolveAdjustGig":
      return eng.executeMove("resolveAdjustGig", { args: { value: action.value } }, action.as);
    case "resolveEffectTarget":
      return eng.executeMove(
        "resolveEffectTarget",
        { args: { targetIds: action.targetIds, pass: action.pass } },
        action.as,
      );
    case "resolveDiscardFromHand":
      return eng.executeMove(
        "resolveDiscardFromHand",
        { args: { cardIds: action.cardIds, pass: action.pass } },
        action.as,
      );
    case "resolveSearchDeck":
      return eng.executeMove(
        "resolveSearchDeck",
        { args: { selectedCardIds: action.selectedCardIds } },
        action.as,
      );
    case "passPhase":
      return eng.passPhase({ as: action.as });
    case "mulligan":
      return eng.mulligan({ as: action.as });
    case "keepHand":
      return eng.keepHand({ as: action.as });
    case "gainGig":
      return eng.gainGig(action.dieId, { as: action.as });
    case "resolveCardToPlay":
      return eng.resolveCardToPlay(action.cardId, { as: action.as });
    case "resolveCardToMove":
      return eng.resolveCardToMove(action.cardId, { pass: action.pass, as: action.as });
    case "concede":
      return eng.concede({ as: action.as });
    case "undo":
    case "undoToTurnStart":
      return {
        success: false,
        error: "Undo is unavailable in live matches",
        errorCode: "undo_unavailable",
        currentStateID: eng.getState().ctx.stateID,
      };
    default: {
      const exhaustiveCheck: never = action;
      return {
        success: false,
        error: `Unknown action type: ${String(exhaustiveCheck)}`,
        errorCode: "unknown_action",
        currentStateID: eng.getState().ctx.stateID,
      };
    }
  }
}

function remotePendingCommandResult(action: EngineAction, state: MatchState): CommandSuccess {
  return {
    success: true,
    stateID: state.ctx.stateID,
    state,
    patches: [],
    inversePatches: [],
    gameEvents: [],
    moveLogs: [],
    animationScript: EMPTY_ANIMATION_SCRIPT,
    processedCommand: {
      commandID: `remote-pending:${action.type}`,
      move: action.type,
      input: { args: {} },
    },
    undoable: false,
  };
}

export function EngineProvider({
  children,
  initialScenario = DEFAULT_SCENARIO,
  initialEngineBuilder,
  initialAi,
  initialHumanSide = "player",
  initialAiMode = "auto",
  initialAiSpeed = "balanced",
  autoResolveSingletonCardTargets = true,
  onMatchEnded,
  remoteDispatch,
  remoteSubmitInteraction,
  requestRemoteUndo,
  remoteMoveLogs = [],
  remoteEngineEvents = [],
  remoteChatMessages = [],
  hasPendingRemoteMove = false,
  remoteReturnUrl,
  postGameContext,
  postGameSurface = "default",
  onLocalCommandCommitted,
  lockLocalHistoryControls = false,
  lockLocalResetControls = lockLocalHistoryControls,
}: EngineProviderProps) {
  // Engine instance is held in a ref so reassigning on scenario change doesn't
  // tear down React subscribers. We bump `version` to trigger re-renders.
  const customEngineBuilderRef = useRef<typeof initialEngineBuilder>(initialEngineBuilder);
  const syncedEngineBuilderRef = useRef<typeof initialEngineBuilder>(initialEngineBuilder);
  const engineRef = useRef<CyberpunkTestEngine>(
    initialEngineBuilder ? initialEngineBuilder() : getScenario(initialScenario).build(),
  );
  const [scenarioId, setScenarioId] = useState<ScenarioId>(initialScenario);
  // Bumped on every scenario rebuild — even when the id is unchanged (Restart).
  // The AI-player rebuild effect depends on this so its players never point at
  // a stale engine instance after a same-scenario reset.
  const [engineBuildId, setEngineBuildId] = useState(0);
  const [, bump] = useState(0);

  const [humanSide, setHumanSideState] = useState<Side>(initialHumanSide);
  const [aiStrategies, setAiStrategies] = useState<Record<Side, AIStrategy | null>>(() =>
    buildInitialStrategies(initialAi),
  );
  const [aiMode, setAiModeState] = useState<AiMode>(initialAiMode);
  const [aiSpeed, setAiSpeedState] = useState<AiSpeed>(initialAiSpeed);
  const [aiTakeover, setAiTakeover] = useState<AiTakeoverState | null>(null);
  const [eventLog, setEventLog] = useState<AiLogEntry[]>([]);
  const [lastAiError, setLastAiError] = useState<string | null>(null);
  const [effectCardTargetSelection, setEffectCardTargetSelection] =
    useState<EffectCardTargetSelection | null>(null);
  // Raw move logs straight from the engine (with PrivateField wrappers intact)
  // are stored alongside the side they were attributed to. Viewer-filtered
  // entries are derived in a useMemo so flipping humanSide re-projects the
  // history correctly.
  const [rawMoveLogs, setRawMoveLogs] = useState<
    Array<{ id: number; side: MoveLogEntry["side"]; log: MoveLog }>
  >(() => remoteMoveLogs.map((log, index) => rawMoveLogEntry(log, index + 1)));
  const [rawEngineEvents, setRawEngineEvents] = useState<RawEngineEventEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    remoteChatMessages.slice(-CHAT_LOG_CAP),
  );
  const moveLogIdRef = useRef(remoteMoveLogs.length);
  const rawEngineEventIdRef = useRef(0);
  const chatIdRef = useRef(0);
  const notifiedGameEndStateIdRef = useRef<number | null>(null);
  // Mirror humanSide so chat senders see the latest value without recreating
  // the send callbacks on every flip.
  const humanSideRef = useRef<Side>(humanSide);
  humanSideRef.current = humanSide;
  const onLocalCommandCommittedRef =
    useRef<typeof onLocalCommandCommitted>(onLocalCommandCommitted);
  onLocalCommandCommittedRef.current = onLocalCommandCommitted;

  const forceRender = useCallback(() => bump((n) => n + 1), []);

  useEffect(() => {
    if (syncedEngineBuilderRef.current === initialEngineBuilder) {
      return;
    }
    syncedEngineBuilderRef.current = initialEngineBuilder;
    customEngineBuilderRef.current = initialEngineBuilder;
    if (!initialEngineBuilder) {
      return;
    }
    try {
      engineRef.current = initialEngineBuilder();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[engine] failed to rebuild hosted session", err);
      return;
    }
    setEngineBuildId((n) => n + 1);
    notifiedGameEndStateIdRef.current = null;
    forceRender();
  }, [initialEngineBuilder, forceRender]);

  // AIPlayer instances are cached per (engine, side, strategy). Recreated on
  // strategy change or scenario rebuild; never mutated in place.
  const aiPlayersRef = useRef<Record<Side, AIPlayer | null>>({ player: null, opponent: null });
  const logIdRef = useRef(0);

  // Dev-only spy: every action that flows through `dispatch` is recorded so
  // e2e specs can assert that a UI interaction (e.g. clicking the Mulligan
  // verb button) translates into the expected engine action. Survives
  // re-renders via useRef. Never read in production.
  const dispatchLogRef = useRef<
    Array<{ action: EngineAction; result: CommandResult | { success: false; error: string } }>
  >([]);

  const buildAiPlayer = useCallback(
    (scenario: ScenarioId, side: Side, strategy: AIStrategy | null): AIPlayer | null => {
      if (!strategy) {
        return null;
      }
      const local = engineRef.current.getLocalEngine();
      return new AIPlayer(local, PLAYER_SIDE_TO_ID[side], strategy, {
        rngSeed: `${scenario}:${side}`,
      });
    },
    [],
  );

  // (Re)build all AI players when strategies change or scenario rebuilds.
  // `engineBuildId` is included so a same-scenario Restart still rebuilds the
  // AIPlayers — otherwise they would keep referencing the prior LocalEngine
  // and drive a phantom state.
  useEffect(() => {
    aiPlayersRef.current = {
      player: buildAiPlayer(scenarioId, "player", aiStrategies.player),
      opponent: buildAiPlayer(scenarioId, "opponent", aiStrategies.opponent),
    };
  }, [scenarioId, engineBuildId, aiStrategies, buildAiPlayer]);

  const setScenario = useCallback(
    (id: ScenarioId) => {
      if (lockLocalResetControls) {
        return;
      }
      try {
        customEngineBuilderRef.current = undefined;
        engineRef.current = getScenario(id).build();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[engine] failed to build scenario", id, err);
        return;
      }
      setScenarioId(id);
      setEngineBuildId((n) => n + 1);
      setEventLog([]);
      setRawMoveLogs([]);
      setRawEngineEvents([]);
      setChatMessages([]);
      setLastAiError(null);
      logIdRef.current = 0;
      moveLogIdRef.current = 0;
      rawEngineEventIdRef.current = 0;
      chatIdRef.current = 0;
      notifiedGameEndStateIdRef.current = null;
      forceRender();
    },
    [forceRender, lockLocalResetControls],
  );

  const resetScenario = useCallback(() => {
    if (lockLocalResetControls) {
      return;
    }
    const customBuilder = customEngineBuilderRef.current;
    if (!customBuilder) {
      setScenario(scenarioId);
      return;
    }
    try {
      engineRef.current = customBuilder();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[engine] failed to rebuild practice session", err);
      return;
    }
    setEngineBuildId((n) => n + 1);
    setEventLog([]);
    setRawMoveLogs([]);
    setRawEngineEvents([]);
    setChatMessages([]);
    setLastAiError(null);
    logIdRef.current = 0;
    moveLogIdRef.current = 0;
    rawEngineEventIdRef.current = 0;
    chatIdRef.current = 0;
    notifiedGameEndStateIdRef.current = null;
    forceRender();
  }, [setScenario, scenarioId, forceRender, lockLocalResetControls]);

  const setHumanSide = useCallback((side: Side) => {
    setHumanSideState(side);
  }, []);

  const toggleHumanSide = useCallback(() => {
    setHumanSideState((side) => otherSide(side));
  }, []);

  const setStrategy = useCallback((side: Side, strategy: AIStrategy | null) => {
    setAiStrategies((prev) => ({ ...prev, [side]: strategy }));
    setAiTakeover((prev) => (prev?.side === side ? null : prev));
  }, []);

  const takeOverAiSide = useCallback(
    (side: Side): boolean => {
      const strategy = aiStrategies[side];
      if (!strategy) {
        return false;
      }
      setAiTakeover({ side, strategy });
      setAiStrategies((prev) => ({ ...prev, [side]: null }));
      setHumanSideState(side);
      return true;
    },
    [aiStrategies],
  );

  const releaseAiTakeover = useCallback((): boolean => {
    if (!aiTakeover) {
      return false;
    }
    setAiStrategies((prev) => ({ ...prev, [aiTakeover.side]: aiTakeover.strategy }));
    setHumanSideState(otherSide(aiTakeover.side));
    setAiTakeover(null);
    return true;
  }, [aiTakeover]);

  const setAiMode = useCallback((mode: AiMode) => setAiModeState(mode), []);
  const setAiSpeed = useCallback((speed: AiSpeed) => setAiSpeedState(speed), []);

  const clearLog = useCallback(() => {
    setEventLog([]);
    setLastAiError(null);
  }, []);

  const clearRawEngineEvents = useCallback(() => {
    setRawEngineEvents([]);
  }, []);

  // ── Move log accumulation ─────────────────────────────────────────────────

  /**
   * Append the {@link MoveLog} entries produced by a successful command.
   * `side` is the engine side the actor maps to via {@link PLAYER_SIDE_TO_ID}.
   * System logs (turnStarted, turnEnded, gameEnded) are tagged "system".
   */
  const appendMoveLogs = useCallback((logs: ReadonlyArray<MoveLog>) => {
    if (logs.length === 0) {
      return;
    }
    setRawMoveLogs((prev) => {
      const next = prev.slice();
      for (const log of logs) {
        const side: MoveLogEntry["side"] =
          log.type === "turnStarted" || log.type === "turnEnded" || log.type === "gameEnded"
            ? "system"
            : log.playerId === P1
              ? "player"
              : "opponent";
        next.push({ id: ++moveLogIdRef.current, side, log });
      }
      return next.length > MOVE_LOG_CAP ? next.slice(next.length - MOVE_LOG_CAP) : next;
    });
  }, []);

  const appendRawEngineEvents = useCallback((result: CommandSuccess) => {
    const timestamp = Date.now();
    setRawEngineEvents((prev) => {
      const next = prev.slice();
      const firstEventSide = result.gameEvents
        .map(sideForGameEvent)
        .find((side) => side !== "system");
      next.push({
        id: ++rawEngineEventIdRef.current,
        timestamp,
        side: firstEventSide ?? sideForPlayerId(result.moveLogs[0]?.playerId),
        move: result.processedCommand.move,
        input: result.processedCommand.input ?? { args: {} },
        stateID: result.stateID,
        events: result.gameEvents,
        moveLogs: result.moveLogs,
        animationScript: result.animationScript,
      });
      return next.length > RAW_ENGINE_EVENT_CAP
        ? next.slice(next.length - RAW_ENGINE_EVENT_CAP)
        : next;
    });
  }, []);

  useEffect(() => {
    if (!remoteDispatch) {
      return;
    }
    setRawMoveLogs(remoteMoveLogs.map((log, index) => rawMoveLogEntry(log, index + 1)));
    moveLogIdRef.current = remoteMoveLogs.length;
  }, [remoteDispatch, remoteMoveLogs]);

  useEffect(() => {
    if (!remoteDispatch) {
      return;
    }
    setRawEngineEvents(remoteEngineEvents.slice(-RAW_ENGINE_EVENT_CAP));
    rawEngineEventIdRef.current = remoteEngineEvents.at(-1)?.id ?? 0;
  }, [remoteDispatch, remoteEngineEvents]);

  useEffect(() => {
    if (!remoteDispatch) {
      return;
    }
    setChatMessages(remoteChatMessages.slice(-CHAT_LOG_CAP));
    chatIdRef.current = remoteChatMessages.reduce((max, message) => Math.max(max, message.id), 0);
  }, [remoteDispatch, remoteChatMessages]);

  // ── Chat ──────────────────────────────────────────────────────────────────

  const sendChatPreset = useCallback((key: ChatPresetKey) => {
    setChatMessages((prev) => {
      const next = prev.concat({
        kind: "preset",
        id: ++chatIdRef.current,
        timestamp: Date.now(),
        senderSide: humanSideRef.current,
        presetKey: key,
      });
      return next.length > CHAT_LOG_CAP ? next.slice(next.length - CHAT_LOG_CAP) : next;
    });
  }, []);

  const sendChatText = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    setChatMessages((prev) => {
      const next = prev.concat({
        kind: "text",
        id: ++chatIdRef.current,
        timestamp: Date.now(),
        senderSide: humanSideRef.current,
        text: trimmed,
      });
      return next.length > CHAT_LOG_CAP ? next.slice(next.length - CHAT_LOG_CAP) : next;
    });
  }, []);

  // ── AI step execution ─────────────────────────────────────────────────────

  const recordStep = useCallback(
    (side: Side, result: StepResult) => {
      const entry: AiLogEntry = {
        id: ++logIdRef.current,
        timestamp: Date.now(),
        side,
        result,
      };
      setEventLog((prev) => {
        const next = prev.concat(entry);
        return next.length > EVENT_LOG_CAP ? next.slice(next.length - EVENT_LOG_CAP) : next;
      });
      if (result.kind === "illegal" || result.kind === "stuck") {
        setLastAiError(
          result.kind === "illegal" ? `${result.errorCode}: ${result.error}` : result.reason,
        );
      } else if (result.kind === "acted") {
        // Successful step — clear any stale error.
        setLastAiError(null);
        if (result.result.success) {
          appendMoveLogs(result.result.moveLogs);
          appendRawEngineEvents(result.result);
          onLocalCommandCommittedRef.current?.({
            source: "ai",
            side,
            result: result.result,
          });
        }
      }
    },
    [appendMoveLogs, appendRawEngineEvents],
  );

  const runStepFor = useCallback(
    (side: Side): boolean => {
      const ai = aiPlayersRef.current[side];
      if (!ai) {
        return false;
      }
      try {
        const result = ai.step();
        recordStep(side, result);
        return result.kind === "acted";
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setLastAiError(message);
        // eslint-disable-next-line no-console
        console.warn("[engine] AI step threw:", err);
        return false;
      }
    },
    [recordStep],
  );

  // ── Read engine state every render ────────────────────────────────────────

  const engine = engineRef.current;
  const matchState = engine.getState();
  const engineStateId = matchState.ctx.stateID;
  const playerPrompt = engine.getPrompt(P1);
  const opponentPrompt = engine.getPrompt(P2);
  const playerInteractionView = buildCyberpunkInteractionView({
    actorId: P1,
    stateVersion: engineStateId,
    prompt: playerPrompt,
  });
  const opponentInteractionView = buildCyberpunkInteractionView({
    actorId: P2,
    stateVersion: engineStateId,
    prompt: opponentPrompt,
  });
  const activeSide: Side = matchState.G.turnMetadata.activePlayerId === P1 ? "player" : "opponent";
  const prioritySide = resolvePrioritySide(
    { player: playerInteractionView, opponent: opponentInteractionView },
    activeSide,
  );
  const playerEffectCardTargetKey = cardEffectTargetSelectionFromInteractionView(
    "player",
    playerInteractionView,
  )?.choiceKey;
  const opponentEffectCardTargetKey = cardEffectTargetSelectionFromInteractionView(
    "opponent",
    opponentInteractionView,
  )?.choiceKey;

  const runRemoteStepFor = useCallback(
    (side: Side): boolean => {
      if (!remoteSubmitInteraction) {
        return false;
      }
      if (hasPendingRemoteMove) {
        return false;
      }
      const strategy = aiStrategies[side];
      if (!strategy) {
        return false;
      }

      const interactionView = side === "player" ? playerInteractionView : opponentInteractionView;
      const probe = new AIPlayer(
        engineRef.current.getLocalEngine().fork(),
        PLAYER_SIDE_TO_ID[side],
        strategy,
        { rngSeed: `${scenarioId}:${side}:remote` },
      );
      const result = probe.step();
      recordStep(side, result);

      if (result.kind !== "acted") {
        return false;
      }
      const values = submissionValuesFromDecision(result.decision);
      if (!values) {
        setLastAiError(`Unsupported AI decision payload for ${result.decision.move}`);
        return false;
      }

      return remoteSubmitInteraction(
        {
          side,
          interactionView,
          actionId: result.decision.move,
          values,
        },
        engineRef.current.getState(),
      );
    },
    [
      aiStrategies,
      hasPendingRemoteMove,
      opponentInteractionView,
      playerInteractionView,
      recordStep,
      remoteSubmitInteraction,
      scenarioId,
    ],
  );

  /**
   * A side is eligible for AI driving when it has a strategy attached AND it's
   * not the current human seat AND its prompt is actionable. Returning the
   * side directly lets `stepOnce` and the auto loop share the same predicate.
   *
   * The AI runs during the setup phase too. Setup prompts only advertise
   * `mulligan`/`keepHand`, so the bot can resolve its own decision without
   * triggering the setup-to-start transition via `passPhase`.
   */
  const aiSideToStep = useMemo<Side | null>(() => {
    if (matchState.G.gameEnded) {
      return null;
    }
    const candidates: Array<[Side, EngineInteractionView]> = [
      ["player", playerInteractionView],
      ["opponent", opponentInteractionView],
    ];
    const bothSidesHaveAi = aiStrategies.player !== null && aiStrategies.opponent !== null;
    for (const [side, view] of candidates) {
      if (!bothSidesHaveAi && side === humanSide) {
        continue;
      }
      if (!aiStrategies[side]) {
        continue;
      }
      const isActionable =
        view.status === "choosing" ||
        (view.status === "ready" && view.actions.some((action) => action.enabled));
      if (isActionable) {
        return side;
      }
    }
    return null;
  }, [matchState, humanSide, aiStrategies, playerInteractionView, opponentInteractionView]);

  const stepOnce = useCallback(() => {
    if (!aiSideToStep) {
      return;
    }
    if (remoteSubmitInteraction) {
      runRemoteStepFor(aiSideToStep);
    } else {
      runStepFor(aiSideToStep);
    }
    forceRender();
  }, [aiSideToStep, remoteSubmitInteraction, runRemoteStepFor, runStepFor, forceRender]);

  const dispatch = useCallback<EngineContextValue["dispatch"]>(
    (action) => {
      const eng = engineRef.current;
      if (remoteDispatch) {
        if (action.type === "undo" || action.type === "undoToTurnStart") {
          if (action.type === "undo" && requestRemoteUndo?.()) {
            return {
              success: false as const,
              error: "Undo proposal sent; waiting for opponent approval",
            };
          }
          return { success: false as const, error: "Undo is unavailable in live matches" };
        }
        if (hasPendingRemoteMove) {
          return {
            success: false as const,
            error: "Waiting for the previous move to be confirmed",
          };
        }
        const preMoveState = eng.getState();
        const actor = {
          side: humanSide,
          interactionView: humanSide === "player" ? playerInteractionView : opponentInteractionView,
        };
        const submission = actionToInteractionSubmission(action, actor.interactionView);
        if (!submission) {
          return {
            success: false as const,
            error: "This move is not available in the current server interaction view",
          };
        }
        try {
          const sent = remoteDispatch(action, preMoveState, {
            ...actor,
            submission,
          });
          if (sent === false) {
            const builder = customEngineBuilderRef.current;
            if (builder) {
              engineRef.current = builder();
              setRawMoveLogs(remoteMoveLogs.map((log, index) => rawMoveLogEntry(log, index + 1)));
              setRawEngineEvents(remoteEngineEvents.slice(-RAW_ENGINE_EVENT_CAP));
            }
            return {
              success: false as const,
              error: "Gateway is unavailable; reconnect before taking another move",
            };
          }
          const result = remotePendingCommandResult(action, preMoveState);
          if (import.meta.env.DEV) {
            dispatchLogRef.current.push({ action, result });
          }
          return result;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          // eslint-disable-next-line no-console
          console.warn("[engine] optimistic dispatch failed:", action, message);
          const failure = { success: false as const, error: message };
          if (import.meta.env.DEV) {
            dispatchLogRef.current.push({ action, result: failure });
          }
          return failure;
        }
      }
      try {
        let result: CommandResult;
        switch (action.type) {
          case "playCard":
            result = action.attachToId
              ? eng.executeMove(
                  "playCard",
                  { args: { cardId: action.cardId, attachToId: action.attachToId } },
                  action.as,
                )
              : eng.playCard(action.cardId, { as: action.as });
            break;
          case "sellCard":
            result = eng.sellCard(action.cardId, { as: action.as });
            break;
          case "callLegend":
            result = eng.callLegend(action.cardId, { as: action.as });
            break;
          case "goSolo":
            result = eng.executeMove("goSolo", { args: { cardId: action.cardId } }, action.as);
            break;
          case "attackUnit":
            result = eng.attackUnit(action.attackerId, action.defenderId, {
              as: action.as,
            });
            break;
          case "attackRival":
            result = eng.attackRival(action.attackerId, { as: action.as });
            break;
          case "useBlocker":
            result = eng.useBlocker(action.blockerId, { as: action.as });
            break;
          case "activateAbility":
            result = eng.activateAbility(action.cardId, action.abilityIndex, { as: action.as });
            break;
          case "resolveAttack":
            result = eng.executeMove("resolveAttack", { args: { pass: action.pass } }, action.as);
            break;
          case "resolveStealGigs":
            result = eng.executeMove(
              "resolveStealGigs",
              { args: { dieIds: action.dieIds } },
              action.as,
            );
            break;
          case "resolveTrigger":
            result = eng.executeMove(
              "resolveTrigger",
              { args: { triggerId: action.triggerId, pass: action.pass } },
              action.as,
            );
            break;
          case "resolveAdjustGig":
            result = eng.executeMove(
              "resolveAdjustGig",
              { args: { value: action.value } },
              action.as,
            );
            break;
          case "resolveEffectTarget":
            result = eng.executeMove(
              "resolveEffectTarget",
              { args: { targetIds: action.targetIds, pass: action.pass } },
              action.as,
            );
            break;
          case "resolveDiscardFromHand":
            result = eng.executeMove(
              "resolveDiscardFromHand",
              { args: { cardIds: action.cardIds, pass: action.pass } },
              action.as,
            );
            break;
          case "resolveSearchDeck":
            result = eng.executeMove(
              "resolveSearchDeck",
              { args: { selectedCardIds: action.selectedCardIds } },
              action.as,
            );
            break;
          case "passPhase":
            result = eng.passPhase({ as: action.as });
            break;
          case "mulligan":
            result = eng.mulligan({ as: action.as });
            break;
          case "keepHand":
            result = eng.keepHand({ as: action.as });
            break;
          case "gainGig":
            result = eng.gainGig(action.dieId, { as: action.as });
            break;
          case "resolveCardToPlay":
            result = eng.resolveCardToPlay(action.cardId, { as: action.as });
            break;
          case "resolveCardToMove":
            result = eng.resolveCardToMove(action.cardId, {
              pass: action.pass,
              as: action.as,
            });
            break;
          case "concede":
            result = eng.concede({ as: action.as });
            break;
          case "undo": {
            if (lockLocalHistoryControls) {
              return {
                success: false as const,
                error: "Undo is unavailable in synced practice matches",
              };
            }
            if (!eng.undo()) {
              return { success: false as const, error: "No undoable move is available" };
            }
            result = {
              success: true,
              stateID: eng.getState().ctx.stateID,
              state: eng.getState(),
              patches: [],
              inversePatches: [],
              gameEvents: [],
              moveLogs: [undoMoveLog(eng.getState(), PLAYER_SIDE_TO_ID[humanSide], "lastMove")],
              animationScript: EMPTY_ANIMATION_SCRIPT,
              processedCommand: { commandID: "undo", move: "undo", input: { args: {} } },
              undoable: false,
            };
            break;
          }
          case "undoToTurnStart": {
            if (lockLocalHistoryControls) {
              return {
                success: false as const,
                error: "Undo is unavailable in synced practice matches",
              };
            }
            if (!eng.undoToTurnStart()) {
              return {
                success: false as const,
                error: "No clean turn-start checkpoint is available",
              };
            }
            result = {
              success: true,
              stateID: eng.getState().ctx.stateID,
              state: eng.getState(),
              patches: [],
              inversePatches: [],
              gameEvents: [],
              moveLogs: [undoMoveLog(eng.getState(), PLAYER_SIDE_TO_ID[humanSide], "turnStart")],
              animationScript: EMPTY_ANIMATION_SCRIPT,
              processedCommand: {
                commandID: "undo-to-turn-start",
                move: "undoToTurnStart",
                input: { args: {} },
              },
              undoable: false,
            };
            break;
          }
        }
        if (result.success) {
          appendMoveLogs(result.moveLogs);
          appendRawEngineEvents(result);
          onLocalCommandCommittedRef.current?.({
            source: "human",
            side: humanSide,
            action,
            result,
          });
        }
        if (import.meta.env.DEV) {
          dispatchLogRef.current.push({ action, result });
        }
        forceRender();
        return result;
      } catch (err) {
        // CyberpunkTestEngine throws on illegal moves. We catch + surface as a
        // soft failure so the UI's optimistic dispatch (e.g. a stale drop) does
        // not crash the app.
        const message = err instanceof Error ? err.message : String(err);
        // eslint-disable-next-line no-console
        console.warn("[engine] dispatch failed:", action, message);
        const failure = { success: false as const, error: message };
        if (import.meta.env.DEV) {
          dispatchLogRef.current.push({ action, result: failure });
        }
        return failure;
      }
    },
    [
      forceRender,
      appendMoveLogs,
      appendRawEngineEvents,
      remoteDispatch,
      requestRemoteUndo,
      hasPendingRemoteMove,
      lockLocalHistoryControls,
      humanSide,
      playerInteractionView,
      opponentInteractionView,
      remoteMoveLogs,
      remoteEngineEvents,
    ],
  );

  useEffect(() => {
    if (!effectCardTargetSelection) {
      return;
    }
    const currentKey =
      effectCardTargetSelection.side === "player"
        ? playerEffectCardTargetKey
        : opponentEffectCardTargetKey;
    if (effectCardTargetSelection.choiceKey !== currentKey) {
      setEffectCardTargetSelection(null);
    }
  }, [effectCardTargetSelection, playerEffectCardTargetKey, opponentEffectCardTargetKey]);

  const toggleEffectCardTarget = useCallback<EngineContextValue["toggleEffectCardTarget"]>(
    (side, cardId) => {
      const view = side === "player" ? playerInteractionView : opponentInteractionView;
      const selection = cardEffectTargetSelectionFromInteractionView(side, view);
      if (!selection) {
        return false;
      }

      const { actionId, choiceKey, min, max } = selection;
      const eligibleIds = new Set(
        selection.targetInput.candidates.map((candidate) => candidate.entity.instanceId),
      );
      if (!eligibleIds.has(cardId)) {
        return false;
      }

      if (max <= 1) {
        dispatch(
          actionId === "resolveDiscardFromHand"
            ? { type: "resolveDiscardFromHand", cardIds: [cardId], as: PLAYER_SIDE_TO_ID[side] }
            : { type: "resolveEffectTarget", targetIds: [cardId], as: PLAYER_SIDE_TO_ID[side] },
        );
        return true;
      }

      const currentIds =
        effectCardTargetSelection?.choiceKey === choiceKey
          ? [...effectCardTargetSelection.targetIds]
          : [];
      const nextIds = currentIds.includes(cardId)
        ? currentIds.filter((id) => id !== cardId)
        : currentIds.length >= max
          ? currentIds
          : [...currentIds, cardId];

      if (nextIds.length >= max) {
        setEffectCardTargetSelection(null);
        dispatch(
          actionId === "resolveDiscardFromHand"
            ? {
                type: "resolveDiscardFromHand",
                cardIds: nextIds.slice(0, max),
                as: PLAYER_SIDE_TO_ID[side],
              }
            : {
                type: "resolveEffectTarget",
                targetIds: nextIds.slice(0, max),
                as: PLAYER_SIDE_TO_ID[side],
              },
        );
        return true;
      }

      setEffectCardTargetSelection({
        side,
        choiceKey,
        targetIds: nextIds,
        min,
        max,
      });
      return true;
    },
    [dispatch, effectCardTargetSelection, opponentInteractionView, playerInteractionView],
  );

  useEffect(() => {
    if (!autoResolveSingletonCardTargets) {
      return;
    }
    const action = singletonCardTargetAction(matchState);
    if (!action) {
      return;
    }
    dispatch(action);
  }, [autoResolveSingletonCardTargets, dispatch, engineStateId, matchState]);

  // After every render, in auto mode, schedule one AI step if a side is
  // eligible. The setTimeout delay lets the UI paint the previous state so
  // each AI move is visually distinct. The effect re-runs because the bump
  // above changes React state, so the loop drains naturally until no side is
  // eligible (game ended, or it's the human's turn / waiting state).
  useEffect(() => {
    if (aiMode !== "auto") {
      return;
    }
    if (!aiSideToStep) {
      return;
    }
    // Halt the auto loop once an AI step has surfaced an error. Without this,
    // an `illegal`/`stuck` result keeps re-firing every speed-bucket tick and
    // floods the event log with the same failure. The user clears the error
    // (Next, Restart, Clear log, or strategy change) to resume auto stepping.
    if (lastAiError) {
      return;
    }
    const delay = AI_SPEED_MS[aiSpeed];
    const timer = setTimeout(() => {
      if (remoteSubmitInteraction) {
        runRemoteStepFor(aiSideToStep);
      } else {
        runStepFor(aiSideToStep);
      }
      forceRender();
    }, delay);
    return () => clearTimeout(timer);
  }, [
    aiMode,
    aiSpeed,
    aiSideToStep,
    engineStateId,
    lastAiError,
    remoteSubmitInteraction,
    runRemoteStepFor,
    runStepFor,
    forceRender,
  ]);

  useEffect(() => {
    if (!onMatchEnded || !matchState.G.gameEnded) {
      return;
    }
    if (notifiedGameEndStateIdRef.current === matchState.ctx.stateID) {
      return;
    }
    notifiedGameEndStateIdRef.current = matchState.ctx.stateID;
    onMatchEnded({
      winnerId: matchState.G.winnerId ? String(matchState.G.winnerId) : null,
      reason: matchState.G.winReason,
    });
  }, [matchState, onMatchEnded]);

  // Re-project raw move logs whenever the viewer (humanSide) changes. This
  // means a Take Control flip retroactively reveals the new viewer's private
  // fields and re-hides the previous viewer's, matching what a freshly
  // reconnecting client would see.
  const moveLogs = useMemo<MoveLogEntry[]>(() => {
    const viewerId = PLAYER_SIDE_TO_ID[humanSide];
    return rawMoveLogs.map((entry) => ({
      id: entry.id,
      side: entry.side,
      log: stripPrivateFields(entry.log, viewerId),
    }));
  }, [rawMoveLogs, humanSide]);
  const canUndo = remoteDispatch
    ? !hasPendingRemoteMove && remoteMoveLogs.length > 0 && !matchState.G.gameEnded
    : !lockLocalHistoryControls && engine.canUndo();

  const value: EngineContextValue = {
    scenarioId,
    setScenario,
    resetScenario,
    isRemote: Boolean(remoteDispatch),
    hasPendingRemoteMove,
    remoteReturnUrl,
    postGameContext,
    postGameSurface,
    matchState,
    prompts: { player: playerPrompt, opponent: opponentPrompt },
    interactionViews: { player: playerInteractionView, opponent: opponentInteractionView },
    activeSide,
    prioritySide,
    humanSide,
    aiStrategies,
    aiMode,
    aiSpeed,
    lastAiError,
    aiTakeover,
    eventLog,
    moveLogs,
    rawEngineEvents,
    canUndo,
    canUndoToTurnStart: !lockLocalHistoryControls && engine.canUndoToTurnStart(),
    canResetScenario: !lockLocalResetControls,
    chatMessages,
    sendChatPreset,
    sendChatText,
    effectCardTargetSelection,
    toggleEffectCardTarget,
    setHumanSide,
    toggleHumanSide,
    setStrategy,
    takeOverAiSide,
    releaseAiTakeover,
    setAiMode,
    setAiSpeed,
    stepOnce,
    clearLog,
    clearRawEngineEvents,
    dispatch,
  };

  if (typeof window !== "undefined" && import.meta.env.DEV) {
    // Dev-only test harness bridge. Lets e2e specs:
    //   - read engine state (`engine`)
    //   - force a React re-render after direct engine mutation (`forceRender`)
    //   - inspect every action that flowed through the React `dispatch` so a
    //     spec can verify a UI click resulted in the right engine call
    //     (`dispatchLog`, `clearDispatchLog`)
    // `__cyberpunkEngine` stays as a legacy alias for back-compat.
    const win = window as unknown as {
      __cyberpunkEngine?: unknown;
      __cyberpunkSimulator?: {
        engine: unknown;
        forceRender: () => void;
        getDispatchLog: () => ReadonlyArray<{ action: EngineAction; result: unknown }>;
        clearDispatchLog: () => void;
        getHumanSide: () => Side;
        // Flip the human seat. Equivalent to clicking "Take Control" in the
        // sidebar — only the human's PromptBanner renders, so e2e specs flip
        // here before clicking verb buttons for the rival.
        setHumanSide: (side: Side) => void;
      };
    };
    win.__cyberpunkEngine = engine;
    win.__cyberpunkSimulator = {
      engine,
      forceRender,
      getDispatchLog: () => dispatchLogRef.current.slice(),
      clearDispatchLog: () => {
        dispatchLogRef.current.length = 0;
      },
      getHumanSide: () => humanSide,
      setHumanSide,
    };
  }

  return <EngineContext.Provider value={value}>{children}</EngineContext.Provider>;
}
