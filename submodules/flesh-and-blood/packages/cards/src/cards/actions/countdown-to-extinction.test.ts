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
import { countdownToExtinction } from "./countdown-to-extinction.ts";
import { darkestHourRed } from "./darkest-hour.ts";
describe("Countdown to Extinction preview behavior", () => {
  for (const [color, card] of Object.entries(countdownToExtinction.cards)) {
    for (const search of [true, false]) {
      it(`${color}: creates a Gate on attack; ${search ? "accepts" : "declines"} the hit search`, () => {
        const game = FabTestEngine.start(
          {
            hero: chane,
            hand: [card],
            deck: [darkestHourRed, brutalAssaultBlue],
            resourcePoints: 5,
          },
          { hero: dash, hand: [], life: 20, deck: 6 },
          FAB_MANUAL_HARNESS,
        );
        const player = game.as(chane);
        const searched = player.cardIn("deck", darkestHourRed);
        player.playAttack(card);
        expectFabPlayer(player).toHaveTokenCount("gate-to-i-arathael", 1);
        game.closeCombat({ optionals: search ? "accept" : "decline", entityTargets: "maximum" });
        expectFabCard(player, searched).toBeIn(search ? "banished" : "deck");
      });
    }
  }
});
