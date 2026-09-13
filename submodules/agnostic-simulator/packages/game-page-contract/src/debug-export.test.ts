import { describe, expect, it } from "vitest";

import {
  SimulatorDebugExportV1Schema,
  stringifySimulatorDebugExport,
  type SimulatorDebugExportV1,
} from "./debug-export.js";

const fixture: SimulatorDebugExportV1 = {
  schemaVersion: 1,
  exportedAt: "2026-08-31T10:00:00.000Z",
  environment: "development",
  releaseSha: "abc123",
  game: { slug: "gundam", gameId: "game-1", matchId: "match-1", seed: "seed-1" },
  range: {
    startMove: 2,
    endMove: 3,
    startStateVersion: 2,
    endStateVersion: 3,
    totalMoves: 4,
  },
  originalInitialState: { turn: 0 },
  stateBeforeRange: { turn: 1 },
  moves: [
    {
      index: 2,
      stateVersion: 2,
      turnNumber: 1,
      actorId: "player-1",
      moveId: "play-card",
      commandId: "command-2",
      input: { cardId: "card-1" },
      timestamp: 1_000,
    },
    {
      index: 3,
      stateVersion: 3,
      turnNumber: 1,
      actorId: "player-2",
      moveId: "pass",
      timestamp: 1_100,
    },
  ],
  domainEvents: [
    {
      stateVersion: 2,
      commandId: "command-2",
      timestamp: 1_001,
      event: { type: "card-played", cardId: "card-1" },
    },
  ],
  warnings: [],
};

describe("SimulatorDebugExportV1Schema", () => {
  it("round-trips a JSON-safe export", () => {
    expect(SimulatorDebugExportV1Schema.parse(fixture)).toEqual(fixture);
    expect(JSON.parse(stringifySimulatorDebugExport(fixture))).toEqual(fixture);
  });

  it("rejects invalid versions and ranges", () => {
    expect(() => SimulatorDebugExportV1Schema.parse({ ...fixture, schemaVersion: 2 })).toThrow();
    expect(() =>
      SimulatorDebugExportV1Schema.parse({
        ...fixture,
        range: { ...fixture.range, startMove: 4, endMove: 3 },
      }),
    ).toThrow();
    expect(() =>
      SimulatorDebugExportV1Schema.parse({
        ...fixture,
        range: { ...fixture.range, endMove: 5 },
      }),
    ).toThrow();
  });

  it("rejects non-JSON values", () => {
    expect(() =>
      SimulatorDebugExportV1Schema.parse({ ...fixture, originalInitialState: undefined }),
    ).toThrow();
  });
});
