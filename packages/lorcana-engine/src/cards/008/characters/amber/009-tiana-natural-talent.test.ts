/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { hadesInfernalSchemer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { andThenAlongCameZeus } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
import {
  geneNicelandResident,
  mickeyMouseGiantMouse,
  tianaNaturalTalent,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Tiana - Natural Talent", () => {
  it("Singer 6 (This character counts as cost 6 to sing songs.)", async () => {
    const testEngine = new TestEngine({
      play: [tianaNaturalTalent],
    });

    const cardUnderTest = testEngine.getCardModel(tianaNaturalTalent);
    expect(cardUnderTest.hasSinger).toBe(true);
  });

  it("CAPTIVATING MELODY Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: tianaNaturalTalent.cost,
        play: [tianaNaturalTalent],
        hand: [andThenAlongCameZeus],
      },
      {
        play: [hadesInfernalSchemer, geneNicelandResident],
      },
    );

    const cardUnderTest = testEngine.getCardModel(tianaNaturalTalent);

    await testEngine.singSong({
      singer: cardUnderTest,
      song: andThenAlongCameZeus,
    });

    await testEngine.resolveTopOfStack({ targets: [hadesInfernalSchemer] });

    const target = testEngine.getCardModel(hadesInfernalSchemer);

    expect(target.damage).toBe(5);

    expect(target.strength).toBe(hadesInfernalSchemer.strength - 1);

    // State of the card when the song is sung or played
    expect(testEngine.getCardModel(geneNicelandResident).strength).toBe(
      geneNicelandResident.strength - 1,
    );

    testEngine.passTurn();

    // State of the card when the turn passes to the opponent
    expect(testEngine.getCardModel(geneNicelandResident).strength).toBe(
      geneNicelandResident.strength - 1,
    );

    testEngine.passTurn();

    // State of the card when the effect disappears
    expect(testEngine.getCardModel(geneNicelandResident).strength).toBe(
      geneNicelandResident.strength,
    );
  });
});

describe("Regression tests for Tiana - Natural Talent", () => {
  it("should not apply -1 {S} to characters that are not in play", async () => {
    const play = [
      hadesInfernalSchemer,
      goofyKnightForADay,
      mickeyMouseGiantMouse,
    ];
    const testEngine = new TestEngine(
      {
        inkwell: hakunaMatata.cost,
        play: [tianaNaturalTalent, tianaNaturalTalent, tianaNaturalTalent],
        hand: [hakunaMatata],
      },
      {
        play: play,
      },
    );

    await testEngine.playCard(hakunaMatata);

    await testEngine.resolveTopOfStack({}, true);
    for (const card of play) {
      const cardModel = testEngine.getCardModel(card);
      expect(cardModel.strength).toBe(card.strength - 1);
    }

    await testEngine.resolveTopOfStack({}, true);
    for (const card of play) {
      const cardModel = testEngine.getCardModel(card);
      expect(cardModel.strength).toBe(card.strength - 2);
    }

    await testEngine.resolveTopOfStack({}, true);
    for (const card of play) {
      const cardModel = testEngine.getCardModel(card);
      expect(cardModel.strength).toBe(card.strength - 3);
    }
  });
});
