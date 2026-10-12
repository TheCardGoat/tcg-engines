import { describe, expect, test } from "vite-plus/test";
import { createAlphaClashVisualFixture } from "./visual-fixtures";
import { parseProjectedState } from "./pages/LiveMatch.page";
import { alphaClashResultCopy } from "./post-game-result";

describe("Alpha Clash terminal projection", () => {
  test("preserves a native failed-draw result for both hosted seats", () => {
    const engine = createAlphaClashVisualFixture("finish-deckout");
    expect(engine.hasGameEnded()).toBe(false);
    expect(
      engine.dispatch("endTurn", "human", {}, { gameId: "endgame", sourceAuthority: "server" })
        .success,
    ).toBe(true);
    for (const actorId of ["human", "bot"]) {
      const state = parseProjectedState(engine.getViewerState({ role: "player", actorId }));
      expect(state?.result).toEqual({ winner: "player-one", reason: "decked" });
      expect(state?.turnNumber).toBe(92);
      expect(state?.players["player-two"].health).toBe(30);
    }
  });

  test.each(["human", "bot"])("preserves a native concession from %s", (actorId) => {
    const engine = createAlphaClashVisualFixture("finish-lethal");
    expect(
      engine.dispatch("concede", actorId, {}, { gameId: "endgame", sourceAuthority: "server" })
        .success,
    ).toBe(true);
    const state = parseProjectedState(engine.getViewerState({ role: "player", actorId }));
    expect(state?.result).toEqual({
      winner: actorId === "human" ? "player-two" : "player-one",
      reason: "concede",
    });
  });

  test("incomplete terminal facts stop the game without inventing a winner", () => {
    const engine = createAlphaClashVisualFixture("finish-deckout");
    const state = parseProjectedState({
      ...engine.getViewerState({ role: "player", actorId: "human" }),
      phase: { name: "complete", winner: "unknown", reason: "future" },
    });
    expect(state?.phaseName).toBe("complete");
    expect(state?.result).toBeUndefined();
    expect(alphaClashResultCopy(state?.result, "player-one").title).toBe("Game complete");
  });

  test("hot-seat results do not depend on the camera seat", () => {
    const result = { winner: "player-two", reason: "concede" } as const;
    expect(alphaClashResultCopy(result, "player-one", true)).toEqual(
      alphaClashResultCopy(result, "player-two", true),
    );
    expect(alphaClashResultCopy(result, "player-one", true).title).toBe("Player 2 wins");
    expect(alphaClashResultCopy(result, "player-one").reason).toBe("You conceded");
    expect(alphaClashResultCopy(result, "player-two").reason).toBe("Opponent conceded");
  });
});
