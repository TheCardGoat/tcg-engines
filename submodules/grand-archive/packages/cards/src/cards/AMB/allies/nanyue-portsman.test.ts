import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { nanyuePortsman } from "./nanyue-portsman.ts";

/** @covers v5ppxyu1jm-a2 */
describe("Nanyue Portsman — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: nanyuePortsman });
});

/** @covers v5ppxyu1jm-a1 */
describe("Nanyue Portsman — Equestrian power", () => {
  for (const horse of [false, true]) {
    it(`attacks for ${horse ? 2 : 1} with a Horse ally=${horse}`, () => {
      const champion = createClassBonusTestChampion(nanyuePortsman, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { field: horse ? [nanyuePortsman, galesMare] : [nanyuePortsman] },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const target = game.player("player-two").card(champion, { zone: "field" });
      player.declareAttack(player.card(nanyuePortsman, { zone: "field" }), target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(horse ? 2 : 1);
    });
  }
});
