import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { heiheiBoatSnack, jasmineQueenOfAgrabah } from "../characters";
import { poisonedApple } from "./134-poisoned-apple";

describe("Poisoned Apple", () => {
  it("banishes a chosen Princess character instead of exerting them", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        play: [poisonedApple],
      },
      {
        play: [jasmineQueenOfAgrabah],
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(poisonedApple, {
      ability: "TAKE A BITE... 1",
      targets: [jasmineQueenOfAgrabah],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(poisonedApple)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(jasmineQueenOfAgrabah)).toBe("discard");
  });

  it("exerts a chosen non-Princess character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        play: [poisonedApple],
      },
      {
        play: [heiheiBoatSnack],
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(poisonedApple, {
      ability: "TAKE A BITE... 1",
      targets: [heiheiBoatSnack],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(poisonedApple)).toBe("discard");
    expect(testEngine.asPlayerTwo().isExerted(heiheiBoatSnack)).toBe(true);
    expect(testEngine.asPlayerTwo().getCardZone(heiheiBoatSnack)).toBe("play");
  });
});
