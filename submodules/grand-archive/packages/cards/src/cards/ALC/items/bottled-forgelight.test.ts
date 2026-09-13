import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";

import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { razorvine } from "../tokens/razorvine.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { springleaf } from "../tokens/springleaf.ts";
import { bottledForgelight } from "./bottled-forgelight.ts";

/** @covers g616r0zadf-a1 */
describe("bottled-forgelight — Brew", () => {
  proveBrewPotion({
    card: bottledForgelight,
    reserveCost: 3,
    ingredients: [razorvine, fraysia],
    wrongIngredients: [springleaf, fraysia],
  });
});

/** @covers g616r0zadf-a2 */
describe("Bottled Forgelight — brewed On Enter damage", () => {
  for (const brewed of [true, false]) {
    it(`deals two on a separate On Enter trigger only when brewed (${brewed})`, () => {
      const champion = createClassBonusTestChampion(bottledForgelight, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              bottledForgelight,
              ...Array.from({ length: brewed ? 0 : 3 }, () => woodlandSquirrels),
            ],
            field: brewed ? [razorvine, fraysia] : [],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const target = game.player("player-two").card(champion, { zone: "field" });
      player.activate(
        bottledForgelight,
        brewed
          ? {
              activationMethod: "brew",
              brewIngredientIds: [player.card(razorvine).objectId, player.card(fraysia).objectId],
            }
          : {
              reservePayment: player
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((ref) => ({ kind: "card", cardId: ref.objectId })),
            },
      );
      expect(game.state.objects[target.objectId]?.damage).toBe(0);
      passEffectsStack(game);
      expect(player.cards(bottledForgelight, { zone: "field" })).toHaveLength(1);
      expect(game.state.objects[target.objectId]?.damage).toBe(0);
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [target.objectId] },
      });
      expect(game.state.objects[target.objectId]?.damage).toBe(0);
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]?.damage).toBe(brewed ? 2 : 0);
      expect(game.state.objects[player.card(champion, { zone: "field" }).objectId]?.damage).toBe(0);
    });
  }
});

/** @covers g616r0zadf-a3 */
describe("Bottled Forgelight — sacrifice damage", () => {
  it("pays the sacrifice before dealing two damage to the chosen unit", () => {
    const champion = createClassBonusTestChampion(bottledForgelight, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [bottledForgelight] } },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const target = game.player("player-two").card(champion, { zone: "field" });
    player.activateAbility(bottledForgelight, "g616r0zadf-a3", {
      targets: { "target-1": [target.objectId] },
    });
    expect(player.cards(bottledForgelight, { zone: "field" })).toHaveLength(0);
    expect(game.state.objects[target.objectId]?.damage).toBe(0);
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]?.damage).toBe(2);
  });

  it("rejects a non-unit target before sacrificing the potion", () => {
    const champion = createClassBonusTestChampion(bottledForgelight, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [bottledForgelight, fraysia] } },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const before = game.state;
    expect(() =>
      player.activateAbility(bottledForgelight, "g616r0zadf-a3", {
        targets: { "target-1": [player.card(fraysia).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});
