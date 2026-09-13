import {
  persistGrandArchivePracticeSession,
  restoreGrandArchivePracticeSession,
} from "./practice-session";
import { describe, expect, it } from "vite-plus/test";

import {
  createGrandArchivePracticeEngineFromSetup,
  defaultGrandArchivePracticeDeck,
  practiceSetupFromSearch,
} from "./practice-setup";

describe("Grand Archive practice deck setup", () => {
  it("round-trips the real catalog smoke deck through text resolution and engine validation", () => {
    const server = createGrandArchivePracticeEngineFromSetup({
      deck: defaultGrandArchivePracticeDeck(),
      randomSeed: 20260826,
    });

    expect(server.runtime.state.status).toBe("pregame");
    expect(server.runtime.state.turnOrder).toEqual(["p1", "p2"]);
    const firstPlayerId = server.runtime.state.turnOrder[0]!;
    expect(server.runtime.state.zones[firstPlayerId]["main-deck"]).toHaveLength(60);
  });

  it("rejects malformed text before creating a match", () => {
    expect(() =>
      createGrandArchivePracticeEngineFromSetup({
        deck: {
          ...defaultGrandArchivePracticeDeck(),
          mainDeck: "not a deck line",
        },
        randomSeed: 1,
      }),
    ).toThrow("Invalid Grand Archive deck line");
  });
});

describe("matchmaking starter launch", () => {
  it.each(["lorraine-pnp-1-4", "rai-pnp-1-4"])(
    "starts %s against the other starter with separate deck zones",
    (playerDeck) => {
      const opponentDeck = playerDeck === "lorraine-pnp-1-4" ? "rai-pnp-1-4" : "lorraine-pnp-1-4";
      const launch = practiceSetupFromSearch(
        `?playerDeck=${playerDeck}&opponentDeck=${opponentDeck}&strategy=value-extract`,
      )!;
      expect(launch.strategyId).toBe("value-extract");
      const state = launch.server.runtime.state;
      expect(state.status).toBe("pregame");
      for (const playerId of state.turnOrder) {
        expect(state.zones[playerId]["main-deck"]).toHaveLength(60);
        expect(state.zones[playerId]["material-deck"]).toHaveLength(12);
      }
      const materials = state.turnOrder.map((id) =>
        state.zones[id]["material-deck"].map((objectId) => state.objects[objectId]!.definitionId),
      );
      expect(materials[0]).not.toEqual(materials[1]);
    },
  );
  it("supports mirroring and rejects incomplete or unknown launches", () => {
    expect(
      practiceSetupFromSearch(
        "?playerDeck=rai-pnp-1-4&opponentDeck=rai-pnp-1-4&strategy=champion-profile",
      )?.strategyId,
    ).toBe("champion-profile");
    expect(practiceSetupFromSearch("")).toBeNull();
    expect(() => practiceSetupFromSearch("?playerDeck=missing")).toThrow("Invalid practice setup");
    expect(() =>
      practiceSetupFromSearch(
        "?playerDeck=rai-pnp-1-4&opponentDeck=rai-pnp-1-4&strategy=pass-only",
      ),
    ).toThrow("Invalid practice setup");
  });
});

it("restores the chosen starter matchup and strategy from its saved journal", () => {
  const launch = practiceSetupFromSearch(
    "?playerDeck=lorraine-pnp-1-4&opponentDeck=rai-pnp-1-4&strategy=value-extract",
  )!;
  const storage = window.sessionStorage;
  storage.clear();
  expect(
    persistGrandArchivePracticeSession(launch.server, launch.strategyId, "step", [], storage),
  ).toBe(true);
  const restored = restoreGrandArchivePracticeSession(
    () =>
      createGrandArchivePracticeEngineFromSetup({
        deck: defaultGrandArchivePracticeDeck(),
        randomSeed: 1,
      }),
    storage,
  );
  expect(restored.kind).toBe("restored");
  if (restored.kind !== "restored") throw new Error("Starter session did not restore");
  expect(restored.strategyId).toBe("value-extract");
  expect(restored.server.runtime.state).toEqual(launch.server.runtime.state);
  storage.clear();
});
