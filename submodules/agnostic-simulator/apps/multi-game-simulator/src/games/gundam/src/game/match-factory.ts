import {
  expandDeck,
  greedyLegalStrategy,
  passOnlyStrategy,
  tempoStrategy,
  type CandidateStrategy,
  type DeckList,
} from "@tcg/gundam-engine";
import type { Card } from "@tcg/gundam-types";

import { attachStrategyBot } from "./bot/strategy-bot.ts";
import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "./dev-runtime.ts";

/**
 * Identifier for the opponent strategy. Kept as a string union rather
 * than a `CandidateStrategy` instance so the choice can round-trip
 * through URL params and the SSR snapshot without serializing
 * behaviour. The factory resolves the id to the concrete engine
 * strategy at match-construction time.
 */
export type OpponentStrategyId = "greedy-legal" | "pass-only" | "tempo";

const STRATEGIES: Readonly<Record<OpponentStrategyId, CandidateStrategy>> = {
  "greedy-legal": greedyLegalStrategy,
  "pass-only": passOnlyStrategy,
  tempo: tempoStrategy,
};

export interface CreateMatchFromDecksOptions {
  readonly playerDeck: DeckList;
  readonly opponentDeck: DeckList;
  readonly opponentStrategy: OpponentStrategyId;
  readonly catalog: ReadonlyMap<string, Card> | Record<string, Card>;
  /** Deterministic shuffle seed. Defaults to "vs-ai". */
  readonly seed?: string;
}

/**
 * Build a `DevRuntime` seeded with two real `DeckList` decks and a
 * bot attached to the opponent seat. The engine's `mulliganOnEnter`
 * shuffles and draws the opening hand during setup, so the input
 * order of `DeckList.cards` does not bias play.
 *
 * Unlike `loadVsAiDemo`, we do **not** `skipToMainPhase`. The runtime
 * lands in `choose-first-player` and the bot drives the opponent
 * seat through setup the same way it drives main phase — this is the
 * "real match from turn zero" entry point.
 *
 * Bot attachment is client-only: `attachStrategyBot` internally
 * no-ops under SSR (see `strategy-bot.ts:118`). For the server-side
 * snapshot path the caller should not rely on `.bot` being wired;
 * the real strategy bot re-attaches post-hydration via the bot
 * registry.
 */
export function createMatchFromDecks(options: CreateMatchFromDecksOptions): DevRuntime {
  const playerExpanded = expandDeck(options.playerDeck, { catalog: options.catalog });
  const opponentExpanded = expandDeck(options.opponentDeck, { catalog: options.catalog });

  const dev = createDevRuntime({
    seed: options.seed ?? "vs-ai",
    skipToMainPhase: false,
    p1: {
      deck: playerExpanded.deck,
      resourceDeck: playerExpanded.resourceDeck,
    },
    p2: {
      deck: opponentExpanded.deck,
      resourceDeck: opponentExpanded.resourceDeck,
    },
  });

  const strategy = STRATEGIES[options.opponentStrategy];
  const bot = attachStrategyBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO, { strategy });

  return { ...dev, bot };
}
