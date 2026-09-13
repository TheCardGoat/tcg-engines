import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { swervingSpring } from "./swerving-spring.ts";

function fixture(classBonus: boolean) {
  const champion = createClassBonusTestChampion(swervingSpring, classBonus, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: { hand: [swervingSpring, woodlandSquirrels, woodlandSquirrels] },
    },
    playerTwo: {
      champion,
      zones: { field: [automatedGardener, automatedGardener, woodlandSquirrels] },
    },
  });
  game.player("player-two").pass();
  return { game, champion };
}

/** @covers vj6vmuuldt-a1 */
describe("Swerving Spring — prevent the next 2 damage", () => {
  it("prevents two damage to the chosen unit and then expires", () => {
    const { game, champion } = fixture(false);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = player.card(champion, { zone: "field" });
    player.activate(swervingSpring, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    opponent.declareAttack(opponent.cards(automatedGardener, { zone: "field" })[0]!, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(0);
    opponent.declareAttack(opponent.card(woodlandSquirrels, { zone: "field" }), target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(1);
  });
});

/** @covers vj6vmuuldt-a2 */
describe("Swerving Spring — Class Bonus preparation counter", () => {
  it("puts a preparation counter on the champion only while Class Bonus is enabled", () => {
    for (const classBonus of [false, true]) {
      const { game, champion } = fixture(classBonus);
      const player = game.player("player-one");
      const target = player.card(champion, { zone: "field" });
      player.activate(swervingSpring, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.counters.preparation ?? 0).toBe(
        classBonus ? 1 : 0,
      );
    }
  });
});
