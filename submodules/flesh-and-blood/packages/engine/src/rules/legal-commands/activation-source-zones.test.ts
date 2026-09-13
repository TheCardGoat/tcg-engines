import { describe, expect, it } from "vite-plus/test";
import { fai } from "../../../../cards/src/cards/heroes/fai.ts";
import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { searingEmberblade } from "../../../../cards/src/cards/weapons/searing-emberblade.ts";
import { listLegalCommands } from "./index.ts";
import { FabTestEngine, FAB_MANUAL_HARNESS, expectFabPlayer } from "../../testing/index.ts";

// Public command contract: reserved/off-arena weapons must neither be offered
// nor accepted through direct dispatch (CR 1.7.4 and 1.7.4b).
describe("activation source zones", () => {
  for (const zone of ["inventory", "hand", "graveyard", "banished", "arsenal"] as const) {
    it(`rejects an ordinary weapon ability from ${zone}`, () => {
      const game = FabTestEngine.start(
        { hero: fai, [zone]: [searingEmberblade], resourcePoints: 2, deck: 6 },
        { hero: dash, life: 20, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const actor = game.as(fai);
      const instanceId = actor.findCardInZone(zone, searingEmberblade);
      const commands = listLegalCommands(game.getRuntime(), actor.id);
      expect(
        commands.some(
          (command) => command.move === "activate" && command.payload.instanceId === instanceId,
        ),
      ).toBe(false);
      const result = game.getRuntime().dispatch("activate", actor.id, { instanceId });
      expect(result.accepted).toBe(false);
      if (!result.accepted) expect(result.error).toMatch(/functional|legal zone/i);
    });
  }

  it("still resolves an equipped weapon attack", () => {
    const game = FabTestEngine.start(
      { hero: fai, weapon1: [searingEmberblade], resourcePoints: 2, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(fai).activate(searingEmberblade);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });
});
