import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { astraSight } from "./astra-sight.ts";
import { dawnsReversal } from "./dawns-reversal.ts";
import { potionInfusionStarlight } from "./potion-infusion-starlight.ts";

/** @covers 6qsesw2ugm-a1 */
describe("Potion Infusion: Starlight — Class Bonus Starcalling", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "can" : "cannot"} be starcalled for one when Class Bonus=${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
        potionInfusionStarlight,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [potionOfHealing],
            hand: [astraSight, woodlandSquirrels],
            "main-deck": [
              potionInfusionStarlight,
              potionInfusionStarlight,
              potionInfusionStarlight,
            ],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      player.activate(astraSight);
      passEffectsStack(game);
      const decision = game.state.decision;
      if (decision?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
      const cardId = decision.cardIds[0]!;
      const answer = {
        kind: "starcall" as const,
        cardId,
        bottom: [],
        targets: { "target-1": [player.card(potionOfHealing).objectId] },
        reservePayment: [
          {
            kind: "card" as const,
            cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId,
          },
        ],
      };
      if (!classBonus) {
        expect(() => answerDecision(game, "resolve-glimpse", answer)).toThrow();
        return;
      }
      answerDecision(game, "resolve-glimpse", answer);
      expect(game.state.objects[cardId]!.activationStates.has("starcalled")).toBe(true);
    });
  }
});

/** @covers 6qsesw2ugm-a2 */
describe("Potion Infusion: Starlight — granted sacrifice trigger", () => {
  it("rests a Potion and gives its champion four levels when that Potion is sacrificed", () => {
    const champion = createClassBonusTestChampion(
      potionInfusionStarlight,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [potionOfHealing],
          hand: [
            potionInfusionStarlight,
            dawnsReversal,
            ...Array.from({ length: 7 }, () => woodlandSquirrels),
          ],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const potion = player.card(potionOfHealing);
    const payments = player.cards(woodlandSquirrels, { zone: "hand" });
    player.activate(potionInfusionStarlight, {
      targets: { "target-1": [potion.objectId] },
      reservePayment: payments.slice(0, 3).map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.objects[potion.objectId]!.states.has("rested")).toBe(true);
    player.activateAbility(potion, "qtb31x97n2-a2");
    passEffectsStack(game);

    const target = game.player("player-two").card(champion);
    player.activate(dawnsReversal, {
      targets: { "target-1": [target.objectId] },
      reservePayment: payments.slice(3).map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    const glimpse = game.state.decision;
    if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
    answerDecision(game, "resolve-glimpse", { kind: "reorder", top: glimpse.cardIds, bottom: [] });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(4);
  });
});
