import {
  asPlayerId,
  greedyLegalStrategy,
  takeAutomatedActionWithFallback,
  type BotDecisionSink,
  type CandidateStrategy,
  type MatchRuntime,
  type MatchStaticResources,
  type PlayerId,
  type TakeAutomatedActionWithFallbackResult,
} from "@tcg/gundam-engine";

/**
 * Bot play speed presets — the delay between an opportunity to act and
 * the actual submission. Values line up with Lorcana's speed buckets so
 * the UX feels familiar.
 *
 *   - fast      — 150ms: no artificial pause, feels snappy in dev loops
 *   - balanced  — 500ms: visible "thinking", human can read the last move
 *   - slow      — 1200ms: deliberate pacing for showing off / recording
 */
export const BOT_SPEED_MS = {
  fast: 150,
  balanced: 500,
  slow: 1200,
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
      getMode: () => "paused",
      getSpeed: () => "balanced",
      getStrategyName: () => options.strategy?.name ?? "noop",
      setMode: () => {},
      setSpeed: () => {},
      setStrategy: () => {},
      stepOnce: () => undefined,
      dispose: () => {},
    };
  }

  const player = asPlayerId(playerName) as PlayerId;
  let strategy = options.strategy ?? greedyLegalStrategy;
  let speed: BotSpeed = options.speed ?? "balanced";
  let mode: BotPlayMode = options.playMode ?? "auto";
  let timer: ReturnType<typeof setTimeout> | null = null;
  let timerRevision = 0;

  const clearTimer = (): void => {
    timerRevision += 1;
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const shouldAct = (): boolean => {
    const state = runtime.getState();
    if (state.ctx.status.gameEnded) return false;
    return state.ctx.status.activePlayer === player;
  };

  const submit = (): TakeAutomatedActionWithFallbackResult | undefined => {
    if (!shouldAct()) return undefined;
    const result = takeAutomatedActionWithFallback(runtime, player, strategy, staticResources, {
      maxCandidateAttempts: options.maxCandidateAttempts,
      ...(options.onDecision ? { decisionSink: options.onDecision } : {}),
    });
    options.onAction?.(result);
    return result;
  };

  const schedule = (): void => {
    if (mode !== "auto") return;
    if (!shouldAct()) return;

    clearTimer();
    const revision = ++timerRevision;
    const delay = BOT_SPEED_MS[speed];
    timer = setTimeout(() => {
      // Stale-timer guard: another schedule/clear call may have fired
      // between `setTimeout` and this callback. If so, bail out — the
      // newer revision will own the next submit.
      if (revision !== timerRevision) return;
      timer = null;
      // State may have moved since scheduling (e.g. viewer took an
      // action). Re-check whether it's still the bot's turn; submit
      // returns undefined if not.
      submit();
    }, delay);
  };

  // React to state updates — in auto mode, any transition that lands
  // us on the bot's turn queues the next action. In step/paused mode,
  // the subscription just keeps us alive but takes no action.
  const unsubscribe = runtime.onStateUpdate(() => {
    if (mode === "auto") schedule();
  });

  // Prime once at attach time in case the initial state already has
  // the bot as activePlayer (e.g. skipToMainPhase fixtures where the
  // bot seat goes first).
  if (mode === "auto") schedule();

  return {
    getMode: () => mode,
    getSpeed: () => speed,
    getStrategyName: () => strategy.name,
    setMode(nextMode: BotPlayMode): void {
      mode = nextMode;
      if (nextMode === "auto") {
        schedule();
      } else {
        clearTimer();
      }
    },
    setSpeed(nextSpeed: BotSpeed): void {
      speed = nextSpeed;
      // In auto mode, reschedule so the new speed takes effect at the
      // next tick rather than waiting out the old one.
      if (mode === "auto" && timer !== null) {
        clearTimer();
        schedule();
      }
    },
    setStrategy(nextStrategy: CandidateStrategy): void {
      strategy = nextStrategy;
    },
    stepOnce(): TakeAutomatedActionWithFallbackResult | undefined {
      return submit();
    },
    dispose(): void {
      clearTimer();
      unsubscribe();
    },
  };
}
