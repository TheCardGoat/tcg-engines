/** Scratch worker for heuristics-ab.ts (not part of the shipped tool). */
import { isMainThread, parentPort, workerData } from "node:worker_threads";
import type { HeuristicsAbConfig, HeuristicsAbProfileOverride } from "./heuristics-ab-options.ts";

if (!isMainThread) {
  const { createTacticalStrategy, runAutoMatch } = await import("@tcg/cyberpunk-engine");
  const { createLegalDeckPool, createStructuredCatalog, deckListFromGenerated } =
    await import("./legal-decks.ts");
  const { bindStrategyToDeck } = await import("./bind-deck-strategy.ts");
  const { createTestPlayers } = await import("./test-catalog.ts");

  const request = workerData as {
    aOff: string[];
    bOff: string[];
    aConfig?: HeuristicsAbConfig;
    bConfig?: HeuristicsAbConfig;
    aPoverride?: HeuristicsAbProfileOverride;
    bPoverride?: HeuristicsAbProfileOverride;
    seed: string;
    aIndex: number;
    bIndex: number;
    aSeat: "p1" | "p2";
  };

  const strategyWith = (off: string[], config: HeuristicsAbConfig = {}) =>
    createTacticalStrategy({
      name: `tactical-ab:${off.join("+")}:${JSON.stringify(config)}`,
      disabledHeuristics: off,
      ...config,
    });

  const pool = createLegalDeckPool("authored-botlab");
  const deckA = pool.decks[request.aIndex]!;
  const deckB = pool.decks[request.bIndex]!;
  const p1 = request.aSeat === "p1" ? deckA : deckB;
  const p2 = request.aSeat === "p1" ? deckB : deckA;
  const { withDeckProfile } = await import("@tcg/cyberpunk-engine");
  const { resolveDeckProfile } = await import("@tcg/cyberpunk-utils");

  const bindWith = (
    strategy: Awaited<ReturnType<typeof strategyWith>>,
    deck: (typeof pool.decks)[number],
    poverride: HeuristicsAbProfileOverride,
  ) => {
    const profile = resolveDeckProfile({
      deckId: deck.id,
      cards: [...deck.legends, ...deck.mainDeck],
    });
    if (!profile) return bindStrategyToDeck(strategy, deck);
    return withDeckProfile(strategy, { ...profile, ...poverride });
  };

  const result = runAutoMatch({
    players: createTestPlayers(),
    decks: [deckListFromGenerated(p1, "p1"), deckListFromGenerated(p2, "p2")],
    strategies: [
      bindWith(
        strategyWith(
          request.aSeat === "p1" ? request.aOff : request.bOff,
          request.aSeat === "p1" ? request.aConfig : request.bConfig,
        ),
        p1,
        request.aSeat === "p1" ? (request.aPoverride ?? {}) : (request.bPoverride ?? {}),
      ),
      bindWith(
        strategyWith(
          request.aSeat === "p1" ? request.bOff : request.aOff,
          request.aSeat === "p1" ? request.bConfig : request.aConfig,
        ),
        p2,
        request.aSeat === "p1" ? (request.bPoverride ?? {}) : (request.aPoverride ?? {}),
      ),
    ],
    catalog: createStructuredCatalog(),
    seed: request.seed,
  });

  const winnerIsA =
    result.winnerId === null ? null : result.winnerId === (request.aSeat === "p1" ? "p1" : "p2");
  parentPort!.postMessage({
    winnerIsA,
    reason: result.reason,
    steps: result.stepCount,
  });
}
