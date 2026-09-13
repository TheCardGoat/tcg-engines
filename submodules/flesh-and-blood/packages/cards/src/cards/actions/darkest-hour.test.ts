import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { darkestHour } from "./darkest-hour.ts";
import { boundingDemigonBlue } from "./bounding-demigon.ts";
describe("Darkest Hour preview behavior", () => {
  const bonuses = { red: 4, yellow: 3, blue: 1 } as const;
  for (const color of ["red", "yellow", "blue"] as const) {
    const card = darkestHour.cards[color];
    for (const shadow of [true, false]) {
      it(`${color}: boosts only the next Shadow attack (${shadow})`, () => {
        const attack = shadow ? boundingDemigonBlue : brutalAssaultBlue;
        const game = FabTestEngine.start(
          { hero: chane, hand: [card, attack], resourcePoints: 8, deck: 6 },
          { hero: dash, hand: [], life: 20, deck: 6 },
          FAB_MANUAL_HARNESS,
        );
        const player = game.as(chane);
        player.play(card);
        game.untilIdle({ optionals: "decline" });
        player.playAttack(attack);
        expectCombat(game).toHaveAttackPower(shadow ? 1 + bonuses[color] : 4);
        game.closeCombat();
        expectFabPlayer(game.as(dash)).toHaveLife(20 - (shadow ? 1 + bonuses[color] : 4));
      });
    }
    it(`${color}: the alternative cost puts a hand card on top without spending resources`, () => {
      const game = FabTestEngine.start(
        { hero: chane, hand: [card, brutalAssaultBlue], resourcePoints: 0, deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const player = game.as(chane);
      const paidCard = player.cardIn("hand", brutalAssaultBlue);
      player.play(card, { modeIds: ["pay"] });
      game.untilIdle({ optionals: "accept", entityTargets: "maximum" });
      expectFabCard(player, paidCard).toBeIn("deck");
      expectFabCard(player, card).toBeIn("graveyard");
      expectFabPlayer(player).toHaveResourceCount(0).toHaveAP(1);
    });
  }
});
