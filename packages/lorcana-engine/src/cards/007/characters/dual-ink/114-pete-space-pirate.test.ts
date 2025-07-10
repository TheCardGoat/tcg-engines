/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  kakamoraBandOfPirates,
  peteSpacePirate,
} from "@lorcanito/lorcana-engine/cards/007";
import {
  mickeyMouseGiantMouse,
  nothingWeWontDo,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Pete - Space Pirate", () => {
  it("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Pete.)", async () => {
    const testEngine = new TestEngine({
      play: [peteSpacePirate],
    });

    const cardUnderTest = testEngine.getCardModel(peteSpacePirate);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  describe("FRIGHTFUL SCHEME While this character is exerted, opposing characters can't exert to sing songs and your Pirate characters gain Resist +1. (Damage dealt to them is reduced by 1.)", () => {
    it("While this character is exerted, opposing characters can't exert to sing songs.", async () => {
      const testEngine = new TestEngine(
        {
          play: [peteSpacePirate],
        },
        {
          play: [kakamoraBandOfPirates],
        },
      );

      expect(testEngine.getCardModel(kakamoraBandOfPirates).hasVoiceless).toBe(
        false,
      );

      await testEngine.tapCard(peteSpacePirate);

      expect(testEngine.getCardModel(kakamoraBandOfPirates).hasVoiceless).toBe(
        true,
      );
    });

    it("While this character is exerted, your Pirate characters gain Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
      const testEngine = new TestEngine({
        play: [peteSpacePirate, kakamoraBandOfPirates],
      });

      expect(testEngine.getCardModel(kakamoraBandOfPirates).hasResist).toBe(
        false,
      );
      expect(testEngine.getCardModel(peteSpacePirate).hasResist).toBe(false);

      await testEngine.tapCard(peteSpacePirate);

      expect(testEngine.getCardModel(kakamoraBandOfPirates).hasResist).toBe(
        true,
      );
      expect(testEngine.getCardModel(peteSpacePirate).hasResist).toBe(true);
    });
  });
});

describe("Regression", () => {
  it("should apply resist to itself while challenging", async () => {
    const testEngine = new TestEngine(
      {
        play: [peteSpacePirate],
      },
      {
        play: [kakamoraBandOfPirates],
      },
    );

    await testEngine.challenge({
      attacker: peteSpacePirate,
      defender: kakamoraBandOfPirates,
      exertDefender: true,
    });

    expect(testEngine.getCardModel(peteSpacePirate).hasResist).toBe(true);
    expect(testEngine.getCardModel(peteSpacePirate).damage).toBe(
      kakamoraBandOfPirates.strength - 1,
    );
  });

  it("Should prevent Singing Together", async () => {
    const singers = [kakamoraBandOfPirates, mickeyMouseGiantMouse];
    const testEngine = new TestEngine(
      {
        hand: [nothingWeWontDo],
        play: singers,
      },
      {
        play: [peteSpacePirate],
      },
    );

    for (const singer of singers) {
      expect(testEngine.getCardModel(singer).hasVoiceless).toBe(false);
      expect(testEngine.getCardModel(singer).canSing).toBe(true);
    }

    await testEngine.tapCard(peteSpacePirate);

    for (const singer of singers) {
      expect(testEngine.getCardModel(singer).hasVoiceless).toBe(true);
      expect(testEngine.getCardModel(singer).canSing).toBe(false);
    }

    await testEngine.singSongTogether({
      song: nothingWeWontDo,
      singers: singers,
    });

    expect(testEngine.getCardModel(nothingWeWontDo).zone).toBe("hand");
  });
});
