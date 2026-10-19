import { expect, it } from "vite-plus/test";
import { alphaClashPracticeDecks } from "@tcg/alpha-clash-server-adapter/practice";
import { createAlphaClashPracticeEngine } from "./practice-setup";

// Exercise the actual browser setup/admission path and live adapter, rather
// than constructing a native state that can bypass the released card pool.
it.each(
  alphaClashPracticeDecks.map((deck, index) => ({
    player: deck.id,
    opponent: alphaClashPracticeDecks[(index + 1) % alphaClashPracticeDecks.length].id,
  })),
)(
  "finishes local practice: $player versus $opponent",
  async ({ player, opponent }) => {
    const engine = await createAlphaClashPracticeEngine({
      playerDeckId: player,
      opponentDeckId: opponent,
      strategyId: "meta-v1",
      seed: "release-browser-2026-10-15",
    });
    let moves = 0;
    while (!engine.hasGameEnded() && moves < 1200) {
      const revision = engine.getStateID();
      const result = engine.takeAutomatedAction(
        { strategyId: "meta-v1" },
        { gameId: "local-practice-acceptance", sourceAuthority: "server" },
      );
      expect(result.finalResult.success, JSON.stringify(result)).toBe(true);
      expect(engine.getStateID()).toBeGreaterThan(revision);
      moves++;
    }
    expect(moves).toBeGreaterThan(1);
    expect(engine.hasGameEnded()).toBe(true);
    expect(engine.state.phase).toMatchObject({ name: "complete", reason: "contenderDefeated" });
  },
  30_000,
);
