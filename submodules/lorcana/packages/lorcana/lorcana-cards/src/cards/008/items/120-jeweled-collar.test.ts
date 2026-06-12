import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jeweledCollar } from "./120-jeweled-collar";

const defendedCharacter = createMockCharacter({
  id: "jeweled-collar-defender",
  name: "Defended Character",
  cost: 2,
  willpower: 4,
});

const invadingAttacker = createMockCharacter({
  id: "jeweled-collar-attacker",
  name: "Invading Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const topDeckCard = createMockCharacter({
  id: "jeweled-collar-top-deck",
  name: "Top Deck Card",
  cost: 1,
});

describe("Jeweled Collar", () => {
  it("may put the top card of your deck into your inkwell facedown and exerted when one of your characters is challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [topDeckCard],
        play: [jeweledCollar, { card: defendedCharacter, exerted: true, isDrying: false }],
      },
      {
        play: [{ card: invadingAttacker, isDrying: false }],
      },
    );
    const topDeckId = testEngine.findCardInstanceId(topDeckCard, "deck", "player_one");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(invadingAttacker, defendedCharacter),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(jeweledCollar)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).toBe("inkwell");
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[topDeckId]?.publicFaceState,
    ).toBe("faceDown");
    expect(testEngine.asServer().getCard(topDeckId)?.exerted).toBe(true);
  });
});
