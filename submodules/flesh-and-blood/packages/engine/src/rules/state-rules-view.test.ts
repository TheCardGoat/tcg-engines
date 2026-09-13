import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "./fixtures.ts";
import {
  buildFabDesiredRulesView,
  buildFabRulesView,
  invalidateFabRulesViews,
} from "./state-rules-view.ts";

describe("FAB rules-query view cache", () => {
  it("memoizes each evaluation mode for a state generation and invalidates explicitly", () => {
    const state = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
    ).getState();

    const accepted = buildFabRulesView(state);
    expect(buildFabRulesView(state)).toBe(accepted);

    const desired = buildFabDesiredRulesView(state);
    expect(buildFabDesiredRulesView(state)).toBe(desired);
    expect(desired).not.toBe(accepted);

    invalidateFabRulesViews(state);
    expect(buildFabRulesView(state)).not.toBe(accepted);
  });

  it("drops a cached view when an event or checkpoint generation changes", () => {
    const state = FabTestEngine.start({ hero: bravo, deck: 4 }, { hero: dash, deck: 4 }).getState();
    const initial = buildFabRulesView(state);

    state.counters.event += 1;
    const afterEvent = buildFabRulesView(state);
    expect(afterEvent).not.toBe(initial);

    state.counters.checkpoint += 1;
    expect(buildFabRulesView(state)).not.toBe(afterEvent);
  });
});
