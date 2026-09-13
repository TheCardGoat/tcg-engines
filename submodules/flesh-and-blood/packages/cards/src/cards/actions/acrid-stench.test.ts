import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { acridStench } from "./acrid-stench.ts";
import { corruptedCorpse } from "./corrupted-corpse.ts";
import { restlessClericRed } from "./restless-cleric.ts";
import { malice } from "../heroes/malice.ts";

describe("Acrid Stench AAA", () => {
  for (const [color, card] of Object.entries(acridStench.cards)) {
    for (const pay of [true, false]) {
      it(`${color}: ${pay ? "discarding" : "keeping"} the zombie ${pay ? "creates" : "does not create"} a Corrupted Corpse in banished`, () => {
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
        expectFabCard(player, restlessClericRed).toBeIn(pay ? "graveyard" : "hand");
        if (pay) {
          expectFabCard(player, corruptedCorpse).toBeBanished();
        } else {
          expect(player.cardsIn("banished", corruptedCorpse)).toHaveLength(0);
        }
        game.closeCombat();
        expectFabPlayer(player).toHaveAP(1);
      });
    }
  }
});
