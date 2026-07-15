import { describe, expect, it } from "vite-plus/test";

import { buildGundamSimulatorLiveMatchPath } from "./Practice.page.tsx";

describe("Gundam practice route", () => {
  it("redirects quick matches to the simulator live-match route", () => {
    expect(buildGundamSimulatorLiveMatchPath("match 1", "game/1", "playerId=p1")).toBe(
      "/gundam/simulator/matches/match%201/games/game%2F1?playerId=p1",
    );
  });
});
