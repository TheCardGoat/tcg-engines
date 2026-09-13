import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { palaceGuard } from "../allies/palace-guard.ts";
import { liuBeiOathkeeper } from "../allies/liu-bei-oathkeeper.ts";
import { zhangFeiSpiritedSteel } from "../allies/zhang-fei-spirited-steel.ts";
import { mortalAmbition } from "./mortal-ambition.ts";

function payment(game: GrandArchiveTestEngine, count: number) {
  return game
    .player("player-one")
    .cards(woodlandSquirrels, { zone: "hand" })
    .slice(0, count)
    .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
}

/** @covers ymuarq5tv0-a1 */
describe("Mortal Ambition — unique ally discount", () => {
  it("costs two less for each unique ally and still requires the remainder", () => {
    const champion = createClassBonusTestChampion(mortalAmbition, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [mortalAmbition, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
          field: [liuBeiOathkeeper, zhangFeiSpiritedSteel],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const before = game.state;
    expect(() => player.activate(mortalAmbition, { reservePayment: payment(game, 1) })).toThrow();
    expect(game.state).toEqual(before);
    player.activate(mortalAmbition, { reservePayment: payment(game, 2) });
  });
});

/** @covers ymuarq5tv0-a2 */
describe("Mortal Ambition — Human and Horse ambush and steadfast", () => {
  it("gives Human allies +1 LIFE, ambush, and steadfast until end of turn", () => {
    const champion = createClassBonusTestChampion(mortalAmbition, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [mortalAmbition, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
          field: [palaceGuard],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [ferventBeastmaster],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const human = player.card(palaceGuard, { zone: "field" });
    opponent.pass();
    player.activate(mortalAmbition, { reservePayment: payment(game, 6) });
    passEffectsStack(game);
    opponent.declareAttack(opponent.card(ferventBeastmaster, { zone: "field" }), human);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[human.objectId]!.zone).toBe("field");
    expect(game.state.objects[human.objectId]!.damage).toBe(3);
  });
});
