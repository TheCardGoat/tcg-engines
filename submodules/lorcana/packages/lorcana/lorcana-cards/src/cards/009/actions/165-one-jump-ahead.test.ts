import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  arielOnHumanLegs,
  captainColonelsLieutenant,
  tinkerBellPeterPansAlly,
} from "../../001";
import { oneJumpAhead } from "./165-one-jump-ahead";

describe("One Jump Ahead", () => {
  it("puts the top card of your deck into your inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [oneJumpAhead],
      inkwell: [captainColonelsLieutenant, arielOnHumanLegs],
      deck: [aladdinPrinceAli, tinkerBellPeterPansAlly],
    });
    const aladdinId = testEngine.findCardInstanceId(aladdinPrinceAli, "deck", "p1");
    const tinkerBellId = testEngine.findCardInstanceId(tinkerBellPeterPansAlly, "deck", "p1");

    expect(testEngine.asPlayerOne().playCard(oneJumpAhead)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(aladdinId)).toBe("inkwell");
    expect(testEngine.asServer().getCard(aladdinId)).toEqual(
      expect.objectContaining({ zone: "inkwell", exerted: true }),
    );
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[aladdinId]?.publicFaceState,
    ).toBe("faceDown");
    expect(testEngine.asPlayerOne().getCardZone(tinkerBellId)).toBe("deck");
  });
});
