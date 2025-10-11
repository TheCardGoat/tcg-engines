import { describe, expect, it } from "bun:test";
import {
  drFacilierSavvyOpportunist,
  madamMimRivalOfMerlin,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import { pegasusFlyingSteed } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Madam Mim - Rival of Merlin", () => {
  it("**GRUESOME AND GRIM** {E} − Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _They can challenge the turn they're played._'", async () => {
    const testEngine = new TestEngine(
      {
        hand: [drFacilierSavvyOpportunist],
        play: [madamMimRivalOfMerlin],
        deck: 1,
      },
      {
        deck: 2,
        play: [pegasusFlyingSteed],
      },
    );

    await testEngine.activateCard(madamMimRivalOfMerlin, {
      targets: [drFacilierSavvyOpportunist],
    });

    expect(testEngine.getCardModel(drFacilierSavvyOpportunist).hasRush).toBe(
      true,
    );

    await testEngine.passTurn();

    expect(testEngine.getCardModel(madamMimRivalOfMerlin).zone).toBe("play");
    expect(testEngine.getCardModel(pegasusFlyingSteed).zone).toBe("play");
    expect(testEngine.getCardModel(drFacilierSavvyOpportunist).zone).toBe(
      "discard",
    );
  });

  it("Shift", () => {
    const testEngine = new TestEngine({
      play: [madamMimRivalOfMerlin],
    });

    expect(testEngine.getCardModel(madamMimRivalOfMerlin).hasShift()).toBe(
      true,
    );
  });
});
