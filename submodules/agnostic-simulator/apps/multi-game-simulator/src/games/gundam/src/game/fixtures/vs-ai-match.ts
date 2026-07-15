import { createMatchFromDecks, type OpponentStrategyId } from "../match-factory.ts";
import {
  SAMPLE_DECKS,
  buildGundamCardCatalog,
  type SampleDeckId,
} from "../../data/sample-decks/index.ts";
import type { DevRuntime } from "../dev-runtime.ts";

export interface VsAiMatchArgs {
  readonly playerDeckId: SampleDeckId;
  readonly opponentDeckId: SampleDeckId;
  readonly opponentStrategy: OpponentStrategyId;
  readonly seed?: string;
}

/**
 * Built lazily on first call. Walking the full
 * `@tcg/gundam-cards` namespace is cheap (~hundreds of entries) but
 * the catalog never changes within a process lifetime, so caching is
 * a straightforward win.
 */
let cachedCatalog: ReturnType<typeof buildGundamCardCatalog> | null = null;
function getCatalog(): ReturnType<typeof buildGundamCardCatalog> {
  if (cachedCatalog === null) cachedCatalog = buildGundamCardCatalog();
  return cachedCatalog;
}

/**
 * Fixture factory for the parameterised `"vs-ai-match"` entry. Unlike
 * the hand-seeded `vs-ai-demo`, this boots a real start-of-game
 * state from two `DeckList` references + a strategy id pulled off
 * the loader's URL params.
 *
 * Returns a `DevRuntime` in the same shape as every other fixture so
 * the existing SSR / snapshot / hydration pipeline works unchanged.
 * The opponent bot is attached to `player_two`; under SSR the
 * attacher is a no-op (see `strategy-bot.ts`), and the client
 * re-attaches post-hydration via `bot-registry.ts`.
 */
export function loadVsAiMatch(args: VsAiMatchArgs): DevRuntime {
  const playerDeck = SAMPLE_DECKS[args.playerDeckId];
  const opponentDeck = SAMPLE_DECKS[args.opponentDeckId];

  return createMatchFromDecks({
    playerDeck,
    opponentDeck,
    opponentStrategy: args.opponentStrategy,
    catalog: getCatalog(),
    seed: args.seed,
  });
}
