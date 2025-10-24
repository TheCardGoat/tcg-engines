import { describe, expect, it } from "bun:test";
import { hiddenCoveTranquilHaven } from "~/game-engine/engines/lorcana/src/cards/definitions/009/locations/emerald/102-hidden-cove-tranquil-haven";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { maxGoofRockinTeen } from "./112-max-goof-rockin-teen";

describe("Max Goof - Rockin' Teen", () => {
  it("Singer 5 (This character counts as cost 5 to sing songs.)", async () => {
    const testEngine = new TestEngine({
      play: [maxGoofRockinTeen],
    });

    const cardUnderTest = testEngine.getCardModel(maxGoofRockinTeen);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });

  it("I JUST WANNA STAY HOME This character can't move to locations.", async () => {
    const testEngine = new TestEngine({
      inkwell: hiddenCoveTranquilHaven.moveCost,
      play: [maxGoofRockinTeen, hiddenCoveTranquilHaven],
    });

    const maxGoof = testEngine.getCardModel(maxGoofRockinTeen);
    const hiddenCove = testEngine.getCardModel(hiddenCoveTranquilHaven);

    expect(maxGoof.canEnterLocation(hiddenCove)).toBe(false);

    await testEngine.moveToLocation({
      location: hiddenCove,
      character: maxGoof,
      skipAssertion: true,
    });

    expect(maxGoof.isAtLocation(hiddenCove)).toBe(false);
  });
});
