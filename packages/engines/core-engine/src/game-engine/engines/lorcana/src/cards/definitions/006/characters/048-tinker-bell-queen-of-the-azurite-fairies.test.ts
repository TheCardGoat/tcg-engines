/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { tinkerBellQueenOfTheAzuriteFairies } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Tinker Bell - Queen of the Azurite Fairies", () => {
  it("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Tinker Bell.)", async () => {
    const testEngine = new TestEngine({
      play: [tinkerBellQueenOfTheAzuriteFairies],
    });

    const cardUnderTest = testEngine.getCardModel(
      tinkerBellQueenOfTheAzuriteFairies,
    );
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [tinkerBellQueenOfTheAzuriteFairies],
    });

    const cardUnderTest = testEngine.getCardModel(
      tinkerBellQueenOfTheAzuriteFairies,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it.skip("SHINING EXAMPLE Whenever this character quests, your other Fairy characters get +1 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: tinkerBellQueenOfTheAzuriteFairies.cost,
      play: [tinkerBellQueenOfTheAzuriteFairies],
      hand: [tinkerBellQueenOfTheAzuriteFairies],
    });

    await testEngine.playCard(tinkerBellQueenOfTheAzuriteFairies);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
