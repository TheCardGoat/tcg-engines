import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { merlinEnvisioningTheFuturePD1Promo } from "./pd1-007-merlin-envisioning-the-future-promo";

const bottomCard = createMockCharacter({
  id: "merlin-envisioning-bottom-card",
  name: "Bottom Card",
  cost: 1,
});

const topCard = createMockCharacter({
  id: "merlin-envisioning-top-card",
  name: "Top Card",
  cost: 1,
});

const banishMerlin = createMockAction({
  id: "merlin-envisioning-banish-action",
  name: "Banish Merlin",
  cost: 1,
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          cardTypes: ["character"],
          zones: ["play"],
        },
      },
    },
  ],
});

describe("Merlin - Envisioning the Future", () => {
  it("may draw the bottom card of your deck when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [merlinEnvisioningTheFuturePD1Promo],
      inkwell: merlinEnvisioningTheFuturePD1Promo.cost,
      deck: [bottomCard, topCard],
    });

    expect(
      testEngine.asPlayerOne().playCard(merlinEnvisioningTheFuturePD1Promo),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(merlinEnvisioningTheFuturePD1Promo, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(bottomCard)).toBe("hand");
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([topCard.id]);
  });

  it("puts himself from discard on the bottom of his owner's deck when banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [banishMerlin],
        inkwell: banishMerlin.cost,
        deck: [bottomCard],
      },
      {
        play: [merlinEnvisioningTheFuturePD1Promo],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(banishMerlin, {
        targets: [merlinEnvisioningTheFuturePD1Promo],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(merlinEnvisioningTheFuturePD1Promo),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(merlinEnvisioningTheFuturePD1Promo)).toBe("deck");
    expect(testEngine.getCardDefinitionIdsInZone("deck", "player_two")[0]).toBe(
      merlinEnvisioningTheFuturePD1Promo.id,
    );
  });
});
