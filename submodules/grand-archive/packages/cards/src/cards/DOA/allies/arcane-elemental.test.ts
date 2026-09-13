import { arcaneSight } from "../actions/arcane-sight.ts";
import { proveCountedActivationDiscount } from "../../../testing/counted-activation-discount.ts";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { describe, expect, it } from "vitest";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { arcaneElemental } from "./arcane-elemental.ts";

/** @covers wFH1kBLrWh-a2 */
describe("Arcane Elemental \u2014 wFH1kBLrWh-a2", () => {
  provePrideAlly({ card: arcaneElemental, pride: 7, power: 7 });
});
/** @covers wFH1kBLrWh-a3 */
describe("Arcane Elemental's delayed banishment", () => {
  for (const attack of [true, false])
    it(`is banished at the next end phase only after attacking (${attack})`, () => {
      const champion = grantTestChampionLevel(
        createClassBonusTestChampion(arcaneElemental, false, "activation-discount"),
        7,
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { field: [arcaneElemental], "main-deck": [woodlandSquirrels] },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      if (attack) {
        p.declareAttack(arcaneElemental, q.card(champion));
        game.resolveCombatWithoutRetaliation();
      }
      expect(p.cards(arcaneElemental, { zone: "field" })).toHaveLength(1);
      advanceToMain(game, q.id);
      expect(p.cards(arcaneElemental, { zone: "banishment" })).toHaveLength(attack ? 1 : 0);
      expect(p.cards(arcaneElemental, { zone: "field" })).toHaveLength(attack ? 0 : 1);
    });
});

/** @covers wFH1kBLrWh-a1 */
describe("Arcane Elemental \u2014 resolution", () => {
  proveCountedActivationDiscount({
    card: arcaneElemental,
    cost: 7,
    qualifying: arcaneSight,
    zone: "banishment",
  });
});
