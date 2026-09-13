import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../actions/reposition.ts";
import { harvestHerbs } from "../actions/harvest-herbs.ts";
import { potionOfHealing } from "./potion-of-healing.ts";

import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { silvershine } from "../tokens/silvershine.ts";
import { convalescentTonic } from "./convalescent-tonic.ts";

/** @covers l8ao8bls6g-a1 */
describe("convalescent-tonic — Brew", () => {
  proveBrewPotion({
    card: convalescentTonic,
    reserveCost: 3,
    ingredients: [fraysia],
    wrongIngredients: [silvershine],
  });
});

/** @covers l8ao8bls6g-a2 */
describe("Convalescent Tonic — optional cycling followed by Recover 3", () => {
  for (const count of [0, 1, 2]) {
    for (const damage of [0, 4]) {
      it(`cycles ${count} cards then recovers from ${damage} damage`, () => {
        const champion = createClassBonusTestChampion(
          convalescentTonic,
          true,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [convalescentTonic],
              hand: [woodlandSquirrels, reposition, harvestHerbs],
              "main-deck": [potionOfHealing, woodlandSquirrels, reposition],
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
        const hand = player.zone("hand");
        const deck = player.zone("main-deck");
        player.activateAbility(convalescentTonic, "l8ao8bls6g-a2");
        expect(player.cards(convalescentTonic, { zone: "graveyard" })).toHaveLength(1);
        expect(player.zone("hand")).toEqual(hand);
        expect(game.state.objects[target.objectId]?.damage).toBe(damage);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]?.damage).toBe(damage);
        const selected = hand.slice(0, count).reverse();
        answerDecision(
          game,
          "resolve-effect-choice",
          selected.map((card) => card.objectId),
        );
        passEffectsStack(game);
        expect(player.zone("hand")).toEqual([...hand.slice(count), ...deck.slice(0, count)]);
        expect(player.zone("main-deck")).toEqual([...deck.slice(count), ...selected]);
        expect(game.state.objects[target.objectId]?.damage).toBe(Math.max(0, damage - 3));
        expect(game.state.stack).toHaveLength(0);
      });
    }
  }
});
