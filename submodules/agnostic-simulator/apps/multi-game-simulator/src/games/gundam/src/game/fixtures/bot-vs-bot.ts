import {
  expandDeck,
  getSafeGundamAutomatedActionStrategyOption,
  type CandidateStrategy,
  type GundamAutomatedActionStrategyId,
} from "@tcg/gundam-engine";

import {
  buildGundamCardCatalog,
  SAMPLE_DECKS,
  type SampleDeckId,
} from "../../data/sample-decks/index.ts";
import { attachStrategyBot, type BotSpeed } from "../bot/strategy-bot.ts";
import {
  createDevRuntime,
  DEV_PLAYER_ONE,
  DEV_PLAYER_TWO,
  type DevRuntime,
} from "../dev-runtime.ts";

export type BotStrategyId = GundamAutomatedActionStrategyId;

export const BOT_VS_BOT_STRATEGIES: Readonly<Record<BotStrategyId, CandidateStrategy>> = {
  "combat-aware": getSafeGundamAutomatedActionStrategyOption("combat-aware").strategy,
  "greedy-legal": getSafeGundamAutomatedActionStrategyOption("greedy-legal").strategy,
  "pass-only": getSafeGundamAutomatedActionStrategyOption("pass-only").strategy,
  strategic: getSafeGundamAutomatedActionStrategyOption("strategic").strategy,
  tempo: getSafeGundamAutomatedActionStrategyOption("tempo").strategy,
  "value-ranked": getSafeGundamAutomatedActionStrategyOption("value-ranked").strategy,
};

export interface BotVsBotArgs {
  readonly p1DeckId?: SampleDeckId;
  readonly p2DeckId?: SampleDeckId;
  readonly p1Strategy?: BotStrategyId;
  readonly p2Strategy?: BotStrategyId;
  readonly botSpeed?: BotSpeed;
  readonly seed?: string;
}

let cachedCatalog: ReturnType<typeof buildGundamCardCatalog> | null = null;
function getCatalog(): ReturnType<typeof buildGundamCardCatalog> {
  if (cachedCatalog === null) cachedCatalog = buildGundamCardCatalog();
  return cachedCatalog;
}

/**
 * Fixture factory for the `bot-vs-bot` route. Seeds both seats with
 * sample decks (defaults to `ef-starter` on both sides) and attaches
 * a strategy bot to each, so the runtime drives itself from setup
 * through game-end with zero human interaction.
 *
 * SSR caveat (same as `vs-ai-match`): `attachStrategyBot` is a no-op
 * under SSR — the bot subscribes to `runtime.onStateUpdate` and
 * schedules `setTimeout` calls, both of which would leak past the
 * request. The client-side `useClientBot` re-attaches both bots
 * post-hydration via the `bot-vs-bot` entry in
 * `bot-registry.ts::BOT_ATTACHERS`. The SSR snapshot therefore
 * captures a fresh, bot-less start-of-game state; the moment the
 * client mounts, both bots come online and the match takes off.
 *
 * Default strategy pairing — `greedy-legal` vs `value-ranked` —
 * produces a visibly different game than either side alone (greedy
 * tends to over-commit; value-ranked prefers tempo trades), so the
 * spectator view has something interesting to watch from turn one.
 */
export function loadBotVsBot(args: BotVsBotArgs = {}): DevRuntime {
  const p1DeckId = args.p1DeckId ?? "ef-starter";
  const p2DeckId = args.p2DeckId ?? "ef-starter";
  const p1Strategy = args.p1Strategy ?? "greedy-legal";
  const p2Strategy = args.p2Strategy ?? "value-ranked";

  const catalog = getCatalog();
  const p1Expanded = expandDeck(SAMPLE_DECKS[p1DeckId], { catalog });
  const p2Expanded = expandDeck(SAMPLE_DECKS[p2DeckId], { catalog });

  const dev = createDevRuntime({
    seed: args.seed ?? "bot-vs-bot",
    skipToMainPhase: false,
    p1: { deck: p1Expanded.deck, resourceDeck: p1Expanded.resourceDeck },
    p2: { deck: p2Expanded.deck, resourceDeck: p2Expanded.resourceDeck },
  });

  // Both attaches are SSR no-ops; the client re-runs them through
  // BOT_ATTACHERS["bot-vs-bot"] in bot-registry.ts. We still call
  // them here so the dev-runtime shape stays consistent and
  // playwright specs that drive the engine directly under JSDOM
  // (not SSR) see both bots wired up.
  attachStrategyBot(dev.runtime, dev.staticResources, DEV_PLAYER_ONE, {
    strategy: BOT_VS_BOT_STRATEGIES[p1Strategy],
    ...(args.botSpeed ? { speed: args.botSpeed } : {}),
  });
  const p2Bot = attachStrategyBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO, {
    strategy: BOT_VS_BOT_STRATEGIES[p2Strategy],
    ...(args.botSpeed ? { speed: args.botSpeed } : {}),
  });

  // Surface the P2 handle on `dev.bot` for any UI control panel
  // bindings. The P1 handle isn't surfaced — UI bot controls are
  // single-seat and there's no compelling UX for swapping P1's
  // strategy mid-game in a pure spectator view.
  return { ...dev, bot: p2Bot };
}
