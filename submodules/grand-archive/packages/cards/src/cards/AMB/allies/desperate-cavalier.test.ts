import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { desperateCavalier } from "./desperate-cavalier.ts";

/** @covers slmer06rku-a1 */
describe("Desperate Cavalier — Class Bonus low-influence exile activations", () => {
  for (const classBonus of [false, true]) {
    for (const lowInfluence of [false, true]) {
      it(`classBonus=${classBonus}, influence ${lowInfluence ? "<=4" : ">4"}`, () => {
        const champion = createClassBonusTestChampion(
          desperateCavalier,
          classBonus,
          "activation-discount",
        );
        const extraHand = lowInfluence ? [] : Array.from({ length: 5 }, () => woodlandSquirrels);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [desperateCavalier],
              hand: extraHand,
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ownChampion = player.card(champion, { zone: "field" });
        const deck = player.zone("main-deck");
        player.declareAttack(
          player.card(desperateCavalier, { zone: "field" }),
          opponent.card(champion, { zone: "field" }),
        );
        passEffectsStack(game);
        const shouldBanish = classBonus && lowInfluence;
        if (shouldBanish) {
          expect(game.state.objects[deck[0]!.objectId]!.zone).toBe("banishment");
          expect(game.state.objects[deck[1]!.objectId]!.zone).toBe("banishment");
          expect(game.state.objects[ownChampion.objectId]!.damage).toBe(0);
        } else {
          expect(player.zone("main-deck")).toEqual(deck);
        }
        game.resolveCombatWithoutRetaliation();
        if (shouldBanish) {
          const banished = player.cards(woodlandSquirrels, { zone: "banishment" })[0]!;
          player.execute({ move: "activate-card", cardId: banished.objectId });
          expect(game.state.objects[ownChampion.objectId]!.damage).toBe(2);
          passEffectsStack(game);
          expect(player.cards(woodlandSquirrels, { zone: "field" }).length).toBeGreaterThan(0);
        } else {
          const before = game.state;
          expect(() =>
            player.execute({ move: "activate-card", cardId: deck[0]!.objectId }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
      });
    }
  }
});
