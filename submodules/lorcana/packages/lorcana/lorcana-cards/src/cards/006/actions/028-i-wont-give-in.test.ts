import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001/characters";
import { iWontGiveIn } from "./028-i-wont-give-in";

describe("I Won't Give In", () => {
  it("returns a character card with cost 2 or less from your discard to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [iWontGiveIn],
      inkwell: iWontGiveIn.cost,
      discard: [simbaProtectiveCub],
    });

    expect(
      testEngine.asPlayerOne().playCard(iWontGiveIn, { targets: [simbaProtectiveCub] }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, discard: 1 });
  });

  it("does not allow selecting a discarded character that costs more than 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [iWontGiveIn],
      inkwell: iWontGiveIn.cost,
      discard: [mickeyMouseTrueFriend],
    });

    testEngine.asPlayerOne().playCard(iWontGiveIn, { targets: [mickeyMouseTrueFriend] });

    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseTrueFriend)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(iWontGiveIn)).toBe("hand");
  });
});
