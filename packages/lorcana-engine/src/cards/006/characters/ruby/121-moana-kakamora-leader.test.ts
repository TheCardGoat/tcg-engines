/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  flotillaCoconutArmada,
  kakamoraBoardingParty,
  kakamoraLongrangeSpecialist,
  kakamoraPiratePitcher,
  moanaKakamoraLeader,
} from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Moana - Kakamora Leader", () => {
  it("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Moana.)", async () => {
    const testEngine = new TestEngine({
      play: [moanaKakamoraLeader],
    });

    const cardUnderTest = testEngine.getCardModel(moanaKakamoraLeader);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("GATHERING FORCES When you play this character, you may move any number of your characters to the same location for free. Gain 1 lore for each character you moved.", async () => {
    const testEngine = new TestEngine({
      inkwell: moanaKakamoraLeader.cost,
      hand: [moanaKakamoraLeader],
      play: [
        kakamoraLongrangeSpecialist,
        kakamoraPiratePitcher,
        kakamoraBoardingParty,
        flotillaCoconutArmada,
      ],
    });

    await testEngine.playCard(moanaKakamoraLeader);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack(
      {
        targets: [
          kakamoraLongrangeSpecialist,
          kakamoraPiratePitcher,
          kakamoraBoardingParty,
          moanaKakamoraLeader,
        ],
      },
      true,
    );
    await testEngine.resolveTopOfStack({ targets: [flotillaCoconutArmada] });

    expect(
      testEngine.getCardModel(flotillaCoconutArmada).charactersAtLocation,
    ).toHaveLength(4);
    expect(testEngine.getLoreForPlayer("player_one")).toBe(4);
  });
});
