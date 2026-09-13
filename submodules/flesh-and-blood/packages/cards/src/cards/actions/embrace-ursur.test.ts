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
import { embraceUrsur } from "./embrace-ursur.ts";
import { boundingDemigonBlue } from "./bounding-demigon.ts";
import { runicReavingBlue } from "./runic-reaving.ts";
import { hellboundAssaultRed } from "./hellbound-assault.ts";
describe("Embrace Ursur preview behavior", () => {
  const choices = [
    { card: boundingDemigonBlue, runechants: 1, goAgain: true },
    { card: runicReavingBlue, runechants: 1, goAgain: false },
    { card: hellboundAssaultRed, runechants: 0, goAgain: true },
    { card: brutalAssaultBlue, runechants: 0, goAgain: false },
  ];
  for (const [color, card] of Object.entries(embraceUrsur.cards)) {
    for (const choice of choices) {
      it(`${color}: banishing ${choice.card.slug} applies its matching benefits`, () => {
        const game = FabTestEngine.start(
          { hero: chane, hand: [card, choice.card], resourcePoints: 4, deck: 6 },
          { hero: dash, hand: [], deck: 6 },
          FAB_MANUAL_HARNESS,
        );
        const player = game.as(chane);
        player.play(card);
        game.advanceUntil({ stopAt: "defend", optionals: "accept", entityTargets: "maximum" });
        expectFabCard(player, choice.card).toBeBanished();
        expectFabPlayer(player).toHaveTokenCount("runechant", choice.runechants);
        if (choice.goAgain) expectCombat(game).toHaveKeyword("go-again");
        else expectCombat(game).notToHaveKeyword("go-again");
        game.closeCombat();
        expectFabPlayer(player).toHaveAP(choice.goAgain ? 1 : 0);
      });
    }
    it(`${color}: declining keeps the card and grants neither benefit`, () => {
      const game = FabTestEngine.start(
        { hero: chane, hand: [card, boundingDemigonBlue], resourcePoints: 4, deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const player = game.as(chane);
      player.play(card);
      game.advanceUntil({ stopAt: "defend", optionals: "decline" });
      expectFabCard(player, boundingDemigonBlue).toBeIn("hand");
      expectFabPlayer(player).toHaveTokenCount("runechant", 0);
      expectCombat(game).notToHaveKeyword("go-again");
    });
  }
});
