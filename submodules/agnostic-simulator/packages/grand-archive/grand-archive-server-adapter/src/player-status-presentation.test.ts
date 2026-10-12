import { describe, expect, it } from "vitest";
import { spiritOfWind } from "@tcg/grand-archive-cards";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import { projectGrandArchiveViewerState } from "@tcg/grand-archive-engine/simulator";
import { projectGrandArchiveSimulator, projectGrandArchiveViewerSimulator } from "./projection.ts";

it("keeps public player properties and mastery counters in both projection routes", () => {
  const engine = GrandArchiveTestEngine.startFixture({
    playerOne: { id: "p1", champion: spiritOfWind },
    playerTwo: { id: "p2", champion: spiritOfWind },
  });
  const p1 = grandArchivePlayerId("p1");
  const state = {
    ...engine.state,
    players: {
      ...engine.state.players,
      [p1]: {
        ...engine.state.players[p1]!,
        states: {
          agility: true,
          "crowds-favor": true,
          "shifting-currents": "north",
          empower: 2,
          "expired-property": false,
        },
        mastery: { name: "Shifting Currents", timestamp: 1, counters: { "named:wind": 3 } },
      },
    },
  };
  for (const viewer of state.turnOrder) {
    const direct = projectGrandArchiveSimulator(engine.program, state, viewer).table.seats.find(
      (seat) => seat.id === p1,
    )!.activeEffects;
    const serialized = projectGrandArchiveViewerSimulator(
      projectGrandArchiveViewerState(engine.program, state, viewer),
    ).table.seats.find((seat) => seat.id === p1)!.activeEffects;
    expect(direct).toEqual(serialized);
    expect(direct?.map((effect) => effect.label)).toEqual([
      "Agility",
      "Crowd’s Favor",
      "Shifting Currents: north",
      "Empower: 2",
      "Shifting Currents",
    ]);
    expect(direct?.find((effect) => effect.kind === "mastery")?.detail).toBe(
      "Shifting Currents · Wind: 3",
    );
  }
});
