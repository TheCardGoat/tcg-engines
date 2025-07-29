import { describe, expect, it } from "bun:test";
import { aVeryMerryUnbirthday } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("A Very Merry Unbirthday", () => {
  it.skip("(A character with cost 1 or more can {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      inkwell: aVeryMerryUnbirthday.cost,
      play: [aVeryMerryUnbirthday],
      hand: [aVeryMerryUnbirthday],
    });

    await testEngine.playCard(aVeryMerryUnbirthday);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Each opponent puts the top 2 cards of their deck into their discard.", async () => {
    const testEngine = new TestEngine({
      inkwell: aVeryMerryUnbirthday.cost,
      play: [aVeryMerryUnbirthday],
      hand: [aVeryMerryUnbirthday],
    });

    await testEngine.playCard(aVeryMerryUnbirthday);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
