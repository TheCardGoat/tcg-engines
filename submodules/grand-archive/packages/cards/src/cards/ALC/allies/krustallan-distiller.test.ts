import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { blightroot } from "../tokens/blightroot.ts";
import { krustallanDistiller } from "./krustallan-distiller.ts";

/** @covers c08c9htu9a-a1 */
describe("Krustallan Distiller — brewed Potion history", () => {
  for (const classBonus of [false, true]) {
    for (const preparation of ["none", "reserve", "brew", "previous-turn"] as const) {
      it(`Class Bonus=${classBonus}, Potion activation=${preparation}`, () => {
        const champion = createClassBonusTestChampion(
          krustallanDistiller,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                krustallanDistiller,
                potionOfHealing,
                ...Array.from({ length: 6 }, () => woodlandSquirrels),
              ],
              field: [fraysia, blightroot],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        if (preparation !== "none") {
          if (preparation === "reserve")
            player.activate(potionOfHealing, {
              reservePayment: player
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 3)
                .map((ref) => ({ kind: "card", cardId: ref.objectId })),
            });
          else
            player.activate(potionOfHealing, {
              activationMethod: "brew",
              brewIngredientIds: [player.card(fraysia).objectId, player.card(blightroot).objectId],
            });
          passEffectsStack(game);
          expect(player.cards(potionOfHealing, { zone: "field" })).toHaveLength(1);
        }
        if (preparation === "previous-turn") {
          advanceToRecollection(game, opponent.id);
          advanceToRecollection(game, player.id);
          for (let step = 0; game.state.turn.phase !== "main" && step < 16; step++) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
        }
        player.activate(krustallanDistiller, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        const memory = player.zone("memory");
        const hand = player.zone("hand");
        const deck = player.zone("main-deck");
        const opposingMemory = opponent.zone("memory");
        player.pass();
        opponent.pass();
        expect(player.cards(krustallanDistiller, { zone: "field" })).toHaveLength(1);
        expect(player.zone("memory")).toEqual(memory);
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "c08c9htu9a-a1",
          ),
        ).toBe(classBonus);
        passEffectsStack(game);
        const draws = classBonus && preparation === "brew";
        expect(player.zone("memory")).toEqual(draws ? [...memory, deck[0]] : memory);
        expect(player.zone("main-deck")).toEqual(draws ? deck.slice(1) : deck);
        expect(player.zone("hand")).toEqual(hand);
        expect(opponent.zone("memory")).toEqual(opposingMemory);
      });
    }
  }
});
