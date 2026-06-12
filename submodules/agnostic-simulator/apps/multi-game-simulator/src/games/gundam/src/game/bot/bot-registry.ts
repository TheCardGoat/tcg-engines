/**
 * Client-only registry mapping fixture names to bot-attach factories.
 * Used by `useClientBot` to re-attach a bot to a reconstructed
 * `MatchRuntime` after SSR hydration.
 *
 * Attachers are async and their underlying implementations
 * (`strategy-bot.ts`, `fixtures/auto-pass.ts`, `fixtures/auto-pass-turn.ts`)
 * are loaded via dynamic `import()`. This keeps bot code off the
 * critical path for the production `/vs-ai` route's initial bundle
 * — the prod path only fetches `strategy-bot.ts` once hydration
 * runs, and auto-pass helpers are only fetched for fixtures that
 * need them. The RR client calls `useClientBot` after the match
 * board has rendered, so the extra roundtrip doesn't block paint.
 */

import type { MatchRuntime, MatchStaticResources } from "@tcg/gundam-engine";

import { DEV_PLAYER_ONE, DEV_PLAYER_TWO } from "../dev-runtime.ts";
import type { DevRuntimeBotHandle } from "../dev-runtime.ts";
import type { SnapshotBotConfig } from "../snapshot.ts";

export interface AttachedBot {
  /** The UI-facing bot handle, if the fixture surfaces one on
   * `dev.bot`. Absent for auto-pass-only fixtures. */
  readonly handle?: DevRuntimeBotHandle;
  /** Detach every subscription the attacher created. Always present,
   * even for auto-pass fixtures whose handle is absent — used by
   * `useClientBot`'s cleanup on unmount / HMR to avoid leaking
   * `runtime.onStateUpdate` listeners or pending setTimeouts. */
  readonly dispose: () => void;
}

/**
 * Optional bag passed from `useClientBot` into the attacher. Only
 * `vs-ai-match` reads anything off this today (strategy id from the
 * snapshot); other attachers ignore it.
 */
export interface BotAttacherArgs {
  readonly botConfig?: SnapshotBotConfig;
}

type BotAttacher = (
  runtime: MatchRuntime,
  staticResources: MatchStaticResources,
  args?: BotAttacherArgs,
) => Promise<AttachedBot>;

const attachStrategy: BotAttacher = async (runtime, staticResources) => {
  const { attachStrategyBot } = await import("./strategy-bot.ts");
  const handle = attachStrategyBot(runtime, staticResources, DEV_PLAYER_TWO);
  return { handle, dispose: () => handle.dispose() };
};

/**
 * `vs-ai-match` variant: consults `args.botConfig.strategy` to pick
 * which engine strategy to plug into the bot. Falls back to
 * `greedy-legal` if the snapshot didn't carry a config (shouldn't
 * happen in the happy path, but defensiveness here saves us from an
 * undefined-strategy crash on a stale snapshot).
 */
const attachVsAiMatch: BotAttacher = async (runtime, staticResources, args) => {
  const [{ attachStrategyBot }, { greedyLegalStrategy, passOnlyStrategy }] = await Promise.all([
    import("./strategy-bot.ts"),
    import("@tcg/gundam-engine"),
  ]);
  const strategyId = args?.botConfig?.strategy ?? "greedy-legal";
  const strategy = strategyId === "pass-only" ? passOnlyStrategy : greedyLegalStrategy;
  const handle = attachStrategyBot(runtime, staticResources, DEV_PLAYER_TWO, { strategy });
  return { handle, dispose: () => handle.dispose() };
};

/**
 * `bot-vs-bot` attacher: a strategy bot per seat. P1 follows the
 * snapshot's `strategy` (defaults to greedy), P2 follows the
 * snapshot's `botConfig.strategy` (defaults to value-ranked). The
 * pairing mirrors the SSR-time default in
 * `fixtures/bot-vs-bot.ts::loadBotVsBot` — produces a visibly
 * different game than either side alone, so the spectator view has
 * something interesting to watch from turn one.
 */
const attachBotVsBot: BotAttacher = async (runtime, staticResources, args) => {
  const [{ attachStrategyBot }, engine] = await Promise.all([
    import("./strategy-bot.ts"),
    import("@tcg/gundam-engine"),
  ]);
  const strategyById = {
    "greedy-legal": engine.greedyLegalStrategy,
    "pass-only": engine.passOnlyStrategy,
    tempo: engine.tempoStrategy,
    "value-ranked": engine.valueRankedStrategy,
  } as const;
  const p1Strategy =
    strategyById[(args?.botConfig?.strategy as keyof typeof strategyById) ?? "greedy-legal"] ??
    engine.greedyLegalStrategy;
  const p2Strategy = engine.valueRankedStrategy;
  const p1Handle = attachStrategyBot(runtime, staticResources, DEV_PLAYER_ONE, {
    strategy: p1Strategy,
  });
  const p2Handle = attachStrategyBot(runtime, staticResources, DEV_PLAYER_TWO, {
    strategy: p2Strategy,
  });
  return {
    handle: p2Handle,
    dispose: () => {
      p1Handle.dispose();
      p2Handle.dispose();
    },
  };
};

const attachAuto: BotAttacher = async (runtime, staticResources) => {
  const { attachAutoPassBot } = await import("../fixtures/auto-pass.ts");
  const unsubscribe = attachAutoPassBot(runtime, staticResources, DEV_PLAYER_TWO);
  return { dispose: unsubscribe };
};

const attachAutoPlusTurn: BotAttacher = async (runtime, staticResources) => {
  const [{ attachAutoPassBot }, { attachAutoPassTurnBot }] = await Promise.all([
    import("../fixtures/auto-pass.ts"),
    import("../fixtures/auto-pass-turn.ts"),
  ]);
  const unsubA = attachAutoPassBot(runtime, staticResources, DEV_PLAYER_TWO);
  const unsubB = attachAutoPassTurnBot(runtime, staticResources, DEV_PLAYER_TWO);
  return {
    dispose: () => {
      unsubA();
      unsubB();
    },
  };
};

export const BOT_ATTACHERS: Readonly<Record<string, BotAttacher>> = {
  // Only `vs-ai-demo` surfaces a strategy bot to the UI (returns on
  // `dev.bot`). Other fixtures' auto-pass bots are wired below so
  // hydrated matches keep their progression behavior. Each entry
  // mirrors exactly the `attachX` calls in the fixture factory.
  "vs-ai-demo": attachStrategy,
  "vs-ai-match": attachVsAiMatch,
  "bot-vs-bot": attachBotVsBot,
  "multi-turn-demo": attachAutoPlusTurn,
  "attack-trigger-buff-demo": attachAuto,
  "attack-trigger-draw-demo": attachAuto,
  "battle-ready-demo": attachAuto,
  "block-step-demo": attachAuto,
  "burst-shield-demo": attachAuto,
  "high-maneuver-demo": attachAuto,
};
