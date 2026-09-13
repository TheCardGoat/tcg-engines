import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { flamewingFowl } from "./flamewing-fowl.ts";

/** @covers 59ueoujs9f-a1 */
describe("Flamewing Fowl — Class Bonus champion-attack power", () => {
  for (const classBonus of [false, true]) {
    for (const targetKind of ["champion", "ally"] as const) {
      it(`Class Bonus=${classBonus}, target=${targetKind}`, () => {
        const champion = createClassBonusTestChampion(
          flamewingFowl,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: { champion, zones: { field: [flamewingFowl] } },
          playerTwo: { champion, zones: { field: [giantTortoise] } },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const target =
          targetKind === "champion"
            ? opponent.card(champion, { zone: "field" })
            : opponent.card(giantTortoise, { zone: "field" });
        player.declareAttack(flamewingFowl, target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(
          classBonus && targetKind === "champion" ? 4 : 3,
        );
      });
    }
  }
});
