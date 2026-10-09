import { describe, expect, it } from "vitest";
import { createOpeningFixtureState } from "./fixtures";
import { getFabEngineScenario } from "./engineScenarios";
import { presentRuntime } from "./projection";
import { fabInteractionActorId } from "./interaction-actor";

describe("fabInteractionActorId", () => {
  it("uses priority rather than turn ownership or legal instant actions", () => {
    const state = {
      ...createOpeningFixtureState(),
      activePlayerId: "player-1",
      priorityPlayerId: "player-2",
    };
    expect(fabInteractionActorId(state, null)).toBe("player-2");
  });

  it("uses the defender while priority is closed for defense declaration", () => {
    const scenario = getFabEngineScenario("defend-open");
    if (!scenario) throw new Error("Missing defend-open scenario");
    const match = scenario.boot();
    const defenderId = match.runtime.getState().combat?.activeLink?.defendingPlayerId;
    if (!defenderId) throw new Error("Missing defender");
    const state = presentRuntime(match.runtime, defenderId);
    expect(state.priorityPlayerId).toBeNull();
    expect(fabInteractionActorId(state, null)).toBe(defenderId);
  });
});
