import { describe, expect, it } from "bun:test";
import { clawhauserFrontDeskOfficer } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Clawhauser - Front Desk Officer", () => {
  it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine({
      play: [clawhauserFrontDeskOfficer],
    });

    const cardUnderTest = testEngine.getCardModel(clawhauserFrontDeskOfficer);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it.skip("Singer 4 (This character counts as cost 4 to sing songs.)", async () => {
    const testEngine = new TestEngine({
      play: [clawhauserFrontDeskOfficer],
    });

    const cardUnderTest = testEngine.getCardModel(clawhauserFrontDeskOfficer);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
