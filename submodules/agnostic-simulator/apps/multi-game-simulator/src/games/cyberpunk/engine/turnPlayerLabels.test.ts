import { describe, expect, test } from "vite-plus/test";
import type { PlayerId } from "@tcg/cyberpunk-engine";

import type { MoveLogEntry } from "./EngineProvider";
import { DEFAULT_SCENARIO, getScenario } from "./fixtures/scenarios";
import { cyberpunkTurnPlayerLabels } from "./turnPlayerLabels";

describe("cyberpunkTurnPlayerLabels", () => {
  test("uses recorded turn owners and names, including for past turns", () => {
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const moveLogs: MoveLogEntry[] = [
      {
        id: 1,
        side: "opponent",
        log: {
          type: "turnStarted",
          playerId: "p2" as PlayerId,
          turnNumber: 3,
          timestamp: 1783699897205,
        },
      },
    ];
    const label = cyberpunkTurnPlayerLabels(
      matchState,
      moveLogs,
      {
        player: { id: "p1", displayName: "V" },
        opponent: { id: "p2", displayName: "Jackie" },
      },
      "player",
    );

    expect(label(0)).toBeUndefined();
    expect(label(1)).toBe(matchState.G.players.p1?.firstPlayer ? "V" : "Jackie");
    expect(label(3)).toBe("Jackie");
  });
});
