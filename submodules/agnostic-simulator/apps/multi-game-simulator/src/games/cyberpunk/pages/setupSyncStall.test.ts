import { describe, expect, it } from "vitest";

import { isSetupStateStale, type SetupStateProbe } from "./setupSyncStall";

function probe(overrides?: {
  gameEnded?: boolean;
  gamePhase?: string;
  pendingChoice?: unknown;
  hand?: unknown[];
}): SetupStateProbe {
  return {
    G: {
      gameEnded: overrides?.gameEnded ?? false,
      gamePhase: overrides?.gamePhase ?? "setup",
      turnMetadata: { pendingChoice: overrides?.pendingChoice ?? null },
      players: {
        p1: { zones: { hand: overrides?.hand ?? [] } },
        p2: { zones: { hand: overrides?.hand ?? [] } },
      },
    },
  };
}

describe("isSetupStateStale", () => {
  it("flags the pre-deal setup state: phase setup, empty hand, no pending choice", () => {
    expect(isSetupStateStale(probe(), "player")).toBe(true);
    expect(isSetupStateStale(probe(), "opponent")).toBe(true);
  });

  it("does not flag once the opening hands are dealt", () => {
    const state = probe({ hand: ["ci_1", "ci_2", "ci_3", "ci_4", "ci_5", "ci_6"] });
    expect(isSetupStateStale(state, "player")).toBe(false);
  });

  it("does not flag while a setup choice (first player / mulligan) is pending", () => {
    const state = probe({
      hand: ["ci_1", "ci_2", "ci_3", "ci_4", "ci_5", "ci_6"],
      pendingChoice: { type: "chooseFirstPlayer" },
    });
    expect(isSetupStateStale(state, "player")).toBe(false);
  });

  it("does not flag outside the setup phase", () => {
    const state = probe({ gamePhase: "main" });
    expect(isSetupStateStale(state, "player")).toBe(false);
  });

  it("does not flag after the game has ended", () => {
    const state = probe({ gameEnded: true });
    expect(isSetupStateStale(state, "player")).toBe(false);
  });
});
