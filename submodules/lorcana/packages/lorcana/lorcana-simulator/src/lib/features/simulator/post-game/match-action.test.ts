import { describe, expect, it } from "bun:test";
import type { MatchNavigationContext } from "@/features/simulator/model/contracts.js";
import { resolveMatchCompletionFailed, resolvePostGameMatchAction } from "./match-action.js";

function makeContext(overrides: Partial<MatchNavigationContext> = {}): MatchNavigationContext {
  return {
    nextGameId: undefined,
    matchCompleted: false,
    format: "best_of_3",
    player1Score: 1,
    player2Score: 0,
    gameIndex: 1,
    navigating: false,
    ...overrides,
  };
}

describe("post-game match action", () => {
  it("waits while series advancement is still pending", () => {
    expect(resolvePostGameMatchAction(makeContext(), true)).toBe("finalizing");
  });

  it("lets the player leave after finalization fails", () => {
    expect(resolvePostGameMatchAction(makeContext({ completionFailed: true }), true)).toBe(
      "return",
    );
  });

  it("opens the next game after the server allocates it", () => {
    expect(resolvePostGameMatchAction(makeContext({ nextGameId: "game-2" }), true)).toBe(
      "next-game",
    );
  });
});

describe("match completion failure reconciliation", () => {
  it("preserves a failure across an in-progress snapshot for the same game", () => {
    expect(resolveMatchCompletionFailed(true, { matchCompleted: false })).toBe(true);
  });

  it("clears a failure once the next game is allocated", () => {
    expect(
      resolveMatchCompletionFailed(true, { matchCompleted: false, nextGameId: "game-2" }),
    ).toBe(false);
  });

  it("clears a failure once the match is completed", () => {
    expect(resolveMatchCompletionFailed(true, { matchCompleted: true })).toBe(false);
  });

  it("keeps an ordinary in-progress snapshot non-failing", () => {
    expect(resolveMatchCompletionFailed(false, { matchCompleted: false })).toBe(false);
  });
});
