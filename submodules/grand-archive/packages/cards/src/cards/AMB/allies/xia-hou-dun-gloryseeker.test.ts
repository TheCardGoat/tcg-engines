import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { intricateLongbow } from "../weapons/intricate-longbow.ts";
import { shardforgedBlade } from "../../P25/weapons/shardforged-blade.ts";
import { steelHalberd } from "../../P24/weapons/steel-halberd.ts";
import { xiaHouDunGloryseeker } from "./xia-hou-dun-gloryseeker.ts";

/** @covers gc18dq28my-a1 */
describe("Xia Hou Dun, Gloryseeker — Ranged 2", () => {
  proveRangedAlly({ card: xiaHouDunGloryseeker, power: 1, ranged: 2, classBonus: false });
});

/** @covers gc18dq28my-a2 */
describe("Xia Hou Dun, Gloryseeker — Class Bonus weapon power", () => {
  for (const classBonus of [false, true]) {
    for (const weapon of ["none", "bow", "sword", "polearm"] as const) {
      it(`Class Bonus=${classBonus}, weapon=${weapon}`, () => {
        const champion = createClassBonusTestChampion(
          xiaHouDunGloryseeker,
          classBonus,
          "activation-discount",
        );
        const weaponCard =
          weapon === "bow"
            ? intricateLongbow
            : weapon === "sword"
              ? shardforgedBlade
              : weapon === "polearm"
                ? steelHalberd
                : undefined;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: weaponCard ? [xiaHouDunGloryseeker, weaponCard] : [xiaHouDunGloryseeker],
            },
          },
          playerTwo: { champion, zones: { field: [intricateLongbow] } },
        });
        const player = game.player("player-one");
        const target = game.player("player-two").card(champion, { zone: "field" });
        player.declareAttack(xiaHouDunGloryseeker, target);
        game.resolveCombatWithoutRetaliation();
        const armed = weapon === "bow" || weapon === "sword";
        expect(game.state.objects[target.objectId]!.damage).toBe(classBonus && armed ? 2 : 1);
      });
    }
  }
});
