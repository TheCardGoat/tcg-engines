import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fractalOfMana } from "../phantasias/fractal-of-mana.ts";
import { burstAsunder } from "./burst-asunder.ts";

/** @covers rzsr6aw4hz-a1 */
describe("Burst Asunder — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: burstAsunder, discount: 2 });
});

/** @covers rzsr6aw4hz-a2 */
describe("Burst Asunder — damage then optional Fractal sacrifice", () => {
  it("deals two, then two more for each sacrificed Fractal", () => {
    for (const sacrifice of [false, true]) {
      const champion = createClassBonusTestChampion(burstAsunder, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [burstAsunder, ...Array.from({ length: 2 }, () => woodlandSquirrels)],
            field: [fractalOfMana],
          },
        },
        playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const target = game.player("player-two").card(woodlandSquirrels, { zone: "field" });
      const fractal = player.card(fractalOfMana, { zone: "field" });
      player.activate(burstAsunder, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        targets: { "target-unit": [target.objectId] },
      });
      passEffectsStack(game);
      answerDecision(game, "resolve-effect-choice", sacrifice ? [fractal.objectId] : []);
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
      expect(player.cards(fractalOfMana, { zone: sacrifice ? "graveyard" : "field" })).toHaveLength(
        1,
      );
    }
  });
});
