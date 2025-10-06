/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { heiheiBoatSnack } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  boltDependableFriend,
  boltSuperdog,
  calhounCourageousRescuer,
  heiheiExpandedConsciousness,
  hiroHamadaArmorDesigner,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hiro Hamada - Armor Designer", () => {
  it("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Hiro Hamada.)", async () => {
    const testEngine = new TestEngine({
      play: [hiroHamadaArmorDesigner],
    });

    const cardUnderTest = testEngine.getCardModel(hiroHamadaArmorDesigner);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("YOU CAN BE WAY MORE Your Floodborn characters that have a card under them gain Evasive and Ward. (Only characters with Evasive can challenge them. Opponents can’t choose them except to challenge.)", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [
        hiroHamadaArmorDesigner,
        calhounCourageousRescuer,
        boltDependableFriend,
        heiheiBoatSnack,
      ],
      hand: [heiheiExpandedConsciousness, boltSuperdog],
    });

    await testEngine.shiftCard({
      shifted: heiheiBoatSnack,
      shifter: heiheiExpandedConsciousness,
    });
    await testEngine.shiftCard({
      shifted: boltDependableFriend,
      shifter: boltSuperdog,
    });

    const withoutCardUnder = [
      calhounCourageousRescuer,
      hiroHamadaArmorDesigner,
    ];

    for (const card of withoutCardUnder) {
      const cardUnderTest = testEngine.getCardModel(card);
      expect(cardUnderTest.hasEvasive).toBe(false);
      expect(cardUnderTest.hasWard).toBe(false);
    }

    const withCardUnder = [heiheiExpandedConsciousness, boltSuperdog];
    for (const card of withCardUnder) {
      const cardUnderTest = testEngine.getCardModel(card);
      expect(cardUnderTest.hasEvasive).toBe(true);
      expect(cardUnderTest.hasWard).toBe(true);
    }
  });
});
