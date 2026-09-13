import { describe, expect, it } from "vitest";

import { boltyn } from "../../cards/src/cards/heroes/boltyn.ts";
import { dash } from "../../cards/src/cards/heroes/dash.ts";
import { rhinar } from "../../cards/src/cards/heroes/rhinar.ts";
import { tuffnut } from "../../cards/src/cards/heroes/tuffnut.ts";
import { FabTestEngine } from "./testing/test-engine.ts";
import { projectFabViewerState, type FabViewer } from "./view.ts";

const VIEWERS = [
  { role: "player", actorId: "player-1" },
  { role: "player", actorId: "player-2" },
  { role: "spectator" },
  { role: "replay" },
] as const satisfies readonly FabViewer[];

describe("viewer hero signals", () => {
  it("projects Tuffnut cheers and boos independently while Rhinar exposes a count", () => {
    const game = FabTestEngine.start(
      { hero: tuffnut, hand: [], deck: 4 },
      { hero: rhinar, hand: [], deck: 4 },
    );
    const state = structuredClone(game.getState());
    const tuffnutId = state.playerIds[0]!;
    const rhinarId = state.playerIds[1]!;
    state.players[tuffnutId]!.history.turn.crowdCheered = true;
    state.players[tuffnutId]!.history.turn.crowdBooed = true;
    state.players[rhinarId]!.history.turn.intimidatesThisTurn = 3;

    for (const viewer of VIEWERS) {
      const projected = projectFabViewerState(state, viewer);
      expect(projected.players[tuffnutId]!.heroSignals).toEqual([
        { kind: "flag", id: "cheered", duration: "this-turn" },
        { kind: "flag", id: "booed", duration: "this-turn" },
      ]);
      expect(projected.players[rhinarId]!.heroSignals).toEqual([
        { kind: "count", id: "intimidate", value: 3, duration: "this-turn" },
      ]);
    }
  });

  it("projects Boltyn charged active-only and never assigns hero-native signals to Dash", () => {
    const game = FabTestEngine.start(
      { hero: boltyn, hand: [], deck: 4 },
      { hero: dash, hand: [], deck: 4 },
    );
    const state = structuredClone(game.getState());
    const boltynId = state.playerIds[0]!;
    const dashId = state.playerIds[1]!;

    expect(
      projectFabViewerState(state, { role: "spectator" }).players[boltynId]!.heroSignals,
    ).toEqual([]);
    state.players[boltynId]!.history.turn.charged = true;

    for (const viewer of VIEWERS) {
      const projected = projectFabViewerState(state, viewer);
      expect(projected.players[boltynId]!.heroSignals).toEqual([
        { kind: "flag", id: "charged", duration: "this-turn" },
      ]);
      expect(projected.players[dashId]!.heroSignals).toEqual([]);
    }
  });
});
