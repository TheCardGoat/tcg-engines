import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theHornedKingWickedRuler } from "./036-the-horned-king-wicked-ruler";

const fragileAlly = createMockCharacter({
  id: "horned-king-wicked-fragile-ally",
  name: "Fragile Ally",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const strongAttacker = createMockCharacter({
  id: "horned-king-wicked-strong-attacker",
  name: "Strong Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
  lore: 1,
});

const handCard = createMockCharacter({
  id: "horned-king-wicked-hand-card",
  name: "Hand Card",
  cost: 1,
  lore: 1,
});

describe("The Horned King - Wicked Ruler", () => {
  it("has Shift keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: theHornedKingWickedRuler }],
    });

    expect(testEngine.asPlayerOne().getCardZone(theHornedKingWickedRuler)).toBe("play");
  });

  it("ARISE! - when ally is banished in a challenge, may return it to hand then discard a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: theHornedKingWickedRuler }, { card: fragileAlly, exerted: true }],
        hand: [handCard],
      },
      {
        play: [{ card: strongAttacker }],
      },
    );

    // Pass turn so player two gets priority
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Player two challenges the fragile ally (banishing it)
    const result = testEngine.asPlayerTwo().challenge(strongAttacker, fragileAlly);
    expect(result).toBeSuccessfulCommand();

    // The fragile ally should be banished
    expect(testEngine.asPlayerOne().getCardZone(fragileAlly)).toBe("discard");

    // ARISE! trigger should be in the bag for player one
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Resolve optional ability (choose to return ally to hand)
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(theHornedKingWickedRuler, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    // Fragile ally should now be in hand
    expect(testEngine.asPlayerOne().getCardZone(fragileAlly)).toBe("hand");

    // Now must discard a card - choose handCard
    const handCardId = testEngine.findCardInstanceId(handCard, "hand", "player_one");
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [handCardId] }),
    ).toBeSuccessfulCommand();

    // handCard should be discarded
    expect(testEngine.asPlayerOne().getCardZone(handCard)).toBe("discard");
    // fragile ally returned to hand
    expect(testEngine.asPlayerOne().getCardZone(fragileAlly)).toBe("hand");
  });

  it("ARISE! - can skip the optional ability, ally stays banished, no discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: theHornedKingWickedRuler }, { card: fragileAlly, exerted: true }],
        hand: [handCard],
      },
      {
        play: [{ card: strongAttacker }],
      },
    );

    // Pass turn so player two gets priority
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Player two challenges the fragile ally
    const result = testEngine.asPlayerTwo().challenge(strongAttacker, fragileAlly);
    expect(result).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(fragileAlly)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Skip the optional ability
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(theHornedKingWickedRuler, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    // Ally stays in discard, hand card unchanged
    expect(testEngine.asPlayerOne().getCardZone(fragileAlly)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(handCard)).toBe("hand");
  });

  it("ARISE! - does not trigger when a character is banished outside of challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: theHornedKingWickedRuler }, { card: fragileAlly }],
      },
      {},
    );

    // Manually set lethal damage on ally (not via challenge)
    expect(testEngine.asServer().manualSetDamage(fragileAlly, 10)).toBeSuccessfulCommand();

    // No bag item should appear for the Horned King
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(fragileAlly)).toBe("discard");
  });
});
