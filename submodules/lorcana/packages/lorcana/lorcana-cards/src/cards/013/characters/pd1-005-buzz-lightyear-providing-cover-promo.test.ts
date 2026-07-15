import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { buzzLightyearProvidingCoverPD1Promo } from "./pd1-005-buzz-lightyear-providing-cover-promo";

const toyFriend = createMockCharacter({
  id: "buzz-providing-cover-toy-friend",
  name: "Toy Friend",
  cost: 1,
  classifications: ["Storyborn", "Toy"],
});

const discardAction = createMockAction({
  id: "buzz-providing-cover-discard-action",
  name: "Discard Action",
  cost: 2,
});

const handAction = createMockAction({
  id: "buzz-providing-cover-hand-action",
  name: "Hand Action",
  cost: 2,
});

describe("Buzz Lightyear - Providing Cover", () => {
  it("returns a cheap action from discard and plays a cheap action for free when another Toy is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [buzzLightyearProvidingCoverPD1Promo, handAction],
      inkwell: buzzLightyearProvidingCoverPD1Promo.cost,
      play: [toyFriend],
      discard: [discardAction],
      deck: [],
    });

    expect(
      testEngine.asPlayerOne().playCard(buzzLightyearProvidingCoverPD1Promo),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(buzzLightyearProvidingCoverPD1Promo, {
        resolveOptional: true,
        targets: [discardAction],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(buzzLightyearProvidingCoverPD1Promo, {
        resolveOptional: true,
        targets: [handAction],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardAction)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(handAction)).toBe("discard");
  });
});
