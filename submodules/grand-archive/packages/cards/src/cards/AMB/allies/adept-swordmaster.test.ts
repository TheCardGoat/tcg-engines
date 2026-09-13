import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { adeptSwordmaster } from "./adept-swordmaster.ts";

/** @covers txgvf6xpkq-a2 */
describe("Adept Swordmaster — Class Bonus weapon power", () => {
  for (const classBonus of [false, true]) {
    it(`wielded Training Sword deals ${classBonus ? 2 : 1} with Class Bonus ${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
        adeptSwordmaster,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { field: [adeptSwordmaster, trainingSword] } },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const target = opponent.card(champion, { zone: "field" });
      player.declareAttack(player.card(champion, { zone: "field" }), target, {
        weaponIds: [player.card(trainingSword, { zone: "field" }).objectId],
      });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(classBonus ? 2 : 1);
    });
  }
});
