import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "./test-engine.ts";
import { setFabFixtureObjectSetup } from "./test-fixtures.ts";
import { bravo, dash, cintariSellsword, nimblismBlue } from "../rules/fixtures.ts";

// Harness contract only: inspect the exact setup record, never card behavior coverage.
describe("declarative fixture ownership", () => {
  it.each(["player-1", "player-2"])(
    "keeps opponent ownership stable when setup repeats for %s",
    (seat) => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          hand: [],
          arena: [{ card: cintariSellsword, state: { owner: "opponent" } }],
          deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        },
        {
          hero: dash,
          hand: [],
          arena: [{ card: cintariSellsword, state: { owner: "opponent" } }],
          deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        },
      );
      const state = game.getState();
      const instanceId = state.containers.zonesByPlayerId[seat]!.arena[0]!;
      const opposite = seat === "player-1" ? "player-2" : "player-1";
      const originalIncarnation = state.objects[instanceId]!.incarnation;
      expect(state.objects[instanceId]!.ownerId).toBe(opposite);

      // Reapplying the same declaration must not toggle ownership on any call.
      for (let attempt = 0; attempt < 3; attempt += 1) {
        setFabFixtureObjectSetup(state, instanceId, { owner: "opponent" });
        expect(state.objects[instanceId]!.ownerId).toBe(opposite);
      }
      expect(state.objects[instanceId]!.incarnation).toBe(originalIncarnation);
      expect(state.containers.zonesByPlayerId[seat]!.arena).toContain(instanceId);
      expect(state.containers.zonesByPlayerId[opposite]!.arena).not.toContain(instanceId);
    },
  );
});
