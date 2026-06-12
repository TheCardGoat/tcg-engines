import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { intoTheUnknown } from "./081-into-the-unknown";

describe("Into the Unknown", () => {
  it("puts the chosen exerted character into their player's inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [intoTheUnknown],
        inkwell: intoTheUnknown.cost,
      },
      {
        play: [simbaProtectiveCub],
        deck: 1,
      },
    );
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p2");

    testEngine.asServer().manualExertCard(simbaId);

    expect(
      testEngine.asPlayerOne().playCard(intoTheUnknown, {
        targets: [simbaId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(simbaId)).toBe("inkwell");
    expect(testEngine.asServer().getCard(simbaId)).toEqual(
      expect.objectContaining({ zone: "inkwell", exerted: true }),
    );
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[simbaId]?.publicFaceState,
    ).toBe("faceDown");
  });
});
