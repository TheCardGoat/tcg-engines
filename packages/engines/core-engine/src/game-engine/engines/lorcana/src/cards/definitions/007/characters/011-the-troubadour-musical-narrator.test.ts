/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { hadesInfernalSchemer } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { andThenAlongCameZeus } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { theTroubadourMusicalNarrator } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

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
