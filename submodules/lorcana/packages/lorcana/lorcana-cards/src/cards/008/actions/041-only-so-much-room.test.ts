import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { onlySoMuchRoom } from "./041-only-so-much-room";

describe("Only So Much Room", () => {
  it("returns a chosen character with 2 strength or less and a character card from your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [onlySoMuchRoom],
        inkwell: onlySoMuchRoom.cost,
        discard: [mickeyMouseTrueFriend],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(onlySoMuchRoom, {
        targets: [simbaProtectiveCub, mickeyMouseTrueFriend],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseTrueFriend)).toBe("hand");
  });
});
