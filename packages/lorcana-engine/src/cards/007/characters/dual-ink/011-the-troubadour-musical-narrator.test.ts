/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { hadesInfernalSchemer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { andThenAlongCameZeus } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
import { theTroubadourMusicalNarrator } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("The Troubadour - Musical Narrator", () => {
  it("Resist +1 (Damage dealt to this character is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      play: [theTroubadourMusicalNarrator],
    });

    const cardUnderTest = testEngine.getCardModel(theTroubadourMusicalNarrator);
    expect(cardUnderTest.hasResist).toBe(true);
  });

  it("Singer 4 (This character counts as cost 4 to sing songs.)", async () => {
    const testEngine = new TestEngine(
      {
        play: [theTroubadourMusicalNarrator],
        hand: [andThenAlongCameZeus],
      },
      {
        play: [hadesInfernalSchemer],
      },
    );

    const cardUnderTest = testEngine.getCardModel(theTroubadourMusicalNarrator);
    expect(cardUnderTest.hasSinger).toBe(true);

    await testEngine.singSong({
      singer: theTroubadourMusicalNarrator,
      song: andThenAlongCameZeus,
    });

    await testEngine.resolveTopOfStack({ targets: [hadesInfernalSchemer] });

    expect(testEngine.getCardModel(hadesInfernalSchemer).damage).toBe(5);
  });
});
