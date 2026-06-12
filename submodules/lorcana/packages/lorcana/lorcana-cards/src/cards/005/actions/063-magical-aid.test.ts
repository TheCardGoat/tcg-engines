import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { magicalAid } from "./063-magical-aid";

describe("Magical Aid", () => {
  it("gives the chosen character Challenger +3 and returns them to hand if they are banished in a challenge this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [magicalAid],
        inkwell: magicalAid.cost,
        play: [{ card: simbaProtectiveCub, damage: 2 }],
      },
      {
        play: [{ card: mickeyMouseTrueFriend, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardTo(magicalAid, simbaProtectiveCub),
    ).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Challenger")).toBe(3);
    expect(testEngine.hasGrantedAbility(simbaProtectiveCub, "return-to-hand-when-banished")).toBe(
      true,
    );

    expect(
      testEngine.asPlayerOne().challenge(simbaProtectiveCub, mickeyMouseTrueFriend),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("discard");
  });
});
