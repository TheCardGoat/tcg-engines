import { describe, expect, test } from "vitest";

import { DEFAULT_SCENARIO, P1, P2, getScenario } from "../fixtures/scenarios";
import {
  createLiveMatchViewerEngine,
  isFilteredMatchView,
  viewerProjectionToMatchState,
} from "./liveState";

describe("Cyberpunk live viewer projections", () => {
  test("hydrates the renderer from a viewer-safe server projection", () => {
    const source = getScenario(DEFAULT_SCENARIO).build();
    const projection = source.getFilteredView(P1);
    const expectedOwnHand = projection.players[String(P1)]?.zones.hand;
    const expectedRivalHand = projection.players[String(P2)]?.zones.hand;

    expect(isFilteredMatchView(projection)).toBe(true);
    expect(Array.isArray(expectedOwnHand)).toBe(true);
    expect(typeof expectedRivalHand).toBe("number");

    const state = viewerProjectionToMatchState(projection, "match-projection-test");
    expect(state.ctx.matchId).toBe("match-projection-test");
    expect(state.ctx.stateID).toBe(projection.stateID);
    expect(state.G.players[String(P1)]?.zones.hand).toHaveLength(
      Array.isArray(expectedOwnHand) ? expectedOwnHand.length : 0,
    );
    expect(state.G.players[String(P2)]?.zones.hand).toHaveLength(
      typeof expectedRivalHand === "number" ? expectedRivalHand : 0,
    );

    const viewer = createLiveMatchViewerEngine(projection, "match-projection-test");
    expect(viewer.getState().ctx.stateID).toBe(projection.stateID);
    expect(viewer.getState().G.turnMetadata.activePlayerId).toBe(projection.activePlayerId);
  });
});
