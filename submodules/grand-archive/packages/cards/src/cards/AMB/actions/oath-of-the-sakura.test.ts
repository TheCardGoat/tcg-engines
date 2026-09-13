import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { guanYuPrimeExemplar } from "../allies/guan-yu-prime-exemplar.ts";
import { liuBeiOathkeeper } from "../allies/liu-bei-oathkeeper.ts";
import { zhangFeiSpiritedSteel } from "../allies/zhang-fei-spirited-steel.ts";
import { zhaoYunDragonsblood } from "../allies/zhao-yun-dragonsblood.ts";
import { oathOfTheSakura } from "./oath-of-the-sakura.ts";

function payment(game: GrandArchiveTestEngine) {
  return game
    .player("player-one")
    .cards(woodlandSquirrels, { zone: "hand" })
    .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
}

/** @covers vlno9ankzi-a1 */
describe("Oath of the Sakura — buff each controlled ally", () => {
  it("puts a buff counter on each ally you control", () => {
    const champion = createClassBonusTestChampion(oathOfTheSakura, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [oathOfTheSakura, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
          field: [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    player.activate(oathOfTheSakura, { reservePayment: payment(game) });
    passEffectsStack(game);
    for (const ally of player.cards(woodlandSquirrels, { zone: "field" })) {
      expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(1);
    }
    expect(
      game.state.objects[opponent.card(woodlandSquirrels, { zone: "field" }).objectId]!.counters
        .buff ?? 0,
    ).toBe(0);

    const attacker = player.cards(woodlandSquirrels, { zone: "field" })[0]!;
    player.declareAttack(attacker, opponent.card(champion, { zone: "field" }));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[opponent.card(champion, { zone: "field" }).objectId]!.damage).toBe(2);
  });
});

/** @covers vlno9ankzi-a2 */
describe("Oath of the Sakura — exactly three unique allies", () => {
  it("gives the unique trio +2 POWER only when there are exactly three unique allies", () => {
    for (const exactTrio of [false, true]) {
      const champion = createClassBonusTestChampion(oathOfTheSakura, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [oathOfTheSakura, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
            field: exactTrio
              ? [liuBeiOathkeeper, zhangFeiSpiritedSteel, zhaoYunDragonsblood]
              : [liuBeiOathkeeper, zhangFeiSpiritedSteel, zhaoYunDragonsblood, guanYuPrimeExemplar],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      player.activate(oathOfTheSakura, { reservePayment: payment(game) });
      passEffectsStack(game);
      const attacker = player.card(liuBeiOathkeeper, { zone: "field" });
      player.declareAttack(attacker, opponent.card(champion, { zone: "field" }));
      game.resolveCombatWithoutRetaliation();
      // Printed 2, plus buff counter, plus the unique-trio bonus when it applies.
      expect(game.state.objects[opponent.card(champion, { zone: "field" }).objectId]!.damage).toBe(
        exactTrio ? 5 : 3,
      );
    }
  });
});
