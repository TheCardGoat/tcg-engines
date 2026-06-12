import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { fairyGodmothersWand } from "../../010/items/168-fairy-godmothers-wand";
import { getOut } from "./148-get-out";

describe("Get Out!", () => {
  it("banishes the chosen character and returns an item card from your discard to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [getOut],
        inkwell: getOut.cost,
        discard: [fairyGodmothersWand],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(getOut, {
        targets: [simbaProtectiveCub, fairyGodmothersWand],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(fairyGodmothersWand)).toBe("hand");
  });
});
