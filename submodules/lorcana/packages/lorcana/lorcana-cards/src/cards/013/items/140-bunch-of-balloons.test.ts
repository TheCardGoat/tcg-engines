import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { breakCard } from "../../001";
import { bunchOfBalloons } from "./140-bunch-of-balloons";

const floatingLocation = createMockLocation({
  id: "bunch-of-balloons-floating-location",
  name: "Floating Location",
  cost: 2,
});

describe("Bunch of Balloons", () => {
  it("gives the chosen location of yours Evasive while this item is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bunchOfBalloons, breakCard],
      inkwell: bunchOfBalloons.cost + breakCard.cost,
      play: [floatingLocation],
    });

    const playerOne = testEngine.asPlayerOne();
    const playerTwo = testEngine.asPlayerTwo();

    expect(playerOne.playCard(bunchOfBalloons)).toBeSuccessfulCommand();
    expect(
      playerOne.resolvePendingByCard(bunchOfBalloons, {
        targets: [floatingLocation],
      }),
    ).toBeSuccessfulCommand();

    expect(playerOne.hasKeyword(floatingLocation, "Evasive")).toBe(true);

    expect(playerOne.passTurn()).toBeSuccessfulCommand();
    expect(playerTwo.hasKeyword(floatingLocation, "Evasive")).toBe(true);

    expect(playerTwo.passTurn()).toBeSuccessfulCommand();
    expect(playerOne.hasKeyword(floatingLocation, "Evasive")).toBe(true);

    expect(playerOne.playCard(breakCard, { targets: [bunchOfBalloons] })).toBeSuccessfulCommand();

    expect(playerOne.getCardZone(bunchOfBalloons)).toBe("discard");
    expect(playerOne.hasKeyword(floatingLocation, "Evasive")).toBe(false);
  });

  it("returns itself to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 3,
      play: [bunchOfBalloons],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(bunchOfBalloons, {
        ability: "OUT OF SIGHT",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(bunchOfBalloons)).toBe("hand");
  });
});
