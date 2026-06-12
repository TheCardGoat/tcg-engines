import { describe, expect, it } from "bun:test";
import {
  CANONICAL_PLAYER_ONE,
  CANONICAL_PLAYER_TWO,
  LorcanaMultiplayerTestEngine,
} from "./lorcana-multiplayer-test-engine";
import { buildFixtureSeedBundle } from "./lorcana-multiplayer-test-engine-helpers";

describe("LorcanaMultiplayerTestEngine", () => {
  it("applies fixtures from a cloned authoritative state when runtime containers are non-extensible", async () => {
    const playerOneState = { hand: 2, lore: 3 };
    const playerTwoState = { discard: 1, lore: 4 };
    const bundle = buildFixtureSeedBundle(playerOneState, playerTwoState);
    const testEngine = await LorcanaMultiplayerTestEngine.createEmpty({
      staticResources: bundle.staticResources,
    });
    const runtimeState = testEngine.getServerEngine().getRuntime().getState();

    Object.preventExtensions(runtimeState.ctx.zones.public.zoneSummaries);
    Object.preventExtensions(runtimeState.ctx.zones.private.zoneCards);
    Object.preventExtensions(runtimeState.ctx.zones.private.cardIndex);
    Object.preventExtensions(runtimeState.ctx.zones.private.cardMeta);
    Object.preventExtensions(runtimeState.G.lore);

    expect(() =>
      testEngine.applyFixtureState(playerOneState, playerTwoState, {}, bundle),
    ).not.toThrow();

    const state = testEngine.getAuthoritativeState();
    expect(state.ctx.zones.private.zoneCards["hand:player_one"]).toHaveLength(2);
    expect(state.ctx.zones.private.zoneCards["discard:player_two"]).toHaveLength(1);
    expect(state.G.lore[CANONICAL_PLAYER_ONE as keyof typeof state.G.lore]).toBe(3);
    expect(state.G.lore[CANONICAL_PLAYER_TWO as keyof typeof state.G.lore]).toBe(4);
  });
});
