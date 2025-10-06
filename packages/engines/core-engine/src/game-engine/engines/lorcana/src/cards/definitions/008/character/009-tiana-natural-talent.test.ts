/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { hadesInfernalSchemer } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { hakunaMatata } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { andThenAlongCameZeus } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { underTheSea } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/095-under-the-sea";
import {
  geneNicelandResident,
  louieOneCoolDuck,
  mickeyMouseGiantMouse,
  theColonelOldSheepdog,
  tianaNaturalTalent,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";

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
  it("should NOT apply the str reduction before resolving the action cards (Under the sea interaction)", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: underTheSea.cost,
        play: [tianaNaturalTalent],
        hand: [underTheSea],
      },
      {
        play: [theColonelOldSheepdog, louieOneCoolDuck],
      },
    );

    await testEngine.playCard(underTheSea);

    // Char with 2 strength be sent to the bottom
    expect(testEngine.getCardModel(louieOneCoolDuck).zone).toBe("deck");
    // Char with 3 strength stay in play, as the -1 str is applied after the action is fully resolved
    expect(testEngine.getCardModel(theColonelOldSheepdog).zone).toBe("play");
    expect(testEngine.getCardModel(theColonelOldSheepdog).strength).toBe(
      theColonelOldSheepdog.strength - 1,
    );
  });

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

    // THe last effect is auto resolved, so we jump from -2 straight to -3
    // await testEngine.resolveTopOfStack({}, true);
    // for (const card of play) {
    //   const cardModel = testEngine.getCardModel(card);
    //   expect(cardModel.strength).toBe(card.strength - 2);
    // }

    await testEngine.resolveTopOfStack({}, true);
    for (const card of play) {
      const cardModel = testEngine.getCardModel(card);
      expect(cardModel.strength).toBe(card.strength - 3);
    }
  });
});
