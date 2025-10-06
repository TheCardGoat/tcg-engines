/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { hakunaMatata } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import { aPiratesLife } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import {
  powerlineWorldsGreatestRockStar,
  rapunzelSunshine,
  stitchRockStar,
  theQueenRegalMonarch,
} from "~/game-engine/engines/lorcana/src/cards/definitions/009";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Powerline - World's Greatest Rock Star", () => {
  it("Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Powerline.)", async () => {
    const testEngine = new TestEngine({
      play: [powerlineWorldsGreatestRockStar],
    });

    const cardUnderTest = testEngine.getCardModel(
      powerlineWorldsGreatestRockStar,
    );
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("Singer 9", async () => {
    const testEngine = new TestEngine({
      play: [powerlineWorldsGreatestRockStar],
    });

    const cardUnderTest = testEngine.getCardModel(
      powerlineWorldsGreatestRockStar,
    );
    expect(cardUnderTest.hasSinger).toBe(true);
  });

  it("MASH-UP Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free. Put the rest on the bottom of your deck in any order.", async () => {
    const testEngine = new TestEngine({
      play: [powerlineWorldsGreatestRockStar],
      hand: [hakunaMatata],
      deck: [
        aPiratesLife,
        stitchRockStar,
        theQueenRegalMonarch,
        rapunzelSunshine,
      ],
    });

    await testEngine.singSong({
      singer: powerlineWorldsGreatestRockStar,
      song: hakunaMatata,
    });

    await testEngine.resolveTopOfStack({
      scry: {
        play: [aPiratesLife],
        bottom: [stitchRockStar, theQueenRegalMonarch, rapunzelSunshine],
      },
    });

    expect(testEngine.getCardModel(aPiratesLife).zone).toEqual("discard");
  });
});
