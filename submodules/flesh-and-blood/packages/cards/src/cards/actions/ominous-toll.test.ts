import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { ominousToll } from "./ominous-toll.ts";
import { restlessClericRed } from "./restless-cleric.ts";
import { malice } from "../heroes/malice.ts";
describe("Ominous Toll preview behavior", () => {
  for (const [color, card] of Object.entries(ominousToll.cards)) {
    for (const pay of [true, false]) {
      it(`${color}: ${pay ? "discarding" : "keeping"} the zombie ${pay ? "creates" : "does not create"} a Gate`, () => {
        const game = FabTestEngine.start(
          { hero: malice, hand: [card, restlessClericRed], resourcePoints: 3, deck: 6 },
          { hero: dash, hand: [], life: 20, deck: 6 },
          FAB_MANUAL_HARNESS,
        );
        const player = game.as(malice);
        player.play(card);
        game.advanceUntil({
          stopAt: "defend",
          optionals: pay ? "accept" : "decline",
          entityTargets: "maximum",
        });
        expectFabPlayer(player).toHaveTokenCount("gate-to-i-arathael", pay ? 1 : 0);
        expectFabCard(player, restlessClericRed).toBeIn(pay ? "graveyard" : "hand");
        game.closeCombat();
        expectFabPlayer(player).toHaveAP(1);
      });
    }
  }
});
