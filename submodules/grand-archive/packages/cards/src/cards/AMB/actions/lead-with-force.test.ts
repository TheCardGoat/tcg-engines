import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { palaceGuard } from "../allies/palace-guard.ts";
import { leadWithForce } from "./lead-with-force.ts";

/** @covers yhu0djqlp8-a1 */
describe("Lead with Force — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: leadWithForce, discount: 1 });
});

/** @covers yhu0djqlp8-a2 */
describe("Lead with Force — life and Animal or Beast buff", () => {
  it("gives +1 LIFE and a buff counter only to Animal or Beast allies", () => {
    for (const animalOrBeast of [false, true]) {
      const champion = createClassBonusTestChampion(leadWithForce, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [leadWithForce, ...Array.from({ length: 2 }, () => woodlandSquirrels)],
            field: [animalOrBeast ? woodlandSquirrels : palaceGuard],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const ally = player.card(animalOrBeast ? woodlandSquirrels : palaceGuard, { zone: "field" });
      player.activate(leadWithForce, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        targets: { "target-1": [ally.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(animalOrBeast ? 1 : 0);
      if (animalOrBeast) {
        player.declareAttack(ally, opponent.card(champion, { zone: "field" }));
        game.resolveCombatWithoutRetaliation();
        expect(
          game.state.objects[opponent.card(champion, { zone: "field" }).objectId]!.damage,
        ).toBe(2);
      }
      advanceToMain(game, opponent.id);
      opponent.declareAttack(opponent.cards(woodlandSquirrels, { zone: "field" })[0]!, ally);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[ally.objectId]!.zone).toBe("field");
      expect(game.state.objects[ally.objectId]!.damage).toBe(1);
    }
  });
});
