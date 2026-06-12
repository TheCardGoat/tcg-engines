import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { princeJohnGreediestOfAll } from "../../002";
import { tritonsDecree } from "./199-tritons-decree";

describe("Triton's Decree", () => {
  it("lets the opponent choose one of their characters to take 2 damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [tritonsDecree],
        inkwell: tritonsDecree.cost,
      },
      {
        play: [simbaProtectiveCub, princeJohnGreediestOfAll],
      },
    );

    const princeJohnId = testEngine.findCardInstanceId(
      princeJohnGreediestOfAll,
      "play",
      "player_two",
    );

    expect(testEngine.asPlayerOne().playCard(tritonsDecree)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().resolveNextPending({
        targets: [princeJohnId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(princeJohnGreediestOfAll)).toBe("discard");
    expect(testEngine.asPlayerTwo().getDamage(simbaProtectiveCub)).toBe(0);
  });
});
