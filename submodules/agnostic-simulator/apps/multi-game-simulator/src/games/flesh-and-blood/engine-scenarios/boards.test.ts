import { catalogIds } from "@tcg/flesh-and-blood-engine/simulator";
import { describe, expect, it } from "vitest";
import { getFabEngineScenario } from "./index";

describe("FAB engine scenarios · boards", () => {
  it("opens the turn announcement lab with an authored pitch stack and pass-only opponent", () => {
    const scenario = getFabEngineScenario("phase-turn-announcement-lab");
    const match = scenario?.boot();
    if (!scenario || !match) throw new Error("Missing turn announcement lab scenario.");

    const state = match.runtime.getState();
    const pitch = state.containers.zonesByPlayerId[match.player1Id]?.pitch ?? [];
    const pitchCanonicalIds = pitch.map((instanceId) => state.objects[instanceId]?.canonicalId);

    expect(scenario.viewerId).toBe(match.player1Id);
    expect(scenario.botMode).toBe("pass-only");
    expect(match.runtime.waitState()).toMatchObject({
      kind: "priority",
      playerId: match.player1Id,
    });
    expect(pitchCanonicalIds).toEqual([catalogIds.disable, catalogIds.disable]);
  });

  it("materializes numeric decks as real Generic Nimblism Blue cards", () => {
    const match = getFabEngineScenario("dual-target-open")?.boot();
    if (!match) throw new Error("Missing dual-target open scenario.");

    const state = match.runtime.getState();
    for (const playerId of [match.player1Id, match.player2Id]) {
      const deck = state.containers.zonesByPlayerId[playerId]?.deck ?? [];
      expect(deck).toHaveLength(8);
      expect(deck.map((instanceId) => state.objects[instanceId]?.canonicalId)).toEqual(
        Array(8).fill(catalogIds.nimblismBlue),
      );
    }
  });
});
