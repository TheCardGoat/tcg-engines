import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { conjureDownpour } from "./conjure-downpour.ts";

/** @covers r0zadf9q1w-a1 */
describe("Conjure Downpour — turn-long attack penalty", () => {
  it("reduces every unit attack declared after it resolves by two power", () => {
    const champion = createClassBonusTestChampion(conjureDownpour, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [conjureDownpour, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          field: [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const target = game.player("player-two").card(champion, { zone: "field" });
    player.activate(conjureDownpour, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);

    for (const attacker of player.cards(woodlandSquirrels, { zone: "field" })) {
      player.declareAttack(attacker, target);
      game.resolveCombatWithoutRetaliation();
    }
    expect(game.state.objects[target.objectId]!.damage).toBe(0);
  });
});

/** @covers r0zadf9q1w-a2 */
describe("Conjure Downpour — Class Bonus memory draw", () => {
  for (const [classMatches, initialMemory, expectedMemory] of [
    [true, 1, 5],
    [true, 0, 3],
    [false, 1, 4],
  ] as const) {
    it(`class match=${classMatches}, memory after payment=${initialMemory + 3}`, () => {
      const champion = createClassBonusTestChampion(
        conjureDownpour,
        classMatches,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [conjureDownpour, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            memory: Array.from({ length: initialMemory }, () => woodlandSquirrels),
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      player.activate(conjureDownpour, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      });
      passEffectsStack(game);
      expect(player.zone("memory")).toHaveLength(expectedMemory);
    });
  }
});
