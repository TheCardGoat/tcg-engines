import { createDecisionClient } from "../../../../../simulator/bot/decision-worker";
import { createGundamBotPlanner, type GundamBotInput, type GundamBotContext } from "./bot-decision";
import {
  GUNDAM_AUTOMATED_ACTION_STRATEGIES,
  asPlayerId,
  getSafeGundamAutomatedActionStrategyOption,
  takeAutomatedActionWithFallback,
  type BotDecisionSink,
  type BotDecisionRecord,
  type CandidateStrategy,
  type MatchRuntime,
  type MatchStaticResources,
  type PlayerId,
  type TakeAutomatedActionWithFallbackResult,
} from "@tcg/gundam-engine";

import { simulatorExternalCommandGateFor } from "@tcg/simulator-runtime/animation";

/**
 * Bot play speed presets — the delay between an opportunity to act and
 * the actual submission. Values line up with Lorcana's speed buckets so
 * the UX feels familiar.
 *
 *   - fast      — 250ms: shortest pause, feels snappy in dev loops
 *   - balanced  — 800ms: visible "thinking", human can read the last move
 *   - slow      — 1400ms: deliberate pacing for showing off / recording
 */
export const BOT_SPEED_MS = {
  fast: 250,
  balanced: 800,
  slow: 1400,
} as const satisfies Record<string, number>;

export type BotSpeed = keyof typeof BOT_SPEED_MS;

/**
 * Play mode for the bot — mirrors Lorcana's step/auto split.
 *
 *   - "auto"  — bot acts continuously while it is the active player.
 *   - "step"  — bot acts once per `stepOnce()` call; schedules no timers.
 *   - "paused"— bot never acts until the mode flips back to auto or step.
 */
export type BotPlayMode = "auto" | "step" | "paused";

export interface StrategyBotOptions {
  /** Engine strategy used to rank candidates. Defaults to `greedyLegalStrategy`. */
  readonly strategy?: CandidateStrategy;
  /** Starting speed bucket (auto mode). Defaults to "balanced". */
  readonly speed?: BotSpeed;
  /** Starting play mode. Defaults to "auto". */
  readonly playMode?: BotPlayMode;
  /** Optional callback fired after every submitted bot action. */
  readonly onAction?: (result: TakeAutomatedActionWithFallbackResult) => void;
  /**
   * Optional structured-telemetry sink — invoked once per bot action
   * with the engine's full {@link BotDecisionSink} payload (turn
   * number, state IDs, per-attempt error codes, timestamp). Use this
   * to feed a debug panel, persist a replay trace, or stream training
   * data. Distinct from `onAction` (which carries only the planner's
   * raw result) because telemetry consumers usually want the
   * surrounding context the engine already had on hand.
   */
  readonly onDecision?: BotDecisionSink;
  /**
   * Fallback chain attempt cap (see `takeAutomatedActionWithFallback`).
   * Defaults to 3.
   */
  readonly maxCandidateAttempts?: number;
}

export interface StrategyBotHandle {
  /** Current mode. */
  getError(): string | null;
  subscribeStatus(listener: () => void): () => void;
  getMode(): BotPlayMode;
  /** Current speed bucket. */
  getSpeed(): BotSpeed;
  /** Name of the registered strategy. */
  getStrategyName(): string;
  /** Flip to auto / step / paused. Auto immediately schedules if it's the bot's turn. */
  setMode(mode: BotPlayMode): void;
  /** Replace the speed bucket. Live reschedule if currently auto-waiting. */
  setSpeed(speed: BotSpeed): void;
  /** Replace the ranking strategy. Takes effect on the next action. */
  setStrategy(strategy: CandidateStrategy): void;
  /** Subscribe to structured decision records for local diagnostics. */
  subscribeDecisions(listener: BotDecisionSink): () => void;
  /**
   * Fire exactly one bot action if it's currently the bot's turn. No-op
   * otherwise. Returns the action result (or undefined if no action was
   * taken).
   */
  stepOnce(): TakeAutomatedActionWithFallbackResult | undefined;
  /** Tear down the state-update subscription + any pending timers. */
  dispose(): void;
}

/**
 * Attach a candidate-strategy bot to one seat of the runtime.
 *
 * Subscribes to `runtime.onStateUpdate`. Whenever the configured
 * `playerName` is the active player and the mode is "auto", schedules
 * a `takeAutomatedActionWithFallback` call after the speed-bucket
 * delay. "step" mode exposes a manual `stepOnce()`; "paused" mode
 * short-circuits everything.
 *
 * The bot reads the state synchronously inside the listener, so the
 * timer only kicks in when we decide to act — this avoids race
 * windows where a state update fires and the bot gets confused by a
 * stale snapshot at timer expiry. On expiry we re-check whether it's
 * still the bot's turn before submitting.
 *
 * Replaces the older `attachAutoPassBot` + `attachAutoPassTurnBot`
 * combo for fixtures that want a real opponent; those remain in the
 * fixture dir for specs that deliberately rely on "opponent always
 * passes" behaviour.
 */
export function attachStrategyBot(
  runtime: MatchRuntime,
  staticResources: MatchStaticResources,
  playerName: string,
  options: StrategyBotOptions = {},
): StrategyBotHandle {
  // SSR loader: the fixture factory runs under SSR to produce a
  // snapshot, then the runtime is discarded. Subscribing here would
  // register a state-update listener + schedule `setTimeout` calls
  // (even in "auto" mode there's an initial `schedule()` at the
  // bottom of this function) that leak past the request. The client
  // re-attaches a fresh strategy bot to the reconstructed runtime
  // post-hydration via `useClientBot`, so nothing is lost.
  //
  // Return a no-op handle so callers that store the handle on
  // `dev.bot` (like `vs-ai-demo`) don't crash when calling methods
  // on the server.
  //
  // Guarded on `import.meta.env.SSR` rather than `typeof window ===
  // "undefined"` so Node-based unit tests / CLI tools can still
  // attach a real strategy bot if needed.
  if (import.meta.env.SSR) {
    return {
      getError: () => null,
      subscribeStatus: () => () => {},
      getMode: () => "paused",
      getSpeed: () => "balanced",
      getStrategyName: () => options.strategy?.name ?? "noop",
      setMode: () => {},
      setSpeed: () => {},
      setStrategy: () => {},
      subscribeDecisions: () => () => {},
      stepOnce: () => undefined,
      dispose: () => {},
    };
  }

  const player = asPlayerId(playerName) as PlayerId;
  const animationGate = simulatorExternalCommandGateFor(runtime);
  let strategy = options.strategy ?? getSafeGundamAutomatedActionStrategyOption().strategy;
  let speed: BotSpeed = options.speed ?? "balanced";
  let mode: BotPlayMode = options.playMode ?? "auto";
  let timer: ReturnType<typeof setTimeout> | null = null;
  let timerRevision = 0;
  let disposed = false;
  let error: string | null = null;
  const statusListeners = new Set<() => void>();
  const notifyStatus = () => {
    for (const listener of statusListeners) listener();
  };
  const client = createDecisionClient<
    GundamBotInput,
    ReturnType<ReturnType<typeof createGundamBotPlanner>>,
    GundamBotContext
  >({
    createWorker: () =>
      new Worker(new URL("./bot-decision.worker.ts", import.meta.url), { type: "module" }),
    context: () => ({
      players: staticResources.players,
      catalog: [...staticResources.catalog.entries()],
      setupCards: staticResources.setupCards,
    }),
    fallback: (input, context) => createGundamBotPlanner(context)(input),
  });
  let pending: { cancelDelay: () => void } | null = null;
  const decisionListeners = new Set<BotDecisionSink>();

  const emitDecision = (record: BotDecisionRecord): void => {
    options.onDecision?.(record);
    for (const listener of decisionListeners) listener(record);
  };

  const clearTimer = (): void => {
    timerRevision += 1;
    pending?.cancelDelay();
    pending = null;
    client.cancel();
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const shouldAct = (): boolean => {
    const state = runtime.getState();
    if (disposed || state.ctx.status.gameEnded) return false;
    if (state.ctx.status.activePlayer !== player) return false;
    return !animationGate.isBlocked();
  };

  const submit = (
    preparedCandidates?: ReturnType<ReturnType<typeof createGundamBotPlanner>>,
  ): TakeAutomatedActionWithFallbackResult | undefined => {
    if (!shouldAct()) return undefined;
    const decisionSink =
      options.onDecision || decisionListeners.size > 0 ? emitDecision : undefined;
    const result = takeAutomatedActionWithFallback(runtime, player, strategy, staticResources, {
      maxCandidateAttempts: options.maxCandidateAttempts,
      ...(preparedCandidates ? { preparedCandidates } : {}),
      ...(decisionSink ? { decisionSink } : {}),
    });
    options.onAction?.(result);
    return result;
  };

  const start = (delayMs: number): TakeAutomatedActionWithFallbackResult | undefined => {
    if (!shouldAct() || pending) return;
    const registered = GUNDAM_AUTOMATED_ACTION_STRATEGIES.find(
      (option) => option.strategy === strategy,
    );
    if (typeof Worker === "undefined" || !registered) {
      if (!delayMs) return submit();
      const revision = timerRevision;
      timer = setTimeout(() => {
        if (revision === timerRevision) {
          timer = null;
          submit();
        }
      }, delayMs);
      return;
    }
    const before = runtime.getState();
    const revision = timerRevision;
    let cancelDelay = () => {};
    const delay = new Promise<void>((resolve) => {
      const handle = setTimeout(resolve, delayMs);
      cancelDelay = () => {
        clearTimeout(handle);
        resolve();
      };
    });
    const work = { cancelDelay };
    pending = work;
    const current = () =>
      !disposed && revision === timerRevision && runtime.getState() === before && shouldAct();
    const request: GundamBotInput = {
      state: before,
      player,
      strategyId: registered.id,
      instances: [...staticResources.cardsMaps.instances.entries()],
      definitions: [...staticResources.cardsMaps.definitions.entries()],
    };
    void Promise.all([client.request(request), delay])
      .then(([ranked]) => {
        if (pending !== work || !current() || !ranked) return;
        pending = null;
        submit(ranked);
      })
      .catch((failure: unknown) => {
        if (pending !== work || !current()) return;
        error = failure instanceof Error ? failure.message : String(failure);
        mode = "paused";
        notifyStatus();
      })
      .finally(() => {
        work.cancelDelay();
        if (pending === work) pending = null;
      });
  };
  const schedule = (): void => {
    if (mode !== "auto" || !shouldAct()) return;
    clearTimer();
    start(BOT_SPEED_MS[speed]);
  };

  // React to state updates — in auto mode, any transition that lands
  // us on the bot's turn queues the next action. In step/paused mode,
  // the subscription just keeps us alive but takes no action.
  const unsubscribe = runtime.onStateUpdate(() => {
    clearTimer();
    if (mode === "auto") schedule();
  });
  const unsubscribeAnimationGate = animationGate.subscribe(() => {
    if (mode !== "auto") return;
    if (animationGate.isBlocked()) {
      clearTimer();
      return;
    }
    schedule();
  });

  // Prime once at attach time in case the initial state already has
  // the bot as activePlayer (e.g. skipToMainPhase fixtures where the
  // bot seat goes first).
  if (mode === "auto") schedule();

  return {
    getError: () => error,
    subscribeStatus: (listener) => {
      statusListeners.add(listener);
      return () => statusListeners.delete(listener);
    },
    getMode: () => mode,
    getSpeed: () => speed,
    getStrategyName: () => strategy.name,
    setMode(nextMode: BotPlayMode): void {
      error = null;
      mode = nextMode;
      clearTimer();
      notifyStatus();
      if (nextMode === "auto") {
        schedule();
      } else {
        clearTimer();
      }
    },
    setSpeed(nextSpeed: BotSpeed): void {
      speed = nextSpeed;
      // Re-evaluate both the delay and animation gate. Fast mode intentionally
      // runs through active animations; balanced and slow wait for completion.
      if (mode === "auto") {
        clearTimer();
        schedule();
      }
    },
    setStrategy(nextStrategy: CandidateStrategy): void {
      clearTimer();
      error = null;
      strategy = nextStrategy;
      notifyStatus();
      if (mode === "auto") schedule();
    },
    subscribeDecisions(listener: BotDecisionSink): () => void {
      decisionListeners.add(listener);
      return () => decisionListeners.delete(listener);
    },
    stepOnce(): TakeAutomatedActionWithFallbackResult | undefined {
      return start(0);
    },
    dispose(): void {
      disposed = true;
      clearTimer();
      client.dispose();
      statusListeners.clear();
      unsubscribe();
      unsubscribeAnimationGate();
      decisionListeners.clear();
    },
  };
}
