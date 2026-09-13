import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveDrawCardResolution } from "../../../testing/draw-card-resolution.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { regenerate } from "./regenerate.ts";

/** @covers v9ngjjadj4-a1 */
describe("Regenerate — Draw a card into memory", () => {
  proveDrawCardResolution({ card: regenerate, destination: "memory" });
});

function fixture(classBonus: boolean, damage: number) {
  const champion = createClassBonusTestChampion(regenerate, classBonus, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: {
        hand: [regenerate, woodlandSquirrels, woodlandSquirrels],
        "main-deck": [woodlandSquirrels],
      },
    },
    playerTwo: {
      champion,
      zones: { field: Array.from({ length: damage }, () => woodlandSquirrels) },
    },
  });
  const player = game.player("player-one");
  const opponent = game.player("player-two");
  const target = player.card(champion, { zone: "field" });
  for (const attacker of opponent.cards(woodlandSquirrels, { zone: "field" })) {
    opponent.declareAttack(attacker, target);
    game.resolveCombatWithoutRetaliation();
  }
  opponent.pass();
  return { game, player, champion, target };
}

/** @covers v9ngjjadj4-a2 */
describe("Regenerate — Class Bonus Damage 10+ Recover 2", () => {
  it("recovers two only with Class Bonus and at least ten damage", () => {
    for (const classBonus of [false, true]) {
      for (const damage of [9, 10]) {
        const { game, player, target } = fixture(classBonus, damage);
        expect(game.state.objects[target.objectId]!.damage).toBe(damage);
        player.activate(regenerate, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        });
        passEffectsStack(game);
        const recovered = classBonus && damage >= 10 ? 2 : 0;
        expect(game.state.objects[target.objectId]!.damage).toBe(damage - recovered);
      }
    }
  });
});
