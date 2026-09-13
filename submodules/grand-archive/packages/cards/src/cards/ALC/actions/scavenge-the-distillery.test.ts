import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { temptationsFacade } from "../items/temptations-facade.ts";
import { scavengeTheDistillery } from "./scavenge-the-distillery.ts";

/** @covers rqtjot4nmx-a1 */
describe("scavenge-the-distillery — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: scavengeTheDistillery, discount: 1 });
});

/** @covers rqtjot4nmx-a2 */
describe("Scavenge the Distillery — return a Potion", () => {
  for (const choosePotion of [false, true]) {
    it(`${choosePotion ? "returns" : "declines to return"} the Potion from its controller's graveyard`, () => {
      const champion = createClassBonusTestChampion(
        scavengeTheDistillery,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            graveyard: [potionOfHealing, temptationsFacade, woodlandSquirrels],
            hand: [
              scavengeTheDistillery,
              potionOfHealing,
              ...Array.from({ length: 3 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { graveyard: [potionOfHealing], "main-deck": [woodlandSquirrels] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const action = player.card(scavengeTheDistillery, { zone: "hand" });
      const potion = player.card(potionOfHealing, { zone: "graveyard" });
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      if (choosePotion) {
        for (const invalid of [
          player.card(temptationsFacade, { zone: "graveyard" }),
          player.card(woodlandSquirrels, { zone: "graveyard" }),
          player.card(potionOfHealing, { zone: "hand" }),
          opponent.card(potionOfHealing, { zone: "graveyard" }),
        ]) {
          const before = game.state;
          expect(() =>
            player.activate(action, {
              reservePayment: payment,
              targets: { "target-card": [invalid.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
      }
      player.activate(action, {
        reservePayment: payment,
        targets: { "target-card": choosePotion ? [potion.objectId] : [] },
      });
      expect(game.state.objects[potion.objectId]!.zone).toBe("graveyard");
      passEffectsStack(game);
      expect(game.state.objects[potion.objectId]!.zone).toBe(choosePotion ? "hand" : "graveyard");
      expect(player.cards(potionOfHealing, { zone: "hand" })).toHaveLength(choosePotion ? 2 : 1);
      expect(opponent.zone("graveyard")).toEqual([
        opponent.card(potionOfHealing, { zone: "graveyard" }),
      ]);
    });
  }
});
