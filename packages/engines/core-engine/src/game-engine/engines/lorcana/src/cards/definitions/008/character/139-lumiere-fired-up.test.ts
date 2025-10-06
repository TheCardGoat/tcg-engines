/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  atlanteanCrystal,
  bellesFavoriteBook,
  lumiereFiredUp,
  televisionSet,
  tinkerBellInsistentFairy,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Lumiere - Fired Up", () => {
  it("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lumiere.)", async () => {
    const testEngine = new TestEngine({
      play: [lumiereFiredUp],
    });

    const cardUnderTest = testEngine.getCardModel(lumiereFiredUp);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("Evasive", async () => {
    const testEngine = new TestEngine({
      play: [lumiereFiredUp],
    });

    await testEngine.playCard(lumiereFiredUp);
    const cardUnderTest = testEngine.getCardModel(lumiereFiredUp);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("SACREBLEU!: Whenever one of your items is banished, this character gets +1 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      play: [
        lumiereFiredUp,
        tinkerBellInsistentFairy,
        atlanteanCrystal,
        bellesFavoriteBook,
        televisionSet,
      ],
    });

    // Verify that limier has 2 {L} at the start
    await testEngine.playCard(lumiereFiredUp);
    const cardUnderTest = testEngine.getCardModel(lumiereFiredUp);
    expect(cardUnderTest.lore).toBe(2);

    // Banish one of the items
    await testEngine.getCardModel(atlanteanCrystal).banish();
    // await testEngine.acceptOptionalAbility();
    expect(cardUnderTest.lore).toBe(3);

    // Banish another item
    await testEngine.getCardModel(bellesFavoriteBook).banish();
    expect(cardUnderTest.lore).toBe(4);

    // Banish the last item
    await testEngine.getCardModel(televisionSet).banish();
    expect(cardUnderTest.lore).toBe(5);

    // Banish tinker bell (verify that it does not increase lore)
    await testEngine.getCardModel(tinkerBellInsistentFairy).banish();
    expect(cardUnderTest.lore).toBe(5);
  });
});
