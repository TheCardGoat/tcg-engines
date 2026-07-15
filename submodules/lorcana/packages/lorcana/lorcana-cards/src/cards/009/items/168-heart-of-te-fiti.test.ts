import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { heartOfTeFiti } from "./168-heart-of-te-fiti";

const topDeckCard = createMockCharacter({
  id: "heart-of-te-fiti-top",
  name: "Heart of Te Fiti Top",
  cost: 1,
});

const secondDeckCard = createMockCharacter({
  id: "heart-of-te-fiti-second",
  name: "Heart of Te Fiti Second",
  cost: 1,
});

describe("Heart of Te Fiti", () => {
  it("puts the top card of your deck into your inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      deck: [topDeckCard, secondDeckCard],
      play: [heartOfTeFiti],
    });
    const topDeckId = testEngine.findCardInstanceId(topDeckCard, "deck", "player_one");
    const secondDeckId = testEngine.findCardInstanceId(secondDeckCard, "deck", "player_one");

    expect(testEngine.asPlayerOne().activateAbility(heartOfTeFiti)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).toBe("inkwell");
    expect(testEngine.asServer().getCard(topDeckId)).toEqual(
      expect.objectContaining({ zone: "inkwell", exerted: true }),
    );
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[topDeckId]?.publicFaceState,
    ).toBe("faceDown");
    expect(testEngine.asPlayerOne().getCardZone(secondDeckId)).toBe("deck");
  });
});
