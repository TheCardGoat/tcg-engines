import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli, healingGlow, tinkerBellPeterPansAlly } from "../../001";
import { developYourBrain } from "./163-develop-your-brain";

describe("Develop Your Brain", () => {
  it("looks at the top 2 cards, puts one into hand, and the other on the bottom of the deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [developYourBrain],
      inkwell: developYourBrain.cost,
      deck: [aladdinPrinceAli, tinkerBellPeterPansAlly, healingGlow],
    });

    expect(
      testEngine.asPlayerOne().playCard(developYourBrain, {
        destinations: [
          { zone: "hand", cards: tinkerBellPeterPansAlly },
          { zone: "deck-bottom", cards: aladdinPrinceAli },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(tinkerBellPeterPansAlly)).toBe("hand");
    const lastDeckCardId = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE).at(-1);

    expect(lastDeckCardId).toBeDefined();
    expect(testEngine.getCardDefinitionId(lastDeckCardId!)).toBe(aladdinPrinceAli.id);
  });
});
