import { describe, it, expect } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { ursurTheSoulReaper } from "../tokens/ursur-the-soul-reaper.ts";
import { metisArchangelOfTenacity } from "../allies/metis-archangel-of-tenacity.ts";
import { chainsOfConsecrationYellow } from "./chains-of-consecration.ts";
describe("Chains of Consecration preview behavior", () => {
  for (const shadow of [true, false]) {
    it(`prevents ally damage and ${shadow ? "banishes the Shadow source face down" : "keeps the non-Shadow source"}`, () => {
      const ally = shadow ? ursurTheSoulReaper : metisArchangelOfTenacity;
      const game = FabTestEngine.start(
        {
          hero: dromai,
          hand: [chainsOfConsecrationYellow],
          arena: [ally],
          resourcePoints: 2,
          deck: 6,
        },
        { hero: dash, hand: [], life: 20, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const player = game.as(dromai);
      player.play(chainsOfConsecrationYellow);
      player.target(ally);
      game.untilIdle();
      player.activateAttack(ally);
      game.closeCombat();
      expectFabPlayer(game.as(dash)).toHaveLife(20);
      if (shadow)
        expect(
          game
            .committedEvents()
            .some(
              (event) =>
                event.name === "banish" &&
                event.data.object.canonicalId === ally.canonicalId &&
                event.data.faceDown === true,
            ),
        ).toBe(true);
      else expectFabCard(player, ally).toBeIn("arena");
    });
  }
});
