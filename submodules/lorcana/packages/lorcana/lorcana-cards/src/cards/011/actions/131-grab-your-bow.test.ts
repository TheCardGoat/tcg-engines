import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { heiheiBoatSnack, simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { grabYourBow } from "./131-grab-your-bow";

describe("Grab Your Bow", () => {
  it("banishes up to 2 chosen characters with 2 strength or less", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [grabYourBow],
        inkwell: grabYourBow.cost,
      },
      {
        play: [heiheiBoatSnack, simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(grabYourBow, {
        targets: [heiheiBoatSnack, simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(heiheiBoatSnack)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
  });

  it("can banish a single chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [grabYourBow],
        inkwell: grabYourBow.cost,
      },
      {
        play: [heiheiBoatSnack, simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(grabYourBow, {
        targets: [heiheiBoatSnack],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(heiheiBoatSnack)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("play");
  });

  it("can banish your own and opposing characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [grabYourBow],
        inkwell: grabYourBow.cost,
        play: [heiheiBoatSnack],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(grabYourBow, {
        targets: [heiheiBoatSnack, simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(heiheiBoatSnack)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
  });

  it("can choose zero targets when no characters with 2 strength or less are in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [grabYourBow],
        inkwell: grabYourBow.cost,
      },
      {
        play: [goofyKnightForADay],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(grabYourBow, {
        targets: [],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(goofyKnightForADay)).toBe("play");
  });
});
