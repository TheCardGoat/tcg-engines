import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { robinHoodEphemeralArcher } from "../characters";
import { mickeyMouseTrueFriend } from "../../001/characters";
import { timeToGo } from "./131-time-to-go";

describe("Time to Go!", () => {
  it("banishes the chosen character and draws 3 if it had a card under it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [timeToGo],
      inkwell: timeToGo.cost,
      deck: [
        mickeyMouseTrueFriend,
        mickeyMouseTrueFriend,
        mickeyMouseTrueFriend,
        mickeyMouseTrueFriend,
      ],
      play: [{ card: robinHoodEphemeralArcher, cardsUnder: [mickeyMouseTrueFriend] }],
    });

    expect(testEngine.asPlayerOne().playCardTo(timeToGo, robinHoodEphemeralArcher).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().getCardZone(robinHoodEphemeralArcher)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 3, deck: 1, discard: 3 });
  });

  it("banishes the chosen character and draws 2 if it had no cards under it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [timeToGo],
      inkwell: timeToGo.cost,
      deck: [mickeyMouseTrueFriend, mickeyMouseTrueFriend, mickeyMouseTrueFriend],
      play: [robinHoodEphemeralArcher],
    });

    expect(testEngine.asPlayerOne().playCardTo(timeToGo, robinHoodEphemeralArcher).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().getCardZone(robinHoodEphemeralArcher)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, deck: 1, discard: 2 });
  });
});
